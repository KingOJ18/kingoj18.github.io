/* ==========================================================================
   ASTROVIA — ui.js   Interface logic: HUD, panels, dialogs, Simple view.
   Talks to the 3D engine only through ASTROVIA.bus, ASTROVIA.settings and
   the public methods on ASTROVIA.engine (see DEV_NOTES.md §5).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  var bus = A.bus, S = A.settings, U = A.util, R = A.route, doc = document;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };

  /* ------------------------------------------------------------- helpers */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : '#'; }

  var ICONS = {
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    'sound-off': '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="m16 9 5 6M21 9l-5 6"/>',
    'sound-on': '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
    sliders: '<path d="M5 6h8M17 6h2M5 12h2M11 12h8M5 18h10M19 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    compare: '<circle cx="8" cy="14" r="5"/><circle cx="17" cy="8" r="3"/>',
    scale: '<path d="M3 16 16 3l5 5L8 21z"/><path d="m7 12 2 2M10 9l2 2M13 6l2 2"/>',
    rocket: '<path d="M12 3c3 2 5 5 5 9l-2 4H9l-2-4c0-4 2-7 5-9z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 16l-3 4M15 16l3 4M12 17v4"/>',
    log: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4v-1h6v1M9 11l2 2 4-4M9 17h6"/>',
    book: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    minus: '<path d="M5 12h14"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    reset: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>',
    tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h0"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[n] || '') + '</svg>'; }
  function ic(n) { return '<span class="ico" aria-hidden="true">' + svg(n) + '</span>'; }
  function hydrateIcons(root) { $$('[data-icon]', root).forEach(function (e) { e.innerHTML = svg(e.getAttribute('data-icon')); e.removeAttribute('data-icon'); }); }

  var STATUS = {
    confirmed: { label: 'Confirmed', icon: 'check', help: 'Directly observed or measured' },
    hypothesis: { label: 'Hypothesis', icon: 'bulb', help: 'A leading explanation that is not settled' },
    open: { label: 'Open question', icon: 'help', help: 'Not yet answered' },
    historical: { label: 'Historical', icon: 'check' }, active: { label: 'Active', icon: 'rocket' }, planned: { label: 'Planned', icon: 'bulb' }
  };
  function badge(s) { var x = STATUS[s] || { label: s, icon: 'info' }; return '<span class="badge ' + esc(s) + '">' + ic(x.icon) + esc(x.label) + '</span>'; }

  var isFile = location.protocol === 'file:';
  function disc(id, size, extra) {
    var s = R.byId[id], sw = (extra && extra.swatch) || (s && s.swatch) || ['#ccc', '#888', '#222'];
    var st = '--c1:' + sw[0] + ';--c2:' + sw[1] + ';--c3:' + sw[2] + (size ? ';width:' + size + 'px;height:' + size + 'px' : '');
    if (id === 'earth' && !isFile) st += ';background-image:url(' + (A.assetBase || 'assets/') + 'earth-day-1k.jpg)';
    return '<span class="disc' + (s && s.ring ? ' has-ring' : '') + (s && s.kind === 'region' ? ' region' : '') + '" style="' + st + '" aria-hidden="true"></span>';
  }

  function announce(msg) { var l = $('sr-live'); if (!l) return; l.textContent = ''; setTimeout(function () { l.textContent = msg; }, 30); }
  function eng() { return A.engine && !isSimple() ? A.engine : null; }
  function isSimple() { return !!S.get('lite') || doc.documentElement.classList.contains('no-3d'); }
  function stopAt(i) { return R.stops[i]; }
  function destOf(id) { return A.destinations && A.destinations[id]; }
  function nameOf(id) { return R.nameOf(id); }
  function stageName(id) { var s = R.stageOf(id); return s ? s.name : ''; }

  /* go to a destination from anywhere (3D or Simple view) */
  function go(id) {
    var idx = typeof id === 'number' ? id : R.indexOf(id);
    if (idx < 0) return;
    if (isSimple()) {
      var card = $('fb-' + R.stops[idx].id);
      if (card) { card.scrollIntoView({ behavior: S.effectiveMotion() === 'reduced' ? 'auto' : 'smooth', block: 'start' }); card.focus({ preventScroll: true }); }
      else $('fallback').scrollIntoView();
      return;
    }
    if (A.engine) A.engine.goTo(idx);
  }

  /* ------------------------------------------------------ mission log */
  var LOG_KEY = 'astrovia.log';
  var visited = U.session.get(LOG_KEY, []);
  function markVisited(id) { if (visited.indexOf(id) < 0) { visited.push(id); U.session.set(LOG_KEY, visited); renderNavigator(); renderRailState(); } }

  /* ----------------------------------------------------------- state */
  var state = { index: 0, arrived: -1, popover: null, panelOpen: false, collapsed: false, fbBuilt: false, lastHop: '' };
  var opener = null;

  /* ============================== HUD + popovers ============================== */
  function closePopovers(returnFocus) {
    ['navigator', 'tools-menu', 'settings-pop'].forEach(function (id) { $(id).hidden = true; });
    ['btn-nav', 'btn-more', 'btn-menu', 'btn-settings'].forEach(function (id) { $(id).setAttribute('aria-expanded', 'false'); });
    var was = state.popover; state.popover = null;
    if (returnFocus && was) { var b = $(was.btn); if (b && b.offsetParent) b.focus(); }
  }
  function togglePopover(id, btnId, focusSel) {
    if (state.popover && state.popover.id === id) { closePopovers(true); return; }
    closePopovers(false);
    $(id).hidden = false; $(btnId).setAttribute('aria-expanded', 'true');
    state.popover = { id: id, btn: btnId };
    var f = $(id).querySelector(focusSel || 'button'); if (f) f.focus({ preventScroll: true });
  }
  function openNavigator() { renderNavigator(); togglePopoverOpen('navigator', U.isSmallScreen() || innerWidth < 900 ? 'btn-menu' : 'btn-nav', '.nav-item[aria-current="true"], .nav-item'); }
  function togglePopoverOpen(id, btnId, sel) { if (state.popover && state.popover.id === id) return; togglePopover(id, btnId, sel); }

  function syncSound() {
    var on = !!S.get('sound'), b = $('btn-sound');
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', 'Ambient sound: ' + (on ? 'on. Turn off' : 'off. Turn on'));
    b.querySelector('.ico').innerHTML = svg(on ? 'sound-on' : 'sound-off');
    $$('[data-sound-label]').forEach(function (e) { e.textContent = on ? 'Turn sound off' : 'Turn sound on'; });
    var mi = $('tools-menu').querySelector('[data-action="sound"] .ico'); if (mi) mi.innerHTML = svg(on ? 'sound-on' : 'sound-off');
  }
  function syncSettings() {
    $$('.seg').forEach(function (seg) {
      var key = seg.getAttribute('data-setting'), val = S.get(key);
      $$('button', seg).forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-value') === val ? 'true' : 'false'); });
    });
    $$('[data-setting-toggle]').forEach(function (b) {
      var key = b.getAttribute('data-setting-toggle'), v = S.get(key), on = b.getAttribute('data-on');
      b.setAttribute('aria-checked', (on ? v === on : !!v) ? 'true' : 'false');
    });
    var lb = doc.querySelector('[data-inspect="labels"]'); if (lb) lb.setAttribute('aria-pressed', S.get('labels') ? 'true' : 'false');
  }

  function initHud() {
    $('btn-nav').addEventListener('click', function () { renderNavigator(); togglePopover('navigator', 'btn-nav', '.nav-item[aria-current="true"], .nav-item'); });
    $('btn-search').addEventListener('click', function () { openSearch('search'); });
    $('btn-more').addEventListener('click', function () { togglePopover('tools-menu', 'btn-more'); });
    $('btn-menu').addEventListener('click', function () { togglePopover('tools-menu', 'btn-menu'); });
    $('btn-settings').addEventListener('click', function () { togglePopover('settings-pop', 'btn-settings', '.seg button'); });
    $('btn-sound').addEventListener('click', function () { S.set('sound', !S.get('sound')); });
    $('brand').addEventListener('click', function (e) { e.preventDefault(); restart(); });
    $$('[data-close-nav]').forEach(function (b) { b.addEventListener('click', function () { closePopovers(true); }); });

    $$('.seg').forEach(function (seg) {
      seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) S.set(seg.getAttribute('data-setting'), b.getAttribute('data-value')); });
    });
    $$('[data-setting-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-setting-toggle'), on = b.getAttribute('data-on');
        if (on) S.set(key, S.get(key) === on ? b.getAttribute('data-off') : on); else S.set(key, !S.get(key));
      });
    });

    doc.addEventListener('click', function (e) {
      var a = e.target.closest('[data-action]');
      if (a) { runAction(a.getAttribute('data-action')); return; }
      if (state.popover && !e.target.closest('.popover, .navigator, .hud-btn')) closePopovers(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.popover && !$('modal').open) { e.preventDefault(); e.stopPropagation(); closePopovers(true); }
      else if (e.key === 'Escape' && !$('feature-card').hidden && !$('modal').open) closeFeature();
    }, true);

    bus.on('settings:change', function (d) {
      if (d.key === 'sound') syncSound();
      syncSettings();
      if (d.key === 'lite') applySimple();
    });
    syncSound(); syncSettings();
  }

  function runAction(a) {
    var map = {
      navigator: function () { closePopovers(false); openNavigator(); },
      search: function () { closePopovers(false); openSearch('search'); },
      glossary: function () { closePopovers(false); openSearch('glossary'); },
      compare: openCompare, scale: openScale, missions: function () { openMissions(); }, log: openLog,
      sources: openSources, about: openAbout, accessibility: openAccessibility,
      sound: function () { S.set('sound', !S.get('sound')); },
      settings: function () { closePopovers(false); togglePopover('settings-pop', 'btn-menu', '.seg button'); },
      restart: restart
    };
    if (!map[a]) return;
    if (a !== 'settings' && a !== 'navigator') closePopovers(false);
    map[a]();
  }
  function restart() { closePopovers(false); if (isSimple()) { global.scrollTo({ top: 0 }); } else if (A.engine) A.engine.restart(); }

  /* =============================== Navigator =============================== */
  function renderNavigator() {
    var cur = state.index, html = '';
    R.stages.forEach(function (stage) {
      var items = R.stops.filter(function (s) { return s.stage === stage.id; });
      if (stage.number === 1) items = [R.stops[0]].concat(items);
      html += '<section class="nav-stage"><h3>' + stage.number + ' · ' + esc(stage.name) + '</h3>';
      items.forEach(function (s) {
        var isCur = s.index === cur, seen = visited.indexOf(s.id) >= 0;
        html += '<button type="button" class="nav-item" data-go="' + s.index + '"' + (isCur ? ' aria-current="true"' : '') + '>' + disc(s.id, 28) +
          '<span class="nav-name">' + esc(s.type === 'intro' ? 'Earth — Departure' : nameOf(s.id)) + '</span>' +
          (isCur ? '<span class="nav-flag">You are here</span>' : (seen ? ic('check').replace('class="ico"', 'class="ico nav-check"') + '<span class="sr-only">visited</span>' : '')) + '</button>';
      });
      html += '</section>';
    });
    html += '<section class="nav-stage"><button type="button" class="nav-item" data-go="' + R.finaleIndex + '"' + (cur === R.finaleIndex ? ' aria-current="true"' : '') + '>' + disc('finale', 28) + '<span class="nav-name">' + esc(R.specialNames.finale.name) + '</span></button></section>';
    $('navigator-list').innerHTML = html;
  }

  /* ================================== Rail ================================= */
  function buildRail() {
    var N = R.stops.length, html = '';
    R.stops.forEach(function (s, i) {
      var first = s.stage && (i === 0 || R.stops[i - 1].stage !== s.stage);
      var nm = s.type === 'intro' ? 'Start: Earth' : nameOf(s.id);
      html += '<li style="top:' + (i / (N - 1) * 100) + '%" data-i="' + i + '"' + (first || i === 0 ? ' class="is-stage-start"' : '') + '><button type="button" aria-label="Go to ' + esc(nm) + '"></button><span class="rail-tip" aria-hidden="true">' + esc(nm) + '</span></li>';
    });
    $('rail-list').innerHTML = html;
    $('rail-list').addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) go(+li.getAttribute('data-i')); });
  }
  function renderRailState() {
    $$('#rail-list li').forEach(function (li) {
      var i = +li.getAttribute('data-i'), id = R.stops[i].id;
      li.classList.toggle('is-visited', visited.indexOf(id) >= 0 && i !== state.index);
      li.classList.toggle('is-current', i === state.index);
    });
  }
  function updateProgress(t) {
    var p = U.clamp(t / (R.stops.length - 1), 0, 1) * 100;
    $('rail-fill').style.height = p + '%'; $('rail-here').style.top = p + '%';
    $('top-progress-fill').style.width = p + '%';
  }

  /* ========================== Hero + fact of the day ========================= */
  function initHero() {
    var f = A.facts && A.facts.length ? A.facts[U.dayOfYear(new Date()) % A.facts.length] : null;
    if (f) $('hero-fact').innerHTML = '<b>Cosmic fact of the day</b>' + esc(f.text);
    $('btn-begin').addEventListener('click', function () { if (isSimple()) { $('fallback').scrollIntoView(); } else if (A.engine) A.engine.next(); });
    $('btn-hero-nav').addEventListener('click', openNavigator);
    updateHero(0);
  }
  function updateHero(t) {
    var h = $('hero'), o = 1 - U.smoothstep(0.04, 0.5, t);
    h.style.setProperty('--hero-o', o.toFixed(3));
    h.classList.toggle('is-off', o < 0.01);
    h.classList.toggle('is-live', o > 0.6);
  }

  /* ============================== Hop captions ============================== */
  function updateHop(d) {
    var el = $('hop'), show = false;
    if (d.moving && d.f > 0.1 && d.f < 0.92) {
      var h = R.hops[d.fromIndex];
      if (h && h.kind !== 'none' && h.text) {
        show = true;
        if (state.lastHop !== d.fromIndex) {
          state.lastHop = d.fromIndex;
          $('hop-kind').textContent = R.hopKinds[h.kind] || ''; $('hop-text').textContent = h.text;
        }
      }
    }
    if (!show) state.lastHop = '';
    el.classList.toggle('is-on', show);
  }

  /* ============================ Destination panel ============================ */
  function isStageEnd(i) { var s = stopAt(i), n = stopAt(i + 1); return s && s.stage && (!n || n.stage !== s.stage); }

  function renderPanel(i) {
    var s = stopAt(i), d = destOf(s.id); if (!d) return;
    var stage = R.stageOf(s.id), seen = visited.indexOf(s.id) >= 0;
    var h = '<p class="eyebrow">' + esc(stage ? stage.number + ' · ' + stage.name : '') + '</p>';
    h += '<h2 id="panel-title" class="panel-title">' + esc(d.name) + '<span class="tag">' + esc(d.tagline) + '</span></h2>';
    h += '<p class="panel-type">' + esc(d.type) + '</p>';
    h += '<p class="lead">' + esc(d.intro) + '</p>';
    if (d.everyday) h += '<p class="everyday">' + ic('bulb') + '<span>' + esc(d.everyday) + '</span></p>';
    h += '<div class="sec"><h3>Key facts</h3><ul class="facts">' + d.keyFacts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>';
    h += '<div class="sec"><h3>Measurements</h3><dl class="measures">' + d.measurements.map(function (m) { return '<div><dt>' + esc(m.label) + '</dt><dd>' + esc(m.value) + '</dd></div>'; }).join('') + '</dl></div>';
    if (d.surprises && d.surprises.length) h += '<div class="sec"><h3>Surprising discoveries</h3><ul class="surprises">' + d.surprises.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>';
    if (d.hotspots && d.hotspots.length && !isSimple()) {
      h += '<div class="sec"><h3>Features to find</h3><div class="chips">' + d.hotspots.map(function (x) { return '<button type="button" class="chip" data-hotspot="' + esc(x.id) + '" aria-pressed="false">' + esc(x.label) + '</button>'; }).join('') + '</div></div>';
    }
    var ms = missionsFor(d);
    if (ms.length) h += '<div class="sec"><h3>Missions</h3><div class="chips">' + ms.map(function (m) { return '<button type="button" class="chip" data-mission="' + esc(m.id) + '"><span class="dot ' + esc(m.status) + '"></span>' + esc(m.name) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="panel-actions"><button type="button" class="btn btn-primary btn-small" data-deeper="' + esc(s.id) + '">Explore Deeper</button>' +
      '<button type="button" class="btn btn-ghost btn-small" data-inspect-open>' + ic('cube') + 'Inspect in 3D</button></div>';
    if (seen) h += '<p class="log-note">' + ic('check') + 'Added to your Mission Log</p>';
    if (isStageEnd(i) && stage && A.quizzes && A.quizzes[stage.quizId]) h += '<div class="quiz-prompt"><span>Quick knowledge check: ' + esc(stage.name) + '</span><button type="button" class="btn btn-ghost btn-small" data-quiz="' + esc(stage.quizId) + '">Start</button></div>';
    $('panel-scroll').innerHTML = h;
    $('panel-scroll').scrollTop = 0;

    var prev = i > 1, last = i === R.finaleIndex - 1;
    $('panel-foot').innerHTML = (prev ? '<button type="button" class="btn btn-ghost" data-nav="-1">' + ic('arrow-left') + 'Previous</button>' : '<span></span>') +
      '<button type="button" class="btn btn-primary" data-nav="1">' + (last ? 'Finish journey' : 'Continue Journey') + ic('arrow-right') + '</button>';
    var inspectBtn = $('panel-scroll').querySelector('[data-inspect-open]'); if (inspectBtn && s.kind === 'region') inspectBtn.lastChild.textContent = 'Look around in 3D';
  }
  function missionsFor(d) {
    var all = A.missions || [], out = [];
    (d.missions || []).forEach(function (id) { var m = all.filter(function (x) { return x.id === id; })[0]; if (m) out.push(m); });
    return out;
  }

  function showPanel(i) {
    renderPanel(i);
    var p = $('panel'); state.collapsed = false; p.classList.remove('is-collapsed'); $('panel-toggle').setAttribute('aria-expanded', 'true');
    p.classList.add('is-open'); state.panelOpen = true;
    bus.emit('ui:panel', { open: true, width: innerWidth < 900 ? 0 : Math.min(404, innerWidth - 28) + 40 });
  }
  function hidePanel() {
    if (!state.panelOpen) return;
    $('panel').classList.remove('is-open'); state.panelOpen = false;
    bus.emit('ui:panel', { open: false });
  }
  function initPanel() {
    $('panel').addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-nav]'))) { if (A.engine) (t.getAttribute('data-nav') === '1' ? A.engine.next() : A.engine.prev()); else go(state.index + (+t.getAttribute('data-nav'))); return; }
      if ((t = e.target.closest('[data-deeper]'))) { openDeeper(t.getAttribute('data-deeper')); return; }
      if ((t = e.target.closest('[data-inspect-open]'))) { if (A.engine) A.engine.setMode('inspect'); return; }
      if ((t = e.target.closest('[data-hotspot]'))) { if (A.engine) A.engine.focusHotspot(t.getAttribute('data-hotspot')); return; }
      if ((t = e.target.closest('[data-mission]'))) { openMissions({ focus: t.getAttribute('data-mission') }); return; }
      if ((t = e.target.closest('[data-quiz]'))) { openQuiz(t.getAttribute('data-quiz')); return; }
    });
    $('panel-foot').addEventListener('click', function (e) {
      var t = e.target.closest('[data-nav]'); if (!t) return;
      if (A.engine) (t.getAttribute('data-nav') === '1' ? A.engine.next() : A.engine.prev());
    });
    $('panel-toggle').addEventListener('click', function () {
      state.collapsed = !state.collapsed;
      $('panel').classList.toggle('is-collapsed', state.collapsed);
      $('panel-toggle').setAttribute('aria-expanded', state.collapsed ? 'false' : 'true');
      $('panel-toggle').querySelector('.sr-only').textContent = state.collapsed ? 'Show information panel' : 'Hide information panel';
    });
    $('btn-more'); // keep reference alive for clarity
  }

  /* ======================= Feature card + inspect bar ======================= */
  function showFeature(destId, hid) {
    var d = destOf(destId); if (!d) return;
    var hs = (d.hotspots || []).filter(function (x) { return x.id === hid; })[0]; if (!hs) return;
    $('feature-eyebrow').textContent = 'Feature · ' + d.name;
    $('feature-title').textContent = hs.label; $('feature-text').textContent = hs.text;
    $('feature-card').hidden = false;
    $$('[data-hotspot]').forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-hotspot') === hid ? 'true' : 'false'); });
    announce(hs.label + '. ' + hs.text);
  }
  function closeFeature() {
    $('feature-card').hidden = true;
    $$('[data-hotspot]').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
  }
  function initInspect() {
    $$('[data-close-feature]').forEach(function (b) { b.addEventListener('click', closeFeature); });
    $('inspect-bar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-inspect]'); if (!b || !A.engine) return;
      var k = b.getAttribute('data-inspect');
      if (k === 'zoom-in') A.engine.zoomBy(1); else if (k === 'zoom-out') A.engine.zoomBy(-1);
      else if (k === 'reset') A.engine.resetView();
      else if (k === 'labels') S.set('labels', !S.get('labels'));
      else if (k === 'resume') A.engine.setMode('overview');
    });
    bus.on('journey:mode', function (d) {
      if (d.mode === 'inspect') {
        closePopovers(false);
        announce('Inspect mode. Drag to rotate, use plus and minus to zoom, Escape to leave.');
        var f = $('inspect-bar').querySelector('button'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
      } else {
        announce('Back to the journey.');
        var ib = $('panel-scroll').querySelector('[data-inspect-open]'); if (ib && state.panelOpen) setTimeout(function () { ib.focus({ preventScroll: true }); }, 400);
      }
    });
    bus.on('settings:change', function (d) { if (d.key === 'labels') doc.documentElement.dataset.labels = d.value ? 'on' : ''; });
  }

  /* ================================= Finale ================================= */
  function initFinale() {
    $$('[data-finale]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-finale');
        if (k === 'restart') restart(); else if (k === 'another') openNavigator(); else if (k === 'about') openAbout();
      });
    });
  }

  /* ================================ Dialogs ================================ */
  var modal, modalOpen = false;
  function openModal(title, html, o) {
    o = o || {};
    $('modal-title').textContent = title;
    var body = $('modal-body'); body.innerHTML = html; body.scrollTop = 0;
    hydrateIcons(body);
    if (!modal.open) {
      opener = doc.activeElement;
      closePopovers(false);
      modal.showModal(); modalOpen = true;
      bus.emit('ui:dialog', { open: true });
    }
    var f = o.focus && body.querySelector(o.focus);
    if (f) f.focus(); else $('modal').querySelector('[data-close]').focus();
    return body;
  }
  function closeModal() { if (modal.open) modal.close(); }
  function initModal() {
    modal = $('modal');
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener('close', function () {
      if (modalOpen) { modalOpen = false; bus.emit('ui:dialog', { open: false }); }
      if (opener && opener.focus && doc.contains(opener)) { try { opener.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      opener = null;
    });
    $('modal-body').addEventListener('click', onModalClick);
  }
  function onModalClick(e) {
    var t;
    if ((t = e.target.closest('[data-go-dest]'))) { var id = t.getAttribute('data-go-dest'); closeModal(); setTimeout(function () { go(id); }, 80); return; }
    if ((t = e.target.closest('[data-open-deeper]'))) { openDeeper(t.getAttribute('data-open-deeper')); return; }
    if ((t = e.target.closest('[data-open-missions]'))) { openMissions({ dest: t.getAttribute('data-open-missions') }); return; }
  }

  /* ---------- Explore Deeper ---------- */
  function openDeeper(id, tab) {
    var d = destOf(id); if (!d) return;
    tab = tab || (S.get('level') === 'discover' ? 'discover' : 'explore');
    function paint(which) {
      var list = which === 'discover' ? d.discover : d.explore;
      var h = '<div class="tabs" role="tablist" aria-label="Level of detail">' +
        '<button type="button" role="tab" id="tab-explore" aria-selected="' + (which === 'explore') + '" data-tab="explore">Explore</button>' +
        '<button type="button" role="tab" id="tab-discover" aria-selected="' + (which === 'discover') + '" data-tab="discover">Discover More</button></div>';
      h += '<p class="lede">' + (which === 'discover' ? 'More detail for readers who want the physics, the numbers and the open debates.' : 'The main ideas in plain language.') + '</p>';
      h += '<div class="legend" aria-label="What the labels mean">' + ['confirmed', 'hypothesis', 'open'].map(function (k) { return badge(k) + ' ' + esc(STATUS[k].help); }).join('') + '</div>';
      h += '<div role="tabpanel" aria-labelledby="tab-' + which + '">';
      (list || []).forEach(function (sec) {
        h += '<article class="section-card"><h3>' + esc(sec.heading) + badge(sec.status) + '</h3><p>' + esc(sec.body) + '</p>' +
          (sec.equation ? '<div class="equation">' + esc(sec.equation) + '</div>' + (sec.equationNote ? '<small>' + esc(sec.equationNote) + '</small>' : '') : '') + '</article>';
      });
      var ms = missionsFor(d);
      h += '<p style="margin-top:14px"><button type="button" class="btn btn-ghost btn-small" data-go-dest="' + esc(id) + '">' + (isSimple() ? 'Back to this destination' : 'Show it in the journey') + '</button> ' +
        (ms.length ? '<button type="button" class="btn btn-ghost btn-small" data-open-missions="' + esc(id) + '">Missions here (' + ms.length + ')</button>' : '') + '</p>';
      h += '</div><div class="refs"><h3>References</h3><ul>' + (d.sources || []).map(function (r) { return '<li><a href="' + esc(safeUrl(r.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(r.title) + '</a><span class="org">' + esc(r.org) + '</span></li>'; }).join('') + '</ul></div>';
      var body = openModal(d.name + ' — ' + d.tagline, h, { focus: '[aria-selected="true"]' });
      $$('[data-tab]', body).forEach(function (b) { b.addEventListener('click', function () { S.set('level', b.getAttribute('data-tab')); paint(b.getAttribute('data-tab')); $('tab-' + b.getAttribute('data-tab')).focus(); }); });
    }
    paint(tab);
  }

  /* ---------- Search + glossary ---------- */
  function openSearch(mode) {
    var h = '<div class="field search-wrap"><label for="q">Search destinations, astronomy terms and missions</label><input id="q" class="input" type="search" autocomplete="off" placeholder="Try “Olympus Mons”, “redshift” or “Voyager”"></div><div id="results" class="results" aria-live="polite"></div>';
    var body = openModal(mode === 'glossary' ? 'Glossary' : 'Search and glossary', h, { focus: '#q' });
    var q = body.querySelector('#q'), out = body.querySelector('#results');
    function norm(s) { return String(s || '').toLowerCase(); }
    function render() {
      var v = norm(q.value).trim(), html = '';
      var dests = R.stops.filter(function (s) { return s.type === 'dest'; });
      var gl = A.glossary || [], ms = A.missions || [];
      if (!v) {
        if (mode === 'glossary') html = glossHtml(gl, '');
        else {
          html = '<h3>Destinations</h3>' + dests.map(destResult).join('');
          html += '<p class="empty">Type to search ' + gl.length + ' glossary terms and ' + ms.length + ' missions too.</p>';
        }
        out.innerHTML = html; return;
      }
      var dm = dests.filter(function (s) { var d = destOf(s.id); return d && (norm(d.name).indexOf(v) >= 0 || norm(d.tagline).indexOf(v) >= 0 || norm(d.type).indexOf(v) >= 0 || (d.tags || []).some(function (t) { return norm(t).indexOf(v) >= 0; }) || (d.hotspots || []).some(function (x) { return norm(x.label).indexOf(v) >= 0; }) || norm(d.intro).indexOf(v) >= 0); });
      var gm = gl.filter(function (g) { return norm(g.term).indexOf(v) >= 0 || (g.aka || []).some(function (a) { return norm(a).indexOf(v) >= 0; }) || norm(g.definition).indexOf(v) >= 0; });
      var mm = ms.filter(function (m) { return norm(m.name).indexOf(v) >= 0 || norm(m.agency).indexOf(v) >= 0 || norm(m.summary).indexOf(v) >= 0; });
      if (dm.length) html += '<h3>Destinations</h3>' + dm.map(destResult).join('');
      if (gm.length) html += '<h3>Glossary</h3>' + glossHtml(gm, v);
      if (mm.length) html += '<h3>Missions</h3>' + mm.slice(0, 12).map(function (m) { return '<button type="button" class="result" data-open-missions-focus="' + esc(m.id) + '">' + ic('rocket') + '<div><b>' + esc(m.name) + '</b><span>' + esc(m.agency) + ' · ' + esc(m.years) + ' · ' + esc((STATUS[m.status] || {}).label || m.status) + '</span></div></button>'; }).join('');
      if (!html) html = '<p class="empty">Nothing matched “' + esc(q.value) + '”. Try a planet name, a term like “dark matter”, or a mission such as “Voyager”.</p>';
      out.innerHTML = html;
    }
    function destResult(s) { var d = destOf(s.id); return d ? '<button type="button" class="result" data-go-dest="' + esc(s.id) + '">' + disc(s.id, 30) + '<div><b>' + esc(d.name) + '</b><span>' + esc(d.tagline) + ' · ' + esc(d.type) + '</span></div></button>' : ''; }
    function glossHtml(list, v) {
      var ls = list.slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
      return ls.map(function (g) {
        return '<div class="gloss-item"><h4>' + esc(g.term) + ' <span class="badge ' + (g.level === 'advanced' ? 'open' : 'confirmed') + '">' + (g.level === 'advanced' ? 'Advanced' : 'Beginner') + '</span></h4><p>' + esc(g.definition) + '</p>' +
          (g.dest && destOf(g.dest) ? '<p class="go"><button type="button" class="text-btn" data-go-dest="' + esc(g.dest) + '">See it at ' + esc(nameOf(g.dest)) + '</button></p>' : '') + '</div>';
      }).join('');
    }
    q.addEventListener('input', render);
    out.addEventListener('click', function (e) { var m = e.target.closest('[data-open-missions-focus]'); if (m) openMissions({ focus: m.getAttribute('data-open-missions-focus') }); });
    render();
  }

  /* ---------- Compare Worlds ---------- */
  function fmtNum(n, d) { return Number(n).toLocaleString('en-US', { maximumFractionDigits: d == null ? 1 : d }); }
  function dayLen(h) { var a = Math.abs(h); var s = a >= 48 ? fmtNum(a / 24, a > 240 ? 0 : 1) + ' Earth days' : fmtNum(a, 1) + ' hours'; return s + (h < 0 ? ' (retrograde)' : ''); }
  function yearLen(d) { return d >= 730 ? fmtNum(d / 365.25, d > 3650 ? 0 : 1) + ' Earth years' : fmtNum(d, 1) + ' Earth days'; }
  function openCompare() {
    var W = A.worlds || [];
    function opts(sel) { return W.map(function (w) { return '<option value="' + esc(w.id) + '"' + (w.id === sel ? ' selected' : '') + '>' + esc(w.name) + '</option>'; }).join(''); }
    var h = '<p class="lede">Pick any two worlds. Sizes in the picture are drawn to the same scale as each other.</p>' +
      '<div class="cmp-pick"><div class="field"><label for="cmp-a">World A</label><select id="cmp-a" class="input">' + opts('earth') + '</select></div>' +
      '<div class="field"><label for="cmp-b">World B</label><select id="cmp-b" class="input">' + opts('mars') + '</select></div></div>' +
      '<div id="cmp-out" aria-live="polite"></div>' +
      '<div class="weigh"><div class="field"><label for="cmp-kg">Your mass (kg)</label><input id="cmp-kg" class="input" type="number" min="1" max="500" value="60" inputmode="decimal"></div><p id="cmp-weigh" style="flex:1;min-width:220px"></p></div>';
    var body = openModal('Compare Worlds', h, { focus: '#cmp-a' });
    var a = body.querySelector('#cmp-a'), b = body.querySelector('#cmp-b'), kg = body.querySelector('#cmp-kg');
    function get(id) { return W.filter(function (w) { return w.id === id; })[0]; }
    function sw(w) { return { swatch: w.swatch }; }
    function render() {
      var A1 = get(a.value), B1 = get(b.value), max = Math.max(A1.diameterKm, B1.diameterKm);
      function size(w) { return Math.max(10, Math.round(w.diameterKm / max * 170)); }
      var rows = [
        ['Kind', function (w) { return w.kind + (w.parent !== 'Sun' ? ' of ' + w.parent : ''); }],
        ['Diameter', function (w) { return fmtNum(w.diameterKm, 0) + ' km<small>' + fmtNum(w.diameterKm / 12742, 2) + ' × Earth</small>'; }],
        ['Mass', function (w) { return fmtNum(w.massEarths, w.massEarths < 0.1 ? 4 : 2) + ' × Earth'; }],
        ['Surface gravity', function (w) { return fmtNum(w.gravity, 2) + ' m/s²<small>' + fmtNum(w.gravity / 9.8, 2) + ' × Earth' + (w.kind === 'planet' && w.diameterKm > 40000 ? ' (at the cloud tops)' : '') + '</small>'; }],
        ['Length of a day', function (w) { return dayLen(w.rotationHours); }],
        ['Year (orbit)', function (w) { return yearLen(w.orbitDays) + (w.parent !== 'Sun' ? '<small>around ' + esc(w.parent) + '</small>' : ''); }],
        ['Distance from the Sun', function (w) { return fmtNum(w.distanceAU, 2) + ' AU'; }],
        ['Known moons', function (w) { return w.moonsText ? esc(w.moonsText) : (w.moons == null ? '—' : String(w.moons)); }],
        ['Atmosphere', function (w) { return esc(w.atmosphere); }],
        ['Average temperature', function (w) { return w.meanTempC == null ? 'Varies widely' : fmtNum(w.meanTempC, 0) + ' °C'; }]
      ];
      var html = '<figure class="cmp-stage" style="margin:0 0 18px">' + [A1, B1].map(function (w) { return '<figure>' + disc(w.id, size(w), sw(w)) + '<figcaption>' + esc(w.name) + '</figcaption></figure>'; }).join('') + '</figure>';
      html += '<table class="cmp-table"><thead><tr><th scope="col"><span class="sr-only">Property</span></th><th scope="col">' + esc(A1.name) + '</th><th scope="col">' + esc(B1.name) + '</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + (r[1] === rows[0][1] || r[0] === 'Atmosphere' ? r[1](A1) : r[1](A1)) + '</td><td>' + r[1](B1) + '</td></tr>'; }).join('') + '</tbody></table>';
      html += '<p class="lede" style="margin-top:12px;font-size:.82rem">' + esc(A1.name) + ': ' + esc(A1.note || '') + '<br>' + esc(B1.name) + ': ' + esc(B1.note || '') + '</p>';
      body.querySelector('#cmp-out').innerHTML = html;
      var m = parseFloat(kg.value) || 0;
      body.querySelector('#cmp-weigh').innerHTML = 'Your mass stays the same everywhere, but your weight changes. Standing on the surface, you would feel as heavy as <b>' + fmtNum(m * A1.gravity / 9.8, 1) + ' kg</b> on ' + esc(A1.name) + ' and <b>' + fmtNum(m * B1.gravity / 9.8, 1) + ' kg</b> on ' + esc(B1.name) + ' (compared with ' + fmtNum(m, 1) + ' kg on Earth). For the giant planets this uses the gravity at the cloud tops, since they have no solid surface.';
    }
    a.addEventListener('change', render); b.addEventListener('change', render); kg.addEventListener('input', render);
    render();
  }

  /* ---------- Cosmic Scale ---------- */
  function fmtLen(km) {
    var m = km * 1000;
    if (m < 1) return fmtNum(m * 100, 2) + ' cm';
    if (m < 1000) return fmtNum(m, 1) + ' m';
    if (km < 1e6) return fmtNum(km, 1) + ' km';
    if (km < 1e9) return fmtNum(km / 1e6, 1) + ' thousand km'.replace('thousand ', 'million ');
    return fmtNum(km, 0) + ' km';
  }
  function openScale() {
    var rungs = (A.scale || []).slice().sort(function (a, b) { return a.km - b.km; });
    function paint(mode) {
      var h = '<div class="notice">The journey on this site compresses distances so it can be watched in minutes. This tool shows the real numbers.</div>';
      h += '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (mode === 'log') + '" data-m="log">Powers of ten</button><button type="button" role="tab" aria-selected="' + (mode === 'cm') + '" data-m="cm">If Earth were 1 cm</button></div>';
      h += '<p class="lede">' + (mode === 'log' ? 'Each bar is on a logarithmic scale: every step to the right is ten times larger.' : 'Shrink the whole Universe so that Earth is 1 cm across, about the size of a small marble, and every distance shrinks by the same factor.') + '</p>';
      var maxL = Math.log10(rungs[rungs.length - 1].km), minL = Math.log10(rungs[0].km) - 0.3;
      rungs.forEach(function (r) {
        var w = Math.max(2, (Math.log10(r.km) - minL) / (maxL - minL) * 100);
        var val = mode === 'log' ? (r.km >= 9.46e12 ? fmtNum(r.km / 9.4607e12, r.km / 9.4607e12 < 100 ? 2 : 0) + ' light-years' : fmtLen(r.km)) : cmLen(r.km / 12742 / 100);
        h += '<div class="scale-row"><div class="scale-row-top"><b>' + esc(r.label) + '</b><span class="val">' + esc(val) + (mode === 'log' && r.km < 9.46e12 ? '' : '') + '</span></div>' +
          '<div class="scale-bar" role="img" aria-label="' + esc(r.label + ': ' + val) + '"><i style="width:' + w.toFixed(1) + '%"></i></div>' +
          '<p>' + (r.lightTime ? 'Light takes ' + esc(r.lightTime) + '. ' : '') + esc(r.note) + '</p></div>';
      });
      var body = openModal('Cosmic Scale', h, { focus: '[aria-selected="true"]' });
      $$('[data-m]', body).forEach(function (b) { b.addEventListener('click', function () { paint(b.getAttribute('data-m')); }); });
    }
    function cmLen(m) { // m: metres in the shrunken model
      if (m < 1) return fmtNum(m * 100, 2) + ' cm';
      if (m < 1000) return fmtNum(m, 1) + ' m';
      return fmtNum(m / 1000, m / 1000 < 100 ? 1 : 0) + ' km';
    }
    paint('log');
  }

  /* ---------- Missions ---------- */
  function openMissions(o) {
    o = o || {};
    var all = A.missions || [], f = { status: 'all', dest: o.dest || 'all' };
    var asOf = all.map(function (m) { return m.asOf; }).sort().pop() || '';
    var dests = R.stops.filter(function (s) { return s.type === 'dest'; });
    function paint() {
      var list = all.filter(function (m) { return (f.status === 'all' || m.status === f.status) && (f.dest === 'all' || (m.targets || []).indexOf(f.dest) >= 0); });
      var h = '<div class="notice">Mission statuses were checked in ' + esc(asOf) + ' and can change. “Active” means operating at that time; “Planned” missions have dates that often move. Check the agency page linked on each card for the latest.</div>';
      h += '<div class="chips" role="group" aria-label="Filter by status" style="margin-bottom:12px">' + ['all', 'active', 'historical', 'planned'].map(function (k) { return '<button type="button" class="chip" aria-pressed="' + (f.status === k) + '" data-status="' + k + '">' + (k === 'all' ? 'All' : STATUS[k].label) + '</button>'; }).join('') + '</div>';
      h += '<div class="field" style="margin-bottom:16px;max-width:320px"><label for="m-dest">Destination</label><select id="m-dest" class="input"><option value="all">All destinations</option>' + dests.map(function (s) { return '<option value="' + s.id + '"' + (f.dest === s.id ? ' selected' : '') + '>' + esc(nameOf(s.id)) + '</option>'; }).join('') + '</select></div>';
      h += '<p class="lede" aria-live="polite">' + list.length + ' mission' + (list.length === 1 ? '' : 's') + '</p>';
      list.forEach(function (m) {
        h += '<article class="mission-card" id="m-' + esc(m.id) + '"><div class="mission-top"><h3>' + esc(m.name) + '</h3>' + badge(m.status) + '</div>' +
          '<p class="mission-meta">' + esc(m.agency) + ' · ' + esc(m.type) + ' · ' + esc(m.years) + '</p>' +
          '<p class="status-note">' + esc(m.statusNote) + ' (checked ' + esc(m.asOf) + ')</p>' +
          '<p>' + esc(m.summary) + '</p><p><b>' + (m.status === 'planned' ? 'Expected to study: ' : 'Findings: ') + '</b>' + esc(m.discoveries) + '</p>' +
          '<p><a href="' + esc(safeUrl(m.url)) + '" target="_blank" rel="noopener noreferrer">Official mission page</a>' + (m.targets && m.targets[0] && destOf(m.targets[0]) ? ' · <button type="button" class="text-btn" data-go-dest="' + esc(m.targets[0]) + '">Visit ' + esc(nameOf(m.targets[0])) + '</button>' : '') + '</p></article>';
      });
      var body = openModal('Space Missions', h, {});
      $$('[data-status]', body).forEach(function (b) { b.addEventListener('click', function () { f.status = b.getAttribute('data-status'); paint(); var n = $('modal-body').querySelector('[data-status="' + f.status + '"]'); if (n) n.focus(); }); });
      body.querySelector('#m-dest').addEventListener('change', function (e) { f.dest = e.target.value; paint(); $('m-dest').focus(); });
    }
    paint();
    if (o.focus) { var card = $('m-' + o.focus); if (card) { card.scrollIntoView({ block: 'start' }); card.style.outline = '2px solid var(--accent)'; card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true }); } }
  }

  /* ---------- Mission Log ---------- */
  function openLog() {
    var dests = R.stops.filter(function (s) { return s.type === 'dest'; }), n = dests.filter(function (s) { return visited.indexOf(s.id) >= 0; }).length;
    var h = '<p class="lede">Destinations you have visited during this session. The log is kept only in this browser tab and clears when you close it.</p>' +
      '<p><b>' + n + ' of ' + dests.length + '</b> destinations visited</p><div class="log-progress" role="img" aria-label="' + n + ' of ' + dests.length + ' visited"><i style="width:' + (n / dests.length * 100) + '%"></i></div><ul>' +
      dests.map(function (s) { var seen = visited.indexOf(s.id) >= 0; return '<li class="log-item">' + disc(s.id, 30) + '<span>' + esc(nameOf(s.id)) + '</span>' + (seen ? '<span class="badge confirmed" style="flex:none">' + ic('check') + 'Visited</span>' : '<button type="button" class="text-btn" data-go-dest="' + s.id + '">Go there</button>') + '</li>'; }).join('') + '</ul>' +
      '<p style="margin-top:16px"><button type="button" class="btn btn-ghost btn-small" id="log-clear">Clear my log</button></p>';
    var body = openModal('Mission Log', h, {});
    body.querySelector('#log-clear').addEventListener('click', function () { visited = []; U.session.set(LOG_KEY, visited); renderNavigator(); renderRailState(); openLog(); });
  }

  /* ---------- Quiz ---------- */
  function openQuiz(qid) {
    var quiz = A.quizzes && A.quizzes[qid]; if (!quiz) return;
    var i = 0, score = 0, answered = false;
    var next = nextStopAfterStage(qid);
    function paint() {
      if (i >= quiz.questions.length) {
        var h = '<p class="quiz-score">' + score + ' / ' + quiz.questions.length + '</p><p class="lede" style="margin-top:8px">' +
          (score === quiz.questions.length ? 'Perfect. You were paying attention.' : score >= 2 ? 'Well done. A little more exploring and you will have it all.' : 'Good effort. Every destination page has the answers if you want another go.') + '</p>' +
          '<p><button type="button" class="btn btn-primary btn-small" id="q-again">Try again</button> <button type="button" class="btn btn-ghost btn-small" id="q-done">' + (next ? 'Continue the journey' : 'Close') + '</button></p>';
        var b = openModal('Quiz complete', h, { focus: '#q-done' });
        b.querySelector('#q-again').addEventListener('click', function () { i = 0; score = 0; paint(); });
        b.querySelector('#q-done').addEventListener('click', function () { closeModal(); if (next && A.engine) setTimeout(function () { A.engine.next(); }, 100); });
        return;
      }
      var q = quiz.questions[i]; answered = false;
      var h2 = '<div class="quiz-meta"><span>Question ' + (i + 1) + ' of ' + quiz.questions.length + '</span><span>Score ' + score + '</span></div><p class="quiz-q" id="qq">' + esc(q.q) + '</p><div class="quiz-opts" role="group" aria-labelledby="qq">' +
        q.options.map(function (o, k) { return '<button type="button" class="quiz-opt" data-k="' + k + '"><span class="letter">' + 'ABCD'[k] + '</span><span>' + esc(o) + '</span></button>'; }).join('') + '</div><div id="q-fb" aria-live="polite"></div>';
      var body = openModal('Knowledge check: ' + quiz.title, h2, { focus: '.quiz-opt' });
      $$('.quiz-opt', body).forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (answered) return; answered = true;
          var k = +btn.getAttribute('data-k'), ok = k === q.answer; if (ok) score++;
          $$('.quiz-opt', body).forEach(function (o2, j) {
            o2.disabled = true;
            if (j === q.answer) { o2.classList.add('correct'); o2.insertAdjacentHTML('beforeend', '<span class="mark">Correct</span>'); }
            else if (j === k) { o2.classList.add('wrong'); o2.insertAdjacentHTML('beforeend', '<span class="mark">Not quite</span>'); }
          });
          body.querySelector('#q-fb').innerHTML = '<div class="quiz-explain">' + esc(q.explain) + '</div><p style="margin-top:14px"><button type="button" class="btn btn-primary btn-small" id="q-next">' + (i + 1 < quiz.questions.length ? 'Next question' : 'See my score') + '</button></p>';
          var nb = body.querySelector('#q-next'); nb.focus();
          nb.addEventListener('click', function () { i++; paint(); });
        });
      });
    }
    paint();
  }
  function nextStopAfterStage(qid) {
    var idx = -1; R.stops.forEach(function (s, k) { var st = R.stageOf(s.id); if (st && st.quizId === qid) idx = k; });
    return idx >= 0 && idx < R.finaleIndex ? R.stops[idx + 1] : null;
  }

  /* ---------- About / Sources / Accessibility ---------- */
  function openAbout() {
    var a = A.about || {};
    var h = '<div class="notice">' + esc(a.placeholderNote || '') + '</div>' +
      '<p class="lede">' + esc(a.mission || '') + '</p><p class="lede">' + esc(a.education || '') + '</p>' +
      '<h3 class="dlg-h">Research interests</h3><div class="about-grid">' + (a.researchInterests || []).map(function (r) { return '<div><h3>' + esc(r.title) + '</h3><p>' + esc(r.text) + '</p></div>'; }).join('') + '</div>' +
      '<h3 class="dlg-h">Team</h3><div class="team about-grid">' + (a.team || []).map(function (m) { return '<div><h3>' + esc(m.name) + '</h3><p><b>' + esc(m.role) + '</b></p><p>' + esc(m.bio) + '</p></div>'; }).join('') + '</div>' +
      '<h3 class="dlg-h">Contact</h3><p class="lede">' + esc((a.contact || {}).email || '') + '<br>' + esc((a.contact || {}).address || '') + '</p>' +
      '<p class="lede">' + ((a.contact || {}).social || []).map(function (s) { return '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + '</a>'; }).join(' · ') + '</p>' +
      '<h3 class="dlg-h">About this site</h3><p class="lede">' + esc(a.credits || '') + '</p>';
    openModal('About Astrovia', h, {});
  }
  function openSources() {
    var h = '<div class="notice">Distances and sizes in the 3D journey are compressed so the trip can be watched in minutes; see the Cosmic Scale tool for real numbers. Planet surfaces are procedurally generated artistic interpretations (Earth uses NASA imagery). Mission statuses are dated and can change.</div>';
    (A.sources || []).forEach(function (g) {
      h += '<section class="src-group"><h3 class="dlg-h">' + esc(g.group) + '</h3><p class="lede">' + esc(g.blurb || '') + '</p><ul class="src-list">' + g.items.map(function (it) { return '<li><a href="' + esc(safeUrl(it.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(it.title) + '</a> <span class="org" style="display:inline">· ' + esc(it.org) + '</span><span>' + esc(it.note || '') + '</span></li>'; }).join('') + '</ul></section>';
    });
    h += '<h3 class="dlg-h">References by destination</h3>';
    R.stops.filter(function (s) { return s.type === 'dest'; }).forEach(function (s) {
      var d = destOf(s.id); if (!d || !d.sources) return;
      h += '<p style="margin-top:10px"><b>' + esc(d.name) + '</b></p><ul class="refs">' + d.sources.map(function (r) { return '<li><a href="' + esc(safeUrl(r.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(r.title) + '</a><span class="org">' + esc(r.org) + '</span></li>'; }).join('') + '</ul>';
    });
    openModal('Sources and Further Reading', h, {});
  }
  function openAccessibility() {
    var h = '<p class="lede">Astrovia is built to work with a keyboard, a screen reader and reduced motion. Sound is off by default and nothing depends on it.</p>' +
      '<h3 class="dlg-h">Keyboard shortcuts</h3><table class="kbd-table"><tbody>' +
      [['<kbd>↓</kbd> <kbd>→</kbd> <kbd>Space</kbd> <kbd>Page Down</kbd>', 'Next destination'], ['<kbd>↑</kbd> <kbd>←</kbd> <kbd>Page Up</kbd>', 'Previous destination'], ['<kbd>Home</kbd> / <kbd>End</kbd>', 'First / last stop'],
       ['<kbd>+</kbd> / <kbd>−</kbd>', 'Zoom in or out'], ['<kbd>Esc</kbd>', 'Leave inspect mode, close a panel or dialog'], ['<kbd>Tab</kbd>', 'Move between buttons and feature markers']].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<h3 class="dlg-h">Settings that help</h3><ul class="facts"><li>Motion: choose Reduced to replace light-speed streaks with gentle fades. “Match my device” follows your system setting.</li><li>Text size and high contrast are in the settings menu.</li><li>Simple view turns off the 3D scene and shows every destination as an ordinary page with the same content.</li><li>Every status label (Confirmed, Hypothesis, Open question) has a symbol and a word, never colour alone.</li></ul>' +
      '<p style="margin-top:16px"><button type="button" class="btn btn-ghost btn-small" id="a-settings">Open settings</button></p>';
    var body = openModal('Accessibility and keyboard shortcuts', h, {});
    body.querySelector('#a-settings').addEventListener('click', function () { closeModal(); setTimeout(function () { togglePopover('settings-pop', innerWidth < 900 ? 'btn-menu' : 'btn-settings', '.seg button'); }, 100); });
  }

  /* ======================= Simple view / fallback gallery ======================= */
  function buildFallback() {
    if (state.fbBuilt) return; state.fbBuilt = true;
    var h = '<p class="fb-intro">This is the Simple view of Astrovia: every destination as an ordinary page, with the same facts and explanations as the 3D journey. Distances and sizes are real values here; the 3D tour compresses them.</p>';
    R.stages.forEach(function (stage) {
      var items = R.stops.filter(function (s) { return s.stage === stage.id; });
      h += '<section class="fb-stage" aria-labelledby="fbs-' + stage.id + '"><h2 id="fbs-' + stage.id + '">' + stage.number + '. ' + esc(stage.name) + '</h2><p>' + esc(stage.blurb) + '</p><div class="fb-grid">';
      items.forEach(function (s) {
        var d = destOf(s.id); if (!d) return;
        h += '<article class="fb-card" id="fb-' + s.id + '" tabindex="-1" aria-labelledby="fbt-' + s.id + '">' + disc(s.id, 84) +
          '<h3 id="fbt-' + s.id + '">' + esc(d.name) + '<small>' + esc(d.tagline) + '</small></h3><p>' + esc(d.intro) + '</p>' +
          '<ul class="facts">' + d.keyFacts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          '<dl class="measures">' + d.measurements.map(function (m) { return '<div><dt>' + esc(m.label) + '</dt><dd>' + esc(m.value) + '</dd></div>'; }).join('') + '</dl>' +
          (d.hotspots && d.hotspots.length ? '<div class="sec"><h3>Features</h3><ul class="facts">' + d.hotspots.map(function (x) { return '<li><b>' + esc(x.label) + '.</b> ' + esc(x.text) + '</li>'; }).join('') + '</ul></div>' : '') +
          '<div class="panel-actions"><button type="button" class="btn btn-primary btn-small" data-open-deeper="' + s.id + '">Explore Deeper</button></div></article>';
      });
      h += '</div></section>';
    });
    $('fallback').innerHTML = h;
    $('fallback').addEventListener('click', function (e) { var b = e.target.closest('[data-open-deeper]'); if (b) openDeeper(b.getAttribute('data-open-deeper')); });
  }
  function applySimple() {
    var simple = isSimple();
    doc.documentElement.classList.toggle('no-3d', simple && !A.engine_ok_flag ? doc.documentElement.classList.contains('no-3d') || !!S.get('lite') : doc.documentElement.classList.contains('no-3d'));
    if (simple) {
      buildFallback(); $('fallback').hidden = false;
      hidePanel(); closeFeature();
      $('hero').classList.remove('is-off'); $('hero').style.setProperty('--hero-o', '1'); $('hero').classList.add('is-live');
      $('where-stage').textContent = 'Simple view'; $('where-name').textContent = 'All destinations';
      var sl = $('set-lite'); if (sl) sl.setAttribute('aria-checked', S.get('lite') ? 'true' : 'false');
    } else {
      $('fallback').hidden = true;
      if (!S.get('lite')) doc.documentElement.classList.remove('no-3d');
      if (!A.engine || !A.engine.isReady()) { if (A.engine && !doc.documentElement.classList.contains('no-3d')) { /* engine already initialised by app.js when possible */ } }
      updateHero(state.t || 0);
    }
  }

  /* ============================== Engine events ============================== */
  function initEngineEvents() {
    bus.on('engine:progress', function (d) {
      $('loader-bar').style.width = Math.round(d.loaded / d.total * 100) + '%';
      if (d.label) $('loader-text').textContent = d.label;
    });
    bus.on('engine:ready', function () {
      $('loader-bar').style.width = '100%';
      setTimeout(function () { $('loader').classList.add('is-done'); }, 250);
      announce('Astrovia is ready. Scroll or press the down arrow to travel.');
      var s = stopAt(0); showWhere(0);
    });
    bus.on('engine:failed', function (d) {
      doc.documentElement.classList.add('no-3d');
      $('loader').classList.add('is-done');
      applySimple();
      if (d.reason !== 'lite') announce('The 3D view is not available on this device, so Astrovia is showing the Simple view with the same content.');
    });
    bus.on('journey:progress', function (d) {
      state.t = d.t;
      if (d.index !== state.index) { state.index = d.index; showWhere(d.index); renderRailState(); if (!$('navigator').hidden) renderNavigator(); }
      updateProgress(d.t); updateHero(d.t); updateHop(d);
    });
    bus.on('journey:arrive', function (d) {
      state.index = d.index; state.arrived = d.index; showWhere(d.index); renderRailState();
      var s = stopAt(d.index);
      if (s.type === 'dest') {
        markVisited(s.id); showPanel(d.index);
        var dd = destOf(s.id); announce('Arrived at ' + nameOf(s.id) + (dd ? '. ' + dd.tagline : '') + '. Information panel open.');
      } else if (s.type === 'finale') {
        $('finale').classList.add('is-on'); announce('You have explored a fraction of the universe. There is still so much left to discover.');
      } else { announce('Earth. The journey begins. Press Begin Exploration or scroll to travel.'); bus.emit('ui:panel', { open: true, width: Math.min(560, innerWidth * 0.42) }); }
      bus.emit('ui:arrived', d);
    });
    bus.on('journey:depart', function (d) {
      state.arrived = -1; hidePanel(); closeFeature();
      if (d.index === 0) bus.emit('ui:panel', { open: false });
      $('finale').classList.remove('is-on');
    });
    bus.on('hotspot:select', function (d) { showFeature(d.destId, d.hotspotId); });
    bus.on('perf:low', function () { showToast(); });
  }
  function showWhere(i) {
    var s = stopAt(i); if (!s) return;
    var st = R.stageOf(s.id);
    $('where-stage').textContent = st ? st.number + ' · ' + st.name : (s.type === 'finale' ? 'The Milky Way' : 'Start');
    $('where-name').textContent = s.type === 'intro' ? 'Earth — Departure' : nameOf(s.id);
  }
  function showToast() {
    if ($('toast') || S.get('lite')) return;
    var t = doc.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<span>Animation looks slow on this device.</span> <button type="button" class="text-btn" id="toast-yes">Switch to Simple view</button> <button type="button" class="icon-btn" id="toast-no" aria-label="Dismiss"><span class="ico">' + svg('close') + '</span></button>';
    doc.body.appendChild(t);
    $('toast-yes').addEventListener('click', function () { t.remove(); S.set('lite', true); });
    $('toast-no').addEventListener('click', function () { t.remove(); });
  }

  /* ================================== init ================================== */
  A.ui = {
    init: function () {
      hydrateIcons(doc);
      initModal(); initHud(); initPanel(); initInspect(); initFinale();
      buildRail(); renderRailState(); renderNavigator(); initHero(); initEngineEvents();
      $('navigator-list').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) { closePopovers(false); go(+b.getAttribute('data-go')); } });
      var fc = A.about && A.about.credits; $('footer-credit').textContent = (fc ? fc + ' ' : '') + 'Distances in the 3D journey are compressed. Earth imagery: NASA Visible Earth (via three-globe, MIT licence).';
      if (S.get('lite')) applySimple();
    },
    go: go, openDeeper: openDeeper, openSearch: openSearch
  };
})(window);
