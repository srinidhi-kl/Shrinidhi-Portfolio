document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Lucide icons ---------------- */
  if (window.lucide) lucide.createIcons();

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const navToggleIcon = document.getElementById("navToggleIcon");
  let menuOpen = false;
  navToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    navToggleIcon.setAttribute("data-lucide", menuOpen ? "x" : "menu");
    if (window.lucide) lucide.createIcons();
  });
  mobileMenu.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.classList.remove("open");
      navToggleIcon.setAttribute("data-lucide", "menu");
      if (window.lucide) lucide.createIcons();
    });
  });

  /* ---------------- Hero: letter-by-letter title reveal ---------------- */
  function buildLetters(container, text, baseDelay, gold) {
    text.split("").forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = gold ? "letter gold-text" : "letter";
      span.textContent = ch;
      span.style.animationDelay = `${baseDelay + i * 0.06}s`;
      container.appendChild(span);
    });
  }
  const line1 = document.getElementById("heroLine1");
  const line2 = document.getElementById("heroLine2");
  if (line1 && line2) {
    buildLetters(line1, "Shri", 0.15, false);
    buildLetters(line2, "Nidhi", 0.4, true);
  }

  /* ---------------- Hero: rotating role text ---------------- */
  const roles = ["Model & Actor", "Content Creator", "Senior Web Developer"];
  let roleIndex = 0;
  const roleText = document.getElementById("roleText");
  if (roleText) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.style.animation = "none";
      requestAnimationFrame(() => {
        roleText.textContent = roles[roleIndex];
        roleText.style.animation = "role-in 0.5s cubic-bezier(0.16,1,0.3,1)";
      });
    }, 2800);
  }

  /* ---------------- Hero: floating particles ---------------- */
  const particleWrap = document.getElementById("heroParticles");
  if (particleWrap) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = 2 + (i % 3);
      p.style.left = `${(i * 37) % 100}%`;
      p.style.top = `${(i * 53) % 100}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDuration = `${9 + (i % 7) * 2}s`;
      p.style.animationDelay = `${(i % 5) * 1.2}s`;
      particleWrap.appendChild(p);
    }
  }

  /* ---------------- Hero: 3D tilt on image frame ---------------- */
  const frameWrap = document.getElementById("heroFrameWrap");
  const frame = document.getElementById("heroFrame");
  if (frameWrap && frame && !reduced) {
    frameWrap.addEventListener("mousemove", (e) => {
      const rect = frameWrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = -py * 12;
      const ry = px * 14;
      frame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    frameWrap.addEventListener("mouseleave", () => {
      frame.style.transform = "rotateX(0) rotateY(0)";
    });
  }

  /* ---------------- Floating shapes parallax (mouse move) ---------------- */
  function initParallax(containerId) {
    const container = document.getElementById(containerId);
    if (!container || reduced) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const shapes = Array.from(container.querySelectorAll("[data-depth]"));
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      shapes.forEach((el) => {
        const depth = parseFloat(el.dataset.depth || "0");
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }
  initParallax("heroShapes");
  initParallax("contactShapes");

  /* ---------------- Gold buttons: magnetic + ripple ---------------- */
  document.querySelectorAll(".gold-btn").forEach((btn) => {
    if (!reduced) {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.32;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    }
    btn.addEventListener("click", (e) => {
      if (reduced) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-60px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- Stats: count-up ---------------- */
  const statEls = document.querySelectorAll(".stat-value");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const to = parseFloat(el.dataset.to || "0");
        const suffix = el.dataset.suffix || "";
        statObserver.unobserve(el);
        if (reduced) {
          el.textContent = `${to}${suffix}`;
          return;
        }
        const duration = 1800;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(to * eased)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.3, rootMargin: "-80px" },
  );
  statEls.forEach((el) => statObserver.observe(el));

  /* ---------------- Gallery: data + render ---------------- */
  const shots = [
    { src: "assets/fasion1.jpeg", category: "Fashion", label: "Studio Editorial", tall: true },
    { src: "assets/fasion2.jpeg", category: "Fashion", label: "Street Series", tall: false },
    { src: "assets/fashion-4.png", category: "Fashion", label: "Street Series", tall: false },
    { src: "assets/fashion-5.png", category: "Fashion", label: "Street Series", tall: false },
    { src: "assets/fashion-6.png", category: "Fashion", label: "Street Series", tall: false },
    { src: "assets/casual1.jpeg", category: "Casual", label: "Golden Hour", tall: false },
    { src: "assets/casual2.jpeg", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual3.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual4.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual5.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual6.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual7.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual8.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/casual9.JPG", category: "Casual", label: "Monochrome", tall: false },
    { src: "assets/tredional1.jpeg", category: "Traditional", label: "Heritage Shoot", tall: true },
    { src: "assets/tredional2.jpeg", category: "Traditional", label: "Denim Story", tall: false },
    { src: "assets/traditional3.JPG", category: "Traditional", label: "Denim Story", tall: false },
    { src: "assets/traditional4.JPG", category: "Traditional", label: "Denim Story", tall: false },
    { src: "assets/traditional5.JPG", category: "Traditional", label: "Denim Story", tall: false },
    { src: "assets/traditional6.JPG", category: "Traditional", label: "Denim Story", tall: false },
    { src: "assets/fasion3.jpeg", category: "Fashion", label: "City Light", tall: false },
    { src: "assets/lifestyle1.jpeg", category: "Lifestyle", label: "Festive Frame", tall: false },
    { src: "assets/lifestyle2.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle3.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle4.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle5.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle6.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle7.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle8.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle9.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle10.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
    { src: "assets/lifestyle11.jpeg", category: "Lifestyle", label: "Denim Story", tall: false },
  ];

  const galleryGrid = document.getElementById("galleryGrid");
  const filterBar = document.getElementById("filterBar");

  /* ---------------- Dev Work: filter tabs ---------------- */
  const devFilterBar = document.getElementById("devFilterBar");
  const devGrid = document.getElementById("devGrid");
  if (devFilterBar && devGrid) {
    const devCards = Array.from(devGrid.querySelectorAll(".project-card"));
    devFilterBar.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        devFilterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        devCards.forEach((card) => {
          const match = filter === "All" || card.dataset.category === filter;
          card.classList.toggle("project-card-hidden", !match);
        });
      });
    });
  }

  if (!galleryGrid || !filterBar) return; // page has no gallery/lightbox markup
  let activeFilter = "All";
  let visible = shots.slice();

  function renderGallery() {
    visible = activeFilter === "All" ? shots.slice() : shots.filter((s) => s.category === activeFilter);
    galleryGrid.innerHTML = "";
    visible.forEach((shot, i) => {
      const wrap = document.createElement("div");
      wrap.className = `shot reveal is-visible${shot.tall ? " tall" : ""}`;
      wrap.style.transitionDelay = `${(i % 6) * 0.08}s`;

      const btn = document.createElement("button");
      btn.className = "shot-card";
      btn.dataset.index = i;
      btn.innerHTML = `
        <img src="${shot.src}" alt="${shot.label} — ${shot.category} modeling shot" loading="lazy" />
        <div class="shot-shade"></div>
        <div class="shot-info">
          <div>
            <p class="shot-cat">${shot.category}</p>
            <p class="shot-label">${shot.label}</p>
          </div>
          <span class="shot-arrow"><i data-lucide="arrow-up-right" style="width:20px;height:20px;"></i></span>
        </div>
      `;
      btn.addEventListener("click", () => openLightbox(i));
      wrap.appendChild(btn);
      galleryGrid.appendChild(wrap);
    });
    if (window.lucide) lucide.createIcons();
  }
  renderGallery();

  filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery();
    });
  });

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCat = document.getElementById("lightboxCat");
  const lightboxLabel = document.getElementById("lightboxLabel");
  const lightboxBox = document.getElementById("lightboxBox");
  let lightboxIndex = null;

  function openLightbox(i) {
    lightboxIndex = i;
    updateLightbox();
    lightbox.classList.add("open");
  }
  function updateLightbox() {
    const shot = visible[lightboxIndex];
    if (!shot) return;
    lightboxImg.src = shot.src;
    lightboxImg.alt = shot.label;
    lightboxCat.textContent = shot.category;
    lightboxLabel.textContent = shot.label;
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxIndex = null;
  }
  function stepLightbox(dir) {
    if (lightboxIndex === null) return;
    lightboxIndex = (lightboxIndex + dir + visible.length) % visible.length;
    updateLightbox();
  }
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
  document.getElementById("lightboxNext").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });
  lightbox.addEventListener("click", closeLightbox);
  lightboxBox.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
});

// --------------Video Popup------------------
/* ---------------- Reels: video lightbox ---------------- */
const videoLightbox = document.getElementById("videoLightbox");
const lightboxVideo = document.getElementById("lightboxVideo");
if (videoLightbox && lightboxVideo) {
  document.querySelectorAll(".reel-card[data-video]").forEach((card) => {
    card.addEventListener("click", () => {
      lightboxVideo.src = card.dataset.video;
      videoLightbox.classList.add("open");
      lightboxVideo.play();
    });
  });
  function closeVideoLightbox() {
    videoLightbox.classList.remove("open");
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
  }
  document.getElementById("videoLightboxClose").addEventListener("click", closeVideoLightbox);
  videoLightbox.addEventListener("click", (e) => { if (e.target === videoLightbox) closeVideoLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (videoLightbox.classList.contains("open") && e.key === "Escape") closeVideoLightbox();
  });
}
