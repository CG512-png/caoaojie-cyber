class Boss {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.width = 120;
    this.height = 100;
    this.radius = 50;
    this.speed = 50;
    this.hp = 500;
    this.maxHp = 500;
    this.score = 5000;
    this.type = 'scout';
    this.name = 'BOSS';
    this.game = null;
    this.age = 0;
    this.phase = 0;
    this.phaseCount = 3;
    this.attackTimer = 0;
    this.attackPatternIndex = 0;
    this.entering = true;
    this.targetY = 80;
    this.moveAngle = 0;
    this.moveTimer = 0;
    this.hitFlash = 0;
    this.phases = [];
    this.currentPatternTime = 0;
    this.patternDuration = 5;
    this.initialX = 0;
  }

  init(x, y, config, game) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.game = game;
    this.active = true;
    this.age = 0;
    this.phase = 0;
    this.attackTimer = 2;
    this.attackPatternIndex = 0;
    this.entering = true;
    this.hitFlash = 0;
    this.moveAngle = 0;
    this.moveTimer = 0;
    this.currentPatternTime = 0;
    
    this.width = config.width || 120;
    this.height = config.height || 100;
    this.radius = Math.min(this.width, this.height) / 2;
    this.speed = config.speed || 50;
    this.hp = config.hp || 500;
    this.maxHp = config.maxHp || this.hp;
    this.score = config.score || 5000;
    this.type = config.type || 'scout';
    this.name = config.name || 'BOSS';
    this.targetY = config.targetY || 80;
    this.phases = config.phases || [];
    this.phaseCount = this.phases.length || 3;
  }

  update(dt) {
    if (!this.active) return;
    
    this.age += dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
    
    if (this.entering) {
      this.y += 60 * dt;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.entering = false;
      }
      return;
    }
    
    this.checkPhaseTransition();
    this.updateMovement(dt);
    this.updateAttacks(dt);
  }

  checkPhaseTransition() {
    if (this.phases.length === 0) return;
    
    const hpPercent = this.hp / this.maxHp;
    let newPhase = 0;
    
    for (let i = 0; i < this.phases.length; i++) {
      const phase = this.phases[i];
      if (hpPercent <= (phase.hpPercent || 0)) {
        newPhase = i + 1;
      }
    }
    
    newPhase = Math.min(newPhase, this.phases.length - 1);
    
    if (newPhase !== this.phase) {
      this.phase = newPhase;
      this.onPhaseChange();
    }
  }

  onPhaseChange() {
    this.currentPatternTime = 0;
    this.attackPatternIndex = 0;
    
    if (this.game) {
      this.game.addScreenShake(15);
      this.game.spawnExplosion(this.x, this.y, 'large', '#ff00ff');
      
      for (let i = 0; i < 30; i++) {
        const angle = Utils.rand(0, Math.PI * 2);
        const speed = Utils.rand(100, 250);
        this.game.spawnParticle(this.x, this.y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Utils.rand(0.5, 1),
          size: Utils.rand(4, 8),
          color: '#ff00ff',
          glow: true,
          shrink: true
        });
      }
    }
  }

  updateMovement(dt) {
    const phase = this.phases[this.phase] || {};
    const movePattern = phase.movePattern || 'sine';
    
    this.moveTimer += dt;
    
    switch (movePattern) {
      case 'sine':
        this.x = this.game.width / 2 + Math.sin(this.moveTimer * 0.8) * (this.game.width * 0.3);
        break;
        
      case 'fast':
        this.moveAngle += dt * 2;
        this.x = this.game.width / 2 + Math.cos(this.moveAngle) * (this.game.width * 0.35);
        this.y = this.targetY + Math.sin(this.moveAngle * 2) * 30;
        break;
        
      case 'hover':
        this.x = this.game.width / 2 + Math.sin(this.moveTimer * 0.5) * 50;
        break;
        
      case 'chase':
        if (this.game.player && this.game.player.active) {
          const dx = this.game.player.x - this.x;
          this.x += Utils.clamp(dx, -80, 80) * dt;
        }
        break;
    }
    
    this.x = Utils.clamp(this.x, this.width / 2 + 20, this.game.width - this.width / 2 - 20);
  }

  updateAttacks(dt) {
    const phase = this.phases[this.phase] || {};
    const patterns = phase.patterns || ['spread'];
    
    this.currentPatternTime += dt;
    this.attackTimer -= dt;
    
    if (this.currentPatternTime >= this.patternDuration) {
      this.currentPatternTime = 0;
      this.attackPatternIndex = (this.attackPatternIndex + 1) % patterns.length;
    }
    
    if (this.attackTimer <= 0) {
      const pattern = patterns[this.attackPatternIndex];
      this.executeAttackPattern(pattern);
      this.attackTimer = phase.fireRate || 0.8;
    }
  }

  executeAttackPattern(pattern) {
    if (!this.game) return;
    
    const bulletSpeed = 220;
    const damage = 1;
    
    switch (pattern) {
      case 'spread':
        this.patternSpread(bulletSpeed, damage);
        break;
      case 'circle':
        this.patternCircle(bulletSpeed, damage);
        break;
      case 'spiral':
        this.patternSpiral(bulletSpeed, damage);
        break;
      case 'spiralDual':
        this.patternSpiralDual(bulletSpeed, damage);
        break;
      case 'spiralTriple':
        this.patternSpiralTriple(bulletSpeed, damage);
        break;
      case 'aimed':
        this.patternAimed(bulletSpeed * 1.5, damage);
        break;
      case 'laser':
        this.patternLaser(damage);
        break;
      case 'rain':
        this.patternRain(bulletSpeed, damage);
        break;
      case 'cross':
        this.patternCross(bulletSpeed, damage);
        break;
      case 'wave':
        this.patternWave(bulletSpeed, damage);
        break;
      case 'hexagon':
        this.patternHexagon(bulletSpeed, damage);
        break;
      case 'starburst':
        this.patternStarburst(bulletSpeed, damage);
        break;
      default:
        this.patternSpread(bulletSpeed, damage);
    }
  }

  patternSpread(speed, damage) {
    const count = 7;
    const spreadAngle = Math.PI * 0.6;
    const startAngle = Math.PI / 2 - spreadAngle / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = startAngle + (i / (count - 1)) * spreadAngle;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.game.spawnBullet(
        this.x, this.y + this.height / 2,
        vx, vy,
        damage, 'enemyBullet', false,
        { size: 5 }
      );
    }
  }

  patternCircle(speed, damage) {
    const count = 16;
    const offset = this.age * 2;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + offset;
      const vx = Math.cos(angle) * speed * 0.7;
      const vy = Math.sin(angle) * speed * 0.7;
      this.game.spawnBullet(
        this.x, this.y,
        vx, vy,
        damage, 'enemyBullet', false,
        { size: 4 }
      );
    }
  }

  patternSpiral(speed, damage) {
    const arms = 3;
    const offset = this.age * 3;
    
    for (let i = 0; i < arms; i++) {
      const angle = (i / arms) * Math.PI * 2 + offset;
      const vx = Math.cos(angle) * speed * 0.8;
      const vy = Math.sin(angle) * speed * 0.8;
      this.game.spawnBullet(
        this.x, this.y,
        vx, vy,
        damage, 'enemyBullet', false,
        { size: 5 }
      );
    }
  }

  patternAimed(speed, damage) {
    if (!this.game.player || !this.game.player.active) return;
    
    const count = 3;
    const spread = 0.15;
    const baseAngle = Utils.angle(this.x, this.y, this.game.player.x, this.game.player.y);
    
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - 1) * spread;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.game.spawnBullet(
        this.x, this.y + this.height / 2,
        vx, vy,
        damage, 'enemyBullet', false,
        { size: 6 }
      );
    }
  }

  patternLaser(damage) {
    if (!this.game.player || !this.game.player.active) return;
    
    this.game.spawnBullet(
      this.x, this.y + this.height / 2,
      0, 400,
      damage * 2, 'enemyBullet', false,
      { size: 10, color: '#ff0040', life: 3 }
    );
    
    this.game.addScreenShake(5);
  }

  patternRain(speed, damage) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const offsetX = Utils.rand(-this.width / 2, this.width / 2);
      this.game.spawnBullet(
        this.x + offsetX, this.y + this.height / 2,
        Utils.rand(-30, 30), speed,
        damage, 'enemyBullet', false,
        { size: 4 }
      );
    }
  }

  patternCross(speed, damage) {
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0.7, y: 0.7 },
      { x: -0.7, y: 0.7 },
      { x: 0.7, y: -0.7 },
      { x: -0.7, y: -0.7 }
    ];
    
    directions.forEach(dir => {
      this.game.spawnBullet(
        this.x, this.y,
        dir.x * speed * 0.8, dir.y * speed * 0.8,
        damage, 'enemyBullet', false,
        { size: 5 }
      );
    });
  }

  patternWave(speed, damage) {
    const count = 10;
    const waveOffset = this.age * 5;
    
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const xOffset = (t - 0.5) * this.width * 1.2;
      const yOffset = Math.sin(t * Math.PI * 2 + waveOffset) * 20;
      
      this.game.spawnBullet(
        this.x + xOffset, this.y + yOffset + this.height / 2,
        0, speed * 0.8,
        damage, 'enemyBullet', false,
        { size: 4 }
      );
    }
  }

  patternSpiralDual(speed, damage) {
    const arms = 6;
    const offset = this.age * 4;
    
    for (let i = 0; i < arms; i++) {
      const angle1 = (i / arms) * Math.PI * 2 + offset;
      const angle2 = (i / arms) * Math.PI * 2 + offset + Math.PI / arms;
      
      this.game.spawnBullet(
        this.x, this.y,
        Math.cos(angle1) * speed * 0.9,
        Math.sin(angle1) * speed * 0.9,
        damage, 'enemyBullet', false,
        { size: 5 }
      );
      this.game.spawnBullet(
        this.x, this.y,
        Math.cos(angle2) * speed * 0.7,
        Math.sin(angle2) * speed * 0.7,
        damage, 'enemyBullet', false,
        { size: 4 }
      );
    }
  }

  patternSpiralTriple(speed, damage) {
    const arms = 8;
    const offset = this.age * 5;
    
    for (let i = 0; i < arms; i++) {
      for (let j = 0; j < 3; j++) {
        const angle = (i / arms) * Math.PI * 2 + offset + (j * Math.PI / (arms * 1.5));
        const spd = speed * (0.6 + j * 0.2);
        
        this.game.spawnBullet(
          this.x, this.y,
          Math.cos(angle) * spd,
          Math.sin(angle) * spd,
          damage, 'enemyBullet', false,
          { size: 4 + j }
        );
      }
    }
  }

  patternHexagon(speed, damage) {
    const rings = 3;
    const bulletsPerRing = 12;
    
    for (let r = 0; r < rings; r++) {
      const ringOffset = r * Math.PI / bulletsPerRing;
      const ringSpeed = speed * (0.7 + r * 0.15);
      
      for (let i = 0; i < bulletsPerRing; i++) {
        const angle = (i / bulletsPerRing) * Math.PI * 2 + ringOffset;
        this.game.spawnBullet(
          this.x, this.y,
          Math.cos(angle) * ringSpeed,
          Math.sin(angle) * ringSpeed,
          damage, 'enemyBullet', false,
          { size: 4 + r }
        );
      }
    }
  }

  patternStarburst(speed, damage) {
    const layers = 5;
    const baseCount = 8;
    
    for (let layer = 0; layer < layers; layer++) {
      const count = baseCount + layer * 4;
      const offset = this.age * (2 + layer) + layer * 0.3;
      const layerSpeed = speed * (0.5 + layer * 0.15);
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + offset;
        this.game.spawnBullet(
          this.x, this.y,
          Math.cos(angle) * layerSpeed,
          Math.sin(angle) * layerSpeed,
          damage, 'enemyBullet', false,
          { size: 3 + layer * 0.5 }
        );
      }
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 1;
    
    if (this.game && this.game.uiSystem) {
      this.game.uiSystem.updateBossHP(this.hp / this.maxHp);
    }
    
    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.active = false;
    
    if (!this.game) return;
    
    this.game.spawnExplosion(this.x, this.y, 'huge', '#ff00ff');
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (this.game && this.game.state === GameState.PLAYING) {
          const offsetX = Utils.rand(-this.width / 2, this.width / 2);
          const offsetY = Utils.rand(-this.height / 2, this.height / 2);
          this.game.spawnExplosion(this.x + offsetX, this.y + offsetY, 'large', '#ff8800');
        }
      }, i * 150);
    }
    
    this.game.addScore(this.score);
    this.game.kills++;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (this.game) {
          const types = ['weapon', 'shield', 'health', 'bomb', 'score', 'skill'];
          const type = types[Utils.randInt(0, types.length - 1)];
          const offsetX = Utils.rand(-50, 50);
          this.game.spawnPowerUp(this.x + offsetX, this.y, type);
        }
      }, i * 100);
    }
    
    if (this.game.audioSystem) {
      this.game.audioSystem.playBossExplosion();
    }
    
    setTimeout(() => {
      if (this.game) {
        this.game.onBossDefeated();
      }
    }, 2000);
  }

  render(ctx) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    if (this.hitFlash > 0) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 30;
    } else {
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 20;
    }
    
    const w = this.width / 2;
    const h = this.height / 2;
    
    if (this.type === 'scout') {
      this.renderScout(ctx, w, h);
    } else if (this.type === 'battleship') {
      this.renderBattleship(ctx, w, h);
    } else if (this.type === 'carrier') {
      this.renderCarrier(ctx, w, h);
    } else if (this.type === 'fortress') {
      this.renderFortress(ctx, w, h);
    } else if (this.type === 'final') {
      this.renderFinal(ctx, w, h);
    } else if (this.type.startsWith('bullet')) {
      this.renderBulletHell(ctx, w, h);
    } else {
      this.renderScout(ctx, w, h);
    }
    
    ctx.restore();
  }

  renderScout(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.5, h * 0.5);
    ctx.lineTo(-w, 0);
    ctx.lineTo(-w * 0.7, -h * 0.5);
    ctx.lineTo(-w * 0.3, -h);
    ctx.lineTo(w * 0.3, -h);
    ctx.lineTo(w * 0.7, -h * 0.5);
    ctx.lineTo(w, 0);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#4a2a5a');
    grad.addColorStop(0.5, '#7a4a9a');
    grad.addColorStop(1, '#4a2a5a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = '#bf00ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.fill();
    
    ctx.fillStyle = '#ff0040';
    ctx.fillRect(-w * 0.8, h * 0.2, w * 0.25, h * 0.3);
    ctx.fillRect(w * 0.55, h * 0.2, w * 0.25, h * 0.3);
  }

  renderBattleship(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.6, h * 0.7);
    ctx.lineTo(-w, h * 0.3);
    ctx.lineTo(-w * 0.8, -h * 0.2);
    ctx.lineTo(-w * 0.6, -h * 0.7);
    ctx.lineTo(-w * 0.2, -h);
    ctx.lineTo(w * 0.2, -h);
    ctx.lineTo(w * 0.6, -h * 0.7);
    ctx.lineTo(w * 0.8, -h * 0.2);
    ctx.lineTo(w, h * 0.3);
    ctx.lineTo(w * 0.6, h * 0.7);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#3a3a5a');
    grad.addColorStop(0.5, '#6a6a9a');
    grad.addColorStop(1, '#3a3a5a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = '#8888ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#ff0040';
    ctx.fillRect(-w * 0.9, -h * 0.3, w * 0.2, h * 0.6);
    ctx.fillRect(w * 0.7, -h * 0.3, w * 0.2, h * 0.6);
    ctx.fillRect(-w * 0.3, -h * 0.5, w * 0.15, h * 0.4);
    ctx.fillRect(w * 0.15, -h * 0.5, w * 0.15, h * 0.4);
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  renderCarrier(ctx, w, h) {
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : '#4a4a3a';
    ctx.fillRect(-w, -h * 0.3, w * 2, h * 0.6);
    
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w, -h * 0.3, w * 2, h * 0.6);
    
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(-w * 0.3, -h, w * 0.6, h * 0.7);
    ctx.strokeRect(-w * 0.3, -h, w * 0.6, h * 0.7);
    
    ctx.fillStyle = '#ff0040';
    for (let i = 0; i < 4; i++) {
      const x = -w * 0.7 + i * w * 0.5;
      ctx.fillRect(x, -h * 0.1, w * 0.15, h * 0.2);
    }
    
    ctx.beginPath();
    ctx.arc(0, -h * 0.6, w * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#ff8800';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  renderFortress(ctx, w, h) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? w : w * 0.7;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    grad.addColorStop(0, '#8a6a4a');
    grad.addColorStop(1, '#4a3a2a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0040';
    ctx.shadowBlur = 15;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.fill();
  }

  renderFinal(ctx, w, h) {
    const pulse = 0.8 + Math.sin(this.age * 3) * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.8, h * 0.6);
    ctx.lineTo(-w, h * 0.2);
    ctx.lineTo(-w * 0.9, -h * 0.3);
    ctx.lineTo(-w * 0.7, -h * 0.7);
    ctx.lineTo(-w * 0.3, -h);
    ctx.lineTo(w * 0.3, -h);
    ctx.lineTo(w * 0.7, -h * 0.7);
    ctx.lineTo(w * 0.9, -h * 0.3);
    ctx.lineTo(w, h * 0.2);
    ctx.lineTo(w * 0.8, h * 0.6);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#5a2a7a');
    grad.addColorStop(0.5, '#9a4aaa');
    grad.addColorStop(1, '#5a2a7a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20 * pulse;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.25 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 30;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff';
    ctx.fill();
    
    ctx.fillStyle = '#ff0040';
    ctx.shadowBlur = 10;
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + this.age;
      const x = Math.cos(angle) * w * 0.6;
      const y = Math.sin(angle) * w * 0.6;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderBulletHell(ctx, w, h) {
    const pulse = 0.8 + Math.sin(this.age * 4) * 0.2;
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.8 * pulse, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.8);
    grad.addColorStop(0, '#ff4466');
    grad.addColorStop(0.7, '#aa2244');
    grad.addColorStop(1, '#661122');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = '#ff0040';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 25;
    ctx.stroke();
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + this.age * 2;
      const x = Math.cos(angle) * w * 0.5;
      const y = Math.sin(angle) * w * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, w * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffff00';
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.fill();
  }
}
