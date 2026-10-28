/* ==========================================================================
   ASTROVIA — data/quizzes.js   (end-of-stage quizzes, 3 questions each)
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});

  A.quizzes = {
    home: {
      title: 'Our Home: Earth and the Moon',
      questions: [
        { q: 'Roughly how far away is the Moon?',
          options: ['About 38,000 km', 'About 384,000 km', 'About 3.8 million km', 'About 150 million km'],
          answer: 1,
          explain: 'The Moon orbits Earth at an average distance of about 384,400 km. Light covers that gap in about 1.3 seconds.' },
        { q: 'Why do we always see the same side of the Moon?',
          options: ['The Moon does not rotate at all', 'The far side is always dark', 'Its rotation matches its orbit, about 27 days each', 'Earth’s gravity holds the other side hidden'],
          answer: 2,
          explain: 'The Moon is tidally locked: it turns once for every orbit around Earth. The far side gets sunlight too, so it is not permanently dark.' },
        { q: 'What causes the seasons on Earth?',
          options: ['Earth’s axis is tilted about 23.4°', 'Earth moves much closer to the Sun in summer', 'The Sun gets hotter and cooler each year', 'The Moon blocks sunlight in winter'],
          answer: 0,
          explain: 'Earth’s tilt changes how directly sunlight strikes each hemisphere through the year. Earth’s distance from the Sun varies only slightly.' }
      ]
    },

    solar: {
      title: 'The Solar System',
      questions: [
        { q: 'How much of the Solar System’s total mass is in the Sun?',
          options: ['About 50 percent', 'About 75 percent', 'About 90 percent', 'More than 99 percent'],
          answer: 3,
          explain: 'The Sun holds about 99.86 percent of the Solar System’s mass. All the planets together make up most of the rest.' },
        { q: 'Which planet is hottest on average, even though it is not the closest to the Sun?',
          options: ['Venus', 'Mercury', 'Mars', 'Jupiter'],
          answer: 0,
          explain: 'Venus’s thick carbon dioxide atmosphere traps heat, giving a surface of about 464 °C. Mercury has almost no atmosphere to hold its heat.' },
        { q: 'Which planet has a day that is longer than its year?',
          options: ['Mars', 'Mercury', 'Neptune', 'Venus'],
          answer: 3,
          explain: 'Venus turns once in about 243 Earth days but circles the Sun in about 225. It also spins backwards compared with most planets.' }
      ]
    },

    beyond: {
      title: 'Beyond the Planets',
      questions: [
        { q: 'Where is the main asteroid belt?',
          options: ['Between Mars and Jupiter', 'Between Earth and Mars', 'Beyond Neptune', 'Between Saturn and Uranus'],
          answer: 0,
          explain: 'The main belt lies roughly 2.2 to 3.2 AU from the Sun. Despite popular films, its asteroids are very widely spaced.' },
        { q: 'What is true of the Oort Cloud?',
          options: ['Voyager 1 flew through it in 2012', 'It is a hypothesized shell of icy bodies, not yet observed directly', 'It is a ring of rock inside Jupiter’s orbit', 'It is the Sun’s magnetic field'],
          answer: 1,
          explain: 'The Oort Cloud is inferred from the orbits of long-period comets. It is thought to lie thousands of AU away, far beyond any spacecraft.' },
        { q: 'What did Voyager 1 cross in 2012?',
          options: ['The Kuiper Belt’s outer edge', 'The orbit of Neptune', 'The heliopause, into interstellar space', 'The edge of the Milky Way'],
          answer: 2,
          explain: 'At about 121 AU, Voyager 1 left the heliosphere, the Sun’s bubble of solar wind. Voyager 2 followed in 2018.' }
      ]
    },

    galaxy: {
      title: 'The Milky Way',
      questions: [
        { q: 'About how far is the Sun from the center of the Milky Way?',
          options: ['About 260 light-years', 'About 2,600 light-years', 'About 26,000 light-years', 'About 260,000 light-years'],
          answer: 2,
          explain: 'Estimates are roughly 26,000 to 27,000 light-years. The Sun sits in the disk, near a minor spiral arm, well away from the crowded center.' },
        { q: 'What lies at the very center of the Milky Way?',
          options: ['A supermassive black hole, Sagittarius A*', 'A single giant star', 'An empty void', 'A cluster of planets'],
          answer: 0,
          explain: 'Stars orbiting Sagittarius A* reveal an object of about 4 million Sun masses. The 2022 Event Horizon Telescope image showed its glowing surroundings.' },
        { q: 'What is the best evidence that dark matter exists in our galaxy?',
          options: ['Dark clouds that block starlight', 'Stars far from the center orbit faster than visible matter can explain', 'The galaxy glows in dark colors', 'The Moon’s craters'],
          answer: 1,
          explain: 'Outer stars and gas move too fast to be held by visible mass alone, which suggests extra unseen mass. Its nature is still unknown.' }
      ]
    }
  };
})(window);
