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

  var WIDGET_DATA = {
    'widget-num-1': { kind: 'numberline', min: 0, max: 14, step: 2, exercises: [
      { prompt: 'Отметь среднее арифметическое чисел 8, 9 и 4.', correct: 7 },
      { prompt: 'Отметь среднее арифметическое чисел 4 и 12.', correct: 8 }
    ] },
    'widget-num-24': { kind: 'numberline', min: -6, max: 6, step: 1, exercises: [
      { prompt: 'Отметь точку с координатой −4.', correct: -4 },
      { prompt: 'Отметь точку с координатой 2.', correct: 2 },
      { prompt: 'Отметь точку с координатой 5.', correct: 5 }
    ] },
    'widget-num-28': { kind: 'numberline', min: -10, max: 10, step: 1, exercises: [
      { prompt: 'Точка K(−7) переместилась на 5 вправо. Отметь её новое положение.', correct: -2 },
      { prompt: 'Точка M(8) переместилась на 11 влево. Отметь её новое положение.', correct: -3 }
    ] },
    'widget-num-29': { kind: 'numberline', min: -10, max: 10, step: 1, exercises: [
      { prompt: 'Вычисли −3 + 7 и отметь результат.', correct: 4 },
      { prompt: 'Вычисли 1 + (−6) + 10 и отметь результат.', correct: 5 }
    ] },
    'widget-coord-43': { kind: 'coordinate', exercises: [
      { prompt: 'Построй точку C(3; −2).', correct: [3, -2] },
      { prompt: 'Построй точку X(3; 9).', correct: [3, 9] },
      { prompt: 'Построй точку Y(5; −2).', correct: [5, -2] },
      { prompt: 'Построй точку Q(−2; −9).', correct: [-2, -9] }
    ] }
  };

  function svgPoint(cx, cy, r, color) {
    return '<circle class="w-point" cx="' + cx + '" cy="' + cy + '" r="' + r +
      '" fill="' + color + '" stroke="#2d3436" stroke-width="2"/>';
  }

  function buildNumberLineWidget(el, cfg) {
    var W = 480, H = 100, PAD = 40;
    var am = window.AxisMath;
    var i = 0, placed = null;
    var ex = cfg.exercises;

    el.innerHTML =
      '<div class="w-prompt"></div>' +
      '<svg class="w-grid" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
        '<line x1="' + PAD + '" y1="52" x2="' + (W - PAD) + '" y2="52" stroke="#2d3436" stroke-width="2"/>' +
        '<polygon points="' + (W - PAD) + ',52 ' + (W - PAD - 10) + ',47 ' + (W - PAD - 10) + ',57" fill="#2d3436"/>' +
        '<g id="ticks"></g>' +
        '<g id="pts"></g>' +
      '</svg>' +
      '<div class="w-hint">Кликни по прямой, чтобы поставить точку</div>' +
      '<div class="w-actions"><button type="button" class="w-check">Проверить</button> <button type="button" class="w-next">Дальше →</button></div>' +
      '<div class="w-feedback"></div>';

    var svg = el.querySelector('svg');
    var gTicks = el.querySelector('#ticks');
    var gPts = el.querySelector('#pts');
    var promptEl = el.querySelector('.w-prompt');
    var fb = el.querySelector('.w-feedback');

    var tickHtml = '';
    for (var v = cfg.min; v <= cfg.max; v += cfg.step) {
      var px = am.linearMap(v, cfg.min, cfg.max, PAD, W - PAD);
      tickHtml += '<line x1="' + px + '" y1="46" x2="' + px + '" y2="58" stroke="#2d3436" stroke-width="1.5"/>' +
        '<text x="' + px + '" y="76" font-size="12" text-anchor="middle" fill="#2d3436">' + v + '</text>';
    }
    gTicks.innerHTML = tickHtml;

    function render() {
      promptEl.textContent = (i + 1) + '. ' + ex[i].prompt;
      gPts.innerHTML = '';
      if (placed !== null) {
        var ppx = am.linearMap(placed, cfg.min, cfg.max, PAD, W - PAD);
        gPts.innerHTML = svgPoint(ppx, 52, 8, '#f39c12');
      }
      fb.textContent = '';
      fb.className = 'w-feedback';
    }

    svg.addEventListener('click', function (e) {
      var r = svg.getBoundingClientRect();
      var w = svg.viewBox.baseVal.width;
      var xPx = (e.clientX - r.left) * (w / r.width);
      var val = am.linearMap(xPx, PAD, W - PAD, cfg.min, cfg.max);
      val = am.clamp(val, cfg.min, cfg.max);
      placed = am.snapInterval(val, cfg.min, cfg.step);
      render();
    });

    el.querySelector('.w-check').addEventListener('click', function () {
      if (placed === null) { fb.textContent = 'Сначала поставь точку кликом.'; fb.className = 'w-feedback bad'; return; }
      var ok = Math.abs(placed - ex[i].correct) <= cfg.step / 2;
      fb.textContent = ok ? '✅ Верно!' : '❌ Попробуй ещё (ответ около ' + ex[i].correct + ')';
      fb.className = 'w-feedback ' + (ok ? 'ok' : 'bad');
    });

    el.querySelector('.w-next').addEventListener('click', function () {
      i = (i + 1) % ex.length;
      placed = null;
      render();
    });

    render();
  }

  function buildCoordinatePlaneWidget(el, cfg) {
    var W = 400, H = 400, CX = 200, CY = 200, SCALE = 20;
    var am = window.AxisMath;
    var i = 0, placed = null;
    var ex = cfg.exercises;

    el.innerHTML =
      '<div class="w-prompt"></div>' +
      '<svg class="w-grid" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
        '<g id="grid"></g>' +
        '<g id="pts"></g>' +
      '</svg>' +
      '<div class="w-hint">Кликни по плоскости, чтобы построить точку</div>' +
      '<div class="w-actions"><button type="button" class="w-check">Проверить</button> <button type="button" class="w-next">Дальше →</button></div>' +
      '<div class="w-feedback"></div>';

    var svg = el.querySelector('svg');
    var gGrid = el.querySelector('#grid');
    var gPts = el.querySelector('#pts');
    var promptEl = el.querySelector('.w-prompt');
    var fb = el.querySelector('.w-feedback');

    var g = '';
    for (var k = 0; k <= W; k += SCALE) {
      g += '<line x1="' + k + '" y1="0" x2="' + k + '" y2="' + H + '" stroke="#dfe6e9" stroke-width="1"/>';
    }
    for (var j = 0; j <= H; j += SCALE) {
      g += '<line x1="0" y1="' + j + '" x2="' + W + '" y2="' + j + '" stroke="#dfe6e9" stroke-width="1"/>';
    }
    g += '<line x1="0" y1="' + CY + '" x2="' + W + '" y2="' + CY + '" stroke="#2d3436" stroke-width="2"/>';
    g += '<line x1="' + CX + '" y1="0" x2="' + CX + '" y2="' + H + '" stroke="#2d3436" stroke-width="2"/>';
    g += '<polygon points="' + W + ',' + CY + ' ' + (W - 10) + ',' + (CY - 5) + ' ' + (W - 10) + ',' + (CY + 5) + '" fill="#2d3436"/>';
    g += '<polygon points="' + CX + ',0 ' + (CX - 5) + ',10 ' + (CX + 5) + ',10" fill="#2d3436"/>';
    g += '<text x="' + (W - 14) + '" y="' + (CY - 8) + '" font-size="13" fill="#2d3436">x</text>';
    g += '<text x="' + (CX + 8) + '" y="14" font-size="13" fill="#2d3436">y</text>';
    g += '<text x="' + (CX - 6) + '" y="' + (CY + 16) + '" font-size="12" fill="#2d3436">O</text>';
    for (var xv = -6; xv <= 6; xv++) {
      if (xv === 0) continue;
      var xp = am.linearMap(xv, -6, 6, 0, W);
      g += '<text x="' + xp + '" y="' + (CY + 18) + '" font-size="11" text-anchor="middle" fill="#636e72">' + xv + '</text>';
      g += '<line x1="' + xp + '" y1="' + (CY - 3) + '" x2="' + xp + '" y2="' + (CY + 3) + '" stroke="#2d3436" stroke-width="1"/>';
    }
    for (var yv = -10; yv <= 10; yv++) {
      if (yv === 0) continue;
      var yp = am.linearMap(yv, -10, 10, H, 0);
      g += '<text x="' + (CX - 10) + '" y="' + (yp + 4) + '" font-size="11" text-anchor="end" fill="#636e72">' + yv + '</text>';
      g += '<line x1="' + (CX - 3) + '" y1="' + yp + '" x2="' + (CX + 3) + '" y2="' + yp + '" stroke="#2d3436" stroke-width="1"/>';
    }
    gGrid.innerHTML = g;

    function worldToPx(x, y) {
      return { x: CX + x * SCALE, y: CY - y * SCALE };
    }
    function pxToWorld(px, py) {
      return { x: (px - CX) / SCALE, y: (CY - py) / SCALE };
    }

    function render() {
      promptEl.textContent = (i + 1) + '. ' + ex[i].prompt;
      gPts.innerHTML = '';
      if (placed) {
        var p = worldToPx(placed.x, placed.y);
        gPts.innerHTML = svgPoint(p.x, p.y, 7, '#f39c12') +
          '<text x="' + (p.x + 10) + '" y="' + (p.y - 8) + '" font-size="13" font-weight="bold" fill="#b9770e">(' + placed.x + '; ' + placed.y + ')</text>';
      }
      fb.textContent = '';
      fb.className = 'w-feedback';
    }

    svg.addEventListener('click', function (e) {
      var r = svg.getBoundingClientRect();
      var bw = svg.viewBox.baseVal.width, bh = svg.viewBox.baseVal.height;
      var px = (e.clientX - r.left) * (bw / r.width);
      var py = (e.clientY - r.top) * (bh / r.height);
      var w = pxToWorld(px, py);
      placed = { x: Math.round(w.x * 2) / 2, y: Math.round(w.y * 2) / 2 };
      render();
    });

    el.querySelector('.w-check').addEventListener('click', function () {
      if (!placed) { fb.textContent = 'Сначала построй точку кликом.'; fb.className = 'w-feedback bad'; return; }
      var c = ex[i].correct;
      var ok = Math.abs(placed.x - c[0]) <= 0.5 && Math.abs(placed.y - c[1]) <= 0.5;
      fb.textContent = ok ? '✅ Верно!' : '❌ Попробуй ещё (нужна точка ' + c[0] + '; ' + c[1] + ')';
      fb.className = 'w-feedback ' + (ok ? 'ok' : 'bad');
    });

    el.querySelector('.w-next').addEventListener('click', function () {
      i = (i + 1) % ex.length;
      placed = null;
      render();
    });

    render();
  }

  function initWidgets() {
    var nodes = document.querySelectorAll('.widget[data-widget]');
    for (var idx = 0; idx < nodes.length; idx++) {
      var el = nodes[idx];
      var cfg = WIDGET_DATA[el.id];
      if (!cfg) continue;
      if (cfg.kind === 'coordinate') buildCoordinatePlaneWidget(el, cfg);
      else buildNumberLineWidget(el, cfg);
    }
  }

  window.Course = {
    init: function () {
      renderKatexIfPresent();
      initSelfCheck();
      initWidgets();
    }
  };

  // Автозапуск, если страница уже загружена (defer).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.Course.init(); });
  } else {
    window.Course.init();
  }
})();
