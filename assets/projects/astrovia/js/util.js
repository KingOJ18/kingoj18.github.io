/* ==========================================================================
   ASTROVIA — util.js
   Shared foundation: global namespace, event bus, persistent settings and
   small helpers. Loaded FIRST (before data files, engine and UI).
   ========================================================================== */
(function (global) {
  'use strict';

  var A = (global.ASTROVIA = global.ASTROVIA || {});

  /* ---------------------------------------------------------------- Event bus
     A tiny publish/subscribe helper so the 3D engine and the interface can talk
     to each other without knowing each other's internals.
       ASTROVIA.bus.on('journey:arrive', function (data) { ... });
       ASTROVIA.bus.emit('journey:arrive', { index: 3, id: 'sun' });          */
  var listeners = {};
  A.bus = {
    on: function (name, fn) {
      (listeners[name] = listeners[name] || []).push(fn);
      return function () { A.bus.off(name, fn); };
    },
    off: function (name, fn) {
      var list = listeners[name];
      if (!list) return;
      var i = list.indexOf(fn);
      if (i >= 0) list.splice(i, 1);
    },
    emit: function (name, data) {
      var list = listeners[name];
      if (!list) return;
      list = list.slice();
      for (var i = 0; i < list.length; i++) {
        try { list[i](data); } catch (err) { console.error('[Astrovia bus] ' + name, err); }
      }
    }
  };

  /* ----------------------------------------------------------------- Settings
     Persisted in localStorage when available (falls back to memory).
     Keys and allowed values:
       motion    'auto' | 'full' | 'reduced'   ('auto' follows the operating system)
       paused    true | false                  freezes idle animation (rotation, drift)
       sound     true | false                  ambient audio, OFF by default
       level     'explore' | 'discover'        beginner / advanced content
       textSize  'normal' | 'large'
       contrast  'normal' | 'high'
       lite      true | false                  "Simple view": no 3D, plain gallery
       labels    true | false                  show feature labels on 3D objects
     Changing a value emits 'settings:change' with { key, value }.            */
  var DEFAULTS = {
    motion: 'auto', paused: false, sound: false, level: 'explore',
    textSize: 'normal', contrast: 'normal', lite: false, labels: true
  };
  var STORAGE_KEY = 'astrovia.settings.v1';
  var values = {};
  var k;
  for (k in DEFAULTS) values[k] = DEFAULTS[k];

  try {
    var raw = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      for (k in DEFAULTS) if (k in saved && typeof saved[k] === typeof DEFAULTS[k]) values[k] = saved[k];
    }
  } catch (e) { /* private mode, blocked storage: keep defaults */ }
  values.sound = false; // sound always starts OFF; the visitor must opt in each visit

  function persist() {
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch (e) { /* ignore */ }
  }

  var reducedQuery = global.matchMedia ? global.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function effectiveMotion() {
    if (values.motion === 'full') return 'full';
    if (values.motion === 'reduced') return 'reduced';
    return reducedQuery && reducedQuery.matches ? 'reduced' : 'full';
  }

  function applyToDocument() {
    var root = document.documentElement;
    root.setAttribute('data-motion', effectiveMotion());
    root.setAttribute('data-text', values.textSize);
    root.setAttribute('data-contrast', values.contrast);
    root.classList.toggle('is-paused', !!values.paused);
    root.classList.toggle('is-lite', !!values.lite);
  }

  A.settings = {
    defaults: DEFAULTS,
    get: function (key) { return values[key]; },
    set: function (key, value) {
      if (!(key in DEFAULTS) || values[key] === value) return;
      values[key] = value;
      if (key !== 'sound') persist();
      applyToDocument();
      A.bus.emit('settings:change', { key: key, value: value });
    },
    all: function () { var o = {}; for (var key in values) o[key] = values[key]; return o; },
    /** 'full' or 'reduced' after resolving the "auto" option against the OS setting. */
    effectiveMotion: effectiveMotion
  };

  if (reducedQuery) {
    var onChange = function () {
      applyToDocument();
      A.bus.emit('settings:change', { key: 'motion', value: values.motion });
    };
    if (reducedQuery.addEventListener) reducedQuery.addEventListener('change', onChange);
    else if (reducedQuery.addListener) reducedQuery.addListener(onChange);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyToDocument);
  applyToDocument();

  /* ------------------------------------------------------------------ Helpers */
  var util = (A.util = {});
  util.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  util.lerp = function (a, b, t) { return a + (b - a) * t; };
  util.smoothstep = function (a, b, x) {
    var t = util.clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  util.smootherstep = function (t) {
    t = util.clamp(t, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  };
  /** Frame-rate independent smoothing: damp(current, target, speed, dt). */
  util.damp = function (cur, target, speed, dt) {
    return cur + (target - cur) * (1 - Math.exp(-speed * dt));
  };
  util.isCoarsePointer = function () {
    return !!(global.matchMedia && global.matchMedia('(pointer: coarse)').matches);
  };
  util.isSmallScreen = function () {
    return Math.min(global.innerWidth, global.innerHeight) < 600 || global.innerWidth < 760;
  };
  util.hasWebGL = function () {
    try {
      var c = document.createElement('canvas');
      return !!(global.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  };
  /** Safe sessionStorage helpers (used for the per-visit Mission Log). */
  util.session = {
    get: function (key, fallback) {
      try { var v = global.sessionStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { global.sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };
  /** Day-of-year number, used to pick the "Cosmic Fact of the Day". */
  util.dayOfYear = function (d) {
    d = d || new Date();
    var start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  };

  // Data files append to these containers (see DEV_NOTES.md).
  A.destinations = A.destinations || {};
})(window);
