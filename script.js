// =========
// Smooth scroll for in-page nav links
// =========
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');

    // Ignore empty or just "#"
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// =========
// Hero CTA helper (in case it's not an anchor)
// =========
const heroQuoteBtn = document.querySelector('[data-scroll-target="quote"]');
if (heroQuoteBtn) {
  heroQuoteBtn.addEventListener('click', () => {
    const quoteSection = document.querySelector('#quote');
    if (quoteSection) {
      quoteSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}

// =========
// Auto year in footer (optional)
// Add <span id="year"></span> where you want the year.
// =========
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =========
// Quote form: prevent full submit, show a lightweight confirmation
// =========
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', event => {
    event.preventDefault();

    // You can hook this up to a real backend/API later.
    // For now, we just give the user feedback.
    const btn = quoteForm.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : null;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }

    // Fake async delay so it feels alive
    setTimeout(() => {
      alert('Thanks! A DLV Logistics specialist will review your lane and get back to you shortly.');
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText || 'Get a quote';
      }
      quoteForm.reset();
    }, 600);
  });
}

// =========
// Optional: add a subtle "active" nav state while scrolling
// (Purely cosmetic; remove this block if you don’t want it.)
// =========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

if (sections.length && navLinks.length) {
  const sectionById = {};
  sections.forEach(sec => (sectionById[sec.id] = sec));

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const offset = 140; // tweak vs. header height

    let currentId = null;

    sections.forEach(sec => {
      const top = sec.offsetTop - offset;
      if (scrollPos >= top) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const hrefId = link.getAttribute('href').replace('#', '');
      if (hrefId === currentId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  });
}
