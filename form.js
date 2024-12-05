import { generateFamilyTree, data } from './script.js';
import { findPersonById, saveArray } from './helper.js';

export function createForm(index, divId) {


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

const inputTypes = {
firstName: 'text',
middleName: 'text',
familyName: 'text',
gender: 'select', 
birthYear: 'text',
mother: 'number',
father: 'number',
spouse: 'number',
children: 'text',
note: 'text',
};

// Labels
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
input.id = key;
input.classList.add("formInput")

// Generate a new ID
const newId = (data.people.length + 1).toString();

input.value = index === 'new' && input.id === 'id'? newId : index === 'new'? '' : person[key];



// Make input mandatory
const mandatoryKeys = ['firstName', 'gender']
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

// Create a delete button
const deleteButton = document.createElement('button');
deleteButton.type = 'submit';
deleteButton.textContent = 'Delete';
form.appendChild(deleteButton);

// Create a close button
const closeButton = document.createElement('button');
closeButton.type = 'submit';
closeButton.textContent = 'Close';
form.appendChild(closeButton);

// Append the form to the body (or any other container)
document.body.appendChild(form);

// Event listener for close button
deleteButton.addEventListener('click', (event) => {
event.preventDefault(); // Prevent the default form submission

const existingForm = document.getElementById('editForm');
existingForm.remove();

data.people.splice(index,1)
generateFamilyTree(data.people)

});

// Event listener for close button
closeButton.addEventListener('click', (event) => {
event.preventDefault(); // Prevent the default form submission

const existingForm = document.getElementById('editForm');

existingForm.remove();

});

//Append Form
document.body.appendChild(form);

// Focus on the firstName input
const firstNameInput = form.querySelector('input[name="firstName"]');
if (firstNameInput) {
firstNameInput.focus(); // Focus on firstName input
}

//Handle Form submission
form.addEventListener('submit', (event) => {
event.preventDefault(); // Prevent the default form submission

// Update the person object with the new values
const formData = new FormData(form);
let ID

if (index === 'new') {

// Create a new object for the new person
let newObj = {};

// Populate the new object with form data
for (const key of formData.keys()) {
newObj[key] = formData.get(key);
}

// Set the new ID
ID = formData.get('id');

//console.log(newObj);

// Add the new person to the people array
data.people.push(newObj);

const existingForm = document.getElementById('editForm');
existingForm.remove();


// Regenerate the family tree with the updated data
generateFamilyTree(data, newObj)


} else {

// Update the existing person object with form data
for (const key of formData.keys()) {
person[key] = formData.get(key);
}

// Update the person in the people array
ID = formData.get('id');
data.people[index] = person;

// Regenerate the family tree with the updated data
generateFamilyTree(data,  data.people[index])
}

//Change information in other people's entries.

//Remove old Spouse
let existingSpouse = data.people.find(person => person.spouse === ID);
if(existingSpouse){
existingSpouse.spouse = '';
}

//Update Spouse
let spouse = formData.get('spouse');
if(spouse !== ''){
let spouseIndex = data.people.findIndex(person => person.id === spouse)

//console.log(data.people[spouseIndex])
data.people[spouseIndex].spouse = ID;
}

const parent = findPersonById(data.people, ID);

//Update Parent Entry on Added Children
if(parent.children !== "" ){
console.log('adding Children...')
const children = parent.children.split(',');
console.log(children)


children.forEach(childId => {

const childObj = findPersonById(data.people, childId);

const parentGender = parent.gender;
const parentId = ID;

if(parentGender === 'male'){

childObj.father = parentId

}else if(parentGender === 'female'){

childObj.mother = parentId

}

})

//Remove Father/Mother status from entries.

data.people.forEach(person => {

const isChild = children.includes(person.id)

if(isChild === false){

if(person.mother === ID){
person.mother = ""
}

if(person.father === ID){
person.father = ""
}

}

})

//Update Children on added Parents

//Update Spouse
let parentIDs = [formData.get('mother'),formData.get('father')];
parentIDs.forEach(parent => {

console.log(parent)

if(parent !== ''){
let index = data.people.findIndex(person => person.id === parent)
let person = data.people[index]

if (person.children === "") {
person.children = ID; // If no children, directly assign the ID
} else if (!person.children.includes(ID)) {
person.children = person.children + ',' + ID; // Append the new ID if it's not already present
}

}
});

};

saveArray(data)

});



// Event listener for 'Esc' key press
document.addEventListener('keydown', (event) => {
if (event.key === 'Escape') {
form.remove();
}
});

};

