import { findPersonById, returnRect, getXFactor, returnSiblingsChildren } from "./helper.js";
import {} from "./lines.js";
import {duplicates } from "./script.js";


const nodeWidth = 100;
export let cousinsArray = [];
export let nodeSpace = nodeWidth * 4
export let nodeIndex = 0

function drawNode(ego, X, Y, option){

if(option === 'ego'){
nodeIndex = 0
}else{
nodeIndex++
}

//console.log(ego, X, Y, option)

//Add Node Container
const treeContainer = document.getElementById("tree");
const node = document.createElement("div");

//Get Year for y-axis
//const yearRect = returnRect(ego.birthyear);
//const Y = yearRect.top + window.scrollY;

if(option){
node.classList.add(option);
}

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

// if(duplicates.includes(ego)){
//     const egoDiv = document.getElementById(ego.id)
//     egoDiv.classList.add('ego');
//     }else{
drawNode(ego, X, Y);
duplicates.push(ego); 
// }

addParents(ego, people, X, Y);
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
drawNode(father, fatherX, fatherY, 'father');
addParents(father, people, fatherX, fatherY);
addChildren(father, people, fatherX, fatherY);
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
drawNode(mother, motherX, motherY, 'mother');
addParents(mother, people, motherX, motherY);
addChildren(mother, people, motherX, motherY);
}

};

export function addSpouse(ego, people, egoX, egoY){

const spouse = people.find(person => person.id === ego.spouse);

//Add Spouse
const spouseX = egoX - (nodeSpace /2)
const spouseY = egoY 

if(spouse && !duplicates.includes(spouse)){
drawNode(spouse, spouseX, spouseY, 'spouse')
duplicates.push(spouse);
//addParents(spouse, people, spouseX, spouseY)
}

};

export function addChildren(ego, people, egoX, egoY){

if(ego.children !== ""){

const children = ego.children.split(',');

children.forEach((child, index) => {

//Add Child
const person = people.find(person => person.id === child);

if(person && !duplicates.includes(person)){
duplicates.push(person)

const xFactor = getXFactor(person.id, duplicates);
const siblingX = returnSiblingsChildren(person.id, duplicates)

const childX = index === 0? egoX :  siblingX === 0? (egoX + (nodeSpace * index)): (siblingX + (nodeSpace * index));


const childY = egoY + (nodeSpace);

drawNode(person, childX, childY, 'child')
addSpouse(person, people, childX, childY)
addChildren(person, people, childX, childY)

}

})
}
};











