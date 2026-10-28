/* ==========================================================================
   ASTROVIA — data/destinations-4.js
   Content for: neighborhood, spiral-arms, galactic-center, outer-milky-way, halo.
   All five are REGIONS: hotspots have no lat/lon and keep the fixed id order
   from DEV_NOTES §2.1. Facts checked October 2026 (see sources in each entry).
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.destinations = A.destinations || {};
  Object.assign(A.destinations, {

    /* --------------------------------------------------------- NEIGHBORHOOD */
    'neighborhood': {
      name: 'Our Stellar Neighborhood',
      tagline: 'The Nearest Stars',
      type: 'Region of the Milky Way',
      intro: 'Our nearest stellar neighbours lie a few light-years away, separated by vast empty space. Most are small, dim red dwarfs, and several are known to host planets.',
      everyday: 'Shrink the Sun to a marble: Earth is a speck about one metre away, and the next star system, Alpha Centauri, is another marble roughly 300 kilometres away.',
      keyFacts: [
        'The Alpha Centauri system, about 4.37 light-years away, holds three stars. The faintest, Proxima Centauri at about 4.24 light-years, is the closest to the Sun.',
        'Most stars near the Sun are red dwarfs, small and cool enough that none of them can be seen with the unaided eye.',
        'Sirius, about 8.6 light-years away, is the brightest star in Earth’s night sky and has a faint white dwarf companion, Sirius B.',
        'At Voyager 1’s speed of about 17 km/s, a trip to Alpha Centauri would take roughly 75,000 years.',
        'Distances to nearby stars are measured directly by parallax, the tiny yearly shift in a star’s apparent position as Earth orbits the Sun.'
      ],
      measurements: [
        { label: 'Proxima Centauri', value: 'about 4.24 light-years (1.30 parsecs)' },
        { label: 'Alpha Centauri A and B', value: 'about 4.37 light-years' },
        { label: 'Barnard’s Star', value: 'about 5.96 light-years' },
        { label: 'Sirius', value: 'about 8.6 light-years' },
        { label: 'Epsilon Eridani', value: 'about 10.5 light-years' },
        { label: 'Tau Ceti', value: 'about 11.9 light-years' }
      ],
      surprises: [
        'Barnard’s Star races across the sky faster than any other known star, shifting about 10.4 arcseconds a year, and in 2025 astronomers confirmed that it hosts four small planets.',
        'Sirius B is a white dwarf about as massive as the Sun yet only about the size of Earth, so a teaspoon of its material would weigh several tonnes.'
      ],
      explore: [
        { heading: 'How far is the nearest star?', status: 'confirmed',
          body: 'Light from the Sun takes about 8 minutes to reach Earth, but light from Proxima Centauri takes about 4.24 years. The tour compresses this gap enormously: in reality the distance is roughly 270,000 times the Earth–Sun distance. Voyager 1, the most distant spacecraft, moves at about 17 km/s, or about 3.6 AU a year. At that speed it would need roughly 75,000 years to cover the distance to Alpha Centauri, although it is not aimed at that star. Interstellar space is mostly empty, and stars here are separated by distances thousands of times their own widths.' },
        { heading: 'Red dwarfs and a few bright stars', status: 'confirmed',
          body: 'Among the stars within about 20 light-years, roughly three in four are red dwarfs. They are small, cool and faint, burn their hydrogen very slowly, and are expected to live for trillions of years. Proxima Centauri is one of them. Brighter stars such as Alpha Centauri A, a near twin of the Sun, and Sirius are the exception, and look conspicuous to us only because they are close. Sirius B is a white dwarf, the compact remnant of a star that once outshone its companion and has since shed its outer layers.' },
        { heading: 'Planets around neighbouring stars', status: 'confirmed',
          body: 'Proxima Centauri b, detected in 2016 by the radial-velocity method, has a minimum mass of about 1.3 Earths and orbits every 11.2 days, inside its star’s habitable zone. Whether it has an atmosphere or water is unknown, and the star’s frequent flares may make that harder. Further planet signals around Proxima are reported but less secure. Barnard’s Star has four confirmed planets, all under half an Earth mass at minimum, on very close orbits. Epsilon Eridani has a gas giant planet, and Tau Ceti has candidate planets that astronomers have not settled.' },
        { heading: 'The Sun’s bubble in the gas', status: 'hypothesis',
          body: 'The Sun sits inside the Local Bubble, a cavity roughly a thousand light-years across where the interstellar gas is hot and thin compared with its surroundings. A leading explanation is that a series of supernova explosions over the past several million years swept the gas away, and recent studies link young star groups to that history. The details, including how many supernovae were involved and how the bubble relates to the nearby clouds, are still being worked out. Our neighbours sit inside this low-density region.' }
      ],
      discover: [
        { heading: 'Parallax and Gaia', status: 'confirmed',
          body: 'As Earth orbits the Sun, a nearby star appears to trace a small ellipse against distant background stars. The semi-major axis of that ellipse is the parallax angle p. By definition, a star with a parallax of one arcsecond lies at one parsec, about 3.26 light-years. Proxima Centauri’s parallax is about 0.77 arcseconds, giving about 1.30 parsecs. ESA’s Gaia satellite measures parallaxes to tens of microarcseconds for bright stars, and measured distances to nearly two billion stars, which anchors many other distance scales. Parallax is a direct geometric method that needs no assumptions about a star’s brightness.',
          equation: 'd (parsecs) = 1 / p (arcseconds)',
          equationNote: 'd = distance in parsecs (1 pc ≈ 3.26 light-years), p = parallax angle in arcseconds.' },
        { heading: 'Proper motion and changing neighbours', status: 'confirmed',
          body: 'Stars near the Sun move relative to it at tens of kilometres per second, so the neighbourhood is slowly changing. Barnard’s Star’s proper motion of 10.4 arcseconds a year is large because it is both close and moving at a high speed across our line of sight. Combining proper motion with radial velocity gives full three-dimensional motion. Gaia’s measurements allow astronomers to calculate which stars have passed close to the Sun in the past and which will in the future, though the results depend on measurement errors and on the assumed shape of the galaxy’s gravity.',
          equation: 'v_t = 4.74 × μ × d',
          equationNote: 'v_t = speed across the line of sight in km/s, μ = proper motion in arcseconds per year, d = distance in parsecs.' },
        { heading: 'Detecting planets by their pull', status: 'confirmed',
          body: 'The radial-velocity method measures the star’s tiny back-and-forth motion in its spectrum as a planet tugs on it. The signal is only a few metres per second for planets like Proxima b, comparable to walking pace, which is why very stable spectrographs such as HARPS and ESPRESSO were needed. The measurement gives a minimum mass, m sin i, because the orbit’s tilt is unknown. Red dwarfs make good targets because their low mass produces a larger wobble, but starspots and flares can imitate planets. This is why some signals, such as those around Tau Ceti, remain candidates.' }
      ],
      hotspots: [
        { id: 'alpha-centauri', label: 'Alpha Centauri', text: 'The closest star system to the Sun, about 4.37 light-years away. It holds Sun-like Alpha Centauri A, the slightly cooler B, and the faint red dwarf Proxima Centauri, which is the closest of the three at about 4.24 light-years.' },
        { id: 'barnards-star', label: 'Barnard’s Star', text: 'A red dwarf about 5.96 light-years away, with the largest known proper motion of any star. Four confirmed planets, each less than half an Earth’s mass at minimum, were announced in 2025.' },
        { id: 'sirius', label: 'Sirius', text: 'The brightest star in the night sky, about 8.6 light-years away and roughly twice the Sun’s mass. Its companion, Sirius B, is a white dwarf about the size of Earth.' },
        { id: 'epsilon-eridani', label: 'Epsilon Eridani', text: 'A young, orange star about 10.5 light-years away, thought to be only a few hundred million years old. It has a dusty debris disk and at least one detected giant planet.' },
        { id: 'tau-ceti', label: 'Tau Ceti', text: 'A Sun-like star about 11.9 light-years away with a thick debris disk. Several planet candidates have been reported, but they remain unconfirmed and are still being debated.' }
      ],
      missions: ['gaia', 'voyager-1', 'interstellar-probe', 'hubble'],
      sources: [
        { title: 'Planet Found in Habitable Zone Around Nearest Star (Pale Red Dot)', org: 'ESO', url: 'https://www.eso.org/public/news/eso1629/' },
        { title: 'Discovery Alert: Four Little Planets, One Big Step', org: 'NASA Science', url: 'https://science.nasa.gov/universe/exoplanets/discovery-alert-four-little-planets-one-big-step/' },
        { title: 'Our Nearest Celestial Neighbor? An Exotic 3-Star System', org: 'NASA Science', url: 'https://science.nasa.gov/exoplanets/other-stars-other-worlds/our-nearest-celestial-neighbor-an-exotic-3-star-system/' },
        { title: 'How does Gaia study the Milky Way?', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia/How_does_Gaia_study_the_Milky_Way' }
      ],
      tags: ['neighbourhood', 'neighborhood', 'nearest stars', 'alpha centauri', 'proxima centauri', 'proxima b', 'barnard', 'sirius', 'sirius b', 'white dwarf', 'epsilon eridani', 'tau ceti', 'red dwarf', 'parallax', 'light-year', 'parsec', 'local bubble', 'gaia', 'exoplanet']
    },

    /* ----------------------------------------------------------- SPIRAL ARMS */
    'spiral-arms': {
      name: 'The Galactic Spiral Arms',
      tagline: 'A Barred Spiral Galaxy',
      type: 'Galactic structure',
      intro: 'The Milky Way is a barred spiral galaxy, with great curving arms of gas, dust and young stars. The Sun lies in a small spur between two of the larger arms, about 26,000 light-years from the center.',
      everyday: 'The Sun circles the galaxy once every 220 to 240 million years, so the last time we were at this spot in orbit, dinosaurs were only beginning to appear.',
      keyFacts: [
        'Astronomers classify the Milky Way as a barred spiral, with a central bar of stars and several arms winding out from its ends.',
        'The Perseus and Scutum–Centaurus arms are the main stellar arms. The Sagittarius Arm and our own Orion Spur are smaller features.',
        'The Sun is about 26,000 light-years from the Galactic Center and orbits at roughly 230 km/s.',
        'Arms are bright because they hold young, hot stars and glowing gas clouds such as the Orion Nebula, about 1,350 light-years away.',
        'We live inside the disk, so no one has seen the galaxy’s spiral shape from outside. Maps are built indirectly.'
      ],
      measurements: [
        { label: 'Sun’s distance from the center', value: 'about 26,000 light-years (8 kiloparsecs)' },
        { label: 'Sun’s orbital speed', value: 'about 230 km/s' },
        { label: 'Orbital period (galactic year)', value: 'about 220–240 million years' },
        { label: 'Stellar disk thickness near the Sun', value: 'about 1,000 light-years' },
        { label: 'Orion Nebula distance', value: 'about 1,350 light-years' },
        { label: 'Number of major arms', value: 'debated: two major stellar arms, more in gas' }
      ],
      surprises: [
        'The Sun lies in a spur that is not one of the main arms. The Milky Way’s clear spiral pattern is hard to see from inside, so our exact position within it is still being refined.',
        'In July 2026, Chandra researchers used X-ray echoes from gamma-ray bursts to measure the distance to dust in three arms. That geometric method does not rely on assumptions about how the galaxy rotates.'
      ],
      explore: [
        { heading: 'What a spiral arm is', status: 'confirmed',
          body: 'Spiral arms are long, curved bands where gas, dust and stars are more concentrated than average. They stand out because gas piles up there and forms new stars, including hot blue giants that shine brightly but live only a few million years. These stars light up nearby gas as glowing nebulae, such as the Orion Nebula, a nearby star-forming region. Most of the galaxy’s older stars are spread through the whole disk, so arms are only modestly denser in total stars than the gaps between them. The Orion Nebula is in our own local spur.' },
        { heading: 'Mapping a galaxy from inside', status: 'confirmed',
          body: 'Dust blocks visible light along most directions in the disk, so astronomers rely on radio and infrared light. Radio telescopes track molecular gas and tiny natural masers around young stars, while infrared surveys count stars. Very precise parallaxes of masers and Gaia stars give distances directly. Together these show that the Perseus and Scutum–Centaurus arms are the strongest in stars, and that the Sagittarius Arm and Orion Spur are smaller. Pictures of the Milky Way seen from above are illustrations built on these data, not photographs.' },
        { heading: 'Why spirals persist', status: 'hypothesis',
          body: 'The leading idea is that arms are density waves, patterns that rotate more slowly than the stars and gas, which move through them like cars passing through a traffic jam. A passing star briefly lingers in the arm, and gas gets compressed and forms stars there. Other mechanisms may also matter, including the bar, flybys of smaller galaxies, and short-lived arm fragments that constantly form and fade. Observations of other galaxies show several kinds of spirals, so it is not settled that one explanation covers the Milky Way.' },
        { heading: 'How many arms do we have?', status: 'open',
          body: 'There is no agreed count. Infrared star counts have suggested two major arms, while gas and young-star tracers show four or more arm segments. Different surveys cover different parts of the disk, and distances along our line of sight are hard to measure, especially across the galaxy’s far side. New Gaia and maser data keep refining the picture, and results from X-ray echoes suggest that the outer arms may lie somewhat farther out than earlier estimates. Any picture of the arm pattern is therefore a best current model and may change.' }
      ],
      discover: [
        { heading: 'The Sun’s orbit', status: 'confirmed',
          body: 'For a roughly circular orbit, the Sun’s speed v at galactocentric radius R satisfies v²/R = GM(<R)/R². With v ≈ 230 km/s and R ≈ 8.2 kpc (2.5 × 10²⁰ m), the orbital period is 2πR/v ≈ 7 × 10⁸ years ÷ 3, roughly 220–230 million years, so the Sun has completed about 20 orbits. The Sun is not on a perfect circle: it oscillates up and down through the disk roughly every 60 to 70 million years, and drifts in radius. The Sun’s speed also puts it near the corotation region, where stars move at about the same rate as the arm pattern, a point that is still debated.',
          equation: 'P = 2πR / v',
          equationNote: 'P = orbital period, R = distance from the galactic center, v = orbital speed.' },
        { heading: 'Density waves and their limits', status: 'hypothesis',
          body: 'In density-wave theory, a spiral pattern rotates rigidly at angular speed Ω_p. Stars and gas orbit at Ω(R), and where Ω differs from Ω_p they pass through the pattern, compressing gas into shocks that trigger star formation. Corotation occurs where Ω = Ω_p, and the pattern speed of the Milky Way’s arms is not well constrained. Estimates range widely, and the relation between the bar’s speed and the arms’ speed remains open. Simulations also produce transient, winding arms without a rigid pattern, and these cannot yet be ruled out for the Milky Way. This is a model checked by observation, not an observation itself.',
          equation: 'Ω(R) = v(R) / R   (corotation: Ω = Ω_p)',
          equationNote: 'Ω = angular speed of stars at radius R, Ω_p = angular speed of the spiral pattern.' }
      ],
      hotspots: [
        { id: 'orion-spur', label: 'Orion Spur', text: 'A minor arm segment, thousands of light-years long, where the Sun and the Orion Nebula lie. It sits between the Perseus and Sagittarius arms and is sometimes called the Local Arm.' },
        { id: 'perseus-arm', label: 'Perseus Arm', text: 'One of the two major stellar arms, lying farther from the center than the Sun. It is rich in star-forming gas and has been traced with radio parallaxes of masers.' },
        { id: 'sagittarius-arm', label: 'Sagittarius Arm', text: 'An arm that lies between the Sun and the Galactic Center. It is conspicuous in gas and young stars, but holds fewer old stars than the major arms.' },
        { id: 'scutum-centaurus-arm', label: 'Scutum–Centaurus Arm', text: 'A major arm that winds out from one end of the central bar. Its inner part is hidden by dust and distance, so it is among the harder arms to map from our position.' }
      ],
      missions: ['gaia', 'chandra', 'hubble', 'jwst'],
      sources: [
        { title: 'NASA’s Chandra Examines Milky Way at Arms’ Length', org: 'NASA Science / Chandra', url: 'https://science.nasa.gov/missions/chandra/nasas-chandra-examines-milky-way-at-arms-length/' },
        { title: 'How does Gaia study the Milky Way?', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia/How_does_Gaia_study_the_Milky_Way' },
        { title: 'The Milky Way', org: 'NASA Science', url: 'https://science.nasa.gov/milky-way/' }
      ],
      tags: ['spiral arms', 'spiral galaxy', 'barred spiral', 'orion spur', 'local arm', 'perseus arm', 'sagittarius arm', 'scutum-centaurus', 'density wave', 'galactic year', 'orion nebula', 'hii region', 'maser', 'milky way']
    },

    /* -------------------------------------------------------- GALACTIC CENTER */
    'galactic-center': {
      name: 'The Galactic Center',
      tagline: 'Home of a Supermassive Black Hole',
      type: 'Galactic nucleus',
      intro: 'At the center of the Milky Way lies a crowded cluster of stars around Sagittarius A*, a black hole about 4 million times the Sun’s mass. Thick dust hides it from visible-light view.',
      everyday: 'Sagittarius A* has roughly 4 million times the Sun’s mass, but its event horizon would fit inside the orbit of Mercury, which is only about 0.4 AU from the Sun.',
      keyFacts: [
        'The center is about 26,000 to 27,000 light-years from the Sun, in the direction of the constellation Sagittarius.',
        'Sagittarius A* has a mass of about 4.3 million Suns. The Event Horizon Telescope released its image on 12 May 2022.',
        'The star S2 orbits Sagittarius A* every 16 years, which allowed astronomers to measure the black hole’s mass.',
        'The 2020 Nobel Prize in Physics honoured Reinhard Genzel and Andrea Ghez for this discovery, and Roger Penrose for black-hole theory.',
        'Dust dims visible light from the center by about a factor of a trillion, so astronomers observe in radio, infrared and X-rays.'
      ],
      measurements: [
        { label: 'Distance from the Sun', value: 'about 26,000–27,000 light-years' },
        { label: 'Mass of Sagittarius A*', value: 'about 4.3 million solar masses' },
        { label: 'Schwarzschild radius', value: 'about 12.7 million km (0.085 AU)' },
        { label: 'Orbital period of star S2', value: 'about 16 years' },
        { label: 'Nuclear star cluster mass', value: 'about 25 million solar masses' },
        { label: 'Fermi bubbles extent', value: 'about 25,000 light-years above and below the disk' }
      ],
      surprises: [
        'Sagittarius A* is dim for a black hole of its size. It is currently accreting very little gas, so what the EHT imaged was the glowing ring around its shadow, not the hole itself.',
        'Star S2 swings past Sagittarius A* at about 7,700 km/s, roughly 2.5% of the speed of light, and its orbit shows the effects of general relativity.'
      ],
      explore: [
        { heading: 'A black hole we can weigh', status: 'confirmed',
          body: 'For about 30 years, two teams used infrared telescopes to follow individual stars racing around an invisible point at the center. Their orbits show that about 4 million solar masses are packed into a region smaller than our Solar System. The most plausible object is a black hole, and the 2022 Event Horizon Telescope image of a bright ring around a dark shadow supports that. The 2020 Nobel Prize in Physics was awarded half to Roger Penrose for black-hole theory and half jointly to Reinhard Genzel and Andrea Ghez for the discovery of a supermassive compact object at the galaxy’s center.' },
        { heading: 'Crowded stars and a hidden view', status: 'confirmed',
          body: 'Around the black hole sits the nuclear star cluster, a dense ball of millions of stars about 25 million solar masses in total, within a few parsecs. Beyond it stretches a larger bar of stars, perhaps 25,000 light-years long. In visible light, dust between us and the center dims the glow by many orders of magnitude, so astronomers look through it using radio, infrared, X-ray and gamma-ray telescopes. The result is a crowded, active region with gas clouds, young stars and X-ray flares.' },
        { heading: 'Giant bubbles above and below', status: 'confirmed',
          body: 'In 2010, NASA’s Fermi Gamma-ray Space Telescope found two huge lobes of gamma-ray light extending about 25,000 light-years above and below the galactic plane. The Fermi bubbles are real structures, with sharp edges seen in gamma rays and related features in X-rays and radio. What produced them is not settled, which is why the origin is an open question. Candidates include a past outburst from gas falling onto the black hole, and a burst of star formation near the center that drove a wind.' },
        { heading: 'Why the center is quiet now', status: 'hypothesis',
          body: 'Sagittarius A* is a low-luminosity black hole, glowing at far less than a thousandth of its theoretical maximum. It is thought that it is fed mainly by stellar winds from nearby massive stars rather than by a large disk of gas. Evidence from light echoes and X-ray features suggests that it may have been much brighter within the last few hundred to few thousand years, but interpretations differ. Whether it had major active phases in the more distant past is part of the same debate as the Fermi bubbles.' }
      ],
      discover: [
        { heading: 'Weighing the black hole with Kepler’s law', status: 'confirmed',
          body: 'Star S2 follows an elliptical orbit of period T ≈ 16.05 years and semi-major axis a ≈ 1,000 AU (about 0.005 parsec). Kepler’s third law in SI units gives the enclosed mass. Using a in AU and T in years, M in solar masses is a³/T²: 1,030³ / 16.05² ≈ 4.2 million. Detailed fits by the Keck and ESO VLT teams give 4.0 to 4.3 million solar masses, with the variation mostly caused by uncertainty in the distance to the center. S2’s closest approach is about 120 AU, and its precession and gravitational redshift match general relativity.',
          equation: 'M = 4π² a³ / (G T²)',
          equationNote: 'M = central mass, a = semi-major axis of the orbit, T = orbital period, G = gravitational constant.' },
        { heading: 'The Schwarzschild radius and the shadow', status: 'confirmed',
          body: 'A non-rotating black hole’s event horizon has radius r_s = 2GM/c². For M = 4.3 million solar masses, r_s ≈ 2.95 km × 4.3 × 10⁶ ≈ 12.7 million km, which is about 0.085 AU, or 18 times the Sun’s radius. Light bending makes the apparent shadow larger, about 2.6 r_s across in radius. At 8.2 kpc this appears only about 50 microarcseconds wide, so imaging it needed the Earth-sized Event Horizon Telescope. The ring’s size matches the prediction of general relativity for a black hole of this mass, though the spin and orientation are less well constrained.',
          equation: 'r_s = 2GM / c²',
          equationNote: 'G = gravitational constant, M = black hole mass, c = speed of light; r_s ≈ 2.95 km per solar mass.' },
        { heading: 'Extinction toward the center', status: 'confirmed',
          body: 'Interstellar dust absorbs and scatters short wavelengths most strongly. Toward the Galactic Center the visual extinction is about 30 magnitudes, a factor of 10¹² in brightness, while at 2.2 micrometres in the near-infrared it is only about 2.5 magnitudes, a factor of about 10. This is why the stellar orbits were measured with infrared adaptive optics rather than visible-light telescopes. Radio waves and X-rays above a few kiloelectronvolts also pass through the dust largely unattenuated, which allows Event Horizon Telescope and Chandra observations.',
          equation: 'm_observed = m_true + A',
          equationNote: 'A = extinction in magnitudes; a change of 2.5 magnitudes corresponds to a factor of 10 in brightness.' }
      ],
      hotspots: [
        { id: 'sgr-a-star', label: 'Sagittarius A*', text: 'The supermassive black hole at the center of the galaxy, with a mass of about 4.3 million Suns. The Event Horizon Telescope imaged its glowing ring and central shadow in 2022.' },
        { id: 'galactic-bar', label: 'Galactic bar', text: 'A elongated structure of older stars crossing the center of the galaxy. It is seen in infrared surveys, and is why the Milky Way is classed as a barred spiral.' },
        { id: 'nuclear-star-cluster', label: 'Nuclear star cluster', text: 'A dense group of millions of stars in the central few parsecs, about 25 million solar masses in total. Stars such as S2 orbit within it, close to the black hole.' },
        { id: 'fermi-bubbles', label: 'Fermi bubbles', text: 'Two giant gamma-ray lobes, each about 25,000 light-years tall, above and below the galactic center. They were found in 2010, but how they formed is still debated.' }
      ],
      missions: ['event-horizon-telescope', 'chandra', 'jwst', 'hubble'],
      sources: [
        { title: 'Astronomers reveal first image of the black hole at the heart of our galaxy', org: 'ESO', url: 'https://www.eso.org/public/news/eso2208-eht-mw/' },
        { title: 'Telescopes Show the Milky Way’s Black Hole is Ready for a Kick', org: 'Chandra X-ray Center', url: 'https://chandra.harvard.edu/press/24_releases/press_020824.html' },
        { title: 'NASA’s Fermi Telescope Finds Giant Structure in our Galaxy', org: 'NASA', url: 'https://www.nasa.gov/universe/nasas-fermi-telescope-finds-giant-structure-in-our-galaxy/' }
      ],
      tags: ['galactic center', 'galactic centre', 'sagittarius a*', 'sgr a*', 'black hole', 'supermassive', 'event horizon telescope', 'eht', 's2', 'genzel', 'ghez', 'nobel', 'nuclear star cluster', 'galactic bar', 'fermi bubbles', 'schwarzschild']
    },

    /* ------------------------------------------------------- OUTER MILKY WAY */
    'outer-milky-way': {
      name: 'The Outer Milky Way',
      tagline: 'A Galaxy Without a Sharp Edge',
      type: 'Galactic disk and outskirts',
      intro: 'The Milky Way’s disk gets thinner and sparser toward its outskirts, with no clear boundary. Its outer disk is warped and flared, and nearby small galaxies orbit it.',
      everyday: 'Imagine a dandelion puff drifting in the wind: the galaxy’s disk fades away gradually, so how big it is depends on where you decide it has become too thin to count.',
      keyFacts: [
        'The Milky Way’s stellar disk is at least 100,000 light-years across, and thin outskirts extend farther.',
        'The outer disk is warped, bending up on one side and down on the other, and it flares, becoming thicker with distance.',
        'The Large Magellanic Cloud is about 160,000 light-years away and the Small Magellanic Cloud about 200,000 light-years away.',
        'The Sagittarius dwarf galaxy is being stretched into streams of stars as it falls through the Milky Way.',
        'There is no edge to reach: stars and gas thin out gradually, and the dark matter halo extends much farther still.'
      ],
      measurements: [
        { label: 'Stellar disk diameter', value: 'at least 100,000 light-years' },
        { label: 'Sun’s distance from the center', value: 'about 26,000 light-years' },
        { label: 'Large Magellanic Cloud distance', value: 'about 160,000 light-years' },
        { label: 'Small Magellanic Cloud distance', value: 'about 200,000 light-years' },
        { label: 'Disk thickness near the Sun', value: 'about 1,000 light-years (grows outward)' },
        { label: 'Satellite galaxies known', value: 'several dozen, mostly small and faint' }
      ],
      surprises: [
        'Seen edge-on, the Milky Way’s outer disk is not flat. It resembles a gently warped record, with one side bent upward and the opposite side bent downward.',
        'Gaia data revealed a spiral-shaped pattern in how stars near the Sun move up and down, a sign that something disturbed the disk in the past few hundred million years.'
      ],
      explore: [
        { heading: 'Where does the galaxy end?', status: 'confirmed',
          body: 'Stars become rarer step by step as you go outward, so any size depends on a definition. A common choice for the main stellar disk is about 100,000 light-years across, though some studies find stars farther out. Atomic hydrogen gas reaches farther than most stars, and the dark matter halo, discussed in the halo stop, reaches many times farther still. So there is no wall to reach. The tour’s outer-disk view is a tidy illustration, with the “edge” standing for a point where the visible disk fades away.' },
        { heading: 'A warped and flared disk', status: 'confirmed',
          body: 'Maps of gas and stars show that beyond about 40,000 light-years from the center the disk bends away from a flat plane, with one side curving up and the other down. The disk also flares, growing thicker toward the outskirts, because gravity holding stars close to the plane is weaker there. Both features are well observed. What causes the warp is less certain. Candidates include the pull of orbiting dwarf galaxies, gas flowing in from outside, and the lopsided gravity of the dark matter halo, and several may contribute.' },
        { heading: 'The Magellanic Clouds and other companions', status: 'confirmed',
          body: 'The Large and Small Magellanic Clouds, visible to the naked eye from the Southern Hemisphere, are the largest satellites of the Milky Way. Hubble and Gaia measurements of their motion suggest they may be passing the galaxy for the first time, rather than orbiting for billions of years. They are linked by a stream of gas. The Sagittarius dwarf galaxy, about 70,000 light-years away, is another satellite that is being pulled apart and wrapped into a stream of stars around the galaxy.' },
        { heading: 'Is the disk still being disturbed?', status: 'hypothesis',
          body: 'Gaia revealed ripples and a phase-space spiral in the stars around the Sun, as if the disk had been rung like a bell. One leading explanation is that a passage of the Sagittarius dwarf, within the last few hundred million years, disturbed the disk. Another is that the galaxy’s bar and arms are responsible. Studies disagree on how much each of these contributes, so the cause is not settled, although the signal itself is firmly observed.' }
      ],
      discover: [
        { heading: 'Defining the size of a galaxy', status: 'confirmed',
          body: 'The stellar disk is described by an exponential surface density, Σ(R) = Σ₀ exp(−R/R_d), with a scale length R_d near 2.5 to 3.5 kpc (about 8,000 to 11,000 light-years). Each additional scale length lowers the density by a factor of e, about 2.7, so a diameter depends on how far out you accept stars. Other definitions use a fixed surface brightness, half of the light, or the halo’s virial radius, which is a few hundred kiloparsecs. Because these differ by a factor of several, a single “size” number for the Milky Way should always be read together with how it is defined.',
          equation: 'Σ(R) = Σ₀ · exp(−R / R_d)',
          equationNote: 'Σ = surface density of stars, R = distance from the center, R_d = disk scale length, Σ₀ = central density.' },
        { heading: 'Flaring and the weakening vertical pull', status: 'confirmed',
          body: 'A disk star oscillates up and down about the midplane at a frequency set by the local mass density, ν² = 4πGρ. In the outer galaxy the gas and stellar density drops, so this restoring force weakens. Stars with the same vertical energy then reach greater heights, and the layer flares. The size of the effect depends on the age of the stellar population, since older stars have larger velocity dispersions and flare more. Measuring it needs distances and motions across the disk, which Gaia and large spectroscopic surveys now supply, though dust and selection effects limit the results.',
          equation: 'ν² ≈ 4πGρ',
          equationNote: 'ν = vertical oscillation frequency, G = gravitational constant, ρ = local mass density near the midplane.' }
      ],
      hotspots: [
        { id: 'disk-warp', label: 'Disk warp', text: 'Beyond about 40,000 light-years from the center the disk bends out of a flat plane, up on one side and down on the other. The effect is clear in gas and in stars.' },
        { id: 'outer-disk', label: 'Outer disk', text: 'The sparse outskirts of the stellar disk, where stars thin out gradually and the layer becomes thicker. Some studies find disk stars reaching well beyond 100,000 light-years across.' },
        { id: 'no-sharp-edge', label: 'No sharp edge', text: 'The Milky Way has no outer boundary. Stars and gas fade slowly with distance, and the dark matter halo extends beyond them. Any quoted size depends on how it is defined.' },
        { id: 'magellanic-clouds', label: 'Magellanic Clouds', text: 'Two dwarf galaxies, about 160,000 and 200,000 light-years away, visible to the unaided eye from the Southern Hemisphere. They are the Milky Way’s largest satellites.' }
      ],
      missions: ['gaia', 'hubble', 'jwst', 'chandra'],
      sources: [
        { title: 'How does Gaia study the Milky Way?', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia/How_does_Gaia_study_the_Milky_Way' },
        { title: 'NASA’s Chandra Examines Milky Way at Arms’ Length', org: 'NASA Science / Chandra', url: 'https://science.nasa.gov/missions/chandra/nasas-chandra-examines-milky-way-at-arms-length/' },
        { title: 'The Milky Way', org: 'NASA Science', url: 'https://science.nasa.gov/milky-way/' }
      ],
      tags: ['outer milky way', 'galactic disk', 'warp', 'flare', 'edge of the galaxy', 'size of the milky way', 'magellanic clouds', 'lmc', 'smc', 'sagittarius dwarf', 'satellite galaxies', 'outer disk']
    },

    /* ------------------------------------------------------------------ HALO */
    'halo': {
      name: 'The Galactic Halo',
      tagline: 'Old Stars and Unseen Matter',
      type: 'Galactic halo',
      intro: 'A sparse, roughly spherical halo surrounds the Milky Way’s disk. It holds ancient stars, globular clusters, and the streams of past mergers, and sits within a much larger halo of dark matter.',
      everyday: 'If the Milky Way’s mass were a 100-gram cake, only about 5 grams would be stars and gas. The other 95 grams, evidence suggests, are dark matter.',
      keyFacts: [
        'The stellar halo is old and metal-poor, meaning its stars contain much smaller amounts of elements heavier than helium than the Sun does.',
        'About 150 to 160 globular clusters orbit the galaxy, most with ages of roughly 11 to 13 billion years.',
        'Stellar streams are the stretched remains of small galaxies and clusters torn apart by the Milky Way’s gravity.',
        'Dark matter is inferred from its gravity. It has never been detected directly, and its nature is unknown.',
        'The Milky Way’s total mass is about 1 to 1.5 trillion Suns, with a sizeable uncertainty.'
      ],
      measurements: [
        { label: 'Globular clusters', value: 'about 150–160 known' },
        { label: 'Typical globular cluster age', value: 'about 11–13 billion years' },
        { label: 'Total mass of the Milky Way', value: 'about 1–1.5 trillion solar masses (uncertain)' },
        { label: 'Stellar mass of the disk and bulge', value: 'about 50–60 billion solar masses' },
        { label: 'Typical halo-star iron content', value: 'about 3% of the Sun’s, or less' },
        { label: 'Rotation speed at the Sun', value: 'about 230 km/s' }
      ],
      surprises: [
        'The outer galaxy rotates much faster than the visible matter alone can explain. Vera Rubin and colleagues found similar flat rotation curves in many spiral galaxies, evidence that sparked the dark matter idea.',
        'Gaia found halo stars that move backward relative to the disk. They are thought to be debris from a smaller galaxy that merged with the Milky Way about 8 to 11 billion years ago.'
      ],
      explore: [
        { heading: 'Ancient stars in the halo', status: 'confirmed',
          body: 'Halo stars orbit in all directions, unlike the disk’s orderly rotation. They are mostly old, and metal-poor, because they formed when earlier generations of stars had made fewer heavy elements. In astronomy, any element heavier than helium is a metal. Their motions and chemistry carry a record of how the galaxy was built. The halo holds only a small fraction of the galaxy’s stars, about 1% or 2%, but they are among the oldest stars known and offer clues about the early universe.' },
        { heading: 'Globular clusters', status: 'confirmed',
          body: 'Globular clusters are dense, ball-shaped groups of hundreds of thousands of stars, bound by gravity. About 150 to 160 are known around the Milky Way, and measured ages for most are roughly 11 to 13 billion years, making them some of the oldest structures in the galaxy. Hubble observations of their stars help to date them. Some may have formed inside smaller galaxies that the Milky Way later absorbed, while others may have formed early in the Milky Way itself. How they first formed is still being studied.' },
        { heading: 'Streams from past mergers', status: 'confirmed',
          body: 'The Milky Way grows partly by absorbing smaller galaxies. As a small galaxy or cluster falls in, tides stretch it into a long ribbon of stars called a stellar stream. The Sagittarius stream wraps around the sky, and Gaia has revealed many more. Counting and mapping these streams shows that the galaxy has a history of mergers, and that some happened billions of years ago. Streams are also used to probe the shape of the dark matter halo, because its gravity bends their paths.' },
        { heading: 'The dark matter halo', status: 'open',
          body: 'Several independent lines of evidence point to unseen matter. Stars and gas orbit faster than the visible mass allows, light from distant galaxies bends more than visible mass explains, the cosmic microwave background shows that dark matter outweighs ordinary matter about five to one, and the Bullet Cluster collision shows mass separated from hot gas. What dark matter is remains unknown. Alternatives that change gravity, such as MOND, have difficulty explaining all these observations at once, though they are still studied.' }
      ],
      discover: [
        { heading: 'Flat rotation curves', status: 'confirmed',
          body: 'For a roughly circular orbit, gravity supplies the centripetal force: v² = GM(<r)/r, where M(<r) is the mass inside radius r. If most mass were in the visible disk, v would fall as 1/√r beyond the disk, as planets’ speeds fall with distance from the Sun. Instead rotation curves stay flat, near 220–230 km/s for the Milky Way. A constant v means M(<r) grows in proportion to r, as for an isothermal halo whose density falls as 1/r². At the Sun’s radius, 230 km/s and 8.2 kpc give about 10¹¹ solar masses enclosed. The mass out to the halo’s edge is estimated at 1 to 1.5 trillion.',
          equation: 'v² = G M(<r) / r   ⇒   flat v gives M(<r) ∝ r',
          equationNote: 'v = orbital speed, G = gravitational constant, M(<r) = mass within radius r.' },
        { heading: 'Metallicity and stellar populations', status: 'confirmed',
          body: 'Astronomers measure metallicity by comparing a star’s iron-to-hydrogen ratio with the Sun’s, on a logarithmic scale. A value of −1.5 means about 3% of the solar ratio. Disk stars like the Sun are metal-rich, “Population I,” while halo stars are typically metal-poor, near −1.5, and the oldest stars are lower still. The relation is not perfectly clean: mergers brought in stars with a range of chemistry, so the halo contains an “accreted” and an “in situ” part. Using chemistry together with Gaia orbits is how the debris from individual mergers is identified.',
          equation: '[Fe/H] = log₁₀(N_Fe / N_H)★ − log₁₀(N_Fe / N_H)☉',
          equationNote: 'N_Fe / N_H = ratio of iron to hydrogen atoms in the star (★) and in the Sun (☉); [Fe/H] = −1 means one tenth of the solar value.' },
        { heading: 'Weighing the Milky Way', status: 'hypothesis',
          body: 'Total mass estimates rely on tracers far from the disk: globular clusters, satellite galaxies, halo stars and stellar streams, whose speeds are combined with a model of the halo. Published values for the mass within the halo’s virial radius range from roughly 0.8 to 1.5 trillion solar masses, and different tracers do not always agree. The result also depends on assumptions, such as whether tracers are in equilibrium, and the recent infall of the Large Magellanic Cloud can bias it. The value is therefore reported with large uncertainty, rather than as a single number.' }
      ],
      hotspots: [
        { id: 'globular-clusters', label: 'Globular clusters', text: 'Dense, ball-shaped groups of hundreds of thousands of stars. About 150 to 160 orbit the Milky Way, and most are roughly 11 to 13 billion years old.' },
        { id: 'stellar-streams', label: 'Stellar streams', text: 'Long ribbons of stars torn from small galaxies and clusters by the Milky Way’s gravity. They record past mergers and trace the shape of the dark matter halo.' },
        { id: 'dark-matter-halo', label: 'Dark matter halo', text: 'A vast, invisible halo that evidence says holds most of the galaxy’s mass. It is detected only by its gravity, and what it is made of remains unknown.' },
        { id: 'old-stars', label: 'Old stars', text: 'Ancient halo stars that are metal-poor and move on tilted or looping orbits. Many formed billions of years ago, and some came from galaxies that merged with ours.' }
      ],
      missions: ['hubble', 'gaia', 'chandra', 'jwst'],
      sources: [
        { title: 'Dark Matter', org: 'NASA Science', url: 'https://science.nasa.gov/dark-matter/' },
        { title: 'Hubble Dark Matter', org: 'NASA Science', url: 'https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-dark-matter/' },
        { title: 'Dark Matter 101: Looking for the Missing Mass', org: 'NASA Science', url: 'https://science.nasa.gov/universe/stories/quick-reads/dark-matter-101-looking-for-the-missing-mass/' },
        { title: 'How does Gaia study the Milky Way?', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia/How_does_Gaia_study_the_Milky_Way' }
      ],
      tags: ['halo', 'galactic halo', 'dark matter', 'globular clusters', 'stellar streams', 'old stars', 'metal-poor', 'metallicity', 'rotation curve', 'vera rubin', 'bullet cluster', 'lensing', 'mond', 'gaia-enceladus', 'sagittarius stream', 'population ii']
    }

  });
})(window);
