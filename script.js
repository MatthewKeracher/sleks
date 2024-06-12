import { createForm } from './form.js';
import { addEgo, moveWife, addChildrenLines, addTimeScale, addMarriageLine} from './nodes.js';
import { createButtons } from './buttons.js';
import { findPersonById } from './helper.js';
export let xArray = [{id: 0, x: window.innerWidth -  (window.innerWidth/2)}];
export let duplicates = [];
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
            generateFamilyTree(data)
        };

        reader.readAsText(file);
    });
}

// Function to generate the family tree HTML
export async function generateFamilyTree(data) {

//Erase old familyTree
const containers = ["tree","yearScale", "svgContainer"]

containers.forEach(container => { 
  container = document.getElementById(container);   
  container.innerHTML = ''; 
});

duplicates = [];
xArray = [{id: 0, x: window.innerWidth -  (window.innerWidth/2)}];

const people = data.people
const Y = 10 //window.innerHeight - (window.innerHeight/2)
const X = xArray[xArray.length -1].x

//Create Scale
addTimeScale(people);

startTree(people[0], people, X, Y);

//Position Nodes
// people.forEach(ego => {
// if (!duplicates.includes(ego)){
// startTree(ego, people, X, Y);
// };
// })

//Move Nodes
moveWife(people);

//Draw Lines
addMarriageLine(people);
addChildrenLines(people);


let focusedInput = null;

document.addEventListener('focusin', (event) => {
    if (['mother', 'father', 'spouse'].includes(event.target.name)) {
        focusedInput = event.target;
    } else {
        focusedInput = null;
    }
});


const nodes = document.querySelectorAll('.node');
nodes.forEach(node => {
    node.addEventListener('click', () => {
        const nodeId = node.getAttribute('id');

        const index = people.findIndex(person => parseInt(person.id) === parseInt(nodeId));
        const divId = node.getAttribute('id');
       

        const existingForm = document.getElementById('editForm');
        const inputKeys = ['mother', 'father', 'spouse'];

        if (existingForm && focusedInput && inputKeys.includes(focusedInput.name)) {
            focusedInput.value = divId;
        } else{
            createForm(index, divId);
        }
    });
});


}

// Adds buttons to bottom-right
createButtons();

//Loads family tree
generateFamilyTree(data);

// Call the function to set up the event listener
uploadData();

