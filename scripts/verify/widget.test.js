// Юнит-тесты математики виджетов (axis-math.js)
const assert = require('assert');
const { linearMap, clamp, snapInterval, planeTickPos } = require('../../assets/axis-math');

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

// Координатная плоскость: подписи/тики ОСЕЙ должны совпадать с положением точек
// (тот же масштаб, что у worldToPx: центр (200,200), 20px на единицу).
// Регрессия: раньше ось x использовала linearMap(-6..6→0..400), что давало
// 33.33px/ед. и не совпадало с сеткой (20px/ед.).
assert.strictEqual(planeTickPos(1, 200, 20, 'x'), 220);
assert.strictEqual(planeTickPos(-1, 200, 20, 'x'), 180);
assert.strictEqual(planeTickPos(4, 200, 20, 'x'), 280);
assert.strictEqual(planeTickPos(1, 200, 20, 'y'), 180);
assert.strictEqual(planeTickPos(-1, 200, 20, 'y'), 220);
assert.strictEqual(planeTickPos(-3, 200, 20, 'y'), 260);

console.log('ALL PASS: widget math');
