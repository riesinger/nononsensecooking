(function () {
  'use strict';

  var FUSE_URL = '/vendor/fuse-7.3.0.min.mjs';
  (function () {
    var s = document.currentScript;
    if (!s) return;
    FUSE_URL = s.getAttribute('data-fuse-url') || FUSE_URL;
  })();

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments;
      var self = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(self, a);
      }, ms);
    };
  }

  function initNav() {
    var btn = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initRandomRecipe() {
    var links = document.querySelectorAll('[data-random-recipe]');
    if (!links.length) return;
    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        loadIndex()
          .then(function (data) {
            if (!data || !data.length) return;
            var pick = data[Math.floor(Math.random() * data.length)];
            if (pick && pick.url) window.location.href = pick.url;
          })
          .catch(function () {
            window.location.href = link.getAttribute('href');
          });
      });
    });
  }

  function initSearchShortcut() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      var tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
          (t && t.isContentEditable)) return;
      var input = document.getElementById('search-input') ||
                  document.getElementById('search-input-standalone');
      if (!input) return;
      e.preventDefault();
      input.focus();
      try { input.select(); } catch (_) {}
    });
  }

  function fuseOpts() {
    return {
      keys: ['title'],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: false,
    };
  }

  function sanitize(s) {
    return (s || '').trim().replace(/[<>]/g, '');
  }

  function langPrefix() {
    var lang = document.documentElement.lang || 'en';
    if (lang.indexOf('de') === 0) return 'de';
    return 'en';
  }

  function searchIndexUrl() {
    return '/' + langPrefix() + '/search-index.json';
  }

  function dietClass(d) {
    return 'icon-diet icon-diet--' + (d || 'vegetarian');
  }

  function renderResultItem(item) {
    var li = document.createElement('li');
    li.className = 'search-dropdown__item';
    var a = document.createElement('a');
    a.href = item.url;
    a.className = 'search-dropdown__link';
    a.innerHTML =
      '<span class="' +
      dietClass(item.diet) +
      '" title=""></span><span>' +
      item.title.replace(/</g, '&lt;') +
      '</span>';
    li.appendChild(a);
    return li;
  }

  function renderListItem(item) {
    var li = document.createElement('li');
    li.className = 'dish-list__item';
    var a = document.createElement('a');
    a.className = 'dish-list__link';
    a.href = item.url;
    var img = document.createElement('div');
    img.className = 'dish-list__img';
    var im = document.createElement('img');
    if (item.imageSizes) im.sizes = item.imageSizes;
    if (item.imageSrcset) im.srcset = item.imageSrcset;
    im.src = item.image;
    im.alt = '';
    im.loading = 'lazy';
    im.width = 400;
    im.height = 267;
    img.appendChild(im);
    var body = document.createElement('div');
    var h = document.createElement('h3');
    h.className = 'dish-list__title';
    h.textContent = item.title;
    var row = document.createElement('div');
    row.className = 'dish-list__row';
    row.innerHTML =
      '<span>' +
      item.cookTime +
      'min</span><span class="' +
      dietClass(item.diet) +
      '"></span>';
    body.appendChild(h);
    body.appendChild(row);
    a.appendChild(img);
    a.appendChild(body);
    li.appendChild(a);
    return li;
  }

  var fusePromise = null;
  function loadFuse() {
    if (fusePromise) return fusePromise;
    // Fuse.js >= 7.1 ships only ESM, so import() rather than a <script> tag.
    fusePromise = import(FUSE_URL).then(function (m) {
      return m.default;
    }).catch(function (err) {
      fusePromise = null;
      throw err;
    });
    return fusePromise;
  }

  var indexPromise = null;
  function loadIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = fetch(searchIndexUrl()).then(function (r) {
      if (!r.ok) {
        indexPromise = null;
        throw new Error('index http ' + r.status);
      }
      return r.json();
    });
    return indexPromise;
  }

  var fuseInstance = null;
  function getFuse() {
    if (fuseInstance) return Promise.resolve(fuseInstance);
    return Promise.all([loadFuse(), loadIndex()]).then(function (results) {
      var Fuse = results[0];
      var data = results[1];
      fuseInstance = new Fuse(data, fuseOpts());
      return fuseInstance;
    });
  }

  function warmSearch() {
    getFuse().catch(function () {});
  }

  function initSearchBar() {
    var form = document.getElementById('search-form');
    var input = document.getElementById('search-input');
    var dd = document.getElementById('search-dropdown');
    if (!form || !input || !dd) return;

    var runDebounced = debounce(function () {
      var q = sanitize(input.value);
      if (!q) {
        dd.hidden = true;
        dd.innerHTML = '';
        return;
      }
      getFuse()
        .then(function (fuse) {
          var results = fuse.search(q).slice(0, 12);
          dd.innerHTML = '';
          results.forEach(function (hit) {
            dd.appendChild(renderResultItem(hit.item));
          });
          dd.hidden = results.length === 0;
        })
        .catch(function () {
          dd.hidden = true;
        });
    }, 250);

    input.addEventListener('focus', warmSearch, { once: true });
    input.addEventListener('input', runDebounced);
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) {
        dd.hidden = true;
      }
    });
    form.addEventListener('submit', function () {
      dd.hidden = true;
    });
  }

  function initSearchPage() {
    var page = document.getElementById('search-page');
    if (!page) return;
    var params = new URLSearchParams(window.location.search);
    var q = sanitize(params.get('query') || '');
    var empty = document.getElementById('search-empty');
    var wrap = document.getElementById('search-results-wrap');
    var heading = document.getElementById('search-heading');
    var list = document.getElementById('search-results-list');
    if (!q) {
      if (empty) empty.hidden = false;
      if (wrap) wrap.hidden = true;
      return;
    }
    getFuse()
      .then(function (fuse) {
        var results = fuse.search(q);
        if (empty) empty.hidden = true;
        if (wrap) wrap.hidden = false;
        if (heading)
          heading.textContent =
            document.documentElement.lang && document.documentElement.lang.indexOf('de') === 0
              ? 'Suchergebnisse für ' + q
              : 'Search results for ' + q;
        if (list) {
          list.innerHTML = '';
          results.forEach(function (hit) {
            list.appendChild(renderListItem(hit.item));
          });
        }
      })
      .catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSearchBar();
    initSearchPage();
    initRandomRecipe();
    initSearchShortcut();
  });
})();
