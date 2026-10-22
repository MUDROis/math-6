# Улучшение курса «Математика 6 класс» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить на все страницы курса KaTeX-набор формул, стили печати, интерактивные числовые прямые и координатную плоскость, самопроверку с вводом, поиск и оглавление со scroll-spy.

**Architecture:** Общие CSS/JS выносятся в `assets/course.css` и `assets/course.js` и подключаются на всех страницах. Однократные Node-скрипты конвертируют разметку (KaTeX, поле ввода). Интерактив реализуется в `course.js`.

**Tech Stack:** Vanilla JS, CSS, KaTeX через CDN (cdn.jsdelivr.net, v0.16.x), Node.js (только для инструментов-конвертеров и проверок, v26). Без сборки и сервера.

**Spec:** `docs/superpowers/specs/2026-10-22-course-improvements-design.md`

## Global Constraints

- Сайт открывается как локальные файлы (`file://`); никаких сетевых запросов кроме CDN KaTeX.
- Не менять цветовую тему и общую вёрстку; только добавлять общие стили.
- Не менять математическое содержание; только представление.
- Вся математическая разметка до конвертации — `<span class="math">…</span>`. После — та же строка, но с содержимым, обёрнутым в `\(…\)`.
- Каждое задание блока «Проверь себя» имеет `div.task` с кнопкой `.toggle-btn` и `div.answer` с `id="a<gg>_<n>"`. Их не удалять.

## Review Focus

1. **KaTeX-конвертация не должна ломать текст.** Любой `span.math`, который конвертер не смог безопасно разобрать, остаётся валидным (не рендерится криво, не становится пустым). Проверка: после конвертации число `span.math` с пустым содержимым = 0; на пилотной странице просматривается каждый `span.math` визуально.
2. **Сравнение ответов терпимо к вводу.** «83,95», «83.95», « 83,95 » и «83,95 км/ч» считаются верными; «829,5» — нет. Проверка: юнит-тесты нормализации.
3. **Рендер не включает кнопки/интерактив.** В `@media print` кнопки проверки, поля ввода и виджеты скрыты, а блоки `.answer` раскрыты.
4. **Scroll-spy не ломается при отсутствии `<h2>`.** Должен безопасно обрабатывать страницы (или карточки) без заголовков секций.
5. **Виджеты валидируют ввод.** Некликовые/некорректные действия не вешают страницу; есть понятная подсказка.

---

### Task 1: Общий скелет (assets + подключение)

**Files:**
- Create: `assets/course.css`
- Create: `assets/course.js`
- Modify: `index.html` и все `lesson-*.html` (44) — в `<head>` и перед `</body>`

**Interfaces:**
- Produces: `assets/course.js` определяет глобальный `window.Course = { init(){}, … }`; вызывается на каждой странице.
- Consumes: ничего.

- [ ] **Step 1:** Создать `assets/course.css` (пустой предок с `:root`-переменными, скопированными из страниц) и `assets/course.js` (с `window.Course.init()`-обёрткой и stub-логикой).
- [ ] **Step 2:** В `assets/course.js` добавить функцию `renderKatexIfPresent()` — заглушку, которая позже вызывается из `init()`.
- [ ] **Step 3:** Во все 45 HTML-файлов добавить в `<head>`:
  - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">`
  - `<link rel="stylesheet" href="assets/course.css">`
  - `<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>`
  - `<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>`
  - `<script defer src="assets/course.js"></script>`
- [ ] **Step 4:** Проверка: Node-скрипт `scripts/verify/links.js` проходит по 45 файлам и подтверждает наличие всех 5 ссылок и что `assets/` файлы существуют.

---

### Task 2: Конвертация математики в KaTeX

**Files:**
- Create: `scripts/katex-convert.js`
- Create: `scripts/verify/katex.test.js`
- Modify: все `lesson-*.html` (содержимое `span.math`)

**Interfaces:**
- Produces: `convertMathText(src: string) → string` — чистая функция (конвертация одного выражения). Используется и в конвертере, и в тестах.
- Consumes: Task 1 (структура страниц).

- [ ] **Step 1:** Написать failing-тесты `scripts/verify/katex.test.js` на `convertMathText`, вызывая `node scripts/verify/katex.test.js`. Ожидаемые случаи (точные строки):
  - `7/12` → `\frac{7}{12}`
  - `5 1/5` → `5\frac{1}{5}`
  - `4 4/18 + 3 5/18 = 7 9/18` → `4\frac{4}{18} + 3\frac{5}{18} = 7\frac{9}{18}`
  - `2³` → `2^3`; `2⁹` → `2^9`; `x²` → `x^2`; `r²` → `r^2`
  - `16,1 · 4 + 15,4 · 3 = 110,6` → `16,1 \cdot 4 + 15,4 \cdot 3 = 110,6`
  - `30 %` → `30 \%`
  - `360°` → `360^\circ`
  - `3,5x = 84` → `3,5x = 84` (без изменений)
  - `9/36 = 1/4` → `\frac{9}{36} = \frac{1}{4}`
