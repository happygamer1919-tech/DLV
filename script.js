// Smooth scroll for in-page nav links
document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Section tracking for trucks, nav highlight, and content animation
(function () {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!sections.length) return;

  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  let currentActiveId = null;

  function setActiveSection(id) {
    if (!id || currentActiveId === id) return;

    if (currentActiveId) {
      document.body.classList.remove(`section-${currentActiveId}`);
    }
    document.body.classList.add(`section-${id}`);
    currentActiveId = id;

    sections.forEach((sec) => {
      sec.classList.toggle('section-active', sec.id === id);
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const matches = href === `#${id}`;
      link.classList.toggle('is-active', matches);
    });
  }

  function onScroll() {
    const viewportCenter = window.scrollY + window.innerHeight * 0.35;
    let activeId = sections[0].id;

    for (const sec of sections) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (viewportCenter >= top && viewportCenter < top + height) {
        activeId = sec.id;
        break;
      }
    }

    setActiveSection(activeId);
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll(); // initial call
})();

// Carrier modal and steps
(function () {
  const openBtn = document.getElementById('carrierSetupBtn');
  const modal = document.getElementById('carrierModal');
  if (!openBtn || !modal) return;

  const closeEls = modal.querySelectorAll('[data-modal-close]');
  const steps = Array.from(modal.querySelectorAll('.carrier-step'));
  const prevBtn = document.getElementById('carrierPrevBtn');
  const nextBtn = document.getElementById('carrierNextBtn');
  const submitBtn = document.getElementById('carrierSubmitBtn');
  const form = document.getElementById('carrierForm');

  let currentStep = 0;

  function applyStep() {
    steps.forEach((step, idx) => {
      step.classList.toggle('is-active', idx === currentStep);
    });

    if (currentStep === 0) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    } else if (currentStep === steps.length - 1) {
      prevBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      prevBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  }

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    currentStep = 0;
    applyStep();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeEls.forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      applyStep();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep -= 1;
      applyStep();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
      // if valid, browser opens email draft via mailto
    });
  }
})();
