// Конвертация строчных математических записей в LaTeX для KaTeX.
'use strict';

const SUPERSCRIPTS = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n'
};

const SUPERSCRIPT_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;

function convertMathText(src) {
  let s = src;

  // HTML-сущности срав знаки сравнения/умножения
  s = s.replace(/&lt;/g, '\\lt');
  s = s.replace(/&gt;/g, '\\gt');
  s = s.replace(/&ne;/g, '\\ne');
  s = s.replace(/&le;/g, '\\le');
  s = s.replace(/&ge;/g, '\\ge');
  s = s.replace(/&times;/g, '\\times');
  s = s.replace(/&nbsp;/g, '~');

  // Степени: группа юникод-надстрочных символов -> ^{цифры}
  s = s.replace(SUPERSCRIPT_RE, function (run) {
    var out = '';
    for (var i = 0; i < run.length; i++) out += SUPERSCRIPTS[run[i]] || run[i];
    return '^{' + out + '}';
  });

  // Умножение (\cdot{} — чтобы не слипалось со следующей буквой, напр. a·c)
  s = s.replace(/·/g, '\\cdot{}');
  s = s.replace(/×/g, '\\times{}');

  // Проценты
  s = s.replace(/%/g, '\\%');

  // Градусы (^{\circ} — чтобы не слипалось со следующей буквой, напр. °C)
  s = s.replace(/°/g, '^{\\circ}');

  // Смешанные числа: "Ц Д/З" -> "Ц\frac{Д}{З}"
  s = s.replace(/(\d+)\s+(\d+)\/(\d+)/g, '$1\\frac{$2}{$3}');

  // Дроби: "Д/З" -> "\frac{Д}{З}"
  s = s.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');

  return s;
}

module.exports = { convertMathText };
