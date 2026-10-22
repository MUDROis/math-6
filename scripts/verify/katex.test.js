// Юнит-тесты convertMathText (конвертация строчных записей в LaTeX для KaTeX).
const assert = require('assert');
const { convertMathText } = require('../katex-convert');

function eq(input, expected) {
  assert.strictEqual(convertMathText(input), expected, 'input: ' + JSON.stringify(input));
}

// Дроби
eq('7/12', '\\frac{7}{12}');
eq('9/36 = 1/4', '\\frac{9}{36} = \\frac{1}{4}');
eq('2/7', '\\frac{2}{7}');
eq('-4/5', '-\\frac{4}{5}');

// Смешанные числа
eq('5 1/5', '5\\frac{1}{5}');
eq('4 4/18 + 3 5/18 = 7 9/18', '4\\frac{4}{18} + 3\\frac{5}{18} = 7\\frac{9}{18}');
eq('14 5/12 + 17 1/6 = 31 7/12', '14\\frac{5}{12} + 17\\frac{1}{6} = 31\\frac{7}{12}');
eq('1 1/2', '1\\frac{1}{2}');

// Степени (юникод-надстрочные)
eq('2³', '2^3');
eq('2⁹', '2^9');
eq('x²', 'x^2');
eq('r²', 'r^2');
eq('2⁶', '2^6');

// Умножение
eq('16,1 · 4 + 15,4 · 3 = 110,6', '16,1 \\cdot 4 + 15,4 \\cdot 3 = 110,6');
eq('3 1/22 · 11 = 33 1/2', '3\\frac{1}{22} \\cdot 11 = 33\\frac{1}{2}');

// Проценты и градусы
eq('30 %', '30 \\%');
eq('360°', '360^\\circ');
eq('x = 297 : (−9) = −33', 'x = 297 : (−9) = −33');

// Без изменений
eq('3,5x = 84', '3,5x = 84');
eq('83,95', '83,95');
eq('4,6', '4,6');

console.log('ALL PASS: convertMathText');
