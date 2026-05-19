(function () {
  'use strict';

  var root = document.querySelector('[data-recipe-filters]');
  var list = document.querySelector('[data-recipe-list]');
  var empty = document.querySelector('[data-recipe-empty]');
  var count = document.querySelector('[data-recipe-count]');
  if (!root || !list) return;

  var dietChips = Array.prototype.slice.call(root.querySelectorAll('[data-filter-diet]'));
  var timeChips = Array.prototype.slice.call(root.querySelectorAll('[data-filter-cooktime]'));
  var select = root.querySelector('[data-recipe-sort]');
  var items = Array.prototype.slice.call(list.children);
  var total = items.length;

  var VALID_DIETS = { all: 1, vegan: 1, vegetarian: 1, fish: 1, meat: 1 };
  var VALID_TIMES = { all: 1, '15': 1, '30': 1, '60': 1 };
  var VALID_SORTS = { title: 1, latest: 1, cooktime: 1 };

  var COUNT_TEMPLATE = (count && count.getAttribute('data-template')) || '';

  var state = readState();
  applyState();

  function readState() {
    var p = new URLSearchParams(window.location.search);
    var diet = p.get('diet') || 'all';
    if (!VALID_DIETS[diet]) diet = 'all';
    var time = p.get('time') || 'all';
    if (!VALID_TIMES[time]) time = 'all';
    var sort = p.get('sort') || 'latest';
    if (!VALID_SORTS[sort]) sort = 'latest';
    return { diet: diet, time: time, sort: sort };
  }

  function writeState() {
    var p = new URLSearchParams(window.location.search);
    if (state.diet === 'all') p.delete('diet'); else p.set('diet', state.diet);
    if (state.time === 'all') p.delete('time'); else p.set('time', state.time);
    if (state.sort === 'latest') p.delete('sort'); else p.set('sort', state.sort);
    var qs = p.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    window.history.replaceState(null, '', url);
  }

  function applyState() {
    setActive(dietChips, 'data-filter-diet', state.diet);
    setActive(timeChips, 'data-filter-cooktime', state.time);
    if (select && select.value !== state.sort) select.value = state.sort;

    var maxTime = state.time === 'all' ? Infinity : parseInt(state.time, 10);
    var visible = 0;
    items.forEach(function (li) {
      var dietOk = state.diet === 'all' || li.getAttribute('data-diet') === state.diet;
      var timeOk = (parseInt(li.getAttribute('data-cooktime'), 10) || 0) <= maxTime;
      var match = dietOk && timeOk;
      li.hidden = !match;
      if (match) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
    if (count) {
      count.textContent = COUNT_TEMPLATE
        .replace('{n}', visible)
        .replace('{total}', total);
    }

    sortInPlace(state.sort);
  }

  function setActive(chips, attr, value) {
    chips.forEach(function (chip) {
      var active = chip.getAttribute(attr) === value;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function sortInPlace(mode) {
    var sorted = items.slice().sort(comparator(mode));
    var same = true;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i] !== items[i]) { same = false; break; }
    }
    if (same) return;
    var frag = document.createDocumentFragment();
    sorted.forEach(function (li) { frag.appendChild(li); });
    list.appendChild(frag);
    items = sorted;
  }

  function comparator(mode) {
    if (mode === 'title') {
      return function (a, b) {
        return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
      };
    }
    if (mode === 'cooktime') {
      return function (a, b) {
        var av = parseInt(a.getAttribute('data-cooktime'), 10) || 0;
        var bv = parseInt(b.getAttribute('data-cooktime'), 10) || 0;
        if (av !== bv) return av - bv;
        return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
      };
    }
    return function (a, b) {
      var ad = a.getAttribute('data-date');
      var bd = b.getAttribute('data-date');
      if (ad < bd) return 1;
      if (ad > bd) return -1;
      return 0;
    };
  }

  dietChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var next = chip.getAttribute('data-filter-diet') || 'all';
      if (state.diet === next) return;
      state.diet = next;
      writeState();
      applyState();
    });
  });

  timeChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var next = chip.getAttribute('data-filter-cooktime') || 'all';
      if (state.time === next) return;
      state.time = next;
      writeState();
      applyState();
    });
  });

  if (select) {
    select.addEventListener('change', function () {
      var next = select.value;
      if (!VALID_SORTS[next] || state.sort === next) return;
      state.sort = next;
      writeState();
      applyState();
    });
  }

  window.addEventListener('popstate', function () {
    state = readState();
    applyState();
  });
})();
