// Меняет базовый URL мета-тегов курса на кастомный домен школы.
const fs = require('fs');
const path = require('path');
const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const OLD = 'https://MUDROis.github.io/math-6';
const NEW = 'https://интерактивнаяшкола.рф/matematika-6';
const files = ['index.html'].concat(fs.readdirSync(DIR).filter(f=>/^lesson-\d+\.html$/.test(f)));
let changed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  const n = c.split(OLD).join(NEW);
  if (n !== c) { fs.writeFileSync(p, n, 'utf8'); changed++; }
}
console.log('changed:' + changed);
