/* ════════════════════════════════════════
   TURAAB ALI — SHARED SITE JS v3.0
   Cursor, Particles, Scroll Reveal,
   Dynamic Nav Active State, Hamburger Menu,
   Boot Sequence
   ════════════════════════════════════════ */

/* ── REDUCED MOTION CHECK ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ════════════════════════════════════════
   CURSOR
════════════════════════════════════════ */
(function() {
  const cur = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  (function animate() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  })();

  /* ring expands on interactive elements */
  const interactiveSelector = 'a, button, input, textarea, .exp-card, .skill-item, .sk, .sk-o, .ap-card, .exp-item, .image-card, .photo-card';
  document.querySelectorAll(interactiveSelector).forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.opacity = '0.2';
      ring.style.borderColor = 'var(--red2)';
    });
    el.addEventListener('mouseleave', function() {
      ring.style.width = '26px';
      ring.style.height = '26px';
      ring.style.opacity = '0.45';
      ring.style.borderColor = 'var(--red)';
    });
  });

  /* cursor hide on touch devices */
  window.addEventListener('touchstart', function() {
    cur.style.display = 'none';
    ring.style.display = 'none';
  }, { once: true });
})();

/* ════════════════════════════════════════
   PARTICLES CANVAS
════════════════════════════════════════ */
(function() {
  const cv = document.getElementById('pcv');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  }

  var Particle = function() { this.reset(); };
  Particle.prototype.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.sz = Math.random() * 1.2 + 0.3;
    this.vx = (Math.random() - .5) * .35;
    this.vy = (Math.random() - .5) * .35;
    this.op = Math.random() * .5 + .1;
    this.life = Math.random() * 250 + 80;
    this.age = 0;
  };
  Particle.prototype.tick = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  };
  Particle.prototype.draw = function() {
    var f = this.age < 30 ? this.age / 30 : (this.age > this.life - 30 ? (this.life - this.age) / 30 : 1);
    cx.globalAlpha = this.op * f;
    cx.fillStyle = Math.random() > .88 ? '#E6391B' : '#fff';
    cx.beginPath();
    cx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
    cx.fill();
  };

  function drawLines() {
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          cx.globalAlpha = (1 - d / 100) * .1;
          cx.strokeStyle = '#E6391B';
          cx.lineWidth = .5;
          cx.beginPath();
          cx.moveTo(pts[i].x, pts[i].y);
          cx.lineTo(pts[j].x, pts[j].y);
          cx.stroke();
        }
      }
    }
  }

  function loop() {
    cx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) { pts[i].tick(); pts[i].draw(); }
    drawLines();
    requestAnimationFrame(loop);
  }

  resize();
  for (var i = 0; i < (prefersReducedMotion ? 30 : 110); i++) { pts.push(new Particle()); }
  loop();
  window.addEventListener('resize', function() { resize(); pts.forEach(function(p) { p.reset(); }); });
})();

/* ════════════════════════════════════════
   SCROLL REVEAL — Sections (.sec)
════════════════════════════════════════ */
(function() {
  var sObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add('vis');
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.sec').forEach(function(s) { sObs.observe(s); });
})();

/* ════════════════════════════════════════
   SCROLL REVEAL — Experience items (.exp-item)
════════════════════════════════════════ */
(function() {
  var eObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e, i) {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i * 0.08) + 's';
        e.target.classList.add('vis');
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.exp-item').forEach(function(el) { eObs.observe(el); });
})();

/* ════════════════════════════════════════
   SCROLL REVEAL — Skill cards (.sk) with stagger
════════════════════════════════════════ */
(function() {
  var skObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var cards = e.target.querySelectorAll('.sk, .sk-o, .ap-card');
        cards.forEach(function(c, i) {
          c.style.transitionDelay = (i * 0.07) + 's';
          c.style.opacity = '1';
          c.style.transform = 'none';
          c.classList.add('vis');
        });
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.skills-list, .skills-open, .approach-grid').forEach(function(g) {
    skObs.observe(g);
  });
})();

/* ════════════════════════════════════════
   DYNAMIC ACTIVE NAV LINK
════════════════════════════════════════ */
(function() {
  var links = document.querySelectorAll('.nav-links a');
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  links.forEach(function(a) {
    var href = a.getAttribute('href');
    // Remove existing active class
    a.classList.remove('active');
    // Match: exact path or / for root index
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      a.classList.add('active');
    }
    // Also match partial for subdirectory pages (e.g., /pc-building/ matches /pc-building/index.html)
    if (currentPath !== '/' && href !== '/' && currentPath.indexOf(href.replace(/\/$/, '')) === 0) {
      a.classList.add('active');
    }
  });
})();

/* ════════════════════════════════════════
   HAMBURGER MOBILE MENU TOGGLE
════════════════════════════════════════ */
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', function() {
    var isOpen = navLinks.classList.contains('open');
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ════════════════════════════════════════
   BOOT SEQUENCE (homepage)
════════════════════════════════════════ */
(function() {
  var bootEl = document.getElementById('boot');
  if (!bootEl) return;

  if (prefersReducedMotion) {
    bootEl.style.display = 'none';
    return;
  }

  var lines = document.querySelectorAll('#boot-log .ln');
  var bar = document.getElementById('boot-bar');
  var pct = document.getElementById('boot-pct');

  if (!lines.length || !bar || !pct) return;

  lines.forEach(function(l) {
    setTimeout(function() { l.classList.add('show'); }, +l.dataset.d);
  });

  var p = 0;
  var iv = setInterval(function() {
    p = Math.min(p + 1.3, 100);
    bar.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(function() {
        bootEl.style.transition = 'opacity .5s';
        bootEl.style.opacity = '0';
        setTimeout(function() { bootEl.style.display = 'none'; }, 500);
      }, 500);
    }
  }, 16);
})();

/* ════════════════════════════════════════
   LIGHTBOX (pc-building page)
════════════════════════════════════════ */
(function() {
  var lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector('.lightbox-content');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var triggers = document.querySelectorAll('.image-card img');

  triggers.forEach(function(img) {
    img.addEventListener('click', function() {
      if (lightboxImg) lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
})();