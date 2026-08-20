/* ==========================================================================
   Nathan Verkerk — Portfolio
   Behaviour: theme switching, expand/collapse, copyright year

   Contents:
     1. Constants
     2. Copyright year
     3. Language picker
     4. Mode toggle (personal <-> developer)
     5. Expand / collapse items
     6. Event wiring
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. CONSTANTS

     Lucide chevron path data. Expanding an item swaps the `d` attribute
     rather than replacing the whole SVG, so the element keeps its styling.
     ======================================================================== */

  var CHEVRON_RIGHT = 'm9 18 6-6-6-6';   // collapsed  >
  var CHEVRON_DOWN = 'm6 9 6 6 6-6';    // expanded   v

  /** Tracks the current theme. false = personal, true = developer. */
  var isDev = false;


  /* ========================================================================
     2. COPYRIGHT YEAR
     Injected at runtime so the footer never shows a stale year.
     ======================================================================== */

  function setCopyrightYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ========================================================================
     3. LANGUAGE PICKER

     Each language has its own static page. The picker follows the language
     segment in the URL so a browser back/forward restore stays accurate.
     ======================================================================== */

  function syncLanguagePicker() {
    var languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = /\/en(?:\/|\/index\.html)?$/.test(window.location.pathname) ? 'en' : 'nl';
    }
  }


  /* ========================================================================
     4. MODE TOGGLE

     Flipping `body.dev-mode` drives every visual change through CSS:
     colour variables, pill styling, and which toggle icon is displayed.
     JS only handles state, section visibility, and ARIA.
     ======================================================================== */

  function switchMode() {
    isDev = !isDev;

    // Theme — CSS custom properties cascade from this class
    document.body.classList.toggle('dev-mode', isDev);

    // Swap visible content section
    document.getElementById('section-personal').classList.toggle('active', !isDev);
    document.getElementById('section-dev').classList.toggle('active', isDev);

    // Keep the switch's accessible state in sync
    var toggle = document.getElementById('toggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', String(isDev));
    }

    // Collapse anything left open in the section we're leaving
    collapseAll();
  }


  /* ========================================================================
     5. EXPAND / COLLAPSE
     ======================================================================== */

  /**
   * Point an item's chevron right (collapsed) or down (expanded).
   * @param {Element} item  An .item element containing an .arrow-icon
   * @param {boolean} open  true = down chevron, false = right chevron
   */
  function setChevron(item, open) {
    var path = item.querySelector('.arrow-icon path');
    if (path) {
      path.setAttribute('d', open ? CHEVRON_DOWN : CHEVRON_RIGHT);
    }
  }

  /**
   * Toggle a single expandable item open or closed.
   * @param {Element} item  The .item.expandable element
   */
  function toggleExpand(item) {
    var body = item.querySelector('.expand-body');
    if (!body) return;

    var isOpen = body.classList.toggle('open');
    setChevron(item, isOpen);
  }

  /** Close every expanded item on the page and reset its chevron. */
  function collapseAll() {
    var openBodies = document.querySelectorAll('.expand-body.open');

    Array.prototype.forEach.call(openBodies, function (body) {
      body.classList.remove('open');

      var item = body.closest('.item');
      if (item) {
        setChevron(item, false);
      }
    });
  }


  /* ========================================================================
     6. EVENT WIRING
     Listeners are attached here rather than via inline onclick attributes,
     keeping markup and behaviour separate.
     ======================================================================== */

  function init() {
    setCopyrightYear();

    var languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', function () {
        window.location.assign(new URL('../' + languageSelect.value + '/', window.location.href).href);
      });
    }

    syncLanguagePicker();

    // Mode toggle — click plus keyboard support for the role="switch"
    var toggle = document.getElementById('toggle');
    if (toggle) {
      toggle.addEventListener('click', switchMode);

      toggle.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          switchMode();
        }
      });
    }

    // Expandable items — only the label is clickable, never the body
    var labels = document.querySelectorAll('.expandable .item-label[data-expand]');

    Array.prototype.forEach.call(labels, function (label) {
      label.addEventListener('click', function () {
        toggleExpand(label.closest('.item'));
      });
    });
  }

  // Run once the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // A browser may restore old form values from its back/forward cache.
  window.addEventListener('pageshow', syncLanguagePicker);

})();
