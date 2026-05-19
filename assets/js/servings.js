(function () {
  'use strict';
  var root = document.querySelector('.recipe');
  if (!root) return;
  var DEFAULT = parseInt(root.getAttribute('data-default-servings') || '2', 10) || 2;
  var servings = DEFAULT;
  var valueEl = document.getElementById('servings-value');
  var items = root.querySelectorAll('li[data-base-amount]');

  // Vulgar fraction approximations that look right on a recipe card.
  // Keep this list short and ergonomic — bakers don't use 1/8.
  var FRACTIONS = [
    { v: 0,    s: '' },
    { v: 1/4,  s: '\u00BC' }, // ¼
    { v: 1/3,  s: '\u2153' }, // ⅓
    { v: 1/2,  s: '\u00BD' }, // ½
    { v: 2/3,  s: '\u2154' }, // ⅔
    { v: 3/4,  s: '\u00BE' }, // ¾
    { v: 1,    s: '' }
  ];
  var FRACTION_UNITS = { none: 1, pc: 1, tbsp: 1 };

  function nearestFraction(frac) {
    var best = FRACTIONS[0];
    var bestD = Infinity;
    for (var i = 0; i < FRACTIONS.length; i++) {
      var d = Math.abs(frac - FRACTIONS[i].v);
      if (d < bestD) { bestD = d; best = FRACTIONS[i]; }
    }
    return best;
  }

  function formatFractional(n) {
    if (n <= 0) return '0';
    var whole = Math.floor(n);
    var nearest = nearestFraction(n - whole);
    if (nearest.v === 1) whole += 1;
    if (nearest.v === 0 || nearest.v === 1) return String(whole);
    return whole > 0 ? whole + ' ' + nearest.s : nearest.s;
  }

  function formatDecimal(n) {
    // 1 decimal, with trailing zero stripped: 100, 106.7, 0.5
    var rounded = Math.round(n * 10) / 10;
    if (rounded === Math.floor(rounded)) return String(rounded);
    return rounded.toFixed(1).replace(/\.0$/, '');
  }

  function format(n, unit) {
    return FRACTION_UNITS[unit] ? formatFractional(n) : formatDecimal(n);
  }

  function apply() {
    var m = servings / DEFAULT;
    items.forEach(function (li) {
      var base = parseFloat(li.getAttribute('data-base-amount'));
      if (isNaN(base)) return;
      var unit = li.getAttribute('data-unit') || 'none';
      var out = li.querySelector('[data-amount-out]');
      if (out) out.textContent = format(base * m, unit);
    });
    if (valueEl) valueEl.textContent = String(servings);
  }

  var minus = document.getElementById('servings-minus');
  var plus = document.getElementById('servings-plus');
  if (minus)
    minus.addEventListener('click', function () {
      servings = Math.max(1, servings - 1);
      apply();
    });
  if (plus)
    plus.addEventListener('click', function () {
      servings += 1;
      apply();
    });
})();
