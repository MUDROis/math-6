// Восстанавливает читаемый «простой» текст в span.math, которые НЕ обёрнуты в \(...\)
// (проза/единицы с кириллицей), но после прежней конвертации содержат остатки LaTeX:
// \cdot, \% , ^\circ, \frac{a}{b}, ^2 и т.п. Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';

const SUPER = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

function restorePlain(s) {
  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2');
  s = s.replace(/\^\\circ/g, '°');
  s = s.replace(/\^([0-9])/g, function (m, d) { return SUPER[d]; });
  s = s.replace(/\\%/g, '%');
  s = s.replace(/\\cdot/g, '·');
  s = s.replace(/\\times/g, '×');
  s = s.replace(/\\lt/g, '<');
  s = s.replace(/\\gt/g, '>');
  s = s.replace(/\\ne/g, '≠');
  s = s.replace(/\\le/g, '≤');
  s = s.replace(/\\ge/g, '≥');
  s = s.replace(/~/g, ' ');
  // экранирование для безопасного размещения в HTML
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return s;
}

const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

// span.math, НЕ содержащие \( ... \)
const SPAN_RE = /<span class="math([^"]*)"([^>]*)>([\s\S]*?)<\/span>/g;

let changed = 0, restored = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let before = c;
  c = c.replace(SPAN_RE, function (m, cls, attrs, inner) {
    if (inner.includes('\\(') || inner.includes('\\)')) return m; // обёрнуто — не трогаем
    if (!/\\/.test(inner)) return m; // без LaTeX-остатков
    restored++;
    return '<span class="math' + cls + '"' + attrs + '>' + restorePlain(inner) + '</span>';
  });
  if (c !== before) { fs.writeFileSync(p, c, 'utf8'); changed++; }
}
console.log('files changed:' + changed + ' restored spans:' + restored);
