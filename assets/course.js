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

  function initSelfCheck() {
    var core = window.CourseAnswerCore;
    if (!core) return;
    var btns = document.querySelectorAll('.check-btn');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        function run() {
          var row = btn.closest ? btn.closest('.check-row') : null;
          if (!row) return;
          var input = row.querySelector('.check-input');
          var fb = row.querySelector('.check-feedback');
          if (!input || !fb) return;
          var expected = input.getAttribute('data-answer') || '';
          var ok = core.checkAnswer(input.value, expected);
          fb.classList.remove('ok', 'bad');
          if (ok) { fb.textContent = '✅ Верно!'; fb.classList.add('ok'); }
          else { fb.textContent = '❌ Попробуй ещё'; fb.classList.add('bad'); }
        }
        btn.addEventListener('click', run);
        var input = btn.previousElementSibling;
        if (input && input.classList && input.classList.contains('check-input')) {
          input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); run(); }
          });
        }
      })(btns[i]);
    }
  }

  window.Course = {
    init: function () {
      renderKatexIfPresent();
      initSelfCheck();
    }
  };

  // Автозапуск, если страница уже загружена (defer).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.Course.init(); });
  } else {
    window.Course.init();
  }
})();
