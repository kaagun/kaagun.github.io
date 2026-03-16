import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 900;
const height = 560;
const maxShapes = 20;
const baseRadius = 28;

const svg = d3.select("#shapeCanvas");
const countText = document.querySelector("#shapeCount");

let clickCount = 0;
let shapeCount = 0;


const color = d3.scaleOrdinal([
  "#6ee7ff",
  "#ff8fab",
  "#ffd166",
  "#80ed99",
  "#b8a1ff",
  "#f4a261",
  "#90e0ef",
  "#ff6b6b",
  "#caffbf",
  "#a0c4ff"
]);

function updateCounter() {
  countText.textContent = `Shapes: ${shapeCount} / ${maxShapes}`;
}

function polygonPoints(sides, radius) {
  const points = [];
  const angleOffset = -Math.PI / 2; // start from top

  for (let i = 0; i < sides; i++) {
    const angle = angleOffset + (i * 2 * Math.PI) / sides;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push(`${x},${y}`);
  }

  return points.join(" ");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addCircle(x, y, fillColor) {
  const circle = svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 0)
    .attr("fill", fillColor)
    .attr("fill-opacity", 0.9)
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.25)
    .attr("stroke-width", 1.5);

  circle
    .transition()
    .duration(450)
    .ease(d3.easeBackOut)
    .attr("r", baseRadius);
}

function addPolygon(x, y, sides, fillColor) {
  const rotation = Math.random() * 180;

  const group = svg
    .append("g")
    .attr("transform", `translate(${x}, ${y}) rotate(${rotation}) scale(0)`);

  group
    .append("polygon")
    .attr("points", polygonPoints(sides, baseRadius))
    .attr("fill", fillColor)
    .attr("fill-opacity", 0.9)
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.25)
    .attr("stroke-width", 1.5);

  group
    .transition()
    .duration(500)
    .ease(d3.easeBackOut)
    .attr("transform", `translate(${x}, ${y}) rotate(${rotation + 90}) scale(1)`);
}

svg.on("click", function (event) {
  if (shapeCount >= maxShapes) return;

  clickCount++;
  shapeCount++;
  updateCounter();

  const [mouseX, mouseY] = d3.pointer(event, this);

  // Keep shapes inside the canvas bounds a bit better
  const x = clamp(mouseX, baseRadius + 4, width - baseRadius - 4);
  const y = clamp(mouseY, baseRadius + 4, height - baseRadius - 4);

  const fillColor = color(shapeCount);

  if (clickCount <= 2) {
    addCircle(x, y, fillColor);
    return;
  }

  const sides = clickCount;
  addPolygon(x, y, sides, fillColor);
});

updateCounter();