class EntryManager {
  constructor() {
    this.entries = [];
  }

  addNew() {
    // Create new empty Entry
    const newPerson = new Entry({
      name: ["", "", ""],
      age: [null, null],
      sex: null,
      mother: {},
      father: {},
      spouse: {},
    });

    people.add(newPerson); // Add to manager

    // Load empty person into form
    window.currentPerson = newPerson; // Make globally accessible
    document.getElementById("formTitle").textContent = "Add New Entry";
    newPerson.loadForm(); // Load empty form for new entry

    document.getElementById("status").textContent =
      "✏️ Ready to add new person";
  }

  add(entry) {
    this.entries.push(entry);
    return this.entries;
  }

  all() {
    return this.entries;
  }

  find(query) {
    if (!query || typeof query !== "string") return [];

    const searchTerm = query.toLowerCase().trim();
    return this.entries.filter((entry) => {
      const fullName = entry.name
        ? entry.name.filter(Boolean).join(" ").toLowerCase()
        : "";
      return fullName.includes(searchTerm);
    });
  }

  load() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          // **NEW: Clear existing entries**
          this.entries = [];
          const entriesById = new Map();

          // First pass: create all entries
          data.forEach((entryData) => {
            const entry = new Entry(entryData);
            entriesById.set(entry.id, entry);
            this.entries.push(entry);
          });

          // Second pass: restore references by ID
          this.entries.forEach((entry) => {
            entry.mother = entriesById.get(entry.mother) || {};
            entry.father = entriesById.get(entry.father) || {};
            entry.spouse = entriesById.get(entry.spouse) || {};
          });

          console.log(
            `${this.entries.length} entries loaded (replaced existing)`,
          );
        } catch (error) {
          console.error("Invalid JSON:", error);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  showAll() {
    const idMap = new Map();
    this.entries.forEach((entry) => idMap.set(entry.id, entry));
    makeTree(people, people.entries[0]);
  }

  autoLoad() {
    const backup = localStorage.getItem("people");
    if (backup) {
      const data = JSON.parse(backup);

      // **NEW: Clear existing entries**
      this.entries = [];
      const entriesById = new Map();

      // First pass: create all entries
      data.forEach((entryData) => {
        const entry = new Entry(entryData);
        entriesById.set(entry.id, entry);
        this.entries.push(entry);
      });

      console.log(data);

      // Second pass: restore references by ID
      this.entries.forEach((entry) => {
        // If it's an ID string (from JSON), look it up
        if (typeof entry.mother === "string" && entry.mother) {
          entry.mother = entriesById.get(entry.mother) || {};
        } else if (typeof entry.mother === "object" && entry.mother.id) {
          entry.mother = entriesById.get(entry.mother.id) || {};
        }

        if (typeof entry.father === "string" && entry.father) {
          entry.father = entriesById.get(entry.father) || {};
        } else if (typeof entry.father === "object" && entry.father.id) {
          entry.father = entriesById.get(entry.father.id) || {};
        }

        if (typeof entry.spouse === "string" && entry.spouse) {
          entry.spouse = entriesById.get(entry.spouse) || {};
        } else if (typeof entry.spouse === "object" && entry.spouse.id) {
          entry.spouse = entriesById.get(entry.spouse.id) || {};
        }
      });

      console.log("Restored backup:", this.entries.length, "people");
    }
  }

  autosave() {
    const idMap = new Map();
    this.entries.forEach((entry) => {
      idMap.set(entry.id, entry);
    });

    const replaceWithId = (obj) => {
      if (!obj || typeof obj !== "object") return obj;
      if (obj.id && idMap.has(obj.id)) return obj.id;
      if (Array.isArray(obj)) {
        return obj.map(replaceWithId);
      }
      const newObj = {};
      for (let key in obj) {
        newObj[key] = replaceWithId(obj[key]);
      }
      return newObj;
    };

    const data = this.entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      age: entry.age,
      sex: entry.sex,
      mother: replaceWithId(entry.mother),
      father: replaceWithId(entry.father),
      spouse: replaceWithId(entry.spouse),
      notes: entry.notes,
    }));

    console.log(data);

    localStorage.setItem("people", JSON.stringify(data));
    console.log("Autosaved", this.entries.length, "people");
  }

  save(filename = "family-tree.json") {
    const idMap = new Map();
    this.entries.forEach((entry) => {
      idMap.set(entry.id, entry);
    });

    const replaceWithId = (obj) => {
      if (!obj || typeof obj !== "object") return obj;
      if (obj.id && idMap.has(obj.id)) return obj.id;
      if (Array.isArray(obj)) {
        return obj.map(replaceWithId);
      }
      const newObj = {};
      for (let key in obj) {
        newObj[key] = replaceWithId(obj[key]);
      }
      return newObj;
    };

    const data = this.entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      age: entry.age, // Changed
      sex: entry.sex,
      mother: replaceWithId(entry.mother),
      father: replaceWithId(entry.father),
      spouse: replaceWithId(entry.spouse),
      notes: entry.notes,
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  delete() {
    if (!window.currentPerson) {
      document.getElementById("status").textContent = "No person selected";
      return false;
    }

    const deletedPerson = window.currentPerson;
    const deletedName = deletedPerson.name.filter(Boolean).join(" ");

    if (!confirm(`Delete ${deletedName}?`)) {
      return false;
    }

    // 1. Remove from main entries array
    people.entries = people.entries.filter((p) => p !== deletedPerson);

    // 2. Clean references in ALL remaining entries
    people.entries.forEach((person) => {
      // Clear spouse links
      if (person.spouse === deletedPerson) {
        person.spouse = {};
      }

      // Clear parent links
      if (person.father === deletedPerson) {
        person.father = {};
      }
      if (person.mother === deletedPerson) {
        person.mother = {};
      }
    });

    // 3. Clear everything
    document.getElementById("rightPanel").innerHTML = "";
    new Entry().loadForm();
    window.currentPerson = null;

    document.getElementById("status").textContent =
      `${deletedName} deleted and all links cleared`;
    return true;
  }

  clearAll() {
    if (!confirm("Delete ALL people and start new project?")) {
      return false;
    }

    // Clear everything
    people.entries = [];

    // Remove backup
    localStorage.removeItem("people");

    // Clear UI
    document.getElementById("rightPanel").innerHTML = "";
    new Entry().loadForm();
    window.currentPerson = null;

    people.addNew(); // Attempt to restore from backup if exists
    currentPerson.loadForm(); // Load form for new entry
    currentPerson.loadTree(); // Redraw tree with new entry as ego
    people.autosave();

    document.getElementById("status").textContent = "New project started";
    return true;
  }
}
