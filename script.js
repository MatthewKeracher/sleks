import { createForm } from './form.js';
import { startTree} from './nodes.js';
import { addChildrenLines, addMarriageLine} from './lines.js';
import { createButtons, createSearchBar } from './buttons.js';
import { findPersonById, countOlderGenerations, returnRect, editData, saveArray, loadArray } from './helper.js';

export let duplicates = [];

//Blank Data Template
export let data = {
"people": [
{
"id": "0",
"firstName": "Add",
"middleName": "",
"familyName": "Node",
"gender": "",
"birthyear": "",
"mother": "",
"father": "",
"spouse": "",
"children": ""
}
]};

let savedData = loadArray()
if(savedData !== null){data = savedData}
console.log(data)

function saveJsonEditor() {
  let jsonEditor = document.getElementById('jsonEditor');
  // try {
      data = JSON.parse(jsonEditor.value);
      saveArray(data);
      generateFamilyTree(data)
      closeEditor();
      console.log('Array saved:', data);
  // } catch (error) {
  //     alert('Invalid JSON. Please check your input.');
  // }
}

function closeEditor() {
  document.getElementById('editor').style.display = 'none';
}

document.getElementById('saveButton').addEventListener('click', saveJsonEditor);
document.getElementById('cancelButton').addEventListener('click', closeEditor);


//Function to upload .json files.
function uploadData() {
const inputElement = document.getElementById('fileInput'); // Get the file input element

inputElement.addEventListener('change', function(event) {
const file = event.target.files[0]; // Get the selected file
const reader = new FileReader();

reader.onload = function(event) {
    const jsonData = JSON.parse(event.target.result);
    document.getElementById('fileName').value = file.name; 
    data = jsonData
    generateFamilyTree(data);
    editData(data);

};

reader.readAsText(file);
});
}

// Function to generate the family tree HTML
export async function generateFamilyTree(data, ego) {

//Erase old familyTree
const containers = ["tree","yearScale", "svgContainer"]

containers.forEach(container => { 
container = document.getElementById(container);   
container.innerHTML = ''; 
});

duplicates = [];


const people = data.people
createSearchBar(data);

const X = window.innerWidth -  (window.innerWidth/2)

if(!ego){
  const Y = 100 //window.innerHeight - (window.innerHeight/2)
  startTree(people[0], people, X, Y);
}else{
  const generations = countOlderGenerations(ego.id, people);
  const numberGens = generations.generations
  const startEgo = findPersonById(people, generations.egoId);
  const Y = 100
  startTree(startEgo, people, X, Y);
}

//Draw Lines
addMarriageLine(people);
addChildrenLines(people);

//Centre family tree on Ego.
if(ego){
const egoDiv = document.getElementById(ego.id)

egoDiv.classList.add('ego');

const egoRect = returnRect(ego.id)

window.scrollTo({
  left: egoRect.left  - (window.innerWidth / 2) + (egoRect.width / 2) + window.scrollX,
  top: egoRect.top  - (window.innerHeight / 2) + (egoRect.height / 2) + window.scrollY,
  behavior: 'smooth' // Optional: adds a smooth scrolling effect
});

}

let focusedInput = null;

document.addEventListener('focusin', (event) => {
    if (['mother', 'father', 'spouse', 'children'].includes(event.target.id)) {
        focusedInput = event.target;
    } else {
        focusedInput = null;
    }
});



const nodes = document.querySelectorAll('.node');
nodes.forEach(node => {

  node.addEventListener('mouseover', (event) => {
    event.preventDefault();
  
    const divId = node.getAttribute('id');
    const ego = findPersonById(data.people, divId);

    // Remove any existing forms to prevent multiple forms from displaying
    const existingDiv = document.getElementById('hoverDiv');
    if (existingDiv) {
    existingDiv.remove();
    }
    

    const hoverDiv = document.createElement('div');
    hoverDiv.id = 'hoverDiv'
    hoverDiv.classList.add('hover-info'); // Add a class for styling
  
    // Set the content of the div
    hoverDiv.innerHTML = ego.note || ''; // Display the note or a fallback message
  
    // Append the div to the body (or another container)
    if(hoverDiv.innerHTML !== ''){
    document.body.appendChild(hoverDiv);
    }
    
    // Get the position of the node and apply an offset for the hoverDiv
  const nodeRect = node.getBoundingClientRect();
  const offsetX = 20; // Adjust horizontal offset from the node
  const offsetY = 10; // Adjust vertical offset from the node

  // Position the div relative to the node's position
  hoverDiv.style.position = 'absolute';
  hoverDiv.style.left = window.pageXOffset + nodeRect.right + offsetX + 'px'; // Position it to the right of the node
  hoverDiv.style.top = window.pageYOffset + nodeRect.top + offsetY + 'px';  // Slightly below the node
});

  node.addEventListener('mouseout', () => {
    // Remove the hover div when mouse leaves the node
    const hoverDiv = document.querySelector('.hover-info');
    if (hoverDiv) {
      hoverDiv.remove();
    }
  });
  

  node.addEventListener('contextmenu', (event) => {
        
    event.preventDefault();

    const divId = node.getAttribute('id');

    //Centre family tree around Ego
    
    const ego = findPersonById(data.people, divId)
    generateFamilyTree(data, ego)

  });


    node.addEventListener('click', () => {
        
        const divId = node.getAttribute('id');

        //Returns the person clicked on.
        const nodeIndex = people.findIndex(person => parseInt(person.id) === parseInt(divId));
        
        const existingForm = document.getElementById('editForm');
        const inputKeys = ['mother', 'father', 'spouse'];

        if (existingForm && focusedInput && inputKeys.includes(focusedInput.id)) {
            focusedInput.value = divId;
            focusedInput.focus(); 
            
            //Add child to targetDiv Children
            if(focusedInput.id === "mother" || focusedInput.id === "father"){
              const childId = document.getElementById('id').value;
              const targetDiv = findPersonById(people, divId);
              
              if(targetDiv.children === ""){
                targetDiv.children = childId
              }else{
                targetDiv.children =  targetDiv.children + ',' + childId;
              }
  
              };


        } else if (existingForm && focusedInput && focusedInput.id === "children") {
          
          if(focusedInput.value === ""){
            focusedInput.value = divId;

          }else{ 
            focusedInput.value += ',' + divId;
          } 
        
        } else if(nodeIndex === -1){
            createForm('new')

        }else{
            createForm(nodeIndex, divId);
        }
    });
});


const spouseNodes = document.querySelectorAll('.spouse');
spouseNodes.forEach(node => {
    node.addEventListener('click', () => {
        console.log('change family tree');
    })
  })

}

// Start-Up Functions:
createButtons();
createSearchBar(data.people);
generateFamilyTree(data);
uploadData();


