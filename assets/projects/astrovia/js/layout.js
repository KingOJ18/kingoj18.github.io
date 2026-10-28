/* ==========================================================================
   ASTROVIA — layout.js
   Where each object lives in the 3D world and where the camera sits at each
   stop. Distances are COMPRESSED for storytelling (see hop captions in
   data/route.js): this is not a scale model.

   To add a destination: add its object below and a stop in data/route.js.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  var THREE = global.THREE;
  var DEG = Math.PI / 180;

  /* kind: 'sphere' (procedural planet) | 'region' (a scenery builder) | 'galaxy'
     R: visual radius.  dist: camera distance in world units (spheres: R * factor).  */
  var OBJECTS = [
    { key: 'earth',   kind: 'sphere', R: 10, f: 4.4 },
    { key: 'moon',    kind: 'sphere', R: 3.6, f: 4.4 },
    { key: 'sun',     kind: 'sphere', R: 24, f: 4.0 },
    { key: 'mercury', kind: 'sphere', R: 3.4, f: 4.4 },
    { key: 'venus',   kind: 'sphere', R: 9, f: 4.4 },
    { key: 'mars',    kind: 'sphere', R: 5.4, f: 4.4 },
    { key: 'jupiter', kind: 'sphere', R: 22, f: 4.6 },
    { key: 'saturn',  kind: 'sphere', R: 15, f: 6.1 },
    { key: 'uranus',  kind: 'sphere', R: 10, f: 5.4 },
    { key: 'neptune', kind: 'sphere', R: 10, f: 4.5 },
    { key: 'asteroid-belt', kind: 'region', R: 135, dist: 205, az: -10, el: 21, look: [0, -4, 18] },
    { key: 'kuiper-belt',   kind: 'region', R: 160, dist: 230, az: 9, el: 23, look: [0, 0, 18] },
    { key: 'oort-cloud',    kind: 'region', R: 135, dist: 280, az: -14, el: 17, look: [0, 0, 0] },
    { key: 'heliosphere',   kind: 'region', R: 150, dist: 345, az: 12, el: 15, look: [18, 0, 0] },
    { key: 'interstellar',  kind: 'region', R: 200, dist: 150, az: -8, el: 8, look: [0, 0, 0] },
    { key: 'neighborhood',  kind: 'region', R: 170, dist: 335, az: 14, el: 27, look: [0, -6, 0] },
    { key: 'galaxy',        kind: 'galaxy', R: 150, dist: 420 }
  ];

  /* Which object each stop shows, plus a camera pose. For spheres the pose is
     an orbit around the body: az (degrees, +right), el (degrees), distance factor. */
  var SPHERE_AZ = 30, SPHERE_EL = 7;
  var SPHERE_X = { earth: 0, moon: -34, sun: 34, mercury: -22, venus: 26, mars: -26, jupiter: 40, saturn: -36, uranus: 28, neptune: -24 };
  /* Galaxy poses are RELATIVE to the galaxy centre: eye and look vectors. */
  var GAL = {
    'spiral-arms':     { eye: [-26, 212, 186], look: [24, 0, 4] },
    'galactic-center': { eye: [58, 34, 80],    look: [0, 0, 0] },
    'outer-milky-way': { eye: [-205, 42, 118], look: [-92, 2, 12] },
    'halo':            { eye: [10, 150, 470],  look: [0, 0, 0] },
    'finale':          { eye: [0, 245, 585],   look: [0, -6, 0] }
  };

  function build(route) {
    var objs = {}, order = [], z = 0, prev = null;
    OBJECTS.forEach(function (o, i) {
      var d = o.kind === 'sphere' ? o.R * o.f : o.dist;
      o = Object.assign({}, o, { dist: d, index: i });
      var gap = prev ? (o.kind === 'galaxy' ? 2600 : 0.9 * (prev.dist + o.dist) + 130) : 0;
      z -= gap;
      var wob = o.kind === 'sphere' ? (i % 2 ? 6 : -6) : 0;
      o.pos = new THREE.Vector3(SPHERE_X[o.key] || 0, wob, z);
      objs[o.key] = o; order.push(o); prev = o;
    });

    var stops = [], sphereCount = 0;
    route.stops.forEach(function (s, i) {
      var key = s.type === 'intro' ? 'earth' : s.type === 'finale' ? 'galaxy' : (GAL[s.id] ? 'galaxy' : s.id);
      var o = objs[key], eye, look, kind = o.kind, zoom;
      if (s.type === 'intro') {
        var d = o.R * 2.7, az = -14 * DEG, el = 9 * DEG;
        eye = o.pos.clone().add(new THREE.Vector3(d * Math.sin(az) * Math.cos(el), d * Math.sin(el), d * Math.cos(az) * Math.cos(el)));
        look = o.pos.clone(); zoom = [1, 1];
      } else if (o.kind === 'galaxy') {
        var g = GAL[s.id];
        eye = o.pos.clone().add(new THREE.Vector3(g.eye[0], g.eye[1], g.eye[2])); look = o.pos.clone().add(new THREE.Vector3(g.look[0], g.look[1], g.look[2]));
        zoom = s.type === 'finale' ? [0.8, 1.15] : [0.5, 1.25];
      } else if (o.kind === 'sphere') {
        var sgn = (sphereCount++ % 2) ? -1 : 1, a = sgn * SPHERE_AZ * DEG, e = SPHERE_EL * DEG;
        if (s.id === 'earth') { a = 18 * DEG; e = 8 * DEG; }
        eye = o.pos.clone().add(new THREE.Vector3(o.dist * Math.sin(a) * Math.cos(e), o.dist * Math.sin(e), o.dist * Math.cos(a) * Math.cos(e)));
        look = o.pos.clone(); zoom = [0.42, 1.3];
      } else {
        var ra = o.az * DEG, re = o.el * DEG;
        eye = o.pos.clone().add(new THREE.Vector3(o.dist * Math.sin(ra) * Math.cos(re), o.dist * Math.sin(re), o.dist * Math.cos(ra) * Math.cos(re)));
        look = o.pos.clone().add(new THREE.Vector3(o.look[0], o.look[1], o.look[2])); zoom = [0.5, 1.25];
      }
      stops.push({ index: i, id: s.id, type: s.type, obj: key, kind: kind, eye: eye, look: look, zoom: zoom, inspect: kind === 'galaxy' ? 0.62 : 0.68, center: o.pos.clone() });
    });
    return { objects: objs, order: order, stops: stops };
  }

  A.layout = { build: build, OBJECTS: OBJECTS, GAL: GAL };
})(window);
