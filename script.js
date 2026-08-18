/* ============================================================
   CYBERPUNK EFFECTS · script.js
   赛博终端 / 音浪 / 写实星空 / Glitch / 音效
   ============================================================ */
(function () {
  'use strict';
  var doc = document, win = window;
  var reduced = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = win.innerWidth <= 520;

  (function typewriter() {
    var el = doc.getElementById('cyberTypeText'); if (!el) return;
    var lines = ['你好，我是 曹奥杰','智能测控工程 · 2026 级','Full-Stack Developer','Creative Coder','AI · Music · Basketball'];
    var li=0,ci=0,deleting=false,TYPE=72,DELETE=30,PAUSE_FULL=2000,PAUSE_GAP=350;
    function tick(){var line=lines[li];if(!deleting){ci++;el.textContent=line.slice(0,ci);if(ci>=line.length){deleting=true;setTimeout(tick,PAUSE_FULL);return}setTimeout(tick,TYPE+Math.random()*45)}else{ci--;el.textContent=line.slice(0,ci);if(ci<=0){deleting=false;li=(li+1)%lines.length;setTimeout(tick,PAUSE_GAP);return}setTimeout(tick,DELETE)}}
    setTimeout(tick,600);
  })();

  (function equalizer(){
    var L=doc.getElementById('eqL'),R=doc.getElementById('eqR');if(!L||!R||reduced)return;
    var bars=26,heightsL=[],heightsR=[],targetsL=[],targetsR=[],ctxL=L.getContext('2d'),ctxR=R.getContext('2d');
    function resize(){var dpr=win.devicePixelRatio||1,w=L.offsetWidth,h=L.offsetHeight;L.width=w*dpr;L.height=h*dpr;R.width=w*dpr;R.height=h*dpr;ctxL.setTransform(dpr,0,0,dpr,0,0);ctxR.setTransform(dpr,0,0,dpr,0,0);for(var i=0;i<bars;i++)heightsL[i]=heightsR[i]=.3,targetsL[i]=targetsR[i]=.3}
    win.addEventListener('resize',resize);resize();
    function draw(ctx,heights,targets,colorA,colorB){var w=L.offsetWidth,h=L.offsetHeight;ctx.clearRect(0,0,w,h);var gap=5,bw=(w-gap*(bars-1))/bars;for(var i=0;i<bars;i++){targets[i]=Math.max(.12,Math.min(1,targets[i]+(Math.random()-.5)*.55));heights[i]+=(targets[i]-heights[i])*.08;var bh=heights[i]*(h-8),x=i*(bw+gap),y=h/2-bh/2,g=ctx.createLinearGradient(x,y,x,y+bh);g.addColorStop(0,colorA);g.addColorStop(1,colorB);ctx.shadowBlur=12;ctx.shadowColor=colorA;ctx.fillStyle=g;ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,bw,bh,3):ctx.rect(x,y,bw,bh);ctx.fill()}ctx.shadowBlur=0}
    var raf=win.requestAnimationFrame||function(f){setTimeout(f,33)};function loop(){draw(ctxL,heightsL,targetsL,'rgba(168,85,247,.95)','rgba(168,85,247,.25)');draw(ctxR,heightsR,targetsR,'rgba(255,45,149,.95)','rgba(255,45,149,.25)');raf(loop)}raf(loop);
  })();

  (function realisticStarfield(){
    var cv=doc.getElementById('starfield');if(!cv)return;var ctx=cv.getContext('2d'),W,H,DPR,stars=[],meteors=[],nebula=[];var COUNT=isMobile?105:260;
    function rand(a,b){return a+Math.random()*(b-a)}
    function resize(){DPR=win.devicePixelRatio||1;W=win.innerWidth;H=win.innerHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);stars=[];nebula=[];for(var i=0;i<COUNT;i++){var depth=Math.random();stars.push({x:Math.random()*W,y:Math.random()*H,r:depth<.72?rand(.18,.65):rand(.55,1.15),a:depth<.72?rand(.22,.62):rand(.45,.9),tw:Math.random()*Math.PI*2,speed:rand(.003,.012),depth:rand(.25,1),tone:Math.random()<.08?'warm':(Math.random()<.18?'cool':'white')})}for(var n=0;n<(isMobile?4:7);n++)nebula.push({x:W*rand(.15,.85),y:H*rand(.08,.72),r:rand(120,320),a:rand(.018,.045)})}
    win.addEventListener('resize',resize);resize();
    function spawnMeteor(){var speed=rand(5.5,9);meteors.push({x:rand(W*.55,W*1.05),y:rand(-40,H*.18),vx:-speed*.72,vy:speed,life:rand(38,60),max:60})}
    var meteorTimer=0,raf=win.requestAnimationFrame||function(f){setTimeout(f,33)};
    function loop(){ctx.clearRect(0,0,W,H);for(var n=0;n<nebula.length;n++){var q=nebula[n],g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,q.r);g.addColorStop(0,'rgba(126,110,170,'+q.a+')');g.addColorStop(.55,'rgba(90,80,130,'+(q.a*.35)+')');g.addColorStop(1,'rgba(40,35,65,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill()}
      for(var i=0;i<stars.length;i++){var s=stars[i];s.tw+=s.speed;var alpha=s.a*(.82+.18*Math.sin(s.tw));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);if(s.tone==='warm')ctx.fillStyle='rgba(255,236,204,'+alpha+')';else if(s.tone==='cool')ctx.fillStyle='rgba(215,230,255,'+alpha+')';else ctx.fillStyle='rgba(245,245,255,'+alpha+')';ctx.fill()}
      meteorTimer++;if(meteorTimer>(isMobile?320:190)&&meteors.length<1){spawnMeteor();meteorTimer=0}for(var m=meteors.length-1;m>=0;m--){var mt=meteors[m];mt.x+=mt.vx;mt.y+=mt.vy;mt.life--;var fade=Math.max(0,mt.life/mt.max),g2=ctx.createLinearGradient(mt.x,mt.y,mt.x-mt.vx*8,mt.y-mt.vy*8);g2.addColorStop(0,'rgba(255,248,230,'+(fade*.95)+')');g2.addColorStop(1,'rgba(180,160,220,0)');ctx.strokeStyle=g2;ctx.lineWidth=1.15;ctx.beginPath();ctx.moveTo(mt.x,mt.y);ctx.lineTo(mt.x-mt.vx*8,mt.y-mt.vy*8);ctx.stroke();if(mt.life<=0||mt.x<-100||mt.y>H+100)meteors.splice(m,1)}raf(loop)}raf(loop);
  })();

  (function glitchInject(){var targets=doc.querySelectorAll('.hero-name,.section-title');for(var i=0;i<targets.length;i++){var t=targets[i];if(t.classList.contains('glitch'))continue;t.classList.add('glitch');t.setAttribute('data-text',(t.textContent||'').trim().replace(/\s+/g,' '))}})();
  (function cornerInject(){var cards=doc.querySelectorAll('.ai-card,.work-music,.work-game,.cert-card,.edu-story,.radar-canvas-wrap,.cat-frame');for(var i=0;i<cards.length;i++){if(cards[i].querySelector('.cyber-corners'))continue;var c=doc.createElement('i');c.className='cyber-corners';c.setAttribute('aria-hidden','true');cards[i].appendChild(c)}})();
  (function cyberAudio(){var btn=doc.getElementById('cyberAudioBtn');if(!btn)return;var ctx=null,master=null,oscL,oscR,lfo,lfoGain,filter,running=false;function build(){ctx=new(win.AudioContext||win.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=240;filter.Q.value=6;filter.connect(master);oscL=ctx.createOscillator();oscL.type='sawtooth';oscL.frequency.value=55;oscR=ctx.createOscillator();oscR.type='sine';oscR.frequency.value=110.5;oscL.connect(filter);oscR.connect(filter);lfo=ctx.createOscillator();lfo.frequency.value=.18;lfoGain=ctx.createGain();lfoGain.gain.value=.03;lfo.connect(lfoGain);lfoGain.connect(master.gain);oscL.start();oscR.start();lfo.start()}function fade(to,dur){if(!ctx||!master)return;var t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(to,t+dur)}btn.addEventListener('click',function(){if(!ctx)build();if(ctx.state==='suspended')ctx.resume();running=!running;btn.classList.toggle('on',running);fade(running?.085:0,running?.8:.4);if(running){var blip=ctx.createOscillator();blip.type='square';blip.frequency.value=660;var bg=ctx.createGain();bg.gain.setValueAtTime(.05,ctx.currentTime);bg.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.09);blip.connect(bg);bg.connect(master);blip.start();blip.stop(ctx.currentTime+.1)}});doc.addEventListener('visibilitychange',function(){if(doc.hidden&&running&&ctx)fade(0,.15)})})();

  /* 电影机式回马灯转场：顺滑、短促、先虚后实 */
  (function cinematicReveal(){
    if(reduced)return;
    var items=doc.querySelectorAll('.reveal');
    if(!items.length)return;
    if(!('IntersectionObserver' in win)){for(var i=0;i<items.length;i++)items[i].classList.add('active');return}
    var io=new IntersectionObserver(function(entries){for(var i=0;i<entries.length;i++){if(entries[i].isIntersecting){entries[i].target.classList.add('active');io.unobserve(entries[i].target)}}},{threshold:.10,rootMargin:'0px 0px -7% 0px'});
    for(var j=0;j<items.length;j++)io.observe(items[j]);
  })();
})();
