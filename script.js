import { createForm } from './form.js';
import { addPeople, addTimeScale} from './nodes.js';
import { addChildrenLines, addMarriageLine} from './lines.js';
import { createButtons } from './buttons.js';
export let data = {
    "people":[
        {
            "id": "24",
            "firstName": "Alexander",
            "middleName": "Maclarane",
            "familyName": "Keracher",
            "gender": "male",
            "birthyear": "1890",
            "mother": "",
            "father": "",
            "spouse": ""
          },
          {
            "id": "1",
            "firstName": "Thomas",
            "middleName": "",
            "familyName": "Keracher",
            "gender": "male",
            "birthyear": "1928",
            "mother": "",
            "father": "24",
            "spouse": "2"
          },
          {
            "id": "26",
            "firstName": "Papa",
            "middleName": "",
            "familyName": "Wright",
            "gender": "male",
            "birthyear": "1920",
            "mother": "",
            "father": "",
            "spouse": "25"
          },
          {
            "id": "15",
            "firstName": "Pat",
            "middleName": "",
            "familyName": "Keracher",
            "gender": "female",
            "birthyear": "1921",
            "mother": "",
            "father": "24",
            "spouse": ""
          },
          {
            "id": "25",
            "firstName": "Nana",
            "middleName": "",
            "familyName": "Wright",
            "gender": "female",
            "birthyear": "1935",
            "mother": "",
            "father": "",
            "spouse": "26"
          },
          {
            "id": "2",
            "firstName": "Effie",
            "middleName": "",
            "familyName": "Todd",
            "gender": "female",
            "birthyear": "1935",
            "mother": "",
            "father": "",
            "spouse": "1"
          },
          {
            "id": "20",
            "firstName": "David",
            "middleName": "Irvine",
            "familyName": "Keracher",
            "gender": "male",
            "birthyear": "1948",
            "mother": "2",
            "father": "1",
            "spouse": ""
          },
          {
            "id": "23",
            "firstName": "Barbara",
            "middleName": "",
            "familyName": "Keracher",
            "gender": "female",
            "birthyear": "1949",
            "mother": "2",
            "father": "1",
            "spouse": ""
          },
          {
            "id": "21",
            "firstName": "Peter",
            "middleName": "",
            "familyName": "Keracher",
            "gender": "male",
            "birthyear": "1949",
            "mother": "2",
            "father": "1",
            "spouse": "11"
          },
          {
            "id": "17",
            "firstName": "Margaret",
            "middleName": "",
            "familyName": "Milton",
            "gender": "female",
            "birthyear": "1950",
            "mother": "2",
            "father": "1",
            "spouse": "18"
          },
          {
            "id": "11",
            "firstName": "Pamela",
            "middleName": "",
            "familyName": "Wright",
            "gender": "female",
            "birthyear": "",
            "mother": "25",
            "father": "26",
            "spouse": "21"
          }]};

    // "people": [
    //     {
    //         "id": "0",
    //         "firstName": "Click",
    //         "middleName": "",
    //         "familyName": "Here",
    //         "gender": "other",
    //         "birthyear": "1",
    //         "mother": "",
    //         "father": "",
    //         "spouse": ""
    //     }]};
    

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
//addTimeScale(people);

//Position Nodes
addPeople(people);

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

