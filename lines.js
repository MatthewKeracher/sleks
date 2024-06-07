import { returnRect, findPersonById, calculateMidpoint, convertWidth, convertHeight } from "./helper.js";
import { duplicates, nodeSpace } from "./nodes.js";

let marriages = []

export function addMarriageLine(people){

    let husbands = people.filter(person => person.spouse !== "" && person.gender === "male");
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
    const x1 = husbandRect.right + window.scrollX - 10;
    const y1 = husbandRect.top + husbandRect.height / 2 + window.scrollY;
    const x2 = wifeRect.left + window.scrollX;
    const y2 = wifeRect.top + wifeRect.height / 2 + window.scrollY;
    
    line.style.width = x2>x1? `${x2 - x1}px` : `${x1 - x2}px`;
    line.style.top = `${y1}px`;
    line.style.left = x2>x1? `${x1}px` : `${x2}px`;
    
    const treeContainer = document.getElementById("tree");
    treeContainer.appendChild(line);
    
    // Calculate and return the midpoint
    const midpoint = calculateMidpoint(x1, y1, x2, y2);
    
    marriages.push({id: husband.id, x: midpoint.xMid, y: midpoint.yMid})
    });
    
    };
    
    export function addChildrenLines(people){
    
    let children = duplicates.filter(person => person.mother !== "" || person.father !== "");
    
    const colors = ["red", "orange", "green", "indigo", "orange"]
    
    children.forEach(child =>{
    const childRect = returnRect(child.id);
    const x1 = childRect.left + childRect.width / 2 + window.scrollX;
    const y1 = childRect.top + childRect.height / 2 + window.scrollY;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    let x2;
    let y2;
    
    const mother = people.find(mother => mother.id === child.mother);
    const father = people.find(father => father.id === child.father);
    
    if(mother){
    const motherRect = returnRect(mother.id);
    x2 = motherRect.left + motherRect.width / 2 + window.scrollX;
    y2 = motherRect.top + motherRect.height + window.scrollY;
    drawLine(x1, x2, y1, y2, color)
    }else if(father){
    const fatherRect = returnRect(father.id);
    x2 = fatherRect.left + fatherRect.width / 2 + window.scrollX;
    y2 = fatherRect.top + fatherRect.height + window.scrollY;
    drawLine(x1, x2, y1, y2, color)
    }
    
    });
    
    };
    
    export function drawLine(x1, x2, y1, y2, color){
    
    const line = document.createElement('div');
    line.classList.add('childLine');
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;
    line.style.borderTop = '5px dotted ' + color;
    
    const treeContainer = document.getElementById("tree");
    treeContainer.appendChild(line);
    
    }