/* =========================================================
   EASY CUSTOMIZATION VARIABLES
   Change these values before deploying to Vercel.
   ========================================================= */
const GIRLFRIEND_NAME = "My Love";
const BIRTHDAY_DATE = "2026-06-01";
const MUSIC_FILE_PATH = "assets/romantic-music.mp3";
const SCRATCH_CARD_IMAGE_PATH = "assets/scratch-photo.webp";
const SCRATCH_CARD_MESSAGE = "baby pn ged sya pero saguna na 20 years old dn pero smpre baby ko bun ged man hmm ❤️❤️❤️";

const LOVE_LETTER_TEXT = `Happy birthday, my beautiful ${GIRLFRIEND_NAME}.

Today is not just a date on the calendar. It is the day the world became softer, brighter, and more magical because you arrived in it.

I wish I could wrap every good feeling I have for you into one perfect gift: every laugh you gave me when I needed light, every quiet moment when your presence felt like home, every tiny detail about you that makes my heart pause and smile.

You are my favorite hello, my safest place, my sweetest thought, and the person who makes ordinary days feel secretly golden. I love the way you care, the way you dream, the way you smile, and the way you turn even simple moments into memories I want to keep forever.

On your birthday, I hope you feel deeply loved—not just by words, but by the universe itself. I hope this year brings you brave opportunities, gentle peace, silly laughter, beautiful surprises, and dreams that unfold better than you imagined.

Thank you for being you. Thank you for letting me love you. Thank you for making my life warmer just by being in it.

Happy birthday, my love. I am so lucky to celebrate you today and every day. ❤️`;

const GALLERY_IMAGE_PATHS = [
  createMemorySvg("Our Sweetest Smile", "#ffd6e8", "#dcd2ff"),
  createMemorySvg("Birthday Queen", "#fff1d8", "#ff8fbd"),
  createMemorySvg("Forever Favorite", "#e8ddff", "#d9a08f"),
  createMemorySvg("Tiny Magic", "#ffe4ef", "#bca8ff"),
  createMemorySvg("Soft Memories", "#fff7fb", "#ff9fc7"),
  createMemorySvg("My Safe Place", "#f6e9ff", "#ffd1e3")
];

/* =========================================================
   WEBSITE LOGIC
   ========================================================= */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.getElementById("loader");
const body = document.body;
const audio = document.getElementById("audioPlayer");
const playPause = document.getElementById("playPause");
const musicStatus = document.getElementById("musicStatus");
const volumeControl = document.getElementById("volumeControl");
const musicProgress = document.getElementById("musicProgress");
const progressFill = musicProgress.querySelector("span");
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiContext = confettiCanvas.getContext("2d");

let hasInteracted = false;
let typewriterStarted = false;
let lightboxIndex = 0;
let fireworksStarted = false;
let fireworksAnimationId;
let audioContext;

const isMobileFireworks = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
const FIREWORK_SETTINGS = {
  canvasScale: isMobileFireworks ? 1 : 1,
  frameInterval: isMobileFireworks ? 40 : 24,
  autoDelayMin: isMobileFireworks ? 1800 : 900,
  autoDelayMax: isMobileFireworks ? 3000 : 1500,
  doubleLaunchChance: 0,
  manualParticles: isMobileFireworks ? 42 : 72,
  autoParticlesMin: isMobileFireworks ? 30 : 52,
  autoParticlesMax: isMobileFireworks ? 46 : 74,
  maxParticles: isMobileFireworks ? 150 : 320,
  trailLength: 0,
  glow: 0
};

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 900);
});

document.addEventListener("DOMContentLoaded", () => {
  body.classList.add("no-scroll");
  setTimeout(() => body.classList.remove("no-scroll"), 1150);

  audio.src = MUSIC_FILE_PATH;
  audio.volume = Number(volumeControl.value);

  renderGallery();
  setupScratchCard();
  setupNavigation();
  setupObservers();
  setupMusicPlayer();
  setupLetter();
  setupCake();
  setupLightbox();
  setupCursorTrail();
  setupScrollEffects();
  setupFireworks();
  startFloatingHearts();
  startSparkles();
});

function setupNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const backToTop = document.getElementById("backToTop");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("openSurprise").addEventListener("click", async () => {
    markUserInteraction();
    launchConfetti();
    await tryPlayMusic();
    document.getElementById("letter").scrollIntoView({ behavior: "smooth" });
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupObservers() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  const fireworksObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      fireworksState.isVisible = entry.isIntersecting;
      if (entry.isIntersecting) {
        startInfiniteFireworks();
      } else if (fireworksAnimationId) {
        cancelAnimationFrame(fireworksAnimationId);
        fireworksAnimationId = undefined;
        fireworksState.particles.length = 0;
        fireworksState.rockets.length = 0;
        fireworksState.context?.clearRect(0, 0, fireworksState.canvas?.width || 0, fireworksState.canvas?.height || 0);
      }
    });
  }, { threshold: 0.35 });

  fireworksObserver.observe(document.getElementById("fireworks"));
}

function setupScrollEffects() {
  const progress = document.querySelector(".scroll-progress span");
  const backToTop = document.getElementById("backToTop");
  const orbs = document.querySelectorAll(".parallax-orb");

  window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${percent}%`;
    backToTop.classList.toggle("show", window.scrollY > 700);

    if (!prefersReducedMotion) {
      orbs.forEach((orb, index) => {
        const speed = index === 0 ? 0.05 : -0.035;
        orb.style.translate = `0 ${window.scrollY * speed}px`;
      });
    }
  }, { passive: true });
}

function setupMusicPlayer() {
  playPause.addEventListener("click", async () => {
    markUserInteraction();
    if (audio.paused) {
      await tryPlayMusic();
    } else {
      audio.pause();
      playPause.textContent = "▶";
      musicStatus.textContent = "By Bruno Mars";
    }
  });

  audio.addEventListener("play", () => {
    playPause.textContent = "❚❚";
    musicStatus.textContent = "By Bruno Mars";
  });

  audio.addEventListener("error", () => {
    musicStatus.textContent = "Add your music file at the path in script.js.";
  });

  audio.addEventListener("timeupdate", () => {
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progressFill.style.width = `${percent}%`;
  });

  musicProgress.addEventListener("click", (event) => {
    if (!audio.duration) return;
    const rect = musicProgress.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audio.currentTime = audio.duration * percent;
  });

  volumeControl.addEventListener("input", () => {
    audio.volume = Number(volumeControl.value);
  });

  document.addEventListener("pointerdown", markUserInteraction, { once: true });
}

async function tryPlayMusic() {
  try {
    await audio.play();
  } catch {
    musicStatus.textContent = "Tap play after adding your romantic music file.";
  }
}

function markUserInteraction() {
  hasInteracted = true;
}

function setupLetter() {
  const envelope = document.getElementById("envelope");
  const paper = document.getElementById("letterPaper");
  const letterText = document.getElementById("letterText");
  document.getElementById("letterTitle").textContent = `To ${GIRLFRIEND_NAME},`;

  envelope.addEventListener("click", () => {
    envelope.classList.add("open");
    paper.classList.add("open");
    if (!typewriterStarted) {
      typewriterStarted = true;
      typeText(letterText, LOVE_LETTER_TEXT, 18);
    }
  });
}

function typeText(element, text, speed) {
  element.textContent = "";
  let index = 0;
  const tick = () => {
    element.textContent += text.charAt(index);
    index += 1;
    if (index < text.length) {
      setTimeout(tick, prefersReducedMotion ? 0 : speed);
    }
  };
  tick();
}

function renderGallery() {
  const gallery = document.getElementById("galleryGrid");
  gallery.innerHTML = GALLERY_IMAGE_PATHS.map((src, index) => `
    <button class="gallery-item" type="button" style="--ratio:${index % 3 === 0 ? "4 / 5" : index % 3 === 1 ? "1 / 1" : "5 / 4"}" aria-label="Open memory ${index + 1}">
      <img src="${src}" alt="Romantic memory ${index + 1}" loading="lazy">
    </button>
  `).join("");
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  const close = document.getElementById("lightboxClose");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  let touchStartX = 0;

  document.getElementById("galleryGrid").addEventListener("click", (event) => {
    const item = event.target.closest(".gallery-item");
    if (!item) return;
    lightboxIndex = [...document.querySelectorAll(".gallery-item")].indexOf(item);
    openLightbox();
  });

  close.addEventListener("click", closeLightbox);
  prev.addEventListener("click", () => moveLightbox(-1));
  next.addEventListener("click", () => moveLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) moveLightbox(delta > 0 ? -1 : 1);
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  function openLightbox() {
    image.src = GALLERY_IMAGE_PATHS[lightboxIndex];
    lightbox.classList.add("open");
    body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    body.classList.remove("no-scroll");
  }

  function moveLightbox(direction) {
    lightboxIndex = (lightboxIndex + direction + GALLERY_IMAGE_PATHS.length) % GALLERY_IMAGE_PATHS.length;
    image.src = GALLERY_IMAGE_PATHS[lightboxIndex];
  }
}

function setupScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const image = document.getElementById("scratchImage");
  const resetButton = document.getElementById("resetScratch");
  let isDrawing = false;
  let hasCelebrated = false;

  image.src = SCRATCH_CARD_IMAGE_PATH;
  document.getElementById("scratchMessage").textContent = SCRATCH_CARD_MESSAGE;

  const prepareCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    paintScratchCover(rect.width, rect.height);
    hasCelebrated = false;
  };

  const getPoint = (event) => {
    const pointer = event.touches ? event.touches[0] : event;
    const rect = canvas.getBoundingClientRect();
    return {
      x: pointer.clientX - rect.left,
      y: pointer.clientY - rect.top
    };
  };

  const scratch = (event) => {
    if (!isDrawing) return;
    event.preventDefault();
    const point = getPoint(event);
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(point.x, point.y, Math.max(24, canvas.clientWidth * 0.055), 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";
    maybeCelebrateScratch();
  };

  const start = (event) => {
    markUserInteraction();
    isDrawing = true;
    scratch(event);
  };

  const stop = () => {
    isDrawing = false;
  };

  const maybeCelebrateScratch = () => {
    if (hasCelebrated) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let index = 3; index < pixels.length; index += 24) {
      if (pixels[index] < 80) transparent += 1;
    }
    const scratchedRatio = transparent / (pixels.length / 24);
    if (scratchedRatio >= 0.9) {
      hasCelebrated = true;
      launchConfetti();
      burstHeartParticles(window.innerWidth / 2, canvas.getBoundingClientRect().top + 80, 24);
    }
  };

  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", scratch);
  window.addEventListener("pointerup", stop);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", scratch, { passive: false });
  window.addEventListener("touchend", stop);
  resetButton.addEventListener("click", prepareCanvas);
  window.addEventListener("resize", debounce(prepareCanvas, 180));

  requestAnimationFrame(prepareCanvas);
}

function paintScratchCover(width, height) {
  const canvas = document.getElementById("scratchCanvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8c7d9");
  gradient.addColorStop(0.45, "#d9a08f");
  gradient.addColorStop(1, "#bca8ff");
  context.globalCompositeOperation = "source-over";
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let index = 0; index < 70; index += 1) {
    context.beginPath();
    context.arc(Math.random() * width, Math.random() * height, randomBetween(1, 3.5), 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "rgba(255, 255, 255, 0.92)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `800 ${Math.max(18, width * 0.055)}px Inter, system-ui, sans-serif`;
  context.fillText(width / 2, height / 2 - 14);
  context.font = `700 ${Math.max(13, width * 0.032)}px Inter, system-ui, sans-serif`;
  context.fillText(width / 2, height / 2 + 28);
}

function setupCake() {
  const cake = document.querySelector(".cake");
  const wish = document.getElementById("cakeWish");
  const blowCandles = () => {
    cake.classList.add("blown");
    wish.classList.add("show");
    playBirthdayChime();
    launchConfetti();
  };

  cake.addEventListener("click", blowCandles);
  cake.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      blowCandles();
    }
  });
}

function playBirthdayChime() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 523.25, 587.33, 523.25, 698.46, 659.25];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    const start = audioContext.currentTime + index * 0.18;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
    oscillator.start(start);
    oscillator.stop(start + 0.18);
  });
}

function startFloatingHearts() {
  if (prefersReducedMotion) return;
  const container = document.getElementById("floatingHearts");
  const makeHeart = () => {
    const heart = document.createElement("span");
    const size = randomBetween(12, 34);
    heart.className = "heart";
    heart.textContent = Math.random() > 0.28 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty("--x-drift", `${randomBetween(-90, 90)}px`);
    heart.style.setProperty("--rotate", `${randomBetween(-80, 80)}deg`);
    heart.style.animationDuration = `${randomBetween(isMobileFireworks ? 12 : 8, isMobileFireworks ? 22 : 17)}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), isMobileFireworks ? 23000 : 18000);
  };

  makeHeart();
  setInterval(makeHeart, isMobileFireworks ? 1900 : 650);
}

