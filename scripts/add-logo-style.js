// Добавляет инлайн-стиль логотипу в шапке (гарантирует небольшой размер).
const fs = require('fs');
const path = require('path');
const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const files = ['index.html'].concat(fs.readdirSync(DIR).filter(f=>/^lesson-\d+\.html$/.test(f)).sort((a,b)=>parseInt(a.slice(7))-parseInt(b.slice(7))));

const RE = /<img class="course-logo" src="assets\/logo\.png"/g;
const REPL = '<img class="course-logo" style="height:44px;width:auto" src="assets/logo.png"';

let changed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  const n = c.replace(RE, REPL);
  if (n !== c) { fs.writeFileSync(p, n, 'utf8'); changed++; }
}
console.log('changed:' + changed);
