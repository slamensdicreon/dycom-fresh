/*
 * Dycom Investors page — page behaviour for the static package.
 * Plain JavaScript, no dependencies. Every part checks that its markup exists, so a section can be
 * removed from index.html without breaking the others.
 *
 *  1. Motion          footer Motion control; follows prefers-reduced-motion until the visitor chooses
 *  2. Results bar     shows for WindowDays after ReleaseDate (or always with data-force-show="true");
 *                     dismissed for the browser session, per release
 *  3. Header menus    six mega menus, one open at a time; Escape, outside click, ArrowDown
 *  4. Language menu   records the choice only (translation belongs to the platform)
 *  5. Phone menu      native <dialog> drawer; one group open at a time
 *  6. Event tabs      Upcoming / Past re-split from each event's date on the visitor's day
 *  7. Brand film      loads and plays in place on request, muted, native controls
 *  8. Footer          accordions on phones
 */
(function () {
  'use strict';

  var root = document.querySelector('.dy-site');
  if (!root) return;
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function store(kind, key, value) {
    try {
      var s = window[kind];
      if (value === undefined) return s.getItem(key);
      s.setItem(key, value);
    } catch (e) {
      /* storage blocked: behaviour falls back to defaults */
    }
    return null;
  }
  function motionOff() {
    return root.getAttribute('data-motion') === 'off' || reduceQuery.matches;
  }

  /* 1. Motion ------------------------------------------------------------------------------- */
  var MOTION_KEY = 'dycom:motion';
  var motionButton = root.querySelector('.dy-footer-utility button[aria-pressed]');
  function setMotion(off, remember) {
    root.setAttribute('data-motion', off ? 'off' : 'on');
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(!off));
      var state = motionButton.querySelector('span');
      if (state) state.textContent = off ? 'off' : 'on';
    }
    if (remember) store('localStorage', MOTION_KEY, off ? 'off' : 'on');
    if (off) {
      var v = root.querySelector('.dy-film video');
      if (v) v.pause();
    }
  }
  var savedMotion = store('localStorage', MOTION_KEY);
  setMotion(savedMotion ? savedMotion === 'off' : reduceQuery.matches, false);
  reduceQuery.addEventListener('change', function () {
    if (!store('localStorage', MOTION_KEY)) setMotion(reduceQuery.matches, false);
  });
  if (motionButton) {
    motionButton.addEventListener('click', function () {
      setMotion(root.getAttribute('data-motion') !== 'off', true);
    });
  }

  /* 2. Results bar -------------------------------------------------------------------------- */
  var DISMISS_KEY = 'dycom:results-bar-dismissed';
  var bar = root.querySelector('.dy-results-bar');
  if (bar) {
    var release = (bar.getAttribute('data-release-date') || '').slice(0, 10);
    var days = Number(bar.getAttribute('data-window-days')) || 14;
    var force = bar.getAttribute('data-force-show') === 'true';
    var inWindow = false;
    var start = new Date(release + 'T00:00:00');
    if (!isNaN(start.getTime())) {
      var end = new Date(start);
      end.setDate(end.getDate() + days);
      var now = new Date();
      inWindow = now >= start && now < end;
    }
    var dismissed = store('sessionStorage', DISMISS_KEY) === release;
    bar.hidden = dismissed || !(force || inWindow);
    var close = bar.querySelector('.dy-results-bar-close');
    if (close) {
      close.addEventListener('click', function () {
        bar.hidden = true;
        store('sessionStorage', DISMISS_KEY, release || '1');
        var next = root.querySelector('.dy-brand');
        if (next) next.focus();
      });
    }
  }

  /* 3. Header menus ------------------------------------------------------------------------- */
  var header = root.querySelector('.dy-header');
  var triggers = header ? Array.prototype.slice.call(header.querySelectorAll('.dy-nav-trigger')) : [];
  function menuFor(t) {
    return document.getElementById(t.getAttribute('aria-controls'));
  }
  function closeMenus(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var m = menuFor(t);
      if (m) m.hidden = true;
    });
  }
  function openMenu(t, focusFirst) {
    closeMenus(t);
    t.setAttribute('aria-expanded', 'true');
    var m = menuFor(t);
    if (!m) return;
    m.hidden = false;
    if (focusFirst) {
      var first = m.querySelector('a');
      if (first) first.focus();
    }
  }
  triggers.forEach(function (t) {
    t.addEventListener('click', function () {
      if (t.getAttribute('aria-expanded') === 'true') closeMenus();
      else openMenu(t, false);
    });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openMenu(t, true);
      }
    });
    var m = menuFor(t);
    if (m) {
      m.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenus();
      });
    }
  });
  if (header) {
    header.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = header.querySelector('.dy-nav-trigger[aria-expanded="true"]');
      if (open) {
        closeMenus();
        open.focus();
      }
    });
  }
  document.addEventListener('click', function (e) {
    if (header && !header.contains(e.target)) closeMenus();
  });

  /* 4. Language menu ------------------------------------------------------------------------ */
  var lang = root.querySelector('.dy-lang');
  if (lang) {
    var langButton = lang.querySelector('.dy-lang-trigger');
    var langMenu = document.getElementById(langButton.getAttribute('aria-controls'));
    var options = langMenu ? Array.prototype.slice.call(langMenu.querySelectorAll('[role="menuitemradio"]')) : [];
    var setLangOpen = function (open) {
      if (!langMenu) return;
      langMenu.hidden = !open;
      langButton.setAttribute('aria-expanded', String(open));
      if (open) {
        var current = options.filter(function (o) { return o.getAttribute('aria-checked') === 'true'; })[0] || options[0];
        if (current) current.focus();
      }
    };
    langButton.setAttribute('aria-expanded', 'false');
    langButton.addEventListener('click', function () {
      setLangOpen(langMenu.hidden);
    });
    options.forEach(function (o) {
      o.addEventListener('click', function () {
        options.forEach(function (x) { x.setAttribute('aria-checked', String(x === o)); });
        langButton.setAttribute('aria-label', 'Language: ' + o.textContent.trim());
        setLangOpen(false);
        langButton.focus();
      });
    });
    lang.addEventListener('keydown', function (e) {
      if (!langMenu || langMenu.hidden) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        setLangOpen(false);
        langButton.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var at = options.indexOf(document.activeElement);
        var step = e.key === 'ArrowDown' ? 1 : options.length - 1;
        options[(at + step) % options.length].focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!lang.contains(e.target) && langMenu && !langMenu.hidden) setLangOpen(false);
    });
  }

  /* 5. Phone menu --------------------------------------------------------------------------- */
  var navDialog = document.getElementById('dy-mobile-nav');
  var navOpen = root.querySelector('.dy-mobile-trigger');
  if (navDialog && navOpen && typeof navDialog.showModal === 'function') {
    var opener = null;
    var openNav = function () {
      opener = document.activeElement;
      navDialog.setAttribute('data-phase', 'open');
      navDialog.showModal();
      document.body.style.overflow = 'hidden';
    };
    var closeNav = function () {
      if (!navDialog.open) return;
      navDialog.setAttribute('data-phase', 'closing');
      window.setTimeout(function () {
        navDialog.close();
        navDialog.setAttribute('data-phase', 'closed');
        document.body.style.overflow = '';
        if (opener && opener.isConnected) opener.focus();
      }, motionOff() ? 0 : 280);
    };
    navOpen.addEventListener('click', openNav);
    navDialog.querySelector('.dy-dialog-head .dy-icon-button').addEventListener('click', closeNav);
    navDialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeNav();
    });
    navDialog.addEventListener('click', function (e) {
      if (e.target === navDialog || e.target.closest('a')) closeNav();
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (q) {
      if (q.matches) closeNav();
    });
    var groups = Array.prototype.slice.call(navDialog.querySelectorAll('.dy-accordion-item'));
    groups.forEach(function (item) {
      var btn = item.querySelector('.dy-accordion-trigger');
      btn.addEventListener('click', function () {
        var opening = btn.getAttribute('aria-expanded') !== 'true';
        groups.forEach(function (other) {
          var on = opening && other === item;
          var b = other.querySelector('.dy-accordion-trigger');
          var panel = other.querySelector('.dy-accordion-content');
          other.setAttribute('data-state', on ? 'open' : 'closed');
          b.setAttribute('aria-expanded', String(on));
          b.setAttribute('data-state', on ? 'open' : 'closed');
          if (panel) {
            panel.hidden = !on;
            panel.setAttribute('data-state', on ? 'open' : 'closed');
          }
        });
      });
    });
  }

  /* 6. Event tabs --------------------------------------------------------------------------- */
  var tabs = root.querySelector('.dy-irp-tabs');
  if (tabs) {
    var tabButtons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    var panelOf = function (b) { return document.getElementById(b.getAttribute('aria-controls')); };
    var listOf = function (key) {
      var b = tabs.querySelector('[data-tab="' + key + '"]');
      return b ? panelOf(b).querySelector('.dy-irp-timeline') : null;
    };
    var upcoming = listOf('upcoming');
    var past = listOf('past');
    if (upcoming && past) {
      // Re-split on the visitor's day so a past event is never listed as upcoming.
      var today = new Date();
      var day = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      var dateOf = function (li) {
        var t = li.querySelector('time');
        return t ? (t.getAttribute('datetime') || '').slice(0, 10) : '';
      };
      var items = Array.prototype.slice.call(upcoming.children).concat(Array.prototype.slice.call(past.children));
      items
        .filter(function (li) { return dateOf(li) >= day; })
        .sort(function (a, b) { return dateOf(a).localeCompare(dateOf(b)); })
        .forEach(function (li) { upcoming.appendChild(li); });
      items
        .filter(function (li) { return dateOf(li) < day; })
        .sort(function (a, b) { return dateOf(b).localeCompare(dateOf(a)); })
        .forEach(function (li) { past.appendChild(li); });
      [upcoming, past].forEach(function (list) {
        var empty = list.parentNode.querySelector('.dy-irp-empty');
        list.hidden = list.children.length === 0;
        if (empty) empty.hidden = list.children.length !== 0;
      });
    }
    var select = function (btn, focus) {
      tabButtons.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.setAttribute('tabindex', on ? '0' : '-1');
        b.setAttribute('data-state', on ? 'active' : 'inactive');
        panelOf(b).hidden = !on;
      });
      if (focus) btn.focus();
    };
    // Open on Upcoming when anything is scheduled, otherwise on Past.
    var startTab = upcoming && upcoming.children.length ? 'upcoming' : 'past';
    select(tabs.querySelector('[data-tab="' + startTab + '"]') || tabButtons[0], false);
    tabButtons.forEach(function (b) {
      b.addEventListener('click', function () { select(b, false); });
    });
    tabs.querySelector('[role="tablist"]').addEventListener('keydown', function (e) {
      var at = tabButtons.indexOf(document.activeElement);
      var next = null;
      if (e.key === 'ArrowRight') next = tabButtons[(at + 1) % tabButtons.length];
      if (e.key === 'ArrowLeft') next = tabButtons[(at + tabButtons.length - 1) % tabButtons.length];
      if (e.key === 'Home') next = tabButtons[0];
      if (e.key === 'End') next = tabButtons[tabButtons.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  }

  /* 7. Brand film --------------------------------------------------------------------------- */
  var film = root.querySelector('.dy-film');
  if (film) {
    var video = film.querySelector('video');
    var cover = film.querySelector('.dy-film-cover');
    var play = film.querySelector('.dy-film-play');
    var showCover = function (show) {
      if (cover) cover.hidden = !show;
      if (show) film.removeAttribute('data-playing');
      else film.setAttribute('data-playing', 'true');
    };
    video.addEventListener('play', function () { showCover(false); });
    video.addEventListener('pause', function () { showCover(true); });
    video.addEventListener('ended', function () { showCover(true); });
    if (play) {
      play.addEventListener('click', function () {
        if (!video.getAttribute('src')) video.setAttribute('src', video.getAttribute('data-src'));
        video.muted = true;
        video.controls = true;
        video.tabIndex = 0;
        film.setAttribute('data-started', 'true');
        var p = video.play();
        if (p && p.then) {
          p.then(function () { video.focus({ preventScroll: true }); }).catch(function () { showCover(true); });
        }
      });
    }
  }

  /* 8. Footer accordions -------------------------------------------------------------------- */
  Array.prototype.forEach.call(root.querySelectorAll('.dy-footer-accordion-trigger'), function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('data-state', open ? 'open' : 'closed');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = !open;
    });
  });
})();
