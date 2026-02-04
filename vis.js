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

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// -------------------- 1) PERSONAL BAR CHART --------------------
function drawBarChart(svg, config) {
  clear(svg);

  const W = 800, H = 420;
  const padding = { top: 50, right: 24, bottom: 78, left: 56 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const data = config.data;
  const max = config.maxValue;

  // Title
  const title = el("text", { x: padding.left, y: 30, "font-size": 18 });
  title.textContent = config.title;
  svg.appendChild(title);

  // Axes lines
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

  // Gridlines + y ticks
  const ticks = config.ticks;
  ticks.forEach((v) => {
    const y = padding.top + innerH - (v / max) * innerH;

    // gridline
    svg.appendChild(el("line", {
      x1: padding.left, y1: y,
      x2: padding.left + innerW, y2: y,
      stroke: "currentColor", "stroke-opacity": 0.12
    }));

    // tick label
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
    const h = (d.value / max) * innerH;
    const y = padding.top + (innerH - h);

    const g = el("g");
    const rect = el("rect", {
      x, y, width: barW, height: h,
      rx: 12,
      fill: "none",
      stroke: "currentColor",
      "stroke-opacity": 0.65
    });

    // Tooltip
    const tip = el("title");
    tip.textContent = `${d.label}: ${d.value}${config.unit}`;
    rect.appendChild(tip);

    // Value label (on hover)
    const valueText = el("text", {
      x: x + barW / 2,
      y: y - 8,
      "text-anchor": "middle",
      "font-size": 12,
      fill: "currentColor",
      "fill-opacity": 0
    });
    valueText.textContent = `${d.value}${config.unit}`;

    rect.addEventListener("mouseenter", () => {
      rect.setAttribute("stroke-opacity", "1");
      valueText.setAttribute("fill-opacity", "0.9");
    });
    rect.addEventListener("mouseleave", () => {
      rect.setAttribute("stroke-opacity", "0.65");
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

const interestsData = [
  { label: "Badminton", value: 4 },
  { label: "Cafés", value: 2 },
  { label: "Cooking", value: 3 },
  { label: "Design", value: 6 },
  { label: "Friends", value: 4 }
];

const skillsData = [
  { label: "Figma", value: 8 },
  { label: "Adobe", value: 7 },
  { label: "Typography", value: 7 },
  { label: "Wireflows", value: 7 },
  { label: "JS", value: 5 }
];

function renderInterests() {
  if (!chartSvg) return;
  drawBarChart(chartSvg, {
    title: "Kuan’s Weekly Interests (approx.)",
    data: interestsData,
    maxValue: 8,
    ticks: [0, 2, 4, 6, 8],
    unit: "h"
  });
}

function renderSkills() {
  if (!chartSvg) return;
  drawBarChart(chartSvg, {
    title: "Kuan’s Skill Comfort (self-rating)",
    data: skillsData,
    maxValue: 10,
    ticks: [0, 2, 4, 6, 8, 10],
    unit: "/10"
  });
}

// Buttons (optional interactivity on viz page)
const btnInterests = document.getElementById("dataInterests");
const btnSkills = document.getElementById("dataSkills");
if (btnInterests) btnInterests.addEventListener("click", renderInterests);
if (btnSkills) btnSkills.addEventListener("click", renderSkills);

// Default render
renderInterests();

// -------------------- 2) CREATIVE SVG ART: "CAFÉ STAMP CARD" --------------------
const artSvg = document.getElementById("artSvg");
const regenBtn = document.getElementById("regen");

function drawCafeStampCard(svg) {
  clear(svg);

  const W = 800, H = 420;

  // Border frame
  svg.appendChild(el("rect", {
    x: 16, y: 16, width: W - 32, height: H - 32,
    rx: 18,
    fill: "transparent",
    stroke: "currentColor",
    "stroke-opacity": 0.35
  }));

  // Header text
  const header = el("text", { x: 34, y: 54, "font-size": 18, "fill-opacity": 0.9 });
  header.textContent = "Café Stamp Card (generative)";
  svg.appendChild(header);

  const sub = el("text", { x: 34, y: 78, "font-size": 12, "fill-opacity": 0.75 });
  sub.textContent = "Click regenerate • Each circle is a ‘stamp’";
  svg.appendChild(sub);

  // Stamp grid area
  const cols = 5;
  const rows = 2;
  const startX = 110;
  const startY = 140;
  const gapX = 120;
  const gapY = 120;
  const rOuter = 30;

  // Random number of filled stamps
  const filled = randomInt(3, 9);

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = startX + c * gapX;
      const cy = startY + r * gapY;

      // outer stamp ring
      svg.appendChild(el("circle", {
        cx, cy, r: rOuter,
        fill: "transparent",
        stroke: "currentColor",
        "stroke-opacity": 0.55
      }));

      // little “stamp teeth”
      const teeth = 14;
      for (let k = 0; k < teeth; k++) {
        const a = (k / teeth) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * (rOuter + 2);
        const y1 = cy + Math.sin(a) * (rOuter + 2);
        const x2 = cx + Math.cos(a) * (rOuter + 8);
        const y2 = cy + Math.sin(a) * (rOuter + 8);

        svg.appendChild(el("line", {
          x1, y1, x2, y2,
          stroke: "currentColor",
          "stroke-opacity": 0.18
        }));
      }

      // fill some stamps
      count++;
      const isFilled = count <= filled;
      if (isFilled) {
        svg.appendChild(el("circle", {
          cx, cy, r: rOuter - 10,
          fill: "currentColor",
          "fill-opacity": 0.18
        }));

        // tiny icon-like dot cluster
        const dots = randomInt(6, 12);
        for (let d = 0; d < dots; d++) {
          const dx = randomInt(-12, 12);
          const dy = randomInt(-12, 12);
          svg.appendChild(el("circle", {
            cx: cx + dx,
            cy: cy + dy,
            r: randomInt(1, 3),
            fill: "currentColor",
            "fill-opacity": 0.6
          }));
        }
      }
    }
  }

  // Doodle line (a “café trail”)
  const path = el("path", {
    d: makeDoodlePath(W, H),
    fill: "none",
    stroke: "currentColor",
    "stroke-opacity": 0.35,
    "stroke-width": 2,
    "stroke-linecap": "round"
  });
  svg.appendChild(path);

  // Footer text
  const footer = el("text", { x: 34, y: H - 34, "font-size": 12, "fill-opacity": 0.75 });
  footer.textContent = `Stamps collected: ${filled}/10`;
  svg.appendChild(footer);
}

function makeDoodlePath(W, H) {
  // simple random bezier path inside the frame
  const points = Array.from({ length: 6 }, (_, i) => ({
    x: 60 + i * 130 + randomInt(-20, 20),
    y: 250 + randomInt(-80, 80)
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const cx1 = prev.x + randomInt(30, 80);
    const cy1 = prev.y + randomInt(-60, 60);
    const cx2 = cur.x - randomInt(30, 80);
    const cy2 = cur.y + randomInt(-60, 60);
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${cur.x} ${cur.y}`;
  }

  return d;
}

function regenArt() {
  if (artSvg) drawCafeStampCard(artSvg);
}

if (regenBtn) regenBtn.addEventListener("click", regenArt);
regenArt();