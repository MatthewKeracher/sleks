//Sort people.
  // const sortedPeople = familyData.people.sort((a, b) => {
  //     return new Date(a.birthday).getFullYear() - new Date(b.birthday).getFullYear();
  // });


// //Make Y-Scale of Years
// const birthYears = sortedPeople.map(person => new Date(person.birthday).getFullYear());

// birthYears.forEach((year, index) => {

//   const yearNode = document.createElement("div");
//   yearNode.setAttribute('id', year);
//   yearNode.setAttribute('class', 'yearNode');
//   yearNode.textContent = year;
//   scaleContainer.appendChild(yearNode);

//     // Add space between years except for the last year
//     if (index !== birthYears.length - 1) {
//     const nextYear = birthYears[index + 1];
//     const yearDifference = nextYear - year;

//     for (let i = 1; i < yearDifference; i++) {
//         const spaceNode = document.createElement("div");
//         spaceNode.style.height = '1vh';
//         spaceNode.setAttribute('id', year + i);
//         scaleContainer.appendChild(spaceNode);
//     }
//     }
//     });

//   //Add people.
//   sortedPeople.forEach((person, index) => {

//     const birthYear = new Date(person.birthday).getFullYear();
//     const yearNode = document.getElementById(birthYear);
  
//     const rect = yearNode.getBoundingClientRect();
//     const yPosition = rect.top + window.scrollY;
//     console.log(yPosition)
  
//     const node = document.createElement("div");
//     node.classList.add("node");
//     node.textContent = `${person.firstName} ${person.familyName}`;
//     node.style.top = yPosition + 'px'; // Append 'px' unit
//     treeContainer.appendChild(node);

// });