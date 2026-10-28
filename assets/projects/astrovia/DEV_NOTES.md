# ASTROVIA — Developer notes and contracts

Plain HTML + CSS + vanilla JS + Three.js r128 (global `THREE`). **No frameworks, no ES modules,
no build step** (classic `<script>` tags so the site also works from `file://`).
Everything hangs off one global object: `window.ASTROVIA`.

```
astrovia/
  index.html            page shell (UI)
  css/styles.css        all styling (UI)
  js/vendor/three.min.js  local fallback copy of Three.js r128
  js/util.js            ASTROVIA.bus (events), ASTROVIA.settings, ASTROVIA.util   (done)
  js/data/route.js      ASTROVIA.route: stages, stops, hop captions               (done)
  js/data/destinations-1..4.js   ASTROVIA.destinations[id] content
  js/data/missions-1..2.js       ASTROVIA.missions (array, concatenated)
  js/data/glossary.js facts.js sources.js worlds.js scale.js quizzes.js about.js
  js/planets.js scenery.js layout.js engine.js   3D engine (shaders live inside planets.js / scenery.js)
  js/audio.js           optional generated ambience (off by default)
  assets/               Earth textures (+ earth-data.js, base64 copy used on file://)
  js/ui.js              interface logic (UI)
  js/app.js             bootstrap / glue
```

