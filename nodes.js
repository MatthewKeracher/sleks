export function addEgo(ego){
//Add Ego
const treeContainer = document.getElementById("tree");
treeContainer.innerHTML = '';

//Add Branch Container
const branch = document.createElement("div");
branch.classList.add('branch');
branch.setAttribute('id', 'branch');
branch.style.top = '35vh';
branch.style.left = '55vh';
branch.style.width = '22vw';
treeContainer.appendChild(branch);

//Add Ego to Branch
const node = document.createElement("div");
node.classList.add("node");
node.textContent = `${ego.firstName} ${ego.familyName}`;
node.setAttribute('id', ego.id);
node.style.top = '10vh';
node.style.left = '3vh';
node.style.width = '10vh';
branch.appendChild(node);

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

};

export function addSpouse(ego, people){

//get Spouse
const spouse = findPersonById(people, ego.spouse)
console.log(spouse)

//add Spouse
const container = document.getElementById("branch");
const node = document.createElement("div");
node.classList.add("node");
node.textContent = `${spouse.firstName} ${spouse.familyName}`;
node.setAttribute('id', spouse.id);
node.style.top = '10vh';
node.style.left = '20vh';
container.appendChild(node);

//add Shape
let shape = '';

if(spouse.gender === "male"){
shape = "triangle"}
else if (spouse.gender === "female"){
shape = "circle"}
else { shape = "square"};

const spouseShape = document.createElement("div");
spouseShape.classList.add(shape);
node.appendChild(spouseShape);

//add Connector
const marriage = document.createElement("div");
marriage.classList.add("married");
marriage.setAttribute('id', 'marriage');
marriage.textContent = '=';
marriage.style.top = '5vh';
marriage.style.left = '15vh';
container.appendChild(marriage);
};

export function addChildren(ego,people){

//find Children
const children = people.filter(child => child.mother === ego.id ||
child.father === ego.id);
console.log(ego.id, children)

//sort Children
const sortedChildren = children.sort((a, b) => {
return new Date(a.birthday).getFullYear() - new Date(b.birthday).getFullYear();
});

const treeContainer = document.getElementById("tree");
const parentContainer = document.getElementById("branch");
const marriage = document.getElementById("marriage").getClientRects();

//Add Branch Container
const branch = document.createElement("div");
branch.classList.add('branch');
branch.setAttribute('id', 'branch2');
branch.style.top = '55vh';
branch.style.left = parentContainer.style.left;
branch.style.width = children.length * 10 + 'vw';
treeContainer.appendChild(branch);

const container = document.getElementById("branch2");

//add Parent Connector
const pLine = document.createElement("div");
pLine.classList.add("line");
//pLine.style.top = (lineY + 1) + 'px';
pLine.style.left = marriage[0].left + 14 + 'px'; // bisect '='
pLine.style.width = 4 + 'px';
pLine.style.top = marriage[0].bottom + 'px'; // stem from '='
pLine.style.height = '115px'

container.appendChild(pLine);


sortedChildren.forEach((child, index) => {

//Add Child
const node = document.createElement("div");
node.classList.add("node");
node.textContent = `${child.firstName} ${child.familyName}`;
node.setAttribute('id', child.id);
node.style.top = '10vh';
node.style.left = (index * 12) + 'vw';
container.appendChild(node);

//Add Shape
let shape = '';

if(child.gender === "male"){
shape = "triangle"}
else if (child.gender === "female"){
shape = "circle"}
else { shape = "square"};

const egoShape = document.createElement("div");
egoShape.setAttribute('id', 'Child' + (index + 1))
egoShape.classList.add(shape);
node.appendChild(egoShape);

});

//add Children Connector
const hLine = document.createElement("div");

//dynamically find lineX and lineY based on firstChild position
const firstChild = document.getElementById('Child1');
const startRect = firstChild.getClientRects();
const lastChild = document.getElementById('Child' + children.length);
const endRect = container.getClientRects();

const lineX = startRect[0].left + 20;
const lineW = endRect[0].width - 120;
const lineY = startRect[0].top - (startRect[0].height);

//add Lines
hLine.classList.add("line");

hLine.style.top = lineY + 'px';
hLine.style.left = lineX + 'px';
hLine.style.width = lineW + 'px';


container.appendChild(hLine);

const lineInterval = (lineW) / (children.length -1);
console.log(lineInterval + 'px')

const i = children.length

for (let j = 0; j < i; j++) {

const vLine = document.createElement("div");

const vlineX = lineInterval * (j)
console.log(vlineX)

vLine.classList.add("line");
vLine.style.top = (lineY + 1) + 'px';
vLine.style.left = lineX + (vlineX) + 'px';
vLine.style.width = 4 + 'px';
vLine.style.height = 10 + 'px';

container.appendChild(vLine);

}

}

export function findPersonById(people, id) {
return people.find(person => person.id === id);

}