# ASTROVIA — Your Journey Through the Universe

An interactive 3D space-exploration website: plain HTML, CSS and vanilla JavaScript with Three.js (r128).
No framework, no build step.

## Run it

```
cd astrovia
python3 -m http.server 8000      # then open http://localhost:8000
```

Opening `index.html` directly (file://) also works: Earth textures are loaded from `assets/earth-data.js`.
Three.js loads from a CDN with a local fallback in `js/vendor/`. Fonts (Inter, Instrument Serif) load from
Google Fonts and fall back to system fonts when offline.

## Use it

Scroll (or use ↓ / → / Space / Page Down) to travel; the camera settles at each destination and an
information panel appears. Scrolling again resumes travel. Press **Inspect in 3D** to rotate and zoom
(Esc leaves). Settings (motion, pause, text size, contrast, labels, Simple view) are in the HUD.
Simple view and the no-WebGL fallback show every destination as an ordinary page with the same content.

## Edit the content

| What | File |
|------|------|
| Route, stages, travel captions | `js/data/route.js` |
| Destination text, hotspots, references | `js/data/destinations-1..4.js` (schema: `DEV_NOTES.md` §2) |
| Missions (status + `asOf` date) | `js/data/missions-1..2.js` |
| Glossary, facts of the day, sources, compare data, scale rungs, quizzes | `js/data/*.js` |
| About page (placeholder, edit me) | `js/data/about.js` |
| Colours, layout | `css/styles.css` |

## Notes on accuracy

* Every section is labelled Confirmed, Hypothesis or Open question.
* Distances and sizes in the 3D tour are compressed; the site says so, and Cosmic Scale shows real values.
* Mission statuses are dated (authored October 2026) and change; each links to an official page.
* The reference URLs could not be re-checked automatically when this was built (the build sandbox had no
  general web access). Please spot-check links before publishing.
* Planet surfaces are procedurally generated interpretations; Earth uses NASA imagery (via the
  `three-globe` package, MIT licence). The Milky Way is an illustrative model, not a photograph.
* `js/data/about.js` is placeholder text; nothing there is a claim about a real organisation.
