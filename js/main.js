/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── MOBILE MENU ── */
const burger = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
  const burgerLines = burger.querySelectorAll('span');

  burger.setAttribute('aria-expanded', 'false');
  if (!burger.getAttribute('aria-controls')) {
    burger.setAttribute('aria-controls', 'mobileMenu');
  }
  mobileMenu.setAttribute('aria-hidden', 'true');

  const setBurgerState = (open) => {
    burgerLines.forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.transform = 'translateY(6.5px) rotate(45deg)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  };

  const closeMenu = (returnFocus = false) => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    setBurgerState(false);
    document.removeEventListener('keydown', onEscapeClose);
    if (returnFocus) {
      burger.focus();
    }
  };

  const openMenu = () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    setBurgerState(true);
    document.addEventListener('keydown', onEscapeClose);
  };

  function onEscapeClose(event) {
    if (event.key === 'Escape') {
      closeMenu(true);
    }
  }

  burger.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    if (open) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-line');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('revealed'));
} else {
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
}

/* ── PAGE TRANSITION ── */
document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion) return;
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

// Restore opacity when Safari serves the page from bfcache (back/forward navigation)
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.body.style.transition = '';
    document.body.style.opacity = '1';
  }
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    href &&
    !href.startsWith('http') &&
    !href.startsWith('mailto') &&
    !href.startsWith('tel:') &&
    !href.startsWith('#') &&
    href.endsWith('.html')
  ) {
    link.addEventListener('click', e => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.hasAttribute('download')) return;

      const target = link.getAttribute('target');
      if (target && target.toLowerCase() !== '_self') return;
      if (prefersReducedMotion) return;

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
