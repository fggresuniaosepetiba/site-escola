/* ============================================================
   G.R.E.S. União de Sepetiba — Institutional Pages Script
   Reusable scroll spy, sidebar navigation, smooth scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const sidebar = document.getElementById('instSidebar');
  if (!sidebar) return;

  const links = sidebar.querySelectorAll('.inst-sidebar__link');
  const sections = [];

  links.forEach((link) => {
    const targetId = link.getAttribute('href').slice(1);
    const section = document.getElementById(targetId);
    if (section) {
      sections.push({ el: section, link: link });
    }
  });

  if (sections.length === 0) return;

  /* ── Click: smooth scroll ─────────────────────────────── */
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        link.focus({ preventScroll: true });
      }
    });
  });

  /* ── Scroll spy via IntersectionObserver ──────────────── */
  const observerOptions = {
    rootMargin: '-100px 0px -50% 0px',
    threshold: 0,
  };

  let activeIndex = -1;

  const setActive = (index) => {
    if (index === activeIndex) return;
    if (activeIndex >= 0 && sections[activeIndex]) {
      sections[activeIndex].link.classList.remove('is-active');
      sections[activeIndex].link.removeAttribute('aria-current');
    }
    if (index >= 0 && sections[index]) {
      sections[index].link.classList.add('is-active');
      sections[index].link.setAttribute('aria-current', 'true');
    }
    activeIndex = index;
  };

  const observer = new IntersectionObserver((entries) => {
    let newestIndex = -1;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = sections.findIndex((s) => s.el === entry.target);
        if (idx >= 0 && idx > newestIndex) {
          newestIndex = idx;
        }
      }
    });
    if (newestIndex >= 0) {
      setActive(newestIndex);
    } else {
      /* fallback: find the first section below scroll */
      const scrollY = window.scrollY + 120;
      let fallback = sections.length - 1;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].el.offsetTop;
        if (top > scrollY) {
          fallback = Math.max(0, i - 1);
          break;
        }
      }
      setActive(fallback);
    }
  }, observerOptions);

  sections.forEach((s) => observer.observe(s.el));

  /* set initial based on hash or scroll position */
  if (window.location.hash) {
    const match = sections.findIndex(
      (s) => s.el.id === window.location.hash.slice(1)
    );
    if (match >= 0) setActive(match);
  }
});