function setupCursorTrail() {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  let lastTime = 0;
  document.addEventListener("pointermove", (event) => {
    const now = Date.now();
    if (now - lastTime < 75) return;
    lastTime = now;
    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.textContent = "♡";
    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;
    heart.style.color = "rgba(255, 105, 157, 0.7)";
    heart.style.setProperty("--dx", `${randomBetween(-18, 18)}px`);
    heart.style.setProperty("--dy", `${randomBetween(-80, -35)}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }, { passive: true });
}

function burstHeartParticles(x, y, amount) {
  if (prefersReducedMotion) return;
  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "particle-heart";
    heart.textContent = "♥";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = index % 2 ? "#ff7db3" : "#d9a08f";
    heart.style.setProperty("--dx", `${randomBetween(-90, 90)}px`);
    heart.style.setProperty("--dy", `${randomBetween(-120, -35)}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }
}

function startSparkles() {
  if (prefersReducedMotion || isMobileFireworks) return;
  const layer = document.getElementById("sparkleLayer");
  setInterval(() => {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = "✦";
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${Math.random() * 100}vh`;
    sparkle.style.fontSize = `${randomBetween(10, 22)}px`;
    layer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 900);
  }, 900);
}

function launchConfetti() {
  const pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.25,
    size: randomBetween(5, 10),
    speed: randomBetween(2, 6),
    rotation: Math.random() * Math.PI,
    spin: randomBetween(-0.2, 0.2),
    color: ["#ff7db3", "#ffd6e8", "#d9a08f", "#bca8ff", "#ffffff"][Math.floor(Math.random() * 5)]
  }));
  let frame = 0;
  resizeCanvas(confettiCanvas);

  const animate = () => {
    confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += Math.sin(frame / 12 + piece.speed) * 1.4;
      piece.rotation += piece.spin;
      confettiContext.save();
      confettiContext.translate(piece.x, piece.y);
      confettiContext.rotate(piece.rotation);
      confettiContext.fillStyle = piece.color;
      confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.5);
      confettiContext.restore();
    });
    frame += 1;
    if (frame < 220) requestAnimationFrame(animate);
    else confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  };
  animate();
}

function setupFireworks() {
  const canvas = document.getElementById("fireworksCanvas");
  resizeFireworksCanvas();
  document.getElementById("fireworks").addEventListener("click", (event) => {
    markUserInteraction();
    if (!fireworksStarted) {
      fireworksStarted = true;
      startInfiniteFireworks();
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    createFireworkBurst((event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY, true);
  });
  window.addEventListener("resize", () => {
    resizeFireworksCanvas();
    resizeCanvas(confettiCanvas);
  });
}

const fireworksState = {
  particles: [],
  rockets: [],
  nextAutoLaunch: 0,
  lastFrameTime: 0,
  isVisible: false,
  context: null,
  canvas: null
};

function startInfiniteFireworks() {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById("fireworksCanvas");
  const context = canvas.getContext("2d");
  fireworksState.canvas = canvas;
  fireworksState.context = context;
  fireworksState.nextAutoLaunch = performance.now();
  if (!fireworksAnimationId) {
    fireworksAnimationId = requestAnimationFrame(animateFireworks);
  }
}

function animateFireworks(time) {
  const { canvas, context, particles, rockets } = fireworksState;
  if (!canvas || !context) return;

  if (time - fireworksState.lastFrameTime < FIREWORK_SETTINGS.frameInterval) {
    fireworksAnimationId = requestAnimationFrame(animateFireworks);
    return;
  }
  fireworksState.lastFrameTime = time;

  if (!fireworksState.isVisible) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    fireworksAnimationId = requestAnimationFrame(animateFireworks);
    return;
  }

  context.globalCompositeOperation = "source-over";
  context.fillStyle = "rgba(44, 29, 52, 0.16)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (time > fireworksState.nextAutoLaunch) {
    launchRocket();
    fireworksState.nextAutoLaunch = time + randomBetween(FIREWORK_SETTINGS.autoDelayMin, FIREWORK_SETTINGS.autoDelayMax);
  }

  context.globalCompositeOperation = "source-over";
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.992;
    particle.vy *= 0.992;
    particle.vy += particle.gravity;
    particle.life -= 1;

    const alpha = Math.max(particle.life / particle.maxLife, 0);
    context.globalAlpha = alpha;
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();

    if (particle.life <= 0) particles.splice(index, 1);
  }
  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.globalCompositeOperation = "source-over";

  fireworksAnimationId = requestAnimationFrame(animateFireworks);
}

function launchRocket() {
  const canvas = fireworksState.canvas;
  if (!canvas) return;
  createFireworkBurst(
    randomBetween(canvas.width * 0.18, canvas.width * 0.82),
    randomBetween(canvas.height * 0.12, canvas.height * 0.52),
    false,
    randomFireworkColor()
  );
}

function createFireworkBurst(x, y, isManual = false, baseColor = randomFireworkColor()) {
  const canvas = fireworksState.canvas || document.getElementById("fireworksCanvas");
  if (!fireworksState.canvas) {
    fireworksState.canvas = canvas;
    fireworksState.context = canvas.getContext("2d");
  }
  const colors = [baseColor, "#ff8fbd", "#ffd6e8", "#d9a08f", "#bca8ff", "#ffffff"];
  const count = isManual
    ? FIREWORK_SETTINGS.manualParticles
    : Math.floor(randomBetween(FIREWORK_SETTINGS.autoParticlesMin, FIREWORK_SETTINGS.autoParticlesMax));
  const ringCount = Math.floor(count * 0.62);

  for (let index = 0; index < count; index += 1) {
    if (fireworksState.particles.length >= FIREWORK_SETTINGS.maxParticles) {
      fireworksState.particles.splice(0, Math.ceil(FIREWORK_SETTINGS.maxParticles * 0.12));
    }
    const ringParticle = index < ringCount;
    const angle = ringParticle
      ? (Math.PI * 2 * index) / ringCount
      : Math.random() * Math.PI * 2;
    const speed = ringParticle ? randomBetween(1.5, 5.5) : randomBetween(0.8, 4.2);
    const life = Math.floor(randomBetween(isMobileFireworks ? 48 : 64, isMobileFireworks ? 70 : 90));
    fireworksState.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.025,
      life,
      maxLife: life,
      color: colors[index % colors.length],
      size: isManual ? randomBetween(1.8, 3.1) : randomBetween(1.4, 2.5)
    });
  }
}

function drawTrail(context, trail, color) {
  if (isMobileFireworks) return;
  trail.forEach((point, index) => {
    context.globalAlpha = index / trail.length;
    context.fillStyle = color;
    context.beginPath();
    context.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
    context.fill();
  });
  context.globalAlpha = 1;
}

function drawCanvasHeart(context, x, y, size) {
  context.save();
  context.translate(x, y);
  context.scale(size / 16, size / 16);
  context.beginPath();
  context.moveTo(0, 6);
  context.bezierCurveTo(-14, -4, -7, -16, 0, -8);
  context.bezierCurveTo(7, -16, 14, -4, 0, 6);
  context.closePath();
  context.restore();
}

function randomFireworkColor() {
  const colors = ["#ff8fbd", "#ffd6e8", "#d9a08f", "#bca8ff", "#ffffff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function resizeFireworksCanvas() {
  const canvas = document.getElementById("fireworksCanvas");
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * FIREWORK_SETTINGS.canvasScale));
  canvas.height = Math.max(1, Math.floor(rect.height * FIREWORK_SETTINGS.canvasScale));
  const context = canvas.getContext("2d");
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const context = canvas.getContext("2d");
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function createMemorySvg(title, colorOne, colorTwo) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${colorOne}"/>
          <stop offset="1" stop-color="${colorTwo}"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#9d4165" flood-opacity=".2"/>
        </filter>
      </defs>
      <rect width="900" height="1100" fill="url(#g)"/>
      <circle cx="150" cy="160" r="90" fill="#fff" opacity=".45"/>
      <circle cx="760" cy="280" r="150" fill="#fff" opacity=".25"/>
      <circle cx="620" cy="900" r="190" fill="#fff" opacity=".22"/>
      <g filter="url(#shadow)">
        <path d="M450 735 C220 570 160 405 272 320 C353 259 425 306 450 366 C475 306 547 259 628 320 C740 405 680 570 450 735Z" fill="#fff" opacity=".82"/>
      </g>
      <text x="450" y="845" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="#9d4165">${title}</text>
      <text x="450" y="920" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#9d4165" opacity=".72">a soft little memory frame</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function debounce(callback, wait) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), wait);
  };
}
