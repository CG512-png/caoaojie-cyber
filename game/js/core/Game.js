const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameover',
  VICTORY: 'victory',
  BOSS_WARNING: 'boss_warning',
  LEVEL_TRANSITION: 'level_transition'
};

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.state = GameState.MENU;
    this.previousState = GameState.MENU;
    
    this.lastTime = 0;
    this.dt = 0;
    this.gameTime = 0;
    this.pauseKeyPressed = false;
    this.skillKeyPressed = false;
    
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.kills = 0;
    
    this.difficulty = 'normal';
    this.difficultyMultipliers = {
      easy: { hp: 0.7, damage: 0.5, speed: 0.8, dropRate: 1.5 },
      normal: { hp: 1.0, damage: 1.0, speed: 1.0, dropRate: 1.0 },
      hard: { hp: 1.5, damage: 1.5, speed: 1.2, dropRate: 0.7 },
      hell: { hp: 2.0, damage: 2.0, speed: 1.5, dropRate: 0.5 }
    };
    
    this.mode = 'story';
    this.currentLevel = 1;
    this.waveIndex = 0;
    this.waveTimer = 0;
    this.bossActive = false;
    this.bossWarningTimer = 0;
    
    this.endlessWave = 0;
    this.endlessWaveTimer = 0;
    this.endlessSpawnTimer = 0;
    
    this.screenShake = 0;
    this.screenShakeIntensity = 0;
    this.slowMotion = 1;
    
    this.stars = [];
    this.dataStreams = [];
    
    this.player = null;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.powerUps = [];
    this.particles = [];
    this.boss = null;
    
    this.bulletPool = [];
    this.enemyBulletPool = [];
    this.particlePool = [];
    this.enemyPool = [];
    this.powerUpPool = [];
    
    this.particleSystem = null;
    this.collisionSystem = null;
    this.weaponSystem = null;
    this.audioSystem = null;
    this.uiSystem = null;
    
    this.saveData = this.loadSaveData();
    this.initBackground();
    this.initPools();
  }

  initBackground() {
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Utils.rand(0, this.width),
        y: Utils.rand(0, this.height),
        size: Utils.rand(0.5, 2),
        speed: Utils.rand(20, 80),
        brightness: Utils.rand(0.3, 1)
      });
    }
    
    for (let i = 0; i < 15; i++) {
      this.dataStreams.push({
        x: Utils.rand(0, this.width),
        y: Utils.rand(-this.height, 0),
        speed: Utils.rand(50, 150),
        length: Utils.rand(30, 100),
        opacity: Utils.rand(0.1, 0.3),
        width: Utils.rand(1, 3)
      });
    }
  }

  initPools() {
    for (let i = 0; i < 200; i++) {
      const b = new Bullet();
      b.active = false;
      this.bulletPool.push(b);
    }
    
    for (let i = 0; i < 300; i++) {
      const b = new Bullet();
      b.active = false;
      this.enemyBulletPool.push(b);
    }
    
    for (let i = 0; i < 300; i++) {
      const p = new Particle();
      p.active = false;
      this.particlePool.push(p);
    }
    
    for (let i = 0; i < 50; i++) {
      const e = new Enemy();
      e.active = false;
      this.enemyPool.push(e);
    }
    
    for (let i = 0; i < 20; i++) {
      const p = new PowerUp();
      p.active = false;
      this.powerUpPool.push(p);
    }
  }

  startGame(mode, level = 1) {
    this.mode = mode;
    this.currentLevel = level;
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.kills = 0;
    this.gameTime = 0;
    this.waveIndex = 0;
    this.waveTimer = 0;
    this.bossActive = false;
    this.bossWarningTimer = 0;
    this.screenShake = 0;
    this.slowMotion = 1;
    this.endlessWave = 0;
    this.endlessSpawnTimer = 2;
    
    this.clearEntities();
    
    this.player = new Player();
    this.player.init(this.width / 2, this.height - 100, this);
    
    this.state = GameState.PLAYING;
    
    if (this.audioSystem) {
      this.audioSystem.playBGM('battle');
    }
  }

  clearEntities() {
    this.bullets.forEach(b => b.active = false);
    this.enemyBullets.forEach(b => b.active = false);
    this.enemies.forEach(e => e.active = false);
    this.powerUps.forEach(p => p.active = false);
    this.particles.forEach(p => p.active = false);
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.powerUps = [];
    this.particles = [];
    this.boss = null;
  }

  pause() {
    if (this.state === GameState.PLAYING) {
      this.previousState = this.state;
      this.state = GameState.PAUSED;
      Input.clear();
    }
  }

  resume() {
    if (this.state === GameState.PAUSED) {
      this.state = this.previousState;
      this.lastTime = performance.now();
    }
  }

  gameOver() {
    this.state = GameState.GAME_OVER;
    this.updateHighScore();
    this.saveGame();
    if (this.audioSystem) {
      this.audioSystem.stopBGM();
    }
  }

  victory() {
    this.state = GameState.VICTORY;
    this.updateHighScore();
    this.saveGame();
    if (this.audioSystem) {
      this.audioSystem.stopBGM();
    }
  }

  goToMenu() {
    this.state = GameState.MENU;
    this.clearEntities();
    this.player = null;
    Input.clear();
    if (this.audioSystem) {
      this.audioSystem.playBGM('menu');
    }
  }

  addScore(points) {
    const multiplier = 1 + this.combo * 0.2;
    const finalPoints = Math.floor(points * Math.min(multiplier, 5));
    this.score += finalPoints;
    return finalPoints;
  }

  addCombo() {
    this.combo = Math.min(this.combo + 1, 20);
    this.comboTimer = 2;
  }

  resetCombo() {
    this.combo = 0;
    this.comboTimer = 0;
  }

  spawnBullet(x, y, vx, vy, damage, type = 'normal', isPlayer = true, options = {}) {
    const pool = isPlayer ? this.bulletPool : this.enemyBulletPool;
    const list = isPlayer ? this.bullets : this.enemyBullets;
    
    let bullet = pool.find(b => !b.active);
    if (!bullet) {
      bullet = new Bullet();
      pool.push(bullet);
    }
    
    bullet.init(x, y, vx, vy, damage, type, options);
    bullet.isPlayer = isPlayer;
    bullet.game = this;
    list.push(bullet);
    return bullet;
  }

  spawnEnemy(type, x, y, options = {}) {
    let enemy = this.enemyPool.find(e => !e.active);
    if (!enemy) {
      enemy = new Enemy();
      this.enemyPool.push(enemy);
    }
    
    const config = EnemyTypes[type] || EnemyTypes.small;
    const diffMult = this.difficultyMultipliers[this.difficulty] || {};
    
    enemy.init(x, y, {
      ...config,
      hp: Math.floor(config.hp * (diffMult.hp || 1)),
      speed: config.speed * (diffMult.speed || 1),
      ...options
    }, this);
    
    this.enemies.push(enemy);
    return enemy;
  }

  spawnPowerUp(x, y, type = 'weapon') {
    let powerUp = this.powerUpPool.find(p => !p.active);
    if (!powerUp) {
      powerUp = new PowerUp();
      this.powerUpPool.push(powerUp);
    }
    
    powerUp.init(x, y, type, this);
    this.powerUps.push(powerUp);
    return powerUp;
  }

  spawnParticle(x, y, options = {}) {
    let particle = this.particlePool.find(p => !p.active);
    if (!particle) {
      particle = new Particle();
      this.particlePool.push(particle);
    }
    
    particle.init(x, y, options);
    this.particles.push(particle);
    return particle;
  }

  spawnExplosion(x, y, size = 'medium', color = '#ff6600') {
    const counts = { small: 8, medium: 15, large: 30, huge: 50 };
    const speeds = { small: 50, medium: 100, large: 200, huge: 300 };
    const sizes = { small: 3, medium: 5, large: 8, huge: 12 };
    
    const count = counts[size] || 15;
    const speed = speeds[size] || 100;
    const pSize = sizes[size] || 5;
    
    for (let i = 0; i < count; i++) {
      const angle = Utils.rand(0, Math.PI * 2);
      const spd = Utils.rand(speed * 0.3, speed);
      this.spawnParticle(x, y, {
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: Utils.rand(0.3, 0.8),
        size: Utils.rand(pSize * 0.5, pSize),
        color: color,
        glow: true,
        shrink: true
      });
    }
    
    this.addScreenShake(size === 'huge' ? 15 : size === 'large' ? 8 : size === 'medium' ? 4 : 2);
    
    if (this.audioSystem) {
      this.audioSystem.playExplosion(size);
    }
  }

  addScreenShake(intensity) {
    this.screenShake = Math.max(this.screenShake, intensity);
    this.screenShakeIntensity = intensity;
  }

  spawnBoss(type) {
    const bossConfig = BossTypes[type];
    if (!bossConfig) return;
    
    this.bossWarningTimer = 2;
    this.state = GameState.BOSS_WARNING;
    this.bossType = type;
    
    if (this.uiSystem) {
      this.uiSystem.showBossWarning();
    }
    
    if (this.audioSystem) {
      this.audioSystem.playBossWarning();
    }
  }

  activateBoss() {
    const bossConfig = BossTypes[this.bossType];
    if (!bossConfig) return;
    
    const diffMult = this.difficultyMultipliers[this.difficulty] || {};
    
    this.boss = new Boss();
    this.boss.init(
      this.width / 2,
      -100,
      {
        ...bossConfig,
        hp: Math.floor(bossConfig.hp * (diffMult.hp || 1)),
        maxHp: Math.floor(bossConfig.hp * (diffMult.hp || 1))
      },
      this
    );
    
    this.bossActive = true;
    this.state = GameState.PLAYING;
    
    if (this.uiSystem) {
      this.uiSystem.showBossBar(bossConfig.name);
    }
    
    if (this.audioSystem) {
      this.audioSystem.playBGM('boss');
    }
  }

  updateBackground(dt) {
    this.stars.forEach(star => {
      star.y += star.speed * dt;
      if (star.y > this.height) {
        star.y = -5;
        star.x = Utils.rand(0, this.width);
      }
    });
    
    this.dataStreams.forEach(stream => {
      stream.y += stream.speed * dt;
      if (stream.y > this.height + stream.length) {
        stream.y = -stream.length;
        stream.x = Utils.rand(0, this.width);
      }
    });
  }

  update(dt) {
    if (this.state !== GameState.PLAYING && this.state !== GameState.BOSS_WARNING) {
      this.updateBackground(dt * 0.3);
      return;
    }
    
    const scaledDt = dt * this.slowMotion;
    this.gameTime += scaledDt;
    
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }
    
    if (this.screenShake > 0) {
      this.screenShake -= dt * 30;
      if (this.screenShake < 0) this.screenShake = 0;
    }
    
    if (this.state === GameState.BOSS_WARNING) {
      this.bossWarningTimer -= dt;
      if (this.bossWarningTimer <= 0) {
        this.activateBoss();
      }
      this.updateBackground(dt);
      if (this.player) {
        this.player.update(scaledDt);
      }
      return;
    }
    
    this.updateBackground(dt);
    
    if (this.player && this.player.active) {
      this.player.update(scaledDt);
    }
    
    if (this.mode === 'story') {
      this.updateStoryMode(scaledDt);
    } else if (this.mode === 'endless') {
      this.updateEndlessMode(scaledDt);
    } else if (this.mode === 'bullet') {
      this.updateBulletHellMode(scaledDt);
    }
    
    this.enemies.forEach(enemy => {
      if (enemy.active) enemy.update(scaledDt);
    });
    
    if (this.boss && this.boss.active) {
      this.boss.update(scaledDt);
    }
    
    this.bullets.forEach(bullet => {
      if (bullet.active) bullet.update(scaledDt);
    });
    
    this.enemyBullets.forEach(bullet => {
      if (bullet.active) bullet.update(scaledDt);
    });
    
    this.powerUps.forEach(powerUp => {
      if (powerUp.active) powerUp.update(scaledDt);
    });
    
    this.particles.forEach(particle => {
      if (particle.active) particle.update(scaledDt);
    });
    
    if (this.collisionSystem) {
      this.collisionSystem.checkAllCollisions();
    }
    
    this.cleanupEntities();
    
    if (Input.isPausePressed()) {
      if (!this.pauseKeyPressed) {
        this.pauseKeyPressed = true;
        this.pause();
      }
    } else {
      this.pauseKeyPressed = false;
    }
  }

  updateStoryMode(dt) {
    const levelConfig = Levels[this.currentLevel];
    if (!levelConfig) {
      this.victory();
      return;
    }
    
    if (this.bossActive) {
      if (!this.boss || !this.boss.active) {
        this.onBossDefeated();
      }
      return;
    }
    
    this.waveTimer -= dt;
    
    if (this.waveTimer <= 0 && this.waveIndex < levelConfig.waves.length) {
      this.spawnWave(levelConfig.waves[this.waveIndex]);
      this.waveIndex++;
      this.waveTimer = levelConfig.waveInterval || 3;
    }
    
    if (this.waveIndex >= levelConfig.waves.length && 
        this.enemies.filter(e => e.active).length === 0 && 
        !this.bossActive) {
      if (levelConfig.boss) {
        this.spawnBoss(levelConfig.boss);
      } else {
        this.victory();
      }
    }
  }

  updateEndlessMode(dt) {
    if (this.bossActive) {
      if (!this.boss || !this.boss.active) {
        this.onBossDefeated();
        this.endlessWave++;
      }
      return;
    }
    
    this.endlessSpawnTimer -= dt;
    
    if (this.endlessSpawnTimer <= 0) {
      const wave = Math.floor(this.gameTime / 30);
      const count = Math.min(3 + wave, 10);
      
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (this.state === GameState.PLAYING) {
            const types = ['small', 'small', 'medium', 'suicide'];
            if (wave > 3) types.push('large');
            if (wave > 5) types.push('elite');
            
            const type = types[Utils.randInt(0, types.length - 1)];
            const x = Utils.rand(50, this.width - 50);
            this.spawnEnemy(type, x, -30 - Math.random() * 100);
          }
        }, i * 300);
      }
      
      this.endlessSpawnTimer = Math.max(2, 5 - wave * 0.3);
    }
    
    if (this.endlessWave > 0 && this.endlessWave % 5 === 0 && !this.bossActive) {
      const bossTypes = ['scout', 'battleship'];
      const bossIndex = Math.min(Math.floor(this.endlessWave / 5) - 1, bossTypes.length - 1);
      this.spawnBoss(bossTypes[bossIndex]);
    }
  }

  updateBulletHellMode(dt) {
    if (this.bossActive) {
      if (!this.boss || !this.boss.active) {
        this.endlessWave++;
        this.spawnBoss('bullet' + (this.endlessWave % 3));
      }
    } else {
      this.spawnBoss('bullet0');
    }
  }

  spawnWave(wave) {
    wave.enemies.forEach(enemyDef => {
      const count = enemyDef.count || 1;
      const type = enemyDef.type;
      
      for (let i = 0; i < count; i++) {
        let x, y;
        
        if (enemyDef.pattern === 'line') {
          const spacing = enemyDef.spacing || 50;
          const totalWidth = (count - 1) * spacing;
          x = (this.width - totalWidth) / 2 + i * spacing;
          y = -30 - i * 20;
        } else if (enemyDef.pattern === 'vshape') {
          const mid = (count - 1) / 2;
          const offset = Math.abs(i - mid) * 30;
          x = this.width / 2 + (i - mid) * 40;
          y = -30 - offset;
        } else {
          x = enemyDef.x !== undefined ? enemyDef.x : Utils.rand(50, this.width - 50);
          y = enemyDef.y !== undefined ? enemyDef.y : -30;
        }
        
        setTimeout(() => {
          if (this.state === GameState.PLAYING || this.state === GameState.BOSS_WARNING) {
            this.spawnEnemy(type, x, y, enemyDef.options);
          }
        }, (enemyDef.delay || 0) + i * (enemyDef.interval || 100));
      }
    });
  }

  onBossDefeated() {
    this.bossActive = false;
    this.boss = null;
    
    if (this.uiSystem) {
      this.uiSystem.hideBossBar();
    }
    
    if (this.audioSystem && this.mode !== 'bullet') {
      this.audioSystem.playBGM('battle');
    }
    
    if (this.mode === 'story') {
      if (this.currentLevel >= Object.keys(Levels).length) {
        this.victory();
      }
    }
  }

  cleanupEntities() {
    this.bullets = this.bullets.filter(b => b.active);
    this.enemyBullets = this.enemyBullets.filter(b => b.active);
    this.enemies = this.enemies.filter(e => e.active);
    this.powerUps = this.powerUps.filter(p => p.active);
    this.particles = this.particles.filter(p => p.active);
  }

  render() {
    const ctx = this.ctx;
    
    ctx.save();
    
    if (this.screenShake > 0) {
      const shakeX = Utils.rand(-this.screenShake, this.screenShake);
      const shakeY = Utils.rand(-this.screenShake, this.screenShake);
      ctx.translate(shakeX, shakeY);
    }
    
    this.renderBackground();
    
    if (this.state === GameState.MENU) {
      ctx.restore();
      return;
    }
    
    this.powerUps.forEach(powerUp => {
      if (powerUp.active) powerUp.render(ctx);
    });
    
    this.enemies.forEach(enemy => {
      if (enemy.active) enemy.render(ctx);
    });
    
    if (this.boss && this.boss.active) {
      this.boss.render(ctx);
    }
    
    if (this.player && this.player.active) {
      this.player.render(ctx);
    }
    
    this.bullets.forEach(bullet => {
      if (bullet.active) bullet.render(ctx);
    });
    
    this.enemyBullets.forEach(bullet => {
      if (bullet.active) bullet.render(ctx);
    });
    
    this.particles.forEach(particle => {
      if (particle.active) particle.render(ctx);
    });
    
    ctx.restore();
  }

  renderBackground() {
    const ctx = this.ctx;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#050814');
    gradient.addColorStop(0.5, '#0a1628');
    gradient.addColorStop(1, '#0d1f3c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    
    ctx.save();
    this.dataStreams.forEach(stream => {
      const grad = ctx.createLinearGradient(stream.x, stream.y, stream.x, stream.y + stream.length);
      grad.addColorStop(0, `rgba(0, 245, 255, 0)`);
      grad.addColorStop(0.5, `rgba(0, 245, 255, ${stream.opacity})`);
      grad.addColorStop(1, `rgba(0, 245, 255, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(stream.x, stream.y, stream.width, stream.length);
    });
    ctx.restore();
    
    this.stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
    });
  }

  loadSaveData() {
    try {
      const data = localStorage.getItem('cyberStrikeSave');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    
    return {
      version: 1,
      highScores: {
        story: {},
        endless: 0,
        bullet: 0
      },
      unlockedLevels: 1,
      levelStars: {},
      settings: {
        bgmVolume: 0.5,
        sfxVolume: 0.7,
        difficulty: 'normal',
        screenShake: true
      }
    };
  }

  saveGame() {
    try {
      localStorage.setItem('cyberStrikeSave', JSON.stringify(this.saveData));
    } catch (e) {}
  }

  updateHighScore() {
    if (this.mode === 'story') {
      const levelKey = 'level' + this.currentLevel;
      if (!this.saveData.highScores.story[levelKey] || 
          this.score > this.saveData.highScores.story[levelKey]) {
        this.saveData.highScores.story[levelKey] = this.score;
      }
      
      if (this.state === GameState.VICTORY) {
        const stars = this.calculateStars();
        const levelKey = 'level' + this.currentLevel;
        if (!this.saveData.levelStars[levelKey] || 
            stars > this.saveData.levelStars[levelKey]) {
          this.saveData.levelStars[levelKey] = stars;
        }
        
        if (this.currentLevel >= this.saveData.unlockedLevels) {
          this.saveData.unlockedLevels = Math.min(
            this.currentLevel + 1,
            Object.keys(Levels).length
          );
        }
      }
    } else if (this.mode === 'endless') {
      if (this.score > this.saveData.highScores.endless) {
        this.saveData.highScores.endless = this.score;
      }
    } else if (this.mode === 'bullet') {
      if (this.score > this.saveData.highScores.bullet) {
        this.saveData.highScores.bullet = this.score;
      }
    }
  }

  calculateStars() {
    let stars = 1;
    if (this.player && this.player.health >= this.player.maxHealth * 0.5) {
      stars = 2;
    }
    if (this.player && this.player.health >= this.player.maxHealth * 0.8) {
      stars = 3;
    }
    return stars;
  }

  getHighScore() {
    if (this.mode === 'story') {
      const levelKey = 'level' + this.currentLevel;
      return this.saveData.highScores.story[levelKey] || 0;
    } else if (this.mode === 'endless') {
      return this.saveData.highScores.endless || 0;
    } else {
      return this.saveData.highScores.bullet || 0;
    }
  }

  gameLoop(currentTime) {
    this.dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    
    this.update(this.dt);
    this.render();
    
    if (this.uiSystem) {
      this.uiSystem.update(this.dt);
    }
    
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
    
    if (this.audioSystem) {
      this.audioSystem.playBGM('menu');
    }
  }
}
