import { returnRect, findPersonById, convertWidth, convertHeight } from "./helper.js";
import {} from "./lines.js";


const nodeWidth = 100;
const nodeHeight = 100;
export let duplicates = [];
let currentX = 100;
let nodeSpace = nodeWidth * 2.5

export function addPeople(people){

duplicates = [];
currentX = 100 + window.scrollX;

const noParents = people.filter(person => person.mother === "" && person.father === "");
const sorted = noParents.sort((a, b) => a.birthyear - b.birthyear);

sorted.forEach((ego, index) =>{

const X = currentX + (index * ((noParents.length/(index+1)) * nodeWidth));

// const children = people.filter(person => person.mother === ego.id || person.father === ego.id).length;
// currentX = children * currentX;

if(ego && !duplicates.includes(ego)){
drawNode(ego, X, 100);
addSpouse(ego, people);
addChildren(ego, X, people);
duplicates.push(ego); 
}


})

};

function moveAllRight(ego, people){

const nodes = document.querySelectorAll(".node")

nodes.forEach(node => {

const id = node.getAttribute('id');
const nodeRect = returnRect(id);
const egoRect = returnRect(ego.id)

if(nodeRect.x > egoRect.x){
    const person = findPersonById(id)
    console.log(person)
    const currentLeft = parseInt(node.style.left) || 0;
    node.style.left = `${currentLeft + 10}px`;
}

})

}

function addParents(ego, people){

const parents = people.filter(parent => parent.id === ego.mother || parent.id === ego.father);
const egoRect = returnRect(ego.id);

parents.forEach((parent, index) => {

if(parent && !duplicates.includes(parent)){
const parentX = egoRect.x + (index * nodeSpace);
const parentY = egoRect.y - (nodeSpace * 1);
duplicates.push(parent); 
drawNode(parent, parentX, parentY);
moveAllRight(ego, people);
addChildren(parent, parentX, people)

}

})

}

function addSpouse(ego, people) {

const egoRect = returnRect(ego.id)
const spouse = people.find(person => person.spouse === ego.id);
const spouseX = egoRect.x + (nodeSpace);


if(spouse && !duplicates.includes(spouse)){
duplicates.push(spouse); 
drawNode(spouse, spouseX, egoRect.y);
addParents(spouse, people);
}

};

function addChildren(parent, X, people) {

const children = people.filter(person => person.mother === parent.id || person.father === parent.id);

children.sort((a, b) => {
return new Date(a.birthyear) - new Date(b.birthyear);
});

const parentRect = returnRect(parent.id);

children.forEach((child, index) => {

if(index > 0 && children.length > 1){
const onkle = children[index-1].id
const onkleChildren = people.filter(person => person.mother === onkle || person.father === onkle);
//console.log(child.name, onkleChildren)
}

const childX = X + ((index) * (nodeSpace * 3))


if(!duplicates.includes(child)){
drawNode(child, childX, parentRect.y + (nodeSpace));
duplicates.push(child);
addSpouse(child, people);
addParents(child, people);
addChildren(child, childX, people); 
currentX = childX
}

});
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
