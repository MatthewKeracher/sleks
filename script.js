import { createForm } from './form.js';
import { startTree} from './nodes.js';
import { addChildrenLines, addMarriageLine} from './lines.js';
import { createButtons } from './buttons.js';
import { findPersonById } from './helper.js';

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

const people = data.people
const Y = 100 //window.innerHeight - (window.innerHeight/2)
const X = 300 //window.innerWidth -  (window.innerWidth/2)

startTree(people[0], people, X, Y);

//Draw Lines
addMarriageLine(people);
addChildrenLines(people);


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
    node.addEventListener('click', () => {
        
        const divId = node.getAttribute('id');

        //Returns the person clicked on.
        const nodeIndex = people.findIndex(person => parseInt(person.id) === parseInt(divId));
        
        const existingForm = document.getElementById('editForm');
        const inputKeys = ['mother', 'father', 'spouse'];

        if (existingForm && focusedInput && inputKeys.includes(focusedInput.id)) {
            focusedInput.value = divId;

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
generateFamilyTree(data);
uploadData();

