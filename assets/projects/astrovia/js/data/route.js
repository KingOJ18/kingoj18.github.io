/* ==========================================================================
   ASTROVIA — data/route.js
   The shape of the journey: stages, the ordered list of stops, and the short
   captions shown while travelling between them.

   To add a destination: add a stop here, add its content to a
   js/data/destinations-*.js file, and (for 3D) a scene entry in js/layout.js.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});

  var stages = [
    { id: 'home',   number: 1, name: 'Our Home',          quizId: 'home',
      blurb: 'Begin on Earth and visit our nearest neighbour, the Moon.' },
    { id: 'solar',  number: 2, name: 'The Solar System',  quizId: 'solar',
      blurb: 'Meet the Sun and the eight planets that orbit it.' },
    { id: 'beyond', number: 3, name: 'Beyond the Planets', quizId: 'beyond',
      blurb: 'Small icy and rocky worlds, the Sun’s wind bubble, and the edge of its influence.' },
    { id: 'galaxy', number: 4, name: 'The Milky Way',     quizId: 'galaxy',
      blurb: 'Leave the Solar System and explore the galaxy that contains it.' }
  ];

  /* swatch = [highlight, mid, shadow] colours used for CSS-drawn planet icons
     (navigator thumbnails and the no-3D fallback gallery).
     kind: 'sphere'  - a round body with a surface you can rotate and inspect
           'region'  - a region of space (belts, clouds, the galaxy)           */
  var stops = [
    { id: 'intro',           type: 'intro',  stage: null,     kind: 'sphere', swatch: ['#8fc3ff', '#2b6fb8', '#0b2447'] },
    { id: 'earth',           type: 'dest',   stage: 'home',   kind: 'sphere', swatch: ['#8fc3ff', '#2b6fb8', '#0b2447'] },
    { id: 'moon',            type: 'dest',   stage: 'home',   kind: 'sphere', swatch: ['#d8d8d8', '#8b8b8b', '#2e2e2e'] },
    { id: 'sun',             type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#fff6c8', '#ffb830', '#c4500a'] },
    { id: 'mercury',         type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#c9c2b8', '#8a8178', '#38332e'] },
    { id: 'venus',           type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#f6e3b4', '#d8a95a', '#6b4720'] },
    { id: 'mars',            type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#e9a77a', '#b3522d', '#4a1c10'] },
    { id: 'jupiter',         type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#f1d9b9', '#c48f5f', '#5c3b27'] },
    { id: 'saturn',          type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#f3e3b2', '#d1b072', '#6e5a33'], ring: true },
    { id: 'uranus',          type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#d3f3f6', '#8ed0d8', '#2f6f7a'] },
    { id: 'neptune',         type: 'dest',   stage: 'solar',  kind: 'sphere', swatch: ['#8fb4ff', '#3b5fd0', '#101f5e'] },
    { id: 'asteroid-belt',   type: 'dest',   stage: 'beyond', kind: 'region', swatch: ['#b5aa9c', '#7a7066', '#2b2621'] },
    { id: 'kuiper-belt',     type: 'dest',   stage: 'beyond', kind: 'region', swatch: ['#d9e6ee', '#8aa0b3', '#27323d'] },
    { id: 'oort-cloud',      type: 'dest',   stage: 'beyond', kind: 'region', swatch: ['#cfe3ff', '#6f8fbf', '#1b2740'] },
    { id: 'heliosphere',     type: 'dest',   stage: 'beyond', kind: 'region', swatch: ['#bcd7ff', '#4d7fe0', '#14234d'] },
    { id: 'interstellar',    type: 'dest',   stage: 'beyond', kind: 'region', swatch: ['#c4b5ff', '#5a4aa8', '#161235'] },
    { id: 'neighborhood',    type: 'dest',   stage: 'galaxy', kind: 'region', swatch: ['#fff2d6', '#d9b878', '#3a2f1c'] },
    { id: 'spiral-arms',     type: 'dest',   stage: 'galaxy', kind: 'region', swatch: ['#d8e4ff', '#6a8de8', '#1b2352'] },
    { id: 'galactic-center', type: 'dest',   stage: 'galaxy', kind: 'region', swatch: ['#ffe9b8', '#e9a23b', '#4a2a0c'] },
    { id: 'outer-milky-way', type: 'dest',   stage: 'galaxy', kind: 'region', swatch: ['#cdd8ff', '#7088d8', '#1c2250'] },
    { id: 'halo',            type: 'dest',   stage: 'galaxy', kind: 'region', swatch: ['#e8d8ff', '#8a6fd6', '#241a4d'] },
    { id: 'finale',          type: 'finale', stage: null,     kind: 'region', swatch: ['#d8e4ff', '#6a8de8', '#1b2352'] }
  ];

  /* Display names for the two stops that have no destination content. */
  var specialNames = {
    intro:  { name: 'Earth — Departure', short: 'Start' },
    finale: { name: 'The Milky Way — Wide View', short: 'Finale' }
  };

  /* hops[i] describes the trip from stops[i] to stops[i + 1].
     kind: 'real'       the distance quoted is real and the hop is not misleading
           'compressed' the visual trip is far shorter than reality
           'scale-jump' the scale of the picture changes dramatically
           'route-note' the route order differs from physical order, explained   */
  var hops = [
    { kind: 'none', text: '' },
    { kind: 'real', text: 'Earth to Moon: about 384,400 km on average. Light takes roughly 1.3 seconds to cross it.' },
    { kind: 'compressed', text: 'Compressed: the Sun is about 150 million km (1 AU) away — roughly 390 times farther than the Moon. Sunlight takes 8 minutes 20 seconds to reach Earth.' },
    { kind: 'compressed', text: 'Mercury orbits the Sun at about 58 million km (0.39 AU) on average. Sizes and spacing in this tour are not to scale.' },
    { kind: 'compressed', text: 'Venus orbits at about 108 million km (0.72 AU) from the Sun.' },
    { kind: 'compressed', text: 'Mars orbits at about 228 million km (1.52 AU) from the Sun. We skip past Earth’s orbit on the way.' },
    { kind: 'compressed', text: 'Jupiter orbits at about 778 million km (5.2 AU) from the Sun — more than three times Mars’s distance.' },
    { kind: 'compressed', text: 'Saturn orbits at about 1.43 billion km (9.6 AU) from the Sun.' },
    { kind: 'compressed', text: 'Uranus orbits at about 2.87 billion km (19.2 AU) from the Sun.' },
    { kind: 'compressed', text: 'Neptune orbits at about 4.5 billion km (30 AU). Sunlight takes about 4 hours to reach it.' },
    { kind: 'route-note', text: 'Route note: the main asteroid belt lies between Mars and Jupiter, about 2.2–3.2 AU from the Sun. We double back sunward to begin the tour of the Solar System’s small bodies.' },
    { kind: 'compressed', text: 'The Kuiper Belt stretches from roughly 30 to 50 AU from the Sun — many times farther out than the main asteroid belt.' },
    { kind: 'compressed', text: 'The Oort Cloud is hypothesized to begin around 2,000 AU and may reach 100,000 AU or more. This hop compresses a distance far greater than all the others so far.' },
    { kind: 'route-note', text: 'Scale note: the heliosphere (about 120 AU to the heliopause) is much smaller than the Oort Cloud. We step back inward to see the Sun’s wind bubble from outside.' },
    { kind: 'real', text: 'Voyager 1 crossed the heliopause at about 121 AU in 2012; Voyager 2 crossed at about 119 AU in 2018. Beyond it, interstellar material dominates.' },
    { kind: 'scale-jump', text: 'Scale jump: the nearest star system, Alpha Centauri, is about 4.4 light-years — roughly 280,000 AU — from the Sun. Gaps between stars dwarf everything so far.' },
    { kind: 'scale-jump', text: 'Scale jump: we zoom out by a factor of thousands to see the Milky Way’s disk. This is an illustrative model — no one has photographed our galaxy from outside.' },
    { kind: 'compressed', text: 'The Sun is roughly 26,000 light-years from the Galactic Center. Light itself would need that long; this journey is heavily compressed.' },
    { kind: 'compressed', text: 'The stellar disk is more than 100,000 light-years across but has no sharp edge — it thins out gradually.' },
    { kind: 'scale-jump', text: 'Above and around the disk lies the halo: old stars, globular clusters, and the dark matter that evidence says dominates the galaxy’s mass.' },
    { kind: 'scale-jump', text: 'Pulling back for the widest view. The Milky Way is one galaxy among many billions.' }
  ];

  var hopKinds = {
    'real': 'Real distance', 'compressed': 'Compressed travel', 'scale-jump': 'Scale jump',
    'route-note': 'Route note', 'none': ''
  };

  var byId = {};
  for (var i = 0; i < stops.length; i++) { stops[i].index = i; byId[stops[i].id] = stops[i]; }
  for (var s = 0; s < stages.length; s++) {
    stages[s].stops = [];
    for (var j = 0; j < stops.length; j++) if (stops[j].stage === stages[s].id) stages[s].stops.push(stops[j].id);
    stages[s].firstIndex = byId[stages[s].stops[0]].index;
    stages[s].lastIndex = byId[stages[s].stops[stages[s].stops.length - 1]].index;
  }

  A.route = {
    stages: stages,
    stops: stops,
    hops: hops,
    hopKinds: hopKinds,
    specialNames: specialNames,
    byId: byId,
    count: stops.length,
    finaleIndex: stops.length - 1,
    /** Index for an id, or -1. */
    indexOf: function (id) { return byId[id] ? byId[id].index : -1; },
    stageOf: function (id) {
      var st = byId[id] && byId[id].stage;
      for (var n = 0; n < stages.length; n++) if (stages[n].id === st) return stages[n];
      return null;
    },
    /** Human readable name for any stop id (uses destination content when present). */
    nameOf: function (id) {
      if (specialNames[id]) return specialNames[id].name;
      var d = A.destinations && A.destinations[id];
      return d ? d.name : id;
    }
  };
})(window);
