export function downloadData(data, filename) {
// Convert data to JSON string
const jsonData = JSON.stringify(data, null, 2); // Use null and 2 for pretty formatting

// Create a Blob containing the JSON data
const blob = new Blob([jsonData], { type: 'application/json' });

// Create a temporary link element
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = filename; // Set the filename for the downloaded file

// Programmatically click the link to trigger the download
document.body.appendChild(link);
link.click();

// Clean up
document.body.removeChild(link);
URL.revokeObjectURL(link.href);
}

export function convertPixels(px) {
let viewportWidth = window.innerWidth;
return (px / viewportWidth) * 100;
}

export function returnRect(id){
try{
const div = document.getElementById(id);
const divRect = div.getClientRects();
return divRect[0];
}catch{
console.log(error) 
}

}

export function findPersonById(people, id) {
return people.find(person => person.id === id);

};

// Function to calculate the midpoint of a line
export function calculateMidpoint(x1, y1, x2, y2) {
const xMid = (x1 + x2) / 2;
const yMid = (y1 + y2) / 2;
return { xMid, yMid };
}

export function convertWidth(px) {
let viewportWidth = window.innerWidth;
return (px / viewportWidth) * 100;
}

export function convertHeight(px) {
let viewportHeight = window.innerHeight;
return (px / viewportHeight) * 100;
}

export function countOlderGenerations(egoId, people) {
const person = people.find(person => person.id === egoId);

if (!person) {
return { generations: 0, egoId: null };
}

if (person.father === '' && person.mother === '') {
return { generations: 0, egoId: egoId }; // Base case: no parents, so 0 generations preceding
}

// Recursive case: find generations on both sides
const fatherGenerations = person.father ? countOlderGenerations(person.father, people) : { generations: 0, egoId: null };
const motherGenerations = person.mother ? countOlderGenerations(person.mother, people) : { generations: 0, egoId: null };

if (fatherGenerations.generations > motherGenerations.generations) {
return { generations: 1 + fatherGenerations.generations, egoId: fatherGenerations.egoId };
} else {
return { generations: 1 + motherGenerations.generations, egoId: motherGenerations.egoId };
}
}

export function findTreeStart(egoId, people) {

const person = people.find(person => person.id === egoId);

if (!person) {
return null;
}

if (person.father === '' && person.mother === '') {
return egoId; // Base case: no father, so 0 generations preceding
}

// Recursive case: find generations on both sides
const fatherGenerations = person.father !== null ? countOlderGenerations(person.father, people) : 0;
const motherGenerations = person.mother !== null ? countOlderGenerations(person.mother, people) : 0;

return 1 + Math.max(fatherGenerations, motherGenerations);
}

export function returnSiblingsChildren(egoId, people){

// Check siblings and their descendants
let siblings = [];
let rects = [];

const person = findPersonById(people, egoId);

if (person.mother && person.mother !== "") {
  const mother = findPersonById(people, person.mother);
  if (mother && mother.children) {
    siblings = [...siblings, ...mother.children.split(',').filter(id => id !== person.id)];
  }
}
if (person.father && person.father !== "") {
  const father = findPersonById(people, person.father);
  if (father && father.children) {
    siblings = [...siblings, ...father.children.split(',').filter(id => id !== person.id)];
  }
}

 // Filter only Unique Values.
 siblings = Array.from(new Set(siblings));
    
 siblings.forEach(siblingId => {
   const sibling = findPersonById(people, siblingId);
   
   if (sibling && sibling.id !== egoId) {

    if(sibling.children !== ""){
     
    const children = sibling.children.split(',');

    children.forEach(childId => {
     
      const childRect = returnRect(childId);

      const childX = childRect.left + window.scrollX
      rects.push(childX)
      

    })
    }
   }
 });

 const largestX = rects.length > 0? Math.max(...rects) : 0
 
 return largestX
}

export function editData(data){

  const people = data.people

  people.forEach(person => {

    person.note = person.note? person.note : "Add Note Here."

  })

}


// Function to find the largest generation size and total generations under a given person
export function getXFactor(egoId, people) {
  const person = findPersonById(people, egoId);

  if (!person) {
    return { number: 0, largest: 0 };
  }

  //console.log('SEARCHING WITH... ' + person.firstName)

  let searchedSiblings = [];
  let searchChildren = [];

  // Helper function to recursively count generations
  function countGenerations(person, generationSizes = {}, currentGeneration = 1) {
    
    // Check children
    if (person.children && person.children !== "") {
      const childrenIds = person.children.split(',');

      if (!generationSizes[currentGeneration]) {
        generationSizes[currentGeneration] = 0;
      }
      generationSizes[currentGeneration] += childrenIds.length;

      childrenIds.forEach(childId => {
        const child = findPersonById(people, childId);
        if (child && people.includes(child) && !searchChildren.includes(child)) {

          //console.log('Child: ' + child.firstName)
          searchChildren.push(child)
          countGenerations(child, generationSizes, currentGeneration + 1);
        }
      });
    }

    
    // Check siblings and their descendants
    let siblings = [];

    if (person.mother && person.mother !== "") {
      const mother = findPersonById(people, person.mother);
      if (mother && mother.children) {
        siblings = [...siblings, ...mother.children.split(',').filter(id => id !== person.id)];
      }
    }
    if (person.father && person.father !== "") {
      const father = findPersonById(people, person.father);
      if (father && father.children) {
        siblings = [...siblings, ...father.children.split(',').filter(id => id !== person.id)];
      }
    }

    // Filter only Unique Values.
    siblings = Array.from(new Set(siblings));
    
    siblings.forEach(siblingId => {
      const sibling = findPersonById(people, siblingId);
      
      if (sibling && !searchedSiblings.includes(sibling) && sibling.id !== egoId) {
        //console.log('Sibling: ' + sibling.firstName)
        searchedSiblings.push(sibling);
        countGenerations(sibling, generationSizes, currentGeneration +1);
      }
    });
    
    return generationSizes;
  }

  const generationSizes = countGenerations(person);
  const largestGenerationSize = Object.values(generationSizes).length > 0 ? Math.max(...Object.values(generationSizes)) : 0;
  const totalGenerations = Object.keys(generationSizes).length;

  return { number: totalGenerations, largest: largestGenerationSize };
}





