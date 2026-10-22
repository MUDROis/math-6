/* Общий JS курса «Математика 6 класс» */
(function () {
  'use strict';

  function renderKatexIfPresent() {
    // KaTeX auto-render: обрабатывает элементы вида \( ... \) внутри .math
    if (window.renderMathInElement && document.querySelector('.math')) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        strict: 'ignore'
      });
    }
  }

  window.Course = {
    init: function () {
      renderKatexIfPresent();
    }
  };

  // Автозапуск, если страница уже загружена (defer).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.Course.init(); });
  } else {
    window.Course.init();
  }
})();
