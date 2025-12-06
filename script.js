// Smooth scroll for in page nav links
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

// ===== Page-by-page scroll (A4 pages feeling) =====
(function () {
  const stack = document.querySelector('.page-stack');
  const sections = Array.from(document.querySelectorAll('main .section'));
  if (!stack || !sections.length) return;

  let isSnapping = false;

  function currentSectionIndex() {
    const scrollTop = stack.scrollTop;
    let bestIdx = 0;
    let bestDelta = Infinity;

    sections.forEach((sec, idx) => {
      const delta = Math.abs(sec.offsetTop - scrollTop);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIdx = idx;
      }
    });

    return bestIdx;
  }

  stack.addEventListener(
    'wheel',
    (e) => {
      const delta = e.deltaY;
      if (Math.abs(delta) < 20) return;
      if (isSnapping) return;

      e.preventDefault();

      const idx = currentSectionIndex();
      let targetIdx = idx;

      if (delta > 0 && idx < sections.length - 1) {
        targetIdx = idx + 1;
      } else if (delta < 0 && idx > 0) {
        targetIdx = idx - 1;
      }

      if (targetIdx === idx) return;

      isSnapping = true;
      sections[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isSnapping = false;
      }, 900);
    },
    { passive: false }
  );
})();

// ===== Section activation + nav highlight =====
(function () {
  const sections = Array.from(document.querySelectorAll('main .section'));
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  if (!sections.length || !navLinks.length) return;

  const linkForId = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href');
    if (id) linkForId.set(id.replace('#', ''), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (!id) return;

        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');

          navLinks.forEach((l) => l.classList.remove('is-active'));
          const match = linkForId.get(id);
          if (match) match.classList.add('is-active');
        }
      });
    },
    {
      root: document.querySelector('.page-stack'),
      threshold: 0.6
    }
  );

  sections.forEach((sec) => observer.observe(sec));
})();

// ===== Carrier modal and steps =====
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
    });
  }
})();
