/* ═══ AUDIO SYNTHESIZER ═══ */
class AudioManager {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  playPop() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);
    
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);

    setTimeout(() => {
      this.playChime(6);
    }, 60);
  }

  playChime(noteIndex) {
    this.init();
    if (!this.ctx) return;

    // Dreamy pentatonic scale in C-major
    const scale = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00  // A5
    ];

    const freq = scale[noteIndex % scale.length];
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc2.detune.setValueAtTime(6, now);

    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  }

  playSuccessChord() {
    this.init();
    if (!this.ctx) return;
    
    const notes = [0, 2, 3, 5, 7]; // C-E-G-C-E arpeggio
    notes.forEach((noteIdx, i) => {
      setTimeout(() => {
        this.playChime(noteIdx);
      }, i * 100);
    });
  }
}
const audio = new AudioManager();

/* ═══ CUSTOMIZE HERE ═══ */
const BIRTHDAY_CONFIG = {
  herName: "Shrijaa",
  sisNickname: "sisyyyyy",
  wishMessage:
    "On your special day, I hope every dream you hold comes true. " +
    "You deserve the world and so much more — endless laughter, wild adventures, " +
    "and all the love your heart can hold. May this year be your brightest yet. " +
    "Happy birthday, my amazing sis. I'm so lucky you're mine. ♥",
  wishSign: "— with all my love ♥",
  letterDear: "Dear Sisyyyyy,",
  letterBody:
    "Happy birthday to the most incredible sister anyone could ask for.\n\n" +
    "Thank you for every laugh, every late-night talk, every time you believed in me " +
    "when I couldn't believe in myself. Thank you for being my best friend, my chaos partner, " +
    "and the person who makes ordinary days feel like magic.\n\n" +
    "You light up every room you walk into. I'm so proud of the person you are — " +
    "kind, fierce, funny, and absolutely beautiful inside and out.\n\n" +
    "I made this little world just for you, because you deserve to feel as special " +
    "as you make everyone around you feel. Never forget how loved you are.\n\n" +
    "Happy birthday, sis. Today and always is yours. ♥",
  letterSign: "Forever your biggest fan ♥",
  starTitle: "You're My Shining Star",
  starMessage:
    "Out of every star in the sky, you're the one that matters most to me. " +
    "You guide me, inspire me, and make my world glow. " +
    "No matter how far we go, you'll always be my brightest light. " +
    "I love you to the moon, the stars, and back again. ✦",
  photos: [
    { src: "img1.jpg", caption: "us ♡" },
    { src: "img2.jpg", caption: "my favourite" },
    { src: "img3.jpeg", caption: "silly moments" },
    { src: "img4.jpg", caption: "always" },
  ],
  timeline: [
    {
      date: "The Beginning",
      event: "When We Became Us ✨",
      desc: "The day everything changed — I didn't know it yet, but my favourite person had just entered my story.",
    },
    {
      date: "Every Laugh",
      event: "Those Silly Moments 😄",
      desc: "Inside jokes, random chaos, and laughs that made my stomach hurt — the best kind of memories.",
    },
    {
      date: "Every Day",
      event: "The Little Things ♡",
      desc: "Morning texts, random photos, your smile — the small moments that mean everything.",
    },
    {
      date: "Today",
      event: "Your Birthday 🎂",
      desc: "Another year of you being absolutely amazing. Here's to many more chapters together, sis.",
    },
  ],
};

/* ═══ STATE ═══ */
const STAGES = ["entrance", "cake", "wish", "gifts"];
let currentStage = 0;
let candlesBlown = false;
let cakeCut = false;
let entrancePlayed = false;

let starSceneInterval = null;
let lightboxIndex = 0;
let galleryPhotos = [];
const experience = document.getElementById("birthdayExperience");
const expBg = document.getElementById("expBg");
const expConfetti = document.getElementById("expConfetti");

/* ═══ LAUNCH ═══ */
function launchBirthdayExperience() {
  experience.hidden = false;
  document.body.classList.add("experience-active");
  requestAnimationFrame(() => {
    experience.classList.add("active");
    goToStage(0);
    playEntrance();
  });
}

