/* ==========================================================================
   ASTROVIA — data/destinations-1.js
   Content for: earth, moon, sun, mercury, venus.
   Mission statuses verified October 2026 (see notes in each entry).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.destinations = A.destinations || {};
  Object.assign(A.destinations, {

    /* ---------------------------------------------------------------- EARTH */
    'earth': {
      name: 'Earth',
      tagline: 'Our Home Planet',
      type: 'Terrestrial planet',
      intro: 'Earth is the third planet from the Sun and the only world where life is known to exist. Liquid water, a protective atmosphere and a magnetic field work together to keep its surface hospitable.',
      everyday: 'If Earth were the size of a basketball, its air would be thinner than a coat of paint, and the deepest ocean trench would be a scratch on the surface.',
      keyFacts: [
        'About 71% of Earth’s surface is covered by liquid water, mostly in the global ocean.',
        'Earth’s air is about 78% nitrogen and 21% oxygen, with small amounts of argon, carbon dioxide and water vapour.',
        'The planet formed about 4.54 billion years ago, and life appeared on it at least several billion years ago.',
        'Earth has one natural satellite, the Moon, which helps shape the tides.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '149.6 million km (1 AU)' },
        { label: 'Diameter (mean)', value: 'about 12,742 km' },
        { label: 'Length of day', value: '24 hours (sidereal day 23 h 56 min)' },
        { label: 'Length of year', value: '365.25 days' },
        { label: 'Moons', value: '1' },
        { label: 'Average surface temperature', value: 'about 15 °C (recorded extremes −89 °C to 57 °C)' }
      ],
      surprises: [
        'Earth is not a perfect sphere. Its spin makes it bulge, so the equatorial diameter (about 12,756 km) exceeds the pole-to-pole diameter (about 12,714 km) by roughly 42 km.',
        'The oxygen we breathe is largely a product of life. Photosynthesis by microbes began to raise oxygen levels in the Great Oxidation Event, roughly 2.4 billion years ago.'
      ],
      explore: [
        { heading: 'Layers inside Earth', status: 'confirmed',
          body: 'Earth is built in layers. A thin crust, from about 5 km thick under oceans to around 30–70 km under mountains, sits on a rocky mantle roughly 2,900 km thick. Beneath that lies a liquid outer core of iron and nickel, and a solid inner core about 1,220 km in radius. Nobody has drilled past the crust. These layers were mapped from earthquake waves, which speed up, slow down or bend as they cross different materials. The sideways-moving S waves do not pass through the outer core, which is how scientists know it is liquid.' },
        { heading: 'Air and a magnetic shield', status: 'confirmed',
          body: 'Earth’s atmosphere holds heat, supplies oxygen, and burns up most small meteoroids. About half of its mass lies below 5.5 km altitude, and it thins gradually into space with no sharp upper edge. The convecting liquid outer core generates a magnetic field. Its region of influence, the magnetosphere, deflects most charged particles in the solar wind. Particles that do leak in along field lines produce the aurora near the poles. Magnetic and atmospheric protection together help keep the surface livable.' },
        { heading: 'Oceans, continents and plates', status: 'confirmed',
          body: 'The ocean has an average depth of about 3,700 m and reaches nearly 11,000 m in the Challenger Deep. Continents ride on rigid plates that move a few centimetres a year, driven by heat escaping from the interior. Plate motion builds mountains such as the Himalayas, opens ocean basins and causes most earthquakes and volcanoes. Earth is the only planet where plate tectonics is known to operate today. Over geological time this slow recycling also moves carbon between rocks, ocean and air.' },
        { heading: 'Why life has a foothold here', status: 'hypothesis',
          body: 'Earth orbits inside the Sun’s habitable zone, the range of distances where a planet with a suitable atmosphere could keep liquid water on its surface. That idea is a model, not a guarantee. Earth also has a large water inventory, a stable climate over billions of years, a magnetic field and plate tectonics. Scientists think each helps, but how much each is required is debated. Where Earth’s water came from, whether from the material that built the planet or later from asteroids and comets, remains an open question.' }
      ],
      discover: [
        { heading: 'Orbits and the year', status: 'confirmed',
          body: 'Earth’s motion follows Kepler’s third law, derived from Newtonian gravity. For a small body orbiting a much larger one, the period depends only on the semi-major axis a and the central mass. Using a = 1.496 × 10¹¹ m and the Sun’s GM of 1.327 × 10²⁰ m³/s² gives about 3.156 × 10⁷ s, one year. Earth’s orbit is nearly circular, with eccentricity about 0.017, so its distance varies from about 147.1 to 152.1 million km. The seasons come from the 23.4° axial tilt, not from this distance change.',
          equation: 'T = 2π √(a³ / GM)',
          equationNote: 'T = orbital period, a = semi-major axis, G = gravitational constant, M = mass of the Sun.' },
        { heading: 'Equilibrium temperature and the greenhouse effect', status: 'confirmed',
          body: 'A planet reaches balance when absorbed sunlight equals the heat it radiates. With a Bond albedo A of about 0.3 and distance d in AU, the equilibrium temperature of Earth works out near 255 K (−18 °C). The measured mean surface temperature is about 288 K. The roughly 33 K difference is the natural greenhouse effect, caused by water vapour, carbon dioxide and other gases absorbing outgoing infrared radiation. The calculation assumes a uniform surface temperature and ignores the atmosphere’s structure, so it is a first estimate, not a climate model.',
          equation: 'T_eq = 278.6 K × (1 − A)^¼ / √d',
          equationNote: 'A = Bond albedo, d = distance from the Sun in AU, 278.6 K = equilibrium temperature of a perfectly absorbing body at 1 AU.' },
        { heading: 'Escape velocity and holding an atmosphere', status: 'confirmed',
          body: 'To leave Earth without further propulsion, an object needs about 11.2 km/s at the surface. Gas molecules move at a distribution of speeds that depends on temperature and mass, so light gases such as hydrogen and helium gradually leak away from the top of the atmosphere, while heavier nitrogen and oxygen are retained. Compare the Moon, whose escape velocity is only about 2.4 km/s and which has almost no atmosphere. Magnetic fields do not simply stop atmospheric loss; how much a global field helps is still being studied.',
          equation: 'v_esc = √(2GM / r)',
          equationNote: 'G = gravitational constant, M = Earth’s mass (5.97 × 10²⁴ kg), r = distance from Earth’s centre.' }
      ],
      hotspots: [
        { id: 'himalayas', label: 'Himalayas', text: 'The world’s highest mountain range formed where the Indian plate collides with the Eurasian plate, and the collision is still raising the peaks by a few millimetres a year.', lat: 28, lon: 87 },
        { id: 'amazon-basin', label: 'Amazon basin', text: 'The largest tropical rainforest on Earth. Its trees and rivers move enormous amounts of water between land and air, shaping rainfall across South America.', lat: -5, lon: -62 },
        { id: 'sahara', label: 'Sahara', text: 'The largest hot desert on Earth, roughly the size of the United States. Climate records in rock and sediment show it was far wetter several thousand years ago.', lat: 23, lon: 12 },
        { id: 'antarctica', label: 'Antarctica', text: 'A continent covered by an ice sheet that holds about 60% of Earth’s fresh water and is more than 4 km thick in places.', lat: -80, lon: 30 },
        { id: 'pacific-ocean', label: 'Pacific Ocean', text: 'The largest and deepest ocean basin. It covers more area than all of Earth’s land combined, so from some viewpoints Earth looks almost entirely blue.', lat: 0, lon: -150 }
      ],
      missions: ['sputnik-1', 'iss', 'apollo-17', 'hubble'],
      sources: [
        { title: 'Earth Facts', org: 'NASA Science', url: 'https://science.nasa.gov/earth/facts/' },
        { title: 'Earth Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
        { title: 'Earth’s Atmosphere', org: 'NASA Science', url: 'https://science.nasa.gov/earth/earth-atmosphere/' }
      ],
      tags: ['earth', 'terra', 'home', 'blue marble', 'planet', 'ocean', 'atmosphere', 'habitable zone', 'magnetosphere', 'plate tectonics', 'life']
    },

    /* ----------------------------------------------------------------- MOON */
    'moon': {
      name: 'Moon',
      tagline: 'Earth’s Companion',
      type: 'Natural satellite',
      intro: 'The Moon is Earth’s only natural satellite and the only other world humans have walked on. Its cratered surface preserves a record of the early Solar System.',
      everyday: 'The Moon is about a quarter of Earth’s width, so four Moons laid side by side would stretch roughly across Earth. Its gravity is only about one-sixth of ours.',
      keyFacts: [
        'The Moon orbits Earth at an average distance of about 384,400 km, and the same side always faces us.',
        'Surface gravity is about 1.62 m/s², roughly 16.5% of Earth’s, so a 60 kg person would weigh about 10 kg.',
        'Twelve people walked on the Moon during six Apollo landings between 1969 and 1972.',
        'The Moon’s gravity raises ocean tides on Earth, and the Moon is slowly drifting away by about 3.8 cm per year.'
      ],
      measurements: [
        { label: 'Average distance from Earth', value: '384,400 km' },
        { label: 'Average distance from the Sun', value: '149.6 million km (1 AU)' },
        { label: 'Diameter', value: '3,475 km' },
        { label: 'Length of day (sunrise to sunrise)', value: 'about 29.5 Earth days' },
        { label: 'Orbital period around Earth', value: '27.3 days' },
        { label: 'Surface temperature', value: 'about −173 °C to 127 °C (equator)' }
      ],
      surprises: [
        'There is water ice on the Moon. Spacecraft observations, including the 2009 LCROSS impact experiment, found it in permanently shadowed polar craters that never see sunlight.',
        'The Moon is slowly leaving. Laser reflectors left by Apollo crews show it recedes from Earth by about 3.8 cm each year, roughly the rate fingernails grow.'
      ],
      explore: [
        { heading: 'Craters and dark plains', status: 'confirmed',
          body: 'The bright highlands are old and covered in craters, while the dark smooth patches called maria (Latin for seas) are vast plains of solidified lava. No water ever filled them. Craters form when meteoroids strike, and with no weather or plate tectonics to erase them, the Moon keeps its scars for billions of years. The largest known is the South Pole–Aitken basin on the far side, about 2,500 km across. Counting craters on a surface lets scientists estimate how old it is: more craters generally means older ground.' },
        { heading: 'Phases and the same face', status: 'confirmed',
          body: 'The Moon makes no light of its own. We see the half lit by the Sun, and the amount of that half that faces us changes as the Moon orbits, giving the phases. A full cycle from new Moon to new Moon takes about 29.5 days. The Moon spins once for each orbit, so it is tidally locked and always shows Earth the same face. The far side is not permanently dark; it has day and night just like the near side. It simply cannot be seen from Earth.' },
        { heading: 'Gravity and tides', status: 'confirmed',
          body: 'The Moon’s gravity pulls slightly harder on the ocean facing it than on the ocean on the far side of Earth, stretching the water into two bulges. As Earth turns, most coasts see two high tides and two low tides a day. The Sun also contributes, and when Sun, Earth and Moon line up at new and full Moon, the combined pull produces larger spring tides. On the Moon itself, low gravity means astronauts could bound along in bulky suits and dropped tools fell slowly.' },
        { heading: 'Humans and robots on the Moon', status: 'confirmed',
          body: 'Between July 1969 (Apollo 11) and December 1972 (Apollo 17), twelve astronauts walked on the Moon and brought back about 382 kg of rock and soil. Robotic landers have since followed: China’s Chang’e-4 reached the far side in January 2019, and India’s Chandrayaan-3 landed near the south polar region in August 2023. NASA’s Artemis II crew of four flew around the Moon and splashed down on 10 April 2026. Landings under the Artemis programme are planned, but their dates have shifted before and may again. Status checked October 2026.' }
      ],
      discover: [
        { heading: 'Tidal forces and tidal locking', status: 'confirmed',
          body: 'The tidal force on a body of radius r from a mass M at distance d scales as M r / d³, so it falls off with the cube of distance. This is why the nearby Moon raises larger ocean tides than the far more massive Sun: the lunar tidal effect is about 2.2 times the solar one. Friction from tidal bulges has slowed the Moon’s spin until its rotation period matched its orbital period, and it transfers angular momentum to the Moon’s orbit, which is why the Moon recedes. Earth’s day lengthens by roughly 2 milliseconds per century from this effect.',
          equation: 'F_tidal ≈ 2GMr / d³',
          equationNote: 'M = mass of the tide-raising body, r = radius of the affected body, d = separation, G = gravitational constant.' },
        { heading: 'Where the Moon came from', status: 'hypothesis',
          body: 'The leading explanation is the giant-impact hypothesis: a Mars-sized body, often called Theia, struck the young Earth about 4.5 billion years ago, and debris from the collision formed the Moon. It explains the Moon’s low iron content and its angular momentum with Earth. Apollo samples show oxygen isotope ratios nearly identical to Earth’s, which is harder to explain, because models suggest much of the Moon should come from the impactor. Variations such as faster-spinning or higher-energy impacts are being tested. Observation shows what the Moon is made of; its origin is an interpretation.' },
        { heading: 'Escape velocity and the missing atmosphere', status: 'confirmed',
          body: 'The Moon’s mass is about 1.2% of Earth’s and its radius about 27%, giving an escape velocity of about 2.38 km/s, compared with 11.2 km/s for Earth. Combined with daytime surface temperatures above 100 °C, gas molecules escape easily, and solar radiation strips what remains. The result is an exosphere so thin that molecules rarely collide: its surface pressure is roughly a hundred-trillionth that of Earth’s air. Without an atmosphere there is no weather, no sound transmission and very little heat transport, which explains the extreme temperature swings between lit and shaded ground.',
          equation: 'v_esc = √(2GM / r)',
          equationNote: 'G = gravitational constant, M = Moon’s mass (7.35 × 10²² kg), r = Moon’s radius (1,737 km).' }
      ],
      hotspots: [
        { id: 'tycho', label: 'Tycho crater', text: 'A young crater about 85 km wide with bright rays of ejected material stretching over 1,000 km. Its age is estimated at roughly 100 million years.', lat: -43.3, lon: -11.4 },
        { id: 'mare-tranquillitatis', label: 'Mare Tranquillitatis', text: 'The Sea of Tranquility is a lava plain on the near side. Apollo 11 landed on its southwestern edge in July 1969.', lat: 8.5, lon: 31.4 },
        { id: 'oceanus-procellarum', label: 'Oceanus Procellarum', text: 'The Ocean of Storms is the Moon’s largest dark plain, covering about 4 million km². Apollo 12 landed here in 1969.', lat: 18, lon: -57 },
        { id: 'mare-imbrium', label: 'Mare Imbrium', text: 'The Sea of Showers fills a giant impact basin about 1,100 km wide. It is one of the most easily seen dark patches from Earth.', lat: 32.8, lon: -15.6 },
        { id: 'apollo-11-site', label: 'Apollo 11 landing site', text: 'Neil Armstrong and Buzz Aldrin landed here on 20 July 1969. Their boot prints and equipment remain, since the Moon has no wind or rain to erase them.', lat: 0.67, lon: 23.47 }
      ],
      missions: ['apollo-11', 'apollo-17', 'artemis-ii', 'chandrayaan-3', 'chang-e-4'],
      sources: [
        { title: 'Moon Facts', org: 'NASA Science', url: 'https://science.nasa.gov/moon/facts/' },
        { title: 'Moon Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
        { title: 'Artemis II', org: 'NASA', url: 'https://www.nasa.gov/mission/artemis-ii/' }
      ],
      tags: ['moon', 'luna', 'lunar', 'tides', 'phases', 'apollo', 'artemis', 'maria', 'crater', 'tidal locking', 'giant impact', 'satellite']
    },

    /* ------------------------------------------------------------------ SUN */
    'sun': {
      name: 'Sun',
      tagline: 'Our Star',
      type: 'G-type main-sequence star',
      intro: 'The Sun is a ball of hot plasma that holds the Solar System together with its gravity and supplies almost all the energy that powers Earth’s climate and life.',
      everyday: 'About 1.3 million Earths could fit inside the Sun, yet it is an ordinary, middle-aged star among hundreds of billions in the Milky Way.',
      keyFacts: [
        'The Sun contains about 99.86% of the Solar System’s mass, and its gravity keeps every planet in orbit.',
        'Its energy comes from nuclear fusion in the core, where hydrogen is converted to helium.',
        'Sunlight takes about 8 minutes 20 seconds to reach Earth.',
        'The Sun is about 4.6 billion years old and is expected to shine as a stable star for roughly 5 billion more years.',
        'Safety: never look at the Sun directly or through binoculars or a telescope without certified solar filters. It can cause permanent eye damage.'
      ],
      measurements: [
        { label: 'Average distance from Earth', value: '149.6 million km (1 AU)' },
        { label: 'Diameter', value: 'about 1.39 million km (109 × Earth)' },
        { label: 'Rotation period', value: 'about 25 days at equator, about 35 days near poles' },
        { label: 'Core temperature', value: 'about 15 million °C' },
        { label: 'Visible surface temperature', value: 'about 5,500 °C' },
        { label: 'Planets orbiting it', value: '8' }
      ],
      surprises: [
        'The Sun’s outer atmosphere, the corona, is hundreds of times hotter than its visible surface: more than a million degrees compared with about 5,500 °C. How it is heated is still debated.',
        'Light made in the core takes tens of thousands of years or more to random-walk to the surface. It then crosses space to Earth in just over 8 minutes.'
      ],
      explore: [
        { heading: 'Layers of the Sun', status: 'confirmed',
          body: 'The Sun has no solid surface. In the core, extreme pressure and a temperature around 15 million °C allow fusion. Energy then travels outward through the radiative zone, where light is absorbed and re-emitted countless times, and the convection zone, where hot plasma rises and cooler plasma sinks like boiling water. The visible surface is the photosphere. Above it lie the thin chromosphere and the vast, faint corona that streams into space. These layers have been probed with sunlight analysis, helioseismology (studying the Sun’s vibrations) and spacecraft such as SOHO.' },
        { heading: 'How the Sun shines', status: 'confirmed',
          body: 'In the core, hydrogen nuclei fuse into helium in a sequence called the proton–proton chain. Four hydrogen nuclei produce one helium nucleus, and the helium weighs slightly less, about 0.7% less. The missing mass becomes energy according to Einstein’s E = mc². Overall the Sun converts roughly 4 million tonnes of mass into energy every second, and it has plenty of hydrogen to keep this up for billions of years. Tiny particles called neutrinos stream directly out of the core; detecting them has confirmed fusion is happening.' },
        { heading: 'Solar wind, flares and space weather', status: 'confirmed',
          body: 'The corona continually blows off charged particles, the solar wind, at roughly 300–800 km/s. It carries the Sun’s magnetic field outward and inflates the heliosphere, a bubble that encloses the planets. Sunspots are cooler, strongly magnetic patches, and their number rises and falls in an activity cycle of about 11 years. Flares and coronal mass ejections can disturb Earth’s magnetic field, producing auroras and sometimes disrupting satellites, radio and power grids. Agencies such as NOAA forecast this space weather.' },
        { heading: 'Watching the Sun safely', status: 'confirmed',
          body: 'Looking at the Sun without proper protection can burn the retina and cause permanent damage, even during a partial eclipse and even when the Sun looks dim. Ordinary sunglasses are not enough. Use eclipse glasses or viewers certified to ISO 12312-2, or a telescope fitted with a certified solar filter at the front. A simple pinhole projector, which casts an image of the Sun onto paper, is a safe alternative. Never use a camera, binoculars or telescope without a front-mounted solar filter. Space-based observatories offer the best views safely from your screen.' }
      ],
      discover: [
        { heading: 'Energy from mass: the proton–proton chain', status: 'confirmed',
          body: 'The net reaction is four protons forming one helium-4 nucleus, two positrons and two electron neutrinos, releasing about 26.7 MeV per helium nucleus. The Sun’s luminosity is 3.83 × 10²⁶ W. Dividing by c² gives a mass-to-energy conversion of about 4.3 × 10⁹ kg/s, around 4 million tonnes per second. About 600 million tonnes of hydrogen fuse each second to achieve this. The Sun loses a further million tonnes per second or so through the solar wind. The earlier solar neutrino deficit was resolved when experiments showed neutrinos change flavour on the way.',
          equation: '4 ¹H → ⁴He + 2e⁺ + 2νₑ + 26.7 MeV   ·   ΔE = Δm c²',
          equationNote: 'Δm = mass difference between the reactants and the helium product, c = speed of light (2.998 × 10⁸ m/s).' },
        { heading: 'Stellar structure and the Stefan–Boltzmann law', status: 'confirmed',
          body: 'The Sun is stable because gravity is balanced by gas and radiation pressure, a state called hydrostatic equilibrium. If the core cooled, gravity would compress it and raise the fusion rate, acting as a thermostat. The effective temperature of the photosphere follows from the luminosity and radius using the Stefan–Boltzmann law: with L = 3.83 × 10²⁶ W and R = 6.96 × 10⁸ m, it comes out near 5,772 K. Spectra of sunlight show dark absorption lines from elements in the photosphere; helium was first identified from such lines in the Sun in 1868, before it was found on Earth.',
          equation: 'L = 4πR²σT⁴   ·   dP/dr = −GMρ / r²',
          equationNote: 'L = luminosity, R = radius, σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴, T = effective temperature, P = pressure, ρ = density at radius r.' },
        { heading: 'The coronal heating problem', status: 'open',
          body: 'Temperature falls from about 15 million K in the core to roughly 5,800 K at the photosphere, then jumps to more than 1 million K in the corona. Heat cannot simply flow from a cooler layer to a hotter one, so some other energy transport must be involved. Leading ideas involve magnetic waves and many small magnetic reconnection events, sometimes called nanoflares. Observations support both to some degree, and neither fully explains the heating. Parker Solar Probe and Solar Orbiter are measuring the corona and solar wind closer to the Sun than ever before to test them.' }
      ],
      hotspots: [
        { id: 'sunspots', label: 'Sunspots', text: 'Dark patches about 1,500 K cooler than their surroundings, where strong magnetic fields slow the flow of heat. Some are larger than Earth.', lat: 14, lon: -35 },
        { id: 'granulation', label: 'Granulation', text: 'The photosphere looks like boiling rice. Each grain is a rising cell of hot plasma, typically about 1,000 km across, and lasts only minutes.', lat: -5, lon: 15 },
        { id: 'prominence', label: 'Prominence', text: 'Loops of cooler, dense plasma held above the surface by magnetic fields. Some last for days or months and reach hundreds of thousands of kilometres.', lat: 35, lon: 65 },
        { id: 'flare-region', label: 'Active region and flares', text: 'Placement is illustrative. Flares erupt from magnetically complex active regions, suddenly releasing energy as radiation across the spectrum, sometimes with a coronal mass ejection.', lat: -18, lon: 45 },
        { id: 'coronal-hole', label: 'Coronal hole', text: 'Placement is illustrative. In coronal holes, open magnetic field lines let fast solar wind escape. They appear dark in extreme ultraviolet images and are common near the poles.', lat: 70, lon: -10 }
      ],
      missions: ['soho', 'parker-solar-probe', 'solar-orbiter'],
      sources: [
        { title: 'Sun Facts', org: 'NASA Science', url: 'https://science.nasa.gov/sun/facts/' },
        { title: 'Sun Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html' },
        { title: 'Space Weather Prediction Center', org: 'NOAA', url: 'https://www.swpc.noaa.gov/' }
      ],
      tags: ['sun', 'sol', 'star', 'solar', 'corona', 'sunspot', 'solar wind', 'space weather', 'fusion', 'flare', 'aurora', 'eclipse safety', 'heliosphere']
    },

    /* -------------------------------------------------------------- MERCURY */
    'mercury': {
      name: 'Mercury',
      tagline: 'The Swift Planet',
      type: 'Terrestrial planet',
      intro: 'Mercury is the smallest planet and the closest to the Sun. It is a cratered, rocky world with a huge metal core and almost no atmosphere.',
      everyday: 'Mercury is only a little wider than the Moon’s distance across the United States is long, yet it holds a core almost as large as the Moon.',
      keyFacts: [
        'Mercury races around the Sun in just 88 Earth days, the shortest year of any planet.',
        'Daytime surface temperatures reach about 430 °C, while nights fall to about −180 °C because there is almost no air to hold heat.',
        'Its iron core fills roughly 85% of the planet’s radius, a larger share than in any other major planet.',
        'Radar and MESSENGER data show water ice inside permanently shadowed craters near the poles.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '57.9 million km (0.39 AU)' },
        { label: 'Diameter', value: '4,879 km' },
        { label: 'Length of day (sunrise to sunrise)', value: '176 Earth days' },
        { label: 'Length of year', value: '88 Earth days' },
        { label: 'Moons', value: '0' },
        { label: 'Surface temperature', value: 'about −180 °C to 430 °C' }
      ],
      surprises: [
        'Despite being closest to the Sun, Mercury has ice. In polar craters whose floors never see sunlight, temperatures stay low enough for water ice to persist for very long times.',
        'Mercury is shrinking. As its large iron core cooled, the planet contracted, wrinkling the crust into cliffs hundreds of kilometres long, called lobate scarps.'
      ],
      explore: [
        { heading: 'A world of extremes', status: 'confirmed',
          body: 'Mercury’s distance from the Sun varies from about 46 to 70 million km because its orbit is the most elongated of the planets. Without a substantial atmosphere to spread heat, the sunlit side bakes at about 430 °C while the night side drops to about −180 °C. Venus is actually hotter on average, because its thick atmosphere traps heat. The surface looks much like the Moon’s, covered in craters, but it also has smooth plains and long cliffs. Spacecraft instruments, rather than the eye, reveal its chemistry and structure.' },
        { heading: 'Two years in three days', status: 'confirmed',
          body: 'Mercury is not tidally locked like the Moon. It spins on its axis three times for every two trips around the Sun, a pattern called a 3:2 spin–orbit resonance, found by radar observations in the 1960s. Its rotation period is about 58.6 Earth days, and its orbit takes 88 days. The combination means one full day, from one sunrise to the next, lasts 176 Earth days, which is two Mercury years. A person on the surface at the right spot would see the Sun slow, stop and briefly reverse in the sky near closest approach.' },
        { heading: 'An oversized iron core', status: 'confirmed',
          body: 'Mercury’s density is high for its size, about 5.4 g/cm³, second only to Earth’s among the planets. That implies a metal-rich interior: a core occupying about 85% of the planet’s radius surrounded by a thin rocky mantle and crust. MESSENGER also found that Mercury has a weak magnetic field, about 1% as strong as Earth’s, which implies part of the core is still liquid. Why Mercury has so much metal compared with rock is not settled. Hypotheses include a giant impact that stripped away its mantle, and the way material condensed near the young Sun.' },
        { heading: 'Ice at the poles', status: 'confirmed',
          body: 'Earth-based radar in the early 1990s detected strongly reflective patches near Mercury’s poles. MESSENGER, which orbited Mercury from 2011 to 2015, found that they coincide with permanently shadowed crater floors, and its neutron, laser and imaging data are consistent with water ice, covered in places by a dark layer of organic-rich material. The source of the water, thought to be comets or asteroids, is an interpretation. Ice can survive here because Mercury’s axis is almost upright, so the Sun never rises over these crater floors.' }
      ],
      discover: [
        { heading: 'Spin–orbit resonance and tides', status: 'confirmed',
          body: 'A tidally locked 1:1 state is not the only stable outcome. For an eccentric orbit, the torque from the Sun on the planet’s permanent mass asymmetry can lock rotation at half-integer multiples of the mean motion. Mercury’s orbital eccentricity is about 0.206, and tidal evolution models show the 3:2 state is the most probable end state, with a modest chance of capture at other values. The spin rate is ω = 1.5 n, where n is the mean motion. Measurements also show a small physical libration, a wobble in rotation, which was used to prove that Mercury’s outer core is at least partly liquid.',
          equation: 'ω_spin = (3/2) n = (3/2)(2π / T_orbit)',
          equationNote: 'n = mean orbital angular rate, T_orbit = 87.97 days, ω_spin = spin angular rate.' },
        { heading: 'Mercury and general relativity', status: 'confirmed',
          body: 'Mercury’s elliptical orbit slowly rotates, or precesses, by about 574 arcseconds per century as seen from Earth. Newtonian perturbations from the other planets explain all but about 43 arcseconds per century. In 1915 Einstein showed that general relativity predicts this extra precession exactly, a key early test of the theory. For one orbit the excess shift is given below; multiplying by about 415 orbits a century gives roughly 43 arcseconds. BepiColombo will refine such tests of gravity with precise tracking.',
          equation: 'Δφ = 6πGM / ( c² a (1 − e²) )',
          equationNote: 'Δφ = extra perihelion shift per orbit (radians), a = semi-major axis, e = eccentricity, M = mass of the Sun.' },
        { heading: 'Why does Mercury have a magnetic field?', status: 'open',
          body: 'Mercury’s field is weak and shifted about 480 km north of the planet’s centre. A planetary dynamo needs a convecting, electrically conducting liquid layer, and Mercury’s small core should have cooled enough to freeze substantially. Models propose that a liquid outer shell could be driven by iron snow falling inward, or that a stably layered region weakens and offsets the field. MESSENGER data support a dynamo but cannot decide between models. BepiColombo’s two orbiters, ESA’s Mercury Planetary Orbiter and JAXA’s Mio, will measure the field and its interaction with the solar wind in much greater detail.' }
      ],
      hotspots: [
        { id: 'caloris-basin', label: 'Caloris Basin', text: 'One of the largest impact basins in the Solar System, about 1,550 km across. Its floor is covered by smooth plains and cut by fractures.', lat: 31, lon: -170 },
        { id: 'kuiper-crater', label: 'Kuiper crater', text: 'A bright, young crater about 60 km wide, with rays of fresh material. Mariner 10 imaged it in 1974 and it is a landmark for mapping.', lat: -11.3, lon: -31.5 },
        { id: 'discovery-rupes', label: 'Discovery Rupes', text: 'One of Mercury’s largest cliffs, a lobate scarp roughly 500 km long and up to 1.5 km high, formed as the planet’s interior cooled and shrank.', lat: -56.3, lon: -38.3 },
        { id: 'prokofiev-crater', label: 'Prokofiev crater', text: 'A crater near the north pole about 112 km across. Parts of its floor lie in permanent shadow and are among the places where water ice has been identified.', lat: 85.8, lon: -63.5 },
        { id: 'hun-kal', label: 'Hun Kal crater', text: 'A small crater that defines Mercury’s zero meridian. Longitude is measured from the 20°W meridian passing through its centre.', lat: -0.6, lon: -20 }
      ],
      missions: ['mariner-10', 'messenger', 'bepicolombo'],
      sources: [
        { title: 'Mercury Facts', org: 'NASA Science', url: 'https://science.nasa.gov/mercury/facts/' },
        { title: 'Mercury Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html' },
        { title: 'BepiColombo', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/BepiColombo' },
        { title: 'MESSENGER mission', org: 'NASA Science', url: 'https://science.nasa.gov/mission/messenger/' }
      ],
      tags: ['mercury', 'hermes', 'swift planet', 'caloris', 'messenger', 'bepicolombo', 'spin-orbit resonance', 'lobate scarp', 'iron core', 'polar ice', 'perihelion precession']
    },

    /* ---------------------------------------------------------------- VENUS */
    'venus': {
      name: 'Venus',
      tagline: 'The Veiled Planet',
      type: 'Terrestrial planet',
      intro: 'Venus is almost the same size as Earth, but a dense carbon dioxide atmosphere and clouds of sulphuric acid have made it the hottest planet in the Solar System.',
      everyday: 'Standing on Venus would feel like being nearly a kilometre deep in Earth’s ocean, for the pressure, with an oven set hotter than a pizza oven.',
      keyFacts: [
        'The surface is about 465 °C, hot enough to melt lead, and hotter than Mercury despite being almost twice as far from the Sun.',
        'Atmospheric pressure at the surface is about 92 times Earth’s, and the air is roughly 96.5% carbon dioxide.',
        'Venus rotates backwards (retrograde) and very slowly, taking about 243 Earth days to spin once.',
        'Radar mapping shows a surface dominated by volcanic plains, mountains and thousands of volcanoes.'
      ],
      measurements: [
        { label: 'Average distance from the Sun', value: '108.2 million km (0.72 AU)' },
        { label: 'Diameter', value: '12,104 km' },
        { label: 'Length of day (sunrise to sunrise)', value: 'about 117 Earth days' },
        { label: 'Length of year', value: '224.7 Earth days' },
        { label: 'Moons', value: '0' },
        { label: 'Surface temperature and pressure', value: 'about 465 °C, about 92 bar' }
      ],
      surprises: [
        'A day on Venus is longer than its year in one sense: it spins once in about 243 Earth days, but orbits the Sun in 225. The Sun rises in the west.',
        'In 2023, researchers comparing radar images taken 8 months apart by the Magellan spacecraft found a volcanic vent on Maat Mons that had changed shape, suggesting an eruption in the early 1990s.'
      ],
      explore: [
        { heading: 'Air that presses like deep water', status: 'confirmed',
          body: 'Venus has the densest atmosphere of the rocky planets. At the surface the pressure is about 92 bar, similar to what you would feel roughly 900 m under Earth’s oceans. The gas is mostly carbon dioxide with some nitrogen. Cloud layers between about 48 and 70 km altitude consist of droplets of sulphuric acid, which make the planet bright and hide the ground from ordinary telescopes. Winds at cloud-top level circle the whole planet in about four Earth days, far faster than the planet itself turns, a pattern called super-rotation.' },
        { heading: 'A runaway greenhouse', status: 'confirmed',
          body: 'Carbon dioxide traps infrared radiation, and Venus has an enormous amount of it. Even though the clouds reflect about three-quarters of the sunlight that arrives, the surface sits at about 465 °C, day and night, and from equator to pole. Temperatures vary little because the thick atmosphere moves heat around. The current greenhouse effect is measured and well understood. Venus is often described as a warning of how greenhouse heating can run out of control. Its ancient history, though, is based on models, and there is no direct record of how it reached this state.' },
        { heading: 'Volcanoes and recent activity', status: 'hypothesis',
          body: 'NASA’s Magellan orbiter mapped about 98% of the surface by radar between 1990 and 1994. It revealed more than 1,000 volcanoes and large lava plains, with relatively few impact craters. That suggests the surface is geologically young, probably a few hundred million years old. Whether Venus is volcanically active today is not settled. Observations of heat from certain volcanoes, and the Maat Mons vent change, are suggestive and support activity. Confirmation would require repeated high-resolution observations, which upcoming orbiters such as ESA’s EnVision are designed to provide.' },
        { heading: 'Was Venus once more like Earth?', status: 'hypothesis',
          body: 'Venus’s atmosphere contains a form of hydrogen, deuterium, at a ratio roughly 100 times higher than on Earth. This is what would be expected if Venus once had much more water and lost the lighter hydrogen to space. Some climate models suggest Venus could have had liquid oceans for a time, while others suggest it never cooled enough. The evidence is indirect, and the question is open to debate. Missions such as NASA’s planned DAVINCI probe and ESA’s EnVision are designed to test these ideas.' }
      ],
      discover: [
        { heading: 'Greenhouse physics by the numbers', status: 'confirmed',
          body: 'Using the equilibrium formula with d = 0.723 AU and a Bond albedo of about 0.77, Venus’s equilibrium temperature comes out near 227 K, colder than Earth’s 255 K because its clouds reflect so much light. The observed surface temperature is about 737 K, so the greenhouse effect adds around 500 K, compared with about 33 K on Earth. At 92 bar the atmosphere is optically thick in the infrared, so radiation escapes only from high, cold layers. The simple formula ignores atmospheric structure, but it shows that proximity to the Sun alone does not explain the heat.',
          equation: 'T_eq = 278.6 K × (1 − A)^¼ / √d   →   ΔT_greenhouse = T_surface − T_eq ≈ 737 K − 227 K',
          equationNote: 'A = Bond albedo (about 0.77), d = distance from the Sun in AU.' },
        { heading: 'Retrograde spin and atmospheric super-rotation', status: 'open',
          body: 'Venus’s axial tilt is about 177°, so it spins backwards: one rotation takes 243 Earth days, and one solar day about 117. Its rotation rate is not constant; radar tracking has shown it varies by several minutes between measurements. Competing explanations for the current spin involve a primordial impact, core–mantle friction, and tidal torques on the thick atmosphere that balance solar tides against gravity tides. None is demonstrated. The 100 m/s cloud-top super-rotation is also not fully understood, though models point to thermal tides and planetary-scale waves that transfer angular momentum to the winds.' },
        { heading: 'Phosphine: a contested signal', status: 'open',
          body: 'In 2020, a team reported a spectral absorption feature near 1.1 mm wavelength that they attributed to phosphine (PH₃), about 20 parts per billion, in the cloud layers. On Earth phosphine is linked with biological and industrial sources, so the claim drew great attention. Several groups re-analysed the data and questioned the calibration of the data, and whether the feature was sulphur dioxide instead. Later reports gave lower or inconclusive values. There is no scientific consensus that phosphine is present, and no evidence of life on Venus. Clarifying the question needs new measurements of the clouds.' }
      ],
      hotspots: [
        { id: 'maxwell-montes', label: 'Maxwell Montes', text: 'The highest mountain range on Venus, rising about 11 km above the mean surface level. It lies in the northern highland Ishtar Terra.', lat: 65.2, lon: 3.3 },
        { id: 'maat-mons', label: 'Maat Mons', text: 'A large shield volcano about 5 km high. Radar images from Magellan, taken months apart, show changes in one of its vents.', lat: 0.9, lon: -165.5 },
        { id: 'aphrodite-terra', label: 'Aphrodite Terra', text: 'The largest highland region on Venus, stretching about 10,000 km along the equator, roughly the size of Africa.', lat: -10, lon: 100 },
        { id: 'venera-13', label: 'Venera 13 landing site', text: 'The Soviet lander touched down in March 1982 and sent the first colour images of the Venusian surface. It survived about 2 hours in the heat and pressure.', lat: -7.5, lon: -57 },
        { id: 'venera-7', label: 'Venera 7 landing site', text: 'In December 1970, Venera 7 became the first spacecraft to transmit data from the surface of another planet, for about 23 minutes. Position is approximate.', lat: -5, lon: -9 }
      ],
      missions: ['venera-7', 'magellan', 'akatsuki', 'envision'],
      sources: [
        { title: 'Venus Facts', org: 'NASA Science', url: 'https://science.nasa.gov/venus/facts/' },
        { title: 'Venus Fact Sheet', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html' },
        { title: 'Magellan mission', org: 'NASA Science', url: 'https://science.nasa.gov/mission/magellan/' }
      ],
      tags: ['venus', 'aphrodite', 'morning star', 'evening star', 'greenhouse', 'runaway greenhouse', 'phosphine', 'sulphuric acid', 'retrograde', 'volcano', 'maat mons', 'magellan', 'akatsuki']
    }

  });
})(window);
