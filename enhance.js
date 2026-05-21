/* =====================================================
   enhance.js — interacciones premium, capa sobre motion.js
   Vanilla JS · sin dependencias externas
   ===================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* --------- 1. Page intro: cortina de apertura ---------- */
  function pageIntroCurtain() {
    if (prefersReducedMotion) {
      document.body.classList.add('intro-done');
      return;
    }
    const curtain = document.createElement('div');
    curtain.className = 'intro-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = `
      <div class="intro-curtain__half intro-curtain__half--top"></div>
      <div class="intro-curtain__half intro-curtain__half--bottom"></div>
      <div class="intro-curtain__mark">
        <span class="intro-curtain__mono">MMXXVI · ED. I</span>
        <span class="intro-curtain__al">AL</span>
        <span class="intro-curtain__mono">ANDORRA</span>
      </div>
    `;
    document.body.prepend(curtain);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      curtain.classList.add('intro-curtain--open');
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        curtain.remove();
        document.body.classList.add('intro-done');
      }, 1800);
    });
  }

  /* --------- 2. Magnetic links en CTAs principales ---------- */
  function magneticCTAs() {
    if (prefersReducedMotion || isTouch) return;
    const targets = document.querySelectorAll('.btn, .nav__cta, .program__cta');
    targets.forEach(el => {
      const strength = 18;
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }


  /* --------- 4. Hero H1: reveal línea a línea ---------- */
  function splitHeroH1() {
    if (prefersReducedMotion) return;
    const h1 = document.querySelector('.hero__h1');
    if (!h1) return;
    const lines = h1.querySelectorAll('.line > span');
    lines.forEach((span, i) => {
      span.style.setProperty('--delay', `${i * 0.12 + 0.4}s`);
      span.classList.add('hero__line-reveal');
    });
  }

  /* --------- 5. Diagonal SVG del sistema: dibujado al scroll ---------- */
  function animateSystemDiagonal() {
    const svg = document.querySelector('.system__diagonal');
    if (!svg) return;
    const lines = svg.querySelectorAll('line');
    lines.forEach(line => {
      const length = line.getTotalLength?.() || 150;
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          lines.forEach((line, i) => {
            line.style.transition = `stroke-dashoffset 1.6s var(--ease-out-expo) ${i * 0.2}s`;
            line.style.strokeDashoffset = 0;
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(svg);
  }

  /* --------- 6. Marquee: pausa en hover ---------- */
  function marqueeHoverPause() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;
    marquee.addEventListener('mouseenter', () => marquee.classList.add('marquee--paused'));
    marquee.addEventListener('mouseleave', () => marquee.classList.remove('marquee--paused'));
  }

  /* --------- 7. Pillar cards: inversión radial en hover ---------- */
  function pillarCardsRadialInvert() {
    if (prefersReducedMotion || isTouch) return;
    document.querySelectorAll('.pillar-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      });
    });
  }

  /* --------- 8. Parallax sutil en watermark CTA ---------- */
  function ctaWatermarkParallax() {
    if (prefersReducedMotion) return;
    const wm = document.querySelector('.cta-final__watermark');
    if (!wm) return;
    const section = wm.closest('section');
    window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      wm.style.transform = `translate(0, ${(0.5 - clamped) * 80}px)`;
    }, { passive: true });
  }

  /* --------- 9. Progress bar real ---------- */
  function readingProgress() {
    const bar = document.querySelector('.progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.transform = `scaleX(${pct / 100})`;
    }, { passive: true });
  }

  /* --------- 10. Navbar pagination dinámica ---------- */
  function navbarPagination() {
    const current = document.querySelector('.nav__pagination-current');
    if (!current) return;
    const sections = [
      { id: 'inicio', label: 'I' },
      { id: 'sistema-inly', label: 'II' },
      { id: 'sobre-mi', label: 'III' },
      { id: 'programas', label: 'IV' },
      { id: 'diagnostico-gratuito', label: 'V' },
    ];
    const map = new Map(sections.map(s => [s.id, s.label]));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && map.has(e.target.id)) {
          current.textContent = map.get(e.target.id);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
  }

  /* --------- 11. Easter egg: click en logo ---------- */
  function logoEasterEgg() {
    const logo = document.querySelector('.nav__logo');
    if (!logo) return;
    let clicks = 0;
    logo.addEventListener('click', () => {
      clicks++;
      if (clicks === 3) {
        console.log(
          '%cAdrián Lavilla',
          'font-family: Georgia, serif; font-size: 28px; font-style: italic; color: #B8956A;'
        );
        console.log(
          '%cSet in Fraunces & Geist. Built in Andorra. MMXXVI.',
          'font-family: monospace; font-size: 11px; color: #8C6E48; letter-spacing: 0.18em;'
        );
        clicks = 0;
      }
    });
  }

  /* --------- 12. Hora real de Andorra en navbar ---------- */
  function andorraClock() {
    const pag = document.querySelector('.nav__pagination');
    if (!pag) return;
    const clock = document.createElement('span');
    clock.className = 'nav__clock';
    clock.setAttribute('aria-hidden', 'true');
    pag.parentElement.insertBefore(clock, pag);
    function tick() {
      const now = new Date().toLocaleTimeString('es-AD', {
        timeZone: 'Europe/Andorra',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      clock.textContent = `AD · ${now}`;
    }
    tick();
    setInterval(tick, 60000);
  }

  /* --------- 13. Side index activo + adaptativo ---------- */
  function sideIndex() {
    const idx = document.querySelector('.side-index');
    if (!idx) return;
    const items = idx.querySelectorAll('[data-target]');
    const sections = Array.from(items).map(li => ({
      el: document.getElementById(li.dataset.target),
      li,
    })).filter(s => s.el);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          items.forEach(i => i.classList.remove('active'));
          const match = sections.find(s => s.el === e.target);
          if (match) match.li.classList.add('active');
          const isPaper = e.target.classList.contains('paper');
          idx.setAttribute('data-on', isPaper ? 'paper' : 'ink');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => obs.observe(s.el));
  }

  /* --------- 14. Rules in-view ---------- */
  function rulesInView() {
    const rules = document.querySelectorAll('.rule, .reveal-rule');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    rules.forEach(r => obs.observe(r));
  }

  /* --------- INIT ---------- */
  function init() {
    pageIntroCurtain();
    magneticCTAs();
    splitHeroH1();
    animateSystemDiagonal();
    marqueeHoverPause();
    pillarCardsRadialInvert();
    ctaWatermarkParallax();
    readingProgress();
    navbarPagination();
    logoEasterEgg();
    andorraClock();
    sideIndex();
    rulesInView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
