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
    // NOTE: We no longer auto-inject the iframe here. The caller may
    // explicitly call `window.loadHeroIframe()` when they want the
    // hero content to load. This preserves the visual narrative of the
    // header and prevents the hero content from covering the plane
    // prematurely.
    // Ensure any previously injected iframe is removed (cleanup from
    // earlier runs/tests).
    var existing = shell.querySelector('#hero-iframe');
    if (existing) {
      existing.parentNode.removeChild(existing);
    }
    shell.dataset.loaded = '0';
    shell.setAttribute('aria-hidden', 'true');
  }

  function whenAppReady(cb) {
    // Wait until the header is fully visible (i.e. its opacity transition
    // finished). We listen for the `header-visible` class and then the
    // `transitionend` event for the `opacity` property. As a fallback we
    // use a timeout based on the computed transition duration.
    var HERO_APPEAR_PAUSE = 1000; // ms pause after header transition ends

    function onHeaderReady() {
      var headerEl = document.querySelector('.gd-header');
      if (!headerEl) {
        setTimeout(cb, HERO_APPEAR_PAUSE);
        return;
      }

      var computed = window.getComputedStyle(headerEl);
      var durations = (computed.transitionDuration || '0s').split(',').map(function (s) {
        return parseFloat(s) || 0;
      });
      var maxDur = Math.max.apply(null, durations) * 1000;

      // If there's no transition duration, just wait the extra pause.
      if (!maxDur) {
        setTimeout(cb, HERO_APPEAR_PAUSE);
        return;
      }

      var fired = false;
      var onEnd = function (e) {
        // prefer the opacity transition end, but accept any if needed
        if (!e || e.propertyName === 'opacity' || e.propertyName === 'opacity ') {
          if (fired) return;
          fired = true;
          headerEl.removeEventListener('transitionend', onEnd);
          // After header finished fading, wait the configured pause,
          // then add `hero-visible` to the body and invoke the callback
          // which will reveal/load the hero iframe.
          setTimeout(function () {
            document.body.classList.add('hero-visible');
            cb();
          }, HERO_APPEAR_PAUSE);
        }
      };

      headerEl.addEventListener('transitionend', onEnd);

      // Fallback: ensure callback is called eventually
      setTimeout(function () {
        if (fired) return;
        fired = true;
        headerEl.removeEventListener('transitionend', onEnd);
        document.body.classList.add('hero-visible');
        cb();
      }, maxDur + HERO_APPEAR_PAUSE + 200);
    }

    if (document.body.classList.contains('header-visible')) {
      return onHeaderReady();
    }

    var mo = new MutationObserver(function () {
      if (document.body.classList.contains('header-visible')) {
        mo.disconnect();
        onHeaderReady();
      }
    });

    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    // Wait a tiny bit after app-ready so transitions settle
    whenAppReady(function () {
      var shell = document.getElementById('hero-revista-shell');
      // The `hero-visible` class will have been added by whenAppReady
      // before this callback runs — now unhide the shell and load.
      if (shell) {
        // Reveal only the container; do NOT inject the iframe content.
        shell.setAttribute('aria-hidden', 'false');
        shell.dataset.loaded = '0';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Expose a manual loader so the app or a dev action can load the
  // heavy iframe when desired (after the user confirms the narrative
  // step completed).
  window.loadHeroIframe = function () {
    var shell = document.getElementById('hero-revista-shell');
    if (!shell || shell.dataset.loaded === '1') return;

    var iframe = document.createElement('iframe');
    iframe.id = 'hero-iframe';
    iframe.title = 'Hero Revista';
    iframe.src = 'hero-revista/index.html';
    iframe.loading = 'lazy';
    iframe.setAttribute('aria-hidden', 'false');
    iframe.style.background = 'transparent';
    iframe.setAttribute('allowTransparency', 'true');
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';

    shell.appendChild(iframe);
    shell.dataset.loaded = '1';
    shell.setAttribute('aria-hidden', 'false');
  };

})();
// home.js

// - Ideas generales para microanimaciones del Hero y la página Home:
//     * Entradas escalonadas (stagger) de títulos y subtítulos tras la transición.
//     * Micro-parallax en imágenes del Hero ligado al movimiento del cursor o scroll.
//     * Animaciones suaves en CTA (hover/focus) y triggers de accesibilidad.
// - Este archivo es de referencia y sólo contiene comentarios por ahora.