window.launchBirthdayExperience = launchBirthdayExperience;

function goToStage(idx) {
  currentStage = idx;
  const stageId = STAGES[idx];

  document.querySelectorAll(".exp-stage").forEach((el) => {
    el.classList.toggle("active", el.dataset.stage === stageId);
  });

  expBg.className = "exp-bg";
  if (stageId === "cake") expBg.classList.add("cake-mode");
  if (stageId === "wish") expBg.classList.add("wish-mode");
  if (stageId === "gifts") expBg.classList.add("gifts-mode");

  if (stageId === "wish") startWishTyping();
}

function nextStage() {
  if (currentStage < STAGES.length - 1) goToStage(currentStage + 1);
}

/* ═══ CONFETTI ═══ */
function expConfettiBurst(count = 60) {
  if (!expConfetti) return;
  expConfetti.innerHTML = "";
  const colors = ["#fff", "#ffcdd2", "#ffeb3b", "#f48fb1", "#ff4081", "#81c784"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "exp-confetti-piece";
    p.style.setProperty("--cx", `${Math.random() * 100}%`);
    p.style.setProperty("--delay", `${Math.random() * 0.6}s`);
    p.style.setProperty("--rot", `${Math.random() * 360}deg`);
    p.style.setProperty("--clr", colors[i % colors.length]);
    p.style.setProperty("--dur", `${1.5 + Math.random() * 2}s`);
    p.style.setProperty("--sz", `${5 + Math.random() * 9}px`);
    expConfetti.appendChild(p);
  }
  setTimeout(() => {
    if (expConfetti) expConfetti.innerHTML = "";
  }, 4500);
}

function addEntranceSparkles(container) {
  if (!container) return;
  const colors = ["#ff4081", "#4caf50", "#ffeb3b", "#e53935", "#2196f3"];
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    s.textContent = "✦";
    s.style.cssText = `
      position:absolute;
      left:${10 + Math.random() * 80}%;
      top:${10 + Math.random() * 70}%;
      font-size:${0.8 + Math.random() * 1.2}rem;
      color:${colors[i % colors.length]};
      opacity:0;
      animation: sparklePop 0.8s ease ${1.8 + i * 0.15}s forwards;
    `;
    container.appendChild(s);
  }
}

/* ═══ 1 · ENTRANCE ═══ */
function playEntrance() {
  if (entrancePlayed) return;
  entrancePlayed = true;

  const pig = document.getElementById("entrancePig");
  const table = document.getElementById("entranceTable");
  const title = document.getElementById("entranceTitle");
  const sub = document.getElementById("entranceSub");
  const sparkles = document.querySelector(".entrance-sparkles");
  const nextBtn = document.getElementById("entranceNext");

  setTimeout(() => {
    pig?.classList.add("arrived");
    table?.classList.add("arrived");
  }, 400);

  setTimeout(() => {
    title?.classList.add("show");
    sparkles?.classList.add("celebrate");
    addEntranceSparkles(sparkles);
    expConfettiBurst(50);
  }, 2200);

  setTimeout(() => {
    sub?.classList.add("show");
    expConfettiBurst(40);
  }, 3200);

  setTimeout(() => {
    if (nextBtn) nextBtn.hidden = false;
  }, 4000);
}

/* ═══ 2 · CAKE ═══ */
function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;

  const wind = document.getElementById("windBurst");
  const candles = document.getElementById("bigCandles");
  const blowBtn = document.getElementById("blowBtn");
  const cutBtn = document.getElementById("cutCakeBtn");
  const wishTitle = document.getElementById("cakeWishTitle");

  wind?.classList.add("active");
  setTimeout(() => candles?.classList.add("blown"), 300);

  if (blowBtn) {
    blowBtn.disabled = true;
    blowBtn.textContent = "✓";
  }

  setTimeout(() => {
    if (wishTitle) wishTitle.textContent = "Now cut the cake!";
    if (cutBtn) cutBtn.hidden = false;
    wind?.classList.remove("active");
  }, 1400);
}

