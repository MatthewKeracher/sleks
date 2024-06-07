import { createForm } from './form.js';
import { startTree, addTimeScale} from './nodes.js';
import { addChildrenLines, addMarriageLine} from './lines.js';
import { createButtons } from './buttons.js';
import { findPersonById } from './helper.js';
export let data = {
  "people": [
    {
      "id": "0",
      "firstName": "John",
      "middleName": "",
      "familyName": "Doe",
      "gender": "male",
      "birthyear": "1900",
      "mother": "",
      "father": "",
      "spouse": "4",
      "children": "1,2"
    },
    {
      "id": "1",
      "firstName": "Jane",
      "middleName": "",
      "familyName": "Doe",
      "gender": "female",
      "birthyear": "1900",
      "mother": "",
      "father": "0",
      "spouse": "",
      "children": ""
    },
    {
      "id": "2",
      "firstName": "Jim",
      "middleName": "",
      "familyName": "Doe",
      "gender": "male",
      "birthyear": "1900",
      "mother": "",
      "father": "0",
      "spouse": "",
      "children": ""
    },
    {
      "id": "4",
      "firstName": "Mrs",
      "middleName": "",
      "familyName": "Doe",
      "gender": "female",
      "birthyear": "",
      "mother": "",
      "father": "",
      "spouse": "0",
      "children": "1,2"
    }
  ]};
    

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
const treeContainer = document.getElementById("tree");   
treeContainer.innerHTML = ''; 
const scaleContainer = document.getElementById("yearScale");
scaleContainer.innerHTML = '';

const people = data.people
const ego = people[0];
const X = window.innerWidth -  (window.innerWidth/2)
const Y = window.innerHeight - (window.innerHeight/2)

//Create Scale
//addTimeScale(people);

//Position Nodes
startTree(ego, people, X, Y);


//Draw Lines
addMarriageLine(people);
//addChildrenLines(people);


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
            focusedInput.value += ', ' + divId;
          }
          
          const targetDiv = findPersonById(people, divId);
          
          const parentGender = document.getElementById('gender').value;
          const parentId = document.getElementById('id').value;

          if(parentGender === 'male'){

          targetDiv.father = parentId

          }else if(parentGender === 'female'){

          targetDiv.mother = parentId

          }
          
        
        } else if(nodeIndex === -1){
            createForm('new')

        }else{
            createForm(nodeIndex, divId);
        }
    });
});


}


// Call the function to create the button
createButtons();
generateFamilyTree(data);

// Call the function to set up the event listener
uploadData();

