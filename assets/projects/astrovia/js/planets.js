/* ==========================================================================
   ASTROVIA — planets.js
   Builds the spherical bodies: Earth (real NASA imagery), and scientifically
   inspired procedural surfaces for everything else (real feature positions
   for lunar maria, Valles Marineris, Olympus Mons, the Great Red Spot, ...).

   Textures are generated lazily, in small time slices, so the page never
   freezes. Each body is a group:  group > view > tilt > spin > mesh.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  var THREE = global.THREE;
  var DEG = Math.PI / 180;
  var P = (A.planets = {});

  /* ------------------------------------------------------------------ noise */
  function h3(ix, iy, iz, seed) {
    var h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 1274126177) ^ Math.imul(seed | 0, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }
  function vnoise(x, y, z, s) {
    var ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    var fx = x - ix, fy = y - iy, fz = z - iz;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
    var a = h3(ix, iy, iz, s), b = h3(ix + 1, iy, iz, s), c = h3(ix, iy + 1, iz, s), d = h3(ix + 1, iy + 1, iz, s);
    var e = h3(ix, iy, iz + 1, s), f = h3(ix + 1, iy, iz + 1, s), g = h3(ix, iy + 1, iz + 1, s), h = h3(ix + 1, iy + 1, iz + 1, s);
    var x1 = a + (b - a) * fx, x2 = c + (d - c) * fx, x3 = e + (f - e) * fx, x4 = g + (h - g) * fx;
    var y1 = x1 + (x2 - x1) * fy, y2 = x3 + (x4 - x3) * fy;
    return y1 + (y2 - y1) * fz;
  }
  function fbm(x, y, z, oct, s) {
    var sum = 0, amp = 0.5, tot = 0;
    for (var i = 0; i < oct; i++) {
      sum += amp * vnoise(x, y, z, s + i * 31);
      tot += amp; x *= 2.03; y *= 2.03; z *= 2.03; amp *= 0.5;
    }
    return sum / tot;
  }
  function rng(seed) { // small deterministic PRNG
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function dirOf(latDeg, lonDeg, out) {
    var la = latDeg * DEG, lo = lonDeg * DEG;
    out[0] = Math.cos(la) * Math.cos(lo); out[1] = Math.sin(la); out[2] = -Math.cos(la) * Math.sin(lo);
    return out;
  }
  /** Angular distance (radians) between two lat/lon points in degrees. */
  function angDist(lat1, lon1, lat2, lon2) {
    var a = lat1 * DEG, b = lat2 * DEG, d = (lon1 - lon2) * DEG;
    var c = Math.sin(a) * Math.sin(b) + Math.cos(a) * Math.cos(b) * Math.cos(d);
    return Math.acos(Math.min(1, Math.max(-1, c)));
  }

  /* ------------------------------------------------------- sliced generator */
  var queue = [], running = false;
  function pump() {
    if (running) return;
    running = true;
    (function tick() {
      var job = queue[0];
      if (!job) { running = false; return; }
      var t0 = performance.now();
      while (performance.now() - t0 < 9 && job.step < job.steps.length) {
        var st = job.steps[job.step];
        var end = Math.min(st.rows, job.row + st.chunk);
        st.fn(job.row, end);
        job.row = end;
        if (job.row >= st.rows) { job.step++; job.row = 0; }
      }
      if (job.step >= job.steps.length) { queue.shift(); job.done(); }
      setTimeout(tick, 0);
    })();
  }
  function enqueue(job, priority) { if (priority) queue.unshift(job); else queue.push(job); pump(); }

  function canvasOf(W, H) { var c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
  function texOf(canvas, aniso) {
    var t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = aniso || 4;
    return t;
  }

  /* --------------------------------------------------------- body recipes
     Each recipe: function(W, H, ctx) -> { steps: [...], result() }.
     Shared helpers below produce height + colour arrays. */
  function makeGrid(W, H) {
    var n = W * H;
    var g = { W: W, H: H, h: new Float32Array(n), m: new Float32Array(n), col: new Uint8ClampedArray(n * 4), bump: new Uint8ClampedArray(n * 4) };
    g.sin = new Float32Array(W); g.cos = new Float32Array(W);
    for (var x = 0; x < W; x++) { var lon = ((x + 0.5) / W) * 2 * Math.PI - Math.PI; g.sin[x] = Math.sin(lon); g.cos[x] = Math.cos(lon); }
    return g;
  }
  function rowLat(y, H) { return 90 - ((y + 0.5) / H) * 180; }
  function stampCraters(g, list) {
    // list: [{lat, lon, r (degrees), depth, rim}]
    var W = g.W, H = g.H, h = g.h;
    for (var i = 0; i < list.length; i++) {
      var c = list[i], rr = c.r * DEG;
      var yMin = Math.max(0, Math.floor((90 - (c.lat + c.r * 1.5)) / 180 * H)), yMax = Math.min(H - 1, Math.ceil((90 - (c.lat - c.r * 1.5)) / 180 * H));
      var cosLat = Math.max(0.05, Math.cos(c.lat * DEG));
      var dx = Math.min(W / 2, Math.ceil((c.r * 1.6 / cosLat) / 360 * W));
      var xc = Math.floor(((c.lon + 180) / 360) * W);
      for (var y = yMin; y <= yMax; y++) {
        var lat = rowLat(y, H);
        for (var xx = xc - dx; xx <= xc + dx; xx++) {
          var x = (xx + W) % W;
          var lon = ((x + 0.5) / W) * 360 - 180;
          var d = angDist(lat, lon, c.lat, c.lon) / rr;
          if (d > 1.5) continue;
          var idx = y * W + x, v = 0;
          if (d < 1) v = -c.depth * (1 - d * d) + c.rim * 0.35 * smooth(0.55, 1, d) * (d * d);
          var rim = Math.exp(-Math.pow((d - 1) / 0.16, 2)) * c.rim;
          // central peak for big craters
          if (c.peak && d < 0.18) v += c.peak * (1 - d / 0.18);
          h[idx] += v + rim;
        }
      }
    }
  }
  function randomCraters(seed, count, rMin, rMax, depth, latLimit) {
    var r = rng(seed), out = [];
    for (var i = 0; i < count; i++) {
      var u = r(), rad = rMin * Math.pow(rMax / rMin, Math.pow(u, 2.4)); // many small, few big
      var lat = Math.asin(r() * 2 - 1) / DEG; if (latLimit) lat = Math.max(-latLimit, Math.min(latLimit, lat));
      out.push({ lat: lat, lon: r() * 360 - 180, r: rad, depth: depth * (0.5 + 0.8 * r()) * Math.min(1, 0.35 + rad / 3), rim: depth * 0.45 * (0.6 + 0.6 * r()), peak: rad > 2.5 ? depth * 0.25 : 0 });
    }
    return out;
  }
  function finishBump(g) {
    var n = g.W * g.H, h = g.h, b = g.bump, lo = 1e9, hi = -1e9, i;
    for (i = 0; i < n; i++) { if (h[i] < lo) lo = h[i]; if (h[i] > hi) hi = h[i]; }
    var s = 255 / Math.max(1e-6, hi - lo);
    for (i = 0; i < n; i++) { var v = (h[i] - lo) * s; b[i * 4] = b[i * 4 + 1] = b[i * 4 + 2] = v; b[i * 4 + 3] = 255; }
  }
  function ellipseMask(lat, lon, la0, lo0, rLat, rLon, edgeNoise) {
    var dl = (lon - lo0); if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
    var cl = Math.max(0.2, Math.cos(lat * DEG));
    var d = Math.sqrt(Math.pow((lat - la0) / rLat, 2) + Math.pow(dl * cl / rLon, 2));
    return d + (edgeNoise || 0);
  }

  /* ---- MOON ---- */
  var MARIA = [ // [lat, lon, radiusLat°, radiusLon°]  (selenographic, east positive)
    [32.8, -15.6, 17, 19], [28, 17.5, 10, 11], [8.5, 31.4, 11, 13], [17, 59, 6.5, 7.5], [-7.8, 51.3, 8, 10], [-15.2, 35.5, 5.5, 5.5],
    [-21.3, -16.6, 10, 11], [-24.4, -38.6, 6, 6.5], [18.4, -57.4, 24, 28], [58, 1, 4.5, 26], [13.3, 3.6, 4, 4.5], [-10, -23, 4.5, 4.5],
    [-19, -93, 6, 7], [27, 148, 3.5, 4], [-20, 129, 3, 3.5], [40, -10, 4, 6], [3, 20, 3, 5]
  ];
  function recipeMoon(g, o) {
    var W = g.W, H = g.H, mo = o.mercury ? [] : MARIA;
    var steps = [];
    steps.push({ rows: H, chunk: 16, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG);
        for (var x = 0; x < W; x++) {
          var X = cl * g.cos[x], Y = sl, Z = -cl * g.sin[x], lon = Math.atan2(-Z, X) / DEG;
          var i = y * W + x;
          var f = fbm(X * 3, Y * 3, Z * 3, 4, 7), f2 = fbm(X * 11, Y * 11, Z * 11, 4, 19);
          g.h[i] = (f - 0.5) * 0.55 + (f2 - 0.5) * 0.25;
          var m = 0;
          for (var k = 0; k < mo.length; k++) {
            var d = ellipseMask(lat, lon, mo[k][0], mo[k][1], mo[k][2], mo[k][3], (f2 - 0.5) * 0.5);
            var v = 1 - smooth(0.7, 1.0, d); if (v > m) m = v;
          }
          if (o.mercury) { var dc = ellipseMask(lat, lon, 31, -170, 17, 18, (f2 - 0.5) * 0.4); m = 1 - smooth(0.65, 1.0, dc); }
          g.m[i] = m;
          if (m > 0.05 && !o.mercury) g.h[i] -= 0.22 * m;   // maria sit lower
          if (m > 0.05 && o.mercury) g.h[i] -= 0.10 * m;
        }
      }
    } });
    steps.push({ rows: 1, chunk: 1, fn: function () {
      var list = randomCraters(o.mercury ? 11 : 5, o.mercury ? Math.round(W * 0.9) : Math.round(W * 0.75), o.mercury ? 0.5 : 0.45, o.mercury ? 9 : 7, o.mercury ? 0.07 : 0.06);
      // named craters
      list.push({ lat: -43.3, lon: -11.4, r: 1.5, depth: 0.1, rim: 0.12 });
      list.push({ lat: 9.6, lon: -20.1, r: 1.7, depth: 0.1, rim: 0.1, peak: 0.03 });
      list.push({ lat: 23.7, lon: -47.4, r: 1.0, depth: 0.08, rim: 0.1 });
      if (o.mercury) list.push({ lat: 31, lon: -170, r: 17, depth: 0.12, rim: 0.12 });
      stampCraters(g, list);
    } });
    steps.push({ rows: H, chunk: 24, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H);
        for (var x = 0; x < W; x++) {
          var i = y * W + x, lon = ((x + 0.5) / W) * 360 - 180;
          var hh = g.h[i], m = g.m[i];
          var b = o.mercury ? [0.50, 0.47, 0.44] : [0.64, 0.63, 0.60];
          var dk = o.mercury ? [0.42, 0.38, 0.34] : [0.27, 0.27, 0.30];
          if (o.mercury) { dk = [0.62, 0.55, 0.47]; }
          var mm = m, br = 0.82 + hh * 0.9;
          var r = mix(b[0], dk[0], mm) * br, gg = mix(b[1], dk[1], mm) * br, bl = mix(b[2], dk[2], mm) * br;
          if (!o.mercury) { // bright ray systems around Tycho and Copernicus
            var dT = angDist(lat, lon, -43.3, -11.4), ang = Math.atan2(lat + 43.3, (lon + 11.4) * Math.cos(lat * DEG));
            if (dT < 0.55) { var ray = Math.pow(Math.max(0, vnoise(ang * 9, 0, 3, 41)), 3) * smooth(0.55, 0.05, dT); br = ray * 0.55 + (dT < 0.03 ? 0.35 : 0); r += br; gg += br; bl += br; }
            var dC = angDist(lat, lon, 9.6, -20.1);
            if (dC < 0.16) { var rc = smooth(0.16, 0.02, dC) * 0.28; r += rc; gg += rc; bl += rc; }
          } else {
            var dB = angDist(lat, lon, 40, 60); // a young bright crater ray
            if (dB < 0.25) { var rb = smooth(0.25, 0.02, dB) * 0.25; r += rb; gg += rb; bl += rb * 0.9; }
          }
          g.col[i * 4] = r * 255; g.col[i * 4 + 1] = gg * 255; g.col[i * 4 + 2] = bl * 255; g.col[i * 4 + 3] = 255;
        }
      }
    } });
    return steps;
  }

  /* ---- MARS ---- */
  function recipeMars(g) {
    var W = g.W, H = g.H, steps = [];
    var dark = [[8.4, 69.5, 9, 7], [46, -20, 14, 20], [-3, -5, 8, 12], [-20, 145, 8, 14], [-35, -155, 8, 14], [25, -45, 10, 12], [-10, 40, 9, 12], [-55, 40, 7, 14]];
    steps.push({ rows: H, chunk: 16, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG);
        for (var x = 0; x < W; x++) {
          var X = cl * g.cos[x], Y = sl, Z = -cl * g.sin[x], lon = Math.atan2(-Z, X) / DEG, i = y * W + x;
          var f = fbm(X * 2.5, Y * 2.5, Z * 2.5, 5, 3), f2 = fbm(X * 9, Y * 9, Z * 9, 4, 17);
          var e = (f - 0.5) * 0.5 + (f2 - 0.5) * 0.18;
          e += 0.2 * (smooth(-10, 25, lat) * -1 + smooth(-5, -50, lat) * 0.55);          // lowlands in the north, highlands south
          e += 0.62 * Math.exp(-Math.pow(angDist(lat, lon, 1, -105) / (24 * DEG), 2));   // Tharsis bulge
          e += 0.55 * Math.exp(-Math.pow(angDist(lat, lon, 18.65, -133.8) / (3.2 * DEG), 2)); // Olympus Mons
          var dH = angDist(lat, lon, -42.4, 70.5) / (13 * DEG);
          e -= 0.8 * Math.max(0, 1 - dH * dH) - (dH > 0.9 && dH < 1.15 ? 0.1 : 0);       // Hellas basin
          e -= 0.4 * Math.max(0, 1 - Math.pow(angDist(lat, lon, -50, -43) / (7 * DEG), 2));   // Argyre
          e -= 0.28 * Math.max(0, 1 - Math.pow(angDist(lat, lon, 12.9, 87) / (7 * DEG), 2));  // Isidis
          // Valles Marineris: a long trough from lon -95 to -40 near lat -13
          var vl = Math.max(-95, Math.min(-40, lon)), vlat = -11 - (vl + 95) * 0.045;
          var dv = Math.sqrt(Math.pow(lat - vlat, 2) + Math.pow((lon - vl) * cl, 2));
          e -= 0.22 * Math.exp(-Math.pow(dv / 1.8, 2)) * smooth(-100, -92, lon) * smooth(-35, -45, lon);
          g.h[i] = e;
          var m = 0;
          for (var k = 0; k < dark.length; k++) { var dd = ellipseMask(lat, lon, dark[k][0], dark[k][1], dark[k][2], dark[k][3], (f2 - 0.5) * 0.7); var v = 1 - smooth(0.6, 1.0, dd); if (v > m) m = v; }
          g.m[i] = Math.min(1, m * (0.7 + 0.5 * f2));
        }
      }
    } });
    steps.push({ rows: 1, chunk: 1, fn: function () { stampCraters(g, randomCraters(23, Math.round(W * 0.45), 0.5, 6, 0.05).filter(function (c) { return c.lat < 10 || Math.random() < 0.3; })); } });
    steps.push({ rows: H, chunk: 24, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H);
        for (var x = 0; x < W; x++) {
          var i = y * W + x, e = g.h[i], m = g.m[i];
          var f2 = fbm(x / W * 14, y / H * 7, 0.5, 3, 61);
          var br = 0.9 + e * 0.35 + (f2 - 0.5) * 0.18;
          var r = mix(0.78, 0.26, m) * br, gg = mix(0.44, 0.16, m) * br, b = mix(0.26, 0.12, m) * br;
          var ve = (f2 - 0.5) * 0.18; r += ve * 0.5; gg += ve * 0.3; b += ve * 0.15;
          if (e > 0.5) { r *= 1.1; gg *= 1.08; b *= 1.05; }                 // high dusty volcanoes
          var dHel = e < -0.55 ? 0.14 : 0; r += dHel; gg += dHel; b += dHel * 0.9; // pale Hellas floor
          var capN = 82 - Math.abs(f2 - 0.5) * 12, capS = -83 + Math.abs(f2 - 0.5) * 14;
          var ice = lat > capN ? smooth(capN, capN + 3, lat) : lat < capS ? smooth(capS, capS - 3, lat) : 0;
          r = mix(r, 0.93, ice); gg = mix(gg, 0.93, ice); b = mix(b, 0.95, ice);
          g.col[i * 4] = r * 255; g.col[i * 4 + 1] = gg * 255; g.col[i * 4 + 2] = b * 255; g.col[i * 4 + 3] = 255;
        }
      }
    } });
    return steps;
  }

  /* ---- Banded atmospheres (Jupiter, Saturn, Uranus, Neptune, Venus) ---- */
  function ramp(stops, t) { // stops: [[pos, r,g,b], ...] ascending
    if (t <= stops[0][0]) return stops[0];
    for (var i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i], k = (t - a[0]) / (b[0] - a[0]);
        return [t, mix(a[1], b[1], k), mix(a[2], b[2], k), mix(a[3], b[3], k)];
      }
    }
    return stops[stops.length - 1];
  }
  var PAL = {
    jupiter: [[0, 0.58, 0.4, 0.29], [0.3, 0.72, 0.52, 0.38], [0.5, 0.86, 0.74, 0.6], [0.72, 0.93, 0.85, 0.72], [1, 0.95, 0.9, 0.8]],
    saturn: [[0, 0.74, 0.62, 0.43], [0.5, 0.86, 0.76, 0.55], [1, 0.93, 0.86, 0.66]],
    uranus: [[0, 0.62, 0.84, 0.86], [1, 0.76, 0.93, 0.94]],
    neptune: [[0, 0.13, 0.25, 0.7], [0.6, 0.2, 0.36, 0.84], [1, 0.3, 0.5, 0.92]],
    venus: [[0, 0.78, 0.64, 0.38], [0.5, 0.9, 0.78, 0.5], [1, 0.97, 0.92, 0.72]]
  };
  function recipeBands(g, o) {
    var W = g.W, H = g.H, pal = PAL[o.id];
    return [{ rows: H, chunk: 12, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG), v = lat / 90;
        for (var x = 0; x < W; x++) {
          var X = cl * g.cos[x], Z = -cl * g.sin[x], i = y * W + x, lon = Math.atan2(-Z, X) / DEG;
          var warp = (fbm(X * o.warpF, sl * o.warpF * 0.5, Z * o.warpF, 4, 5) - 0.5) * o.warp;
          var streak = fbm(X * o.stretchF, sl * o.stretchF * o.stretch, Z * o.stretchF, 5, 9);
          var vv = v + warp * 0.1, band = 0.5 + 0.32 * Math.sin(vv * Math.PI * o.bands + 1.3 + warp * 2.6) + 0.18 * Math.sin(vv * Math.PI * o.bands * 2.3 + 0.7 + warp * 1.4);
          band = band * (1 - o.noiseMix) + streak * o.noiseMix;
          var c = ramp(pal, Math.min(1, Math.max(0, band)));
          var r = c[1], gg = c[2], b = c[3];
          var k = 0.92 + (fbm(X * o.fineF, sl * o.fineF * 3, Z * o.fineF, 4, 33) - 0.5) * o.fine;
          r *= k; gg *= k; b *= k;
          if (o.id === 'jupiter') {
            var pol = smooth(52, 80, Math.abs(lat)); r = mix(r, 0.48, pol * 0.7); gg = mix(gg, 0.5, pol * 0.7); b = mix(b, 0.56, pol * 0.7);
            // Great Red Spot (south tropical, ~ -22°) and a couple of white ovals
            var dx = lon - 20; if (dx > 180) dx -= 360; if (dx < -180) dx += 360;
            var ex = dx / 13, ey = (lat + 22) / 7.2, d = Math.sqrt(ex * ex + ey * ey);
            if (d < 1.6) {
              var sw = 0.5 + 0.5 * Math.sin(d * 18 - Math.atan2(ey, ex) * 2.0);
              var inside = 1 - smooth(0.82, 1.0, d), halo = smooth(1.55, 1.0, d) * 0.35;
              r = mix(r, 0.78 + 0.1 * sw, inside) * (1 - halo * 0.2); gg = mix(gg, 0.32 + 0.08 * sw, inside); b = mix(b, 0.22 + 0.05 * sw, inside);
              if (d >= 1.0) { r = mix(r, 0.96, halo * 0.5); gg = mix(gg, 0.9, halo * 0.5); b = mix(b, 0.82, halo * 0.5); }
            }
            var d2 = Math.sqrt(Math.pow((lon + 45) / 6, 2) + Math.pow((lat + 33) / 3.2, 2));
            if (d2 < 1) { r = mix(r, 0.97, 1 - d2); gg = mix(gg, 0.95, 1 - d2); b = mix(b, 0.9, 1 - d2); }
          } else if (o.id === 'saturn') {
            if (lat > 70) { // north polar hexagon (a darker, bluish hexagonal ring around the pole)
              var colat = 90 - lat, ang = Math.atan2(Z, X), hex = colat * Math.cos(Math.PI / 6) / Math.cos(((ang % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3) - Math.PI / 6);
              var edge = Math.exp(-Math.pow((hex - 12.5) / 1.3, 2)) * 0.55;
              r = mix(r, 0.45, edge + smooth(12.5, 4, colat) * 0.45); gg = mix(gg, 0.55, edge + smooth(12.5, 4, colat) * 0.45); b = mix(b, 0.62, edge + smooth(12.5, 4, colat) * 0.4);
            }
          } else if (o.id === 'neptune') {
            var dxn = lon + 30; if (dxn > 180) dxn -= 360; if (dxn < -180) dxn += 360;
            var dn = Math.sqrt(Math.pow(dxn / 15, 2) + Math.pow((lat + 22) / 7, 2));
            if (dn < 1) { var kk = 1 - smooth(0.4, 1, dn); r = mix(r, 0.07, kk * 0.8); gg = mix(gg, 0.13, kk * 0.8); b = mix(b, 0.4, kk * 0.8); }
            var cir = fbm(X * 14, sl * 36, Z * 14, 4, 77) > 0.63 && lat < -30 && lat > -52 ? 0.7 : 0;
            var dco = Math.sqrt(Math.pow((dxn - 12) / 20, 2) + Math.pow((lat + 28) / 3.2, 2)); if (dco < 1) cir = Math.max(cir, 0.8 * (1 - dco));
            r = mix(r, 0.95, cir * 0.7); gg = mix(gg, 0.97, cir * 0.7); b = mix(b, 1, cir * 0.7);
          } else if (o.id === 'uranus') {
            var cap = smooth(35, 80, -lat) * 0.08 + smooth(50, 85, lat) * 0.04; r += cap; gg += cap; b += cap;
          }
          g.col[i * 4] = r * 255; g.col[i * 4 + 1] = gg * 255; g.col[i * 4 + 2] = b * 255; g.col[i * 4 + 3] = 255;
        }
      }
    } }];
  }
  var BAND = {
    jupiter: { bands: 15, warp: 2.4, warpF: 4, stretch: 9, stretchF: 2.6, noiseMix: 0.4, fine: 0.3, fineF: 11 },
    saturn: { bands: 11, warp: 0.8, warpF: 2.5, stretch: 9, stretchF: 1.8, noiseMix: 0.18, fine: 0.1, fineF: 7 },
    uranus: { bands: 5, warp: 0.3, warpF: 2, stretch: 9, stretchF: 1.5, noiseMix: 0.12, fine: 0.04, fineF: 5 },
    neptune: { bands: 9, warp: 0.7, warpF: 2.5, stretch: 8, stretchF: 2, noiseMix: 0.3, fine: 0.12, fineF: 8 },
    venus: { bands: 7, warp: 3.2, warpF: 3.5, stretch: 3, stretchF: 2.4, noiseMix: 0.5, fine: 0.12, fineF: 6 }
  };

  /* ---- SUN: granulation + sunspots ---- */
  function recipeSun(g) {
    var W = g.W, H = g.H;
    var spots = [[14, -40, 5], [-12, 20, 4], [22, 60, 3], [-20, -75, 3.5], [8, 100, 2.5]];
    return [{ rows: H, chunk: 12, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG);
        for (var x = 0; x < W; x++) {
          var X = cl * g.cos[x], Z = -cl * g.sin[x], i = y * W + x, lon = Math.atan2(-Z, X) / DEG;
          var a = fbm(X * 22, sl * 22, Z * 22, 3, 5), b = fbm(X * 7, sl * 7, Z * 7, 4, 15);
          var gran = 1 - Math.abs(a - 0.5) * 2; gran = Math.pow(gran, 2.2);
          var t = 0.55 + gran * 0.35 + (b - 0.5) * 0.25;
          var spot = 0;
          for (var k = 0; k < spots.length; k++) { var d = angDist(lat, lon, spots[k][0], spots[k][1]) / (spots[k][2] * DEG); spot = Math.max(spot, 1 - smooth(0.35, 1.0, d)); }
          t = mix(t, 0.12, spot * 0.9);
          var r = Math.min(1, 0.55 + t * 0.6), gg = Math.min(1, 0.18 + t * 0.7), bl = Math.min(1, 0.02 + t * 0.35);
          g.col[i * 4] = r * 255; g.col[i * 4 + 1] = gg * 255; g.col[i * 4 + 2] = bl * 255; g.col[i * 4 + 3] = 255;
        }
      }
    } }];
  }

  /* ---- Small bodies (Pluto, Charon, Eris, Ceres, Vesta) ---- */
  function recipeSmall(g, o) {
    var W = g.W, H = g.H, steps = [];
    steps.push({ rows: H, chunk: 16, fn: function (y0, y1) {
      for (var y = y0; y < y1; y++) {
        var lat = rowLat(y, H), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG);
        for (var x = 0; x < W; x++) {
          var X = cl * g.cos[x], Z = -cl * g.sin[x], i = y * W + x, lon = Math.atan2(-Z, X) / DEG;
          var f = fbm(X * 4, sl * 4, Z * 4, 5, o.seed), f2 = fbm(X * 12, sl * 12, Z * 12, 3, o.seed + 9);
          g.h[i] = (f - 0.5) * 0.4 + (f2 - 0.5) * 0.12;
          var r = o.base[0], gg = o.base[1], b = o.base[2], k = 0.8 + f * 0.45;
          r *= k; gg *= k; b *= k;
          if (o.id === 'pluto') {
            var dark = 1 - smooth(0.6, 1, ellipseMask(lat, lon, -8, 70, 14, 55, (f2 - 0.5) * 0.6)); // Cthulhu Macula
            r = mix(r, 0.35, dark * 0.8); gg = mix(gg, 0.17, dark * 0.8); b = mix(b, 0.14, dark * 0.8);
            var heart = Math.max(1 - smooth(0.7, 1, ellipseMask(lat, lon, 22, 178, 16, 17, (f2 - 0.5) * 0.3)), 1 - smooth(0.7, 1, ellipseMask(lat, lon, 28, 148, 17, 14, (f2 - 0.5) * 0.3)));
            r = mix(r, 0.96, heart); gg = mix(gg, 0.9, heart); b = mix(b, 0.84, heart);
            var cap = smooth(62, 78, lat); r = mix(r, 0.5, cap * 0.5); gg = mix(gg, 0.3, cap * 0.5); b = mix(b, 0.22, cap * 0.5);
          } else if (o.id === 'charon') {
            var pol = smooth(58, 78, lat); r = mix(r, 0.52, pol); gg = mix(gg, 0.3, pol); b = mix(b, 0.24, pol);
          } else if (o.id === 'ceres') {
            var occ = 1 - smooth(0.0, 1, angDist(lat, lon, 19.8, -121) / (1.5 * DEG)); r += occ * 0.7; gg += occ * 0.7; b += occ * 0.7;
          }
          g.col[i * 4] = r * 255; g.col[i * 4 + 1] = gg * 255; g.col[i * 4 + 2] = b * 255; g.col[i * 4 + 3] = 255;
        }
      }
    } });
    steps.push({ rows: 1, chunk: 1, fn: function () { if (o.craters) stampCraters(g, randomCraters(o.seed + 3, o.craters, 0.8, 10, 0.05)); } });
    return steps;
  }

  var SPECS = {
    moon:    { recipe: 'moon', bump: 1.6, detail: 0.35, ambient: 0.05, seg: 1 },
    mercury: { recipe: 'moon', mercury: true, bump: 1.8, detail: 0.35, ambient: 0.05 },
    mars:    { recipe: 'mars', bump: 0.45, detail: 0.28, ambient: 0.05, atm: [0.9, 0.62, 0.45], atmPow: 5, atmOp: 0.35, atmScale: 1.035 },
    venus:   { recipe: 'bands', band: 'venus', ambient: 0.07, atm: [1.0, 0.85, 0.5], atmPow: 3.2, atmOp: 0.8, atmScale: 1.06, rim: 0.7, limb: 0.15 },
    jupiter: { recipe: 'bands', band: 'jupiter', ambient: 0.05, atm: [0.9, 0.78, 0.62], atmPow: 5, atmOp: 0.25, atmScale: 1.03, limb: 0.5 },
    saturn:  { recipe: 'bands', band: 'saturn', ambient: 0.05, atm: [0.95, 0.85, 0.6], atmPow: 5, atmOp: 0.25, atmScale: 1.03, limb: 0.5 },
    uranus:  { recipe: 'bands', band: 'uranus', ambient: 0.06, atm: [0.6, 0.9, 0.95], atmPow: 3.5, atmOp: 0.6, atmScale: 1.05, rim: 0.5, limb: 0.35 },
    neptune: { recipe: 'bands', band: 'neptune', ambient: 0.05, atm: [0.35, 0.55, 1.0], atmPow: 3.5, atmOp: 0.65, atmScale: 1.05, rim: 0.5, limb: 0.35 },
    sun:     { recipe: 'sun' },
    pluto:   { recipe: 'small', seed: 51, base: [0.72, 0.58, 0.48], craters: 60, bump: 0.8, detail: 0.2, ambient: 0.05, atm: [0.5, 0.65, 0.95], atmPow: 5, atmOp: 0.25, atmScale: 1.04 },
    charon:  { recipe: 'small', seed: 61, base: [0.58, 0.56, 0.54], craters: 120, bump: 0.9, detail: 0.25, ambient: 0.05 },
    eris:    { recipe: 'small', seed: 71, base: [0.88, 0.87, 0.84], craters: 0, bump: 0.3, detail: 0.1, ambient: 0.05 },
    ceres:   { recipe: 'small', seed: 81, base: [0.4, 0.39, 0.37], craters: 240, bump: 1.2, detail: 0.3, ambient: 0.05 },
    vesta:   { recipe: 'small', seed: 91, base: [0.55, 0.53, 0.5], craters: 160, bump: 1.4, detail: 0.3, ambient: 0.05 }
  };
  P.specs = SPECS;

  /* ----------------------------------------------------------- shaders */
  var SUN_DIR = new THREE.Vector3(-0.62, 0.34, 0.71).normalize();
  P.sunDir = SUN_DIR;

  var PLANET_VS = [
    'varying vec2 vUv; varying vec3 vN; varying vec3 vT; varying vec3 vB; varying vec3 vP;',
    'void main(){',
    '  vUv = uv;',
    '  mat3 m = mat3(modelMatrix);',
    '  vN = normalize(m * normal);',
    '  vT = normalize(m * vec3(normal.z, 0.0, -normal.x) + 1e-5);',
    '  vB = cross(vN, vT);',
    '  vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz;',
    '  gl_Position = projectionMatrix * viewMatrix * wp;',
    '}'
  ].join('\n');

  var PLANET_FS = [
    'precision highp float;',
    'uniform sampler2D map; uniform sampler2D bumpMap; uniform sampler2D nightMap; uniform sampler2D specMap; uniform sampler2D detailMap;',
    'uniform vec3 uSun; uniform vec3 uAtm; uniform float uBump; uniform float uAmb; uniform float uRim; uniform float uSpec; uniform float uDetail; uniform float uLimb; uniform float uNight; uniform vec2 uTexel; uniform float uFade;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vT; varying vec3 vB; varying vec3 vP;',
    'void main(){',
    '  vec3 N = normalize(vN);',
    '  vec3 V = normalize(cameraPosition - vP);',
    '  vec3 col = texture2D(map, vUv).rgb;',
    '  #ifdef USE_DETAIL',
    '    float d = texture2D(detailMap, vUv * vec2(12.0, 6.0)).r;',
    '    col *= 1.0 + (d - 0.5) * uDetail * 2.0;',
    '  #endif',
    '  #ifdef USE_BUMP',
    '    float hL = texture2D(bumpMap, vUv - vec2(uTexel.x, 0.0)).r; float hR = texture2D(bumpMap, vUv + vec2(uTexel.x, 0.0)).r;',
    '    float hD = texture2D(bumpMap, vUv - vec2(0.0, uTexel.y)).r; float hU = texture2D(bumpMap, vUv + vec2(0.0, uTexel.y)).r;',
    '    N = normalize(N - uBump * ((hR - hL) * vT + (hU - hD) * vB) * 6.0);',
    '  #endif',
    '  float ndl = dot(N, uSun);',
    '  float diff = clamp((ndl + 0.08) / 1.08, 0.0, 1.0);',
    '  diff = pow(diff, 0.85) * 1.12;',
    '  float ndv = max(dot(normalize(vN), V), 0.0);',
    '  vec3 lit = col * (uAmb + diff * (1.0 - uAmb));',
    '  lit *= mix(1.0, pow(ndv, 0.35), uLimb);',
    '  #ifdef USE_NIGHT',
    '    vec3 nl = texture2D(nightMap, vUv).rgb;',
    '    float dark = 1.0 - smoothstep(-0.14, 0.12, ndl);',
    '    lit += nl * dark * uNight * vec3(1.0, 0.85, 0.6);',
    '  #endif',
    '  #ifdef USE_SPEC',
    '    float sm = texture2D(specMap, vUv).r;',
    '    vec3 H = normalize(uSun + V);',
    '    float sp = pow(max(dot(N, H), 0.0), 70.0) * sm * uSpec * smoothstep(0.0, 0.25, ndl);',
    '    lit += vec3(1.0, 0.95, 0.85) * sp;',
    '  #endif',
    '  float fr = pow(1.0 - ndv, 3.0);',
    '  lit += uAtm * fr * uRim * smoothstep(-0.3, 0.5, ndl);',
    '  gl_FragColor = vec4(lit * uFade, 1.0);',
    '}'
  ].join('\n');

  var ATM_VS = [
    'varying vec3 vN; varying vec3 vP;',
    'void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }'
  ].join('\n');
  var ATM_FS = [
    'precision highp float;',
    'uniform vec3 uColor; uniform vec3 uSun; uniform float uPow; uniform float uOp; uniform float uC;',
    'varying vec3 vN; varying vec3 vP;',
    'void main(){',
    '  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vP);',
    '  float i = pow(clamp(uC - dot(N, V), 0.0, 1.0), uPow);',
    '  float sun = 0.12 + 0.88 * smoothstep(-0.35, 0.45, dot(N, uSun));',
    '  gl_FragColor = vec4(uColor * i * sun * uOp * 2.2, i * sun * uOp);',
    '}'
  ].join('\n');

  var SUN_FS = [
    'precision highp float;',
    'uniform sampler2D map; uniform float uTime;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vP;',
    'void main(){',
    '  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vP);',
    '  float ndv = max(dot(N, V), 0.0);',
    '  vec2 uv1 = vUv + vec2(uTime * 0.004, 0.0); vec2 uv2 = vUv * vec2(1.7, 1.7) + vec2(-uTime * 0.006, uTime * 0.002);',
    '  vec3 a = texture2D(map, uv1).rgb; vec3 b = texture2D(map, uv2).rgb;',
    '  vec3 c = mix(a, b, 0.35) * (1.0 + 0.12 * sin(uTime * 0.9 + vUv.x * 40.0));',
    '  float limb = pow(ndv, 0.55);',
    '  c *= mix(0.55, 1.15, limb);',
    '  c += vec3(0.25, 0.08, 0.0) * (1.0 - ndv);',
    '  gl_FragColor = vec4(c * 1.15, 1.0);',
    '}'
  ].join('\n');

  var RING_FS = [
    'precision highp float;',
    'uniform sampler2D map; uniform vec3 uSun; uniform vec3 uCenter; uniform float uR; uniform float uOp;',
    'varying vec2 vUv; varying vec3 vP;',
    'void main(){',
    '  vec4 t = texture2D(map, vec2(vUv.x, 0.5));',
    '  vec3 L = normalize(uSun);',
    '  vec3 oc = vP - uCenter; float tc = -dot(oc, L);',
    '  float shadow = 1.0;',
    '  if (tc > 0.0) { vec3 cp = oc + L * tc; float dd = length(cp); shadow = smoothstep(uR * 0.985, uR * 1.02, dd); }',
    '  float a = t.a * uOp;',
    '  vec3 col = t.rgb * (0.12 + 0.88 * shadow);',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n');
  var RING_VS = [
    'varying vec2 vUv; varying vec3 vP;',
    'void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }'
  ].join('\n');

  /* ------------------------------------------------------------ shared bits */
  var geoCache = {}, detailTex = null, flatTex = {};
  function sphereGeo(seg) {
    var k = 's' + seg;
    return geoCache[k] || (geoCache[k] = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75)));
  }
  function makeDetail() {
    if (detailTex) return detailTex;
    var c = canvasOf(256, 256), x = c.getContext('2d'), im = x.createImageData(256, 256);
    for (var j = 0; j < 256; j++) for (var i = 0; i < 256; i++) {
      var u = i / 256 * 8, v = j / 256 * 8;
      // tileable value noise via periodic lattice
      var n = 0, amp = 0.5, f = 1;
      for (var o = 0; o < 4; o++) { n += amp * tile(u * f, v * f, 8 * f, o); amp *= 0.5; f *= 2; }
      var val = Math.max(0, Math.min(255, n * 255 / 0.94));
      var idx = (j * 256 + i) * 4; im.data[idx] = im.data[idx + 1] = im.data[idx + 2] = val; im.data[idx + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    detailTex = new THREE.CanvasTexture(c); detailTex.wrapS = detailTex.wrapT = THREE.RepeatWrapping;
    return detailTex;
    function tile(u, v, period, s) {
      var iu = Math.floor(u), iv = Math.floor(v), fu = u - iu, fv = v - iv;
      fu = fu * fu * (3 - 2 * fu); fv = fv * fv * (3 - 2 * fv);
      var a = h3(iu % period, iv % period, 0, 90 + s), b = h3((iu + 1) % period, iv % period, 0, 90 + s);
      var cc = h3(iu % period, (iv + 1) % period, 0, 90 + s), d = h3((iu + 1) % period, (iv + 1) % period, 0, 90 + s);
      return mix(mix(a, b, fu), mix(cc, d, fu), fv);
    }
  }
  function flat(r, g, b) {
    var k = r + ',' + g + ',' + b;
    if (flatTex[k]) return flatTex[k];
    var c = canvasOf(2, 2), x = c.getContext('2d'); x.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; x.fillRect(0, 0, 2, 2);
    return (flatTex[k] = new THREE.CanvasTexture(c));
  }
  function glowTexture(inner) {
    var c = canvasOf(256, 256), x = c.getContext('2d');
    var g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(inner || 0.12, 'rgba(255,240,200,0.85)');
    g.addColorStop(0.35, 'rgba(255,180,80,0.25)'); g.addColorStop(0.7, 'rgba(255,120,40,0.06)'); g.addColorStop(1, 'rgba(255,100,20,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  P.glowTexture = glowTexture;
  function ringTexture(kind) {
    var W = 1024, c = canvasOf(W, 4), x = c.getContext('2d'), im = x.createImageData(W, 4);
    for (var i = 0; i < W; i++) {
      var t = i / W, a = 0, br = 0.8;
      if (kind === 'saturn') {
        // inner radius 1.24 R -> outer 2.27 R mapped to 0..1 (C ring, B ring, Cassini Division, A ring, Encke gap)
        if (t < 0.28) { a = 0.12 + 0.18 * smooth(0.0, 0.28, t); br = 0.55; }
        else if (t < 0.70) { a = 0.78 + 0.2 * vnoise(t * 90, 0, 0, 5); br = 0.95 + 0.1 * Math.sin(t * 160); }
        else if (t < 0.77) { a = 0.05 + 0.05 * vnoise(t * 60, 0, 0, 7); br = 0.5; }
        else { a = 0.62 + 0.2 * vnoise(t * 120, 0, 0, 9); br = 0.85; if (Math.abs(t - 0.93) < 0.006) a *= 0.12; if (t > 0.975) a *= 0.2; }
        a *= 0.82 + 0.3 * vnoise(t * 400, 1, 0, 3) - 0.1;
        a = Math.max(0, Math.min(1, a));
        var tint = 0.9 + 0.1 * vnoise(t * 30, 2, 0, 4);
        var rr = 222 * br * tint, gg = 202 * br * tint, bb = 165 * br * tint;
        var idx = i * 4; for (var j = 0; j < 4; j++) { var k = idx + j * W * 4; im.data[k] = rr; im.data[k + 1] = gg; im.data[k + 2] = bb; im.data[k + 3] = a * 255; }
      } else { // Uranus: a few narrow dark rings
        var rings = [0.12, 0.22, 0.31, 0.42, 0.55, 0.8, 0.9], aa = 0;
        for (var q = 0; q < rings.length; q++) aa = Math.max(aa, Math.exp(-Math.pow((t - rings[q]) / (q === 6 ? 0.012 : 0.006), 2)) * (q === 6 ? 0.55 : 0.28));
        var idx2 = i * 4; for (var j2 = 0; j2 < 4; j2++) { var k2 = idx2 + j2 * W * 4; im.data[k2] = 150; im.data[k2 + 1] = 160; im.data[k2 + 2] = 170; im.data[k2 + 3] = aa * 255; }
      }
    }
    x.putImageData(im, 0, 0);
    var tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /* ------------------------------------------------------------- the factory */
  var PHYS = { // axial tilt (deg), visual spin rate (rad/s), face longitude at default view
    earth: { tilt: 23.4, spin: 0.05, face: 15 }, moon: { tilt: 6.7, spin: 0.012, face: 0 }, sun: { tilt: 7.25, spin: 0.02, face: 0 },
    mercury: { tilt: 0, spin: 0.02, face: -10 }, venus: { tilt: 3, spin: -0.012, face: 0 }, mars: { tilt: 25.2, spin: 0.045, face: -85 },
    jupiter: { tilt: 3.1, spin: 0.11, face: 0 }, saturn: { tilt: 26.7, spin: 0.09, face: 0 }, uranus: { tilt: 97.8, spin: -0.05, face: 0 },
    neptune: { tilt: 28.3, spin: 0.07, face: 0 }, pluto: { tilt: 10, spin: -0.02, face: 160 }, charon: { tilt: 0, spin: -0.02, face: 0 },
    eris: { tilt: 0, spin: 0.02, face: 0 }, ceres: { tilt: 4, spin: 0.05, face: -121 }, vesta: { tilt: 27, spin: 0.06, face: 0 }
  };

  /**
   * P.create(id, { radius, quality }) -> body object
   *   body.group   THREE.Group (place it in the world)
   *   body.spin    THREE.Object3D that holds the surface mesh (rotation.y = spin)
   *   body.view    outer Object3D whose rotation.x is the user's pitch
   *   body.update(dt, t)   body.ensureTextures(priority)   body.dispose()
   *   body.dir(lat, lon)   -> local THREE.Vector3 (unit) on the surface
   */
  P.create = function (id, opt) {
    opt = opt || {};
    var q = opt.quality || { texW: 768, seg: 48 };
    var R = opt.radius || 1, spec = SPECS[id] || {}, phys = PHYS[id] || { tilt: 0, spin: 0.02, face: 0 };
    var group = new THREE.Group(), view = new THREE.Group(), tilt = new THREE.Group(), spin = new THREE.Group();
    group.add(view); view.add(tilt); tilt.add(spin);
    group.name = 'body-' + id;
    tilt.rotation.z = phys.tilt * DEG;
    var seg = Math.max(24, id === 'sun' || id === 'earth' ? q.seg : Math.round(q.seg * (R < 5 ? 0.7 : 1)));
    var geom = sphereGeo(seg);
    var body = { id: id, radius: R, group: group, view: view, tilt: tilt, spin: spin, face: phys.face, spinRate: phys.spin, rotY: -Math.PI / 2 - phys.face * DEG, texturesReady: false, extras: [], disposables: [] };
    var mat, mesh, atm = null, clouds = null, corona = null, rings = null;
    var uniforms;

    if (id === 'sun') {
      uniforms = { map: { value: flat(255, 160, 40) }, uTime: { value: 0 } };
      mat = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: PLANET_VS, fragmentShader: SUN_FS });
      mesh = new THREE.Mesh(geom, mat); mesh.scale.setScalar(R); spin.add(mesh);
      var gt = glowTexture(0.2);
      corona = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color: 0xffb060, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.95 }));
      corona.scale.setScalar(R * 6.2); group.add(corona);
      var corona2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color: 0xff7a30, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.45 }));
      corona2.scale.setScalar(R * 11); group.add(corona2);
      body.extras.push(corona, corona2);
    } else {
      var defines = {};
      uniforms = {
        map: { value: flat(120, 110, 100) }, bumpMap: { value: flat(128, 128, 128) }, nightMap: { value: flat(0, 0, 0) }, specMap: { value: flat(0, 0, 0) }, detailMap: { value: flat(128, 128, 128) },
        uSun: { value: SUN_DIR }, uAtm: { value: new THREE.Vector3().fromArray(spec.atm || [0.4, 0.6, 1.0]) }, uBump: { value: spec.bump || 0 },
        uAmb: { value: spec.ambient == null ? 0.05 : spec.ambient }, uRim: { value: spec.rim == null ? 0 : spec.rim }, uSpec: { value: 0 }, uDetail: { value: spec.detail || 0 },
        uLimb: { value: spec.limb || 0 }, uNight: { value: 0 }, uTexel: { value: new THREE.Vector2(1 / 512, 1 / 256) }, uFade: { value: 1 }
      };
      if (spec.bump) defines.USE_BUMP = 1;
      if (spec.detail) defines.USE_DETAIL = 1;
      if (id === 'earth') { defines.USE_NIGHT = 1; defines.USE_SPEC = 1; uniforms.uAtm.value.set(0.35, 0.6, 1.0); uniforms.uRim.value = 0.9; uniforms.uNight.value = 1.25; uniforms.uSpec.value = 0.7; uniforms.uAmb.value = 0.035; }
      mat = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: PLANET_VS, fragmentShader: PLANET_FS, defines: defines, extensions: {} });
      mesh = new THREE.Mesh(geom, mat); mesh.scale.setScalar(R); spin.add(mesh);
      if (spec.detail) uniforms.detailMap.value = makeDetail();

      var atmCfg = id === 'earth' ? { color: [0.3, 0.55, 1.0], pow: 3.6, op: 1.0, scale: 1.085, c: 0.45 } : spec.atm ? { color: spec.atm, pow: spec.atmPow || 4, op: spec.atmOp || 0.4, scale: spec.atmScale || 1.05, c: 0.42 } : null;
      if (atmCfg) {
        atm = new THREE.Mesh(sphereGeo(Math.min(48, seg)), new THREE.ShaderMaterial({
          uniforms: { uColor: { value: new THREE.Vector3().fromArray(atmCfg.color) }, uSun: { value: SUN_DIR }, uPow: { value: atmCfg.pow }, uOp: { value: atmCfg.op }, uC: { value: atmCfg.c } },
          vertexShader: ATM_VS, fragmentShader: ATM_FS, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        atm.scale.setScalar(R * atmCfg.scale); view.add(atm); // does not tilt/spin
        body.atmosphere = atm;
      }
      if (id === 'earth') {
        var cloudMat = new THREE.ShaderMaterial({
          uniforms: { map: { value: flat(0, 0, 0) }, uSun: { value: SUN_DIR } },
          vertexShader: PLANET_VS,
          fragmentShader: ['precision highp float;', 'uniform sampler2D map; uniform vec3 uSun;', 'varying vec2 vUv; varying vec3 vN; varying vec3 vT; varying vec3 vB; varying vec3 vP;',
            'void main(){ float a = texture2D(map, vUv).r; vec3 N = normalize(vN); float ndl = dot(N, uSun); float d = clamp((ndl + 0.1) / 1.1, 0.0, 1.0);',
            'vec3 c = vec3(1.0) * (0.04 + d * 0.98); gl_FragColor = vec4(c, a * 0.85); }'].join('\n'),
          transparent: true, depthWrite: false
        });
        clouds = new THREE.Mesh(geom, cloudMat); clouds.scale.setScalar(R * 1.012); spin.add(clouds); body.clouds = clouds;
      }
      if (id === 'saturn' || id === 'uranus') {
        var inner = id === 'saturn' ? 1.24 : 1.55, outer = id === 'saturn' ? 2.27 : 2.05;
        var rg = new THREE.RingGeometry(inner * R, outer * R, 160, 1);
        var pos = rg.attributes.position, uv = rg.attributes.uv;
        for (var vi = 0; vi < pos.count; vi++) { var rr = Math.sqrt(pos.getX(vi) * pos.getX(vi) + pos.getY(vi) * pos.getY(vi)); uv.setXY(vi, (rr / R - inner) / (outer - inner), 0.5); }
        rings = new THREE.Mesh(rg, new THREE.ShaderMaterial({
          uniforms: { map: { value: ringTexture(id) }, uSun: { value: SUN_DIR }, uCenter: { value: new THREE.Vector3() }, uR: { value: R }, uOp: { value: id === 'saturn' ? 0.96 : 0.9 } },
          vertexShader: RING_VS, fragmentShader: RING_FS, transparent: true, side: THREE.DoubleSide, depthWrite: false
        }));
        rings.rotation.x = -Math.PI / 2; tilt.add(rings); body.rings = rings;
      }
    }
    mesh.matrixAutoUpdate = true;
    body.mesh = mesh; body.material = mat; body.uniforms = uniforms;
    spin.rotation.y = body.rotY;

    body.dir = function (lat, lon) { var o = [0, 0, 0]; dirOf(lat, lon, o); return new THREE.Vector3(o[0], o[1], o[2]); };
    var tmpV = new THREE.Vector3();
    /** World position of a surface point (lat, lon in degrees). */
    body.surfacePoint = function (lat, lon, out, lift) {
      out = out || new THREE.Vector3();
      out.copy(body.dir(lat, lon)).multiplyScalar(lift || 1.0); // mesh is already scaled by the radius
      return mesh.localToWorld(out);
    };
    body.surfaceNormal = function (lat, lon, out) {
      out = out || new THREE.Vector3();
      out.copy(body.dir(lat, lon)); out.transformDirection(mesh.matrixWorld); return out;
    };

    var tMove = 0;
    body.update = function (dt, t, opts) {
      opts = opts || {};
      if (!opts.freezeSpin && !body.spinHold) body.rotY += body.spinRate * dt;
      spin.rotation.y = body.rotY;
      if (clouds) clouds.rotation.y = t * 0.004;
      if (uniforms.uTime) uniforms.uTime.value = t;
    };

    /* ------ textures (lazy) ------ */
    var requested = false;
    body.ensureTextures = function (priority, onDone) {
      if (requested) { if (onDone && body.texturesReady) onDone(); return; }
      requested = true;
      var done = function () { body.texturesReady = true; A.bus.emit('planet:ready', { id: id }); if (onDone) onDone(); };
      if (id === 'earth') { loadEarth(done); return; }
      var W = Math.max(256, (id === 'moon' || id === 'mars' || id === 'jupiter' || id === 'saturn' || id === 'sun' || id === 'mercury' || id === 'venus' || id === 'neptune' || id === 'uranus') ? q.texW : Math.min(512, q.texW));
      var H = W / 2, g = makeGrid(W, H), steps;
      var s = spec.recipe;
      if (s === 'moon') steps = recipeMoon(g, spec); else if (s === 'mars') steps = recipeMars(g);
      else if (s === 'bands') steps = recipeBands(g, Object.assign({ id: id }, BAND[spec.band])); else if (s === 'sun') steps = recipeSun(g);
      else steps = recipeSmall(g, Object.assign({ id: id }, spec));
      if (spec.bump) steps.push({ rows: 1, chunk: 1, fn: function () { finishBump(g); } });
      enqueue({ steps: steps, step: 0, row: 0, done: function () {
        var cv = canvasOf(W, H), cx = cv.getContext('2d'), im = new ImageData(g.col, W, H); cx.putImageData(im, 0, 0);
        var tex = texOf(cv, opt.aniso); uniforms.map.value = tex; body.disposables.push(tex);
        if (spec.bump) {
          var bc = canvasOf(W, H), bx = bc.getContext('2d'); bx.putImageData(new ImageData(g.bump, W, H), 0, 0);
          var bt = texOf(bc, opt.aniso); bt.minFilter = THREE.LinearFilter; bt.generateMipmaps = false; uniforms.bumpMap.value = bt; uniforms.uTexel.value.set(1 / W, 1 / H); body.disposables.push(bt);
        }
        body.canvas = cv; // used by the no-3D fallback / thumbnails
        g = null; done();
      } }, priority);
    };

    function loadEarth(done) {
      var base = (A.assetBase || 'assets/'), low = q.texW <= 512, remaining = 4;
      var load = function (file, cb) {
        var im = new Image(); im.onload = function () { cb(im); if (--remaining === 0) done(); }; im.onerror = function () { if (--remaining === 0) done(); };
        im.src = (A.earthData && A.earthData[file]) || (base + file);
      };
      var mk = function (im, grayscale) { var t = new THREE.Texture(im); t.needsUpdate = true; t.wrapS = THREE.RepeatWrapping; t.anisotropy = opt.aniso || 4; body.disposables.push(t); return t; };
      load(low ? 'earth-day-1k.jpg' : (q.texW >= 1024 ? 'earth-day-2k.jpg' : 'earth-day-1k.jpg'), function (im) { uniforms.map.value = mk(im); });
      load('earth-night-1k.jpg', function (im) { uniforms.nightMap.value = mk(im); });
      load('earth-water-1k.jpg', function (im) { uniforms.specMap.value = mk(im); });
      load('earth-clouds-1k.jpg', function (im) { clouds.material.uniforms.map.value = mk(im); });
    }

    body.setFade = function (v) { if (uniforms.uFade) uniforms.uFade.value = v; };
    body.dispose = function () {
      body.disposables.forEach(function (t) { t.dispose(); });
      [mat, atm && atm.material, clouds && clouds.material, rings && rings.material].forEach(function (m) { if (m) m.dispose(); });
      if (rings) rings.geometry.dispose();
    };
    return body;
  };

  /** Preview canvas for a body (for the no-3D fallback): returns a data URL of a shaded disc, or null. */
  P.thumbnail = function (body, size) {
    if (!body || !body.canvas) return null;
    var c = canvasOf(size, size), x = c.getContext('2d'), s = body.canvas;
    var img = x.createImageData(size, size), sx = document.createElement('canvas'); sx.width = s.width; sx.height = s.height;
    var sc = s.getContext('2d').getImageData(0, 0, s.width, s.height).data;
    for (var j = 0; j < size; j++) for (var i = 0; i < size; i++) {
      var nx = (i + 0.5) / size * 2 - 1, ny = 1 - (j + 0.5) / size * 2, d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      var nz = Math.sqrt(1 - d2), lat = Math.asin(ny), lon = Math.atan2(nx, nz) + 0;
      var u = (lon / (2 * Math.PI) + 0.5 + 0.5) % 1, v = 0.5 - lat / Math.PI;
      var px = Math.floor(u * s.width) % s.width, py = Math.min(s.height - 1, Math.floor(v * s.height)), k = (py * s.width + px) * 4;
      var sh = Math.max(0.08, nx * SUN_DIR.x + ny * SUN_DIR.y + nz * SUN_DIR.z), o = (j * size + i) * 4;
      img.data[o] = sc[k] * sh; img.data[o + 1] = sc[k + 1] * sh; img.data[o + 2] = sc[k + 2] * sh; img.data[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    return c.toDataURL('image/jpeg', 0.8);
  };

  P.util = { fbm: fbm, vnoise: vnoise, rng: rng, smooth: smooth, mix: mix, dirOf: dirOf, h3: h3 };
})(window);
