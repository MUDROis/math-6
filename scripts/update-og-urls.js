// Переводит og:image/twitter:image на абсолютные URL GitHub Pages и добавляет og:url + canonical. Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const BASE = 'https://MUDROis.github.io/math-6';
const IMG = BASE + '/assets/logo.png';

const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

let changed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let any = false;

  const nextC = c.split('content="assets/logo.png"').join('content="' + IMG + '"');
  if (nextC !== c) { c = nextC; any = true; }

  if (!c.includes('property="og:url"')) {
    const page = f === 'index.html' ? BASE + '/' : BASE + '/' + f;
    const add = '<meta property="og:url" content="' + page + '">\n' +
      '<link rel="canonical" href="' + page + '">\n';
    const hi = c.lastIndexOf('</head>');
    if (hi === -1) throw new Error('no </head> in ' + f);
    c = c.slice(0, hi) + add + c.slice(hi);
    any = true;
  }

  if (any) { fs.writeFileSync(p, c, 'utf8'); changed++; }
}
console.log('changed:' + changed);
