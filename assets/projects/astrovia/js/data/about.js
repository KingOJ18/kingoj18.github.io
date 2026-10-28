/* ==========================================================================
   ASTROVIA — data/about.js
   EDIT ME. Everything in this file is placeholder text until real details
   about the research group are available. Nothing here is a claim about a real
   organisation, funding source, publication or credential.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});

  A.about = {
    placeholderNote: 'This section contains editable placeholder content. Replace it in js/data/about.js with your group’s real details.',
    orgName: 'Astrovia',
    tagline: 'Look beyond. Discover everything.',
    mission: 'Astrovia is a space research and education group. Our purpose is to make the scale, beauty and open questions of the Universe accessible to anyone who is curious — from first-time stargazers to students ready for advanced astrophysics.',
    education: 'We build free, accurate, easy-to-explore learning experiences. Every fact on this site is drawn from published observations and trusted space agencies, and we clearly separate what is confirmed, what is hypothesized, and what is still unknown.',
    researchInterests: [
      { title: 'Planetary science', text: 'Surfaces, atmospheres and interiors of worlds in the Solar System, and how they compare.' },
      { title: 'Small bodies and the outer Solar System', text: 'Asteroids, comets, Kuiper Belt objects and what they reveal about the early Solar System.' },
      { title: 'Galactic structure and dark matter', text: 'How the Milky Way is built, how stars move within it, and the evidence for unseen mass.' },
      { title: 'Science communication', text: 'Interactive visualisation and teaching methods that make astronomy understandable and inclusive.' }
    ],
    team: [
      { name: 'Team member name', role: 'Role / title', bio: 'Short biography placeholder.' },
      { name: 'Team member name', role: 'Role / title', bio: 'Short biography placeholder.' },
      { name: 'Team member name', role: 'Role / title', bio: 'Short biography placeholder.' }
    ],
    contact: {
      email: 'hello@example.org',
      address: 'Your institution, street address, city, country',
      social: [
        { label: 'Website', url: 'https://example.org' }
      ]
    },
    footerLinks: {
      group:     { label: 'Research group', action: 'about' },
      education: { label: 'Educational resources', action: 'sources' },
      references:{ label: 'References', action: 'sources' },
      access:    { label: 'Accessibility', action: 'accessibility' },
      contact:   { label: 'Contact', action: 'about' }
    },
    credits: 'Planet appearances are procedurally generated for this site and inspired by NASA, ESA and other agency imagery. They are artistic interpretations, not photographs.'
  };
})(window);
