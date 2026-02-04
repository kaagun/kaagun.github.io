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

// -------------------- 2) VERY SIMPLE SVG ART --------------------
function drawSimpleArt(svg) {
  clear(svg);

  const W = 800, H = 420;

  // 1) border
  svg.appendChild(el("rect", {
    x: 16, y: 16, width: W - 32, height: H - 32,
    rx: 18,
    fill: "transparent",
    stroke: "currentColor",
    "stroke-opacity": 0.35
  }));

  // 2) a few random circles
  const count = 12;
  for (let i = 0; i < count; i++) {
    svg.appendChild(el("circle", {
      cx: randomInt(60, W - 60),
      cy: randomInt(60, H - 60),
      r: randomInt(6, 28),
      fill: "currentColor",
      "fill-opacity": 0.12,
      stroke: "currentColor",
      "stroke-opacity": 0.25
    }));
  }

  // 3) one simple polyline “path”
  const points = Array.from({ length: 7 }, () => (
    `${randomInt(60, W - 60)},${randomInt(80, H - 80)}`
  )).join(" ");

  svg.appendChild(el("polyline", {
    points,
    fill: "none",
    stroke: "currentColor",
    "stroke-opacity": 0.45,
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }));

  // caption
  const caption = el("text", { x: 34, y: 54, "font-size": 16, "fill-opacity": 0.9 });
  caption.textContent = "Simple Generative Doodles";
  svg.appendChild(caption);
}

const artSvg = document.getElementById("artSvg");
const regenBtn = document.getElementById("regen");

function regenArt() {
  if (artSvg) drawSimpleArt(artSvg);
}

if (regenBtn) regenBtn.addEventListener("click", regenArt);
regenArt();