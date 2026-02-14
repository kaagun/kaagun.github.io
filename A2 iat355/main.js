// Interactions
// - Theme toggle

if (!document.documentElement.hasAttribute("data-theme")) {
  document.documentElement.setAttribute("data-theme", "dark");
}

const themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  // default theme
  if (!document.documentElement.hasAttribute("data-theme")) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    themeBtn.setAttribute("aria-pressed", String(next === "light"));
  });
}
