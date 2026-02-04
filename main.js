// Required JS interactivity for the assignment:
// - Theme toggle
// - Footer year
// - Copy email button

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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