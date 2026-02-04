const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

function clear(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -------------------- 1) BAR CHART (personal, one dataset) --------------------
function drawBarChart(svg, data, titleText) {
  clear(svg);

  const W = 800, H = 420;
  const padding = { top: 50, right: 24, bottom: 78, left: 56 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const maxValue = 8; // adjust if you want a larger range
  const ticks = [0, 2, 4, 6, 8];

  // Title
  const title = el("text", { x: padding.left, y: 30, "font-size": 18 });
  title.textContent = titleText;
  svg.appendChild(title);

  // Axes
  svg.appendChild(el("line", {
    x1: padding.left, y1: padding.top + innerH,
    x2: padding.left + innerW, y2: padding.top + innerH,
    stroke: "currentColor", "stroke-opacity": 0.35
  }));
  svg.appendChild(el("line", {
    x1: padding.left, y1: padding.top,
    x2: padding.left, y2: padding.top + innerH,
    stroke: "currentColor", "stroke-opacity": 0.35
  }));

  // Grid + y labels
  ticks.forEach((v) => {
    const y = padding.top + innerH - (v / maxValue) * innerH;

    svg.appendChild(el("line", {
      x1: padding.left, y1: y,
      x2: padding.left + innerW, y2: y,
      stroke: "currentColor", "stroke-opacity": 0.12
    }));

    const t = el("text", {
      x: padding.left - 10,
      y: y + 4,
      "text-anchor": "end",
      "font-size": 12,
      fill: "currentColor",
      "fill-opacity": 0.75
    });
    t.textContent = String(v);
    svg.appendChild(t);
  });

  const barGap = 14;
  const barW = (innerW - barGap * (data.length - 1)) / data.length;

  data.forEach((d, i) => {
    const x = padding.left + i * (barW + barGap);
    const h = (d.value / maxValue) * innerH;
    const y = padding.top + (innerH - h);

    // Group for each bar
    const g = el("g");

    // Filled bar (hover anywhere inside)
    const rect = el("rect", {
      x, y, width: barW, height: h,
      rx: 12,
      fill: "currentColor",
      "fill-opacity": 0.18,
      stroke: "currentColor",
      "stroke-opacity": 0.55
    });

    // Tooltip (native)
    const tip = el("title");
    tip.textContent = `${d.label}: ${d.value}h/week`;
    rect.appendChild(tip);

    // Value label (appears on hover)
    const valueText = el("text", {
      x: x + barW / 2,
      y: y - 8,
      "text-anchor": "middle",
      "font-size": 12,
      fill: "currentColor",
      "fill-opacity": 0
    });
    valueText.textContent = `${d.value}h`;

    rect.addEventListener("mouseenter", () => {
      rect.setAttribute("fill-opacity", "0.30");
      rect.setAttribute("stroke-opacity", "0.9");
      valueText.setAttribute("fill-opacity", "0.95");
    });
    rect.addEventListener("mouseleave", () => {
      rect.setAttribute("fill-opacity", "0.18");
      rect.setAttribute("stroke-opacity", "0.55");
      valueText.setAttribute("fill-opacity", "0");
    });

    g.appendChild(rect);
    g.appendChild(valueText);
    svg.appendChild(g);

    // X label
    const t = el("text", {
      x: x + barW / 2,
      y: padding.top + innerH + 28,
      "text-anchor": "middle",
      "font-size": 12,
      fill: "currentColor",
      "fill-opacity": 0.85
    });
    t.textContent = d.label;
    svg.appendChild(t);
  });
}

const chartSvg = document.getElementById("chart");
if (chartSvg) {
  // Edit these numbers to match your real-ish weekly time
  const interestsData = [
    { label: "Badminton", value: 4 },
    { label: "Cafés", value: 2 },
    { label: "Cooking", value: 3 },
    { label: "Design", value: 6 },
    { label: "Friends", value: 4 }
  ];

  drawBarChart(chartSvg, interestsData, "Weekly Interests (approx. hours/week)");
}

// -------------------- 2) CREATIVE SVG ART: SpongeBob (simple) --------------------
function drawSpongeBob(svg) {
  clear(svg);

  const W = 800, H = 420;

  // Background frame
  svg.appendChild(el("rect", {
    x: 16, y: 16, width: W - 32, height: H - 32,
    rx: 18,
    fill: "transparent",
    stroke: "currentColor",
    "stroke-opacity": 0.35
  }));

  // Center the character
  const g = el("g", { transform: "translate(260, 40)" });
  svg.appendChild(g);

  // Colors (keep simple + theme-safe)
  const yellow = "#F6E05E";
  const brown = "#8B5A2B";
  const white = "#FFFFFF";
  const red = "#E53E3E";
  const blue = "#3182CE";
  const black = "#111111";

  // Body (SpongeBob square)
  g.appendChild(el("rect", {
    x: 80, y: 20, width: 240, height: 220,
    rx: 18,
    fill: yellow,
    stroke: black,
    "stroke-width": 3
  }));

  // Sponge holes (random-ish but simple)
  const holes = [
    { cx: 120, cy: 70, r: 10 },
    { cx: 170, cy: 55, r: 6 },
    { cx: 260, cy: 80, r: 12 },
    { cx: 230, cy: 140, r: 8 },
    { cx: 140, cy: 150, r: 12 },
    { cx: 280, cy: 170, r: 7 }
  ];
  holes.forEach(h => {
    g.appendChild(el("circle", {
      cx: h.cx, cy: h.cy, r: h.r,
      fill: "rgba(0,0,0,0.08)",
      stroke: "rgba(0,0,0,0.15)",
      "stroke-width": 2
    }));
  });

  // Eyes (big circles)
  g.appendChild(el("circle", { cx: 165, cy: 105, r: 40, fill: white, stroke: black, "stroke-width": 3 }));
  g.appendChild(el("circle", { cx: 235, cy: 105, r: 40, fill: white, stroke: black, "stroke-width": 3 }));

  // Iris + pupil
  g.appendChild(el("circle", { cx: 165, cy: 110, r: 16, fill: blue, stroke: black, "stroke-width": 2 }));
  g.appendChild(el("circle", { cx: 235, cy: 110, r: 16, fill: blue, stroke: black, "stroke-width": 2 }));
  g.appendChild(el("circle", { cx: 165, cy: 112, r: 7, fill: black }));
  g.appendChild(el("circle", { cx: 235, cy: 112, r: 7, fill: black }));

  // Nose
  g.appendChild(el("rect", {
    x: 192, y: 132, width: 16, height: 28,
    rx: 8,
    fill: yellow,
    stroke: black,
    "stroke-width": 3
  }));

  // Smile (simple path)
  g.appendChild(el("path", {
    d: "M 150 170 C 175 200, 225 200, 250 170",
    fill: "none",
    stroke: black,
    "stroke-width": 4,
    "stroke-linecap": "round"
  }));

  // Teeth
  g.appendChild(el("rect", { x: 186, y: 182, width: 14, height: 18, fill: white, stroke: black, "stroke-width": 2 }));
  g.appendChild(el("rect", { x: 205, y: 182, width: 14, height: 18, fill: white, stroke: black, "stroke-width": 2 }));

  // Shirt
  g.appendChild(el("rect", {
    x: 80, y: 240, width: 240, height: 40,
    fill: white,
    stroke: black,
    "stroke-width": 3
  }));

  // Tie
  g.appendChild(el("polygon", {
    points: "200,250 185,270 200,290 215,270",
    fill: red,
    stroke: black,
    "stroke-width": 2
  }));
  g.appendChild(el("polygon", {
    points: "200,290 188,330 212,330",
    fill: red,
    stroke: black,
    "stroke-width": 2
  }));

  // Pants
  g.appendChild(el("rect", {
    x: 80, y: 280, width: 240, height: 70,
    fill: brown,
    stroke: black,
    "stroke-width": 3
  }));

  // Belt line
  g.appendChild(el("line", {
    x1: 80, y1: 300, x2: 320, y2: 300,
    stroke: black,
    "stroke-width": 3,
    "stroke-opacity": 0.6
  }));

  // Legs
  g.appendChild(el("line", { x1: 145, y1: 350, x2: 145, y2: 385, stroke: black, "stroke-width": 4 }));
  g.appendChild(el("line", { x1: 255, y1: 350, x2: 255, y2: 385, stroke: black, "stroke-width": 4 }));

  // Shoes (simple)
  g.appendChild(el("ellipse", { cx: 145, cy: 395, rx: 28, ry: 12, fill: black }));
  g.appendChild(el("ellipse", { cx: 255, cy: 395, rx: 28, ry: 12, fill: black }));

  // Caption
  const cap = el("text", { x: 34, y: 54, "font-size": 16, fill: "currentColor", "fill-opacity": 0.9 });
  cap.textContent = "Simple SVG character (generated with JS)";
  svg.appendChild(cap);
}

const artSvg = document.getElementById("artSvg");
const regenBtn = document.getElementById("regen");

function regenArt() {
  if (artSvg) drawSpongeBob(artSvg);
}

if (regenBtn) regenBtn.addEventListener("click", regenArt);
regenArt();