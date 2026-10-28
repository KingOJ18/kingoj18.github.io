// =========================================================
// INTERACTIVE EFFECTS — shared by the live site and the
// offline download (copied into js/script.js).
// Scroll reveal, 3D tilt, magnetic buttons, cursor glow
// and the scroll progress bar.
// =========================================================
function initEffects(root) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cleanups = [];

  // Reveal sections as they scroll into view
  const revealItems = root.querySelectorAll(".kp-reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    revealItems.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  // Scroll progress bar
  const bar = root.querySelector(".kp-progress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  cleanups.push(() => window.removeEventListener("scroll", onScroll));

  if (fine && !reduced) {
    // Cursor glow
    const glow = root.querySelector(".kp-glow");
    const onMove = (e) => {
      if (!glow) return;
      glow.style.setProperty("--mx", e.clientX + "px");
      glow.style.setProperty("--my", e.clientY + "px");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onMove));

    // 3D tilt on cards
    root.querySelectorAll("[data-tilt]").forEach((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
      };
      const leave = () => {
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    });

    // Magnetic buttons
    root.querySelectorAll("[data-magnetic]").forEach((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      };
      const leave = () => (el.style.transform = "");
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

// =========================================================
// PORTFOLIO CONTENT — edit titles, descriptions and categories here
// Each design: [image number, title, category, short description]
// Images live in assets/images/design-XX.jpg
// =========================================================
const designs = [
  ["01", "AirPods Max", "Product", "Product advertising poster."],
  ["02", "Luriex News Update", "Editorial", "Fashion event editorial layout."],
  ["04", "Meal Combos", "Food", "Promotional restaurant artwork."],
  ["05", "Pure Strawberry Bliss", "Food", "Strawberry drink campaign visual."],
  ["06", "Taste the Moment", "Product", "Beverage advertising composition."],
  ["07", "Saint Lois", "Fashion", "Premium essentials campaign."],
  ["08", "Feel the Goodness", "Food", "Natural drink campaign artwork."],
  ["09", "Citrus Spritz", "Food", "Citrus beverage poster."],
  ["10", "Taste the Feeling", "Product", "Coca-Cola product visual."],
  ["11", "Porsche GT3 RS", "Automotive", "Performance specification poster."],
  ["12", "Blinded Truth", "Editorial", "Conceptual editorial artwork."],
  ["13", "G.O.A.T.", "Sports", "Lionel Messi tribute poster."],
  ["14", "Air Jordan", "Product", "Limited edition shoe campaign."],
  ["15", "Dum Biryani", "Food", "Restaurant promotional design."],
  ["16", "Porsche", "Automotive", "GT3 RS editorial poster."],
  ["17", "Berry & Cream", "Food", "Strawberry product campaign."],
];

// Photo categories by frame number (assets/images/photography-XX.jpg)
const portraitFrames = [2, 3, 7, 9, 10, 11, 12, 13, 18];
const natureFrames = [4, 14];
const photos = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  const category = portraitFrames.includes(n) ? "Portrait" : natureFrames.includes(n) ? "Nature" : "Places";
  return [String(n).padStart(2, "0"), category];
});

// Scrolling banner words
const marqueeWords = ["Graphic Design", "Photography", "AI Web Design", "Visual Storytelling", "Lagos, Nigeria"];

// =========================================================
// BUILD THE PAGE
// =========================================================
const marquee = document.querySelector("#marquee");
marquee.innerHTML = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords]
  .map((w) => `<span>${w}  /</span>`)
  .join("");

const designGrid = document.querySelector("#design-grid");
designs.forEach(([num, title, category, text]) => {
  designGrid.insertAdjacentHTML(
    "beforeend",
    `<button class="kp-work" data-category="${category}" data-img="assets/images/design-${num}.jpg" aria-label="View ${title}">
      <img src="assets/images/design-${num}.jpg" alt="${title}" loading="lazy">
      <span class="cap"><small>${category}</small><b>${title}</b><span>${text}</span></span>
    </button>`,
  );
});

