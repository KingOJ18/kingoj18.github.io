/* ==========================================================================
   ASTROVIA — engine.js
   The 3D engine: renderer, scroll-driven journey, camera, light-speed warp,
   hotspots, inspect mode and adaptive quality.

   It talks to the interface only through ASTROVIA.bus events (see DEV_NOTES.md).
   Public API: ASTROVIA.engine.init(), goTo(), next(), prev(), restart(),
   current(), setMode(), getMode(), zoomBy(), resetView(), focusHotspot(), isReady()
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  var THREE = global.THREE;
  var U = A.util, bus = A.bus, settings = A.settings;
  var PL = A.planets, SC = A.scenery;
  var DEG = Math.PI / 180;
  var E = (A.engine = {});

  var TIERS = {
    high:   { name: 'high',   dpr: 2,   stars: 9000, warp: 3000, galaxy: 64000, rocks: 1500, kuiper: 6500, dust: 90, texW: 1024, seg: 64 },
    medium: { name: 'medium', dpr: 1.5, stars: 5500, warp: 2000, galaxy: 34000, rocks: 850,  kuiper: 3800, dust: 56, texW: 768,  seg: 48 },
    low:    { name: 'low',    dpr: 1,   stars: 2800, warp: 1100, galaxy: 16000, rocks: 420,  kuiper: 2000, dust: 30, texW: 512,  seg: 32 }
  };
  var EXTRAS = { // small moons orbiting the big planets (sizes and distances are NOT to scale)
    jupiter: [{ r: 0.085, d: 2.15, s: 0.55, c: 0xe3cf7a, name: 'Io' }, { r: 0.075, d: 2.7, s: 0.4, c: 0xd9d2c4, name: 'Europa' }, { r: 0.115, d: 3.25, s: 0.3, c: 0xb4aa9a, name: 'Ganymede' }, { r: 0.105, d: 3.85, s: 0.2, c: 0x6d655c, name: 'Callisto' }],
    saturn: [{ r: 0.1, d: 3.5, s: 0.18, c: 0xd9a548, name: 'Titan' }],
    mars: [{ r: 0.07, d: 2.0, s: 0.9, c: 0x8a7f74, name: 'Phobos' }, { r: 0.05, d: 2.7, s: 0.5, c: 0x9a8f84, name: 'Deimos' }],
    neptune: [{ r: 0.08, d: 3.1, s: -0.25, c: 0xcbbfb4, name: 'Triton' }],
    uranus: [{ r: 0.06, d: 3.0, s: 0.2, c: 0xb9b3ac, name: 'Titania' }, { r: 0.055, d: 3.6, s: 0.15, c: 0xa9a39c, name: 'Oberon' }]
  };

  var st = {
    ready: false, failed: false, t: 0, tTarget: 0, prevT: 0, speed: 0, warp: 0, arrived: -1, settle: 0,
    mode: 'overview', zoom: 1, zoomT: 1, yaw: 0, yawT: 0, pitch: 0, pitchT: 0,
    shiftX: 0, shiftY: 0, shiftXT: 0, shiftYT: 0, panelOpen: false, panelW: 420,
    anim: 0, tween: null, lastScroll: 0, snapped: true, dir: 1, touching: 0, dialogs: 0,
    perStop: 700, N: 0, lastEmit: 0, lastIndex: -1, hopFrom: 0, fade: 1
  };
  var R = {}; // renderer-side objects
  var tier = TIERS.medium, dprCur = 1, frames = 0, ema = 16, slowChecks = 0, fastChecks = 0, perfWarned = false, running = false, raf = 0, lastT = 0;
  var tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpEye = new THREE.Vector3(), tmpLook = new THREE.Vector3(), prevEye = new THREE.Vector3(), warpDir = new THREE.Vector3(0, 0, -1);
  var layout, stops, route, objectsLive = {}, hotspotEls = [], hotspotData = null;
  var doc = document;

  /* ----------------------------------------------------------- quality pick */
  function pickTier() {
    var mem = navigator.deviceMemory || 8, cores = navigator.hardwareConcurrency || 8, small = U.isSmallScreen(), coarse = U.isCoarsePointer();
    if ((small && coarse) || mem <= 2 || cores <= 2) return TIERS.low;
    if (small || coarse || mem <= 4 || cores <= 4) return TIERS.medium;
    return TIERS.high;
  }

  /* ------------------------------------------------------------------- init */
  E.init = function () {
    route = A.route;
    if (!THREE || !U.hasWebGL()) return fail('no-webgl', 'WebGL is not available');
    try { setup(); } catch (err) { console.error(err); fail('error', String(err && err.message || err)); }
  };
  function fail(reason, message) {
    st.failed = true; running = false;
    doc.documentElement.classList.add('no-3d');
    bus.emit('engine:failed', { reason: reason, message: message });
  }

  function progress(loaded, total, label) { bus.emit('engine:progress', { loaded: loaded, total: total, label: label }); }

  function setup() {
    tier = pickTier();
    var canvas = doc.getElementById('scene');
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: tier.name !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false });
    renderer.setClearColor(0x02030a, 1);
    R.renderer = renderer; R.canvas = canvas;
    dprCur = Math.min(global.devicePixelRatio || 1, tier.dpr);
    renderer.setPixelRatio(dprCur);
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); fail('error', 'The graphics context was lost'); });
    progress(1, 6, 'Preparing the cosmos');

    R.scene = new THREE.Scene();
    R.camera = new THREE.PerspectiveCamera(45, 1, 0.5, 20000);
    var sun = new THREE.DirectionalLight(0xfff4e6, 1.25); sun.position.copy(PL.sunDir).multiplyScalar(100); R.scene.add(sun);
    R.scene.add(new THREE.AmbientLight(0x6a7894, 0.22));

    R.stars = SC.createStars(tier.stars); R.scene.add(R.stars);
    R.backdrop = SC.createBackdrop(tier.name === 'low' ? 512 : 1024); R.scene.add(R.backdrop);
    R.warp = SC.createWarp(tier.warp); R.scene.add(R.warp);
    progress(2, 6, 'Charting the stars');

    layout = A.layout.build(route); stops = layout.stops; st.N = stops.length;
    // which stops use which object
    layout.order.forEach(function (o) { o.stops = []; });
    stops.forEach(function (s) { layout.objects[s.obj].stops.push(s.index); });
    R.spacer = doc.getElementById('journey-spacer'); R.layer = doc.getElementById('hotspot-layer');
    if (R.layer) R.layer.addEventListener('click', onHotspotClick);
    doc.documentElement.dataset.labels = settings.get('labels') ? 'on' : '';

    resize();
    global.addEventListener('resize', resize);
    bindInput();
    bus.on('settings:change', onSettings);
    bus.on('ui:panel', function (d) { st.panelOpen = !!d.open; if (d.width) st.panelW = d.width; updateShift(); });
    bus.on('ui:dialog', function (d) { st.dialogs = Math.max(0, st.dialogs + (d.open ? 1 : -1)); });
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) stopLoop(); else startLoop(); });
    global.addEventListener('pagehide', dispose);

    // first object: the Earth, with real imagery; everything else is lazy
    progress(3, 6, 'Preparing Earth');
    var earth = ensureObject('earth'); var done = false;
    var finish = function () {
      if (done) return; done = true;
      progress(5, 6, 'Lighting the scene');
      ensureObject('moon');
      st.ready = true; syncFromScroll(true); poseAt(st.t); renderOnce();
      progress(6, 6, 'Ready');
      bus.emit('engine:ready', { quality: tier.name });
      startLoop();
    };
    if (earth.body.texturesReady) finish(); else {
      var off = bus.on('planet:ready', function (d) { if (d.id === 'earth') { off(); finish(); } });
      earth.body.ensureTextures(true);
      setTimeout(finish, 7000);
    }
  }

  /* ----------------------------------------------------------- object cache */
  function ensureObject(key) {
    if (objectsLive[key]) return objectsLive[key];
    var def = layout.objects[key], o = { key: key, def: def, group: null, body: null, scene: null, extras: [], visible: false, texturesAsked: false };
    if (def.kind === 'sphere') {
      var body = PL.create(key, { radius: def.R, quality: tier, aniso: Math.min(8, R.renderer.capabilities.getMaxAnisotropy()) });
      body.group.position.copy(def.pos); R.scene.add(body.group); o.group = body.group; o.body = body;
      (EXTRAS[key] || []).forEach(function (x, i) {
        var m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshLambertMaterial({ color: x.c }));
        m.scale.setScalar(def.R * x.r); m.userData = { x: x, a: i * 1.7 + 0.6 }; body.group.add(m); o.extras.push(m);
      });
    } else if (def.kind === 'galaxy') {
      var gal = SC.createGalaxy(tier); gal.group.position.copy(def.pos); R.scene.add(gal.group); o.group = gal.group; o.scene = gal;
    } else {
      var sc = SC.regions[key](tier); sc.group.position.copy(def.pos); R.scene.add(sc.group); o.group = sc.group; o.scene = sc;
    }
    o.group.visible = false; objectsLive[key] = o;
    return o;
  }
  function objectDistance(def, t) { var m = 99; for (var i = 0; i < def.stops.length; i++) m = Math.min(m, Math.abs(t - def.stops[i])); return m; }

  function manageObjects(dt) {
    var t = st.t;
    layout.order.forEach(function (def) {
      var d = objectDistance(def, t), o = objectsLive[def.key];
      var build = def.kind === 'galaxy' ? t > 13.2 : d < 3.4;
      if (!o && build) o = ensureObject(def.key);
      if (!o) return;
      var vis = def.kind === 'galaxy' ? t > 15.4 : d < (def.kind === 'region' ? 2.3 : 1.9);
      if (o.visible !== vis) { o.visible = vis; o.group.visible = vis; }
      var want = def.kind === 'galaxy' ? false : d < 2.6;
      if (want && !o.texturesAsked) {
        o.texturesAsked = true;
        if (o.body) o.body.ensureTextures(d < 1.2); else if (o.scene && o.scene.ensureTextures) o.scene.ensureTextures();
      }
    });
  }

  /* ------------------------------------------------------------------ resize */
  function resize() {
    var w = global.innerWidth, h = global.innerHeight;
    st.W = w; st.H = h;
    R.renderer.setPixelRatio(dprCur); R.renderer.setSize(w, h, false);
    R.camera.aspect = w / h;
    var oldT = st.t, ps = U.clamp(h * 0.9, 480, 900);
    st.perStop = ps;
    if (R.spacer) R.spacer.style.height = Math.round((st.N - 1) * ps + h) + 'px';
    if (st.ready) global.scrollTo(0, Math.round(Math.min(st.tTarget, st.N - 1) * ps));
    SC.setScale(allMats(), pxScale(), st.anim);
    R.stars.material.uniforms.uPx.value = Math.max(1, dprCur * (h / 900) * 1.15);
    R.warp.material.uniforms.uRes.value.set(w * dprCur, h * dprCur);
    R.warp.material.uniforms.uWidth.value = 1.15 * dprCur;
    updateShift();
  }
  function pxScale() { return (st.H * dprCur) / (2 * Math.tan(R.camera.fov * DEG / 2)); }
  function allMats() {
    var arr = [];
    for (var k in objectsLive) { var o = objectsLive[k]; if (o.scene && o.scene.mats) arr = arr.concat(o.scene.mats); }
    return arr;
  }
  function updateShift() {
    var wide = st.W >= 900;
    if (st.panelOpen && st.mode !== 'inspect') { st.shiftXT = wide ? st.panelW * 0.5 : 0; st.shiftYT = wide ? 0 : st.H * 0.2; }
    else { st.shiftXT = 0; st.shiftYT = 0; }
  }

  /* --------------------------------------------------------------- settings */
  function onSettings(d) {
    if (d.key === 'labels') doc.documentElement.dataset.labels = d.value ? 'on' : '';
    if (d.key === 'lite') { if (d.value) { stopLoop(); } else if (st.ready) { resize(); startLoop(); } }
  }

  /* ------------------------------------------------------- scroll & journey */
  function syncFromScroll(force) {
    var y = global.pageYOffset || doc.documentElement.scrollTop || 0;
    var tt = U.clamp(y / st.perStop, 0, st.N - 1);
    if (force) { st.t = st.tTarget = st.prevT = tt; } else st.tTarget = tt;
  }
  function onScroll() {
    if (!st.ready || settings.get('lite')) return;
    if (st.tween) { if (Math.abs((global.pageYOffset || 0) - st.tween.scrollY) > 2) cancelTween(); else return; }
    var old = st.tTarget; syncFromScroll(false);
    if (st.tTarget !== old) st.dir = st.tTarget > old ? 1 : -1;
    st.lastScroll = performance.now(); st.snapped = false;
    if (st.mode === 'inspect' && Math.abs(st.tTarget - st.arrived) > 0.15) E.setMode('overview');
  }
  function cancelTween() { if (!st.tween) return; st.tween = null; st.tTarget = st.t; st.snapped = true; }
  function snapIdle(now) {
    if (st.snapped || st.tween || st.touching || now - st.lastScroll < 150) return;
    var y = global.pageYOffset || 0;
    if (y > (st.N - 1) * st.perStop + 2) { st.snapped = true; return; }
    var t = st.tTarget, f = t - Math.floor(t), idx;
    if (st.dir > 0) idx = f > 0.14 ? Math.ceil(t) : Math.floor(t); else idx = f < 0.86 ? Math.floor(t) : Math.ceil(t);
    idx = U.clamp(idx, 0, st.N - 1);
    st.snapped = true; st.tTarget = idx; global.scrollTo(0, Math.round(idx * st.perStop));
  }

  E.goTo = function (target, opts) {
    if (!st.ready) return;
    opts = opts || {};
    var idx = typeof target === 'string' ? route.indexOf(target) : target;
    if (idx < 0 || idx > st.N - 1) return;
    idx = Math.round(idx);
    if (settings.get('lite')) return;
    var dist = Math.abs(idx - st.t);
    if (dist < 0.001) { if (st.arrived !== idx) st.settle = 1; return; }
    var reduced = settings.effectiveMotion() === 'reduced';
    var dur = reduced ? 0.8 : opts.instant ? 0.01 : U.clamp(1.7 + 0.5 * Math.pow(dist, 0.75), 1.9, 4.6);
    st.tween = { from: st.t, to: idx, start: performance.now(), dur: dur * 1000, scrollY: Math.round(idx * st.perStop), reduced: reduced, swapped: false };
    st.tTarget = idx; st.snapped = true;
    global.scrollTo(0, st.tween.scrollY);
    if (st.mode === 'inspect') E.setMode('overview');
  };
  E.next = function () { var i = Math.round(st.tTarget); if (i < st.N - 1) E.goTo(i + 1); };
  E.prev = function () { var i = Math.round(st.tTarget); if (i > 0) E.goTo(i - 1); };
  E.restart = function () { E.goTo(0); global.scrollTo({ top: 0 }); };
  E.current = function () { var i = Math.round(st.t); return { index: i, id: stops[i] && stops[i].id, t: st.t }; };
  E.isReady = function () { return st.ready; };
  Object.defineProperty(E, 'stopCount', { get: function () { return st.N; } });

  function updateJourney(dt, now) {
    var tw = st.tween;
    if (tw) {
      var p = U.clamp((now - tw.start) / tw.dur, 0, 1);
      if (tw.reduced) {
        if (p < 0.5) { st.fade = 1 - p * 2; } else { if (!tw.swapped) { tw.swapped = true; st.t = tw.to; st.prevT = tw.to; } st.fade = (p - 0.5) * 2; }
        if (p >= 1) { st.tween = null; st.fade = 1; st.t = tw.to; }
      } else {
        var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        st.t = tw.from + (tw.to - tw.from) * e;
        if (p >= 1) { st.tween = null; st.t = tw.to; }
      }
    } else {
      var diff = st.tTarget - st.t, red = settings.effectiveMotion() === 'reduced';
      var k = 1 - Math.exp(-(red ? 3.2 : 5.5) * dt), step = diff * k, vmax = (red ? 1.6 : 3.4) * dt;
      step = U.clamp(step, -vmax, vmax);
      st.t += step; if (Math.abs(st.tTarget - st.t) < 0.0004) st.t = st.tTarget;
      st.fade = red ? 1 - 0.55 * U.smoothstep(0.1, 1.0, st.speed) : 1;
    }
    var spd = Math.abs(st.t - st.prevT) / Math.max(dt, 1e-4);
    st.speed = U.damp(st.speed, spd, 14, dt);
    st.prevT = st.t;
    var wt = settings.effectiveMotion() === 'reduced' ? 0 : U.smoothstep(0.05, 0.8, st.speed);
    st.warp = U.damp(st.warp, wt, 9, dt);
    if (st.warp < 0.003) st.warp = 0;

    // arrival / departure
    var near = Math.round(st.t), settled = !st.tween && Math.abs(st.tTarget - st.t) < 0.0035 && Math.abs(st.t - near) < 0.0035;
    if (settled) {
      st.settle += dt;
      if (st.settle > 0.28 && st.arrived !== near) arrive(near);
    } else st.settle = 0;
    if (st.arrived >= 0 && Math.abs(st.t - st.arrived) > 0.04) depart();
  }

  function arrive(i) {
    st.arrived = i; var s = stops[i];
    var o = objectsLive[s.obj]; if (o && o.scene && o.scene.setFocus) o.scene.setFocus(s.id);
    st.zoomT = st.zoom = 1; st.yawT = st.yaw = 0; st.pitchT = st.pitch = 0;
    buildHotspots(s);
    bus.emit('journey:arrive', { index: i, id: s.id });
  }
  function depart() {
    var i = st.arrived; st.arrived = -1;
    if (st.mode === 'inspect') E.setMode('overview', true);
    clearHotspots(); releaseBody();
    if (i >= 0) bus.emit('journey:depart', { index: i, id: stops[i].id });
    st.zoomT = 1;
  }

  /* ------------------------------------------------------------------ camera */
  function poseAt(t) {
    var N = st.N, i0 = Math.min(Math.floor(t), N - 2), f = U.clamp(t - i0, 0, 1);
    if (i0 < 0) i0 = 0;
    var e = U.smootherstep(f), a = stops[i0], b = stops[Math.min(i0 + 1, N - 1)];
    tmpEye.lerpVectors(a.eye, b.eye, e); tmpLook.lerpVectors(a.look, b.look, e);
    // slight arc so the path feels like flying, not sliding
    var arc = Math.sin(e * Math.PI) * 0.06 * a.eye.distanceTo(b.eye); if (arc > 60) arc = 60;
    tmpEye.y += arc;
    var cur = stops[Math.round(t)], zl = cur ? cur.zoom : [0.5, 1.3];
    st.zoomMin = zl[0]; st.zoomMax = zl[1];
    st.curStop = cur;
    // zoom + user orbit applied to the offset from the look point
    tmpV.copy(tmpEye).sub(tmpLook);
    var near = Math.abs(t - Math.round(t));
    var infl = 1 - U.smoothstep(0.0, 0.18, near);          // user view only applies near a stop
    var zoom = U.lerp(1, st.zoom, infl);
    if (cur && cur.kind !== 'sphere' && infl > 0) {
      var yaw = st.yaw * infl, pitch = st.pitch * infl, c = Math.cos(yaw), s = Math.sin(yaw), x = tmpV.x * c + tmpV.z * s, z = -tmpV.x * s + tmpV.z * c;
      tmpV.x = x; tmpV.z = z;
      var len = tmpV.length(), horiz = Math.sqrt(tmpV.x * tmpV.x + tmpV.z * tmpV.z), ang = Math.atan2(tmpV.y, horiz) + pitch;
      ang = U.clamp(ang, -1.2, 1.35); var nh = Math.cos(ang) * len, k = horiz > 1e-6 ? nh / horiz : 0;
      tmpV.set(tmpV.x * k, Math.sin(ang) * len, tmpV.z * k);
    }
    tmpV.multiplyScalar(zoom);
    var distScale = R.camera.aspect < 1 ? Math.pow(1 / Math.max(0.42, R.camera.aspect), 0.85) : 1;
    if (cur && cur.kind !== 'galaxy' || !cur) tmpV.multiplyScalar(Math.min(distScale, 1.9));
    else tmpV.multiplyScalar(Math.min(distScale, 1.45));
    tmpEye.copy(tmpLook).add(tmpV);
    R.camera.position.copy(tmpEye); R.camera.lookAt(tmpLook);
  }

  /* ----------------------------------------------------------------- hotspots */
  function clearHotspots() {
    hotspotEls.forEach(function (h) { if (h.el.parentNode) h.el.parentNode.removeChild(h.el); });
    hotspotEls = []; hotspotData = null;
    if (R.layer) R.layer.classList.remove('is-active');
  }
  function buildHotspots(s) {
    clearHotspots();
    if (s.type !== 'dest' || !R.layer) return;
    var d = A.destinations[s.id]; if (!d || !d.hotspots) return;
    var o = objectsLive[s.obj]; hotspotData = { stop: s, obj: o, dest: d };
    d.hotspots.forEach(function (h) {
      var okSphere = o.body && typeof h.lat === 'number', okRegion = o.scene && o.scene.anchors && o.scene.anchors[h.id];
      if (!okSphere && !okRegion) return;
      var el = doc.createElement('button'); el.type = 'button'; el.className = 'hotspot is-hidden'; el.setAttribute('data-id', h.id);
      el.setAttribute('aria-label', h.label + ' — show details');
      el.innerHTML = '<span class="hotspot-dot" aria-hidden="true"></span><span class="hotspot-label"></span>';
      el.lastChild.textContent = h.label;
      R.layer.appendChild(el); hotspotEls.push({ el: el, h: h, vis: false });
    });
    R.layer.classList.add('is-active');
  }
  function hotspotWorld(hs, out) {
    var o = hotspotData.obj;
    if (o.body) { o.body.surfacePoint(hs.h.lat, hs.h.lon, out, 1.01); return o.body.surfaceNormal(hs.h.lat, hs.h.lon, tmpV2); }
    out.copy(o.scene.anchors[hs.h.id]); o.group.localToWorld(out); return null;
  }
  var hsPos = new THREE.Vector3();
  function updateHotspots() {
    if (!hotspotData || !R.layer) return;
    var show = st.arrived >= 0 && !st.tween && st.warp < 0.05;
    R.layer.classList.toggle('is-travelling', !show);
    if (!show) return;
    var W = st.W, H = st.H, cam = R.camera.position;
    for (var i = 0; i < hotspotEls.length; i++) {
      var hs = hotspotEls[i], n = hotspotWorld(hs, hsPos), visible = true;
      if (n) { tmpV.copy(cam).sub(hsPos).normalize(); visible = n.dot(tmpV) > 0.14; }
      var p = hsPos.clone().project(R.camera);
      if (p.z > 1 || p.z < -1) visible = false;
      var x = (p.x * 0.5 + 0.5) * W, y = (-p.y * 0.5 + 0.5) * H;
      if (x < 8 || x > W - 8 || y < 70 || y > H - 8) visible = false;
      if (visible !== hs.vis) { hs.vis = visible; hs.el.classList.toggle('is-hidden', !visible); if (!visible) hs.el.setAttribute('tabindex', '-1'); else hs.el.removeAttribute('tabindex'); }
      if (visible) hs.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    }
  }
  function onHotspotClick(e) {
    var b = e.target.closest ? e.target.closest('.hotspot') : null; if (!b) return;
    E.focusHotspot(b.getAttribute('data-id'), true);
  }
  E.focusHotspot = function (id, fromClick) {
    if (!hotspotData) return;
    var hs = null; hotspotEls.forEach(function (x) { if (x.h.id === id) hs = x; });
    var h = hs ? hs.h : null; if (!h) { var dd = hotspotData.dest.hotspots; for (var i = 0; i < dd.length; i++) if (dd[i].id === id) h = dd[i]; }
    if (!h) return;
    hotspotEls.forEach(function (x) { x.el.classList.toggle('is-active', x.h.id === id); });
    var o = hotspotData.obj;
    if (o.body && typeof h.lat === 'number') faceSurface(o.body, h.lat, h.lon);
    else if (o.scene && o.scene.anchors[id]) {
      var a = o.scene.anchors[id], psi = Math.atan2(a.x, a.z), cam = hotspotData.stop.eye.clone().sub(hotspotData.stop.look), phi = Math.atan2(cam.x, cam.z);
      var dy = psi - phi; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); st.yawT = U.clamp(dy * 0.55, -1.3, 1.3);
      st.pitchT = U.clamp(-a.y / 220, -0.3, 0.3);
    }
    bus.emit('hotspot:select', { destId: hotspotData.stop.id, hotspotId: id });
  };
  function faceSurface(body, lat, lon) {
    var cam = R.camera.position, bw = body.group.getWorldPosition(new THREE.Vector3()), c = cam.clone().sub(bw).normalize(), best = 0, bestDot = -2, keep = body.spin.rotation.y;
    var d = body.dir(lat, lon), n = new THREE.Vector3();
    for (var k = 0; k < 72; k++) {
      var a = k / 72 * Math.PI * 2; body.spin.rotation.y = a; body.group.updateMatrixWorld(true);
      n.copy(d).transformDirection(body.mesh.matrixWorld); var dot = n.dot(c); if (dot > bestDot) { bestDot = dot; best = a; }
    }
    body.spin.rotation.y = keep; body.group.updateMatrixWorld(true);
    body.rotTarget = best; body.spinHold = true;
    body.pitchTarget = U.clamp(lat * DEG * 0.35, -0.5, 0.5);
  }
  function releaseBody() {
    var o = hotspotData && hotspotData.obj; var cur = st.curStop && objectsLive[st.curStop.obj];
    [o, cur].forEach(function (x) { if (x && x.body) { x.body.spinHold = false; x.body.rotTarget = null; x.body.pitchTarget = 0; } });
  }

  /* -------------------------------------------------------- inspect & zoom */
  E.setMode = function (mode, silent) {
    if (mode === st.mode) return;
    if (mode === 'inspect') {
      var s = stops[st.arrived]; if (!s || s.type !== 'dest') return;
      st.mode = 'inspect'; st.zoomT = s.inspect; doc.body.classList.add('mode-inspect');
    } else {
      st.mode = 'overview'; st.zoomT = 1; st.yawT = 0; st.pitchT = 0; doc.body.classList.remove('mode-inspect');
      var o = st.curStop && objectsLive[st.curStop.obj]; if (o && o.body) { o.body.spinHold = false; o.body.rotTarget = null; o.body.pitchTarget = 0; }
    }
    updateShift();
    if (!silent || mode === 'overview') bus.emit('journey:mode', { mode: st.mode });
  };
  E.getMode = function () { return st.mode; };
  E.zoomBy = function (dir) {
    if (st.arrived < 0) return;
    st.zoomT = U.clamp(st.zoomT * (dir > 0 ? 0.78 : 1.28), st.zoomMin || 0.4, st.zoomMax || 1.3);
  };
  E.resetView = function () {
    st.zoomT = st.mode === 'inspect' && stops[st.arrived] ? stops[st.arrived].inspect : 1; st.yawT = 0; st.pitchT = 0;
    var o = st.curStop && objectsLive[st.curStop.obj];
    if (o && o.body) { o.body.spinHold = false; o.body.rotTarget = null; o.body.pitchTarget = 0; }
    hotspotEls.forEach(function (x) { x.el.classList.remove('is-active'); });
  };

  /* --------------------------------------------------------------------- input */
  function bindInput() {
    var canvas = R.canvas, pointers = {}, count = 0, pinch0 = 0, zoom0 = 1, moved = 0, lastTap = 0;
    function curBody() { var o = st.curStop && objectsLive[st.curStop.obj]; return o && o.body; }
    canvas.addEventListener('pointerdown', function (e) {
      if (st.arrived < 0 || e.pointerType === 'mouse' && e.button !== 0) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY }; count++; moved = 0; st.touching = count;
      try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      if (count === 2) { var ps = Object.keys(pointers).map(function (k) { return pointers[k]; }); pinch0 = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y); zoom0 = st.zoomT; }
      var now = performance.now(); if (e.pointerType !== 'mouse' && now - lastTap < 300 && count === 1) E.setMode(st.mode === 'inspect' ? 'overview' : 'inspect'); lastTap = now;
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = pointers[e.pointerId]; if (!p) return;
      var dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      if (count >= 2) {
        var ps = Object.keys(pointers).map(function (k) { return pointers[k]; });
        if (ps.length >= 2 && pinch0 > 0) { var d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y); st.zoomT = U.clamp(zoom0 * pinch0 / Math.max(10, d), st.zoomMin || 0.4, st.zoomMax || 1.3); }
        return;
      }
      if (st.arrived < 0) return;
      var b = curBody();
      if (b) { b.spinHold = true; b.rotY += dx * 0.0072; b.rotTarget = null; b.pitchTarget = U.clamp((b.pitchTarget || 0) + dy * 0.004, -0.9, 0.9); b.holdUntil = performance.now() + 2500; }
      else { st.yawT -= dx * 0.0055; st.pitchT = U.clamp(st.pitchT + dy * 0.0045, -0.9, 0.9); }
    });
    function up(e) {
      if (!pointers[e.pointerId]) return; delete pointers[e.pointerId]; count = Math.max(0, count - 1); st.touching = count; pinch0 = 0;
    }
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('lostpointercapture', up);
    canvas.addEventListener('dblclick', function () { if (st.arrived >= 0) E.setMode(st.mode === 'inspect' ? 'overview' : 'inspect'); });
    canvas.addEventListener('wheel', function (e) {
      if (st.mode === 'inspect') { e.preventDefault(); E.zoomBy(e.deltaY < 0 ? 1 : -1); }
      else if (st.tween) cancelTween();
      st.lastScroll = performance.now();
    }, { passive: false });
    global.addEventListener('scroll', onScroll, { passive: true });
    global.addEventListener('touchstart', function () { if (st.tween) cancelTween(); }, { passive: true });
    doc.addEventListener('keydown', function (e) {
      if (!st.ready || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') { if (st.mode === 'inspect' && st.dialogs === 0) { E.setMode('overview'); e.preventDefault(); } return; }
      if (st.dialogs > 0 || settings.get('lite')) return;
      var tg = e.target, tag = tg && tg.tagName; if (tag && /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(tag) || tg && tg.isContentEditable) return;
      if (tg && tg.closest && tg.closest('[role="dialog"],dialog,[role="listbox"],[role="tablist"]')) return;
      var k = e.key, used = true;
      if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) E.next();
      else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && e.shiftKey)) E.prev();
      else if (k === 'Home') E.goTo(0); else if (k === 'End') E.goTo(st.N - 1);
      else if (k === '+' || k === '=') E.zoomBy(1); else if (k === '-' || k === '_') E.zoomBy(-1);
      else used = false;
      if (used) e.preventDefault();
    });
  }

  /* --------------------------------------------------------------------- loop */
  function startLoop() { if (running || !st.ready || st.failed || settings.get('lite') || doc.hidden) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(frame); }
  function stopLoop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  E.pause = stopLoop; E.resume = startLoop;

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, Math.max(0.0005, (now - lastT) / 1000)); lastT = now;
    perf(dt);
    snapIdle(now);
    updateJourney(dt, now);
    var paused = settings.get('paused'), adt = paused ? 0 : dt;
    st.anim += adt;
    // smooth user view + zoom
    st.zoom = U.damp(st.zoom, st.zoomT, 7, dt); st.yaw = U.damp(st.yaw, st.yawT, 8, dt); st.pitch = U.damp(st.pitch, st.pitchT, 8, dt);
    st.shiftX = U.damp(st.shiftX, st.shiftXT, 5, dt); st.shiftY = U.damp(st.shiftY, st.shiftYT, 5, dt);
    poseAt(st.t);
    // fov kick while travelling
    var fov = 45 + 9 * st.warp; if (Math.abs(R.camera.fov - fov) > 0.01) { R.camera.fov = fov; }
    R.camera.aspect = st.W / st.H;
    if (Math.abs(st.shiftX) > 0.5 || Math.abs(st.shiftY) > 0.5) R.camera.setViewOffset(st.W, st.H, -st.shiftX, st.shiftY, st.W, st.H); else R.camera.clearViewOffset();
    R.camera.updateProjectionMatrix(); R.camera.updateMatrixWorld();
    manageObjects(dt);
    updateObjects(adt, dt);
    // background follows the camera
    R.stars.position.copy(R.camera.position); R.backdrop.position.copy(R.camera.position);
    var inGal = U.smoothstep(15.5, 17, st.t);
    R.backdrop.material.uniforms.uOpacity.value = 0.45 - 0.25 * inGal;
    R.stars.material.uniforms.uTime.value = st.anim; R.stars.material.uniforms.uTwinkle.value = settings.effectiveMotion() === 'reduced' ? 0 : 1;
    // warp streaks
    var w = R.warp, show = st.warp > 0.015;
    w.visible = show;
    if (show) {
      var eye = R.camera.position; tmpV.copy(eye).sub(prevEye);
      if (tmpV.lengthSq() > 1e-8) { tmpV.normalize(); warpDir.lerp(tmpV, 0.2).normalize(); }
      var wu = w.material.uniforms; wu.uCam.value.copy(eye); wu.uDir.value.copy(warpDir); wu.uWarp.value = st.warp; wu.uLen.value = 7 + 85 * st.warp * st.warp;
    }
    prevEye.copy(R.camera.position);
    SC.setScale(allMats(), pxScale(), st.anim);
    R.canvas.style.opacity = st.fade < 0.999 ? String(Math.max(0.05, st.fade)) : '';
    R.renderer.render(R.scene, R.camera);
    updateHotspots();
    emitProgress(now);
  }
  function renderOnce() { poseAt(st.t); R.camera.updateProjectionMatrix(); R.camera.updateMatrixWorld(); manageObjects(0); R.renderer.render(R.scene, R.camera); }

  function updateObjects(adt, dt) {
    for (var k in objectsLive) {
      var o = objectsLive[k]; if (!o.visible) continue;
      if (o.body) {
        var b = o.body;
        if (b.spinHold && b.holdUntil && performance.now() > b.holdUntil && b.rotTarget == null && !b.focusHold && (!hotspotData || !hotspotEls.some(function (x) { return x.el.classList.contains('is-active'); }))) { b.spinHold = false; b.holdUntil = 0; }
        if (b.rotTarget != null) { var d = b.rotTarget - b.rotY; d = Math.atan2(Math.sin(d), Math.cos(d)); b.rotY += d * (1 - Math.exp(-5 * dt)); if (Math.abs(d) < 0.002) { b.rotY = b.rotTarget; } }
        var pt = b.pitchTarget || 0; b.view.rotation.x = U.damp(b.view.rotation.x, pt, 6, dt);
        b.update(adt, st.anim);
        o.extras.forEach(function (m) { var x = m.userData.x; m.userData.a += x.s * adt * 0.5; var a = m.userData.a, r = b.radius * x.d; m.position.set(Math.cos(a) * r, Math.sin(a * 0.7) * r * 0.06, Math.sin(a) * r * 0.9); });
      } else if (o.scene) o.scene.update(adt, st.anim);
    }
  }

  function emitProgress(now) {
    var idx = Math.round(st.t), moving = st.warp > 0.01 || Math.abs(st.tTarget - st.t) > 0.002;
    var i0 = Math.min(Math.floor(st.t), st.N - 2), f = U.clamp(st.t - i0, 0, 1);
    if (idx !== st.lastIndex || now - st.lastEmit > 50) {
      st.lastIndex = idx; st.lastEmit = now;
      bus.emit('journey:progress', { t: st.t, index: idx, fromIndex: i0, toIndex: i0 + 1, f: f, warp: st.warp, moving: moving });
    }
  }

  /* -------------------------------------------------------------- performance */
  function perf(dt) {
    ema = ema * 0.94 + dt * 1000 * 0.06; frames++;
    if (frames % 50 !== 0) return;
    if (ema > 27 && dprCur > 0.62) { slowChecks++; fastChecks = 0; if (slowChecks >= 2) { slowChecks = 0; dprCur = Math.max(0.6, dprCur - 0.2); R.renderer.setPixelRatio(dprCur); resize(); } }
    else if (ema < 15 && dprCur < Math.min(global.devicePixelRatio || 1, tier.dpr)) { fastChecks++; slowChecks = 0; if (fastChecks >= 6) { fastChecks = 0; dprCur = Math.min(Math.min(global.devicePixelRatio || 1, tier.dpr), dprCur + 0.1); R.renderer.setPixelRatio(dprCur); resize(); } }
    else { slowChecks = 0; }
    if (ema > 45 && dprCur <= 0.62 && !perfWarned && frames > 200) { perfWarned = true; bus.emit('perf:low', {}); }
    if (ema > 36 && R.warp.setCount) R.warp.setCount(Math.round(tier.warp * 0.5)); else if (R.warp.setCount) R.warp.setCount(tier.warp);
  }

  function dispose() {
    stopLoop();
    for (var k in objectsLive) { var o = objectsLive[k]; if (o.body) o.body.dispose(); if (o.scene && o.scene.dispose) o.scene.dispose(); }
    if (R.renderer) R.renderer.dispose();
  }
  E.dispose = dispose;
  E._state = st; // exposed for debugging and tests
})(window);
