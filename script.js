/* ============================================================
   CYBERPUNK EFFECTS · script.js
   赛博终端打字机 / 双侧音浪 / 星空粒子 / Glitch / 赛博音效开关
   全部使用独立 ID 与事件，不触碰原站任何功能逻辑。
   ============================================================ */
(function () {
  'use strict';
  var doc = document, win = window;
  var reduced = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = win.innerWidth <= 520;

  /* ==========================================================
     1. 赛博终端打字机（多标语循环：打字 → 停顿 → 退格擦除）
     ========================================================== */
  (function typewriter() {
    var el = doc.getElementById('cyberTypeText');
    if (!el) return;
    var lines = [
      '你好，我是 曹奥杰',
      '智能测控工程 · 2026 级',
      'Full-Stack Developer',
      'Creative Coder',
      'AI · Music · Basketball'
    ];
    var li = 0, ci = 0, deleting = false;
    var TYPE = 72, DELETE = 30, PAUSE_FULL = 2000, PAUSE_GAP = 350;
    function tick() {
      var line = lines[li];
      if (!deleting) {
        ci++;
        el.textContent = line.slice(0, ci);
        if (ci >= line.length) { deleting = true; setTimeout(tick, PAUSE_FULL); return; }
        setTimeout(tick, TYPE + Math.random() * 45);
      } else {
        ci--;
        el.textContent = line.slice(0, ci);
        if (ci <= 0) {
          deleting = false; li = (li + 1) % lines.length;
          setTimeout(tick, PAUSE_GAP); return;
        }
        setTimeout(tick, DELETE);
      }
    }
    setTimeout(tick, 600); // 入场动画后再开始
  })();

  /* ==========================================================
     2. 动态双侧背景音浪（左青蓝 / 右洋红，霓虹频谱柱）
     ========================================================== */
  (function equalizer() {
    var L = doc.getElementById('eqL'), R = doc.getElementById('eqR');
    if (!L || !R || reduced) return;
    var bars = 26, heightsL = [], heightsR = [], targetsL = [], targetsR = [];
    var ctxL = L.getContext('2d'), ctxR = R.getContext('2d');
    function resize() {
      var dpr = win.devicePixelRatio || 1;
      var w = L.offsetWidth, h = L.offsetHeight;
      L.width = w * dpr; L.height = h * dpr; L.style.width = w + 'px'; L.style.height = h + 'px';
      R.width = w * dpr; R.height = h * dpr; R.style.width = w + 'px'; R.style.height = h + 'px';
      ctxL.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxR.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (var i = 0; i < bars; i++) {
        heightsL[i] = heightsR[i] = 0.3;
        targetsL[i] = targetsR[i] = 0.3;
      }
    }
    win.addEventListener('resize', resize); resize();
    function draw(ctx, heights, targets, colorA, colorB) {
      var w = L.offsetWidth, h = L.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      var gap = 5, bw = (w - gap * (bars - 1)) / bars;
      for (var i = 0; i < bars; i++) {
        // 平滑逼近随机目标
        targets[i] += (Math.random() - 0.5) * 0.55;
        targets[i] = Math.max(0.12, Math.min(1, targets[i]));
        heights[i] += (targets[i] - heights[i]) * 0.08;
        var bh = heights[i] * (h - 8);
        var x = i * (bw + gap), y = h / 2 - bh / 2;
        var grad = ctx.createLinearGradient(x, h / 2 - bh / 2, x, h / 2 + bh / 2);
        grad.addColorStop(0, colorA); grad.addColorStop(1, colorB);
        ctx.shadowBlur = 12; ctx.shadowColor = colorA;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, bw, bh, 3) : ctx.rect(x, y, bw, bh);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    function loop() {
      draw(ctxL, heightsL, targetsL, 'rgba(0,243,255,.95)', 'rgba(0,243,255,.25)');
      draw(ctxR, heightsR, targetsR, 'rgba(255,0,85,.95)', 'rgba(255,0,85,.25)');
      raf(loop);
    }
    var raf = win.requestAnimationFrame || function (f) { setTimeout(f, 33); };
    raf(loop);
  })();

  /* ==========================================================
     3. 全局星空粒子（鼠标引力/互斥 + 随机流星）
     ========================================================== */
  (function starfield() {
    var cv = doc.getElementById('starfield');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W, H, DPR, stars = [], meteors = [], mouse = { x: -9999, y: -9999 };
    var COUNT = isMobile ? 55 : 130;
    function resize() {
      DPR = win.devicePixelRatio || 1;
      W = win.innerWidth; H = win.innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      stars.length = 0;
      for (var i = 0; i < COUNT; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          tw: Math.random() * Math.PI * 2,
          cyan: Math.random() < 0.65
        });
      }
    }
    win.addEventListener('resize', resize); resize();
    win.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    win.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
    function spawnMeteor() {
      meteors.push({
        x: Math.random() * W * 0.7 + W * 0.2, y: -20,
        vx: -(2.2 + Math.random() * 3), vy: 2.6 + Math.random() * 2.6,
        life: 60 + Math.random() * 40
      });
    }
    var meteorTimer = 0;
    function loop() {
      ctx.clearRect(0, 0, W, H);
      // 粒子
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        // 鼠标引力（近距离）
        var dx = mouse.x - s.x, dy = mouse.y - s.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          var d = Math.sqrt(d2) || 1, f = (120 - d) / 120 * 0.12;
          s.vx += (dx / d) * f; s.vy += (dy / d) * f;
        }
        s.vx *= 0.985; s.vy *= 0.985; // 阻尼
        s.x += s.vx; s.y += s.vy;
        if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10; if (s.y > H + 10) s.y = -10;
        s.tw += 0.03;
        var alpha = 0.35 + 0.45 * Math.abs(Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.cyan ? 'rgba(0,243,255,' + alpha + ')' : 'rgba(255,255,255,' + (alpha * 0.7) + ')';
        ctx.shadowBlur = 8; ctx.shadowColor = s.cyan ? 'rgba(0,243,255,.8)' : 'rgba(255,255,255,.4)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      // 流星
      meteorTimer++;
      if (meteorTimer > (isMobile ? 260 : 130) && meteors.length < 3) { spawnMeteor(); meteorTimer = 0; }
      for (var m = meteors.length - 1; m >= 0; m--) {
        var mt = meteors[m];
        mt.x += mt.vx; mt.y += mt.vy; mt.life--;
        var grad = ctx.createLinearGradient(mt.x, mt.y, mt.x - mt.vx * 9, mt.y - mt.vy * 9);
        grad.addColorStop(0, 'rgba(0,243,255,.9)'); grad.addColorStop(1, 'rgba(0,243,255,0)');
        ctx.strokeStyle = grad; ctx.lineWidth = 1.6; ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,243,255,.9)';
        ctx.beginPath();
        ctx.moveTo(mt.x, mt.y); ctx.lineTo(mt.x - mt.vx * 9, mt.y - mt.vy * 9);
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (mt.life <= 0 || mt.x < -80 || mt.y > H + 80) meteors.splice(m, 1);
      }
      raf(loop);
    }
    var raf = win.requestAnimationFrame || function (f) { setTimeout(f, 33); };
    raf(loop);
    // 性能：标签页隐藏时暂停
    doc.addEventListener('visibilitychange', function () { /* rAF 由浏览器自动降频，无需额外处理 */ });
  })();

  /* ==========================================================
     4. Glitch 故障字效注入（Hero 名 + 板块标题）
     ========================================================== */
  (function glitchInject() {
    var targets = doc.querySelectorAll('.hero-name, .section-title');
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (t.classList.contains('glitch')) continue;
      t.classList.add('glitch');
      t.setAttribute('data-text', (t.textContent || '').trim().replace(/\s+/g, ' '));
    }
  })();

  /* ==========================================================
     5. 卡片四角 L 型标尺线注入（不占用原伪元素）
     ========================================================== */
  (function cornerInject() {
    var sels = '.ai-card,.work-music,.work-game,.cert-card,.edu-story,.radar-canvas-wrap,.cat-frame';
    var cards = doc.querySelectorAll(sels);
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].querySelector('.cyber-corners')) continue;
      var c = doc.createElement('i');
      c.className = 'cyber-corners';
      c.setAttribute('aria-hidden', 'true');
      cards[i].appendChild(c);
    }
  })();

  /* ==========================================================
     6. 赛博音效/BGM 开关（WebAudio 低鸣科技氛围音 + 呼吸灯）
     ========================================================== */
  (function cyberAudio() {
    var btn = doc.getElementById('cyberAudioBtn');
    if (!btn) return;
    var ctx = null, master = null, oscL, oscR, lfo, lfoGain, filter, running = false;

    function build() {
      ctx = new (win.AudioContext || win.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 240; filter.Q.value = 6;
      filter.connect(master);
      // 双振荡器：55Hz 锯齿 + 110Hz 正弦 → 低鸣科技感
      oscL = ctx.createOscillator(); oscL.type = 'sawtooth'; oscL.frequency.value = 55;
      oscR = ctx.createOscillator(); oscR.type = 'sine'; oscR.frequency.value = 110.5;
      oscL.connect(filter); oscR.connect(filter);
      // LFO 缓慢呼吸调制音量
      lfo = ctx.createOscillator(); lfo.frequency.value = 0.18;
      lfoGain = ctx.createGain(); lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain); lfoGain.connect(master.gain);
      oscL.start(); oscR.start(); lfo.start();
    }
    function fade(to, dur) {
      if (!ctx || !master) return;
      var t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(to, t + dur);
    }
    btn.addEventListener('click', function () {
      if (!ctx) build();
      if (ctx.state === 'suspended') ctx.resume();
      running = !running;
      btn.classList.toggle('on', running);
      fade(running ? 0.085 : 0, running ? 0.8 : 0.4);
      // 点击瞬间的短促科技"哔"声
      if (running) {
        var blip = ctx.createOscillator(); blip.type = 'square'; blip.frequency.value = 660;
        var bg = ctx.createGain(); bg.gain.setValueAtTime(0.05, ctx.currentTime);
        bg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
        blip.connect(bg); bg.connect(master);
        blip.start(); blip.stop(ctx.currentTime + 0.1);
      }
    });
    // 离开页面时静音，避免后台播放
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden && running && ctx) fade(0, 0.15);
    });
  })();
})();
