/* ==========================================================================
   ASTROVIA — data/worlds.js   (Compare Worlds)
   Values follow NASA NSSDC planetary and satellite fact sheets (rounded).
   moons / moonsText: counts of KNOWN moons change as discoveries are confirmed;
   the numbers below match the destination pages (NASA counts, Aug–Oct 2026).
   rotationHours: sidereal rotation, negative = retrograde.
   orbitDays: period around the parent body. distanceAU: from the Sun (moons: parent's).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.worlds = [
    { id: 'earth', name: 'Earth', kind: 'planet', parent: 'Sun', diameterKm: 12742, gravity: 9.80, rotationHours: 23.93, orbitDays: 365.25, distanceAU: 1.0, moons: 1,
      atmosphere: 'Nitrogen (78%) and oxygen (21%); surface pressure about 1 bar', meanTempC: 15, massEarths: 1,
      swatch: ['#8fc3ff', '#2b6fb8', '#0b2447'], note: 'The only world known to host life.' },
    { id: 'moon', name: 'The Moon', kind: 'moon', parent: 'Earth', diameterKm: 3475, gravity: 1.62, rotationHours: 655.7, orbitDays: 27.32, distanceAU: 1.0, moons: 0,
      atmosphere: 'Almost none; a very thin exosphere', meanTempC: -20, massEarths: 0.0123,
      swatch: ['#d8d8d8', '#8b8b8b', '#2e2e2e'], note: 'Temperatures swing from about −170 °C at night to about 120 °C by day.' },
    { id: 'mercury', name: 'Mercury', kind: 'planet', parent: 'Sun', diameterKm: 4879, gravity: 3.70, rotationHours: 1407.6, orbitDays: 87.97, distanceAU: 0.387, moons: 0,
      atmosphere: 'Extremely thin exosphere', meanTempC: 167, massEarths: 0.0553,
      swatch: ['#c9c2b8', '#8a8178', '#38332e'], note: 'A solar day on Mercury lasts about 176 Earth days.' },
    { id: 'venus', name: 'Venus', kind: 'planet', parent: 'Sun', diameterKm: 12104, gravity: 8.87, rotationHours: -5832.5, orbitDays: 224.7, distanceAU: 0.723, moons: 0,
      atmosphere: 'Carbon dioxide (96%); surface pressure about 92 bar', meanTempC: 464, massEarths: 0.815,
      swatch: ['#f6e3b4', '#d8a95a', '#6b4720'], note: 'Rotates backward, very slowly; the hottest planet.' },
    { id: 'mars', name: 'Mars', kind: 'planet', parent: 'Sun', diameterKm: 6779, gravity: 3.71, rotationHours: 24.62, orbitDays: 687.0, distanceAU: 1.524, moons: 2,
      atmosphere: 'Thin carbon dioxide; surface pressure about 0.006 bar', meanTempC: -65, massEarths: 0.107,
      swatch: ['#e9a77a', '#b3522d', '#4a1c10'], note: 'A Martian day (sol) is about 24 h 37 min.' },
    { id: 'jupiter', name: 'Jupiter', kind: 'planet', parent: 'Sun', diameterKm: 139820, gravity: 24.79, rotationHours: 9.93, orbitDays: 4332.6, distanceAU: 5.203, moons: null, moonsText: 'more than 100',
      atmosphere: 'Hydrogen and helium; no solid surface (gravity and temperature at the 1-bar level)', meanTempC: -110, massEarths: 317.8,
      swatch: ['#f1d9b9', '#c48f5f', '#5c3b27'], note: 'Diameter is the mean value; the planet is slightly flattened by its fast spin.' },
    { id: 'saturn', name: 'Saturn', kind: 'planet', parent: 'Sun', diameterKm: 116460, gravity: 10.44, rotationHours: 10.66, orbitDays: 10759, distanceAU: 9.537, moons: 293,
      atmosphere: 'Hydrogen and helium; no solid surface (1-bar level)', meanTempC: -140, massEarths: 95.2,
      swatch: ['#f3e3b2', '#d1b072', '#6e5a33'], note: 'Less dense than water on average. Diameter excludes the rings.' },
    { id: 'uranus', name: 'Uranus', kind: 'planet', parent: 'Sun', diameterKm: 50724, gravity: 8.87, rotationHours: -17.24, orbitDays: 30687, distanceAU: 19.19, moons: 28,
      atmosphere: 'Hydrogen, helium and methane (1-bar level)', meanTempC: -195, massEarths: 14.5,
      swatch: ['#d3f3f6', '#8ed0d8', '#2f6f7a'], note: 'Axis tilted about 98°, so it rolls around the Sun on its side.' },
    { id: 'neptune', name: 'Neptune', kind: 'planet', parent: 'Sun', diameterKm: 49244, gravity: 11.15, rotationHours: 16.11, orbitDays: 60190, distanceAU: 30.07, moons: 16,
      atmosphere: 'Hydrogen, helium and methane (1-bar level)', meanTempC: -200, massEarths: 17.1,
      swatch: ['#8fb4ff', '#3b5fd0', '#101f5e'], note: 'Winds reach about 2,100 km/h, the fastest measured in the Solar System.' },
    { id: 'pluto', name: 'Pluto', kind: 'dwarf planet', parent: 'Sun', diameterKm: 2377, gravity: 0.62, rotationHours: -153.3, orbitDays: 90560, distanceAU: 39.48, moons: 5,
      atmosphere: 'Very thin nitrogen with methane; surface pressure about one hundred-thousandth of Earth’s', meanTempC: -229, massEarths: 0.0022,
      swatch: ['#e3cdb4', '#a98a73', '#4a3a30'], note: 'Its orbit is eccentric and tilted; it sometimes lies closer to the Sun than Neptune.' },
    { id: 'io', name: 'Io', kind: 'moon', parent: 'Jupiter', diameterKm: 3643, gravity: 1.80, rotationHours: 42.46, orbitDays: 1.769, distanceAU: 5.203, moons: 0,
      atmosphere: 'Very thin sulphur dioxide', meanTempC: -143, massEarths: 0.0150,
      swatch: ['#f2e28a', '#c9a73a', '#6b4a14'], note: 'The most volcanically active body known in the Solar System.' },
    { id: 'europa', name: 'Europa', kind: 'moon', parent: 'Jupiter', diameterKm: 3122, gravity: 1.31, rotationHours: 85.2, orbitDays: 3.551, distanceAU: 5.203, moons: 0,
      atmosphere: 'Extremely thin oxygen', meanTempC: -160, massEarths: 0.00804,
      swatch: ['#e9e2d4', '#b7a58c', '#5a4a3a'], note: 'Evidence indicates a global ocean of liquid water beneath its icy shell.' },
    { id: 'ganymede', name: 'Ganymede', kind: 'moon', parent: 'Jupiter', diameterKm: 5268, gravity: 1.43, rotationHours: 171.7, orbitDays: 7.155, distanceAU: 5.203, moons: 0,
      atmosphere: 'Extremely thin oxygen', meanTempC: -163, massEarths: 0.0248,
      swatch: ['#cfc6b8', '#8f8577', '#3d362e'], note: 'The largest moon in the Solar System, bigger than Mercury; has its own magnetic field.' },
    { id: 'titan', name: 'Titan', kind: 'moon', parent: 'Saturn', diameterKm: 5150, gravity: 1.35, rotationHours: 382.7, orbitDays: 15.945, distanceAU: 9.537, moons: 0,
      atmosphere: 'Thick nitrogen with methane; surface pressure about 1.5 bar', meanTempC: -179, massEarths: 0.0225,
      swatch: ['#f1c77a', '#c18b3a', '#5a3a14'], note: 'The only moon with a dense atmosphere, and lakes of liquid methane and ethane.' },
    { id: 'enceladus', name: 'Enceladus', kind: 'moon', parent: 'Saturn', diameterKm: 504, gravity: 0.113, rotationHours: 32.9, orbitDays: 1.370, distanceAU: 9.537, moons: 0,
      atmosphere: 'Thin water-vapour plumes', meanTempC: -198, massEarths: 0.0000181,
      swatch: ['#ffffff', '#d5e2ee', '#7b8fa3'], note: 'Cassini found jets of water vapour and ice venting from a subsurface ocean.' }
  ];
})(window);
