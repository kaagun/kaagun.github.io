// Shared interactivity for the site:
// - Theme toggle (works on any page that has #themeBtn)
// - Footer year (works on pages that have #year)
// - Copy email (only on index.html if present)

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

// Copy email button only exists on index.html
const copyBtn = document.getElementById("copyEmailBtn");
const statusEl = document.getElementById("copyStatus");

if (copyBtn && statusEl) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("kalkuan03@gmail.com");
      statusEl.textContent = "Copied to clipboard ✅";
    } catch {
      statusEl.textContent = "Could not copy automatically—please copy manually.";
    }
  });
}