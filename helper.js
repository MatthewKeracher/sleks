export function downloadData(data, filename) {
// Convert data to JSON string
const jsonData = JSON.stringify(data, null, 2); // Use null and 2 for pretty formatting

// Create a Blob containing the JSON data
const blob = new Blob([jsonData], { type: 'application/json' });

// Create a temporary link element
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = filename; // Set the filename for the downloaded file

// Programmatically click the link to trigger the download
document.body.appendChild(link);
link.click();

// Clean up
document.body.removeChild(link);
URL.revokeObjectURL(link.href);
}

export function convertWidth(px) {
let viewportWidth = window.innerWidth;
return (px / viewportWidth) * 100;
}

export function convertHeight(px) {
let viewportHeight = window.innerHeight;
return (px / viewportHeight) * 100;
}

export function returnRect(id){
console.log(id)
const div = document.getElementById(id);
const divRect = div.getClientRects();
return divRect[0];

}

export function findPersonById(people, id) {
return people.find(person => person.id === id);

};

// Function to calculate the midpoint of a line
export function calculateMidpoint(x1, y1, x2, y2) {
const xMid = (x1 + x2) / 2;
const yMid = (y1 + y2) / 2;
return { xMid, yMid };
}


