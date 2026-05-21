/* ===================================================
   Adrián Lavilla — Motion & Interaction Layer
   =================================================== */

(function () {
  'use strict';

  /* ── Scroll progress bar ── */
  const progress = document.querySelector('.progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── Navbar hide on scroll down ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 120 && y > lastY) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ── Section-based nav pagination ── */
  const paginationCurrent = document.querySelector('.nav__pagination-current');
  const sections = document.querySelectorAll('[data-section]');
  const romanMap = { hero: 'I', video: 'II', problema: 'III', 'sobre-mi': 'IV', sistema: 'V', programas: 'VI', contacto: 'VII', footer: 'VII' };

  if (paginationCurrent && sections.length) {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const key = entry.target.dataset.section;
          paginationCurrent.textContent = romanMap[key] || 'I';
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach((s) => sectionObs.observe(s));
  }

  /* ── Active nav link ── */
  const navLinks = document.querySelectorAll('.nav__link');
  if (navLinks.length && sections.length) {
    const linkObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('section[id]').forEach((s) => linkObs.observe(s));
  }

  /* ── Reveal on scroll ── */
  const reveals = document.querySelectorAll('.reveal, .reveal-rule, .problem__item');
  if (reveals.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => revealObs.observe(el));
  }

})();
