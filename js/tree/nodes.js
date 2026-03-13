function drawNode(ego, X, Y, option) {
    const rightPanel = document.getElementById("rightPanel");
    const node = document.createElement("div");
    const nodeWidth = 100; // Set a fixed width for name divs

    // Position absolutely
    node.style.position = 'absolute';
    node.style.top = Y + 'px';
    node.style.left = X + 'px';
    node.style.width = nodeWidth + 'px';

    // Add classes
    if (option) node.classList.add(option);
    //if (ego.deathYear && ego.deathYear !== "") node.classList.add("dead");
    node.classList.add('node');

    // Set ID
    node.setAttribute('link', ego);

    // Add Click Event
    node.addEventListener('click', () => {
       window.currentPerson = ego; // Update global currentPerson
       ego.loadForm(); // Load form with this person's data
       ego.loadTree(); // Redraw tree with this person as ego
    });
   
    // Add name divs
    const firstName = document.createElement("div");
    firstName.classList.add("firstName");
    firstName.textContent = ego.firstName;
    firstName.style.width = nodeWidth + 'px';
    node.appendChild(firstName);

    const familyName = document.createElement("div");
    familyName.classList.add("familyName");
    familyName.textContent = ego.lastName;
    familyName.style.width = nodeWidth + 'px';
    node.appendChild(familyName);

    // Append to rightPanel
    rightPanel.appendChild(node);
}


