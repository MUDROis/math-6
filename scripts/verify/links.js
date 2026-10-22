// Проверка: во всех страницах есть 5 ссылок на общие ассеты, и файлы assets/ существуют.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';

const NEED = [
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
  'assets/course.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js',
  'assets/course.js'
];

if (!fs.existsSync(path.join(DIR, 'assets/course.css'))) throw new Error('assets/course.css missing');
if (!fs.existsSync(path.join(DIR, 'assets/course.js'))) throw new Error('assets/course.js missing');

const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

let fail = 0;
for (const f of files) {
  const c = fs.readFileSync(path.join(DIR, f), 'utf8');
  for (const n of NEED) {
    if (!c.includes(n)) {
      console.log('FAIL ' + f + ' missing: ' + n);
      fail++;
    }
  }
}

if (fail === 0) console.log('OK: ' + files.length + ' files, all 5 references present');
else { console.log(fail + ' missing references'); process.exit(1); }
