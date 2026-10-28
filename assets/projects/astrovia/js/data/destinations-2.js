/* ==========================================================================
   ASTROVIA — data/destinations-2.js
   Content for: mars, jupiter, saturn, uranus, neptune.
   Mission statuses and moon counts verified October 2026 (NASA Science pages).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.destinations = A.destinations || {};
  Object.assign(A.destinations, {

    /* ---------------------------------------------------------------- MARS */
    'mars': {
      name: 'Mars',
      tagline: 'The Red Planet',
      type: 'Terrestrial planet',
      intro: 'Mars is a cold, dry, dusty world about half Earth’s width. Rivers and lakes once shaped its surface, and today a fleet of robots is searching its rocks for signs of ancient habitable conditions.',
      everyday: 'Mars has about the same total land area as all of Earth’s continents combined, but a day there lasts only 37 minutes longer than ours.',
      keyFacts: [
        'Mars is red because its dust and rocks contain iron oxide, the same compound that makes rust.',
        'Its air is about 95% carbon dioxide and so thin that surface pressure is under 1% of Earth’s.',
        'Mars has two small moons, Phobos and Deimos, each shaped like a lumpy potato.',
        'Orbiters, landers and rovers have shown that liquid water flowed on Mars billions of years ago.',
        'A Martian day (a sol) lasts 24 hours 37 minutes, and a Martian year lasts about 687 Earth days.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '227.9 million km (1.52 AU)' },
        { label: 'Diameter (mean)', value: 'about 6,779 km' },
        { label: 'Length of day', value: '24 h 37 min' },
        { label: 'Length of year', value: 'about 687 Earth days' },
        { label: 'Surface gravity', value: '3.71 m/s² (about 38% of Earth’s)' },
        { label: 'Average surface temperature', value: 'about −65 °C (roughly −140 °C to +20 °C)' }
      ],
      surprises: [
        'Olympus Mons, a shield volcano about 21.9 km high and roughly 600 km wide, is the tallest known volcano in the Solar System, nearly two and a half times the height of Mount Everest above sea level.',
        'In 2025, NASA reported that Perseverance had found rock features with chemistry that could possibly be a sign of ancient microbial life. This is a potential biosignature only, and is not a detection of life.'
      ],
      explore: [
        { heading: 'A world of giant volcanoes and canyons', status: 'confirmed',
          body: 'Mars has extreme landscapes. Olympus Mons stands about 21.9 km high, built from countless lava flows on a crust that, unlike Earth’s, stays in place over a hot spot. Valles Marineris is a canyon system about 4,000 km long, up to about 7 km deep, wide enough to span the United States. The northern lowlands are smooth and low while the southern highlands are older, higher and heavily cratered. Orbiter images and laser altimetry have mapped all of this in detail.' },
        { heading: 'Water in Mars’s past', status: 'confirmed',
          body: 'Rovers and orbiters have found dried river valleys, delta deposits and minerals such as clays and sulfates that form in the presence of water. Curiosity found lakebed mudstones in Gale Crater that held fresh, mild water for long periods, with the chemical ingredients life needs. This happened more than 3 billion years ago. Today, liquid water is not stable at the surface because the air is so thin and cold, but water ice lies at the poles and under the soil at mid-latitudes.' },
        { heading: 'Losing an atmosphere', status: 'hypothesis',
          body: 'Early Mars is thought to have had a thicker atmosphere that supported warmer conditions. NASA’s MAVEN orbiter measured gas streaming away to space, driven by the solar wind and solar ultraviolet light, and found that loss was far stronger in the past. Mars lacks a global magnetic field today, though it had one early on. Scientists think atmospheric escape was a major reason the climate turned cold and dry, but how much was lost to space versus locked into rock and ice is still being worked out.' },
        { heading: 'The search for past life', status: 'open',
          body: 'No evidence of life on Mars has been confirmed. In 2025, NASA reported that Perseverance’s sample "Sapphire Canyon", from a rock called Cheyava Falls, contains small “leopard spot” reaction patterns with iron- and sulfur-bearing minerals and organic carbon. On Earth such patterns can be made by microbes, but non-biological chemistry has not been ruled out. Confirming or rejecting a biological origin would need analysis in laboratories on Earth. The plan to return samples, Mars Sample Return, was cancelled in the US budget enacted in January 2026, so how and when that could happen is uncertain.' }
      ],
      discover: [
        { heading: 'Escape velocity, scale height and atmospheric loss', status: 'confirmed',
          body: 'Mars’s escape velocity is about 5.0 km/s, against 11.2 km/s for Earth, so it holds gases less tightly. Its atmosphere is thin (about 600 Pa, under 1% of Earth’s) and its scale height, the altitude over which pressure falls by a factor of e, is about 11 km. MAVEN measured escape processes including sputtering, photochemical escape of hot oxygen, and ion pick-up by the solar wind. Loss rates rise strongly during solar storms. The data show that escape to space is significant, but the total lost over 4 billion years must be modelled, not measured directly.',
          equation: 'v_esc = √(2GM / r)  ·  H = kT / (μ m g)',
          equationNote: 'G = gravitational constant, M = mass, r = radius, k = Boltzmann constant, T = temperature, μ = mean molecular mass, m = atomic mass unit, g = gravity.' },
        { heading: 'The short future of Phobos', status: 'hypothesis',
          body: 'Phobos orbits at about 9,376 km from Mars’s centre, closer than any other known moon to its planet, and circles it in 7 h 39 min, faster than Mars spins. Tides are pulling it inward by roughly 2 cm per year. Models suggest that within about 30–50 million years it will either crash into Mars or break up inside the Roche limit, perhaps forming a short-lived ring. Where Phobos and Deimos came from, captured asteroids or debris from a giant impact, is still debated, and Japan’s MMX mission is planned to help address that.' }
      ],
      hotspots: [
        { id: 'olympus-mons', label: 'Olympus Mons', text: 'The tallest known volcano in the Solar System, about 21.9 km high and roughly 600 km across, ringed by a steep cliff-like escarpment. It is a shield volcano, built by fluid lava.', lat: 18.65, lon: -133.8 },
        { id: 'valles-marineris', label: 'Valles Marineris', text: 'A system of canyons about 4,000 km long and up to about 7 km deep. It formed mainly as Mars’s crust stretched and cracked, later widened by landslides and erosion.', lat: -13.9, lon: -59 },
        { id: 'hellas-planitia', label: 'Hellas Planitia', text: 'One of the largest known impact basins in the Solar System, about 2,300 km wide and 7 km deep. Its floor has some of the highest air pressure on Mars.', lat: -42.4, lon: 70.5 },
        { id: 'jezero-crater', label: 'Jezero Crater', text: 'A crater about 45 km wide holding an ancient river delta. Perseverance landed here in February 2021 to study rocks formed in water and cache samples.', lat: 18.4, lon: 77.7 },
        { id: 'gale-crater', label: 'Gale Crater', text: 'A crater about 154 km wide with a central mound, Mount Sharp, about 5 km high. Curiosity has driven up its layered slopes since landing in 2012.', lat: -5.4, lon: 137.8 }
      ],
      missions: ['viking-1', 'curiosity', 'perseverance', 'maven', 'mars-express', 'mars-sample-return'],
      sources: [
        { title: 'Mars', org: 'NASA Science', url: 'https://science.nasa.gov/mars/' },
        { title: 'Mars Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' },
        { title: 'NASA Says Mars Rover Discovered Potential Biosignature Last Year', org: 'NASA JPL', url: 'https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/' }
      ],
      tags: ['mars', 'red planet', 'ares', 'olympus mons', 'valles marineris', 'phobos', 'deimos', 'perseverance', 'curiosity', 'biosignature', 'cheyava falls', 'sample return', 'maven', 'sol']
    },

    /* ------------------------------------------------------------- JUPITER */
    'jupiter': {
      name: 'Jupiter',
      tagline: 'King of the Planets',
      type: 'Gas giant',
      intro: 'Jupiter is the largest planet in the Solar System, a vast ball of hydrogen and helium with bands of storm clouds, a powerful magnetic field and a family of more than 100 known moons.',
      everyday: 'Jupiter is so large that more than 1,300 Earths could fit inside it, yet it spins once in under 10 hours, the fastest of any planet.',
      keyFacts: [
        'Jupiter holds more than twice the mass of all the other planets combined, about 318 times Earth’s mass.',
        'It has no solid surface. Its atmosphere is mostly hydrogen and helium and thickens gradually into hot, dense fluid below.',
        'The Great Red Spot is a storm wider than Earth that has been observed for well over a century.',
        'NASA reports more than 100 officially recognized moons, including the four large Galilean moons Io, Europa, Ganymede and Callisto.',
        'Jupiter’s magnetic field traps intense radiation belts that endanger spacecraft passing close to the planet.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '778.5 million km (5.2 AU)' },
        { label: 'Equatorial diameter', value: 'about 142,980 km' },
        { label: 'Length of day', value: 'about 9 h 56 min' },
        { label: 'Length of year', value: 'about 11.9 Earth years' },
        { label: 'Moons', value: 'more than 100 recognized (NASA, Oct 2026)' },
        { label: 'Temperature at the 1-bar level', value: 'about −110 °C' }
      ],
      surprises: [
        'Ganymede, Jupiter’s largest moon, is bigger than the planet Mercury and is the only moon known to generate its own magnetic field.',
        'Io, the innermost Galilean moon, is the most volcanically active body known in the Solar System, flexed and heated by tides from Jupiter and its neighbouring moons.'
      ],
      explore: [
        { heading: 'Bands, zones and storms', status: 'confirmed',
          body: 'Jupiter’s striped look comes from alternating pale zones and darker belts, where gas rises in some places and sinks in others. Winds in neighbouring bands blow in opposite directions at up to several hundred km/h. Storms in the bands include the Great Red Spot, a giant oval vortex that has been observed since at least the 1800s. It has shrunk over time and is now only a little wider than Earth. Colours in the clouds come from trace chemicals, though exactly which ones is not fully settled.' },
        { heading: 'What is inside Jupiter', status: 'hypothesis',
          body: 'Under the clouds, pressure rises until hydrogen behaves like a metal and conducts electricity, the likely source of Jupiter’s strong magnetic field. NASA’s Juno spacecraft, orbiting since 2016, measured gravity and found that the centre is not a small, sharply defined rocky core. Instead it appears to be a “dilute” core, where heavy elements are mixed gradually into the hydrogen above. How that structure formed, whether through slow mixing or a giant impact early in Jupiter’s history, remains an open scientific question.' },
        { heading: 'Moons and a hazardous neighbourhood', status: 'confirmed',
          body: 'In 1610 Galileo saw four bright moons circling Jupiter, showing that not everything orbits Earth. Io is covered in volcanoes, Europa has a salty ocean under an icy shell, Ganymede is the largest moon in the Solar System, and Callisto is heavily cratered. Jupiter’s radiation belts are strong enough to damage electronics, so spacecraft use heavy shielding. NASA’s Europa Clipper and ESA’s Juice are on their way to study the icy moons, but neither has arrived yet.' },
        { heading: 'Could Europa host life?', status: 'open',
          body: 'Europa’s ocean is thought to hold roughly twice as much water as all of Earth’s oceans, and Hubble and Galileo data hint at occasional plumes of water vapour. An ocean is not the same as a habitable one, though. Life would need energy and chemical ingredients, and scientists do not yet know whether Europa’s seafloor supplies them. No sign of life has been found. Europa Clipper will make many close flybys to measure the ice shell and the ocean beneath, but it is not designed to detect life directly.' }
      ],
      discover: [
        { heading: 'Why a gas giant has no sharp edge: scale height', status: 'confirmed',
          body: 'Pressure in a gas atmosphere falls exponentially with height over a distance called the scale height H. With T ≈ 165 K near the 1-bar level, a mean molecular weight μ ≈ 2.3 and g ≈ 24.8 m/s², H comes to roughly 25 km, about three times Earth’s 8 km. Because Jupiter’s gravity is high but its gas is light and cold at the cloud tops, the atmosphere thickens smoothly with depth, and there is no solid surface. The “surface” is conventionally defined as the 1-bar level. Deeper, hydrogen becomes a supercritical fluid.',
          equation: 'H = kT / (μ m g)',
          equationNote: 'k = Boltzmann constant, T = temperature, μ = mean molecular weight (hydrogen–helium ≈ 2.3), m = atomic mass unit, g = gravity.' },
        { heading: 'Jupiter’s Hill sphere and its many moons', status: 'confirmed',
          body: 'A planet can keep a satellite only inside its Hill sphere, the region where its gravity beats the Sun’s tidal pull. For Jupiter, with a mass of about 1/1,047 that of the Sun at 5.2 AU, the Hill radius is about 53 million km, more than a hundred times the Moon’s distance from Earth. This enormous region explains how Jupiter can hold on to so many small, irregular captured moons, the later ones found by ground-based surveys. Orbits that are stable for long periods are typically restricted to roughly the inner half of this radius.',
          equation: 'r_H ≈ a × (m / 3M)^(1/3)',
          equationNote: 'a = planet’s distance from the Sun, m = planet’s mass, M = Sun’s mass.' },
        { heading: 'Zonal jets and the depth of the winds', status: 'open',
          body: 'Jupiter’s alternating east–west jets are visible at the cloud tops, but their roots lie deeper. Juno’s gravity measurements show that the flow extends down about 3,000 km before it is suppressed, a thin shell compared with Jupiter’s 70,000 km radius. Whether the jets are driven mainly by internal heat rising from below or by sunlight and small eddies near the top is still debated. Jupiter radiates about twice as much heat as it receives from the Sun, leftover energy from its formation.' }
      ],
      hotspots: [
        { id: 'great-red-spot', label: 'Great Red Spot', text: 'A long-lived storm wider than Earth, rotating anticyclonically with winds of about 400 km/h at its edge. It has been shrinking, and its exact age is uncertain.', lat: -22, lon: 20 },
        { id: 'equatorial-zone', label: 'Equatorial Zone', text: 'A bright band of high ammonia clouds along the equator, with an eastward jet of roughly 100 m/s. Position shown is illustrative in this stylised model.', lat: 2, lon: -45 },
        { id: 'belts-and-zones', label: 'Belts and zones', text: 'Dark belts and bright zones alternate with latitude. Zones are thought to be regions of rising gas with high clouds, while belts are regions of sinking gas. Placement is illustrative.', lat: 30, lon: -60 },
        { id: 'north-polar-cyclones', label: 'North polar cyclones', text: 'Juno found a central cyclone surrounded by eight others at Jupiter’s north pole, each about 4,000 km across. The south pole has five around one. Placement is illustrative.', lat: 78, lon: 10 }
      ],
      missions: ['galileo', 'juno', 'europa-clipper', 'juice', 'voyager-1', 'hubble'],
      sources: [
        { title: 'Jupiter', org: 'NASA Science', url: 'https://science.nasa.gov/jupiter/' },
        { title: 'Jupiter Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html' }
      ],
      tags: ['jupiter', 'jove', 'gas giant', 'great red spot', 'juno', 'io', 'europa', 'ganymede', 'callisto', 'galilean moons', 'radiation', 'hill sphere', 'scale height']
    },

    /* -------------------------------------------------------------- SATURN */
    'saturn': {
      name: 'Saturn',
      tagline: 'Lord of the Rings',
      type: 'Gas giant',
      intro: 'Saturn is the second-largest planet, famous for its bright rings of water-ice particles. It is a low-density giant of hydrogen and helium with a huge family of moons, including Titan and Enceladus.',
      everyday: 'Saturn is less dense than water, so in a bathtub big enough to hold it, the planet would float. Its rings could span nearly the Earth–Moon distance.',
      keyFacts: [
        'Saturn’s average density is about 0.69 g/cm³, lower than that of water, which is 1.0 g/cm³.',
        'The main rings are made mostly of water ice, in pieces from dust grains to house-sized boulders.',
        'The rings are wide, up to about 280,000 km, but very thin: mostly only tens of metres thick.',
        'NASA lists 293 confirmed moons as of August 2026, and the count has grown rapidly with new surveys.',
        'The Cassini–Huygens mission explored Saturn from 2004 until a planned plunge into its atmosphere in 2017.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '1.43 billion km (9.6 AU)' },
        { label: 'Equatorial diameter', value: 'about 120,540 km' },
        { label: 'Length of day', value: 'about 10 h 33 min to 10 h 40 min' },
        { label: 'Length of year', value: 'about 29.4 Earth years' },
        { label: 'Moons', value: '293 confirmed (NASA, Aug 2026)' },
        { label: 'Temperature at the 1-bar level', value: 'about −140 °C' }
      ],
      surprises: [
        'Saturn’s north pole is crowned by a six-sided jet stream, the hexagon, about 30,000 km across. It was seen by Voyager in the early 1980s and was still there when Cassini arrived decades later.',
        'Enceladus, a moon only about 500 km wide, sprays plumes of water ice and vapour from cracks near its south pole. Cassini flew through them and found salts and organic molecules.'
      ],
      explore: [
        { heading: 'Rings of ice', status: 'confirmed',
          body: 'Saturn’s rings are billions of separate pieces of mostly water ice, each in its own orbit. Seen from Earth they look solid, but light passes through some parts. The bright main rings stretch about 280,000 km from Saturn yet are usually only about 10 metres thick in many places. Gaps, such as the Cassini Division, are carved by the gravity of moons, and small “moonlets” create waves and propeller shapes in the ring material. Cassini measured their structure in unprecedented detail from orbit.' },
        { heading: 'How old are the rings?', status: 'open',
          body: 'Scientists disagree about the age of Saturn’s rings. Cassini’s measurements of ring mass and the amount of dark dust that has collected suggested rings only about 100–400 million years old, young compared with the 4.5 billion year-old planet. Other studies argue that ring ice could stay clean for much longer and that the rings might be as old as Saturn itself. Possible origins include a shattered icy moon or a comet pulled apart by Saturn’s gravity. Which view is right has not been settled.' },
        { heading: 'Titan and Enceladus', status: 'confirmed',
          body: 'Titan, Saturn’s largest moon, is bigger than Mercury and wrapped in a thick nitrogen atmosphere. Rain, rivers and lakes on its surface are made of methane and ethane rather than water. The Huygens probe landed there in January 2005. Enceladus hides a global liquid-water ocean under an icy shell. Both moons show chemistry of interest to astrobiology, but no sign of life has been found. NASA lists both as priority targets for future missions.' },
        { heading: 'What is next for Saturn', status: 'confirmed',
          body: 'NASA’s Dragonfly is a car-sized, eight-rotor aircraft designed to fly between sites on Titan. As of October 2026 NASA lists its launch as no earlier than July 2028, with arrival in late 2034. It is a mission in development, so those dates may change. Dragonfly will study how far chemistry on Titan has progressed toward the molecules that preceded life on Earth. Nothing has yet been planned and approved for a return to Saturn’s rings or Enceladus.' }
      ],
      discover: [
        { heading: 'The Roche limit and why rings exist', status: 'confirmed',
          body: 'Inside a certain distance a moon held together only by its own gravity is pulled apart by the planet’s tides. For a fluid satellite the Roche limit is about 2.44 planetary radii times the cube root of the ratio of planet to satellite density. With Saturn at 687 kg/m³, ice at about 900 kg/m³ and a radius of 60,268 km, the limit is about 134,000 km, close to the outer edge of the main rings at roughly 137,000 km. Tidal forces keep ring particles from clumping into a single moon there, though small moons can survive by being solid.',
          equation: 'd ≈ 2.44 R_planet (ρ_planet / ρ_satellite)^(1/3)',
          equationNote: 'R = planet radius, ρ = density. This is the fluid-body Roche limit; rigid bodies can orbit slightly closer.' },
        { heading: 'The polar hexagon and Saturn’s jets', status: 'hypothesis',
          body: 'The hexagon sits near 78° N, a meandering jet stream moving at roughly 100 m/s with a wave pattern of six lobes, which stayed fixed in the planet’s rotating frame for decades. Laboratory experiments with rotating fluid have produced similar polygonal patterns, and models suggest the wave is a Rossby-type standing wave. Its exact driver is not settled. Saturn also has an eastward equatorial jet exceeding 400 m/s, far faster than Jupiter’s, and the depth of such jets, now constrained by Cassini’s final-orbit gravity data, remains the subject of continuing work.',
          equation: 'f = 2Ω sin φ',
          equationNote: 'f = Coriolis parameter, Ω = planet’s rotation rate, φ = latitude. It controls how rotation shapes jets and waves.' }
      ],
      hotspots: [
        { id: 'north-polar-hexagon', label: 'North polar hexagon', text: 'A hexagonal jet stream around Saturn’s north pole, about 30,000 km wide, with a giant hurricane-like vortex at its centre. Nothing like it is known elsewhere in the Solar System.', lat: 78, lon: 0 },
        { id: 'ring-system', label: 'Ring system', text: 'Saturn’s rings are mostly water ice and extend about 280,000 km, but are only tens of metres thick. Their age is debated. Position here is illustrative in the stylised model.', lat: 0, lon: 55 },
        { id: 'great-white-storms', label: 'Great White storms', text: 'Roughly every 30 years, a giant storm erupts in the northern hemisphere and may wrap the planet. The last was observed in 2010–2011. Placement is illustrative.', lat: 37, lon: -45 },
        { id: 'equatorial-jet', label: 'Equatorial jet', text: 'A broad eastward jet at the equator reaches speeds above 400 m/s, one of the fastest winds on any planet. Placement is illustrative.', lat: 0, lon: -60 },
        { id: 'south-polar-vortex', label: 'South polar vortex', text: 'Cassini imaged a hurricane-like vortex at the south pole with a clearly defined eye about 8,000 km across and no hexagon around it. Placement is illustrative.', lat: -75, lon: -15 }
      ],
      missions: ['voyager-1', 'cassini-huygens', 'dragonfly', 'hubble', 'jwst'],
      sources: [
        { title: 'Saturn Moons', org: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/' },
        { title: 'Saturn Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html' },
        { title: 'Dragonfly', org: 'NASA Science', url: 'https://science.nasa.gov/mission/dragonfly/' }
      ],
      tags: ['saturn', 'rings', 'titan', 'enceladus', 'cassini', 'huygens', 'dragonfly', 'hexagon', 'roche limit', 'gas giant', 'ring age', 'moons']
    },

    /* -------------------------------------------------------------- URANUS */
    'uranus': {
      name: 'Uranus',
      tagline: 'The Sideways Planet',
      type: 'Ice giant',
      intro: 'Uranus is a pale blue-green ice giant that orbits the Sun tipped almost on its side. Only one spacecraft, Voyager 2 in 1986, has ever visited it.',
      everyday: 'Uranus rolls around the Sun like a ball on its side, so each pole gets about 42 years of continuous sunlight, then 42 years of darkness.',
      keyFacts: [
        'Uranus’s axis is tilted about 97.8° from vertical, so it spins nearly on its side relative to its orbit.',
        'One orbit around the Sun takes about 84 Earth years, and sunlight takes about 2 hours 40 minutes to arrive.',
        'The planet’s blue-green colour comes from methane, which absorbs red light in its hydrogen-helium atmosphere.',
        'NASA lists 28 known moons, named mostly after characters from the works of Shakespeare and Alexander Pope.',
        'Voyager 2 is the only spacecraft to have visited Uranus, flying past on 24 January 1986.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '2.87 billion km (19.2 AU)' },
        { label: 'Diameter (equatorial)', value: 'about 51,120 km' },
        { label: 'Length of day', value: 'about 17 h 14 min (retrograde)' },
        { label: 'Length of year', value: 'about 84 Earth years' },
        { label: 'Axial tilt', value: '97.77°' },
        { label: 'Coldest recorded atmosphere', value: 'about −224 °C (49 K)' }
      ],
      surprises: [
        'Uranus is the coldest planet in the Solar System, with a minimum recorded temperature of about −224 °C, even though Neptune is farther from the Sun. Uranus gives off very little internal heat.',
        'Uranus’s magnetic field is tilted about 59° from its spin axis and offset from the planet’s centre, so the field looks lopsided compared with Earth’s.'
      ],
      explore: [
        { heading: 'A planet tipped on its side', status: 'confirmed',
          body: 'Uranus’s spin axis lies almost in the plane of its orbit, tilted 97.77°, so its rotation is technically retrograde. As Uranus orbits, first one pole and then the other points toward the Sun, with 21-year seasons at the equator of extremes, and 42-year summers and winters at the poles. Near its 2007 equinox, Hubble and ground telescopes saw the sunlight angles change. Its moons and thin rings orbit in the same tilted plane as its equator.' },
        { heading: 'What caused the tilt?', status: 'hypothesis',
          body: 'The leading idea is that early in its history Uranus was struck by one or more large objects, perhaps an Earth-sized body, which knocked its axis sideways. Some simulations also suggest that a collision could have created a disk from which the moons formed. This is a hypothesis; no one has observed the impact. Other models suggest a large early moon could have tilted the planet slowly. Uranus’s rings, moons, interior and magnetic field might help distinguish these models, but we lack the data.' },
        { heading: 'An ice giant’s interior', status: 'hypothesis',
          body: 'Uranus is called an ice giant because it is rich in water, ammonia and methane, which scientists call “ices” because they were solid when the planet formed. Inside, those materials are thought to be hot, dense fluid under enormous pressure, beneath a hydrogen-helium atmosphere. Models of the interior depend on very few measurements, and it is possible that deep layers do not mix as simply as the standard picture suggests. Only Voyager 2’s single pass has measured its gravity and magnetic field close up.' },
        { heading: 'Will a spacecraft return?', status: 'open',
          body: 'The US planetary science decadal survey for 2023–2032 ranked a Uranus Orbiter and Probe as its highest-priority new flagship mission, with a launch window proposed for the early 2030s. It would orbit Uranus, drop a probe into the atmosphere and study its moons and rings. As far as could be verified in October 2026, it has not been approved as a funded mission, so whether and when Uranus will receive a visitor is unknown.' }
      ],
      discover: [
        { heading: 'Kepler’s third law at 19 AU', status: 'confirmed',
          body: 'Kepler’s third law links an orbit’s period to its size. When distances are measured in astronomical units and periods in years, the relation is simply T² = a³. For Uranus, a = 19.19 AU gives T = 19.19^1.5, about 84.1 years, matching observation. William Herschel found Uranus in 1781, and it has completed only a little more than 3 orbits since. The planet’s orbital speed averages about 6.8 km/s, compared with Earth’s 29.8 km/s, so a signal or spacecraft covers the long distance slowly. Radio signals take about 2.7 hours one way.',
          equation: 'T² = a³  (T in years, a in AU)',
          equationNote: 'T = orbital period, a = semi-major axis. The general form is T = 2π √(a³ / GM).' },
        { heading: 'Extreme seasons and a puzzling energy budget', status: 'open',
          body: 'With a 97.77° tilt, the Sun can pass almost directly overhead at a pole at solstice, and the opposite hemisphere then lies in darkness for decades. Yet Voyager 2 found the equator was not much colder than the sunlit pole, and heat measurements suggested very little internal energy leaks out, unlike the other giant planets. Why Uranus’s interior seems to be so cold is unexplained. One proposal links it to the giant-impact tilt event, which might have disrupted the interior or trapped heat. The question awaits new measurements.' }
      ],
      hotspots: [
        { id: 'south-polar-region', label: 'South polar region', text: 'During Voyager 2’s 1986 flyby, the south pole pointed almost straight at the Sun. Its haze looked bright and the south was in summer. Position is illustrative.', lat: -75, lon: 0 },
        { id: 'faint-rings', label: 'Faint rings', text: 'Uranus has 13 known narrow, dark rings of ice and dust, first detected in 1977 when they dimmed the light of a star. Position is illustrative.', lat: 0, lon: 60 },
        { id: 'magnetic-field', label: 'Tilted magnetic field', text: 'Voyager 2 found a magnetic field tilted about 59° from the spin axis and offset from the planet’s centre. The reason is not fully understood. Position is illustrative.', lat: -20, lon: -55 },
        { id: 'seasonal-clouds', label: 'Seasonal clouds', text: 'Telescopes have seen bright methane clouds and storms appear in the northern hemisphere as it came into sunlight after the 2007 equinox. Position is illustrative.', lat: 40, lon: -20 }
      ],
      missions: ['voyager-2', 'hubble', 'jwst'],
      sources: [
        { title: 'Uranus', org: 'NASA Science', url: 'https://science.nasa.gov/uranus/' },
        { title: 'Uranus Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html' }
      ],
      tags: ['uranus', 'ice giant', 'sideways planet', 'axial tilt', 'voyager 2', 'herschel', 'miranda', 'rings', 'seasons', 'uranus orbiter and probe', 'giant impact']
    },

    /* ------------------------------------------------------------- NEPTUNE */
    'neptune': {
      name: 'Neptune',
      tagline: 'The Windy Ice Giant',
      type: 'Ice giant',
      intro: 'Neptune is the most distant major planet, a deep-blue ice giant with the fastest winds measured on any planet. It was found by mathematics before anyone saw it, and Voyager 2 is the only spacecraft to have visited.',
      everyday: 'Neptune’s winds can blow at up to about 2,100 km/h, faster than the speed of sound in Earth’s air at sea level, which is about 1,235 km/h.',
      keyFacts: [
        'Neptune orbits at about 30 AU from the Sun, and its one orbit takes about 164.8 Earth years.',
        'Its winds reach up to about 2,100 km/h, the fastest measured in the Solar System.',
        'Neptune was predicted by calculation and found in 1846, the first planet discovered by mathematical prediction.',
        'Voyager 2 flew past Neptune on 25 August 1989 and remains the only spacecraft to have visited it.',
        'NASA lists 16 known moons, the largest being Triton, which orbits backward relative to Neptune’s spin.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '4.5 billion km (30.1 AU)' },
        { label: 'Diameter (equatorial)', value: 'about 49,240 km' },
        { label: 'Length of day', value: 'about 16 h 6 min' },
        { label: 'Length of year', value: 'about 164.8 Earth years' },
        { label: 'Maximum wind speed', value: 'up to about 2,100 km/h' },
        { label: 'Temperature at the 1-bar level', value: 'about −200 °C' }
      ],
      surprises: [
        'Neptune completed its first full orbit since its 1846 discovery in 2011. Its year is so long that the planet has made only one trip around the Sun since astronomers first identified it.',
        'The Great Dark Spot seen by Voyager 2 in 1989 had vanished when Hubble looked in 1994. Dark spots have since appeared and faded, so Neptune’s storms are short-lived compared with Jupiter’s.'
      ],
      explore: [
        { heading: 'Found by calculation', status: 'confirmed',
          body: 'Uranus did not follow its predicted orbit exactly, and in the 1840s Urbain Le Verrier in France and John Couch Adams in England independently calculated that an unseen planet’s gravity could explain the pull. On 23 September 1846 Johann Galle in Berlin found Neptune within about 1° of Le Verrier’s predicted position. It is too faint to see with the naked eye, and its orbit takes about 164.8 years, so it remains a lonely, slow-moving world at the edge of the planets.' },
        { heading: 'Supersonic winds and fading storms', status: 'confirmed',
          body: 'Neptune receives about 900 times less sunlight than Earth, yet it has the fastest winds of any planet, up to about 2,100 km/h. Voyager 2 also recorded a Great Dark Spot, an oval storm about the size of Earth, and a bright, fast-moving cloud nicknamed Scooter. Hubble later showed the Great Dark Spot was gone, and new dark spots have since formed. Neptune also gives off about 2.6 times more energy than it takes in from the Sun, which shows an internal heat source.' },
        { heading: 'Triton: a captured world?', status: 'hypothesis',
          body: 'Triton, about 2,700 km wide, circles Neptune in the opposite direction to the planet’s rotation, a retrograde orbit that moons formed alongside their planet would not normally have. The leading explanation is that Triton was a Kuiper Belt object captured by Neptune’s gravity, probably after interacting with a binary partner. If so, it is a relative of Pluto. Voyager 2 saw nitrogen geysers and a young surface, with temperatures near −235 °C. Triton’s orbit is slowly shrinking, but not on a timescale of human interest.' },
        { heading: 'Why Neptune is an unsolved puzzle', status: 'open',
          body: 'Why Neptune’s winds are so fast despite weak sunlight is unresolved, as is what drives them. Neptune’s internal structure, its offset magnetic field and its heat source are known only from one flyby. Observations from Webb and Hubble now track clouds and aurorae, but the cause of the long-term cloud changes, which follow the Sun’s cycle, is still debated. No mission to Neptune has been approved, so answers will probably come from telescopes for now.' }
      ],
      discover: [
        { heading: 'Kepler’s third law and the 1846 prediction', status: 'confirmed',
          body: 'Neptune’s semi-major axis of 30.07 AU gives a period of 30.07^1.5, about 164.9 years, matching the measured value. The calculation that found it used perturbation theory: Uranus’s observed position differed from the Newtonian prediction by a small angle, and Le Verrier and Adams worked backward to infer a planet’s mass and orbit. Their orbit estimates were imperfect, and the predicted distance was too large, but the direction was close enough to lead to discovery. It was a major success for Newtonian gravity.',
          equation: 'T² = a³  (T in years, a in AU)',
          equationNote: 'T = orbital period, a = semi-major axis. Neptune: 30.07³ ≈ 27,190, so T ≈ 164.9 years.' },
        { heading: 'Zonal jets: banded winds on a giant planet', status: 'open',
          body: 'Neptune’s winds are zonal, flowing mostly east–west along lines of latitude. Voyager 2 and later telescopes found retrograde (westward) winds of about 400 m/s near the equator and prograde winds at higher latitudes, with peak speeds near 580 m/s, about 2,100 km/h. With rotation rate Ω ≈ 1.08 × 10⁻⁴ rad/s, the Coriolis force strongly organises the flow into jets. Whether the jets are shallow, driven by weather layers near the top, or deep, extending far into the interior, is not known. Without data on Neptune’s gravity field, the question is unlikely to be settled soon.',
          equation: 'f = 2Ω sin φ',
          equationNote: 'f = Coriolis parameter, Ω = rotation rate, φ = latitude.' }
      ],
      hotspots: [
        { id: 'great-dark-spot', label: 'Great Dark Spot', text: 'An oval storm about the size of Earth seen by Voyager 2 in 1989. It had disappeared by Hubble’s 1994 observations, and other dark spots have since come and gone.', lat: -22, lon: -30 },
        { id: 'scooter', label: 'Scooter', text: 'A small, bright white cloud that circled Neptune faster than the Great Dark Spot in Voyager 2’s images, taking about 16 hours. Position is illustrative.', lat: -42, lon: 40 },
        { id: 'equatorial-jet', label: 'Equatorial jet', text: 'A westward flow of roughly 400 m/s blows along the equator, against the planet’s rotation. Neptune’s fastest winds occur at higher latitudes. Position is illustrative.', lat: 0, lon: 55 },
        { id: 'northern-dark-spot', label: 'Northern dark spots', text: 'Hubble has seen dark vortices appear in the northern hemisphere in recent years, with bright companion clouds. They typically last a few years. Position is illustrative.', lat: 30, lon: -60 }
      ],
      missions: ['voyager-2', 'hubble', 'jwst'],
      sources: [
        { title: 'Neptune', org: 'NASA Science', url: 'https://science.nasa.gov/neptune/' },
        { title: 'Neptune Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html' }
      ],
      tags: ['neptune', 'ice giant', 'triton', 'voyager 2', 'great dark spot', 'winds', 'le verrier', 'adams', 'galle', 'discovery', 'kepler', 'retrograde moon']
    }

  });
})(window);
