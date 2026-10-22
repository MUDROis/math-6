// Чинит KaTeX-ошибки в существующих файлах:
//  - \cdot<буква> / \times<буква> -> \cdot <буква> (иначе неопределённая команда);
//  - двойной верхний индекс "2^1^0" -> "2^{10}".
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

let cdot = 0, dsup = 0, filesChanged = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  const orig = c;

  const c1 = c.replace(/\\cdot([A-Za-zА-Яа-я])/g, '\\cdot $1');
  cdot += (c.match(/\\cdot[A-Za-zА-Яа-я]/g) || []).length;
  c = c1.replace(/\\times([A-Za-zА-Яа-я])/g, '\\times $1');

  const c2 = c.replace(/\^([0-9])\^([0-9]+)/g, '^{$1$2}');
  dsup += (c.match(/\^[0-9]\^[0-9]+/g) || []).length;
  c = c2;

  if (c !== orig) { fs.writeFileSync(p, c, 'utf8'); filesChanged++; }
}
console.log('files changed:' + filesChanged + ' cdot/ctimes fixes:' + cdot + ' double-superscript fixes:' + dsup);
