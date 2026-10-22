// Исправляет отображение:
// 1) градусов: ^\circA -> ^{\circ}\mathrm{A} (иначе KaTeX-ошибка "\circA"), остальные ^\circ -> ^{\circ};
// 2) логотип: добавляет инлайн-стиль, чтобы не был огромным при любых условиях.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

let degFixed = 0, logoTouched = 0, filesChanged = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let orig = c;

  const c1 = c.replace(/\^\\circ([A-Za-zА-Яа-я])/g, '^{\\circ}\\mathrm{$1}');
  if (c1 !== c) degFixed += (c.match(/\^\\circ[A-Za-zА-Яа-я]/g) || []).length;
  c = c1.replace(/\^\\circ/g, '^{\\circ}');

  const c2 = c.replace(/<img class="course-logo" src="assets\/logo\.png"/g,
    '<img class="course-logo" style="height:44px;width:auto" src="assets/logo.png"');
  if (c2 !== c) logoTouched++;

  if (c !== orig) { fs.writeFileSync(p, c, 'utf8'); filesChanged++; }
}
console.log('files changed:' + filesChanged + ' degree-fixes:' + degFixed + ' logo imgs touched:' + logoTouched);
