/* ==========================================================================
   ASTROVIA — scenery.js
   Everything that is not a simple sphere:
     - star field, light-speed streaks, galactic backdrop
     - region scenes: asteroid belt, Kuiper belt, Oort Cloud, heliosphere,
       interstellar space, stellar neighbourhood
     - the Milky Way model (an illustrative model, not a photograph)
   Every builder returns { group, anchors, update(dt, t, ctx), dispose() }.
   `anchors` maps hotspot ids to THREE.Vector3 positions in the group's local
   space (the engine converts them to screen space).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  var THREE = global.THREE;
  var PL = A.planets, U = PL.util;
  var DEG = Math.PI / 180;
  var S = (A.scenery = {});

  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  function rand(seed) { return U.rng(seed); }

  /* ---- shared point shader (world-sized soft points, additive) ---- */
  var POINTS_VS = [
    'attribute float aSize; attribute vec3 aColor; attribute float aPhase;',
    'uniform float uScale; uniform float uTime; uniform float uMin; uniform float uMax; uniform float uTwinkle;',
    'varying vec3 vColor; varying float vAlpha;',
    'void main(){',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  float dist = max(-mv.z, 0.001);',
    '  float tw = 1.0 + uTwinkle * 0.25 * sin(uTime * 1.7 + aPhase * 40.0);',
    '  float px = aSize * uScale / dist;',
    '  vAlpha = clamp(px / uMin, 0.0, 1.0) * tw;',
    '  gl_PointSize = clamp(px, uMin, uMax);',
    '  vColor = aColor;',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');
  var POINTS_FS = [
    'precision highp float;',
    'uniform float uOpacity; varying vec3 vColor; varying float vAlpha;',
    'void main(){',
    '  vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0;',
    '  float a = smoothstep(1.0, 0.0, d); a = a * a;',
    '  gl_FragColor = vec4(vColor * a, a) * uOpacity * min(vAlpha, 1.0);',
    '}'
  ].join('\n');

  function pointsMaterial(extra) {
    var u = { uScale: { value: 1000 }, uTime: { value: 0 }, uMin: { value: 1.2 }, uMax: { value: 24 }, uTwinkle: { value: 0 }, uOpacity: { value: 1 } };
    if (extra) for (var k in extra) u[k] = extra[k];
    return new THREE.ShaderMaterial({ uniforms: u, vertexShader: POINTS_VS, fragmentShader: POINTS_FS, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  }
  /** Build a Points object from arrays: pos [x,y,z...], col [r,g,b...], size []. */
  function makePoints(pos, col, size, mat) {
    var n = size.length, g = new THREE.BufferGeometry(), ph = new Float32Array(n), r = rand(n * 7 + 3);
    for (var i = 0; i < n; i++) ph[i] = r();
    g.setAttribute('position', new THREE.BufferAttribute(pos instanceof Float32Array ? pos : new Float32Array(pos), 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col instanceof Float32Array ? col : new Float32Array(col), 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size instanceof Float32Array ? size : new Float32Array(size), 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    var p = new THREE.Points(g, mat || pointsMaterial());
    p.frustumCulled = false;
    return p;
  }
  S.pointsMaterial = pointsMaterial;

  /** Update pixel scale for all point materials used by a scene. */
  S.setScale = function (mats, scale, time) {
    for (var i = 0; i < mats.length; i++) { mats[i].uniforms.uScale.value = scale; mats[i].uniforms.uTime.value = time; }
  };

  var glowTex = null;
  function glow() { return glowTex || (glowTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d');
    var g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, 'rgba(255,255,255,0.55)'); g.addColorStop(0.5, 'rgba(255,255,255,0.1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  })()); }
  function sprite(color, size, opacity) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: opacity == null ? 1 : opacity }));
    s.scale.setScalar(size); return s;
  }
  S.sprite = sprite;

  /* =================================================================== STARS */
  S.createStars = function (count) {
    var r = rand(2024), pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      var z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
      pos[i * 3] = s * Math.cos(a); pos[i * 3 + 1] = z; pos[i * 3 + 2] = s * Math.sin(a);
      var m = Math.pow(r(), 6), t = r(), b = 0.45 + 0.55 * m;
      var rr = t < 0.2 ? 0.7 : t < 0.7 ? 1 : 1, gg = t < 0.2 ? 0.8 : t < 0.7 ? 0.95 : 0.8, bb = t < 0.2 ? 1 : t < 0.7 ? 0.95 : 0.65;
      col[i * 3] = rr * b; col[i * 3 + 1] = gg * b; col[i * 3 + 2] = bb * b;
      size[i] = (0.8 + 4.2 * m) * 0.6;
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    var ph = new Float32Array(count); for (var k = 0; k < count; k++) ph[k] = r();
    g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    var mat = new THREE.ShaderMaterial({
      uniforms: { uPx: { value: 1 }, uTime: { value: 0 }, uOpacity: { value: 1 }, uTwinkle: { value: 1 } },
      vertexShader: [
        'attribute float aSize; attribute vec3 aColor; attribute float aPhase; uniform float uPx; uniform float uTime; uniform float uTwinkle;',
        'varying vec3 vColor; varying float vA;',
        'void main(){ vec4 mv = modelViewMatrix * vec4(position * 6000.0, 1.0);',
        ' float tw = 1.0 + uTwinkle * 0.3 * sin(uTime * (0.8 + aPhase * 2.0) + aPhase * 60.0);',
        ' gl_PointSize = max(1.0, aSize * uPx); vColor = aColor * tw; vA = min(1.0, aSize * 0.8 + 0.35);',
        ' gl_Position = projectionMatrix * mv; }'
      ].join('\n'),
      fragmentShader: [
        'precision highp float; uniform float uOpacity; varying vec3 vColor; varying float vA;',
        'void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0; float a = smoothstep(1.0, 0.1, d);',
        ' gl_FragColor = vec4(vColor * a, a) * uOpacity * vA; }'
      ].join('\n'),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    var pts = new THREE.Points(g, mat); pts.frustumCulled = false; pts.renderOrder = -9;
    return pts;
  };

  /* ================================================================ BACKDROP */
  S.createBackdrop = function (W) {
    W = W || 1024;
    var H = W / 2, c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d'), im = x.createImageData(W, H), d = im.data;
    var tiltA = 62 * DEG, nodeLon = 40 * DEG;
    var blobs = [[1.2, 0.3, 0.9, [0.55, 0.3, 0.9]], [4.1, -0.25, 0.7, [0.3, 0.45, 0.95]], [2.6, -0.55, 0.8, [0.75, 0.3, 0.6]], [5.4, 0.45, 0.6, [0.35, 0.35, 0.85]]];
    for (var j = 0; j < H; j++) {
      var lat = (0.5 - (j + 0.5) / H) * Math.PI;
      for (var i = 0; i < W; i++) {
        var lon = ((i + 0.5) / W) * 2 * Math.PI - Math.PI;
        var X = Math.cos(lat) * Math.cos(lon), Y = Math.sin(lat), Z = -Math.cos(lat) * Math.sin(lon);
        // galactic plane normal
        var nx = Math.sin(tiltA) * Math.cos(nodeLon + Math.PI / 2), ny = Math.cos(tiltA), nz = -Math.sin(tiltA) * Math.sin(nodeLon + Math.PI / 2);
        var dist = X * nx + Y * ny + Z * nz;                      // sine of galactic latitude
        var band = Math.exp(-Math.pow(dist / 0.17, 2));
        var f = U.fbm(X * 3.2, Y * 3.2, Z * 3.2, 5, 11), f2 = U.fbm(X * 8, Y * 8, Z * 8, 4, 29);
        var dust = U.smooth(0.4, 0.85, U.fbm(X * 4 + 3, Y * 4, Z * 4, 5, 41)) * band * 0.7;
        var core = band * (0.35 + 0.65 * f) * (0.7 + 0.5 * f2);
        var lum = core * (1 - dust * 0.75) * 0.5 + Math.exp(-Math.pow(dist / 0.45, 2)) * 0.05 * f;
        var rr = 0.75 * lum, gg = 0.72 * lum, bb = 0.85 * lum;
        for (var k = 0; k < blobs.length; k++) {
          var bl = blobs[k], bx = Math.cos(bl[1]) * Math.cos(bl[0]), by = Math.sin(bl[1]), bz = -Math.cos(bl[1]) * Math.sin(bl[0]);
          var dd = Math.acos(Math.max(-1, Math.min(1, X * bx + Y * by + Z * bz))) / bl[2];
          var m = Math.exp(-dd * dd * 2.2) * (0.35 + 0.65 * U.fbm(X * 6 + k, Y * 6, Z * 6, 4, 50 + k)) * 0.16;
          rr += bl[3][0] * m; gg += bl[3][1] * m; bb += bl[3][2] * m;
        }
        var p = (j * W + i) * 4;
        d[p] = Math.min(255, rr * 255); d[p + 1] = Math.min(255, gg * 255); d[p + 2] = Math.min(255, bb * 255); d[p + 3] = 255;
      }
    }
    x.putImageData(im, 0, 0);
    var tex = new THREE.CanvasTexture(c); tex.wrapS = THREE.RepeatWrapping;
    var mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex }, uOpacity: { value: 0.55 }, uTint: { value: new THREE.Vector3(1, 1, 1) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'precision highp float; uniform sampler2D map; uniform float uOpacity; uniform vec3 uTint; varying vec2 vUv; void main(){ vec3 c = texture2D(map, vUv).rgb * uTint; gl_FragColor = vec4(c * uOpacity, 1.0); }',
      side: THREE.BackSide, depthWrite: false, depthTest: false
    });
    var m = new THREE.Mesh(new THREE.SphereGeometry(7000, 48, 24), mat); m.renderOrder = -10; m.frustumCulled = false;
    m.userData.texture = tex;
    return m;
  };

  /* ================================================================== WARP */
  S.createWarp = function (count) {
    var r = rand(777), n = count;
    var seed = new Float32Array(n * 4 * 3), corner = new Float32Array(n * 4 * 2), rnd = new Float32Array(n * 4), idx = new Uint32Array(n * 6);
    var cs = [[-1, 0], [1, 0], [-1, 1], [1, 1]];
    for (var i = 0; i < n; i++) {
      var sx = r(), sy = r(), sz = r(), rv = r();
      for (var k = 0; k < 4; k++) {
        var v = i * 4 + k;
        seed[v * 3] = sx; seed[v * 3 + 1] = sy; seed[v * 3 + 2] = sz;
        corner[v * 2] = cs[k][0]; corner[v * 2 + 1] = cs[k][1]; rnd[v] = rv;
      }
      var b = i * 4; idx.set([b, b + 1, b + 2, b + 2, b + 1, b + 3], i * 6);
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 4 * 3), 3));
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 3));
    g.setAttribute('corner', new THREE.BufferAttribute(corner, 2));
    g.setAttribute('rnd', new THREE.BufferAttribute(rnd, 1));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    var mat = new THREE.ShaderMaterial({
      uniforms: { uCam: { value: new THREE.Vector3() }, uDir: { value: new THREE.Vector3(0, 0, -1) }, uLen: { value: 10 }, uWarp: { value: 0 }, uBox: { value: 300 }, uWidth: { value: 1.3 }, uRes: { value: new THREE.Vector2(1, 1) } },
      vertexShader: [
        'attribute vec3 seed; attribute vec2 corner; attribute float rnd;',
        'uniform vec3 uCam; uniform vec3 uDir; uniform float uLen; uniform float uWarp; uniform float uBox; uniform float uWidth; uniform vec2 uRes;',
        'varying float vA; varying vec2 vC; varying float vT;',
        'void main(){',
        '  vec3 rel = mod(seed * 2.0 * uBox - uCam + uBox, 2.0 * uBox) - uBox;',
        '  vec3 head = uCam + rel;',
        '  float dist = length(rel);',
        '  vec3 tail = head + uDir * uLen * (0.45 + 0.55 * rnd);',
        '  vec4 ph = projectionMatrix * viewMatrix * vec4(head, 1.0);',
        '  vec4 pt = projectionMatrix * viewMatrix * vec4(tail, 1.0);',
        '  if (ph.w < 0.5 || pt.w < 0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; vC = vec2(0.0); vT = 0.0; return; }',
        '  vec2 sh = ph.xy / ph.w * uRes * 0.5; vec2 st = pt.xy / pt.w * uRes * 0.5;',
        '  vec2 d = st - sh; float len = length(d); vec2 dir = len > 0.001 ? d / len : vec2(1.0, 0.0);',
        '  vec2 side = vec2(-dir.y, dir.x);',
        '  vec2 p = mix(sh, st, corner.y) + side * corner.x * uWidth * (1.0 - 0.7 * corner.y);',
        '  float z = mix(ph.z / ph.w, pt.z / pt.w, corner.y);',
        '  gl_Position = vec4(p / (uRes * 0.5), z, 1.0);',
        '  vA = uWarp * (0.3 + 0.7 * rnd) * smoothstep(4.0, 35.0, dist) * (1.0 - smoothstep(uBox * 0.55, uBox * 0.98, dist));',
        '  vC = corner; vT = corner.y;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'precision highp float; varying float vA; varying vec2 vC; varying float vT;',
        'void main(){ float a = (1.0 - abs(vC.x)) * (1.0 - vT * 0.92) * vA;',
        ' vec3 c = mix(vec3(0.8, 0.9, 1.0), vec3(0.62, 0.74, 1.0), vT);',
        ' gl_FragColor = vec4(c * a, a); }'
      ].join('\n'),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false
    });
    var mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; mesh.renderOrder = 50; mesh.visible = false;
    mesh.userData.count = n;
    mesh.setCount = function (c) { g.setDrawRange(0, Math.min(n, c) * 6); };
    return mesh;
  };

  /* ================================================================== GALAXY */
  var GAL_R = 150;
  var ARMS = [ // log-spiral arms: phase phi (rad), weight, name. r = 40 * exp((theta - phi) * tan(pitch))
    { phi: -0.45, w: 1.0, name: 'scutum-centaurus' },
    { phi: -2.21, w: 0.55, name: 'sagittarius' },
    { phi: -4.5, w: 1.0, name: 'perseus' },
    { phi: -5.47, w: 0.5, name: 'outer' }
  ];
  var TANP = Math.tan(12 * DEG), BAR_ANGLE = 27 * DEG, BAR_LEN = 40;
  function armPoint(arm, theta) { var r = 40 * Math.exp((theta - arm.phi) * TANP); return { r: r, x: r * Math.cos(theta), z: r * Math.sin(theta) }; }
  // the Sun sits at angle 0, radius 82
  var SUN_POS = V(82, 0, 0);
  S.galaxyRadius = GAL_R;

  S.createGalaxy = function (q) {
    var group = new THREE.Group(), r = rand(31337), anchors = {};
    var N = q.galaxy, n = 0, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
    function add(x, y, z, cr, cg, cb, s) { pos[n * 3] = x; pos[n * 3 + 1] = y; pos[n * 3 + 2] = z; col[n * 3] = cr; col[n * 3 + 1] = cg; col[n * 3 + 2] = cb; size[n] = s; n++; }
    function gauss() { var u = 0; for (var i = 0; i < 4; i++) u += r(); return (u - 2) * 1.7; }
    function warpY(rad, th) { var k = U.smooth(70, 150, rad); return 22 * k * k * Math.sin(th - 0.4); }
    var nDisk = Math.floor(N * 0.62), nBulge = Math.floor(N * 0.12), nBar = Math.floor(N * 0.07), nHalo = Math.floor(N * 0.03);
    var i, k;
    // spiral arms + interarm disk
    for (i = 0; i < nDisk && n < N; i++) {
      var inArm = r() < 0.72, rad, th, thick;
      if (inArm) {
        var wsum = 0; for (k = 0; k < ARMS.length; k++) wsum += ARMS[k].w;
        var pick = r() * wsum, arm = ARMS[0]; for (k = 0; k < ARMS.length; k++) { pick -= ARMS[k].w; if (pick <= 0) { arm = ARMS[k]; break; } }
        rad = 40 + Math.pow(r(), 0.8) * 110;
        th = arm.phi + Math.log(rad / 40) / TANP + (r() < 0.5 ? 0 : 0); // angle on arm
        var spread = 3.5 + rad * 0.07;
        var ox = gauss() * spread, oz = gauss() * spread;
        var px = rad * Math.cos(th) + ox, pz = rad * Math.sin(th) + oz;
        rad = Math.sqrt(px * px + pz * pz); th = Math.atan2(pz, px);
        if (rad > GAL_R * (1 - 0.1 * r())) { i--; continue; }
        thick = 1.8 + 4.5 * Math.pow(rad / GAL_R, 2);
        var young = r() < 0.55;
        var br = (young ? 0.8 : 0.6) * (0.55 + 0.45 * r());
        if (r() < 0.012) add(px, gauss() * thick * 0.5, pz, 1.0, 0.45, 0.7, 2.6 + r() * 1.6); // star-forming (HII) regions
        else add(px, warpY(rad, th) + gauss() * thick, pz, young ? 0.62 * br + 0.2 : 0.95 * br, young ? 0.74 * br + 0.2 : 0.85 * br, young ? 1.0 * br + 0.1 : 0.62 * br, 0.55 + r() * 0.9);
      } else {
        rad = -34 * Math.log(1 - r() * 0.985) + 12; if (rad > GAL_R) { i--; continue; }
        th = r() * Math.PI * 2; thick = 1.8 + 4.5 * Math.pow(rad / GAL_R, 2);
        var b2 = 0.4 + 0.4 * r();
        add(rad * Math.cos(th), warpY(rad, th) + gauss() * thick, rad * Math.sin(th), 0.95 * b2, 0.82 * b2, 0.6 * b2, 0.5 + r() * 0.7);
      }
    }
    // bulge
    for (i = 0; i < nBulge && n < N; i++) {
      var bx = gauss() * 15, by = gauss() * 10, bz = gauss() * 15, bb = 0.55 + 0.45 * r();
      add(bx, by, bz, 1.0 * bb, 0.8 * bb, 0.5 * bb, 0.6 + r() * 0.9);
    }
    // bar
    var ca = Math.cos(BAR_ANGLE), sa = Math.sin(BAR_ANGLE);
    for (i = 0; i < nBar && n < N; i++) {
      var bl = gauss() * BAR_LEN * 0.55, bw = gauss() * 6.5, by2 = gauss() * 4.5, bb2 = 0.5 + 0.5 * r();
      if (Math.abs(bl) > BAR_LEN) { i--; continue; }
      add(bl * ca - bw * sa, by2, bl * sa + bw * ca, 1.0 * bb2, 0.82 * bb2, 0.52 * bb2, 0.6 + r() * 0.9);
    }
    // stellar halo (faint, old)
    for (i = 0; i < nHalo && n < N; i++) {
      var hr = 20 + Math.pow(r(), 1.7) * 190, hz = r() * 2 - 1, ha = r() * Math.PI * 2, hs = Math.sqrt(1 - hz * hz);
      add(hr * hs * Math.cos(ha), hr * hz, hr * hs * Math.sin(ha), 0.55, 0.5, 0.42, 0.45 + r() * 0.5);
    }
    // the Orion Spur: a short filament of stars near the Sun
    for (i = 0; i < 260 && n < N; i++) {
      var t = (r() - 0.5) * 0.6, sp = armPoint({ phi: -2.21 - 0.9, w: 1 }, 0 + t);
      var ox2 = 82 + (r() - 0.5) * 14 + t * 38, oz2 = t * 62 * 0.45 + gauss() * 1.6;
      add(ox2, gauss() * 1.2, oz2, 0.7, 0.8, 1.0, 0.7 + r() * 0.5);
    }
    var gg = new THREE.BufferGeometry(), ph = new Float32Array(n);
    for (i = 0; i < n; i++) ph[i] = r();
    gg.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, n * 3), 3));
    gg.setAttribute('aColor', new THREE.BufferAttribute(col.subarray(0, n * 3), 3));
    gg.setAttribute('aSize', new THREE.BufferAttribute(size.subarray(0, n), 1));
    gg.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    var starMat = pointsMaterial({ uMin: { value: 1.0 }, uMax: { value: 10 } });
    var stars = new THREE.Points(gg, starMat); stars.frustumCulled = false; group.add(stars);

    // soft disk haze (spiral structure painted into a texture)
    var HZ = 512, hc = document.createElement('canvas'); hc.width = hc.height = HZ;
    var hx = hc.getContext('2d'), him = hx.createImageData(HZ, HZ), hd = him.data;
    for (var yy = 0; yy < HZ; yy++) for (var xx = 0; xx < HZ; xx++) {
      var wx = (xx / HZ - 0.5) * 2 * GAL_R * 1.1, wz = (yy / HZ - 0.5) * 2 * GAL_R * 1.1, rr = Math.sqrt(wx * wx + wz * wz), tt = Math.atan2(wz, wx), val = 0;
      if (rr < GAL_R * 1.02) {
        for (k = 0; k < ARMS.length; k++) {
          var thA = ARMS[k].phi + Math.log(Math.max(rr, 1) / 40) / TANP; var dth = Math.atan2(Math.sin(tt - thA), Math.cos(tt - thA));
          var arcw = (6 + rr * 0.09) / Math.max(rr, 10);
          val += ARMS[k].w * Math.exp(-Math.pow(dth / arcw, 2)) * (rr > 36 ? 1 : rr / 36);
        }
        val *= 0.22 * Math.exp(-rr / 70) + 0.05;
        val += 0.16 * Math.exp(-rr / 38) + 0.55 * Math.exp(-Math.pow(rr / 14, 2));
        var bxr = wx * ca + wz * sa, bzr = -wx * sa + wz * ca;
        val += 0.28 * Math.exp(-Math.pow(bxr / (BAR_LEN * 0.8), 2) - Math.pow(bzr / 8, 2));
        val *= 0.85 + 0.3 * U.fbm(wx * 0.06, 0, wz * 0.06, 4, 19);
        val *= U.smooth(GAL_R * 1.02, GAL_R * 0.6, rr);
      }
      var cr = U.mix(0.45, 1.0, Math.exp(-rr / 30)), cg = U.mix(0.58, 0.8, Math.exp(-rr / 30)), cb = U.mix(1.0, 0.55, Math.exp(-rr / 30));
      var p2 = (yy * HZ + xx) * 4; hd[p2] = Math.min(255, val * cr * 255); hd[p2 + 1] = Math.min(255, val * cg * 255); hd[p2 + 2] = Math.min(255, val * cb * 255); hd[p2 + 3] = 255;
    }
    hx.putImageData(him, 0, 0);
    var haze = new THREE.Mesh(new THREE.PlaneGeometry(GAL_R * 2.2, GAL_R * 2.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hc), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.8, side: THREE.DoubleSide }));
    haze.rotation.x = -Math.PI / 2; group.add(haze);

    var core = sprite(0xffd9a0, 46, 0.95); group.add(core);
    var sgr = sprite(0xffffff, 3.2, 1); group.add(sgr);

    // the Sun's location ("You are here")
    var you = new THREE.Group(); you.position.copy(SUN_POS);
    var ring = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.9, 48), new THREE.MeshBasicMaterial({ color: 0x9ec8ff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; you.add(ring); you.add(sprite(0xfff2c0, 9, 1)); group.add(you);

    // Fermi bubbles (observed gamma-ray lobes; shown faintly)
    var lobeMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Vector3(0.55, 0.45, 1.0) }, uOp: { value: 0 } },
      vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }',
      fragmentShader: 'precision highp float; uniform vec3 uColor; uniform float uOp; varying vec3 vN; varying vec3 vP; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vP))), 2.2); gl_FragColor = vec4(uColor * f * uOp, f * uOp); }',
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    var lobeGeo = new THREE.SphereGeometry(1, 32, 24), lobes = [];
    [1, -1].forEach(function (sgn) { var l = new THREE.Mesh(lobeGeo, lobeMat); l.scale.set(22, 40, 22); l.position.set(0, sgn * 42, 0); group.add(l); lobes.push(l); });

    // halo components
    var gcN = 156, gcPos = new Float32Array(gcN * 3), gcCol = new Float32Array(gcN * 3), gcSize = new Float32Array(gcN);
    for (i = 0; i < gcN; i++) {
      var gr = 6 + 200 * Math.pow(r(), 2.2), gz = r() * 2 - 1, ga = r() * Math.PI * 2, gs = Math.sqrt(1 - gz * gz);
      gcPos[i * 3] = gr * gs * Math.cos(ga); gcPos[i * 3 + 1] = gr * gz * 0.95; gcPos[i * 3 + 2] = gr * gs * Math.sin(ga);
      gcCol[i * 3] = 1.0; gcCol[i * 3 + 1] = 0.88; gcCol[i * 3 + 2] = 0.55; gcSize[i] = 3.2 + r() * 3.2;
    }
    var gcMat = pointsMaterial({ uMin: { value: 2.2 }, uMax: { value: 14 }, uOpacity: { value: 0.25 } });
    var gcPoints = makePoints(gcPos, gcCol, gcSize, gcMat); group.add(gcPoints);

    var streamN = 900, sPos = new Float32Array(streamN * 3), sCol = new Float32Array(streamN * 3), sSize = new Float32Array(streamN);
    var tilt = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(1.25, 0.4, 0.2));
    for (i = 0; i < streamN; i++) {
      var ang = (i / streamN) * Math.PI * 1.55 - 0.3, rr2 = 118 + 22 * Math.sin(ang * 1.7) + gauss() * 1.8;
      var sp2 = V(rr2 * Math.cos(ang) + gauss() * 1.3, gauss() * 1.3, rr2 * Math.sin(ang) * 0.8 + gauss() * 1.3).applyMatrix4(tilt);
      sPos[i * 3] = sp2.x; sPos[i * 3 + 1] = sp2.y; sPos[i * 3 + 2] = sp2.z; sCol[i * 3] = 0.85; sCol[i * 3 + 1] = 0.82; sCol[i * 3 + 2] = 0.7; sSize[i] = 0.8 + r() * 0.8;
    }
    var streamMat = pointsMaterial({ uMin: { value: 1.2 }, uMax: { value: 6 }, uOpacity: { value: 0.1 } });
    var stream = makePoints(sPos, sCol, sSize, streamMat); group.add(stream);

    var dmMat = new THREE.ShaderMaterial({
      uniforms: { uOp: { value: 0 } },
      vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }',
      fragmentShader: 'precision highp float; uniform float uOp; varying vec3 vN; varying vec3 vP; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vP))), 2.5); vec3 c = vec3(0.45, 0.35, 0.95); gl_FragColor = vec4(c * f * uOp, f * uOp); }',
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    var dm = new THREE.Mesh(new THREE.SphereGeometry(235, 40, 28), dmMat); group.add(dm);

    // Magellanic Clouds (satellite galaxies, drawn schematically at their rough relative distance)
    var lmc = new THREE.Group(); lmc.position.set(-330, -200, 300);
    lmc.add(sprite(0xcfd8ff, 60, 0.6)); var lm2 = sprite(0xb8c6ff, 26, 0.7); lm2.position.set(8, 3, 0); lmc.add(lm2);
    var smc = new THREE.Group(); smc.position.set(-395, -250, 345); smc.add(sprite(0xcfd8ff, 30, 0.55));
    group.add(lmc); group.add(smc);

    // anchors for hotspots
    var tmp;
    anchors['orion-spur'] = SUN_POS.clone();
    tmp = armPoint(ARMS[2], 0.55); anchors['perseus-arm'] = V(tmp.x, 0, tmp.z);
    tmp = armPoint(ARMS[1], -0.7); anchors['sagittarius-arm'] = V(tmp.x, 0, tmp.z);
    tmp = armPoint(ARMS[0], 1.2); anchors['scutum-centaurus-arm'] = V(tmp.x, 0, tmp.z);
    anchors['sgr-a-star'] = V(0, 0, 0);
    anchors['galactic-bar'] = V(BAR_LEN * Math.cos(BAR_ANGLE), 0, BAR_LEN * Math.sin(BAR_ANGLE));
    anchors['nuclear-star-cluster'] = V(-7, 4, 8);
    anchors['fermi-bubbles'] = V(0, 52, 0);
    tmp = armPoint(ARMS[2], 1.55); var wy = warpY(Math.sqrt(tmp.x * tmp.x + tmp.z * tmp.z), 1.55);
    anchors['disk-warp'] = V(-128, 18, 62);
    anchors['outer-disk'] = V(-118, 0, -40);
    anchors['no-sharp-edge'] = V(-152, 0, 20);
    anchors['magellanic-clouds'] = lmc.position.clone();
    anchors['globular-clusters'] = V(gcPos[3 * 7], gcPos[3 * 7 + 1], gcPos[3 * 7 + 2]);
    anchors['stellar-streams'] = V(sPos[3 * 330], sPos[3 * 330 + 1], sPos[3 * 330 + 2]);
    anchors['dark-matter-halo'] = V(0, 150, -180);
    anchors['old-stars'] = V(gcPos[3 * 60] * 0.8, gcPos[3 * 60 + 1] * 0.8 + 20, gcPos[3 * 60 + 2] * 0.8);
    // a fixed, readable set of halo anchors that stay within the wide shot
    anchors['globular-clusters'] = V(96, 70, 100);
    anchors['stellar-streams'] = V(sPos[3 * 330], sPos[3 * 330 + 1], sPos[3 * 330 + 2]);
    anchors['old-stars'] = V(-60, 105, 60);

    var focus = 'none', fb = 0, hb = 0, gb = 0;
    return {
      group: group, anchors: anchors, radius: GAL_R, mats: [starMat, gcMat, streamMat],
      setFocus: function (id) { focus = id; },
      update: function (dt, t, ctx) {
        // slow rotation of the whole model
        group.rotation.y += dt * 0.004;
        var tf = focus === 'galactic-center' ? 0.2 : 0, th = focus === 'halo' || focus === 'finale' ? 1 : 0, tg = focus === 'halo' ? 1 : 0.0;
        fb += (tf - fb) * Math.min(1, dt * 2.5); hb += (th - hb) * Math.min(1, dt * 2.5); gb += (tg - gb) * Math.min(1, dt * 2.5);
        lobeMat.uniforms.uOp.value = fb; dmMat.uniforms.uOp.value = hb * 0.5 * (focus === 'finale' ? 0.2 : 1);
        gcMat.uniforms.uOpacity.value = 0.18 + 0.9 * gb; streamMat.uniforms.uOpacity.value = 0.1 + 0.9 * gb;
        you.visible = focus === 'spiral-arms' || focus === 'outer-milky-way' || focus === 'neighborhood';
        ring.scale.setScalar(1 + 0.12 * Math.sin(t * 2.2));
        sgr.material.opacity = focus === 'galactic-center' ? 1 : 0.5;
      },
      dispose: function () { gg.dispose(); haze.geometry.dispose(); haze.material.map.dispose(); haze.material.dispose(); starMat.dispose(); gcPoints.geometry.dispose(); stream.geometry.dispose(); lobeGeo.dispose(); }
    };
  };

  /* ============================================================ REGION SCENES */
  var REGIONS = {};
  S.regions = REGIONS;

  /* ---- Asteroid belt ---- */
  REGIONS['asteroid-belt'] = function (q, ctx) {
    var group = new THREE.Group(), anchors = {}, r = rand(404), ring = new THREE.Group();
    group.add(ring); ring.rotation.x = 0.1; group.rotation.z = 0.08;
    var n = Math.round(q.rocks * 1.7), geo = new THREE.IcosahedronGeometry(1, 1), p = geo.attributes.position, rr = rand(9);
    for (var i = 0; i < p.count; i++) { var f = 0.72 + 0.5 * U.vnoise(p.getX(i) * 2.1, p.getY(i) * 2.1, p.getZ(i) * 2.1, 3) + rr() * 0.05; p.setXYZ(i, p.getX(i) * f, p.getY(i) * f * 0.85, p.getZ(i) * f); }
    geo.computeVertexNormals();
    var mat = new THREE.MeshLambertMaterial({ color: 0xffffff }), mesh = new THREE.InstancedMesh(geo, mat, n);
    var m4 = new THREE.Matrix4(), qn = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), eu = new THREE.Euler(), col = new THREE.Color();
    var gaps = [[80, 2.2], [92, 1.7], [99, 1.4], [112, 2.0]], placed = 0, tries = 0;
    while (placed < n && tries < n * 6) {
      tries++;
      var rad = 64 + Math.pow(r(), 1.0) * 70, ok = true;
      for (var g = 0; g < gaps.length; g++) if (Math.abs(rad - gaps[g][0]) < gaps[g][1]) { ok = false; break; }
      if (!ok) continue;
      var th = r() * Math.PI * 2, sz = 0.45 + Math.pow(r(), 4) * 3.0;
      ps.set(rad * Math.cos(th), (r() + r() + r() - 1.5) * 4, rad * Math.sin(th));
      eu.set(r() * 6.28, r() * 6.28, r() * 6.28); qn.setFromEuler(eu); sc.set(sz, sz * (0.7 + 0.5 * r()), sz * (0.7 + 0.5 * r()));
      m4.compose(ps, qn, sc); mesh.setMatrixAt(placed, m4);
      var shade = 0.32 + 0.4 * r(), warm = r(); col.setRGB(shade * (0.95 + 0.1 * warm), shade * (0.88 + 0.08 * warm), shade * (0.8 - 0.05 * warm)); mesh.setColorAt(placed, col);
      placed++;
    }
    mesh.count = placed; mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; ring.add(mesh);
    var ceres = PL.create('ceres', { radius: 5.4, quality: q }), vesta = PL.create('vesta', { radius: 3.4, quality: q });
    ceres.group.position.set(100 * Math.cos(0.75), 0, 100 * Math.sin(0.75)); vesta.group.position.set(86 * Math.cos(2.35), 0, 86 * Math.sin(2.35));
    ring.add(ceres.group); ring.add(vesta.group);
    var sun = sprite(0xffd9a0, 26, 0.95); group.add(sun);
    anchors['ceres'] = ceres.group.position.clone().add(V(0, 7.5, 0)); anchors['vesta'] = vesta.group.position.clone().add(V(0, 5.5, 0));
    anchors['empty-space'] = V(118 * Math.cos(4.2), 0, 118 * Math.sin(4.2)); anchors['kirkwood-gaps'] = V(92 * Math.cos(5.4), 0, 92 * Math.sin(5.4));
    return {
      group: group, anchors: anchors, ring: ring, bodies: [ceres, vesta], radius: 135, mats: [],
      update: function (dt, t) { ring.rotation.y += dt * 0.012; ceres.update(dt, t); vesta.update(dt, t); },
      ensureTextures: function () { ceres.ensureTextures(); vesta.ensureTextures(); },
      dispose: function () { geo.dispose(); mat.dispose(); mesh.dispose(); ceres.dispose(); vesta.dispose(); }
    };
  };

  /* ---- Kuiper belt ---- */
  REGIONS['kuiper-belt'] = function (q) {
    var group = new THREE.Group(), anchors = {}, r = rand(505), ring = new THREE.Group();
    group.add(ring); ring.rotation.x = 0.12;
    var N = q.kuiper, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var rad = 85 + Math.pow(r(), 0.8) * 75 + (r() < 0.12 ? r() * 40 : 0), th = r() * Math.PI * 2, b = 0.35 + 0.65 * r();
      pos[i * 3] = rad * Math.cos(th); pos[i * 3 + 1] = (r() + r() - 1) * (6 + rad * 0.07); pos[i * 3 + 2] = rad * Math.sin(th);
      col[i * 3] = 0.75 * b; col[i * 3 + 1] = 0.88 * b; col[i * 3 + 2] = 1.0 * b; size[i] = 1.1 + Math.pow(r(), 3) * 2.8;
    }
    var mat = pointsMaterial({ uMin: { value: 1.6 }, uMax: { value: 8 }, uOpacity: { value: 1.0 } });
    ring.add(makePoints(pos, col, size, mat));
    var pluto = PL.create('pluto', { radius: 7, quality: q }), charon = PL.create('charon', { radius: 3.5, quality: q }), eris = PL.create('eris', { radius: 6, quality: q });
    var sys = new THREE.Group(); sys.position.set(84 * Math.cos(1.1), 4, 84 * Math.sin(1.1));
    sys.add(pluto.group); sys.add(charon.group); ring.add(sys);
    eris.group.position.set(150 * Math.cos(3.9), 12, 150 * Math.sin(3.9)); ring.add(eris.group);
    var ark = new THREE.Group(), amat = new THREE.MeshLambertMaterial({ color: 0xb06b4e }), ageo = new THREE.SphereGeometry(1, 16, 12);
    var a1 = new THREE.Mesh(ageo, amat), a2 = new THREE.Mesh(ageo, amat); a1.scale.set(2.3, 1.7, 1.7); a2.scale.set(1.7, 1.2, 1.2); a2.position.set(2.7, 0.2, 0); ark.add(a1); ark.add(a2);
    ark.position.set(120 * Math.cos(5.3), -3, 120 * Math.sin(5.3)); ring.add(ark);
    var sun = sprite(0xffe9c0, 14, 0.9); group.add(sun);
    var phase = 0;
    anchors['pluto'] = V(0, 0, 0); anchors['charon'] = V(0, 0, 0); anchors['eris'] = eris.group.position.clone().add(V(0, 8, 0)); anchors['arrokoth'] = ark.position.clone().add(V(0, 4, 0));
    function updateAnchors() {
      ring.updateMatrixWorld(true); // anchors are given in `group` space
      var a = pluto.group.getWorldPosition(V(0, 0, 0)); group.worldToLocal(a); anchors['pluto'].copy(a).add(V(0, 9.5, 0));
      var c = charon.group.getWorldPosition(V(0, 0, 0)); group.worldToLocal(c); anchors['charon'].copy(c).add(V(0, 6, 0));
    }
    return {
      group: group, anchors: anchors, ring: ring, bodies: [pluto, charon, eris], radius: 160, mats: [mat],
      update: function (dt, t) {
        ring.rotation.y += dt * 0.008; phase += dt * 0.18;
        pluto.group.position.set(-3.2 * Math.cos(phase), 0, -3.2 * Math.sin(phase)); charon.group.position.set(14.5 * Math.cos(phase), 0, 14.5 * Math.sin(phase));
        pluto.update(dt, t); charon.update(dt, t); eris.update(dt, t); ark.rotation.y += dt * 0.3; updateAnchors();
      },
      ensureTextures: function () { pluto.ensureTextures(); charon.ensureTextures(); eris.ensureTextures(); },
      dispose: function () { pluto.dispose(); charon.dispose(); eris.dispose(); ageo.dispose(); amat.dispose(); mat.dispose(); }
    };
  };

  /* ---- Oort cloud (hypothesized) ---- */
  REGIONS['oort-cloud'] = function (q) {
    var group = new THREE.Group(), anchors = {}, r = rand(606), mats = [];
    var Nout = Math.round(q.kuiper * 0.7), pos = new Float32Array(Nout * 3), col = new Float32Array(Nout * 3), size = new Float32Array(Nout);
    for (var i = 0; i < Nout; i++) {
      var rad = 88 + r() * 46, z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z), b = 0.3 + 0.5 * r();
      pos[i * 3] = rad * s * Math.cos(a); pos[i * 3 + 1] = rad * z; pos[i * 3 + 2] = rad * s * Math.sin(a);
      col[i * 3] = 0.65 * b; col[i * 3 + 1] = 0.8 * b; col[i * 3 + 2] = 1.0 * b; size[i] = 1.8 + r() * 2.4;
    }
    var m1 = pointsMaterial({ uMin: { value: 1.6 }, uMax: { value: 8 }, uOpacity: { value: 1 } }); mats.push(m1); group.add(makePoints(pos, col, size, m1));
    var Nin = Math.round(Nout * 0.55), p2 = new Float32Array(Nin * 3), c2 = new Float32Array(Nin * 3), s2 = new Float32Array(Nin);
    for (i = 0; i < Nin; i++) {
      var rr = 22 + Math.pow(r(), 0.8) * 30, th = r() * Math.PI * 2, yv = (r() + r() + r() - 1.5) * 9 * (0.6 + rr / 50), bb = 0.4 + 0.6 * r();
      p2[i * 3] = rr * Math.cos(th); p2[i * 3 + 1] = yv; p2[i * 3 + 2] = rr * Math.sin(th); c2[i * 3] = 0.8 * bb; c2[i * 3 + 1] = 0.88 * bb; c2[i * 3 + 2] = bb; s2[i] = 1.2 + r() * 1.6;
    }
    var m2 = pointsMaterial({ uMin: { value: 1.5 }, uMax: { value: 7 }, uOpacity: { value: 1 } }); mats.push(m2); group.add(makePoints(p2, c2, s2, m2));
    group.add(sprite(0xffe2a8, 16, 1)); // the Sun
    var veil = new THREE.Mesh(new THREE.SphereGeometry(116, 40, 28), new THREE.ShaderMaterial({ uniforms: { uOp: { value: 0.16 } }, vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }', fragmentShader: 'precision highp float; uniform float uOp; varying vec3 vN; varying vec3 vP; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vP))), 2.0); gl_FragColor = vec4(vec3(0.5, 0.65, 1.0) * f * uOp, f * uOp); }', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); group.add(veil);
    // planetary region for scale: a very small disc
    var disc = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.8, 48), new THREE.MeshBasicMaterial({ color: 0x7fa6ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })); disc.rotation.x = -Math.PI / 2; group.add(disc);
    // a comet falling in along an elongated orbit
    var comet = sprite(0xcfe6ff, 7, 1), tailGeo = new THREE.BufferGeometry(); tailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    var tail = new THREE.Line(tailGeo, new THREE.LineBasicMaterial({ color: 0x9fc4ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(comet); group.add(tail);
    var cp = 0, dirV = V(0.55, 0.2, -0.8).normalize();
    anchors['inner-oort-cloud'] = V(34, 8, 22); anchors['outer-oort-cloud'] = V(-80, 38, 62); anchors['long-period-comets'] = V(0, 0, 0); anchors['sun-from-here'] = V(0, 0, 0);
    return {
      group: group, anchors: anchors, radius: 135, mats: mats,
      update: function (dt, t) {
        group.rotation.y += dt * 0.006; cp += dt * 0.035; if (cp > 1) cp = 0;
        var d = 120 * (1 - cp) * (1 - cp) + 4; comet.position.copy(dirV).multiplyScalar(d); comet.position.y += 6 * (1 - cp);
        var tl = Math.min(40, 3 + 200 / d), tp = tailGeo.attributes.position, tv = comet.position.clone().normalize().multiplyScalar(tl);
        tp.setXYZ(0, comet.position.x, comet.position.y, comet.position.z); tp.setXYZ(1, comet.position.x + tv.x, comet.position.y + tv.y, comet.position.z + tv.z); tp.needsUpdate = true;
        anchors['long-period-comets'].copy(comet.position).add(V(0, 4, 0));
      },
      dispose: function () { m1.dispose(); m2.dispose(); tailGeo.dispose(); }
    };
  };

  /* ---- Heliosphere ---- */
  REGIONS['heliosphere'] = function (q) {
    var group = new THREE.Group(), anchors = {}, r = rand(707), mats = [];
    var tail = V(1, 0, 0);
    function deform(geo, R) {
      var p = geo.attributes.position, v = V(0, 0, 0);
      for (var i = 0; i < p.count; i++) {
        v.set(p.getX(i), p.getY(i), p.getZ(i)).normalize();
        var d = v.dot(tail), k = R * (0.86 + 0.7 * U.smooth(-1, 1, d)) * (1 - 0.1 * Math.pow(Math.abs(v.y), 2));
        p.setXYZ(i, v.x * k, v.y * k * 0.92, v.z * k);
      }
      geo.computeVertexNormals();
    }
    function shell(R, color, op, pow) {
      var g = new THREE.SphereGeometry(1, 64, 48); deform(g, R);
      return new THREE.Mesh(g, new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Vector3().fromArray(color) }, uOp: { value: op }, uPow: { value: pow } },
        vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }',
        fragmentShader: 'precision highp float; uniform vec3 uColor; uniform float uOp; uniform float uPow; varying vec3 vN; varying vec3 vP; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vP))), uPow); gl_FragColor = vec4(uColor * f * uOp, f * uOp); }',
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      }));
    }
    var ts = shell(48, [0.55, 0.75, 1.0], 0.9, 2.0), hp = shell(84, [0.5, 0.95, 0.95], 1.15, 2.6);
    group.add(ts); group.add(hp);
    var inner = shell(66, [0.4, 0.5, 1.0], 0.22, 1.2); group.add(inner); // the heliosheath volume
    group.add(sprite(0xffe2a8, 22, 1));
    // Neptune orbit for scale (30 AU ~ 21 units)
    var oc = new THREE.RingGeometry(20.6, 21.0, 96), orb = new THREE.Mesh(oc, new THREE.MeshBasicMaterial({ color: 0x6f95ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })); orb.rotation.x = -Math.PI / 2; group.add(orb);
    // solar wind (outward) and interstellar wind (deflected around the bubble)
    var Nw = Math.round(q.kuiper * 0.25), wp = new Float32Array(Nw * 3), wc = new Float32Array(Nw * 3), ws = new Float32Array(Nw), wv = [];
    function resetW(i) { var z = r() * 2 - 1, a = r() * 6.283, s = Math.sqrt(1 - z * z), rad = 4 + r() * 40; wp[i * 3] = rad * s * Math.cos(a); wp[i * 3 + 1] = rad * z; wp[i * 3 + 2] = rad * s * Math.sin(a); }
    for (var i = 0; i < Nw; i++) { resetW(i); wc[i * 3] = 1.0; wc[i * 3 + 1] = 0.85; wc[i * 3 + 2] = 0.55; ws[i] = 0.5 + r() * 0.5; }
    var wm = pointsMaterial({ uMin: { value: 1 }, uMax: { value: 4 }, uOpacity: { value: 0.75 } }); mats.push(wm);
    var wpts = makePoints(wp, wc, ws, wm); group.add(wpts);
    var Ni = Math.round(q.kuiper * 0.3), ip = new Float32Array(Ni * 3), ic = new Float32Array(Ni * 3), is = new Float32Array(Ni);
    function resetI(j, spread) { ip[j * 3] = -230 - (spread ? r() * 420 : 0); ip[j * 3 + 1] = (r() * 2 - 1) * 150; ip[j * 3 + 2] = (r() * 2 - 1) * 150; }
    for (i = 0; i < Ni; i++) { resetI(i, true); ic[i * 3] = 0.45; ic[i * 3 + 1] = 0.6; ic[i * 3 + 2] = 1.0; is[i] = 0.6 + r() * 0.6; }
    var im = pointsMaterial({ uMin: { value: 1 }, uMax: { value: 4 }, uOpacity: { value: 0.65 } }); mats.push(im);
    var ipts = makePoints(ip, ic, is, im); group.add(ipts);
    // Voyager trajectories
    function voyager(dir, dist, hex) {
      var d = dir.clone().normalize(), end = d.clone().multiplyScalar(dist), g = new THREE.BufferGeometry();
      var pts = []; for (var k = 0; k <= 40; k++) { var u = k / 40; pts.push(d.x * dist * u + 0.0, d.y * dist * u + Math.sin(u * 3.14) * 3, d.z * dist * u); }
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
      var l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
      var m = sprite(hex, 6, 1); m.position.copy(end); group.add(l); group.add(m); return end;
    }
    var v1 = voyager(V(-0.55, 0.45, 0.7), 84.7 * (0.86 + 0.7 * 0.28), 0xffe6a0), v2 = voyager(V(-0.35, -0.5, 0.78), 83.2 * 0.95, 0xa8d4ff);
    anchors['termination-shock'] = V(-0.62 * 44, 0.25 * 44, 0.74 * 44); anchors['heliosheath'] = V(-0.5 * 74, 0.5 * 74, 0.7 * 74); anchors['heliopause'] = V(0.3 * 112, 0.2 * 112, 0.93 * 112); anchors['voyagers'] = v1.clone();
    var tmpv = V(0, 0, 0);
    return {
      group: group, anchors: anchors, radius: 150, mats: mats,
      update: function (dt, t) {
        var k, x, y, z, rr, a3, vx, vy, vz;
        for (k = 0; k < Nw; k++) {
          x = wp[k * 3]; y = wp[k * 3 + 1]; z = wp[k * 3 + 2]; rr = Math.sqrt(x * x + y * y + z * z) || 1;
          var sp = (14 + 8 * ws[k]) * dt; wp[k * 3] += x / rr * sp; wp[k * 3 + 1] += y / rr * sp; wp[k * 3 + 2] += z / rr * sp;
          var lim = 46 * (0.86 + 0.7 * U.smooth(-1, 1, x / rr)); if (rr > lim) resetW(k);
        }
        wpts.geometry.attributes.position.needsUpdate = true;
        var a = 92, A3 = a * a * a, Uv = 38;
        for (k = 0; k < Ni; k++) {
          x = ip[k * 3] + 0; y = ip[k * 3 + 1]; z = ip[k * 3 + 2]; rr = Math.sqrt(x * x + y * y + z * z) || 1; a3 = A3 / (2 * rr * rr * rr);
          vx = Uv * (1 + a3 - 3 * A3 * x * x / (2 * Math.pow(rr, 5))); vy = Uv * (-3 * A3 * x * y / (2 * Math.pow(rr, 5))); vz = Uv * (-3 * A3 * x * z / (2 * Math.pow(rr, 5)));
          if (rr < a * 0.98) { vx = vy = vz = 0; resetI(k, false); }
          ip[k * 3] += vx * dt; ip[k * 3 + 1] += vy * dt; ip[k * 3 + 2] += vz * dt;
          if (ip[k * 3] > 260) resetI(k, false);
        }
        ipts.geometry.attributes.position.needsUpdate = true;
      },
      dispose: function () { ts.geometry.dispose(); hp.geometry.dispose(); inner.geometry.dispose(); wm.dispose(); im.dispose(); }
    };
  };

  /* ---- Interstellar space ---- */
  REGIONS['interstellar'] = function (q) {
    var group = new THREE.Group(), anchors = {}, r = rand(808), mats = [], clouds = [];
    var cols = [0x6a58c8, 0x3f6fd0, 0x9a4aa8, 0x4a5aa8, 0xb86a48];
    var nC = q.dust;
    for (var i = 0; i < nC; i++) {
      var z = r() * 2 - 1, a = r() * 6.283, s = Math.sqrt(1 - z * z), rad = 25 + r() * 190;
      var sp = sprite(cols[Math.floor(r() * cols.length)], 60 + r() * 130, 0.09 + r() * 0.14);
      sp.position.set(rad * s * Math.cos(a), rad * z * 0.7, rad * s * Math.sin(a)); sp.userData.base = sp.material.opacity; sp.userData.ph = r() * 6; group.add(sp); clouds.push(sp);
    }
    var local = sprite(0xa8c4ff, 150, 0.2); group.add(local);
    var N = q.kuiper, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
    for (i = 0; i < N; i++) {
      var rr = 10 + r() * 230, zz = r() * 2 - 1, aa = r() * 6.283, ss = Math.sqrt(1 - zz * zz), b = 0.25 + 0.6 * r();
      pos[i * 3] = rr * ss * Math.cos(aa); pos[i * 3 + 1] = rr * zz * 0.7; pos[i * 3 + 2] = rr * ss * Math.sin(aa);
      col[i * 3] = 0.8 * b; col[i * 3 + 1] = 0.75 * b; col[i * 3 + 2] = 1.0 * b; size[i] = 0.35 + Math.pow(r(), 4) * 1.4;
    }
    var m = pointsMaterial({ uMin: { value: 1 }, uMax: { value: 5 }, uOpacity: { value: 0.85 } }); mats.push(m); group.add(makePoints(pos, col, size, m));
    // magnetic field lines (schematic)
    var lines = [];
    for (i = 0; i < 9; i++) {
      var pts = [], y0 = (r() - 0.5) * 120, z0 = (r() - 0.5) * 160, ph = r() * 6, amp = 8 + r() * 14;
      for (var k = 0; k <= 60; k++) { var u = k / 60; pts.push(-210 + u * 420, y0 + Math.sin(u * 9 + ph) * amp, z0 + Math.cos(u * 6 + ph) * amp * 1.4); }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
      var l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x66ccee, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })); group.add(l); lines.push(l);
    }
    // cosmic rays: fast thin streaks
    var rays = [], rg = new THREE.BufferGeometry(), nR = 36, rp = new Float32Array(nR * 6), rv = [];
    for (i = 0; i < nR; i++) { rv.push(V(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(120 + r() * 100)); rp[i * 6] = (r() - 0.5) * 300; rp[i * 6 + 1] = (r() - 0.5) * 200; rp[i * 6 + 2] = (r() - 0.5) * 300; }
    rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
    var rlines = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })); group.add(rlines);
    anchors['local-interstellar-cloud'] = V(0, 0, 0); anchors['dust-grains'] = clouds[2] ? clouds[2].position.clone() : V(60, 20, -30);
    anchors['magnetic-fields'] = V(-20, lines[0].geometry.attributes.position.getY(30), lines[0].geometry.attributes.position.getZ(30)); anchors['cosmic-rays'] = V(0, 0, 0);
    return {
      group: group, anchors: anchors, radius: 200, mats: mats,
      update: function (dt, t) {
        for (var k = 0; k < clouds.length; k++) clouds[k].material.opacity = clouds[k].userData.base * (0.85 + 0.15 * Math.sin(t * 0.3 + clouds[k].userData.ph));
        for (k = 0; k < nR; k++) {
          var p0 = k * 6, vx = rv[k].x * dt, vy = rv[k].y * dt, vz = rv[k].z * dt;
          rp[p0] += vx; rp[p0 + 1] += vy; rp[p0 + 2] += vz; rp[p0 + 3] = rp[p0] - rv[k].x * 0.035; rp[p0 + 4] = rp[p0 + 1] - rv[k].y * 0.035; rp[p0 + 5] = rp[p0 + 2] - rv[k].z * 0.035;
          if (Math.abs(rp[p0]) > 230 || Math.abs(rp[p0 + 1]) > 160 || Math.abs(rp[p0 + 2]) > 230) { rp[p0] = (r() - 0.5) * 200; rp[p0 + 1] = (r() - 0.5) * 140; rp[p0 + 2] = (r() - 0.5) * 200; }
        }
        rg.attributes.position.needsUpdate = true;
        anchors['cosmic-rays'].set(rp[0], rp[1], rp[2]);
      },
      dispose: function () { m.dispose(); rg.dispose(); }
    };
  };

  /* ---- Our stellar neighbourhood (positions from real RA / Dec / distance) ---- */
  REGIONS['neighborhood'] = function (q) {
    var group = new THREE.Group(), anchors = {}, r = rand(909), SC = 12; // 12 units per light-year
    function eq(raDeg, decDeg, ly) { var a = raDeg * DEG, d = decDeg * DEG; return V(ly * SC * Math.cos(d) * Math.cos(a), ly * SC * Math.sin(d), -ly * SC * Math.cos(d) * Math.sin(a)); }
    var named = [
      ['alpha-centauri', 219.9, -60.83, 4.37, 0xffe2a0, 16], ['barnards-star', 269.45, 4.69, 5.96, 0xff7a55, 9], ['sirius', 101.29, -16.72, 8.60, 0xcfe0ff, 26],
      ['epsilon-eridani', 53.23, -9.46, 10.47, 0xffb070, 13], ['tau-ceti', 26.02, -15.94, 11.91, 0xffd890, 13]
    ];
    group.add(sprite(0xfff0c0, 22, 1)); // the Sun
    named.forEach(function (n) {
      var p = eq(n[1], n[2], n[3]); var s = sprite(n[4], n[5], 1); s.position.copy(p); group.add(s); anchors[n[0]] = p.clone().add(V(0, 7, 0));
      var lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, p.x, p.y, p.z]), 3));
      group.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0x7fa6ff, transparent: true, opacity: 0.22, depthWrite: false })));
    });
    var prox = sprite(0xff6a4a, 6, 1); prox.position.copy(eq(217.4, -62.68, 4.24)); group.add(prox);
    var sirB = sprite(0xffffff, 5, 0.9); sirB.position.copy(eq(101.29, -16.72, 8.60)).add(V(5, 3, 0)); group.add(sirB);
    [5, 10].forEach(function (ly) {
      var rg = new THREE.RingGeometry(ly * SC - 0.25, ly * SC + 0.25, 128), m = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color: 0x6f95ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      m.rotation.x = -Math.PI / 2; group.add(m);
    });
    var N = 260, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var rad = SC * 14 * Math.cbrt(r()), z = r() * 2 - 1, a = r() * 6.283, s = Math.sqrt(1 - z * z), t = r();
      pos[i * 3] = rad * s * Math.cos(a); pos[i * 3 + 1] = rad * z; pos[i * 3 + 2] = rad * s * Math.sin(a);
      var c = t < 0.72 ? [1.0, 0.45, 0.3] : t < 0.88 ? [1.0, 0.7, 0.4] : t < 0.96 ? [1.0, 0.92, 0.7] : [0.8, 0.88, 1.0];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; size[i] = 1.2 + r() * 2.2;
    }
    var m = pointsMaterial({ uMin: { value: 1.6 }, uMax: { value: 9 }, uOpacity: { value: 0.9 } });
    group.add(makePoints(pos, col, size, m));
    return { group: group, anchors: anchors, radius: 160, mats: [m], update: function (dt, t) { group.rotation.y += dt * 0.005; }, dispose: function () { m.dispose(); } };
  };
})(window);
