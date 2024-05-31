import { createForm } from './form.js';
import { addEgo, addSpouse, addChildren, addTimeScale} from './nodes.js';
export let data = [];


// Function to load family data from JSON file
async function loadFamilyData() {
try {
const response = await fetch('data.json');
if (!response.ok) {
    throw new Error('Failed to load data');
}
return await response.json();
} catch (error) {
console.error(error);
}
}

async function addData(){
data = await loadFamilyData();
generateFamilyTree(data);
}

// Function to generate the family tree HTML
export async function generateFamilyTree(data) {
const treeContainer = document.getElementById("tree");   
treeContainer.innerHTML = ''; 
const scaleContainer = document.getElementById("yearScale");
scaleContainer.innerHTML = '';

const people = data.people
const ego = people;
console.log(people)
addTimeScale(people);
addEgo(ego);
addSpouse(people);
// addChildren(ego, people);



const nodes = document.querySelectorAll('.node');
nodes.forEach(node => {
node.addEventListener('click', () => {
const nodeId = node.getAttribute('id')
console.log(nodeId, people)
const index = people.findIndex(person => parseInt(person.id) === parseInt(nodeId))
const divId = node.getAttribute('id')
createForm(index, divId);
});
});

}







// Display the family tree
addData();

