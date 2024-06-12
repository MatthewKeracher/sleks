
import { createForm } from './form.js';
import { data, generateFamilyTree } from './script.js';
import { downloadData } from './helper.js';

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
    generateFamilyTree(data);
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



