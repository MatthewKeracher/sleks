import { returnRect, findPersonById, convertWidth, convertHeight } from "./helper.js";
import {} from "./lines.js";


const nodeWidth = 100;
const nodeHeight = 100;
export let duplicates = [];
let currentX = 100;
export let nodeSpace = nodeWidth * 2


export function startTree(ego, people, X, Y){

// duplicates = [];

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

const blankFather = {
      "id": (people.length + 1).toString(),
      "firstName": "Unknown",
      "middleName": "",
      "familyName": child.familyName,
      "gender": "male",
      "birthyear": "",
      "mother": "",
      "father": "",
      "spouse": (people.length + 2).toString(),
      "children": child.id
    }

const blankMother = {
      "id": (people.length + 2).toString(),
      "firstName": "Unknown",
      "middleName": "",
      "familyName": child.familyName,
      "gender": "female",
      "birthyear": "",
      "mother": "",
      "father": "",
      "spouse": (people.length + 1).toString(),
      "children": child.id
    }

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
}else if(!duplicates.includes(father)){
people.push(blankFather)
drawNode(blankFather, fatherX, fatherY);
child.father = blankFather.id
};

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
}else if(!duplicates.includes(mother)){
people.push(blankMother)
drawNode(blankMother, motherX, motherY);
child.mother = blankMother.id
};

}

export function addSpouse(ego, people, egoX, egoY){

const spouse = people.find(person => person.id === ego.spouse);

//Add Spouse
const spouseX = egoX - (nodeSpace * 2)
const spouseY = egoY 

if(spouse && !duplicates.includes(spouse)){
drawNode(spouse, spouseX, spouseY)
addParents(spouse, people, spouseX, spouseY)
}

}

export function addChildren(ego, people, egoX, egoY){

const children = ego.children.split(',');

children.forEach((child, index) => {

//Add Child
const person = people.find(person => person.id === child)
const childX = egoX + ((nodeSpace) * index)
const childY = egoY + nodeSpace

if(person && !duplicates.includes(person)){
drawNode(person, childX, childY)
addSpouse(person, people, childX, childY)
}

})

}


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

console.log(ego.id, siblings)

if(siblings.length > 0){
siblings.forEach(sibling => {
//Add Sibling
const person = people.find(person => person.id === sibling)
const siblingX = egoX + nodeSpace
const siblingY = egoY 

if(person && !duplicates.includes(person)){
duplicates.push(person);
drawNode(person, siblingX, siblingY);
addSpouse(person, people, siblingX, siblingY)

}

})
}

};


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

export function addTimeScale(people) {
// Create a unique set of birth years
const birthYears = [...new Set(people.map(person => person.birthyear))];
const scaleContainer = document.getElementById("yearScale");

// Sort the birth years
birthYears.sort((a, b) => a - b);

// Generate year scale
birthYears.forEach((year, index) => {
const yearNode = document.createElement("div");
yearNode.textContent = year;
yearNode.setAttribute('class', 'date');
yearNode.setAttribute('id', `${year}`);
yearNode.style.height = convertHeight(200) + 'vh'
scaleContainer.appendChild(yearNode);

// Add space between years except for the last year
if (index !== birthYears.length - 1) {
const nextYear = birthYears[index + 1];
const yearDifference = 1 //nextYear - year;

for (let i = 0; i < yearDifference; i++) {
const spaceNode = document.createElement("div");
spaceNode.style.height = '200px';
spaceNode.setAttribute('id', `${year + i}`);
scaleContainer.appendChild(spaceNode);
}
}
});
};
