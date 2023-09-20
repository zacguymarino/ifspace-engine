import { switchNode, game } from "./if_generate.js";

var universe = $("#nodeMap")[0];
var ctx = universe.getContext("2d");
var xTransform = (window.innerWidth * 0.4) / 2;
var yTransform = (window.innerHeight * 0.65) / 2;
var step = 25;

var nodes = ["0,0,0"];

var currentNode = "0,0,0";

var palette = {
  "0": "#003CFF",
  "1": "#007FFF",
  "2": "#00FFFF",
  "3": "#43B3AE",
  "4": "#008000",
  "5": "#32CD32",
  "6": "#FFFF00",
  "7": "#FFBF00",
  "8": "#FFA500",
  "9": "#FF0000",
  "10": "#FF00FF",
  "11": "#800080",
  "12": "#4B0082",
  "13": "#36454F",
  "14": "#808080",
  "15": "#FFFFF7",
}

function createMapFromGame(loadNodes) {
  nodes = JSON.parse(JSON.stringify(loadNodes));
  currentNode = "0,0,0";
  draw();
}

function resizeCanvas() {
  var universe = $("#nodeMap")[0];
  universe.width = window.innerWidth * 0.4;
  universe.height = window.innerHeight * 0.65;
  draw();
}

function nodeMap() {
  universe.width = window.innerWidth * 0.4;
  universe.height = window.innerHeight * 0.65;
  var mouseStart;
  var possibleClick = false;
  var dragTotalX = 0;
  var dragTotalY = 0;

  // Mouse event handling:
  const getPos = (e) => ({
    x: e.clientX - universe.offsetLeft,
    y: e.clientY - universe.offsetTop,
  });

  const reset = (e) => {
    if (
        Math.sqrt(Math.pow(dragTotalX, 2) + Math.pow(dragTotalY, 2)) <=
        Math.sqrt(2) &&
        mouseStart &&
        possibleClick
    ) {
      getClickCoords(e);
    }
    xTransform += dragTotalX;
    yTransform += dragTotalY;
    dragTotalY = 0;
    dragTotalX = 0;
    mouseStart = null;
    possibleClick = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset translation
    draw();
  };

  universe.addEventListener("mousedown", (e) => {
    reset(e);
    mouseStart = getPos(e);
  });

  universe.addEventListener("mouseup", (e) => {
    possibleClick = true;
    reset(e);
  });

  universe.addEventListener("mouseleave", (e) => {
    reset(e);
  });

  universe.addEventListener("mousemove", (e) => {
    // Only move the grid when we registered a mousedown event
    if (!mouseStart) return;
    let pos = getPos(e);
    //Update total translation
    let mouseChangeX = pos.x - mouseStart.x;
    let mouseChangeY = pos.y - mouseStart.y;
    // Move coordinate system in the same way as the cursor
    ctx.translate(mouseChangeX, mouseChangeY);
    draw();
    dragTotalX += mouseChangeX;
    dragTotalY += mouseChangeY;
    mouseStart = pos;
  });

  draw(); // on page load
}

function getColor(color) {
  if (palette.hasOwnProperty(color)) {
    return palette[color];
  } else {
    return palette['0'];
  }
}

function draw(newKey) {
  if (newKey != undefined) {
    currentNode = newKey;
  }
  let nodeAndColorArray = [];
  for (let i = 0; i < nodes.length; i++) {
    if (game.hasOwnProperty(nodes[i])) {
      nodeAndColorArray.push({
        "node": nodes[i],
        "color": game[nodes[i]].color
      })
    }
  }

  let left = 0.5 - Math.ceil(universe.width / step) * step;
  let top = 0.5 - Math.ceil(universe.height / step) * step;
  let right = 2 * universe.width;
  let bottom = 2 * universe.height;

  let worldSize = step * 0.7;

  ctx.clearRect(left, top, right - left, bottom - top);
  ctx.beginPath();
  //Get most recent offset from previous drags
  let xOffset = xTransform % step;
  let yOffset = yTransform % step;

  //draw grid
  for (let x = left; x < right; x += step) {
    ctx.moveTo(x + xOffset, top);
    ctx.lineTo(x + xOffset, bottom);
  }
  for (let y = top; y < bottom; y += step) {
    ctx.moveTo(left, y + yOffset);
    ctx.lineTo(right, y + yOffset);
  }
  ctx.strokeStyle = "#888";
  ctx.stroke();

  //draw nodes
  for (let i = 0; i < nodeAndColorArray.length; i++) {
    let x = JSON.parse(`[${nodeAndColorArray[i]["node"]}]`)[0];
    let y = JSON.parse(`[${nodeAndColorArray[i]["node"]}]`)[1];
    let z = JSON.parse(`[${nodeAndColorArray[i]["node"]}]`)[2];

    if ($("#zIndex").val() == z) {
      let xLoc = x * step + (step - worldSize) / 2;
      let yLoc = -1 * (y * step) + (step - worldSize) / 2;
      ctx.fillStyle = getColor(nodeAndColorArray[i]["color"]);
      ctx.fillRect(xLoc + xTransform, yLoc + yTransform, worldSize, worldSize);
    }
  }
  let cX = JSON.parse(`[${currentNode}]`)[0];
  let cY = JSON.parse(`[${currentNode}]`)[1];
  let cZ = JSON.parse(`[${currentNode}]`)[2];
  if ($("#zIndex").val() == cZ) {
    let xLoc = cX * step + (step - worldSize) / 2;
    let yLoc = -1 * (cY * step) + (step - worldSize) / 2;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(xLoc + xTransform, yLoc + yTransform, worldSize, worldSize);
  }
}

function zoom(baseId) {
  switch (baseId) {
    case "zoomIn":
      step += 5;
      draw();
      break;
    case "zoomOut":
      if (step > 5) {
        step -= 5;
        draw();
      }
      break;
    default:
      break;
  }
}

async function getClickCoords(event) {
  let x = (event.clientX - 
            universe.offsetLeft - 
            xTransform) / 
            step;
  let y =
    (event.clientY -
      universe.offsetTop +
      $(document).scrollTop() -
      yTransform) /
      step;
  let z = $("#zIndex").val();
  let coordsTitle;
  x = Math.floor(x);
  y = -1 * Math.floor(y);
  coordsTitle = `${x},${y},${z}`;
  if (nodes.includes(coordsTitle)) {
    makeAndSwitchNode(coordsTitle);
  } else {
    if (await window.IFS_API.createNode() == 0) {
      makeAndSwitchNode(coordsTitle);
    }
  }
}

function makeAndSwitchNode(title) {
  if (!nodes.includes(title)) {
    nodes.push(title);
  }
  currentNode = title;
  switchNode(currentNode);
  draw();
}

export { nodeMap, resizeCanvas, zoom, draw, currentNode, createMapFromGame, palette };