Script order in index.html: three (CDN + local fallback) → util.js → data/*.js →
planets.js → scenery.js → layout.js → engine.js → audio.js → ui.js → app.js.

## 1. Content rules (all data files)

* Science must be accurate and sourced from NASA, ESA, JAXA, CNSA, ISRO, ESO, STScI, Caltech/JPL,
  USGS, IAU, Max Planck, peer-reviewed research. **Never invent facts, numbers or URLs.**
  If you are not sure of a value, verify it with WebSearch / WebFetch (NASA fact sheets such as
  `https://nssdc.gsfc.nasa.gov/planetary/factsheet/` are good for planetary numbers), or leave it out.
* Always give units. Use round, defensible numbers ("about 384,400 km").
* Clearly separate: `confirmed` observations/measurements, `hypothesis` (leading models that are not settled),
  `open` (genuinely unanswered questions). Every `explore` / `discover` section carries one of these three
  `status` values. Never present a hypothesis as established fact. Use hedges ("is thought to", "evidence suggests").
* Tone: curious, calm, precise; beginner-friendly in everything except `discover`. No hype, no exclamation
  marks, no "mind-blowing". Everyday comparisons are welcome ("about as wide as the United States").
* Plain text only — no HTML, no markdown, no LaTeX. Use Unicode for symbols (×, ², √, ≈, Δ, ☉). Equations are
  plain strings like `v_esc = √(2GM / r)`.
* Mission/observatory statuses change. The site was authored in **October 2026**; your knowledge may stop
  earlier. Verify every mission status with a web search and mark the `asOf` date. If you cannot verify, use
  the more conservative wording ("last confirmed operating in …") rather than guessing.
* Use straight ASCII quotes inside JS strings only where escaped properly; prefer typographic ’ “ ” in text.
* Files must be valid JavaScript that runs in a browser (check with `node --check yourfile.js`).

## 2. Destination content schema  (`js/data/destinations-N.js`)

Each file starts with

```js
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.destinations = A.destinations || {};
  Object.assign(A.destinations, { /* entries */ });
})(window);
```

Entry (id = stop id from `js/data/route.js`):

```js
'mars': {
  name: 'Mars',                       // display name
  tagline: 'The Red Planet',          // panel header reads  MARS — THE RED PLANET
  type: 'Terrestrial planet',         // short descriptor
  intro: '…',                         // beginner friendly, 1–2 sentences, ≤ 45 words
  everyday: '…',                      // ONE everyday comparison sentence, ≤ 30 words
  keyFacts: ['…', '…', '…'],          // 3–5 short sentences, each ≤ 28 words
  measurements: [                     // 4–6 rows, WITH UNITS (kept short for a compact table)
    { label: 'Average distance from the Sun', value: '227.9 million km (1.52 AU)' }
  ],
  surprises: ['…'],                   // 1–2 surprising, TRUE discoveries, each ≤ 40 words
  explore: [                          // "Explore Deeper" → Explore tab (beginner), 3–4 sections
    { heading: '…', status: 'confirmed' | 'hypothesis' | 'open', body: '50–110 words, plain language' }
  ],
  discover: [                         // "Discover More" tab (advanced), 2–3 sections (~20% of the material)
    { heading: '…', status: '…', body: '60–130 words with real detail',
      equation: 'optional plain-text equation', equationNote: 'optional one-line explanation of symbols' }
  ],
  hotspots: [                         // clickable features on the 3D object (see §2.1)
    { id: 'olympus-mons', label: 'Olympus Mons', text: '≤ 45 words', lat: 18.65, lon: -133.8 }
  ],
  missions: ['viking-1', '…'],        // ids from the shared mission id list (§3); 3–6 per destination
  sources: [ { title: '…', org: 'NASA', url: 'https://…' } ],   // 2–4 REAL, stable pages you verified
  tags: ['red planet', 'ares', '…']   // extra search keywords / synonyms (lower-case)
}
```

### 2.1 Hotspots

* **Spherical bodies** (earth, moon, sun, mercury, venus, mars, jupiter, saturn, uranus, neptune): 4–5 hotspots with
  `lat` (−90…90, north +) and `lon` (−180…180, east +). Use real, well-known features with correct
  coordinates (planetographic/selenographic/areographic east-positive longitudes converted to −180…180).
  For bodies without fixed surface features (Sun, Venus clouds, giant planets) the position is an
  illustrative placement in the stylised 3D model: choose a sensible `lat` and spread `lon` between −80 and 80
  so features face the default camera. **Exact pins used by the 3D model:**
  jupiter `great-red-spot` lat −22, lon 20 · saturn `north-polar-hexagon` lat 78, lon 0 ·
  neptune `great-dark-spot` lat −22, lon -30 · mars `olympus-mons` lat 18.65 lon −133.8, `valles-marineris` lat −13.9 lon −59,
  `hellas-planitia` lat −42.4 lon 70.5, `jezero-crater` lat 18.4 lon 77.7 · moon `tycho` lat −43.3 lon −11.4,
  `mare-tranquillitatis` lat 8.5 lon 31.4, `oceanus-procellarum` lat 18 lon −57, `mare-imbrium` lat 32.8 lon −15.6 ·
  earth: pick from Himalayas (28, 87), Amazon basin (−5, −62), Sahara (23, 12), Antarctica (−80, 30), Pacific Ocean (0, −150),
  Great Barrier Reef (−18, 147) · mercury `caloris-basin` lat 31 lon −170 (the 3D model puts it on the far side; it is fine).
* **Regions** (asteroid-belt, kuiper-belt, oort-cloud, heliosphere, interstellar, neighborhood, spiral-arms, galactic-center,
  outer-milky-way, halo): NO lat/lon. The 3D scene places each hotspot at a fixed anchor, matched **by order and id**.
  Use EXACTLY these ids in EXACTLY this order:
  * asteroid-belt: `ceres`, `vesta`, `empty-space`, `kirkwood-gaps`
  * kuiper-belt: `pluto`, `charon`, `eris`, `arrokoth`
  * oort-cloud: `inner-oort-cloud`, `outer-oort-cloud`, `long-period-comets`, `sun-from-here`
  * heliosphere: `termination-shock`, `heliosheath`, `heliopause`, `voyagers`
  * interstellar: `local-interstellar-cloud`, `dust-grains`, `magnetic-fields`, `cosmic-rays`
  * neighborhood: `alpha-centauri`, `barnards-star`, `sirius`, `epsilon-eridani`, `tau-ceti`
  * spiral-arms: `orion-spur`, `perseus-arm`, `sagittarius-arm`, `scutum-centaurus-arm`
  * galactic-center: `sgr-a-star`, `galactic-bar`, `nuclear-star-cluster`, `fermi-bubbles`
  * outer-milky-way: `disk-warp`, `outer-disk`, `no-sharp-edge`, `magellanic-clouds`
  * halo: `globular-clusters`, `stellar-streams`, `dark-matter-halo`, `old-stars`

### 2.2 Destination notes for authors

* The tour is a compressed, not-to-scale story (see `route.js` hop captions). Say so where relevant.
* The tour visits asteroid-belt **after** Neptune (route note) and heliosphere **after** the Oort Cloud; explain physical
  order in the text if it matters (the belt is between Mars and Jupiter; the Oort Cloud is far outside the heliosphere).
* The Milky Way has no sharply defined outer edge. The Oort Cloud is hypothesized and has never been directly observed.
  Sagittarius A* is a supermassive black hole of about 4 million solar masses (EHT image published 2022).
  Dark matter is inferred from gravitational effects; its nature is unknown.
* Sun: be accurate and safe (never encourage looking at the Sun without proper solar filters).

## 3. Shared mission id list

All mission ids that may be referenced from destinations (`missions-1.js` + `missions-2.js` MUST define every one):

```
sputnik-1 apollo-11 apollo-17 artemis-ii chandrayaan-3 chang-e-4 iss hubble jwst
parker-solar-probe soho solar-orbiter mariner-10 messenger bepicolombo
venera-7 magellan akatsuki envision viking-1 mars-pathfinder curiosity perseverance maven mars-express
tianwen-1 hope-probe mars-sample-return
galileo juno juice europa-clipper cassini-huygens dragonfly voyager-1 voyager-2
dawn psyche osiris-rex hayabusa2 lucy dart new-horizons ibex interstellar-probe
gaia chandra event-horizon-telescope
```

Mission entry (`A.missions` is an **array**; each missions-N.js file does `A.missions = (A.missions || []).concat([...])`):

```js
{ id: 'viking-1', name: 'Viking 1', agency: 'NASA', type: 'Orbiter + lander',   // 'Crewed' | 'Orbiter' | 'Lander' | 'Rover' | 'Flyby' | 'Sample return' | 'Space telescope' | 'Probe' …
  status: 'historical' | 'active' | 'planned',   // exactly one of these three
  statusNote: 'Operations ended 1982',            // short, dated, factual (e.g. "Launched 2021; operating as of mid-2026")
  asOf: '2026-09',                                // when YOU verified the status (YYYY-MM)
  years: '1975–1982',                             // launch/operation years, display string
  targets: ['mars'],                              // stop ids this mission relates to
  summary: '≤ 35 words: goal of the mission',
  discoveries: '≤ 45 words: what it found or is expected to study (label expectations as such for planned missions)',
  url: 'https://…' }                              // an official NASA/ESA/JAXA/CNSA/ISRO page you verified
