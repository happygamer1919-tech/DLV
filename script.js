// Smooth scroll for nav links and hero button
document.querySelectorAll('a[href^="#"], [data-scroll-target]').forEach(el => {
  el.addEventListener("click", e => {
    const targetId = el.getAttribute("href") || el.getAttribute("data-scroll-target");
    if (!targetId || !targetId.startsWith("#")) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = 70; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  });
});

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("is-open");
  });

  navList.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      navList.classList.remove("is-open");
    }
  });
}

// Active link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-list a");

function setActiveNav() {
  let currentId = null;

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 90 && rect.bottom >= 140) {
      currentId = "#" + sec.id;
    }
  });

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentId) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);

// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
