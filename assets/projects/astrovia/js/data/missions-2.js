(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.missions = (A.missions || []).concat([
    {
      id: 'galileo', name: 'Galileo', agency: 'NASA', type: 'Orbiter + atmospheric probe',
      status: 'historical',
      statusNote: 'Ended 21 September 2003 with a planned plunge into Jupiter',
      asOf: '2026-10',
      years: '1989–2003',
      targets: ['jupiter', 'asteroid-belt'],
      summary: 'The first spacecraft to orbit Jupiter and the first to drop a probe into its atmosphere. It toured the Galilean moons for almost eight years.',
      discoveries: 'Found evidence of a salty ocean beneath Europa’s ice, widespread volcanism on Io, and a magnetic field at Ganymede. It also flew past asteroids Gaspra and Ida and discovered Ida’s moon Dactyl.',
      url: 'https://science.nasa.gov/mission/galileo/'
    },
    {
      id: 'juno', name: 'Juno', agency: 'NASA', type: 'Orbiter',
      status: 'active',
      statusNote: 'Orbiting Jupiter since 2016; NASA still listed it as active in July 2026. The formal extension ran to September 2025 and no revised end date was found',
      asOf: '2026-10',
      years: '2011–present',
      targets: ['jupiter'],
      summary: 'A solar-powered polar orbiter that studies Jupiter’s interior, atmosphere, magnetic field and auroras, flying close to the cloud tops on long, looping orbits.',
      discoveries: 'Showed that Jupiter’s deep atmosphere and core are more complex than expected, mapped its strong magnetic field, imaged polar cyclones, and, in its extended mission, flew close past Ganymede, Europa and Io.',
      url: 'https://science.nasa.gov/mission/juno/'
    },
    {
      id: 'juice', name: 'JUICE (Jupiter Icy Moons Explorer)', agency: 'ESA', type: 'Orbiter',
      status: 'active',
      statusNote: 'Launched 14 April 2023; in cruise to Jupiter, arrival planned July 2031 (ESA status report, September 2026)',
      asOf: '2026-10',
      years: '2023–2035 (planned)',
      targets: ['jupiter'],
      summary: 'ESA’s first large mission to the Jupiter system. It will make repeated flybys of Europa, Callisto and Ganymede, then orbit Ganymede, the largest moon in the Solar System.',
      discoveries: 'Expectations, not results: it is designed to test whether the icy moons could have habitable conditions and to map Ganymede’s ice shell, subsurface ocean and magnetic field. No Jupiter science has been collected yet.',
      url: 'https://www.esa.int/Science_Exploration/Space_Science/Juice'
    },
    {
      id: 'europa-clipper', name: 'Europa Clipper', agency: 'NASA', type: 'Orbiter (multiple flybys)',
      status: 'active',
      statusNote: 'Launched 14 October 2024; Mars flyby done March 2025; Earth flyby due December 2026; Jupiter arrival planned April 2030',
      asOf: '2026-10',
      years: '2024–2034 (planned)',
      targets: ['jupiter'],
      summary: 'A spacecraft that will orbit Jupiter and fly past Europa dozens of times to study its ice shell, its subsurface ocean and whether conditions there could support life.',
      discoveries: 'Expectations, not results: its instruments are meant to measure ice thickness, ocean depth and salinity, surface composition and plume activity. It does not search directly for life.',
      url: 'https://science.nasa.gov/mission/europa-clipper/'
    },
    {
      id: 'cassini-huygens', name: 'Cassini–Huygens', agency: 'NASA / ESA / ASI', type: 'Orbiter + Titan lander',
      status: 'historical',
      statusNote: 'Ended 15 September 2017 with a planned entry into Saturn’s atmosphere',
      asOf: '2026-10',
      years: '1997–2017',
      targets: ['saturn'],
      summary: 'A 13-year tour of Saturn, its rings and its moons. The Huygens probe made the first landing on a moon in the outer Solar System, on Titan in January 2005.',
      discoveries: 'Found water-ice plumes erupting from Enceladus, hydrocarbon lakes and seas on Titan, and fine structure in the rings. Its data point to a global ocean beneath Enceladus’s ice.',
      url: 'https://science.nasa.gov/mission/cassini/'
    },
    {
      id: 'dragonfly', name: 'Dragonfly', agency: 'NASA', type: 'Rotorcraft lander',
      status: 'planned',
      statusNote: 'In development; launch targeted for July 2028, Titan arrival 2034 (hardware testing under way, April 2026)',
      asOf: '2026-10',
      years: '2028–2036 (planned)',
      targets: ['saturn'],
      summary: 'A nuclear-powered, car-sized rotorcraft that will fly between sites on Saturn’s moon Titan to study its organic-rich surface and look for chemistry relevant to the origins of life.',
      discoveries: 'Expectations, not results: it is designed to sample surface materials at many locations, measure their chemistry and probe Titan’s atmosphere and weather. The launch date could still change.',
      url: 'https://science.nasa.gov/mission/dragonfly/'
    },
    {
      id: 'voyager-1', name: 'Voyager 1', agency: 'NASA', type: 'Probe (flyby, interstellar)',
      status: 'active',
      statusNote: 'Still sending data from interstellar space; its LECP instrument was switched off in April 2026 to save power; it reaches one light-day from Earth about 18 November 2026',
      asOf: '2026-10',
      years: '1977–present',
      targets: ['jupiter', 'saturn', 'heliosphere', 'interstellar'],
      summary: 'Launched in 1977, it flew past Jupiter and Saturn and is now the most distant human-made object, travelling through the space between the stars.',
      discoveries: 'Revealed volcanoes on Io and Titan’s thick atmosphere. In 2012 it became the first spacecraft to cross the heliopause and measure interstellar plasma and magnetic fields directly.',
      url: 'https://science.nasa.gov/mission/voyager/'
    },
    {
      id: 'voyager-2', name: 'Voyager 2', agency: 'NASA', type: 'Probe (flyby, interstellar)',
      status: 'active',
      statusNote: 'Still operating; last confirmed in March 2025 with three science instruments on after two were shut off to save power',
      asOf: '2026-10',
      years: '1977–present',
      targets: ['jupiter', 'saturn', 'uranus', 'neptune', 'heliosphere', 'interstellar'],
      summary: 'The only spacecraft to have visited Uranus and Neptune. It crossed the heliopause in 2018 and continues to send data from interstellar space.',
      discoveries: 'Found Neptune’s Great Dark Spot and geysers on Triton, Uranus’s tilted magnetic field and new moons and rings. Its 2018 crossing showed how the heliopause differs from Voyager 1’s.',
      url: 'https://science.nasa.gov/mission/voyager/'
    },
    {
      id: 'dawn', name: 'Dawn', agency: 'NASA', type: 'Orbiter',
      status: 'historical',
      statusNote: 'Contact ended 1 November 2018 when the fuel ran out; it remains in orbit around Ceres',
      asOf: '2026-10',
      years: '2007–2018',
      targets: ['asteroid-belt'],
      summary: 'The first spacecraft to orbit two bodies beyond the Earth–Moon system. It studied the protoplanet Vesta and then the dwarf planet Ceres, using ion propulsion.',
      discoveries: 'Showed Vesta to be a differentiated, rocky protoplanet. At Ceres it found bright salt deposits in Occator Crater and evidence of past or present briny water beneath the surface.',
      url: 'https://science.nasa.gov/mission/dawn/'
    },
    {
      id: 'psyche', name: 'Psyche', agency: 'NASA', type: 'Orbiter',
      status: 'active',
      statusNote: 'Launched 13 October 2023; Mars gravity-assist flyby in May 2026; asteroid arrival planned for 2029',
      asOf: '2026-10',
      years: '2023–2031 (planned)',
      targets: ['asteroid-belt'],
      summary: 'A solar-electric spacecraft heading to the metal-rich asteroid (16) Psyche. It will orbit the asteroid for about two years to map its shape, composition and surface.',
      discoveries: 'Expectations, not results: Psyche may be the exposed core of a broken-up protoplanet, or a different metal-rich body. The mission aims to find out which, and to learn how planetary cores form.',
      url: 'https://science.nasa.gov/mission/psyche/'
    },
    {
      id: 'osiris-rex', name: 'OSIRIS-REx / OSIRIS-APEX', agency: 'NASA', type: 'Sample return + extended flyby',
      status: 'active',
      statusNote: 'Returned Bennu sample 24 September 2023; now extended as OSIRIS-APEX, heading for asteroid Apophis in 2029',
      asOf: '2026-10',
      years: '2016–2029+',
      targets: ['asteroid-belt'],
      summary: 'OSIRIS-REx collected rock and dust from near-Earth asteroid Bennu and delivered it to Earth. The spacecraft, renamed OSIRIS-APEX, is now on its way to study asteroid Apophis.',
      discoveries: 'Bennu samples contain carbon-rich material, water-bearing clays and salts, and amino acids. For Apophis, expectations are to watch how Earth’s gravity reshapes the asteroid after its close pass on 13 April 2029.',
      url: 'https://science.nasa.gov/mission/osiris-rex/'
    },
    {
      id: 'hayabusa2', name: 'Hayabusa2 (extended mission Hayabusa2♯)', agency: 'JAXA', type: 'Sample return + extended flybys',
      status: 'active',
      statusNote: 'Returned Ryugu sample December 2020; flew past asteroid Torifune 5 July 2026; Earth flyby planned December 2027, then 1998 KY26 in 2031',
      asOf: '2026-10',
      years: '2014–2031 (planned)',
      targets: ['asteroid-belt'],
      summary: 'Japan’s probe collected samples from the carbon-rich asteroid Ryugu and returned them to Earth. Its extended mission, Hayabusa2♯, is visiting more small asteroids.',
      discoveries: 'Ryugu samples contain water-bearing minerals, organic molecules and more than 20 amino acids. The extended mission is expected to test precise fast-flyby navigation and study the very small, fast-spinning asteroid 1998 KY26.',
      url: 'https://www.isas.jaxa.jp/en/missions/spacecraft/current/hayabusa2.html'
    },
    {
      id: 'lucy', name: 'Lucy', agency: 'NASA', type: 'Flyby (multiple asteroids)',
      status: 'active',
      statusNote: 'Launched 16 October 2021; Trojan flybys scheduled between August 2027 and November 2028 (camera tests, summer 2026)',
      asOf: '2026-10',
      years: '2021–2033 (planned)',
      targets: ['asteroid-belt', 'jupiter'],
      summary: 'The first mission to the Jupiter Trojan asteroids, ancient bodies that share Jupiter’s orbit. Lucy visits one main-belt asteroid and then several Trojans over about 12 years.',
      discoveries: 'It has already flown past main-belt asteroid Dinkinesh (2023) and found it is a binary, and Selam (2024), which turned out to be a contact binary. Trojan results are still expectations.',
      url: 'https://science.nasa.gov/mission/lucy/'
    },
    {
      id: 'dart', name: 'DART (Double Asteroid Redirection Test)', agency: 'NASA', type: 'Impactor (planetary defense test)',
      status: 'historical',
      statusNote: 'Impacted Dimorphos 26 September 2022; ESA’s Hera follow-up is due to arrive at Didymos in November 2026',
      asOf: '2026-10',
      years: '2021–2022',
      targets: ['asteroid-belt'],
      summary: 'The first test of deflecting an asteroid. The spacecraft struck Dimorphos, the small moon of asteroid Didymos, to see how much its orbit would change.',
      discoveries: 'The impact shortened Dimorphos’s orbit around Didymos by about 32 minutes, showing that a kinetic impactor can change an asteroid’s motion. Debris ejected from the impact added to the push.',
      url: 'https://science.nasa.gov/mission/dart/'
    },
    {
      id: 'new-horizons', name: 'New Horizons', agency: 'NASA', type: 'Probe (flyby)',
      status: 'active',
      statusNote: 'Healthy in its extended mission through the Kuiper Belt; NASA’s plan runs until it exits the belt, expected 2028–2029',
      asOf: '2026-10',
      years: '2006–present',
      targets: ['jupiter', 'kuiper-belt'],
      summary: 'The first spacecraft to visit Pluto, in July 2015. It then flew past the Kuiper Belt object Arrokoth and continues outward, studying the outer Solar System.',
      discoveries: 'Found Pluto’s nitrogen-ice plains, water-ice mountains and hazy atmosphere. Arrokoth turned out to be a contact binary, a well-preserved remnant from the formation of the Solar System.',
      url: 'https://science.nasa.gov/mission/new-horizons/'
    },
    {
      id: 'ibex', name: 'IBEX (Interstellar Boundary Explorer)', agency: 'NASA', type: 'Earth-orbiting space probe',
      status: 'active',
      statusNote: 'Launched 2008; still operating as of last NASA confirmation, with the newer IMAP mission (launched 24 September 2025) now taking over its work',
      asOf: '2026-10',
      years: '2008–present',
      targets: ['heliosphere', 'interstellar'],
      summary: 'A small Earth-orbiting spacecraft that maps the edge of the heliosphere by detecting energetic neutral atoms arriving from where the solar wind meets interstellar space.',
      discoveries: 'Discovered a bright “ribbon” of particles in the sky that is shaped by the interstellar magnetic field, and measured the speed and direction of the interstellar wind flowing past the Sun.',
      url: 'https://science.nasa.gov/mission/ibex/'
    },
    {
      id: 'interstellar-probe', name: 'Interstellar Probe (concept)', agency: 'NASA-funded study (JHU APL)', type: 'Concept study',
      status: 'planned',
      statusNote: 'Not an approved mission: a concept study with no confirmed launch date or funding for flight',
      asOf: '2026-10',
      years: 'Concept study (no launch date)',
      targets: ['heliosphere', 'interstellar'],
      summary: 'A proposed spacecraft that would travel far faster than Voyager to reach the nearby interstellar medium and look back at our heliosphere from outside.',
      discoveries: 'Expectations from the study, not results: measure interstellar plasma, dust and magnetic fields and image the heliosphere from outside. The study concept aims for about 1,000 AU within 50 years.',
      url: 'https://interstellarprobe.jhuapl.edu/'
    },
    {
      id: 'gaia', name: 'Gaia', agency: 'ESA', type: 'Space telescope (astrometry)',
      status: 'historical',
      statusNote: 'Stopped observing January 2025 and was switched off 27 March 2025; data release 4 is planned for 2026',
      asOf: '2026-10',
      years: '2013–2025',
      targets: ['neighborhood', 'spiral-arms', 'outer-milky-way', 'halo'],
      summary: 'ESA’s telescope that measured the positions, distances and motions of about two billion stars to build the most precise three-dimensional map of the Milky Way.',
      discoveries: 'Revealed stellar streams, a warp in the galactic disk, and the remains of ancient galaxy mergers. It also found many binary stars and exoplanet candidates, and measured the motions of stars near the galactic center.',
      url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia'
    },
    {
      id: 'chandra', name: 'Chandra X-ray Observatory', agency: 'NASA', type: 'Space telescope',
      status: 'active',
      statusNote: 'Operating in 2026 (May report: working normally except one detector, HRC-S, since October 2025); FY2026 funding of at least $63M, later years uncertain',
      asOf: '2026-10',
      years: '1999–present',
      targets: ['galactic-center', 'halo'],
      summary: 'NASA’s flagship X-ray telescope, launched in 1999. It observes very hot and energetic objects such as black holes, exploded stars and galaxy clusters.',
      discoveries: 'Provided direct evidence of dark matter in the Bullet Cluster, imaged hot gas around black holes, and observed X-ray flares from Sagittarius A*, the black hole at the center of the Milky Way.',
      url: 'https://science.nasa.gov/mission/chandra-x-ray-observatory/'
    },
    {
      id: 'event-horizon-telescope', name: 'Event Horizon Telescope', agency: 'EHT Collaboration (international)', type: 'Ground-based telescope array',
      status: 'active',
      statusNote: 'Ongoing collaboration; observes with a global network of radio telescopes, with first images released in 2019 and 2022',
      asOf: '2026-10',
      years: '2009–present',
      targets: ['galactic-center'],
      summary: 'A planet-sized virtual telescope formed by linking radio dishes around the world. It images the shadows of supermassive black holes with sharpness no single telescope can reach.',
      discoveries: 'Produced the first image of a black hole, M87*, in 2019, and the first image of Sagittarius A*, our galaxy’s central black hole (about 4 million solar masses), in 2022.',
      url: 'https://eventhorizontelescope.org/'
    }
  ]);
})(window);
