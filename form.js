import { generateFamilyTree, data } from './script.js';
import { returnRect } from './nodes.js';

// Function to create and append the edit form
export function createForm(index, divId) {
    console.log(index, divId)
    // Remove any existing forms to prevent multiple forms from displaying
    const existingForm = document.getElementById('editForm');
    if (existingForm) {
        existingForm.remove();
    }

    //Node it is attached to.
    const nodeObj = document.getElementById(divId);
    const nodeRect = returnRect(divId);

    const person = data.people[index];
  
    // Create a form element
    const form = document.createElement('form');
    form.id = 'editForm';
    console.log(nodeRect.right)
    // form.style.left = nodeRect.left + 300 + 'px';
    // form.style.top = nodeRect.top + 'px';
  
    // Create input fields for each property of the person object
    for (const key in person) {
        if (person.hasOwnProperty(key)) {
            // Create a label
            const label = document.createElement('label');
            label.textContent = key;
            label.classList.add("formLabel")
            form.appendChild(label);
  
            // Create an input field
            const input = document.createElement('input');
            input.type = 'text';
            input.name = key;
            input.classList.add("formInput")
            input.value = person[key];
            form.appendChild(input);
  
            // Add a line break for better formatting
            form.appendChild(document.createElement('br'));
        }
    }

  
    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save';
    form.appendChild(submitButton);
  
    // Append the form to the body (or any other container)
    document.body.appendChild(form);
  
    // Event listener for form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
  
        // Update the person object with the new values
        const formData = new FormData(form);
        for (const key of formData.keys()) {
            person[key] = formData.get(key);
        }
  
        data.people[index] = person;
        
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

  