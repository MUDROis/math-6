// Инъекция общих ассетов (KaTeX CDN + assets/course.css + assets/course.js)
// в index.html и все lesson-*.html. Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';

const HEAD_BLOCK =
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">\n' +
  '<link rel="stylesheet" href="assets/course.css">\n';

const BODY_BLOCK =
  '<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>\n' +
  '<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>\n' +
  '<script defer src="assets/course.js"></script>\n';

const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

let changed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let orig = c;

  if (!c.includes('assets/course.css')) {
    const idx = c.lastIndexOf('</head>');
    if (idx === -1) throw new Error('no </head> in ' + f);
    c = c.slice(0, idx) + HEAD_BLOCK + c.slice(idx);
  }

  if (!c.includes('assets/course.js')) {
    const idx = c.lastIndexOf('</body>');
    if (idx === -1) throw new Error('no </body> in ' + f);
    c = c.slice(0, idx) + BODY_BLOCK + c.slice(idx);
  }

  if (c !== orig) { fs.writeFileSync(p, c, 'utf8'); changed++; }
}

console.log('processed files:' + files.length + ' changed:' + changed);
