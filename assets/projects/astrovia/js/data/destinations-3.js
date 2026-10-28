/* ==========================================================================
   ASTROVIA — data/destinations-3.js
   Content for: asteroid-belt, kuiper-belt, oort-cloud, heliosphere, interstellar.
   These are REGIONS: hotspots have no lat/lon (the 3D scene anchors them by id/order).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.destinations = A.destinations || {};
  Object.assign(A.destinations, {

    /* -------------------------------------------------------- ASTEROID BELT */
    'asteroid-belt': {
      name: 'Asteroid Belt',
      tagline: 'Between Mars and Jupiter',
      type: 'Region of small rocky bodies',
      intro: 'The main asteroid belt is a wide ring of rocky and metallic leftovers from the Solar System’s birth, orbiting the Sun between Mars and Jupiter. Despite its name, it is mostly empty space.',
      everyday: 'Picture a few million pebbles scattered across a region wider than the whole inner Solar System: any two asteroids are usually hundreds of thousands of kilometres apart.',
      keyFacts: [
        'The main belt lies roughly 2.2 to 3.2 AU from the Sun, between the orbits of Mars and Jupiter.',
        'Astronomers have catalogued well over a million asteroids; most are far smaller than 1 km across.',
        'All the belt’s asteroids together hold only a few percent of the Moon’s mass.',
        'Ceres, about 940 km across, holds roughly a quarter to a third of the belt’s total mass and is classed as a dwarf planet.',
        'Spacecraft have crossed the belt many times without any special avoidance manoeuvres.'
      ],
      measurements: [
        { label: 'Distance from the Sun', value: 'about 2.2–3.2 AU (330–480 million km)' },
        { label: 'Largest body (Ceres) diameter', value: 'about 940 km' },
        { label: 'Vesta mean diameter', value: 'about 525 km' },
        { label: 'Total mass', value: 'a few percent of the Moon’s mass' },
        { label: 'Orbital period of a typical asteroid', value: 'about 3.3 to 6 years' }
      ],
      surprises: [
        'Some asteroids have their own moons, and many are “rubble piles”: loose heaps of rock held together by weak gravity rather than solid boulders.',
        'NASA’s DART spacecraft deliberately hit the small moonlet Dimorphos in 2022 and measurably changed its orbit, the first time humans altered the motion of a celestial body.'
      ],
      explore: [
        { heading: 'Why a planet never formed here', status: 'hypothesis',
          body: 'The leading explanation is that Jupiter’s gravity stirred up the region early in the Solar System’s history. Objects here were nudged into faster, more violent collisions that broke bodies apart instead of letting them merge into a planet. This model matches many observations, but the details of how the early belt was emptied are still being refined. The tour visits the belt after Neptune for storytelling reasons; physically it lies much closer to the Sun, between Mars and Jupiter.' },
        { heading: 'Mostly empty space', status: 'confirmed',
          body: 'Films show asteroid fields as dense and dangerous. In reality the belt is vast and sparse. Space probes such as Pioneer 10, Voyager, Galileo, Cassini and Dawn have all passed through or lived in the belt safely. Mission planners must aim carefully to reach a chosen asteroid, because there is usually nothing else nearby.' },
        { heading: 'Ceres and Vesta', status: 'confirmed',
          body: 'NASA’s Dawn spacecraft orbited Vesta from 2011 to 2012 and Ceres from 2015 to 2018. Vesta is a rocky world with a giant impact basin near its south pole. Ceres is darker and icier, with bright salt-rich patches in Occator Crater, evidence that briny liquid reached the surface in geologically recent times.' },
        { heading: 'Samples from small bodies', status: 'confirmed',
          body: 'Japan’s Hayabusa2 returned material from the asteroid Ryugu in 2020, and NASA’s OSIRIS-REx returned material from Bennu in 2023. Both asteroids are near-Earth objects, not main-belt members, but they are fragments thought to come from the belt. Their samples contain carbon-rich material and water-bearing minerals that help scientists study the early Solar System.' }
      ],
      discover: [
        { heading: 'Kirkwood gaps and orbital resonance', status: 'confirmed',
          body: 'Asteroid orbits are not spread evenly. Gaps appear where an asteroid’s orbital period is a simple fraction of Jupiter’s, such as 3:1 near 2.5 AU. Repeated, regular tugs from Jupiter build up and pump up the asteroid’s eccentricity until it leaves the region or is scattered. Not every resonance clears a gap; some, like 3:2, hold groups of asteroids instead.',
          equation: 'a³ = T²  (a in AU, T in years, bodies orbiting the Sun)',
          equationNote: 'Kepler’s third law. Jupiter’s period is about 11.86 years, so the 3:1 resonance period is about 3.95 years, giving a ≈ 2.50 AU.' },
        { heading: 'Spectral types and what they tell us', status: 'confirmed',
          body: 'Asteroids are grouped by how they reflect sunlight. C-type asteroids are dark and carbon-rich and dominate the outer belt. S-type asteroids are stony and brighter and are more common in the inner belt. M-type asteroids may be metal-rich. This rough sorting by distance from the Sun reflects both the temperatures where they formed and later mixing; how exactly the mixing occurred is still studied.' }
      ],
      hotspots: [
        { id: 'ceres', label: 'Ceres', text: 'The largest object in the belt and a dwarf planet, about 940 km across. Dawn found bright salt deposits in Occator Crater and ice just beneath the surface.' },
        { id: 'vesta', label: 'Vesta', text: 'A large rocky body, about 525 km across, with a huge impact basin at its south pole. Many meteorites found on Earth are thought to come from Vesta.' },
        { id: 'empty-space', label: 'Mostly empty space', text: 'Asteroids here are typically separated by hundreds of thousands of kilometres. The belt is far less crowded than it is usually drawn.' },
        { id: 'kirkwood-gaps', label: 'Kirkwood gaps', text: 'Narrow zones depleted of asteroids, where orbits are in resonance with Jupiter’s orbital period and are gradually pulled out of place.' }
      ],
      missions: ['dawn', 'psyche', 'osiris-rex', 'hayabusa2', 'lucy', 'dart'],
      sources: [
        { title: 'Asteroids', org: 'NASA Science', url: 'https://science.nasa.gov/solar-system/asteroids/' },
        { title: 'Dawn mission overview', org: 'NASA / JPL', url: 'https://science.nasa.gov/mission/dawn/' },
        { title: 'Ceres', org: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/ceres/' }
      ],
      tags: ['asteroid belt', 'main belt', 'asteroids', 'ceres', 'vesta', 'kirkwood', 'resonance', 'meteorite', 'dwarf planet', 'rubble pile', 'bennu', 'ryugu', 'dimorphos']
    },

    /* --------------------------------------------------------- KUIPER BELT */
    'kuiper-belt': {
      name: 'Kuiper Belt',
      tagline: 'The Realm of Icy Worlds',
      type: 'Region of icy bodies beyond Neptune',
      intro: 'Beyond Neptune lies a vast, cold ring of icy bodies left over from the formation of the planets. It is home to dwarf planets, including Pluto, and is a source of some comets.',
      everyday: 'Sunlight at this distance is about a thousand times fainter than at Earth, so the Sun looks like a very bright star rather than a warm disc.',
      keyFacts: [
        'The main Kuiper Belt extends from about 30 AU, near Neptune’s orbit, to roughly 50 AU from the Sun.',
        'Thousands of Kuiper Belt objects are known, and astronomers estimate that very many more exist.',
        'Pluto, Eris, Haumea and Makemake are the best-known dwarf planets in or near the belt.',
        'NASA’s New Horizons flew past Pluto in July 2015 and past the Kuiper Belt object Arrokoth in January 2019.',
        'Many short-period comets are thought to originate in the Kuiper Belt or the scattered disc beyond it.'
      ],
      measurements: [
        { label: 'Distance from the Sun', value: 'about 30–50 AU (4.5–7.5 billion km)' },
        { label: 'Pluto diameter', value: 'about 2,377 km' },
        { label: 'Pluto orbital period', value: 'about 248 years' },
        { label: 'Pluto’s known moons', value: '5' },
        { label: 'Typical temperature', value: 'around −230 °C (about 40 K)' }
      ],
      surprises: [
        'Pluto has a vast, bright plain of nitrogen ice called Sputnik Planitia, and it shows signs of geological activity, much more than scientists expected before New Horizons arrived.',
        'Arrokoth looks like two flattened lobes gently stuck together, a shape that supports models in which small icy bodies formed by slow, gentle gathering rather than violent collisions.'
      ],
      explore: [
        { heading: 'What the Kuiper Belt is', status: 'confirmed',
          body: 'The Kuiper Belt is a disc-shaped region of small icy bodies, rock mixed with frozen water, methane and ammonia, orbiting beyond Neptune. Because it is so cold and so far from the Sun, these objects are among the least altered remnants from the time the planets formed. Most Kuiper Belt objects are far too faint to see without large telescopes.' },
        { heading: 'Pluto up close', status: 'confirmed',
          body: 'Before 2015 Pluto was a fuzzy dot. New Horizons revealed mountains of water ice, glaciers of nitrogen ice, a thin hazy atmosphere and a large heart-shaped region. Pluto’s largest moon, Charon, is about half Pluto’s diameter, so the two orbit a point in the space between them and are often described as a double system.' },
        { heading: 'Why Pluto is a dwarf planet', status: 'confirmed',
          body: 'In 2006 the International Astronomical Union defined a planet as a body that orbits the Sun, is massive enough to be round, and has cleared its orbital neighbourhood of other objects. Pluto meets the first two criteria but not the third, so it was classified as a dwarf planet. The decision followed the discovery of similar-sized bodies like Eris, which showed Pluto was not unique.' },
        { heading: 'How the belt came to be', status: 'hypothesis',
          body: 'Many models suggest that the giant planets moved after they formed. As Neptune migrated outward, it may have scattered and captured icy bodies into the patterns seen today, such as objects locked in resonance with Neptune. This picture explains several features of the belt, but the exact history is still debated.' },
        { heading: 'Is there a Planet Nine?', status: 'open',
          body: 'Some astronomers have proposed that an undiscovered planet several times Earth’s mass orbits far beyond Neptune, to explain the clustered orbits of a few distant objects. This idea, often called Planet Nine, is unconfirmed. No such planet has been observed, and other explanations, including observational bias, are being tested.' }
      ],
      discover: [
        { heading: 'Resonances with Neptune', status: 'confirmed',
          body: 'A large group of Kuiper Belt objects, the plutinos, orbit in a 3:2 resonance with Neptune: they complete two orbits in the time Neptune completes three. Pluto is one. The resonance protects them from close encounters with Neptune despite crossing its orbit. Other populations include classical objects on nearly circular orbits, and scattered-disc objects on elongated paths.',
          equation: 'P = a^(3/2)  (P in years, a in AU)',
          equationNote: 'Kepler’s third law for orbits around the Sun. For a = 39.5 AU, P ≈ 248 years, close to Pluto’s period.' },
        { heading: 'Surface chemistry and colours', status: 'confirmed',
          body: 'Kuiper Belt objects range from grey to deep red. Spectra show ices of water, methane, nitrogen and carbon monoxide on different bodies, and the red colour is thought to come from complex organic molecules produced when radiation processes simple ices. Pluto’s atmosphere forms by sublimation of nitrogen ice, and it thickens or collapses as Pluto moves along its elongated orbit.' }
      ],
      hotspots: [
        { id: 'pluto', label: 'Pluto', text: 'A dwarf planet about 2,377 km across with mountains of water ice, nitrogen glaciers and a thin atmosphere, seen up close by New Horizons in 2015.' },
        { id: 'charon', label: 'Charon', text: 'Pluto’s largest moon, about 1,210 km across. Pluto and Charon orbit a point between them, so the pair is often treated as a double system.' },
        { id: 'eris', label: 'Eris', text: 'A dwarf planet about as large as Pluto, more massive than it, whose discovery in 2005 helped lead to the 2006 definition of “planet”. It orbits in the scattered disc.' },
        { id: 'arrokoth', label: 'Arrokoth', text: 'A contact-binary object about 36 km long, visited by New Horizons in 2019. Its gently joined lobes hint at how small icy bodies form.' }
      ],
      missions: ['new-horizons', 'hubble', 'jwst'],
      sources: [
        { title: 'Kuiper Belt', org: 'NASA Science', url: 'https://science.nasa.gov/solar-system/kuiper-belt/' },
        { title: 'Pluto', org: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/pluto/' },
        { title: 'New Horizons', org: 'NASA / JHU APL', url: 'https://science.nasa.gov/mission/new-horizons/' }
      ],
      tags: ['kuiper belt', 'pluto', 'charon', 'eris', 'haumea', 'makemake', 'arrokoth', 'dwarf planet', 'new horizons', 'plutino', 'trans-neptunian', 'planet nine', 'comets', 'iau 2006', 'scattered disc']
    },

    /* ----------------------------------------------------------- OORT CLOUD */
    'oort-cloud': {
      name: 'Oort Cloud',
      tagline: 'The Hypothesized Cometary Reservoir',
      type: 'Hypothesized spherical shell of icy bodies',
      intro: 'The Oort Cloud is a proposed, far-flung shell of icy bodies surrounding the Solar System. It has never been directly observed. Scientists infer it from the orbits of comets that arrive from every direction.',
      everyday: 'Light crosses the Earth–Moon gap in about a second, but would need well over a year to reach the far edge of the Oort Cloud, if it exists as imagined.',
      keyFacts: [
        'The Oort Cloud is a hypothesis: no object has been directly confirmed to lie in it.',
        'Long-period comets with orbits lasting many thousands of years arrive from all directions, which suggests a roughly spherical source.',
        'Its inner edge may begin near 2,000 AU, and its outer edge may extend to about 100,000 AU or more.',
        'The outer cloud is loosely bound, so passing stars and the Milky Way’s tides can disturb it and send comets inward.',
        'Dutch astronomer Jan Oort proposed the idea in 1950.'
      ],
      measurements: [
        { label: 'Inner edge (estimated)', value: 'about 2,000 AU (uncertain)' },
        { label: 'Outer edge (estimated)', value: 'about 50,000–100,000 AU or more (uncertain)' },
        { label: 'Outer edge in light-years', value: 'roughly 0.8–1.6 ly or more' },
        { label: 'Orbital period at 50,000 AU', value: 'on the order of 10 million years' },
        { label: 'Number of bodies', value: 'unknown; estimates range up to trillions' }
      ],
      surprises: [
        'A comet from the Oort Cloud can take millions of years to loop in from where it began, so comets that return only once in recorded history are visitors on journeys that began long before humans existed.',
        'Even Voyager 1, travelling at about 17 km/s, would need roughly 300 years to reach the inner edge of the cloud, and tens of thousands of years to cross it.'
      ],
      explore: [
        { heading: 'Why scientists think it exists', status: 'hypothesis',
          body: 'Comets with very long orbits arrive from all directions and at all angles to the planets, not just near the plane of the planets. Jan Oort noticed in 1950 that their orbits suggest a distant, roughly spherical reservoir. Nobody has seen the cloud itself: the bodies in it would be small, dark and extremely faint. Its existence is the best explanation we have, not a direct observation.' },
        { heading: 'What it may be made of', status: 'hypothesis',
          body: 'The cloud is thought to contain icy bodies, frozen water, methane, ammonia and dust, that formed closer to the Sun, probably near the giant planets. Gravity from those planets then scattered them outward. Passing stars and the galaxy’s own gravity then rounded the orbits into a sphere. This formation story is a model that fits comet observations, and details remain uncertain.' },
        { heading: 'How uncertain is its structure?', status: 'open',
          body: 'Scientists do not know the cloud’s true size, its mass, or how many bodies it holds. Some models describe a flatter, doughnut-shaped inner part, sometimes called the Hills cloud, and a more spherical outer part. Others disagree about how dense each part is. These uncertainties are why diagrams of the Oort Cloud should always be read as illustrations.' },
        { heading: 'Where it sits compared to the heliosphere', status: 'confirmed',
          body: 'The heliosphere, the bubble blown by the solar wind, ends around 120 AU. The hypothesized Oort Cloud begins far beyond that, more than ten times farther out. The Sun’s gravity still dominates out there, so Oort Cloud bodies orbit the Sun even though they lie in interstellar space as far as the solar wind is concerned.' }
      ],
      discover: [
        { heading: 'Orbits of long-period comets', status: 'confirmed',
          body: 'For a comet whose orbit has a semi-major axis a (in AU), the period in years follows from Kepler’s third law. A comet with aphelion near 50,000 AU has a ≈ 25,000 AU and a period of roughly four million years. Because the orbits are so elongated, a small kick at aphelion, from a passing star or a galactic tide, can change the perihelion distance a lot and send a comet toward the Sun.',
          equation: 'P = a^(3/2)  (P in years, a in AU)',
          equationNote: 'For a = 25,000 AU, P ≈ 3.95 × 10⁶ years.' },
        { heading: 'Galactic tides and passing stars', status: 'hypothesis',
          body: 'Models of the outer cloud suggest the Milky Way’s tidal field, which varies slowly as the Sun orbits the galaxy, is the dominant disturbance for the loosely bound comets, and occasional stellar encounters add to it. These perturbations explain why comets seem to arrive over time, but the model depends on assumptions about the cloud’s mass and structure that cannot yet be tested directly.' }
      ],
      hotspots: [
        { id: 'inner-oort-cloud', label: 'Inner Oort Cloud', text: 'The denser, possibly flattened region starting near 2,000 AU. It is more tightly bound to the Sun. Its structure is uncertain.' },
        { id: 'outer-oort-cloud', label: 'Outer Oort Cloud', text: 'The hypothesized spherical shell reaching tens of thousands of AU. Bodies here are loosely bound and easily disturbed.' },
        { id: 'long-period-comets', label: 'Long-period comets', text: 'Comets with orbits of hundreds to millions of years. Their directions of arrival are the main evidence for the cloud.' },
        { id: 'sun-from-here', label: 'The Sun from here', text: 'From the outer cloud the Sun would shine as just a very bright star, with no visible disc. Its gravity still holds these bodies in orbit.' }
      ],
      missions: ['voyager-1', 'new-horizons', 'interstellar-probe'],
      sources: [
        { title: 'Oort Cloud', org: 'NASA Science', url: 'https://science.nasa.gov/solar-system/oort-cloud/' },
        { title: 'Comets', org: 'NASA Science', url: 'https://science.nasa.gov/solar-system/comets/' }
      ],
      tags: ['oort cloud', 'comets', 'long-period comets', 'hills cloud', 'jan oort', 'reservoir', 'hypothesis', 'outer solar system', 'tides', 'aphelion']
    },

    /* ---------------------------------------------------------- HELIOSPHERE */
    'heliosphere': {
      name: 'Heliosphere and Heliopause',
      tagline: 'The Sun’s Protective Bubble',
      type: 'Magnetic bubble of solar wind',
      intro: 'The Sun constantly blows a stream of charged particles called the solar wind. Together with the Sun’s magnetic field, it inflates a vast bubble, the heliosphere, that shields the planets from much of the radiation between the stars.',
      everyday: 'Think of the heliosphere like the wake around a boat moving through water: the solar wind pushes outward until the pressure of the surrounding interstellar gas pushes back.',
      keyFacts: [
        'The solar wind flows at roughly 400 km/s on average, and up to about 750 km/s in fast streams.',
        'The heliopause is the boundary where interstellar plasma begins to dominate over the solar wind.',
        'Voyager 1 crossed the heliopause in 2012 at about 121 AU, and Voyager 2 crossed in 2018 at about 119 AU.',
        'The heliosphere blocks a large share of the galactic cosmic rays, though not all of them.',
        'The Sun’s gravity reaches far beyond the heliopause, so the Voyagers are still in the Solar System in a gravitational sense.'
      ],
      measurements: [
        { label: 'Termination shock (Voyager 1, 2004)', value: 'about 94 AU' },
        { label: 'Termination shock (Voyager 2, 2007)', value: 'about 84 AU' },
        { label: 'Heliopause (Voyager 1, 2012)', value: 'about 121 AU' },
        { label: 'Heliopause (Voyager 2, 2018)', value: 'about 119 AU' },
        { label: 'Typical solar wind speed', value: 'about 400 km/s' }
      ],
      surprises: [
        'Voyager 1 and 2 are the only spacecraft to have measured interstellar plasma directly. Voyager 1 found that the plasma outside the heliopause is denser than inside it.',
        'The bubble’s shape is still debated: it may be a long comet-like tail, a rounder shape, or something in between. Different instruments and models give different answers.'
      ],
      explore: [
        { heading: 'The solar wind', status: 'confirmed',
          body: 'The Sun’s outer atmosphere, the corona, is so hot that particles escape its gravity and stream outward as a charged gas called plasma. This solar wind sweeps past every planet. It carries the Sun’s magnetic field with it, which is why the heliosphere is a magnetic structure as well as a flow of particles.' },
        { heading: 'Layers of the bubble', status: 'confirmed',
          body: 'Moving outward, the solar wind slows suddenly at the termination shock, where its speed drops below the speed of the wave motion in the plasma. Beyond it lies the heliosheath, a hotter, more turbulent region. The outer boundary is the heliopause, where the solar wind’s pressure balances the pressure from the interstellar medium. Voyager 1 and 2 passed through all three.' },
        { heading: 'A shield for life', status: 'confirmed',
          body: 'Galactic cosmic rays, very fast particles from outside the Solar System, constantly rain in on the heliosphere. The bubble deflects and slows many of the lower-energy ones. This reduces the radiation reaching the inner Solar System, although the highest-energy particles still get through. How much the shield matters for planetary environments is still being studied.' },
        { heading: 'What shape is it?', status: 'open',
          body: 'Models disagree about the heliosphere’s overall shape. One long-held view imagined a comet shape with a long tail. Newer models suggest it could be rounder, or shaped like a croissant. Measurements from the two Voyagers, NASA’s IBEX mission and the Cassini spacecraft each give pieces of the puzzle. NASA’s IMAP mission was designed to help map the boundary further.' }
      ],
      discover: [
        { heading: 'Where is the heliopause?', status: 'confirmed',
          body: 'The heliopause lies roughly where the ram pressure of the solar wind equals the pressure of the interstellar medium. Solar wind density falls as the inverse square of distance, so the balance point depends on the density and speed of both flows, on the solar cycle, and on the direction of travel through the interstellar cloud. This is why the Voyagers, headed in different directions during different parts of the solar cycle, found slightly different distances.',
          equation: 'ρ_sw v_sw² ∝ 1/r²   (ram pressure of the solar wind)',
          equationNote: 'ρ_sw is the solar wind mass density, v_sw its speed and r the distance from the Sun. The heliopause is near where this pressure matches that of the interstellar medium.' },
        { heading: 'The Parker spiral', status: 'confirmed',
          body: 'Because the Sun rotates about once every 25 to 35 days while the solar wind flows outward, the magnetic field lines are drawn into a spiral, like water from a rotating sprinkler. Near Earth the field makes an angle of about 45° to the Sun–Earth line, and the spiral becomes tightly wound farther out. Eugene Parker predicted this structure in the 1950s, and spacecraft later confirmed it.' }
      ],
      hotspots: [
        { id: 'termination-shock', label: 'Termination shock', text: 'The boundary where the solar wind abruptly slows. Voyager 1 crossed it in 2004 at about 94 AU and Voyager 2 in 2007 at about 84 AU.' },
        { id: 'heliosheath', label: 'Heliosheath', text: 'A hot, turbulent layer between the termination shock and the heliopause, where the slowed solar wind piles up.' },
        { id: 'heliopause', label: 'Heliopause', text: 'The outer boundary of the heliosphere, where interstellar plasma begins to dominate. Voyager 1 crossed it in 2012 and Voyager 2 in 2018.' },
        { id: 'voyagers', label: 'The Voyagers', text: 'Launched in 1977, Voyager 1 and 2 are the only human-made objects to have entered interstellar space. Their remaining power is limited.' }
      ],
      missions: ['voyager-1', 'voyager-2', 'ibex', 'parker-solar-probe', 'interstellar-probe'],
      sources: [
        { title: 'Heliosphere', org: 'NASA Science', url: 'https://science.nasa.gov/heliophysics/focus-areas/heliosphere/' },
        { title: 'Voyager mission', org: 'NASA / JPL', url: 'https://science.nasa.gov/mission/voyager/' },
        { title: 'IBEX mission', org: 'NASA', url: 'https://science.nasa.gov/mission/ibex/' }
      ],
      tags: ['heliosphere', 'heliopause', 'solar wind', 'termination shock', 'heliosheath', 'voyager', 'cosmic rays', 'bubble', 'ibex', 'imap', 'parker spiral', 'interstellar boundary']
    },

    /* --------------------------------------------------------- INTERSTELLAR */
    'interstellar': {
      name: 'Interstellar Space',
      tagline: 'Between the Stars',
      type: 'Interstellar medium',
      intro: 'Space between the stars is not empty. It contains thin gas, tiny dust grains, cosmic rays, radiation and magnetic fields, together known as the interstellar medium. It is the raw material for future stars.',
      everyday: 'Each cubic centimetre holds about one atom, yet across light-years there is enough gas and dust to build entire stars.',
      keyFacts: [
        'About 99% of the interstellar medium’s mass is gas, mostly hydrogen and helium, and about 1% is dust.',
        'A typical density is around one hydrogen atom per cubic centimetre, with huge variation from region to region.',
        'The Sun is moving through the Local Interstellar Cloud, inside a larger, sparser cavity called the Local Bubble.',
        'Voyager 1 and 2 are the only spacecraft to measure interstellar plasma directly.',
        'Three confirmed interstellar objects have been detected passing through the Solar System: 1I/ʻOumuamua, 2I/Borisov and 3I/ATLAS.'
      ],
      measurements: [
        { label: 'Typical gas density', value: 'about 1 atom per cm³ (varies widely)' },
        { label: 'Mass in gas vs dust', value: 'about 99% gas, 1% dust' },
        { label: 'Distance to nearest star', value: 'about 4.24 ly (Proxima Centauri)' },
        { label: 'Voyager 1 speed', value: 'about 17 km/s' },
        { label: 'Size of Local Bubble', value: 'roughly 300 ly across' }
      ],
      surprises: [
        'Voyager 1 detected the faint “hum” of interstellar plasma oscillations after solar outbursts, which let scientists measure its density directly, beyond the reach of any telescope.',
        'Interstellar space is cold but also contains hot regions: the Local Bubble is filled with very thin gas at around a million degrees, probably heated by past supernovae.'
      ],
      explore: [
        { heading: 'What fills the gaps between stars', status: 'confirmed',
          body: 'The interstellar medium is mostly hydrogen, with helium and traces of heavier elements. It exists in several phases: cold, dense clouds of molecular gas where stars are born, warmer neutral gas and extremely hot, thin gas. Telescopes detect it through its radio emission, through the starlight it absorbs and through the glow of its dust.' },
        { heading: 'Dust, light and colour', status: 'confirmed',
          body: 'Tiny grains of silicates and carbon, mostly less than a micron across, absorb and scatter starlight. This makes distant stars look dimmer and redder, and it blocks visible light from the centre of the galaxy. Infrared and radio telescopes can see through dust, which is why they are so important for studying star formation.' },
        { heading: 'Magnetic fields and cosmic rays', status: 'confirmed',
          body: 'A weak magnetic field threads the galaxy and guides charged particles. Cosmic rays, mostly fast protons and atomic nuclei accelerated by events like supernovae, spiral along these fields. Voyager 1 measured how cosmic-ray intensity increased as it left the shelter of the heliosphere, directly showing how the bubble acts as a shield.' },
        { heading: 'Visitors from other star systems', status: 'confirmed',
          body: 'In 2017 astronomers found 1I/ʻOumuamua, the first confirmed object on an orbit that did not belong to the Solar System. 2I/Borisov, a comet, followed in 2019. A third, 3I/ATLAS, was discovered in 2025. Each is thought to be a natural object from another star system; what they are made of and where each came from are active research questions.' }
      ],
      discover: [
        { heading: 'Phases of the interstellar medium', status: 'confirmed',
          body: 'The medium is commonly described as several coexisting phases: cold molecular clouds (about 10–20 K), the cold and warm neutral medium (roughly 100 K and 6,000–10,000 K), the warm ionised medium (around 8,000 K) and hot ionised gas (around 10⁶ K) produced by supernovae. They are roughly in pressure balance. Spectroscopic lines such as the 21 cm hydrogen line and CO rotational lines trace the cold phases.',
          equation: 'λ = 21 cm  (hydrogen hyperfine transition, ν ≈ 1420.4 MHz)',
          equationNote: 'A forbidden transition of neutral hydrogen, used to map the galaxy’s gas with radio telescopes.' },
        { heading: 'Plasma beyond the heliopause', status: 'confirmed',
          body: 'Voyager 1’s plasma-wave instrument detected oscillations at the local plasma frequency, which depends on electron density. This showed the interstellar plasma just outside the heliopause has an electron density of roughly 0.1 per cm³, higher than inside the heliosphere. The relation below links the frequency to density, letting a spacecraft measure the density without a direct particle count.',
          equation: 'f_p ≈ 8.98 kHz × √(n_e / cm⁻³)',
          equationNote: 'f_p is the plasma frequency and n_e the electron number density.' }
      ],
      hotspots: [
        { id: 'local-interstellar-cloud', label: 'Local Interstellar Cloud', text: 'The wisp of warm gas, a few tens of light-years across, that the Solar System is currently passing through.' },
        { id: 'dust-grains', label: 'Dust grains', text: 'Microscopic silicate and carbon grains that dim and redden starlight and can be seen glowing in infrared light.' },
        { id: 'magnetic-fields', label: 'Magnetic fields', text: 'A weak galactic field, a few microgauss in strength, that guides charged particles and shapes the gas.' },
        { id: 'cosmic-rays', label: 'Cosmic rays', text: 'Fast charged particles from supernovae and other sources. The heliosphere deflects many of them, but not the most energetic.' }
      ],
      missions: ['voyager-1', 'voyager-2', 'ibex', 'interstellar-probe', 'gaia'],
      sources: [
        { title: 'Voyager: Interstellar mission', org: 'NASA / JPL', url: 'https://science.nasa.gov/mission/voyager/' },
        { title: 'Interstellar objects', org: 'NASA Science', url: 'https://science.nasa.gov/solar-system/comets/3i-atlas/' },
        { title: 'The interstellar medium', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science' }
      ],
      tags: ['interstellar', 'interstellar medium', 'ism', 'dust', 'gas', 'cosmic rays', 'magnetic field', 'local bubble', 'oumuamua', 'borisov', '3i/atlas', 'voyager', 'plasma', 'hydrogen']
    }

  });
})(window);
