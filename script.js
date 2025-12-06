// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Sections for snapping =====
const sections = Array.from(document.querySelectorAll('.page-section'));
let isSnapping = false;

// Easing scroll to a Y position
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = 0.5 - Math.cos(Math.PI * t) / 2; // ease-in-out
    window.scrollTo(0, startY + distance * eased);

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      isSnapping = false;
    }
  }

  requestAnimationFrame(step);
}

function getCurrentSectionIndex() {
  const y = window.scrollY || window.pageYOffset;
  let bestIdx = 0;
  let bestDist = Infinity;

  sections.forEach((sec, idx) => {
    const top = sec.offsetTop;
    const dist = Math.abs(top - y);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = idx;
    }
  });

  return bestIdx;
}

// Wheel-based snap: one scroll = next / previous section
if (sections.length) {
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) return; // allow zoom
      e.preventDefault();
      if (isSnapping) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const current = getCurrentSectionIndex();
      const target = Math.max(
        0,
        Math.min(sections.length - 1, current + dir)
      );

      if (target === current) return;

      isSnapping = true;
      smoothScrollTo(sections[target].offsetTop, 1400); // slower slide
    },
    { passive: false }
  );
}

// Nav links use same scroll function
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();

    isSnapping = true;
    smoothScrollTo(target.offsetTop, 1400);
  });
});

// Active nav highlight
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      let visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const activeId = '#' + visible.target.id;
      navLinks.forEach((link) => {
        const match = link.getAttribute('href') === activeId;
        link.classList.toggle('is-active', match);
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

// ===== Carrier modal + multi-step form =====
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
      // if valid, mailto: opens in client
    });
  }
})();
