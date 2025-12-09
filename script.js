document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".page-section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  // smooth scroll for nav clicks (HTML also has scroll-behavior: smooth)
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    link.addEventListener("click", (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const headerOffset = 72;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    });
  });

  // highlight active nav link while scrolling
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("is-active", href === `#${id}`);
        });
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach((section) => observer.observe(section));

  // footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ===== Carrier modal =====
  const modal = document.getElementById("carrierModal");
  const openBtn = document.getElementById("openCarrierModalBtn");
  const closeBtn = document.getElementById("closeCarrierModalBtn");

  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
        closeModal();
      }
    });
  }

  // ===== Carrier form steps =====
  const steps = document.querySelectorAll(".carrier-step");
  const prevBtn = document.getElementById("carrierPrevBtn");
  const nextBtn = document.getElementById("carrierNextBtn");
  const submitBtn = document.getElementById("carrierSubmitBtn");

  let currentStep = 0;

  function renderStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === currentStep);
    });

    if (!prevBtn || !nextBtn || !submitBtn) return;

    prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";
    nextBtn.style.display =
      currentStep === steps.length - 1 ? "none" : "inline-flex";
    submitBtn.style.display =
      currentStep === steps.length - 1 ? "inline-flex" : "none";
  }

  if (steps.length) {
    renderStep();

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
          currentStep += 1;
          renderStep();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep -= 1;
          renderStep();
        }
      });
    }
  }
});