const photoGrid = document.querySelector("#photo-grid");
photos.forEach(([num, category]) => {
  const alt = `${category} photograph Frame ${num}`;
  photoGrid.insertAdjacentHTML(
    "beforeend",
    `<button class="kp-work" data-category="${category}" data-img="assets/images/photography-${num}.jpg" aria-label="View ${alt}">
      <img src="assets/images/photography-${num}.jpg" alt="${alt}" loading="lazy">
      <span class="cap"><small>${category}</small><b>Frame ${num}</b></span>
    </button>`,
  );
});

// Number tiles so they pop in one after another
function stagger(grid) {
  [...grid.children]
    .filter((el) => !el.hidden)
    .forEach((el, i) => {
      el.style.setProperty("--i", i);
      el.style.animation = "none";
      void el.offsetWidth; // restart the pop-in animation
      el.style.animation = "";
    });
}
stagger(designGrid);
stagger(photoGrid);

// =========================================================
// FILTERS
// =========================================================
document.querySelectorAll(".kp-filters").forEach((bar) => {
  const grid = document.getElementById(bar.dataset.for);
  const cats = ["All", ...new Set([...grid.children].map((el) => el.dataset.category))];
  bar.innerHTML = cats
    .map((c, i) => `<button class="kp-chip${i === 0 ? " is-active" : ""}" aria-pressed="${i === 0}">${c}</button>`)
    .join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    bar.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
    });
    const pick = btn.textContent;
    [...grid.children].forEach((el) => (el.hidden = pick !== "All" && el.dataset.category !== pick));
    stagger(grid);
  });
});

// =========================================================
// MOBILE MENU
// =========================================================
const menu = document.querySelector("#menu");
const nav = document.querySelector("#site-nav");
function setMenu(open) {
  nav.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menu.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// =========================================================
// IMAGE VIEWER
// =========================================================
const box = document.querySelector("#lightbox");
const boxImg = box.querySelector("img");
let active = -1;
let opener = null;
const visible = () => [...document.querySelectorAll("[data-img]")].filter((el) => !el.hidden);
function show(index) {
  const list = visible();
  if (!list.length) return;
  active = (index + list.length) % list.length;
  const item = list[active];
  boxImg.style.animation = "none";
  void boxImg.offsetWidth;
  boxImg.style.animation = "";
  boxImg.src = item.dataset.img;
  boxImg.alt = item.querySelector("img").alt;
  box.querySelector("#image-count").textContent = `${active + 1} / ${list.length}`;
}
document.querySelectorAll("[data-img]").forEach((el) =>
  el.addEventListener("click", () => {
    opener = el;
    show(visible().indexOf(el));
    box.hidden = false;
    document.body.style.overflow = "hidden";
    box.querySelector(".close").focus();
  }),
);
function closeBox() {
  box.hidden = true;
  boxImg.src = "";
  document.body.style.overflow = "";
  if (opener) opener.focus();
}
box.querySelector(".close").addEventListener("click", closeBox);
box.querySelector(".prev").addEventListener("click", () => show(active - 1));
box.querySelector(".next").addEventListener("click", () => show(active + 1));
box.addEventListener("click", (e) => {
  if (e.target === box) closeBox();
});
document.addEventListener("keydown", (e) => {
  if (box.hidden) return;
  if (e.key === "Escape") closeBox();
  if (e.key === "ArrowRight") show(active + 1);
  if (e.key === "ArrowLeft") show(active - 1);
  if (e.key === "Tab") {
    const controls = [...box.querySelectorAll("button")];
    const i = controls.indexOf(document.activeElement);
    if ((e.shiftKey && i === 0) || (!e.shiftKey && i === controls.length - 1)) {
      e.preventDefault();
      controls[e.shiftKey ? controls.length - 1 : 0].focus();
    }
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
initEffects(document.querySelector(".kp"));
