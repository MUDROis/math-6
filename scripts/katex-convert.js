// Конвертация строчных математических записей в LaTeX для KaTeX.
'use strict';

const SUPERSCRIPTS = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n'
};

const SUPERSCRIPT_RE = new RegExp('[' + Object.keys(SUPERSCRIPTS).join('') + ']', 'g');

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

  // Степени: юникод-надстрочные символы -> ^цифра
  s = s.replace(SUPERSCRIPT_RE, function (ch) { return '^' + SUPERSCRIPTS[ch]; });

  // Умножение
  s = s.replace(/·/g, '\\cdot');
  s = s.replace(/×/g, '\\times');

  // Проценты
  s = s.replace(/%/g, '\\%');

  // Градусы
  s = s.replace(/°/g, '^\\circ');

  // Смешанные числа: "Ц Д/З" -> "Ц\frac{Д}{З}"
  s = s.replace(/(\d+)\s+(\d+)\/(\d+)/g, '$1\\frac{$2}{$3}');

  // Дроби: "Д/З" -> "\frac{Д}{З}"
  s = s.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');

  return s;
}

module.exports = { convertMathText };
