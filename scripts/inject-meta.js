// Добавляет в <head> всех страниц: description, favicon, Open Graph и Twitter-карточку,
// а в шапку — логотип. Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const SITE = 'Математика 6 класс';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function decodeText(h) {
  return String(h)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}

function buildMeta(title, desc) {
  const t = esc(title), d = esc(desc);
  return '<meta name="description" content="' + d + '">\n' +
    '<link rel="icon" type="image/x-icon" href="assets/favicon.ico">\n' +
    '<link rel="apple-touch-icon" href="assets/logo.png">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="' + esc(SITE) + '">\n' +
    '<meta property="og:title" content="' + t + '">\n' +
    '<meta property="og:description" content="' + d + '">\n' +
    '<meta property="og:image" content="assets/logo.png">\n' +
    '<meta property="og:locale" content="ru_RU">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:title" content="' + t + '">\n' +
    '<meta name="twitter:description" content="' + d + '">\n' +
    '<meta name="twitter:image" content="assets/logo.png">\n';
}

const LOGO = '<img class="course-logo" src="assets/logo.png" alt="Логотип курса «Математика 6 класс»">\n';

const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

let headChanged = 0, logoChanged = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  let any = false;

  const titleM = /\<title>(.*?)<\/title>/s.exec(c);
  const title = titleM ? decodeText(titleM[1]) : SITE;
  const subM = /<p class="subtitle">([\s\S]*?)<\/p>/s.exec(c);
  const desc = subM ? decodeText(subM[1]) : title;

  if (!c.includes('property="og:title"')) {
    const hi = c.lastIndexOf('</head>');
    if (hi === -1) throw new Error('no </head> in ' + f);
    c = c.slice(0, hi) + buildMeta(title, desc) + c.slice(hi);
    headChanged++;
    any = true;
  }

  // логотип в шапку
  if (!c.includes('course-logo')) {
    const h = c.indexOf('<header class="card head">');
    const opener = h !== -1 ? '<header class="card head">' : '<header class="card">';
    const at = c.indexOf(opener);
    if (at !== -1) {
      c = c.slice(0, at + opener.length) + '\n' + LOGO + c.slice(at + opener.length);
      logoChanged++;
      any = true;
    }
  }

  if (any) fs.writeFileSync(p, c, 'utf8');
}
console.log('head changed:' + headChanged + ' logo changed:' + logoChanged);
