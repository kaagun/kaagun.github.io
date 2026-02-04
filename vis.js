const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

// ---------- 1) SVG Visualization: Bar chart ----------
function drawBarChart(svg, data) {
  // Clear
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = 800, H = 420;
  const padding = { top: 40, right: 24, bottom: 70, left: 56 };

  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  // Background
  svg.appendChild(el("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));

  // Title
  const title = el("text", { x: padding.left, y: 28, "font-size": 18 });
  title.textContent = "Skill Confidence (0–100)";
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

  const max = 100;
  const barGap = 14;
  const barW = (innerW - barGap * (data.length - 1)) / data.length;

  data.forEach((d, i) => {
    const x = padding.left + i * (barW + barGap);
    const h = (d.value / max) * innerH;
    const y = padding.top + (innerH - h);

    const rect = el("rect", {
      x, y, width: barW, height: h,
      rx: 10,
      fill: "none",
      stroke: "currentColor",
      "stroke-opacity": 0.6
    });

    // Tooltip (simple)
    const label = el("title");
    label.textContent = `${d.label}: ${d.value}`;
    rect.appendChild(label);

    // Hover effect (no CSS needed)
    rect.addEventListener("mouseenter", () => rect.setAttribute("stroke-opacity", "1"));
    rect.addEventListener("mouseleave", () => rect.setAttribute("stroke-opacity", "0.6"));

    svg.appendChild(rect);

    // X labels
    const t = el("text", {
      x: x + barW / 2,
      y: padding.top + innerH + 24,
      "text-anchor": "middle",
      "font-size": 12,
      fill: "currentColor",
      "fill-opacity": 0.8
    });
    t.textContent = d.label;
    svg.appendChild(t);
  });

  // Y ticks
  [0, 25, 50, 75, 100].forEach((v) => {
    const y = padding.top + innerH - (v / max) * innerH;

    svg.appendChild(el("line", {
      x1: padding.left - 6, y1: y,
      x2: padding.left, y2: y,
      stroke: "currentColor", "stroke-opacity": 0.35
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
}

// ---------- 2) Creative SVG Art ----------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawArt(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = 800, H = 420;

  // frame
  svg.appendChild(el("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));

  // A “constellation” style generative pattern:
  const points = Array.from({ length: 45 }, () => ({
    x: randomInt(40, W - 40),
    y: randomInt(40, H - 40),
    r: randomInt(2, 7)
  }));

  // Connect nearby points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.hypot(dx, dy);

      if (dist < 110) {
        svg.appendChild(el("line", {
          x1: points[i].x, y1: points[i].y,
          x2: points[j].x, y2: points[j].y,
          stroke: "currentColor",
          "stroke-opacity": (1 - dist / 110) * 0.35
        }));
      }
    }
  }

  // Draw points
  points.forEach((p) => {
    const c = el("circle", {
      cx: p.x, cy: p.y, r: p.r,
      fill: "currentColor",
      "fill-opacity": 0.75
    });

    // Tiny interaction: pulse on hover
    c.addEventListener("mouseenter", () => c.setAttribute("fill-opacity", "1"));
    c.addEventListener("mouseleave", () => c.setAttribute("fill-opacity", "0.75"));

    svg.appendChild(c);
  });

  const caption = el("text", { x: 24, y: 30, "font-size": 16, "fill-opacity": 0.9 });
  caption.textContent = "Generative Constellation (click regenerate)";
  svg.appendChild(caption);
}

// ---------- Run ----------
const chartSvg = document.getElementById("chart");
if (chartSvg) {
  const data = [
    { label: "HTML", value: 78 },
    { label: "CSS", value: 70 },
    { label: "JS", value: 62 },
    { label: "SVG", value: 66 },
    { label: "Figma", value: 80 }
  ];
  drawBarChart(chartSvg, data);
}

const artSvg = document.getElementById("artSvg");
const regenBtn = document.getElementById("regen");

function regen() {
  if (artSvg) drawArt(artSvg);
}
if (regenBtn) regenBtn.addEventListener("click", regen);
regen();