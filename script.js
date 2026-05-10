// Poster → Video Preloader → Main
const posterScreen  = document.getElementById("poster-screen");
const preloader     = document.getElementById("preloader");
const preloaderVideo= document.getElementById("preloader-video");

function revealMain() {
  preloader.classList.add("hide");
  setTimeout(() => preloader.remove(), 900);
  // Trigger scroll-reveal for hero elements
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

if (posterScreen) {
  posterScreen.addEventListener("click", () => {
    // Fade out poster
    posterScreen.classList.add("hide");
    setTimeout(() => posterScreen.remove(), 700);

    // Show & play video
    preloader.classList.remove("hidden");
    preloaderVideo.play().catch(() => {});

    // When video ends → reveal main
    preloaderVideo.addEventListener("ended", revealMain, { once: true });

    // Fallback: if video fails to load, reveal after 5s
    setTimeout(revealMain, 15000);

    // Start music on this user gesture
    if (music && !hasInteracted) {
      hasInteracted = true;
      music.play().then(() => {
        if(playPath)  playPath.style.display  = "none";
        if(pausePath) pausePath.style.display = "block";
        if(musicBtn)  musicBtn.classList.add("playing");
      }).catch(() => {});
    }
  }, { once: true });
}


// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Countdown to 20 June 2026 19:30
const TARGET = new Date("2026-06-20T19:30:00").getTime();
function tick() {
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = pad(v); };
  set("cd-d", d); set("cd-h", h); set("cd-m", m); set("cd-s", s);
}
tick(); setInterval(tick, 1000);

// Music Logic
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
const playPath = document.getElementById("play-path");
const pausePath = document.getElementById("pause-path");
let hasInteracted = false;

function toggleMusic() {
  if (music.paused) {
    music.play().catch(e => console.log("Music play blocked:", e));
    playPath.style.display = "none";
    pausePath.style.display = "block";
    musicBtn.classList.add("playing");
  } else {
    music.pause();
    playPath.style.display = "block";
    pausePath.style.display = "none";
    musicBtn.classList.remove("playing");
  }
}

if (musicBtn) {
  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

// Auto-play on first interaction
const startMusicOnInteraction = () => {
  if (!hasInteracted) {
    hasInteracted = true;
    music.play().then(() => {
      playPath.style.display = "none";
      pausePath.style.display = "block";
      musicBtn.classList.add("playing");
    }).catch(e => {
      console.log("Autoplay failed:", e);
      hasInteracted = false; // Reset to try again on next interaction
    });

    if (hasInteracted) {
      ["click", "touchstart", "mousedown", "pointerdown", "keydown", "scroll", "touchmove"].forEach(ev =>
        document.removeEventListener(ev, startMusicOnInteraction)
      );
    }
  }
};

["click", "touchstart", "mousedown", "pointerdown", "keydown", "scroll", "touchmove"].forEach(ev =>
  document.addEventListener(ev, startMusicOnInteraction, { once: true, capture: true })
);
