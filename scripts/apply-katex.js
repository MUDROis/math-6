// Применяет convertMathText ко всем <span class="math ...">…</span> во всех страницах,
// оборачивая результат в \( ... \). Идемпотентно.
const fs = require('fs');
const path = require('path');
const { convertMathText } = require('./katex-convert');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';

const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

const SPAN_RE = /<span class="math([^"]*)"([^>]*)>([\s\S]*?)<\/span>/g;

let totalSpans = 0;
let totalEmpty = 0;
let totalWrapped = 0;
let totalFiles = 0;

for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let spans = 0, empty = 0, wrapped = 0;

  c = c.replace(SPAN_RE, function (m, cls, attrs, inner) {
    spans++;
    if (inner.trim() === '') { empty++; return m; }
    if (inner.includes('\\(') || inner.includes('\\)')) {
      // уже обработан — не трогаем повторно
      wrapped++;
      return m;
    }
    if (/[а-яА-ЯёЁ]/.test(inner)) {
      // кириллица/проза — оставляем обычным текстом (не математикой KaTeX)
      wrapped++;
      return m;
    }
    const converted = convertMathText(inner);
    wrapped++;
    return '<span class="math' + cls + '"' + attrs + '>\\(' + converted + '\\)</span>';
  });

  if (c !== fs.readFileSync(p, 'utf8')) {
    fs.writeFileSync(p, c, 'utf8');
    totalFiles++;
  }
  totalSpans += spans; totalEmpty += empty; totalWrapped += wrapped;
}

console.log('files changed:' + totalFiles);
console.log('total spans:' + totalSpans);
console.log('empty spans:' + totalEmpty);
console.log('wrapped spans:' + totalWrapped);
if (totalEmpty !== 0) process.exit(1);
