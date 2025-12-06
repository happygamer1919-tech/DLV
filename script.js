// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Page stack + sections (for snap scrolling) =====
const stack = document.querySelector('.page-stack');
const sections = stack
  ? Array.from(stack.querySelectorAll('.page-section'))
  : Array.from(document.querySelectorAll('section'));

let isSnapping = false;

// Helper: smooth scroll inside the stack with custom duration
function smoothScrollToSection(container, targetSection, duration) {
  if (!container || !targetSection) return;

  const start = container.scrollTop;
  const end = targetSection.offsetTop;
  const distance = end - start;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    // ease-in-out curve
    const eased = 0.5 - Math.cos(Math.PI * t) / 2;
    container.scrollTop = start + distance * eased;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      isSnapping = false;
    }
  }

  requestAnimationFrame(step);
}

// Helper: which section is closest to current scrollTop
function getCurrentSectionIndex(container, sectionList) {
  const top = container.scrollTop;
  let closestIdx = 0;
  let minDist = Infinity;

  sectionList.forEach((sec, idx) => {
    const dist = Math.abs(sec.offsetTop - top);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = idx;
    }
  });

  return closestIdx;
}

// ===== Wheel-based snap scrolling (one scroll = one section) =====
if (stack && sections.length) {
  stack.addEventListener(
    'wheel',
    (e) => {
      // allow browser zoom with Ctrl+scroll
      if (e.ctrlKey) return;

      e.preventDefault();
      if (isSnapping) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const currentIdx = getCurrentSectionIndex(stack, sections);
      const targetIdx = Math.min(
        sections.length - 1,
        Math.max(0, currentIdx + direction)
      );

      if (targetIdx === currentIdx) return;

      isSnapping = true;
      // 1400ms = slower, smoother transition
      smoothScrollToSection(stack, sections[targetIdx], 1400);
    },
    { passive: false }
  );
}

// ===== Nav links: smooth jump to section (using same custom scroll) =====
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    if (stack && sections.length) {
      const targetSection =
        target.classList.contains('page-section')
          ? target
          : target.closest('.page-section') || target;

      isSnapping = true;
      smoothScrollToSection(stack, targetSection, 1400);
    } else {
      // Fallback: normal viewport smooth scroll
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Active nav highlight based on visible section =====
if (sections.length && navLinks.length) {
  const observerOptions = stack
    ? { root: stack, threshold: 0.5 }
    : { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    let best = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!best) return;

    const activeId = '#' + best.target.id;

    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === activeId;
      link.classList.toggle('is-active', match);
    });
  }, observerOptions);

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
      // Run HTML5 validation before letting the mailto: fire
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
      // If valid, browser opens an email draft to info@dlvlogistics.com
    });
  }
})();