```

## 4. Other data files

* `glossary.js`: `A.glossary = [ { term, definition (≤ 40 words, plain), dest: 'stop id', level: 'beginner'|'advanced', aka: ['synonym'] } ]`
  (≥ 70 terms, alphabetical, each `dest` must be a valid stop id).
* `facts.js`: `A.facts = [ { text (≤ 35 words), dest: 'stop id' } ]` (≥ 45 facts, every one scientifically solid).
* `sources.js`: `A.sources = [ { group: 'Space agencies', blurb: '…', items: [ { title, org, url, note } ] } ]`.
* `worlds.js` (Compare Worlds): `A.worlds = [ { id, name, kind: 'planet'|'moon'|'dwarf planet', parent: 'Sun'|'Jupiter'|…,
  diameterKm, gravity (m/s², surface), rotationHours (sidereal rotation, negative = retrograde), orbitDays (orbital period around parent),
  distanceAU (from the Sun, mean), moons (count of known moons, or null), atmosphere: 'short text', meanTempC (or null), massEarths, swatch: [3 css colours], note }]`
  for: earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, io, europa, ganymede, titan, enceladus.
* `scale.js` (Cosmic Scale Mode): `A.scale = [ { id, label, km (number, a diameter or a distance), type: 'size'|'distance', lightTime: 'e.g. 8 min 20 s' or '', note (≤ 25 words) } ]`
  — ~16 rungs from "Earth’s diameter" to "diameter of the Milky Way’s stellar disk"; hypothesized/uncertain quantities (Oort Cloud) must say so in `note`.
* `quizzes.js`: `A.quizzes = { home: {title, questions: [3]}, solar: {…}, beyond: {…}, galaxy: {…} }`, question =
  `{ q, options: [4 strings], answer: index 0-3, explain: '1–2 sentences' }`. Fun but accurate; vary the correct index.
* `about.js` (editable placeholder content for the research group) — provided.

## 5. Interface ⇄ engine contract

The 3D engine (`ASTROVIA.engine`, written separately) owns: the `<canvas id="scene">`, the scroll model, the camera, all
3D objects, the hotspot markers, and audio. The interface (`js/ui.js`, `index.html`, `css/styles.css`) owns every other DOM element.
They communicate **only** through `ASTROVIA.bus` events, `ASTROVIA.settings`, the methods below and a few DOM hooks.

### 5.1 Required DOM hooks (index.html must contain these exact ids)

| id | purpose |
|----|---------|
| `scene` | `<canvas>`; `position:fixed; inset:0; width:100%; height:100%; z-index:0`; `touch-action: pan-y` |
| `journey-spacer` | empty `<div>` in normal flow right after the header; the engine sets its height (it creates the scroll length). `<footer id="site-footer">` follows it in the normal flow. |
| `hotspot-layer` | `position:fixed; inset:0; pointer-events:none; z-index:2`. The engine fills it with hotspot buttons (below). |
| `loader`, `loader-text`, `loader-bar` | loading overlay; engine emits `engine:progress`; UI hides the loader on `engine:ready` / `engine:failed` |
| `sr-live` | visually hidden `aria-live="polite"` region for announcements |

The page scrolls **natively** (scrollbar, keyboard, touch all work). All UI chrome is `position: fixed` above the canvas
(`z-index ≥ 3`) except the footer, which scrolls in after the last stop. The `<body>` must not set `overflow:hidden`.

**Hotspot markers** are created by the engine inside `#hotspot-layer` for the current destination:

