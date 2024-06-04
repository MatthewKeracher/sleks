import { generateFamilyTree, data } from './script.js';
import { returnRect } from './helper.js';

// Function to create and append the edit form
export function createForm(index, divId) {
//console.log(index, divId)
// Remove any existing forms to prevent multiple forms from displaying
const existingForm = document.getElementById('editForm');
if (existingForm) {
existingForm.remove();
}

//Get person or, if new, use existing to copy.
const person = index === 'new'? data.people[0]: data.people[index];

// Create a form element
const form = document.createElement('form');
form.id = 'editForm';
//console.log(nodeRect.right)

const inputTypes = {
firstName: 'text',
middleName: 'text',
familyName: 'text',
gender: 'select', // Assuming you want a dropdown for gender
birthYear: 'date',
mother: 'text',
father: 'text',
spouse: 'text'
};


// Create input fields for each property of the person object
for (const key in person) {
if (person.hasOwnProperty(key)) {
// Create a label
const label = document.createElement('label');
label.textContent = key;
label.classList.add("formLabel")
form.appendChild(label);

// Create an input field
let input;

if (inputTypes[key] === 'select') {
input = document.createElement('select');
['male', 'female', 'other'].forEach(optionValue => {
const option = document.createElement('option');
option.value = optionValue;
option.textContent = optionValue;
if (person[key] === optionValue) {
option.selected = true;
}
input.appendChild(option);
});
} else {
input = document.createElement('input');
input.type = inputTypes[key] || 'text'; // Default to 'text' if no type is specified
}

input.name = key;
input.classList.add("formInput")
input.value = index === 'new'? '' : person[key];

// Make input mandatory
const mandatoryKeys = ['firstName', 'familyName', 'gender', 'birthyear']
if(mandatoryKeys.includes(key)){
input.required = true;
}

form.appendChild(input);

// Add a line break for better formatting
form.appendChild(document.createElement('br'));
}
};


// Create a submit button
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Save';
form.appendChild(submitButton);

// Append the form to the body (or any other container)
document.body.appendChild(form);

// Form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Update the person object with the new values
    const formData = new FormData(form);
    let ID

    if (index === 'new') {
        // Create a new object for the new person
        let newObj = {};

        // Generate a new ID
        const newId = (data.people.length + 1).toString();

        // Populate the new object with form data
        for (const key of formData.keys()) {
            newObj[key] = formData.get(key);
        }

        // Set the new ID
        newObj['id'] = newId;
        ID = newId;

        console.log(newObj);

        // Add the new person to the people array
        data.people.push(newObj);

        const existingForm = document.getElementById('editForm');
        existingForm.remove();


    } else {
        // Update the existing person object with form data
        for (const key of formData.keys()) {
            person[key] = formData.get(key);
        }

        // Update the person in the people array
        ID = formData.get('id');
        data.people[index] = person;
    }

    //Remove old Spouse
    let existingSpouse = data.people.find(person => person.spouse === ID);
    if(existingSpouse){
    existingSpouse.spouse = '';
    }

    //Update Spouse
    let spouse = formData.get('spouse');
    if(spouse !== ''){
    let spouseIndex = data.people.findIndex(person => person.id === spouse)
   
        console.log(data.people[spouseIndex])
        data.people[spouseIndex].spouse = ID;
    }

    // Regenerate the family tree with the updated data
    generateFamilyTree(data);
});

// Create a close button
const closeButton = document.createElement('button');
closeButton.type = 'submit';
closeButton.textContent = 'Close';
form.appendChild(closeButton);

// Append the form to the body (or any other container)
document.body.appendChild(form);

// Event listener for form submission
closeButton.addEventListener('click', (event) => {
event.preventDefault(); // Prevent the default form submission

const existingForm = document.getElementById('editForm');

existingForm.remove();



});

// Event listener for 'Esc' key press
document.addEventListener('keydown', (event) => {
if (event.key === 'Escape') {
form.remove();
}
});

};

