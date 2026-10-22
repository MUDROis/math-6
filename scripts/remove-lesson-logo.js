// Убирает строку с логотипом из шапок уроков (не трогает index.html).
const fs = require('fs');
const path = require('path');
const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const lessons = fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
  (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7)));

let changed = 0;
for (const f of lessons) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  const before = c;
  c = c.split('\n').filter(line => !line.includes('<img class="course-logo"')).join('\n');
  if (c !== before) { fs.writeFileSync(p, c, 'utf8'); changed++; }
}
console.log('lessons changed:' + changed);