- [ ] **Step 2:** Запустить `node scripts/verify/katex.test.js`; убедиться, что тесты падают (функция ещё не определена).
- [ ] **Step 3:** Реализовать `convertMathText` в `scripts/katex-convert.js`. Алгоритм токенизации по порядку:
  1. Экраннировать HTML-сущности: `&lt; → \lt`, `&gt; → \gt`, `&ne; → \ne`, `&le; → \le`, `&ge; → \ge`, `&times; → \times`, `&nbsp; → ~`.
  2. Степени: заменить юникод-надстрочные `⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ` (идущие сразу за символом) на `^<цифра>`.
  3. Умножение: `·` → `\cdot` (но не внутри уже сформированных токенов).
  4. Проценты: `%` → `\%`.
  5. Градусы: `°` → `^\circ`.
  6. Дроби: заменить `N/M`, где `N`, `M` — последовательности цифр (и `.`/`,`-десятичных), на `\frac{N}{M}`. Не трогать, если это уже `\frac`.
  7. Смешанные числа: сначала обработать `Ц (space) Д/З` → `Ц\frac{Д}{З}`; затем остаточные `Д/З` → `\frac{Д}{З}`. Работать токенизатором по пробелам, не ломая «+», «=», «−».
  8. Если после всех шагов результат не изменился и не содержит запрещённых LaTeX-символов — оставить как есть.
- [ ] **Step 4:** Запустить `node scripts/verify/katex.test.js`; убедиться, что все тесты проходят.
- [ ] **Step 5:** Применить `scripts/katex-convert.js` ко всем `lesson-*.html`: для каждого `span.math` заменить содержимое на `\(` + результат `convertMathText` + `\)`.
- [ ] **Step 6:** Проверка (Node): в 44 файлах количество `span.math` с пустым содержимым = 0; количество `\(` внутри `span.math` = числу `span.math` (2457).

---

### Task 3: Стили печати

**Files:**
- Modify: `assets/course.css`

- [ ] **Step 1:** Добавить в `assets/course.css` блок `@media print`:
  - `.toggle-btn`, `.check-input`, `.check-feedback`, `.widget`, `.lesson-nav`, `.toc-sidebar` → `display:none`.
  - `.answer` → `display:block` (раскрыть).
  - `.card` → `box-shadow:none; border:1px solid #ccc; page-break-inside:avoid`.
- [ ] **Step 2:** Проверка: открыть `lesson-43.html` в браузере, вызвать печать (Ctrl+P) и просмотреть предпросмотр — кнопки скрыты, ответы видны. (Просмотр через browser.preview.)

---

### Task 4: Самопроверка с вводом ответа

**Files:**
- Create: `scripts/inject-input.js`
- Create: `scripts/verify/answer.test.js`
- Modify: все `lesson-*.html` (вставка поля в каждый `.task`); `assets/course.js` (логика проверки)

**Interfaces:**
- Produces: функция `normalizeAnswer(s: string) → string` в `scripts/verify/answer.test.js` (тестовая) и идентичная логика внутри `course.js`; `window.Course.checkAnswer(inputEl, answerStr)`.
- Consumes: Task 1 (course.js при наличии).

- [ ] **Step 1:** Написать failing-тесты `scripts/verify/answer.test.js` на `normalizeAnswer` (нижний регистр, удаление пробелов, `,`↔`.` как десятичный разделитель, отбрасывание единиц измерения/хвоста от первого пробела). Примеры: `"83,95"` == `"83.95"` == `" 83,95 "`; `"83,95 км/ч"` == `"83.95"`; `"24 и 60"` — проверка на «contains» одного из значений.
- [ ] **Step 2:** Запустить `node scripts/verify/answer.test.js` — падает.
- [ ] **Step 3:** Реализовать `normalizeAnswer` и `checkAnswer` в `course.js` (потребитель — инъектор и браузер).
- [ ] **Step 4:** Запустить `node scripts/verify/answer.test.js` — зелёные.
- [ ] **Step 5:** `scripts/inject-input.js`: для каждого `div.task` добавить перед `.toggle-btn`:
  - `<input class="check-input" type="text" placeholder="Введи ответ">`
  - `<button class="check-btn" type="button">Проверить</button>`
  - `<span class="check-feedback"></span>`
  - в `data-answer` записать эталонный текст из первого `<b>Ответ:</b>` в `.answer` (текст после «Ответ:»).