function cutCake() {
  if (cakeCut) return;
  cakeCut = true;

  const slice = document.getElementById("cakeSlice");
  const body = document.querySelector(".big-cake-body");
  const cutBtn = document.getElementById("cutCakeBtn");

  slice?.classList.add("cut");
  body?.classList.add("sliced");
  if (cutBtn) cutBtn.disabled = true;

  expConfettiBurst(55);

  setTimeout(() => nextStage(), 1800);
}

/* ═══ 3 · WISH ═══ */
function startWishTyping() {
  const el = document.getElementById("wishMessage");
  const sign = document.getElementById("wishSign");
  if (!el) return;

  el.textContent = "";
  if (sign) sign.textContent = BIRTHDAY_CONFIG.wishSign;

  const text = BIRTHDAY_CONFIG.wishMessage;
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 22);
    }
  }

  setTimeout(type, 600);
}

/* ═══ 4 · GIFTS & SUB PAGES ═══ */
const CONSTELLATION_POINTS = [
  { id: 1, x: 50, y: 38, label: "✦" },
  { id: 2, x: 34, y: 26, label: "★" },
  { id: 3, x: 20, y: 38, label: "✧" },
  { id: 4, x: 28, y: 58, label: "☆" },
  { id: 5, x: 50, y: 78, label: "♥" },
  { id: 6, x: 72, y: 58, label: "☆" },
  { id: 7, x: 80, y: 38, label: "✧" },
  { id: 8, x: 66, y: 26, label: "★" }
];
let constellationNodesConnected = [];
let constellationNextTarget = 0;
let uncorkStarsBuilt = false;

/* ═══ 4 · GIFTS & SUB PAGES ═══ */
function openGift(gift) {
  document.querySelectorAll(".exp-sub").forEach((s) => s.classList.remove("active"));

  const sub = document.querySelector(`.exp-sub[data-sub="${gift === "bottle" ? "letter" : gift}"]`);
  if (!sub) return;

  sub.hidden = false;
  requestAnimationFrame(() => sub.classList.add("active"));

  if (gift === "camera") buildGallery();
  if (gift === "bottle") {
    // Show uncork view, hide scrapbook view
    document.getElementById("bottleUncorkView").classList.remove("fade-out");
    document.getElementById("bottleUncorkView").style.display = "flex";
    document.getElementById("letterPaperView").classList.remove("show");
    document.getElementById("letterPaperView").hidden = true;
    
    // Reset cork and parchment
    document.getElementById("bottleCork").classList.remove("popped");
    document.getElementById("rolledParchment").classList.remove("rising");
    
    buildUncorkScene();
  }
  if (gift === "star") {
    // Show game view, hide scene view
    document.getElementById("constellationGame").classList.remove("fade-out");
    document.getElementById("constellationGame").style.display = "flex";
    document.getElementById("starScene").hidden = true;
    
    buildStarScene();
  }
}

function closeSub() {
  document.querySelectorAll(".exp-sub").forEach((s) => {
    s.classList.remove("active");
    setTimeout(() => {
      if (!s.classList.contains("active")) s.hidden = true;
    }, 450);
  });
  closeLightbox();
  
  // Clear any constellation drawing state
  constellationNodesConnected = [];
  constellationNextTarget = 0;
  const svg = document.getElementById("constellationSvg");
  if (svg) svg.innerHTML = "";
  
  if (starSceneInterval) {
    clearInterval(starSceneInterval);
    starSceneInterval = null;
  }
}

