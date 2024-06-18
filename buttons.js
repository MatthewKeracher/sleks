
import { createForm } from './form.js';
import { data, generateFamilyTree } from './script.js';
import { downloadData, findPersonById } from './helper.js';

export function createButtons() {

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const addButton = document.createElement('button');
    addButton.id = 'addButton';
    addButton.textContent = 'Add';
    

    // Add an event listener to the button
    addButton.addEventListener('click', () => {
        createForm('new')
    });

    const saveButton = document.createElement('button');
    saveButton.id = 'saveButton';
    saveButton.textContent = 'Save';

    // Add an event listener to the button
    saveButton.addEventListener('click', () => {
        let fileName = document.getElementById('fileName').value
        downloadData(data, fileName)
    });

    const loadButton = document.createElement('button');
    loadButton.id = 'loadButton';
    loadButton.textContent = 'Load';

    // Add an event listener to the button
    loadButton.addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Trigger click event on file input element
    });

    const refreshButton = document.createElement('button');
    refreshButton.id = 'refreshButton';
    refreshButton.textContent = 'Refresh';

    // Add an event listener to the button
    refreshButton.addEventListener('click', () => {
   // Regenerate the family tree with the updated data
   generateFamilyTree(data)
    });

    const jsonButton = document.createElement('button');
    jsonButton.id = 'jsonButton';
    jsonButton.textContent = '.json';

    // Add an event listener to the button
    jsonButton.addEventListener('click', () => {
    //Open .json Editor
    });

    // Append buttons to container
    buttonContainer.appendChild(refreshButton);
    buttonContainer.appendChild(jsonButton);
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(loadButton);
    buttonContainer.appendChild(addButton);
   
    // Append container to body (or any other container)
    const bottom = document.getElementById('bottomContainer')
    bottom.appendChild(buttonContainer);
}


export function createDropdown(data) {


    // Remove any existing forms to prevent multiple forms from displaying
    const oldDropDown = document.getElementById('dropDown');
    if (oldDropDown) {
    oldDropDown.remove();
    }
  
    const select = document.createElement('select');
    select.id = 'dropDown';

    //transform data to dropdown options
    const options = []

    data.people.forEach(person => {

    let option = {value: person.id, label: person.firstName + ' ' + person.familyName};

    options.push(option);

    })
    
    // Create and append the options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
    });

    // Append the select element to the specified container
    const container = document.getElementById('bottomContainer');
    if (container) {
        container.appendChild(select);
    }

    select.addEventListener('change', function(event) {
        const id = event.target.value
        const ego = findPersonById(data.people, id)
        generateFamilyTree(data, ego)
    });
}

export function createSearchBar(){

const searchBar = document.getElementById('searchBar');
const suggestionsContainer = document.getElementById('suggestions');
const people = data.people;

searchBar.addEventListener('input', () => {
const query = searchBar.value.toLowerCase();
suggestionsContainer.innerHTML = '';

if (query) {
const filteredData = people.filter(person => person.firstName.toLowerCase().includes(query) || person.familyName.toLowerCase().includes(query));
filteredData.forEach(person => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = person.firstName + ' ' + person.familyName;
    suggestionItem.setAttribute('id', person.id)
    suggestionItem.addEventListener('click', () => {
    const id = suggestionItem.getAttribute('id');
    const person = findPersonById(people, id)
    searchBar.value = person.firstName + ' ' + person.familyName;
    suggestionsContainer.innerHTML = '';
    console.log(data, person)
    generateFamilyTree(data, person);
    });
    suggestionsContainer.appendChild(suggestionItem);


    
    
});
}
});
}
