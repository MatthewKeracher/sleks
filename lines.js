import { returnRect, findPersonById, calculateMidpoint, convertWidth, convertHeight } from "./helper.js";
import { nodeSpace, cousinsArray } from "./nodes.js";
import { data, duplicates} from "./script.js";

let marriages = []
let lineColor = 'orange'

export function addMarriageLine(people){

let activeSpouse = duplicates.filter(person => person.spouse !== "");
marriages = [];


activeSpouse.forEach(activeSpouse =>{

const activeRect = returnRect(activeSpouse.id);

//find passiveSpouse.
const passiveSpouse = findPersonById(people, activeSpouse.spouse);
const passiveRect = returnRect(passiveSpouse.id);

//check to see if line already drawn
const lineCheck = marriages.find(marriage => marriage.id === passiveSpouse.id)

if(lineCheck){ 
return
}

// Add Line for Marriage
const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.classList.add('marriageLine');

const x1 = activeRect.right + window.scrollX - 10;
const y1 = activeRect.top + activeRect.height / 2 + window.scrollY;
const x2 = passiveRect.left + window.scrollX;
const y2 = passiveRect.top + passiveRect.height / 2 + window.scrollY;

//Calculate Co-ordinates.
line.setAttribute('x1', x1);
line.setAttribute('y1', y1);
line.setAttribute('x2', x2);
line.setAttribute('y2', y2);
line.setAttribute('stroke', lineColor);
line.setAttribute('stroke-width', '5');

const svgContainer = document.getElementById('svgContainer');
svgContainer.appendChild(line);

// Calculate and return the midpoint
const midpoint = calculateMidpoint(x1, y1, x2, y2);

marriages.push({id: activeSpouse.id, x: midpoint.xMid, y: midpoint.yMid})
});

};

export function addChildrenLines(people){

let children = duplicates.filter(person => person.mother !== "" || person.father !== "");

const colors = ["red", "orange", "green", "indigo", "orange"]

children.forEach(child =>{
const childRect = returnRect(child.id);
const x1 = childRect.left + childRect.width / 2 + window.scrollX;
const y1 = childRect.top + childRect.height / 2 + window.scrollY;
const color = lineColor //colors[Math.floor(Math.random() * colors.length)];

let x2;
let y2;

const mother = duplicates.find(mother => mother.id === child.mother);
const father = duplicates.find(father => father.id === child.father);

if(mother){
const motherRect = returnRect(mother.id);
x2 = motherRect.left + motherRect.width / 2 + window.scrollX;
y2 = motherRect.top + motherRect.height + window.scrollY;
drawLine(child, x1, x2, y1, y2, color)
}else if(father){
const fatherRect = returnRect(father.id);
x2 = fatherRect.left + fatherRect.width / 2 + window.scrollX;
y2 = fatherRect.top + fatherRect.height + window.scrollY;
drawLine(child, x1, x2, y1, y2, color)
}

});

};

export function drawLine(child, x1, x2, y1, y2, color){

const svgContainer = document.getElementById('svgContainer');

const midPoint = marriages.find(marriage => marriage.id === child.father);
const cousinsObj = cousinsArray.find(cousins => cousins.id === child.id);

// if(cousinsObj){
// console.log(cousinsObj.number)
// }

//Add Vertical Line from Child Node
const branchLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//branchLine.classList.add('childLine');

const length = (nodeSpace / (2 + (cousinsObj? cousinsObj.number : 0)));

//Child Node Co-ordinates
branchLine.setAttribute('x1', x1);
branchLine.setAttribute('y1', y1);

//Hanging Co-ordinates
branchLine.setAttribute('x2', x1);
branchLine.setAttribute('y2', y2 + length);

//Line Stylings and Append
branchLine.setAttribute('stroke', color);
branchLine.setAttribute('stroke-width', '5');
svgContainer.appendChild(branchLine);

//Add Horizontal Line from Vertical Line Top
const midLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//topLine.classList.add('childLine');

//Hanging Co-ordinates
midLine.setAttribute('x1', x1);
midLine.setAttribute('y1', y2 + length);

//Midpoint Co-ordinates or Parent's
midLine.setAttribute('x2', midPoint? midPoint.x : x2);
midLine.setAttribute('y2', y2 + length);

//Line Stylings and Append
midLine.setAttribute('stroke', color);
midLine.setAttribute('stroke-width', '5');
svgContainer.appendChild(midLine);

//Add Vertical Line from Parent or midPoint to midLine

const topLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//topLine.classList.add('childLine');

//Parent or MidPoint Co-ordinates
topLine.setAttribute('x1', midPoint? midPoint.x : x2);
topLine.setAttribute('y1', y2 - (nodeSpace / 10));

//midLine Co-ordinates
topLine.setAttribute('x2', midPoint? midPoint.x : x2);
topLine.setAttribute('y2', y2 + length);

//Line Stylings and Append
topLine.setAttribute('stroke', color);
topLine.setAttribute('stroke-width', '5');
svgContainer.appendChild(topLine);

}