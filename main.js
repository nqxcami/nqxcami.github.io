/* ===================================================
   NQXCAMI PORTFOLIO — MAIN.JS
   Interactive features, animations & effects
   =================================================== */

'use strict';

// ─── 1. Particle Canvas Background ─────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;
  let animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.4, 1.8),
      dx: randomBetween(-0.25, 0.25),
      dy: randomBetween(-0.25, 0.25),
      alpha: randomBetween(0.2, 0.7),
      color: Math.random() > 0.5
        ? `rgba(124,58,237,${randomBetween(0.15, 0.5)})`
        : `rgba(6,182,212,${randomBetween(0.15, 0.5)})`,
    };
  }

  function initParticleSet() {
    const count = Math.floor((W * H) / 18000);
    particles = Array.from({ length: count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticleSet();
  });

  resize();
  initParticleSet();
  draw();
})();

// ─── 2. Cursor Glow Effect ──────────────────────────
(function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();

// ─── 3. Navbar Scroll Behavior ──────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── 4. Active Nav Link on Scroll ──────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();

// ─── 5. Mobile Menu ─────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu(force) {
    const isOpen = hamburger.classList.toggle('open', force);
    mobileMenu.classList.toggle('open', force);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
})();

// ─── 6. Typewriter Effect ───────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'developer --passionate',
    'building beautiful UIs',
    'writing clean code',
    'creating cool stuff',
    'open source enthusiast',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      delay = 50;
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      delay = 100;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();

// ─── 7. Scroll Reveal Animation ─────────────────────
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger child reveals in a container
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 0);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  // Stagger siblings
  const groups = {};
  reveals.forEach(el => {
    const parent = el.parentElement;
    if (!groups[parent]) groups[parent] = [];
    groups[parent].push(el);
  });

  Object.values(groups).forEach(group => {
    group.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
  });
})();

// ─── 8. Skill Bars Animate ──────────────────────────
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();

// ─── 9. Counter Animation (Stats) ───────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ─── 10. Smooth Scroll for Anchor Links ─────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ─── 11. Footer Year ────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ─── 12. Card Magnetic Hover Effect ─────────────────
(function initMagneticCards() {
  const cards = document.querySelectorAll('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── 13. Page Load Entrance ──────────────────────────
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
