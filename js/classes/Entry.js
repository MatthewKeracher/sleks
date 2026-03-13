class Entry {
  name = ["", "", ""]; // [first, middle, last]
  sex = null;
  age = [null, null]; // [birthYear, deathYear]
  mother = {};
  father = {};
  spouse = {};
  notes = "";
  id = "";

  constructor(data = {}) {
    this.name = data.name || ["", "", ""];
    this.sex = data.sex || null;
    this.age = data.age || [null, null];
    this.mother = data.mother || {};
    this.father = data.father || {};
    this.spouse = data.spouse || {};
    this.notes = data.notes || "";
    this.id = data.id || crypto.randomUUID();
  }

  get firstName() {
    return this.name[0];
  }

  get middleName() {
    return this.name[1];
  }

  get lastName() {
    return this.name[2];
  }

  get deathYear() {
    return this.age[1];
  }

  get birthYear() {
    return this.age[0];
  }

  get ancestor() {
    let current = this;

    // Traverse father → father's father → etc until no more father
    while (Object.keys(current.father).length > 0) {
      current = current.father;
    }

    return current;
  }

  get familyTree() {
  const familyTree = [];
  let currentGeneration = [this.ancestor];  // Start with ancestor
  
  while (currentGeneration.length > 0) {
    
    familyTree.push([...currentGeneration]);  
    
    // Collect ALL children from this entire generation (cousins connected!)
    const nextGen = [];
    currentGeneration.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          nextGen.push(child);  // Full child object
        });
      }
    });
    
    currentGeneration = [...new Set(nextGen)];  // Remove duplicates
  }
  
  return familyTree;
}

  get children() {
    return people.entries.filter(
      (person) => person.mother === this || person.father === this,
    );
  }

  get siblings() {
    if (!this.mother && !this.father) return [];

    // Get all people who share the same mother OR father (excluding self)
    const candidates = people.entries.filter(
      (person) =>
        (person.mother === this.mother || person.father === this.father) &&
        person !== this,
    );

    // Remove duplicates (person could match both parents)
    return [...new Set(candidates)];
  }

  link(fieldName, linkEntry) {
    if (!linkEntry || this[fieldName] === linkEntry) return false; // ← Guard!

    this[fieldName] = linkEntry;

    if (fieldName === "spouse" && linkEntry.spouse !== this) {
      linkEntry.link("spouse", this);
    }

    return true;
  }

  loadForm() {
    if (!this.id) {
      // Clear all form fields
      const inputs = document.querySelectorAll("#leftPanel input");
      const select = document.getElementById("sex");
      inputs.forEach((input) => (input.value = ""));
      if (select) select.value = "";
      document.getElementById("formTitle").textContent = "";
      window.currentPerson = null;
      return;
    }

    // Use getter for firstName if available, fallback to name array
    document.getElementById("formTitle").textContent = this.name
      .filter(Boolean)
      .join(" ");

    // Fill name fields
    document.getElementById("firstName").value = this.name[0] || "";
    document.getElementById("middleName").value = this.name[1] || "";
    document.getElementById("lastName").value = this.name[2] || "";

    // Fill age fields
    document.getElementById("birthYear").value = this.age[0] || "";
    document.getElementById("deathYear").value = this.age[1] || "";

    // Fill sex dropdown
    document.getElementById("sex").value = this.sex || "";

    // Relationships with color update
    const fatherInput = document.getElementById("fatherInput");
    fatherInput.value = this.father?.name?.filter(Boolean).join(" ") || "";
    fatherInput.personObject =
      this.father && Object.keys(this.father).length > 0 ? this.father : null;
    window.updateFieldColor(fatherInput);

    const motherInput = document.getElementById("motherInput");
    motherInput.value = this.mother?.name?.filter(Boolean).join(" ") || "";
    motherInput.personObject =
      this.mother && Object.keys(this.mother).length > 0 ? this.mother : null;
    window.updateFieldColor(motherInput);

    const spouseInput = document.getElementById("spouseInput");
    spouseInput.value = this.spouse?.name?.filter(Boolean).join(" ") || "";
    spouseInput.personObject =
      this.spouse && Object.keys(this.spouse).length > 0 ? this.spouse : null;
    window.updateFieldColor(spouseInput);
  }

  loadTree() {
    drawTree(this);
  }

  savePerson() {
    this.name = [
      document.getElementById("firstName").value,
      document.getElementById("middleName").value,
      document.getElementById("lastName").value,
    ];

    this.age = [
      document.getElementById("birthYear").value || null,
      document.getElementById("deathYear").value || null,
    ];

    this.sex = document.getElementById("sex").value || null;

    // Handle ALL relationships first
    ["father", "mother", "spouse"].forEach((field) => {
      const input = document.getElementById(field + "Input");

      if (input.personObject) {
        this[field] = input.personObject;

        if (field === "spouse") {
          input.personObject.spouse = this;
        }

        delete input.personObject;
        console.log(field, "personObject deleted"); // Better logging
      } else {
        this[field] = {};
      }
    });

    // Add/update in people.entries
    const existingIndex = people.entries.findIndex((p) => p.id === this.id);
    if (existingIndex >= 0) {
      people.entries[existingIndex] = this;
    } else {
      people.entries.push(this);
    }

    // **These run ONCE after all relationships processed**
    people.autosave();
    this.loadTree();
    this.loadForm();

    document.getElementById("status").textContent =
      `${this.name.filter(Boolean).join(" ")} updated/added!`;
    return true;
  }
}