function switchCameraTab(tab) {
  document.querySelectorAll(".camera-tab").forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });
  document.querySelectorAll(".camera-panel").forEach((panel) => {
    const isActive = panel.dataset.panel === tab;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

function buildGallery() {
  const featured = document.getElementById("cameraFeatured");
  const gallery = document.getElementById("photoGallery");
  const dots = document.getElementById("cameraDots");
  const track = document.getElementById("timelineTrack");
  if (!gallery || !track) return;

  galleryPhotos = BIRTHDAY_CONFIG.photos;
  const first = galleryPhotos[0];

  if (featured && first) {
    featured.innerHTML = `
      <div class="featured-polaroid">
        <span class="featured-badge">favourite ♥</span>
        <img src="${first.src}" alt="${first.caption}" data-index="0" />
        <span class="featured-caption">${first.caption}</span>
      </div>`;
    featured.querySelector("img")?.addEventListener("click", () => openLightbox(0));
  }

  gallery.innerHTML = galleryPhotos
    .map(
      (p, i) => `
    <div class="film-slide${i === 0 ? " active" : ""}" data-index="${i}" style="--rot:${(i % 2 === 0 ? -4 : 4) + i * 0.5}deg;--delay:${i * 0.08}s">
      <div class="film-slide-inner">
        <img src="${p.src}" alt="${p.caption}" loading="lazy" onerror="this.style.background='#fce4ec'" />
        <span>${p.caption}</span>
      </div>
    </div>`
    )
    .join("");

  if (dots) {
    dots.innerHTML = galleryPhotos
      .map((_, i) => `<button type="button" class="camera-dot${i === 0 ? " active" : ""}" data-index="${i}" aria-label="Photo ${i + 1}"></button>`)
      .join("");
  }

  gallery.querySelectorAll(".film-slide").forEach((slide) => {
    slide.addEventListener("click", () => {
      const idx = +slide.dataset.index;
      setActiveSlide(idx);
      openLightbox(idx);
    });
  });

  dots?.querySelectorAll(".camera-dot").forEach((dot) => {
    dot.addEventListener("click", () => setActiveSlide(+dot.dataset.index));
  });

  const strip = document.querySelector(".camera-film-strip");
  strip?.addEventListener("scroll", () => {
    if (!strip || !galleryPhotos.length) return;
    const slideW = strip.querySelector(".film-slide")?.offsetWidth || 160;
    const idx = Math.round(strip.scrollLeft / (slideW + 16));
    setActiveSlide(Math.min(idx, galleryPhotos.length - 1), false);
  });

  const emojis = ["✨", "😄", "♡", "🎂"];
  track.innerHTML = BIRTHDAY_CONFIG.timeline
    .map(
      (t, i) => `
    <div class="timeline-card" style="--delay:${i * 0.12}s">
      <div class="timeline-card-inner">
        <span class="timeline-emoji">${emojis[i % emojis.length]}</span>
        <div class="timeline-date">${t.date}</div>
        <div class="timeline-event">${t.event}</div>
        <div class="timeline-desc">${t.desc}</div>
      </div>
    </div>`
    )
    .join("");

  switchCameraTab("photos");
}

function setActiveSlide(idx, scroll = true) {
  document.querySelectorAll(".film-slide").forEach((s, i) => {
    s.classList.toggle("active", i === idx);
  });
  document.querySelectorAll(".camera-dot").forEach((d, i) => {
    d.classList.toggle("active", i === idx);
  });

  if (scroll) {
    const strip = document.querySelector(".camera-film-strip");
    const slide = strip?.querySelector(`[data-index="${idx}"]`);
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  const photo = galleryPhotos[idx];
  const featuredImg = document.querySelector(".featured-polaroid img");
  const featuredCap = document.querySelector(".featured-caption");
  if (featuredImg && photo) {
    featuredImg.src = photo.src;
    featuredImg.dataset.index = idx;
    if (featuredCap) featuredCap.textContent = photo.caption;
  }
}

function openLightbox(idx) {
  const box = document.getElementById("photoLightbox");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCaption");
  if (!box || !img || !galleryPhotos[idx]) return;

  lightboxIndex = idx;
  img.src = galleryPhotos[idx].src;
  if (cap) cap.textContent = galleryPhotos[idx].caption;
  box.hidden = false;
  requestAnimationFrame(() => box.classList.add("open"));
}

function closeLightbox() {
  const box = document.getElementById("photoLightbox");
  if (!box) return;
  box.classList.remove("open");
  setTimeout(() => {
    if (!box.classList.contains("open")) box.hidden = true;
  }, 350);
}

function lightboxNav(dir) {
  if (!galleryPhotos.length) return;
  lightboxIndex = (lightboxIndex + dir + galleryPhotos.length) % galleryPhotos.length;
  openLightbox(lightboxIndex);
  setActiveSlide(lightboxIndex);
}

function buildLetter() {
  const dear = document.getElementById("letterDear");
  const body = document.getElementById("letterBody");
  const sign = document.getElementById("letterSign");
  if (dear) dear.textContent = BIRTHDAY_CONFIG.letterDear;
  if (body) {
    body.innerHTML = BIRTHDAY_CONFIG.letterBody
      .split("\n\n")
      .map((p) => `<p>${p}</p>`)
      .join("");
  }
  if (sign) sign.textContent = BIRTHDAY_CONFIG.letterSign;
}

/* ─── BOTTLE SCENE INTERACTIVE ─── */
function buildUncorkScene() {
  const container = document.getElementById("seaStars");
  if (!container) return;
  
  audio.init();

  if (!uncorkStarsBuilt) {
    uncorkStarsBuilt = true;
    container.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("span");
      s.className = "sky-star";
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 70}%`;
      s.style.setProperty("--sz", `${1.5 + Math.random() * 2.5}px`);
      s.style.setProperty("--dur", `${1.2 + Math.random() * 2}s`);
      s.style.setProperty("--delay", `${Math.random() * 2}s`);
      container.appendChild(s);
    }
  }

  const clickArea = document.getElementById("bottleClickArea");
  if (clickArea && !clickArea.dataset.bound) {
    clickArea.dataset.bound = "true";
    clickArea.addEventListener("click", () => {
      const cork = document.getElementById("bottleCork");
      const parchment = document.getElementById("rolledParchment");
      
      if (cork.classList.contains("popped")) return;
      
      cork.classList.add("popped");
      audio.playPop();
      
      setTimeout(() => {
        parchment.classList.add("rising");
      }, 550);
      
      setTimeout(() => {
        document.getElementById("bottleUncorkView").classList.add("fade-out");
      }, 2100);
      
      setTimeout(() => {
        document.getElementById("bottleUncorkView").style.display = "none";
        
        const paperView = document.getElementById("letterPaperView");
        paperView.hidden = false;
        requestAnimationFrame(() => {
          paperView.classList.add("show");
          buildLetter();
        });
      }, 2850);
    });
  }
}

/* ─── CONSTELLATION DRAWING GAME ─── */
function renderConstellationGame() {
  const nodesContainer = document.getElementById("constellationNodesContainer");
  const svg = document.getElementById("constellationSvg");
  if (!nodesContainer || !svg) return;
  
  nodesContainer.innerHTML = "";
  svg.innerHTML = `
    <defs>
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4081" />
        <stop offset="100%" stop-color="#ffeb3b" />
      </linearGradient>
    </defs>
  `;

  CONSTELLATION_POINTS.forEach((pt, index) => {
    const node = document.createElement("div");
    node.className = "star-node";
    node.style.left = `${pt.x}%`;
    node.style.top = `${pt.y}%`;
    
    if (index === 0) {
      node.classList.add("next-target");
    }

    node.innerHTML = `
      <div class="star-node-dot"></div>
      <div class="star-node-label">${pt.label}</div>
    `;

    node.addEventListener("click", () => handleNodeClick(index));
    nodesContainer.appendChild(node);
  });
}

function handleNodeClick(index) {
  const isClosure = (constellationNextTarget === CONSTELLATION_POINTS.length && index === 0);
  if (index !== constellationNextTarget && !isClosure) return;

  const nodes = document.querySelectorAll(".star-node");
  const nodesContainer = document.getElementById("constellationNodesContainer");
  const svg = document.getElementById("constellationSvg");

  if (isClosure) {
    const prevIndex = constellationNodesConnected[constellationNodesConnected.length - 1];
    const prevPt = CONSTELLATION_POINTS[prevIndex];
    const firstPt = CONSTELLATION_POINTS[0];
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${prevPt.x}%`);
    line.setAttribute("y1", `${prevPt.y}%`);
    line.setAttribute("x2", `${firstPt.x}%`);
    line.setAttribute("y2", `${firstPt.y}%`);
    line.classList.add("connected");
    svg.appendChild(line);

    audio.playSuccessChord();
    spawnStarParticles(firstPt.x, firstPt.y, nodesContainer);
    
    constellationNextTarget = CONSTELLATION_POINTS.length + 1;
    nodes[0].classList.remove("next-target");
    nodes[0].classList.add("connected-node");

    finishConstellationGame();
    return;
  }
  
  const pt = CONSTELLATION_POINTS[index];
  audio.playChime(index);
  spawnStarParticles(pt.x, pt.y, nodesContainer);

  const currNodeEl = nodes[index];
  currNodeEl.classList.remove("next-target");
  currNodeEl.classList.add("connected-node");

  if (constellationNodesConnected.length > 0) {
    const prevIndex = constellationNodesConnected[constellationNodesConnected.length - 1];
    const prevPt = CONSTELLATION_POINTS[prevIndex];
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${prevPt.x}%`);
    line.setAttribute("y1", `${prevPt.y}%`);
    line.setAttribute("x2", `${pt.x}%`);
    line.setAttribute("y2", `${pt.y}%`);
    line.classList.add("connected");
    svg.appendChild(line);
  }

  constellationNodesConnected.push(index);
  constellationNextTarget = index + 1;

  if (constellationNextTarget < CONSTELLATION_POINTS.length) {
    const nextNodeEl = nodes[constellationNextTarget];
    nextNodeEl.classList.add("next-target");
  } else if (constellationNextTarget === CONSTELLATION_POINTS.length) {
    const firstNodeEl = nodes[0];
    firstNodeEl.classList.add("next-target");
  }
}

function spawnStarParticles(xPct, yPct, container) {
  const rect = container.getBoundingClientRect();
  const startX = (xPct / 100) * rect.width;
  const startY = (yPct / 100) * rect.height;
  
  for (let i = 0; i < 15; i++) {
    const p = document.createElement("span");
    p.className = "star-particle";
    p.textContent = i % 2 === 0 ? "✦" : "★";
    p.style.left = `${startX}px`;
    p.style.top = `${startY}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    p.style.setProperty("--tx", `${tx}px`);
    p.style.setProperty("--ty", `${ty}px`);
    
    container.appendChild(p);
    setTimeout(() => p.remove(), 850);
  }
}

function finishConstellationGame() {
  const game = document.getElementById("constellationGame");
  const scene = document.getElementById("starScene");
  const msg = document.getElementById("starMessage");
  const sky = document.getElementById("starSky");

  expConfettiBurst(85);

  setTimeout(() => {
    game.classList.add("fade-out");
  }, 1000);

  setTimeout(() => {
    game.style.display = "none";
    scene.hidden = false;
    scene.classList.add("show");
    
    if (msg) {
      msg.textContent = "";
      const text = BIRTHDAY_CONFIG.starMessage;
      let i = 0;
      function typeStar() {
        if (i < text.length) {
          msg.textContent += text[i];
          i++;
          setTimeout(typeStar, 26);
        }
      }
      setTimeout(typeStar, 400);
    }

    setupHoloCard();

    const heroStar = document.getElementById("interactiveHeroStar");
    if (heroStar && !heroStar.dataset.bound) {
      heroStar.dataset.bound = "true";
      heroStar.addEventListener("click", () => {
        audio.playSuccessChord();
        expConfettiBurst(35);
        spawnStarParticles(50, 40, document.getElementById("starScene"));
      });
    }

    starSceneInterval = setInterval(() => {
      const f = document.createElement("span");
      f.className = "falling-star";
      f.style.left = `${15 + Math.random() * 70}%`;
      f.style.top = `${Math.random() * 40}%`;
      sky.appendChild(f);
      setTimeout(() => f.remove(), 2500);
    }, 2200);

  }, 1850);
}

function setupHoloCard() {
  const card = document.getElementById("holoStarCard");
  if (!card) return;

  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    let x, y;
    
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const px = Math.max(0, Math.min(1, x / rect.width));
    const py = Math.max(0, Math.min(1, y / rect.height));

    const tiltX = (0.5 - py) * 15;
    const tiltY = (px - 0.5) * 15;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    card.style.setProperty("--foil-x", `${px * 100}%`);
    card.style.setProperty("--foil-y", `${py * 100}%`);
  };

  const handleLeave = () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.setProperty("--foil-x", "50%");
    card.style.setProperty("--foil-y", "50%");
  };

  card.addEventListener("mousemove", handleMove);
  card.addEventListener("mouseleave", handleLeave);
  card.addEventListener("touchmove", handleMove);
  card.addEventListener("touchend", handleLeave);
}

