/* ==========================================================================
   ASTROVIA — data/sources.js   Sources and Further Reading.
   Only well-known, stable top-level pages are listed. Check links periodically.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.sources = [
    { group: 'Space agencies', blurb: 'Primary sources for missions, discoveries and images.', items: [
      { title: 'NASA Science', org: 'NASA', url: 'https://science.nasa.gov/', note: 'News, mission pages and educational resources across space science.' },
      { title: 'Solar System Exploration', org: 'NASA', url: 'https://science.nasa.gov/solar-system/', note: 'Profiles of the Sun, planets, moons, asteroids and comets.' },
      { title: 'ESA Science & Exploration', org: 'European Space Agency', url: 'https://www.esa.int/Science_Exploration', note: 'ESA’s science missions, including Gaia, BepiColombo and JUICE.' },
      { title: 'JAXA', org: 'Japan Aerospace Exploration Agency', url: 'https://global.jaxa.jp/', note: 'Hayabusa2, Akatsuki and other Japanese missions.' },
      { title: 'ISRO', org: 'Indian Space Research Organisation', url: 'https://www.isro.gov.in/', note: 'Chandrayaan and Mangalyaan mission information.' },
      { title: 'CNSA', org: 'China National Space Administration', url: 'https://www.cnsa.gov.cn/english/', note: 'Chang’e and Tianwen missions.' }
    ]},
    { group: 'Planetary data', blurb: 'Measured values for planets and moons.', items: [
      { title: 'Planetary Fact Sheets', org: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/', note: 'Mass, size, orbit, gravity and temperature tables for each planet.' },
      { title: 'JPL Horizons', org: 'NASA JPL', url: 'https://ssd.jpl.nasa.gov/horizons/', note: 'Positions of Solar System bodies, spacecraft and more.' },
      { title: 'Solar System Dynamics', org: 'NASA JPL', url: 'https://ssd.jpl.nasa.gov/', note: 'Orbits, moon counts and small-body data.' },
      { title: 'Astrogeology Science Center', org: 'USGS', url: 'https://www.usgs.gov/centers/astrogeology-science-center', note: 'Maps and nomenclature for planetary surfaces.' },
      { title: 'Gazetteer of Planetary Nomenclature', org: 'IAU / USGS', url: 'https://planetarynames.wr.usgs.gov/', note: 'Official names of surface features.' }
    ]},
    { group: 'Mission pages', blurb: 'Official pages for missions mentioned in the tour.', items: [
      { title: 'Voyager', org: 'NASA JPL', url: 'https://science.nasa.gov/mission/voyager/', note: 'Voyager 1 and 2, the first spacecraft in interstellar space.' },
      { title: 'New Horizons', org: 'NASA', url: 'https://science.nasa.gov/mission/new-horizons/', note: 'The Pluto and Kuiper Belt mission.' },
      { title: 'Juno', org: 'NASA', url: 'https://science.nasa.gov/mission/juno/', note: 'Jupiter orbiter results.' },
      { title: 'Cassini', org: 'NASA', url: 'https://science.nasa.gov/mission/cassini/', note: 'The Saturn orbiter and Huygens probe.' },
      { title: 'Perseverance', org: 'NASA', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/', note: 'Rover exploring Jezero Crater.' },
      { title: 'Artemis', org: 'NASA', url: 'https://www.nasa.gov/humans-in-space/artemis/', note: 'NASA’s programme to return humans to the Moon.' }
    ]},
    { group: 'Observatories and telescopes', blurb: 'Facilities behind many of the observations.', items: [
      { title: 'Hubble Space Telescope', org: 'NASA / STScI', url: 'https://science.nasa.gov/mission/hubble/', note: 'Images and results from Hubble.' },
      { title: 'James Webb Space Telescope', org: 'NASA / ESA / CSA', url: 'https://science.nasa.gov/mission/webb/', note: 'Infrared observations of planets, stars and galaxies.' },
      { title: 'Gaia', org: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia', note: 'The three-dimensional map of the Milky Way.' },
      { title: 'Chandra X-ray Observatory', org: 'NASA / SAO', url: 'https://chandra.si.edu/', note: 'X-ray views of black holes and hot gas.' },
      { title: 'ESO', org: 'European Southern Observatory', url: 'https://www.eso.org/public/', note: 'Ground-based observatories in Chile, including the Galactic Center studies.' },
      { title: 'Event Horizon Telescope', org: 'EHT Collaboration', url: 'https://eventhorizontelescope.org/', note: 'The first images of black holes.' }
    ]},
    { group: 'Learning resources', blurb: 'Friendly places to keep learning.', items: [
      { title: 'NASA Space Place', org: 'NASA', url: 'https://spaceplace.nasa.gov/', note: 'Short explainers for beginners and students.' },
      { title: 'ESA Kids', org: 'ESA', url: 'https://www.esa.int/kids', note: 'Space for children and teachers.' },
      { title: 'Astronomy Picture of the Day', org: 'NASA', url: 'https://apod.nasa.gov/apod/', note: 'A new image each day with an expert explanation.' },
      { title: 'Eyes on the Solar System', org: 'NASA JPL', url: 'https://eyes.nasa.gov/apps/solar-system/', note: 'Interactive 3D tour using real mission data.' },
      { title: 'Stellarium Web', org: 'Stellarium', url: 'https://stellarium-web.org/', note: 'A free online planetarium for sky watching.' }
    ]},
    { group: 'Research and catalogues', blurb: 'For readers who want the primary literature.', items: [
      { title: 'NASA Astrophysics Data System', org: 'NASA / SAO', url: 'https://ui.adsabs.harvard.edu/', note: 'Search engine for astronomy papers.' },
      { title: 'arXiv astro-ph', org: 'Cornell University', url: 'https://arxiv.org/archive/astro-ph', note: 'Freely available preprints in astrophysics.' },
      { title: 'International Astronomical Union', org: 'IAU', url: 'https://www.iau.org/', note: 'Official definitions such as the 2006 planet definition.' },
      { title: 'Minor Planet Center', org: 'IAU', url: 'https://minorplanetcenter.net/', note: 'Official clearinghouse for asteroid and comet observations.' },
      { title: 'NASA Exoplanet Archive', org: 'NASA / Caltech', url: 'https://exoplanetarchive.ipac.caltech.edu/', note: 'Confirmed exoplanets and their properties.' }
    ]},
    { group: 'Dark sky and observing', blurb: 'See the Universe for yourself.', items: [
      { title: 'International Dark-Sky Association', org: 'DarkSky International', url: 'https://darksky.org/', note: 'Light pollution and finding dark skies.' },
      { title: 'Night Sky Network', org: 'NASA / ASP', url: 'https://nightsky.jpl.nasa.gov/', note: 'Find local astronomy clubs and monthly sky guides.' }
    ]}
  ];
})(window);
