// Добавляет поле ввода ответа + кнопку проверки в каждый .task (перед .toggle-btn).
// Эталонный ответ берётся из текста после "Ответ:" в соответствующем .answer. Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';
const files = ['index.html']
  .concat(fs.readdirSync(DIR).filter(f => /^lesson-\d+\.html$/.test(f)).sort(
    (a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7))));

function extractAnswer(html, target) {
  const start = html.indexOf('id="' + target + '"');
  if (start === -1) return '';
  const lab = html.indexOf('Ответ:', start);
  if (lab === -1) return '';
  const pEnd = html.indexOf('</p>', lab);
  if (pEnd === -1) return '';
  let seg = html.slice(lab + 'Ответ:'.length, pEnd);
  seg = seg.replace(/<[^>]+>/g, '');
  seg = seg.replace(/\\\(/g, '').replace(/\\\)/g, '');
  seg = seg.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
  seg = seg.replace(/\s+/g, ' ').trim();
  return seg;
}

function rowHtml(answer) {
  const esc = answer
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<div class="check-row"><input class="check-input" type="text" placeholder="Введи ответ" data-answer="' +
    esc + '"><button class="check-btn" type="button">Проверить</button><span class="check-feedback"></span></div>';
}

const BTN_RE = /(<button class="toggle-btn"[^>]*data-target="([^"]+)")/g;
let filesChanged = 0;
let totalRows = 0;

for (const f of files) {
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('class="check-input"')) continue; // уже обработан
  let rows = 0;
  c = c.replace(BTN_RE, function (m, open, target) {
    rows++;
    return rowHtml(extractAnswer(c, target)) + '\n' + open;
  });
  if (rows > 0) {
    fs.writeFileSync(p, c, 'utf8');
    filesChanged++;
    totalRows += rows;
    if (rows !== 6) console.log('NOTE ' + f + ' rows=' + rows);
  }
}

console.log('files changed:' + filesChanged + ' total rows:' + totalRows);
