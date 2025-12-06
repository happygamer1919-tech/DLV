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

// Electric lines: fade in once the user scrolls a bit
(function () {
  const lines = document.querySelectorAll('.electric-line');
  if (!lines.length) return;

  function updateLines() {
    const scrolled = window.scrollY || window.pageYOffset;
    if (scrolled > 80) {
      lines.forEach((l) => l.classList.add('is-visible'));
      window.removeEventListener('scroll', updateLines);
    }
  }

  window.addEventListener('scroll', updateLines);
  updateLines();
})();

// Section observer for trucks, nav highlight, and line motion
(function () {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!sections.length) return;

  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  let currentActiveId = null;

  function setActiveSection(id) {
    if (!id || currentActiveId === id) return;
    // Body class for electric lines
    if (currentActiveId) {
      document.body.classList.remove(`section-${currentActiveId}`);
    }
    document.body.classList.add(`section-${id}`);
    currentActiveId = id;

    // Section active class for trucks
    sections.forEach((sec) => {
      sec.classList.toggle('section-active', sec.id === id);
    });

    // Nav active link
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const matches = href === `#${id}`;
      link.classList.toggle('is-active', matches);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let best = null;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      });

      if (best && best.target && best.target.id) {
        setActiveSection(best.target.id);
      }
    },
    {
      threshold: [0.4, 0.6, 0.8],
      rootMargin: '0px 0px -20% 0px',
    }
  );

  sections.forEach((sec) => observer.observe(sec));

  // Initialize based on current scroll position
  const firstInView = sections.find((sec) => {
    const rect = sec.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const visible =
      rect.top < vh * 0.6 && rect.bottom > vh * 0.2;
    return visible;
  });
  if (firstInView) {
    setActiveSection(firstInView.id);
  } else if (sections[0]) {
    setActiveSection(sections[0].id);
  }
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
      // Let the mailto submit happen, but run built in validation first
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
      // If valid, browser will open an email draft to info@dlvlogistics.com
    });
  }
})();
