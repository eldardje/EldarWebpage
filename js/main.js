/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── MOBILE MENU ── */
const burger = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.transform = 'translateY(6.5px) rotate(45deg)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        s.style.transform = ''; s.style.opacity = '';
      }
    });
  });

  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-line');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = [...el.parentElement.children].filter(c =>
        c.classList.contains('reveal') || c.classList.contains('reveal-line')
      );
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.08}s`;
      el.classList.add('revealed');
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── PAGE TRANSITION ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    !href.startsWith('http') &&
    !href.startsWith('mailto') &&
    !href.startsWith('#') &&
    href.endsWith('.html')
  ) {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 320);
    });
  }
});

/* ── THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ── PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.proj-card');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projCards.forEach(card => {
        const match = filter === 'all' || card.dataset.stack.toLowerCase().includes(filter.toLowerCase());
        card.classList.toggle('hidden', !match);
      });
    });
  });
}
