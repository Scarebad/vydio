/* ============================================
   VYDIO — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----- Année footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Burger menu (mobile)
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      const isOpen = links.classList.contains('open');
      links.style.cssText = isOpen
        ? 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(3,13,34,.97);padding:24px;border-bottom:1px solid rgba(27,209,234,.15);'
        : '';
    });
  }

  // ----- Sticky bar : apparition au scroll
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) {
    const closeBtn = stickyBar.querySelector('.sticky-bar__close');
    let dismissed = false;
    closeBtn?.addEventListener('click', () => {
      stickyBar.classList.remove('visible');
      dismissed = true;
    });
    window.addEventListener('scroll', () => {
      if (dismissed) return;
      if (window.scrollY > 800) stickyBar.classList.add('visible');
      else stickyBar.classList.remove('visible');
    });
  }

  // ----- Animation des chiffres (compteur simple)
  const statNums = document.querySelectorAll('.stat-card__num');
  const counted = new WeakSet();
  const animateCount = (el) => {
    if (counted.has(el)) return;
    counted.add(el);
    const finalText = el.textContent;
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();
    const prefix = finalText.match(/^[+]/)?.[0] || '';

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easing : easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);

      let display;
      if (target >= 1000000) display = `${prefix}${(current / 1000000).toFixed(1).replace('.0', '')}M€`;
      else display = `${prefix}${current}`;
      el.textContent = display;

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = finalText; // remettre le texte exact
    };
    requestAnimationFrame(tick);
  };

  // ----- Reveal au scroll (IntersectionObserver)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('stat-card__num')) {
          animateCount(entry.target);
        }
      }
    });
  }, { threshold: 0.2 });

  statNums.forEach((el) => observer.observe(el));

  // ----- Smooth scroll for nav links (déjà géré par html { scroll-behavior:smooth })
  // Anti-comportement par défaut sur les liens internes vides "#"
  document.querySelectorAll('a[href="#"]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  // ----- Crea : interaction au clic (placeholder pour future intégration vidéo)
  document.querySelectorAll('.crea').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });

  // ----- Effet parallax léger sur le hero glow
  const heroGlow = document.querySelector('.hero__bg-glow');
  if (heroGlow) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.3;
      heroGlow.style.transform = `translateX(-50%) translateY(${y}px)`;
    });
  }

  // ----- WhatsApp widget : bulle preview apparaît après 5 sec
  const waPreview = document.getElementById('waPreview');
  const waPreviewClose = document.getElementById('waPreviewClose');
  const waFab = document.getElementById('waFab');

  if (waPreview && waPreviewClose && waFab) {
    const STORAGE_KEY = 'vydio_wa_preview_dismissed';
    const dismissed = localStorage.getItem(STORAGE_KEY);

    // Affichage après 5 secondes (si pas déjà fermé dans cette session)
    if (!dismissed) {
      setTimeout(() => {
        waPreview.classList.add('visible');
      }, 5000);
    }

    // Fermer la bulle au clic sur la croix → mémorise pour la session
    waPreviewClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      waPreview.classList.remove('visible');
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch (err) { /* localStorage peut être bloqué */ }
    });

    // Cacher la bulle quand l'utilisateur clique sur le bouton FAB (il part vers WhatsApp)
    waFab.addEventListener('click', () => {
      waPreview.classList.remove('visible');
    });
  }

});
