// ═══════════════════════════════════════════
// LOVE PAGE — script.js
// ═══════════════════════════════════════════
(function () {

  /* ── QUOTES ── */
  const quotes = [
    "You're the peanut butter to my jelly 🥜",
    "Every love story is beautiful, but ours is my favorite 📖",
    "I love you more than words can say ❤️",
    "You make my heart smile 😊",
    "You're my today and all my tomorrows",
    "I knew I loved you before I met you",
    "You're the reason I believe in love",
    "If I had a flower for every time I thought of you... I could walk in my garden forever 🌸"
  ];

  /* ══════════════════════════════════════
     CANVAS HEARTS
  ══════════════════════════════════════ */
  const canvas = document.getElementById('heartCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, hearts = [];

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function spawnHeart() {
      return {
        x: Math.random() * W,
        y: H + 20,
        size: Math.random() * 14 + 7,
        speedY: Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.15,
        wobble: Math.random() * Math.PI * 2,
      };
    }

    function drawHeart(ctx, x, y, size) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
      ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      hearts.forEach((h, i) => {
        h.wobble += 0.02;
        h.y -= h.speedY;
        h.x += h.speedX + Math.sin(h.wobble) * 0.3;
        ctx.globalAlpha = h.opacity;
        ctx.fillStyle = '#e50914';
        ctx.shadowColor = 'rgba(229,9,20,0.6)';
        ctx.shadowBlur = 10;
        drawHeart(ctx, h.x, h.y, h.size);
        if (h.y < -40) hearts[i] = spawnHeart();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    for (let i = 0; i < 30; i++) {
      const h = spawnHeart();
      h.y = Math.random() * H; // scatter initially
      hearts.push(h);
    }
    loop();
  }

  /* ══════════════════════════════════════
     TYPING EFFECT
  ══════════════════════════════════════ */
  const typedEl = document.getElementById('typed-text');
  const messages = [
    "You are the most beautiful part of my world.",
    "Every day with you is a gift I cherish.",
    "My heart is yours, today and always.",
    "Happy birthday, my angel. ❤️"
  ];
  let msgIdx = 0, charIdx = 0, deleting = false;

  function type() {
    if (!typedEl) return;
    const cur = messages[msgIdx];
    if (deleting) {
      typedEl.textContent = cur.slice(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = cur.slice(0, charIdx + 1);
      charIdx++;
    }
    if (!deleting && charIdx === cur.length) {
      deleting = true;
      setTimeout(type, 2200);
    } else if (deleting && charIdx === 0) {
      deleting = false;
      msgIdx = (msgIdx + 1) % messages.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, deleting ? 45 : 90);
    }
  }
  type();

  /* ══════════════════════════════════════
     MUSIC AUTO-PLAY
  ══════════════════════════════════════ */
  const music = document.getElementById('bgMusic');
  if (music) {
    music.volume = 0.18;
    const tryPlay = () => music.play().catch(() => {});
    tryPlay();
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(ev => {
      document.addEventListener(ev, function once() {
        tryPlay();
        document.removeEventListener(ev, once);
      }, { passive: true });
    });
  }

  /* ══════════════════════════════════════
     SCROLL PROGRESS
  ══════════════════════════════════════ */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (s / h * 100) + '%';
  }, { passive: true });

  /* ══════════════════════════════════════
     FLOATING QUOTES
  ══════════════════════════════════════ */
  const qDiv = document.getElementById('floatingQuote');
  function showQuote() {
    if (!qDiv) return;
    qDiv.textContent = '❤️ ' + quotes[Math.floor(Math.random() * quotes.length)] + ' ❤️';
    qDiv.style.opacity = 1;
    setTimeout(() => { qDiv.style.opacity = 0; }, 4500);
  }
  setTimeout(showQuote, 3000);
  setInterval(showQuote, 14000);

  /* ══════════════════════════════════════
     HEART BURST
  ══════════════════════════════════════ */
  function heartBurst(count = 18) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.textContent = '❤️';
        el.className = 'heart-burst';
        el.style.cssText = `
          left: ${Math.random() * 95}vw;
          top: ${Math.random() * 85}vh;
          font-size: ${Math.random() * 28 + 18}px;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
      }, i * 55);
    }
  }

  /* ══════════════════════════════════════
     CONFETTI
  ══════════════════════════════════════ */
  const confCvs = document.getElementById('confettiCanvas');
  let confCtx, confParticles = [], confTimer;
  if (confCvs) {
    confCtx = confCvs.getContext('2d');
    function resizeConf() { confCvs.width = window.innerWidth; confCvs.height = window.innerHeight; }
    window.addEventListener('resize', resizeConf);
    resizeConf();
  }
  window.triggerConfetti = function () {
    if (!confCtx) return;
    for (let i = 0; i < 120; i++) {
      confParticles.push({
        x: Math.random() * confCvs.width,
        y: -20,
        size: Math.random() * 9 + 4,
        vy: Math.random() * 5 + 2,
        vx: (Math.random() - 0.5) * 4,
        color: `hsl(${Math.random() * 60 + 340}, 90%, 65%)`,
        rot: Math.random() * Math.PI * 2,
        rspeed: (Math.random() - 0.5) * 0.2,
      });
    }
    if (!confTimer) confTimer = setInterval(drawConf, 25);
  };
  function drawConf() {
    if (!confCtx || !confCvs) return;
    confCtx.clearRect(0, 0, confCvs.width, confCvs.height);
    confParticles = confParticles.filter(p => p.y < confCvs.height + 20);
    confParticles.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rot += p.rspeed;
      confCtx.save();
      confCtx.translate(p.x, p.y);
      confCtx.rotate(p.rot);
      confCtx.fillStyle = p.color;
      confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      confCtx.restore();
    });
    if (confParticles.length === 0) { clearInterval(confTimer); confTimer = null; }
  }

  /* ══════════════════════════════════════
     MODAL: CAKE BIRTHDAY
  ══════════════════════════════════════ */
  const cakeModal = document.getElementById('cakeModal');
  const closeCakeBtn = document.getElementById('closeCakeModal');

  function openCakeModal() {
    if (!cakeModal) return;
    cakeModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    heartBurst();
    window.triggerConfetti && window.triggerConfetti();
  }
  function closeCake() {
    if (!cakeModal) return;
    cakeModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.getElementById('openHeartBtn')?.addEventListener('click', openCakeModal);
  document.getElementById('lastHeartBtn')?.addEventListener('click', () => {
    openCakeModal();
    const msg = document.getElementById('surpriseMessage');
    if (msg) {
      msg.textContent = '💖 You are my greatest adventure. I love you endlessly! 💖';
      msg.classList.remove('hidden');
      msg.classList.add('glass');
    }
  });

  closeCakeBtn?.addEventListener('click', closeCake);
  cakeModal?.addEventListener('click', e => { if (e.target === cakeModal) closeCake(); });

  /* ── YES / ALWAYS BUTTONS ── */
  document.getElementById('yesBtn')?.addEventListener('click', () => {
    heartBurst(25);
    window.triggerConfetti && window.triggerConfetti();
    setTimeout(() => alert("❤️ You've made me the happiest person alive! Forever it is! ❤️"), 200);
  });
  document.getElementById('alwaysBtn')?.addEventListener('click', () => {
    heartBurst(25);
    window.triggerConfetti && window.triggerConfetti();
    setTimeout(() => alert("💞 Always and forever, my love! 💞"), 200);
  });

  /* ══════════════════════════════════════
     LIGHTBOX for collage photos
  ══════════════════════════════════════ */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.querySelector('.lb-close');

  document.querySelectorAll('.photo-cell img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      if (lightbox && lbImg) {
        lbImg.src = img.src;
        lightbox.classList.add('show');
      }
    });
  });
  lbClose?.addEventListener('click', () => lightbox.classList.remove('show'));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('show'); });

<<<<<<< HEAD
 
=======
  /* ── ESC KEY ── */
>>>>>>> a644d4fa7cf5924968b7f0a3530acc867f6eab83
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      lightbox?.classList.remove('show');
      closeCake();
    }
  });

  /* ══════════════════════════════════════
     SCROLL REVEAL (flip cards, sections)
  ══════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.flip-card, .proposal-card, .reasons, .surprise-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

})();