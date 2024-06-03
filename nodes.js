export function returnRect(id){

const div = document.getElementById(id);
const divRect = div.getClientRects();
return divRect[0];

}

// Function to calculate the midpoint of a line
export function calculateMidpoint(x1, y1, x2, y2) {
    const xMid = (x1 + x2) / 2;
    const yMid = (y1 + y2) / 2;
    return { xMid, yMid };
}



export function addEgo(people){

let egos = [];
let familyX = [];
let currentX = 20;

const peopleByAge = people.sort((a, b) => {
return a.birthyear - b.birthyear;
});

peopleByAge.forEach(ego =>{

//Add Ego
const treeContainer = document.getElementById("tree");
const yearCheck = egos.filter(person => person.birthyear === ego.birthyear).length;
const siblingCheck = egos.filter(person => person.mother === ego.mother).length;

//Is oldest person with the familyName; set familyX.
const family = people.filter(person => person.familyName === ego.familyName);
const sortByAge = family.sort((a, b) => {
return a.birthyear - b.birthyear;
});

let isElder = sortByAge[0] === ego? true:false;

//Add Node Container
const node = document.createElement("div");
const nodeWidth = 8;

//Determine XY for Node Position
const yearRect = returnRect(ego.birthyear);
const nodeY = yearRect.top + window.scrollY;;
let nodeX = '';

if(isElder){
currentX = currentX + (nodeWidth * 1)
familyX.push({name: ego.familyName, x: currentX});
nodeX = currentX}
else{
const familyEntry = familyX.find(entry => entry.name === ego.familyName);
nodeX = familyEntry.x
};

node.classList.add('node');
node.setAttribute('id', ego.id);
node.style.top = nodeY + 'px';
node.style.left = nodeX + (siblingCheck * (nodeWidth * 2)) + (yearCheck * (nodeWidth * 3)) + 'vw'
node.style.width = nodeWidth + 'vw';
treeContainer.appendChild(node);

egos.push(ego);


//Add Name to Node
const name = document.createElement("div");
name.classList.add("name");
name.textContent = `${ego.firstName} ${ego.familyName}`;
name.setAttribute('id', ego.id);
name.style.top = '70px';
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
node.appendChild(egoShape);


})
};

export function addSpouse(people){

let spouses = [];
let marriedPeople = people.filter(person => person.spouse !== "");
let singlePeople = people.filter(person => person.spouse === "");

singlePeople.forEach(ego =>{

addChildren(people, ego);

});

marriedPeople.forEach(ego =>{

const isSpouse = spouses.find(spouse => spouse.id === ego.id);

if(isSpouse === undefined){

//get Spouse
const spouse = findPersonById(people, ego.spouse);

// //move spouseNode
// const spouseRect = returnRect(spouse.id);
// spouseNode.style.left = spouseRect.left + 250 + 'px'
spouses.push(spouse)

// Add spousal connection
const line = document.createElement('div');
line.classList.add('marriageLine');

// Get bounding rectangles again after moving spouseNode
const spouseRect1 = returnRect(ego.id);
const spouseRect2 = returnRect(spouse.id);

const x1 = spouseRect1.left + spouseRect1.width / 2 + window.scrollX;
const y1 = spouseRect1.top + spouseRect1.height / 2 + window.scrollY;
const x2 = spouseRect2.left + spouseRect2.width / 2 + window.scrollX;
const y2 = spouseRect2.top + spouseRect2.height / 2 + window.scrollY;


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

//Children stem from midpoint of the marriage line.
addChildren(people, ego, spouse, midpoint);


}


});

};

export function addChildren(people, ego, spouse, midpoint){

    if(spouse){
    //find Children by Marriage
    const byMarriage = people.filter(
        child => child.mother === ego.id && child.father === spouse.id || 
                 child.father === ego.id && child.mother === spouse.id);

    byMarriage.forEach(child => {
        const line = document.createElement('div');
        line.classList.add('childLine');

        // Get bounding rectangles again after moving spouseNode
        const childRect = returnRect(child.id);

        const x1 = midpoint.xMid;
        const y1 = midpoint.yMid;
        const x2 = childRect.left + childRect.width / 2 + window.scrollX;
        const y2 = childRect.top + childRect.height / 2 + window.scrollY;


        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top = `${y1}px`;
        line.style.left = `${x1}px`;

        const treeContainer = document.getElementById("tree");
        treeContainer.appendChild(line);

        
    })};
    
    
    const egoRect = returnRect(ego.id);

    const x1 = egoRect.left + egoRect.width / 2 + window.scrollX;
    const y1 = egoRect.top + egoRect.height / 2 + window.scrollY;

    //find Children outside marriage.
    let children
    if(spouse){
    children = people.filter(
    child => child.mother === ego.id && child.father !== spouse.id || 
    child.father === ego.id && child.mother !== spouse.id);
    }else{
    children = people.filter(
    child => child.mother === ego.id || 
    child.father === ego.id);
    }

    children.forEach(child => {
    const line = document.createElement('div');
    line.classList.add('childLine');

    // Get bounding rectangles again after moving spouseNode
    const childRect = returnRect(child.id);

    const x2 = childRect.left + childRect.width / 2 + window.scrollX;
    const y2 = childRect.top + childRect.height / 2 + window.scrollY;


    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;

    const treeContainer = document.getElementById("tree");
    treeContainer.appendChild(line);
    });

    }


export function findPersonById(people, id) {
return people.find(person => person.id === id);

}

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
}
