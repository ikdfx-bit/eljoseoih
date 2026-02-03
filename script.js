document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------
  // Scroll suave (nav + botones)
  // -----------------------------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // -----------------------------
  // Sección activa en el nav
  // -----------------------------
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

  function setActiveSection() {
    const y = window.scrollY + 140; // offset por header fijo
    let current = sections[0]?.id || '';

    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }

    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveSection, { passive: true });
  setActiveSection();

  // -----------------------------
  // Reveal on scroll
  // -----------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: muestra todo
    revealEls.forEach(el => el.classList.add('show'));
  }

  // -----------------------------
  // FAQ acordeón
  // -----------------------------
  document.querySelectorAll('.faq-item').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      if (!panel) return;

      const icon = button.querySelector('.faq-icon');
      const isOpen = panel.classList.contains('open');

      // Cierra otros
      document.querySelectorAll('.faq-panel.open').forEach(p => {
        if (p !== panel) p.classList.remove('open');
      });
      document.querySelectorAll('.faq-icon').forEach(i => {
        if (i !== icon) i.textContent = '+';
      });

      // Toggle actual
      panel.classList.toggle('open', !isOpen);
      if (icon) icon.textContent = isOpen ? '+' : '–';
    });
  });

  // -----------------------------
  // CTA (APUNTARME):
  // - aparece ANTES de Planes
  // - desaparece al entrar en FAQ
  // - animación ya va por CSS
  // -----------------------------
  const ctaButton = document.querySelector('.sticky-cta');
  const planesSection = document.querySelector('#planes');
  const faqSection = document.querySelector('#faq');

  if (ctaButton && planesSection) {
    let ticking = false;

    const updateCta = () => {
      const planesRect = planesSection.getBoundingClientRect();
      const nearPlanes =
        planesRect.top < window.innerHeight * 0.85 && planesRect.bottom > 0;

      let inFaq = false;
      if (faqSection) {
        const faqRect = faqSection.getBoundingClientRect();
        // "en FAQ" cuando ya estás entrando claramente
        inFaq = faqRect.top < window.innerHeight * 0.35 && faqRect.bottom > 0;
      }

      ctaButton.classList.toggle('show', nearPlanes && !inFaq);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateCta();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateCta(); // estado inicial
  }
});
