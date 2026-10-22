// Юнит-тесты сравнения ответов (терпимое сравнение ввода ученика с эталоном).
const assert = require('assert');
const { normalizeAnswer, checkAnswer } = require('../../assets/answer-core');

function nums(s) { return normalizeAnswer(s).nums; }

// Нормализация чисел (запятая/точка, пробелы, сортировка)
assert.deepStrictEqual(nums('83,95'), ['83.95']);
assert.deepStrictEqual(nums('83.95'), ['83.95']);
assert.deepStrictEqual(nums(' 83,95 '), ['83.95']);
assert.deepStrictEqual(nums('60, 24'), ['24', '60']);
assert.deepStrictEqual(nums('−2; 5'), ['-2', '5']);
assert.deepStrictEqual(nums('24 и 60'), ['24', '60']);

// Сравнение
assert.strictEqual(checkAnswer('83,95', '83,95'), true);
assert.strictEqual(checkAnswer('83.95', '83,95'), true);
assert.strictEqual(checkAnswer(' 83,95 км/ч ', '83,95'), true);
assert.strictEqual(checkAnswer('82,95', '83,95'), false);
assert.strictEqual(checkAnswer('24 и 60', '24 и 60'), true);
assert.strictEqual(checkAnswer('60, 24', '24 и 60'), true);
assert.strictEqual(checkAnswer('25 и 60', '24 и 60'), false);

// Ответ без чисел — сравнение строк
assert.strictEqual(checkAnswer('прямоугольник', 'прямоугольник'), true);
assert.strictEqual(checkAnswer('прямоугольги', 'прямоугольник'), false);

console.log('ALL PASS: answer-core');
