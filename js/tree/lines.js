function drawLines() {
  document.querySelectorAll(".line").forEach((line) => line.remove());

  const spouses = document.querySelectorAll(".spouse");

  spouses.forEach((node) => {
    const id = node.getAttribute("id");
    const ego = people.entries.find((person) => person.id === id);

    // Draw line to spouse
    if (Object.keys(ego.spouse).length > 0) {
      const spouseNode = document.querySelector(`[id="${ego.spouse.id}"]`);
      if (spouseNode) {
        marriageLine(spouseNode, ego);
      }
    }
  });

  const egoNodes = document.querySelectorAll(".ego");

  egoNodes.forEach((node) => {
    const id = node.getAttribute("id");
    const ego = people.entries.find((person) => person.id === id);

    // Create new line for each ego node
    const verticalLine = document.createElement("div");
    verticalLine.classList.add("line", "egoLine");

    // Top middle of ego node
    const x = node.offsetLeft + node.offsetWidth / 2;
    const y = node.offsetTop; // Top edge, not center

    verticalLine.style.width = "2px";
    verticalLine.style.height = "50px"; // Small line
    verticalLine.style.left = x + "px";
    verticalLine.style.top = y - 50 + "px"; // Start 5px above top edge

    document.getElementById("rightPanel").appendChild(verticalLine);

    let parentMidX = x; // default to ego position
    if (ego.father && ego.mother && ego.father.id && ego.mother.id) {
      const fatherNode = document.querySelector(`[id="${ego.father.id}"]`);
      const motherNode = document.querySelector(`[id="${ego.mother.id}"]`);

      if (fatherNode && motherNode) {
        const fatherX = fatherNode.offsetLeft + fatherNode.offsetWidth / 2;
        const motherX = motherNode.offsetLeft + motherNode.offsetWidth / 2;
        parentMidX = (fatherX + motherX) / 2; // MIDPOINT between parents
      }
    }

    const egoTopX = x; // Top of vertical line X
    const egoTopY = y - 50; // Top of vertical line Y

    const distance = Math.abs(parentMidX - egoTopX); // Horizontal distance only

    // NEW: Horizontal line LEFTWARD with dynamic length
    const horizontalLine = document.createElement("div");
    horizontalLine.classList.add("line", "egoHorizontal");

    horizontalLine.style.width = distance + "px";
    horizontalLine.style.height = "2px";
    horizontalLine.style.left = x - distance + "px"; // Start at parent distance LEFT
    horizontalLine.style.top = y - 50 + "px"; // Same Y as vertical top

    document.getElementById("rightPanel").appendChild(horizontalLine);
  });
}

function marriageLine(spouseNode, ego) {
  //Horizontal line between spouses.
  const line = document.createElement("div");
  line.classList.add("line");

  const x2 = spouseNode.offsetLeft + spouseNode.offsetWidth / 2;
  const y2 = spouseNode.offsetTop + spouseNode.offsetHeight / 2;

  line.style.width = 150 + "px";

  line.style.left = x2 + "px";
  line.style.top = y2 + "px";
  document.getElementById("rightPanel").appendChild(line);

  const verticalLine = document.createElement("div");
  verticalLine.classList.add("line", "verticalLine");

  // Vertical Line between Spouses
  if(ego.children.length > 0){
  const spouseLineMidX = x2 + 75; // 150px width / 2
  const spouseLineMidY = y2 + 2; // Assume 4px height line, middle is +2px

  verticalLine.style.width = "2px";
  verticalLine.style.height = "75px";
  verticalLine.style.left = spouseLineMidX + "px";
  verticalLine.style.top = spouseLineMidY + "px";

  document.getElementById("rightPanel").appendChild(verticalLine);
}
}