function buildStarScene() {
  const sky = document.getElementById("starSky");
  const heartsFloat = document.getElementById("starHeartsFloat");
  const title = document.getElementById("starTitle");
  const nameEl = document.getElementById("starName");
  if (!sky) return;

  audio.init();

  if (starSceneInterval) clearInterval(starSceneInterval);

  if (!sky.dataset.bound) {
    sky.dataset.bound = "true";
    sky.addEventListener("click", (e) => {
      if (e.target.closest(".star-node")) return;
      
      const rect = sky.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const f = document.createElement("span");
      f.className = "falling-star";
      f.style.left = `${x}px`;
      f.style.top = `${y - 20}px`;
      sky.appendChild(f);
      
      audio.playChime(7 + Math.floor(Math.random() * 3));
      
      setTimeout(() => f.remove(), 2500);
    });
  }

  sky.innerHTML = "";
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("span");
    s.className = "sky-star";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty("--sz", `${2 + Math.random() * 3}px`);
    s.style.setProperty("--dur", `${1.5 + Math.random() * 2.5}s`);
    s.style.setProperty("--delay", `${Math.random() * 3}s`);
    sky.appendChild(s);
  }

  if (heartsFloat) {
    heartsFloat.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const h = document.createElement("span");
      h.className = "float-heart-particle";
      h.textContent = i % 3 === 0 ? "♥" : "✦";
      h.style.left = `${Math.random() * 100}%`;
      h.style.bottom = `${-10 - Math.random() * 20}%`;
      h.style.setProperty("--fs", `${0.7 + Math.random() * 0.8}rem`);
      h.style.setProperty("--dur", `${5 + Math.random() * 4}s`);
      h.style.setProperty("--delay", `${Math.random() * 5}s`);
      heartsFloat.appendChild(h);
    }
  }

  if (title) title.textContent = BIRTHDAY_CONFIG.starTitle;
  if (nameEl) nameEl.textContent = BIRTHDAY_CONFIG.herName.toLowerCase();

  constellationNodesConnected = [];
  constellationNextTarget = 0;
  
  renderConstellationGame();
}

/* ═══ BIND EVENTS ═══ */
function initExperience() {
  document.getElementById("entranceNext")?.addEventListener("click", nextStage);
  document.getElementById("blowBtn")?.addEventListener("click", blowCandles);
  document.getElementById("cutCakeBtn")?.addEventListener("click", cutCake);
  document.getElementById("wishNext")?.addEventListener("click", nextStage);

  document.querySelectorAll(".gift-card").forEach((card) => {
    card.addEventListener("click", () => openGift(card.dataset.gift));
  });

  document.querySelectorAll(".camera-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchCameraTab(tab.dataset.tab));
  });

  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev")?.addEventListener("click", () => lightboxNav(-1));
  document.getElementById("lightboxNext")?.addEventListener("click", () => lightboxNav(1));

  document.getElementById("photoLightbox")?.addEventListener("click", (e) => {
    if (e.target.id === "photoLightbox") closeLightbox();
  });

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", closeSub);
  });

  document.getElementById("letterNext")?.addEventListener("click", closeSub);
}

initExperience();
