// Вставляет интерактивные виджеты (числовая прямая / координатная плоскость)
// в выбранные уроки перед секцией «Проверь себя». Идемпотентно.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Lenovo/Downloads/matematika-6-klass-vilenkin-2024/matematika-6';

const PLAN = {
  1:  { id: 'widget-num-1', kind: 'numberline' },
  24: { id: 'widget-num-24', kind: 'numberline' },
  28: { id: 'widget-num-28', kind: 'numberline' },
  29: { id: 'widget-num-29', kind: 'numberline' },
  43: { id: 'widget-coord-43', kind: 'coordinate' }
};

function widgetHtml(num) {
  const p = PLAN[num];
  const title = p.kind === 'coordinate'
    ? '🖱 Потренируйся на координатной плоскости'
    : '🖱 Потренируйся на числовой прямой';
  return '<section class="card visual"><h2>' + title + '</h2>' +
    '<div class="widget" id="' + p.id + '" data-widget="' + p.kind + '"></div></section>\n';
}

const ANCHOR = '<section class="card check">';

let changed = 0;
for (const num of Object.keys(PLAN)) {
  const f = 'lesson-' + String(num).padStart(2, '0') + '.html';
  const p = path.join(DIR, f);
  let c = fs.readFileSync(p, 'utf8');
  const id = PLAN[num].id;
  if (c.includes('id="' + id + '"')) continue;
  const at = c.indexOf(ANCHOR);
  if (at === -1) { console.log('ANCHOR missing in ' + f); continue; }
  c = c.slice(0, at) + widgetHtml(num) + c.slice(at);
  fs.writeFileSync(p, c, 'utf8');
  changed++;
}
console.log('changed:' + changed);