```html
<button class="hotspot" type="button" data-id="olympus-mons" aria-label="Olympus Mons — show details" style="transform: translate(Xpx, Ypx)">
  <span class="hotspot-dot" aria-hidden="true"></span>
  <span class="hotspot-label">Olympus Mons</span>
</button>
```
The engine toggles classes `is-hidden` (on the far side of the body / out of view), `is-active` (selected), and `body.mode-inspect`
is set while inspecting. UI must style `.hotspot` (`pointer-events:auto`; position `left:0;top:0`; the transform is set by the engine
and must be left alone), `.hotspot-dot` (a small ring, ≥ 24 px hit area, visible focus ring, not colour-only: use a "+" glyph or ring + dot)
and `.hotspot-label` (visible when `body.mode-inspect`, or on hover/focus-visible/`.is-active`; also hidden when `settings.labels` is false
via `html:not([data-labels])` — the engine sets `document.documentElement.dataset.labels = 'on'` when labels are enabled).

### 5.2 Events the ENGINE emits (UI listens with `ASTROVIA.bus.on`)

| event | payload | meaning |
|-------|---------|---------|
| `engine:progress` | `{ loaded, total, label }` | real loading steps |
| `engine:ready` | `{ quality: 'high'|'medium'|'low' }` | first frame rendered; hide loader |
| `engine:failed` | `{ reason: 'no-webgl' | 'error', message }` | no 3D → UI shows the fallback gallery (see §5.5) |
| `journey:progress` | `{ t, index, fromIndex, toIndex, f, warp, moving }` | continuous position (`t` 0…21, float; `index` nearest stop); `warp` 0…1 = travel speed intensity; ≤ 20 Hz and immediately on index change |
| `journey:arrive` | `{ index, id }` | camera has settled at a stop (panel should appear) |
| `journey:depart` | `{ index, id }` | camera left the settled stop (panel should hide quickly) |
| `journey:mode` | `{ mode: 'overview'|'inspect' }` | inspect mode toggled (also via Esc) |
| `hotspot:select` | `{ destId, hotspotId }` | a hotspot marker was clicked or focused via `engine.focusHotspot` |
| `perf:low` | `{}` | frame rate stays low even at the lowest quality → offer "Simple view" |

