import { returnRect, findPersonById, convertWidth, convertHeight } from "./helper.js";
import {} from "./lines.js";
import { xArray, duplicates } from "./script.js";


const nodeWidth = 100;
const nodeHeight = 100;
let currentX = 100;
export let cousinsArray = [];
export let nodeSpace = nodeWidth * 4


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

const blankFather = {
      "id": (people.length + 1).toString(),
      "firstName": "Add Father ",
      "middleName": "",
      "familyName": "Node",
      "gender": "male",
      "birthyear": "",
      "mother": "",
      "father": "",
      "spouse": (people.length + 2).toString(),
      "children": child.id
    }

const blankMother = {
      "id": (people.length + 2).toString(),
      "firstName": "Add Mother ",
      "middleName": "",
      "familyName": "Node",
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

let marriages = []
const nodeWidth = 10;

if(father && !duplicates.includes(father)){
duplicates.push(father); 
drawNode(father, fatherX, fatherY);
}else if(!duplicates.includes(father)){
// people.push(blankFather)
// drawNode(blankFather, fatherX, fatherY);
// child.father = blankFather.id
};

let egos = [];
let familyX = [];
let currentX = 20;

const peopleByAge = people.sort((a, b) => {
return a.birthyear - b.birthyear;
});

if(mother && !duplicates.includes(mother)){
duplicates.push(mother); 
drawNode(mother, motherX, motherY);
}else if(!duplicates.includes(mother)){
// people.push(blankMother)
// drawNode(blankMother, motherX, motherY);
// child.mother = blankMother.id
};

//Add Ego
const treeContainer = document.getElementById("tree");
const yearCheck = egos.filter(person => person.birthyear === ego.birthyear).length;

//Return Number of Siblings
const siblingCheck = egos.filter(person => person.mother === ego.mother).length * 4;

const spouse = people.find(person => person.id === ego.spouse);

//Add Spouse
const spouseX = egoX - (nodeSpace / 2)
const spouseY = egoY 

if(spouse && !duplicates.includes(spouse)){
duplicates.push(spouse)
drawNode(spouse, spouseX, spouseY)
addParents(spouse, people, spouseX, spouseY)
addChildren(spouse, people, spouseX, spouseY)
}

}

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

    console.log(cousins)

    return cousins.length;
    
}catch{
    
    return 0
}
}

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

export function drawNode(ego, X, Y){

//Add Node Container
const node = document.createElement("div");


//Determine XY for Node Position
const yearRect = returnRect(ego.birthyear);
const nodeY = convertPixels(yearRect.top + window.scrollY);
let nodeX = '';

const parent = people.find(entry => entry.id === ego.father || entry.id === ego.mother);

if(parent){
    const parentRect = returnRect(parent.id);
    nodeX = convertPixels(parentRect.x +  window.scrollX)
}else{
    currentX = currentX + (nodeWidth * 3)
    familyX.push({name: ego.familyName, x: currentX});
    nodeX = currentX
}

node.classList.add('node');
node.setAttribute('id', ego.id);
node.style.top = Y + 'px';
node.style.left = X + 'px'
xArray.push({id: ego.id, x: X});
treeContainer.appendChild(node);

egos.push(ego);


//Add Name to Node
const name = document.createElement("div");
name.classList.add("name");
name.textContent = `${ego.firstName} ${ego.familyName}`;
name.style.width = nodeWidth + 'vw';
node.appendChild(name);

//Add Shape
let shape = '';

if(ego.gender === "male"){
shape = "triangle"}
else if (ego.gender === "female"){
shape = "circle"}
else { shape = "square"};

const egoShape = document.createElement("div");
egoShape.classList.add(shape);
egoShape.setAttribute('id', ego.id);
node.appendChild(egoShape);

};

export function moveWife(people){

let husbands = people.filter(person => person.spouse !== "" & person.gender === "male");

// singlePeople.forEach(ego =>{

// addChildren(people, ego);

// });

husbands.forEach(husband =>{

const husbandRect = returnRect(husband.id);

//find Wife.
const wife = findPersonById(people, husband.spouse);
const wifeNode = document.getElementById(wife.id);
const wifeRect = returnRect(wife.id);

wifeNode.style.left = convertPixels(husbandRect.left + window.scrollX) + (nodeWidth * 2) + 'vw'


});
}

export function addMarriageLine(people){

let husbands = people.filter(person => person.spouse !== "" & person.gender === "male");
marriages = [];

husbands.forEach(husband =>{

const husbandRect = returnRect(husband.id);

//find Wife.
const wife = findPersonById(people, husband.spouse);
const wifeRect = returnRect(wife.id);

// Add Line for Marriage
const line = document.createElement('div');
line.classList.add('marriageLine');

//Calculate Co-ordinates.
const x1 = husbandRect.left + husbandRect.width / 2 + window.scrollX;
const y1 = husbandRect.top + husbandRect.height / 2 + window.scrollY;
const x2 = wifeRect.left + wifeRect.width / 2 + window.scrollX;
const y2 = wifeRect.top + wifeRect.height / 2 + window.scrollY;

const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

line.style.width = `${length}px`;
line.style.transform = `rotate(${angle}deg)`;
line.style.top = `${y1}px`;
line.style.left = `${x1}px`;

const treeContainer = document.getElementById("tree");
treeContainer.appendChild(line);

// Calculate and return the midpoint
const midpoint = calculateMidpoint(x1, y1, x2, y2);

marriages.push({id: husband.id, x: midpoint.xMid, y: midpoint.yMid})
});

};

export function addChildrenLines(people){

    let children = people.filter(person => person.mother !== "" || person.father !== "");

    children.forEach(child =>{
        
    const childRect = returnRect(child.id);
    const x1 = childRect.left + childRect.width / 2 + window.scrollX;
    const y1 = childRect.top + childRect.height / 2 + window.scrollY;

    const marriage = marriages.find(marriage => marriage.id === child.father);
    
    console.log(child.firstName)

    let x2;
    let y2;

    if(marriage){
    x2 = marriage.x //+ window.scrollX;
    y2 = marriage.y //+ window.scrollY;
    drawLine(x1, x2, y1, y2)
    }else{
    const mother = people.find(mother => mother.id === child.mother);
    const father = people.find(father => father.id === child.father);

    if(mother){
    const motherRect = returnRect(mother.id);
    x2 = motherRect.left + motherRect.width / 2 + window.scrollX;
    y2 = motherRect.top + motherRect.height / 2 + window.scrollY;
    drawLine(x1, x2, y1, y2)
    }
    
    if(father){
    const fatherRect = returnRect(father.id);
    x2 = fatherRect.left + fatherRect.width / 2 + window.scrollX;
    y2 = fatherRect.top + fatherRect.height / 2 + window.scrollY;
    drawLine(x1, x2, y1, y2)
    }
    }

    });
    
};

function drawLine(x1, x2, y1, y2){

    const line = document.createElement('div');
    line.classList.add('childLine');

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;

    const treeContainer = document.getElementById("tree");
    treeContainer.appendChild(line);

}

export function findPersonById(people, id) {
return people.find(person => person.id === id);

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
yearNode.style.height = '200px'
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
