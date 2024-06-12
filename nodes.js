import {} from "./lines.js";
import {duplicates } from "./script.js";


const nodeWidth = 100;
export let cousinsArray = [];
export let nodeSpace = nodeWidth * 4

function drawNode(ego, X, Y){

//Add Node Container
const treeContainer = document.getElementById("tree");
const node = document.createElement("div");

//Get Year for y-axis
//const yearRect = returnRect(ego.birthyear);
//const Y = yearRect.top + window.scrollY;

node.classList.add('node');
node.setAttribute('id', ego.id);
node.style.top = Y + 'px';
node.style.left = X + 'px'
treeContainer.appendChild(node);


//Add Name to Node
const firstName = document.createElement("div");
firstName.classList.add("firstName");
firstName.textContent = `${ego.firstName}`;
firstName.style.width = nodeWidth + 'px';
node.appendChild(firstName);

//Add Name to Node
const familyName = document.createElement("div");
familyName.classList.add("familyName");
familyName.textContent = `${ego.familyName}`;
familyName.style.width = nodeWidth + 'px';
node.appendChild(familyName);

//Add Shape
let shape = '';

if(ego.gender === "male"){
shape = "triangle"}
else if (ego.gender === "female"){
shape = "circle"}
else { shape = "square"};

const egoShape = document.createElement("div");
egoShape.classList.add("shape");
egoShape.classList.add(shape);
egoShape.setAttribute('id', ego.id);
node.appendChild(egoShape);

};

export function startTree(ego, people, X, Y){

duplicates.push(ego); 
drawNode(ego, X, Y);
addParents(ego, people, X, Y);
addSiblings(ego, people, X, Y);
addSpouse(ego, people, X, Y);
addChildren(ego, people, X, Y);


};

export function addParents(child, people, childX, childY){


const mother = people.find(person => person.id === child.mother);
const father = people.find(person => person.id === child.father);

//Add Father
let fatherX 
let fatherY 

if(child.gender === 'male'){
fatherX = childX
fatherY = childY - nodeSpace;
} else {
fatherX = childX - (nodeSpace)
fatherY = childY - nodeSpace;
}

if(father && !duplicates.includes(father)){
duplicates.push(father); 
drawNode(father, fatherX, fatherY);
}

//Add Mother
let motherX 
let motherY 

if(child.gender === 'female'){
motherX = childX
motherY = childY - nodeSpace;
} else {
motherX = childX + (nodeSpace)
motherY = childY - nodeSpace;
}

if(mother && !duplicates.includes(mother)){
duplicates.push(mother); 
drawNode(mother, motherX, motherY);
}

};

export function addSiblings(ego, people, egoX, egoY){

let siblings = [];

if(ego.mother !== ""){
const index = people.findIndex(person => person.id === ego.mother)
const parent = people[index]
const children = parent.children.split(',');
const filter = children.filter(child => child !== ego.id)
siblings = [...siblings, ...filter]
}

if(ego.father !== ""){
const index = people.findIndex(person => person.id === ego.father)
const parent = people[index]
const children = parent.children.split(',');
const filter = children.filter(child => child !== ego.id)
siblings = [...siblings, ...filter]
}

//console.log(ego.id, siblings)

if(siblings.length > 0){
siblings.forEach(sibling => {
//Add Sibling
console.log('...adding Sibling')
const person = people.find(person => person.id === sibling)
const siblingX = egoX + (nodeSpace * 2)
const siblingY = egoY 

if(person && !duplicates.includes(person)){
duplicates.push(person);
drawNode(person, siblingX, siblingY);
addSpouse(person, people, siblingX, siblingY)

}

})
}

};

export function addSpouse(ego, people, egoX, egoY){

const spouse = people.find(person => person.id === ego.spouse);

//Add Spouse
const spouseX = egoX - (nodeSpace /2)
const spouseY = egoY 

if(spouse && !duplicates.includes(spouse)){
drawNode(spouse, spouseX, spouseY)
addParents(spouse, people, spouseX, spouseY)
}

};

export function addChildren(ego, people, egoX, egoY){

const children = ego.children.split(',');

children.forEach((child, index) => {

//Add Child
const person = people.find(person => person.id === child);

const cousins = findCousins(person, people);
//console.log(person.firstName, cousins)

const childX = egoX + ((nodeSpace) * (index + cousins));
const childY = egoY + (nodeSpace);

if(person && !duplicates.includes(person)){
duplicates.push(person)
//console.log('...adding ' + person.firstName + ' child of ' + ego.firstName)
drawNode(person, childX, childY)
addSpouse(person, people, childX, childY)
addChildren(person, people, childX, childY)

}

})

};

export function findCousins(ego, people){

let grandParents = [];
let cousins = [];

try{

const parents = people.filter(person => person.id === ego.father || person.id === ego.mother);
//console.log(ego.firstName + ' parents:', parents)

parents.forEach(parent => {

const filter =  people.filter(person => person.id === parent.father || person.id === parent.mother);
//console.log('Grandparents:', filter)

grandParents = [...grandParents, ...filter];


});

grandParents.forEach(grandParent => {

const auncles = people.filter(person => 
person.father === grandParent.id && person.id !== ego.father && person.id !== ego.mother || 
person.mother === grandParent.id && person.id !== ego.father && person.id !== ego.mother);

//console.log(auncles)

auncles.forEach(ego => {

if(ego.children !== ""){

const children = ego.children.split(',');

cousins = [...cousins, ...children]

}

})



})

///Filter only duplicate (so already drawn).
const duplicatedIDs = duplicates.map(duplicate => duplicate.id)
cousins = cousins.filter(cousin => duplicatedIDs.includes(cousin))

//Filter only Unique Values.
cousins = Array.from(new Set(cousins));

cousinsArray.push({id: ego.id, number: cousins.length});

//console.log(cousins)

return cousins.length;

}catch{

return 0
}
};







