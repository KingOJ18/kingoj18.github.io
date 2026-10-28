/* ==========================================================================
   ASTROVIA — data/scale.js   (Cosmic Scale Mode rungs, ascending by km)
   1 AU = 1.496e8 km; 1 light-year = 9.4607e12 km; light = 299,792 km/s.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});

  A.scale = [
    { id: 'earth-diameter', label: 'Earth’s diameter', km: 12742, type: 'size', lightTime: '0.04 s',
      note: 'About 12,742 km across on average. Light could circle the planet roughly 7.5 times in one second.' },
    { id: 'jupiter-diameter', label: 'Jupiter’s diameter', km: 139820, type: 'size', lightTime: '0.5 s',
      note: 'The largest planet is about 11 Earths wide (this is its mean diameter; it is slightly flattened).' },
    { id: 'moon-orbit', label: 'Moon’s orbital distance', km: 384400, type: 'distance', lightTime: '1.3 s',
      note: 'The Moon’s average distance from Earth. About 30 Earths would fit side by side in between.' },
    { id: 'sun-diameter', label: 'Sun’s diameter', km: 1392700, type: 'size', lightTime: '4.6 s',
      note: 'About 109 Earths across. Roughly a million Earths could fit inside its volume.' },
    { id: 'au', label: '1 astronomical unit (Earth–Sun)', km: 149600000, type: 'distance', lightTime: '8 min 19 s',
      note: 'The average Earth–Sun distance, about 150 million km. Sunlight takes a little over 8 minutes to arrive.' },
    { id: 'jupiter-orbit', label: 'Jupiter’s orbital distance', km: 778000000, type: 'distance', lightTime: '43 min',
      note: 'About 5.2 AU from the Sun on average, more than five times Earth’s distance.' },
    { id: 'neptune-orbit', label: 'Neptune’s orbital distance', km: 4500000000, type: 'distance', lightTime: '4 h 10 min',
      note: 'About 30 AU from the Sun, the outermost planet. Sunlight there is far fainter than at Earth.' },
    { id: 'kuiper-outer', label: 'Outer Kuiper Belt (about 50 AU)', km: 7480000000, type: 'distance', lightTime: '6 h 56 min',
      note: 'The main Kuiper Belt is generally described as extending from about 30 to 50 AU; the outer edge is approximate.' },
    { id: 'heliopause', label: 'Heliopause (about 120 AU)', km: 17950000000, type: 'distance', lightTime: '16 h 38 min',
      note: 'Voyager 1 crossed it near 121 AU in 2012. Beyond it, interstellar plasma dominates over the solar wind.' },
    { id: 'oort-inner', label: 'Inner Oort Cloud (hypothesized, about 2,000 AU)', km: 299200000000, type: 'distance', lightTime: '11.6 days',
      note: 'The Oort Cloud has never been observed directly. Its inner edge is a rough estimate and uncertain.' },
    { id: 'oort-outer', label: 'Outer Oort Cloud (hypothesized, about 100,000 AU)', km: 14960000000000, type: 'distance', lightTime: '1.6 years',
      note: 'Hypothesized outer reach, about 1.6 light-years. Estimates vary and may be larger; it is inferred from comet orbits.' },
    { id: 'alpha-centauri', label: 'Alpha Centauri (4.37 light-years)', km: 4.134e13, type: 'distance', lightTime: '4.37 years',
      note: 'The nearest star system to the Sun, about 41 trillion km away.' },
    { id: 'sirius', label: 'Sirius (about 8.6 light-years)', km: 8.146e13, type: 'distance', lightTime: '8.6 years',
      note: 'The brightest star in Earth’s night sky, about twice as far away as Alpha Centauri.' },
    { id: 'galactic-center', label: 'Galactic Center (about 26,700 light-years)', km: 2.526e17, type: 'distance', lightTime: '26,700 years',
      note: 'Estimates are roughly 26,000 to 27,000 light-years. Sagittarius A*, a supermassive black hole, sits there.' },
    { id: 'milky-way-disk', label: 'Milky Way stellar disk (about 100,000 light-years)', km: 9.4607e17, type: 'size', lightTime: '100,000 years',
      note: 'A commonly quoted width; the disk has no sharp edge, so estimates range from about 100,000 to over 150,000 light-years.' },
    { id: 'andromeda', label: 'Andromeda Galaxy (about 2.5 million light-years)', km: 2.365e19, type: 'distance', lightTime: '2.5 million years',
      note: 'The nearest large galaxy to the Milky Way. Its light left about when early humans were emerging.' }
  ];
})(window);
