let lastNode = {};
let genX = []

function drawTree(ego = window.currentPerson) {
  const rightPanel = document.getElementById("rightPanel");
  const panelRect = rightPanel.getBoundingClientRect();

  function eraseNodes() {
    const existingNodes = document.querySelectorAll(".node");
    existingNodes.forEach((node) => node.remove());
  }

  eraseNodes(); 

  const ancestor = ego.ancestor;
  const familyTree = ancestor.familyTree;
  lastNode = {}; 
  genX = [];
  drawNode(familyTree, ancestor, 20, 20, "family");
  drawLines();
  centreEgo(ego);
}

function generation(ego, familyTree) {
  // Find which generation contains this ego (ancestor = 0)
  for (let i = 0; i < familyTree.length; i++) {
    if (familyTree[i].some((person) => person === ego)) {
      return i; // Generation number (0 = ancestor)
    }
  }

  return -1; // Not found
}

function drawNode(familyTree, ego, X, Y, option) {
  //if last node is of a younger generation, X = lastNode.X + 200

  if (lastNode.ego) {
    const thisGen = generation(ego, familyTree);
    const lastGen = generation(lastNode.ego, familyTree);

    if (thisGen < lastGen) {
      X = lastNode.X + 400;
    }else{
      X = genX[thisGen] + 300;
    }

    if(ego.father === lastNode.ego || ego.mother === lastNode.ego){
      X = lastNode.X + 75;
    }
  }

  genX[generation(ego, familyTree)] = X; // Store last X for this generation
  lastNode = { ego, X };

  newNode(ego, X, Y, option);
  let spouseX = X + 150;
  let genY = Y + 150;

  //spouse
  if (Object.keys(ego.spouse).length > 0) {
    newNode(ego.spouse, spouseX, Y, "spouse");
  }

  if (ego.children.length > 0) {
    ego.children.forEach((child, index) => {
      const childX = X + (index * 200); //of last descendent
      drawNode(familyTree, child, childX, genY, option);
    });
  }
}

function centreEgo(ego) {
  const egoNode = document.querySelector(`[id="${ego.id}"]`);
  if (egoNode) {

    egoNode.classList.add("ego"); // Add "ego" class to the ego node

    egoNode.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
}

