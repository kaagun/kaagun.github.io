// Shared interactivity for the site:
// - Theme toggle (works on any page that has #themeBtn)
// - Footer year (works on pages that have #year)


const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const themeBtn = document.getElementById("themeBtn");

// default theme if none set
if (!document.documentElement.hasAttribute("data-theme")) {
  document.documentElement.setAttribute("data-theme", "dark");
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    themeBtn.setAttribute("aria-pressed", String(next === "light"));
  });
}

