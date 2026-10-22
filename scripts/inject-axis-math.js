// Вставляет <script src="assets/axis-math.js"> перед assets/course.js во всех страницах. Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

const NEEDLE = '<script defer src="assets/course.js"></script>';
const REPLACEMENT = '<script defer src="assets/axis-math.js"></script>\n' + NEEDLE;

let changed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('assets/axis-math.js') && c.includes(NEEDLE)) {
    c = c.split(NEEDLE).join(REPLACEMENT);
    fs.writeFileSync(p, c, 'utf8');
    changed++;
  }
}
console.log('changed:' + changed);