- [ ] **Step 6:** В `course.js` навесить обработчик: клик по `.check-btn` → `checkAnswer`; при верном — «✅ Верно!», неверном — «❌ Попробуй ещё» (и показывать подсказку-кнопку «Показать ответ»).
- [ ] **Step 7:** Применить `scripts/inject-input.js` ко всем 44 урокам. Проверка (Node): в каждом уроке число `.check-input` == 6, у каждого `<div.task>` есть `data-answer`.

---

### Task 5: Интерактивные виджеты (числовая прямая + координатная плоскость)

**Files:**
- Modify: `assets/course.js` (виджеты), `assets/course.css` (стили), `lesson-01.html`, `lesson-24.html`, `lesson-28.html`, `lesson-29.html`, `lesson-43.html`

**Interfaces:**
- Produces: `window.Course.NumberLineWidget(containerEl, options)` и `window.Course.CoordinatePlaneWidget(containerEl, options)`, где `options.exercises = [{prompt, correct:coords}]`.

- [ ] **Step 1:** В `course.js` реализовать `NumberLineWidget`: SVG-прямая, деления, клик ставит точку; по кнопке «Проверить» сравнивает клик с `options.exercises[i].correct` и показывает обратную связь.
- [ ] **Step 2:** Реализовать `CoordinatePlaneWidget`: сетка, оси, клик ставит точку, проверка координат (с допуском в пределах половины клетки).
- [ ] **Step 3:** Добавить стили для `.widget` в `assets/course.css` (рамка, центрирование, интерактивные курсоры).
- [ ] **Step 4:** Встраить виджеты:
  - Повlesson-43.html`: `CoordinatePlaneWidget` с заданиями из п. 43 (точки X(3;9), Y(5;−2), Q(−2;−9) — из №6.48; точка C(3;−2) из схемы).
  - `lesson-24.html`, `lesson-28.html`, `lesson-29.html`: `NumberLineWidget` (координаты/перемещения).
  - `lesson-01.html`: `NumberLineWidget` для среднего (отметить среднее 8 между 4 и 12).
- [ ] **Step 5:** Проверка в браузере: на `lesson-43.html` клик ставит точку и проверка корректно отвечает на верный/неверный ввод.

---

### Task 6: Поиск по курсу (index.html)

**Files:**
- Modify: `index.html`, `assets/course.js`, `assets/course.css`

- [ ] **Step 1:** В `index.html` над первым `<details class="chapter">` добавить `<input id="course-search" type="search" placeholder="Поиск по курсу…">`.
- [ ] **Step 2:** В `course.js` добавить `initSearch()`: по вводу фильтрует все `.lesson-row` по совпадению в `.info h4` и `.info p`; несовпавшие скрывает; пустой ввод показывает все.
- [ ] **Step 3:** Стили для `#course-search` в `course.css`.
- [ ] **Step 4:** Проверка в браузере: ввод «пропорц» оставляет строки с «Пропорция», скрывает остальные.

---

### Task 7: Оглавление урока со scroll-spy

**Files:**
- Modify: `assets/course.js`, `assets/course.css`, все `lesson-*.html`

- [ ] **Step 1:** В `course.js` добавить `initToc()`: для каждой страницы собрать `h2` внутри `.card`; если их ≥ 2 — создать боковую панель `.toc-sidebar` со ссылками-якорями; отметить активный параграф через IntersectionObserver.
- [ ] **Step 2:** Стили `.toc-sidebar` (фиксированная колонка справа на широких экранах, скрытие на <900px) в `course.css`.
- [ ] **Step 3:** Подключить `initToc()` в `init()`.
- [ ] **Step 4:** Проверка в браузере: на `lesson-43.html` панель показывает секции, при прокрутке подсвечивается активная; на странице с одним `<h2>` панель не появляется.

---

### Task 8: Финальная сквозная проверка

**Files:**
- (проверка, без правок, кроме найденных дефектов)

- [ ] **Step 1:** Прогнать `node scripts/verify/katex.test.js` и `node scripts/verify/answer.test.js` — зелёные.
- [ ] **Step 2:** Открыть в браузере выборку страниц (index, 1, 12, 24, 40, 43, 44) и проверить: KaTeX рендерится, поле ввода работает, кнопка «Показать ответ» работает, виджеты кликабельны, scroll-spy работает.
- [ ] **Step 3:** Проверить `@media print` на одной странице.
- [ ] **Step 4:** Исправить любые найденные дефекты и повторить шаги, пока не зелёные.
