// Разворачивает KaTeX-обёртку \( ... \ у у span.math, содержимое которых содержит кириллицу
// (проза/единицы — не математика). Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

// спаны вида <span class="math...">\( ... \)</span>
const SPAN_RE = /<span class="math([^"]*)"([^>]*)>\\\((.*?)\\\)<\/span>/g;

let changed = 0, total = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let before = c;
  c = c.replace(SPAN_RE, function (m, cls, attrs, inner) {
    total++;
    if (/[а-яА-ЯёЁ]/.test(inner)) {
      return '<span class="math' + cls + '"' + attrs + '>' + inner + '</span>';
    }
    return m;
  });
  if (c !== before) { fs.writeFileSync(p, c, 'utf8'); changed++; }
}
console.log('scanned wraps:' + total + ' files changed:' + changed);
