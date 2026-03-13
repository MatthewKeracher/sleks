
function setupMainSearch() {
  const searchBox = document.getElementById("searchBox");
  const dropDown = document.getElementById("searchResults");

  searchBox.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    dropDown.innerHTML = "";
    dropDown.style.display = "none";

    if (query.length < 1) {
      document.getElementById("status").textContent = "";
      return;
    }

    const matches = people.find(query);
    document.getElementById("status").textContent = `${matches.length} matches found`;

    if (matches.length === 0) return;

    dropDown.style.display = "block";

    matches.forEach((person) => {
      const fullName = person.name.filter(Boolean).join(" ");
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = fullName;
      item.dataset.id = person.id;
      item.onclick = () => selectPerson(person);
      dropDown.appendChild(item);
    });
  });

  function selectPerson(person) {
  searchBox.value = person.name.filter(Boolean).join(" ");
  dropDown.style.display = "none";
  window.currentPerson = person;
  person.loadForm();
  person.loadTree();
}

// Hide dropdown when clicking outside
document.addEventListener("click", function (e) {
  if (!searchBox.contains(e.target) && !dropDown.contains(e.target)) {
    dropDown.style.display = "none";
    searchBox.value = "";
  }
});

}


function setupFormSearch() {
  const fields = ["fatherInput", "motherInput", "spouseInput"];
  const dropdowns = ["fatherDropdown", "motherDropdown", "spouseDropdown"];

  // **GLOBAL color function - available everywhere**
  window.updateFieldColor = function(field) {
    if (field.personObject && Object.keys(field.personObject).length > 0) {
      field.style.backgroundColor = "#d4edda";  // GREEN
      field.style.borderColor = "#28a745";
    } else {
      field.style.backgroundColor = "#f8d7da";  // RED
      field.style.borderColor = "#dc3545";
    }
  };

  fields.forEach((fieldId, index) => {
    const field = document.getElementById(fieldId);
    const dropdown = document.getElementById(dropdowns[index]);

    field.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      dropdown.innerHTML = "";
      dropdown.style.display = "none";

      if (query.length < 1) {
        delete this.personObject;
        window.updateFieldColor(this);
        return;
      }

      const matches = people.find(query);
      if (matches.length === 0) return;

      dropdown.style.display = "block";

      matches.forEach((person) => {
        const fullName = person.name.filter(Boolean).join(" ");
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = fullName;
        
        item.onclick = () => {
          field.value = fullName;
          field.personObject = person;
          dropdown.style.display = "none";
          window.updateFieldColor(field);  // GREEN when selected
        };
        dropdown.appendChild(item);
      });
    });

    // Clear object and show RED when empty
    field.addEventListener("input", function() {
      if (this.value === "") {
        delete this.personObject;
        window.updateFieldColor(this);  // RED
      }
    });

    field.addEventListener("focusout", function() {
      window.updateFieldColor(this);  // Final color check
    });

    // Initial color state
    window.updateFieldColor(field);
  });
}


window.updateFieldColor = function(field) {
    if (field.personObject && Object.keys(field.personObject).length > 0) {
        field.style.backgroundColor = "#d4edda";  // GREEN
        field.style.borderColor = "#28a745";
    } else {
        field.style.backgroundColor = "#f8d7da";  // RED
        field.style.borderColor = "#dc3545";
    }
};