### 5.3 Events the UI emits

| event | payload | meaning |
|-------|---------|---------|
| `ui:panel` | `{ open: boolean }` | the destination info panel is visible/hidden → engine shifts the planet out from behind it (panel is a left column ≤ 400 px on wide screens, a bottom sheet ≤ 46vh on narrow screens) |
| `ui:dialog` | `{ open: boolean }` | any modal dialog opened/closed → engine ignores keyboard shortcuts while open |

### 5.4 Engine methods the UI may call (`ASTROVIA.engine`)

`goTo(indexOrId, opts?)` · `next()` · `prev()` · `restart()` · `current()` → `{ index, id, t }` · `stopCount` ·
`setMode('overview'|'inspect')` · `getMode()` · `zoomBy(+1|-1)` · `resetView()` · `focusHotspot(hotspotId)` ·
`isReady()`. Everything else is configured through `ASTROVIA.settings` (`motion`, `paused`, `sound`, `labels`, `lite`) — the engine
listens for `settings:change`. The engine itself handles: wheel / touch / scrollbar scrolling, snapping to stops when scrolling ends,
keyboard (↓ → PageDown Space = next; ↑ ← PageUp = previous; Home / End), drag-to-rotate, pinch, Esc to leave inspect mode.
Guard every call: `if (A.engine) A.engine.next();` (the engine may be absent when WebGL is unavailable).

### 5.5 Fallback / Simple view

When `engine:failed` fires, or `settings.lite` is true, the UI must provide a full alternative with the same educational content:
`<html>` gets class `no-3d`; the journey spacer collapses; a `#fallback` section lists every destination grouped by stage
as cards with a CSS-drawn planet (radial gradient from `route.stops[i].swatch`, ring for Saturn), name, tagline, intro, key facts,
measurements, "Explore Deeper", hotspot "features" list (as text, no 3D), and all dialogs/search/glossary/compare/scale/missions/quiz
keep working. In Simple view the engine pauses rendering (`settings.lite`).

### 5.6 What the UI must build (all functional, no dead buttons)

HUD (minimal): logo/home · current destination name · journey progress rail with stage ticks + **"You are here"** marker · navigator
(expandable list grouped by stage, current item flagged, click = `engine.goTo`) · search (destinations + glossary + missions) ·
sound toggle · settings (motion Auto/Full/Reduced, pause animation, text size, contrast, labels, level default, Simple view) ·
compact mobile menu. Hero overlay at stop 0 (wordmark ASTROVIA, tagline, intro paragraph, **Begin Exploration**, scroll indicator,
Cosmic Fact of the Day). Destination panel on `journey:arrive` (see §2 fields: name/tagline, intro, everyday comparison, key facts,
measurements, surprises, **Explore Deeper**, **Inspect in 3D**, features list, missions, **Continue Journey**/Previous, mission-log
check mark; after the last stop of a stage an optional "Quick knowledge check"). Deeper dialog with **Explore / Discover More** tabs
(status badges Confirmed / Hypothesis / Open with an icon + text, not colour alone), missions, references. Inspect toolbar (Zoom +/−,
Reset, Labels, Resume journey). Hop caption during travel. Finale overlay (message + three buttons + footer). Dialogs: Search & Glossary,
Compare Worlds, Cosmic Scale, Space Missions, Mission Log, Quiz, About Astrovia, Sources & Further Reading, Accessibility info.
Use `<dialog>` + `showModal()` (focus trap, Esc) and emit `ui:dialog`.
