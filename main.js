// Basic interactivity required by the assignment:
// 1) theme toggle
// 2) footer year
// 3) simple form validation (no backend)

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    themeBtn.setAttribute("aria-pressed", String(next === "light"));
  });
}

const form = document.getElementById("contactForm");
const errorEl = document.getElementById("formError");

if (form && errorEl) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 2) {
      errorEl.textContent = "Please enter a valid name (at least 2 characters).";
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      errorEl.textContent = "Please enter a valid email address.";
      return;
    }
    if (message.length < 10) {
      errorEl.textContent = "Message should be at least 10 characters.";
      return;
    }

    // No backend required — show success feedback
    errorEl.style.color = "var(--accent)";
    errorEl.textContent = "Message validated ✅ (This demo form does not send emails.)";
    form.reset();

    setTimeout(() => {
      errorEl.style.color = "";
    }, 1000);
  });
}