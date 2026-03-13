// Get rightPanel dimensions and calculate center
const rightPanel = document.getElementById("rightPanel");

function eraseNodes() {
  const existingNodes = document.querySelectorAll(".node");
  existingNodes.forEach((node) => node.remove());
}


function drawEgo(ego = window.currentPerson){

const rightPanel = document.getElementById("rightPanel");
const panelRect = rightPanel.getBoundingClientRect();


}



function drawFamily(ego = window.currentPerson) {
  const rightPanel = document.getElementById("rightPanel");
  const panelRect = rightPanel.getBoundingClientRect();

  // Draw ego in center
  const startX = panelRect.width / 2 - 50;
  const startY = panelRect.height / 2 - 50;
  drawNode(ego, startX, startY);

  // Get ego position once
  const egoX = startX;
  const egoY = startY;

  // **NEW: Draw grandparents (parents of parents)**
  // Paternal grandparents (father's parents)
  if (Object.keys(ego.father).length > 0) {
    if (Object.keys(ego.father.father).length > 0) {
      drawNode(ego.father.father, egoX - 250, egoY - 400, "grandparent");
    }
    if (Object.keys(ego.father.mother).length > 0) {
      drawNode(ego.father.mother, egoX - 100, egoY - 400, "grandparent");
    }
  }
  
  // Maternal grandparents (mother's parents)
  if (Object.keys(ego.mother).length > 0) {
    if (Object.keys(ego.mother.father).length > 0) {
      drawNode(ego.mother.father, egoX + 100, egoY - 400, "grandparent");
    }
    if (Object.keys(ego.mother.mother).length > 0) {
      drawNode(ego.mother.mother, egoX + 250, egoY - 400, "grandparent");
    }
  }

  // Draw parents (existing)
  if (Object.keys(ego.father).length > 0) {
    drawNode(ego.father, egoX - 100, egoY - 200, "parent");
  }
  if (Object.keys(ego.mother).length > 0) {
    drawNode(ego.mother, egoX + 100, egoY - 200, "parent");
  }

  // Draw spouse (existing)
  if (Object.keys(ego.spouse).length > 0) {
    drawNode(ego.spouse, egoX + 200, egoY, "spouse");
  }

  // Draw ego's children (using getter)
  ego.children.forEach((child, index) => {
    drawNode(
      child,
      egoX + (index - ego.children.length / 2) * 150,
      egoY + 200,
      "child",
    );
  });

  // Draw siblings + spouses + children (existing)
  const siblings = ego.siblings;
  siblings.forEach((sibling, index) => {
    const siblingX = egoX + 400 + index * 150;
    drawNode(sibling, siblingX, egoY, "sibling");
    
    if (Object.keys(sibling.spouse).length > 0) {
      drawNode(sibling.spouse, siblingX + 200, egoY, "sibling-spouse");
    }
    
    sibling.children.forEach((child, childIndex) => {
      drawNode(
        child,
        siblingX + (childIndex - sibling.children.length / 2) * 100,
        egoY + 200,
        "niece-nephew",
      );
    });
  });
}


