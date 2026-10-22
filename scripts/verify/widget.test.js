// Юнит-тесты математики виджетов (axis-math.js)
const assert = require('assert');
const { linearMap, clamp, snapInterval } = require('../../assets/axis-math');

// linearMap
assert.strictEqual(linearMap(0, 0, 10, 0, 100), 0);
assert.strictEqual(linearMap(5, 0, 10, 0, 100), 50);
assert.strictEqual(linearMap(10, 0, 10, 0, 100), 100);
// отрицательный диапазон: −4..4 → 0..240
assert.strictEqual(linearMap(-4, -4, 4, 0, 240), 0);
assert.strictEqual(linearMap(0, -4, 4, 0, 240), 120);
assert.strictEqual(linearMap(4, -4, 4, 0, 240), 240);
assert.strictEqual(linearMap(2, -4, 4, 0, 240), 180);
// обратное отображение (px → значение) с теми же параметрами
assert.strictEqual(linearMap(180, 0, 240, -4, 4), 2);

// clamp
assert.strictEqual(clamp(15, 0, 10), 10);
assert.strictEqual(clamp(-3, 0, 10), 0);
assert.strictEqual(clamp(5, 0, 10), 5);

// snapInterval
assert.strictEqual(snapInterval(83, 0, 10), 80);
assert.strictEqual(snapInterval(87, 0, 10), 90);
assert.strictEqual(snapInterval(5.2, 0, 2), 6);
assert.strictEqual(snapInterval(4.8, 0, 2), 4);

console.log('ALL PASS: widget math');
