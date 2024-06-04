import { createForm } from './form.js';
import { addEgo, moveWife, addChildrenLines, addTimeScale, addMarriageLine} from './nodes.js';
import { createButtons } from './buttons.js';
export let data = {
    "people": [
        {
            "id": "0",
            "firstName": "Click",
            "middleName": "",
            "familyName": "Here",
            "gender": "other",
            "birthyear": "1",
            "mother": "",
            "father": "",
            "spouse": ""
        }]};
    

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

//Create Scale
addTimeScale(people);

//Position Nodes
addEgo(people);

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


// Call the function to create the button
createButtons();
generateFamilyTree(data);

// Call the function to set up the event listener
uploadData();

