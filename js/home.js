/* js/home.js

   Lazy-load the hero iframe (`hero-revista/index.html`) once the page
   transition has completed and the app is ready. Uses a MutationObserver
   fallback to detect the `body.app-ready` class.
*/

(function () {
  'use strict';

  function loadHeroIframe() {
    var shell = document.getElementById('hero-revista-shell');
    if (!shell || shell.dataset.loaded === '1') return;

    var iframe = document.createElement('iframe');
    iframe.id = 'hero-iframe';
    iframe.title = 'Hero Revista';
    iframe.src = 'hero-revista/index.html';
    iframe.loading = 'lazy';
    iframe.setAttribute('aria-hidden', 'false');
    iframe.style.background = 'transparent';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';

    shell.appendChild(iframe);
    shell.dataset.loaded = '1';
    shell.setAttribute('aria-hidden', 'false');
  }

  function whenAppReady(cb) {
    // Wait for header to be visible (the header is displayed earlier
    // in the transition sequence via the `header-visible` class).
    if (document.body.classList.contains('header-visible')) {
      return cb();
    }

    var mo = new MutationObserver(function () {
      if (document.body.classList.contains('header-visible')) {
        mo.disconnect();
        cb();
      }
    });

    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    // Wait a tiny bit after app-ready so transitions settle
    whenAppReady(function () {
      // Small delay so the header animation/appearance settles,
      // then reveal and load the iframe.
      setTimeout(function () {
        var shell = document.getElementById('hero-revista-shell');
        if (shell) {
          shell.setAttribute('aria-hidden', 'false');
        }
        loadHeroIframe();
      }, 220);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
// home.js

// - Ideas generales para microanimaciones del Hero y la página Home:
//     * Entradas escalonadas (stagger) de títulos y subtítulos tras la transición.
//     * Micro-parallax en imágenes del Hero ligado al movimiento del cursor o scroll.
//     * Animaciones suaves en CTA (hover/focus) y triggers de accesibilidad.
// - Este archivo es de referencia y sólo contiene comentarios por ahora.
