class Enemy {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.width = 30;
    this.height = 30;
    this.radius = 15;
    this.speed = 100;
    this.hp = 1;
    this.maxHp = 1;
    this.score = 100;
    this.type = 'small';
    this.game = null;
    this.shootTimer = 0;
    this.shootInterval = 2;
    this.movePattern = 'straight';
    this.shootPattern = 'single';
    this.age = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.color = '#ff6600';
    this.damage = 1;
    this.dropRate = 0.2;
    this.hitFlash = 0;
  }

  init(x, y, config, game) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.game = game;
    this.active = true;
    this.age = 0;
    this.hitFlash = 0;
    
    this.width = config.width || 30;
    this.height = config.height || 30;
    this.radius = Math.min(this.width, this.height) / 2;
    this.speed = config.speed || 100;
    this.hp = config.hp || 1;
    this.maxHp = this.hp;
    this.score = config.score || 100;
    this.type = config.type || 'small';
    this.shootInterval = config.shootInterval || 2;
    this.movePattern = config.movePattern || 'straight';
    this.shootPattern = config.shootPattern || 'single';
    this.color = config.color || '#ff6600';
    this.damage = config.damage || 1;
    this.dropRate = config.dropRate || 0.2;
    
    this.shootTimer = Utils.rand(0.5, this.shootInterval);
  }

  update(dt) {
    if (!this.active) return;
    
    this.age += dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
    
    this.updateMovement(dt);
    this.updateShooting(dt);
    
    if (this.y > this.game.height + 50) {
      this.active = false;
    }
  }

  updateMovement(dt) {
    switch (this.movePattern) {
      case 'straight':
        this.y += this.speed * dt;
        break;
        
      case 'sine':
        this.y += this.speed * dt;
        this.x = this.initialX + Math.sin(this.age * 3) * 50;
        break;
        
      case 'zigzag':
        this.y += this.speed * dt;
        const zigzagPhase = Math.floor(this.age * 2) % 2;
        this.x += (zigzagPhase === 0 ? 1 : -1) * this.speed * 0.5 * dt;
        break;
        
      case 'dive':
        this.y += this.speed * dt;
        if (this.game.player && this.game.player.active) {
          const dx = this.game.player.x - this.x;
          this.x += Utils.clamp(dx, -50, 50) * dt;
        }
        break;
        
      case 'spiral':
        this.y += this.speed * 0.5 * dt;
        const spiralR = 40;
        this.x = this.initialX + Math.cos(this.age * 4) * spiralR;
        break;
        
      case 'hover':
        if (this.y < 100) {
          this.y += this.speed * dt;
        } else {
          this.x = this.initialX + Math.sin(this.age * 2) * 80;
        }
        break;
        
      case 'charge':
        if (this.game.player && this.game.player.active && this.y < 200) {
          this.y += this.speed * 0.3 * dt;
          this.x += Utils.clamp(this.game.player.x - this.x, -30, 30) * dt;
        } else {
          this.y += this.speed * 2 * dt;
        }
        break;
        
      default:
        this.y += this.speed * dt;
    }
  }

  updateShooting(dt) {
    if (this.y < 0) return;
    
    this.shootTimer -= dt;
    if (this.shootTimer <= 0) {
      this.shoot();
      this.shootTimer = this.shootInterval;
    }
  }

  shoot() {
    if (!this.game) return;
    
    const bulletSpeed = 200;
    const damage = this.damage;
    
    switch (this.shootPattern) {
      case 'single':
        this.game.spawnBullet(
          this.x, this.y + this.height / 2,
          0, bulletSpeed,
          damage, 'enemyBullet', false
        );
        break;
        
      case 'spread':
        const spreadAngles = [-0.3, -0.15, 0, 0.15, 0.3];
        spreadAngles.forEach(angle => {
          const vx = Math.sin(angle) * bulletSpeed;
          const vy = Math.cos(angle) * bulletSpeed;
          this.game.spawnBullet(
            this.x, this.y + this.height / 2,
            vx, vy,
            damage, 'enemyBullet', false
          );
        });
        break;
        
      case 'aimed':
        if (this.game.player && this.game.player.active) {
          const angle = Utils.angle(this.x, this.y, this.game.player.x, this.game.player.y);
          const vx = Math.cos(angle) * bulletSpeed * 1.2;
          const vy = Math.sin(angle) * bulletSpeed * 1.2;
          this.game.spawnBullet(
            this.x, this.y + this.height / 2,
            vx, vy,
            damage, 'enemyBullet', false
          );
        }
        break;
        
      case 'circle':
        const count = 8;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const vx = Math.cos(angle) * bulletSpeed * 0.8;
          const vy = Math.sin(angle) * bulletSpeed * 0.8;
          this.game.spawnBullet(
            this.x, this.y,
            vx, vy,
            damage, 'enemyBullet', false
          );
        }
        break;
        
      case 'double':
        this.game.spawnBullet(
          this.x - 10, this.y + this.height / 2,
          0, bulletSpeed,
          damage, 'enemyBullet', false
        );
        this.game.spawnBullet(
          this.x + 10, this.y + this.height / 2,
          0, bulletSpeed,
          damage, 'enemyBullet', false
        );
        break;
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 1;
    
    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.active = false;
    
    if (!this.game) return;
    
    const size = this.type === 'large' || this.type === 'elite' ? 'large' : 
                 this.type === 'medium' ? 'medium' : 'small';
    this.game.spawnExplosion(this.x, this.y, size, this.color);
    
    this.game.addScore(this.score);
    this.game.addCombo();
    this.game.kills++;
    
    if (this.game.player && this.game.player.active) {
      this.game.player.addSkillEnergy(1);
    }
    
    if (Math.random() < this.dropRate * (this.game.difficultyMultipliers[this.game.difficulty]?.dropRate || 1)) {
      const powerUpTypes = [
        { value: 'weapon', weight: 30 },
        { value: 'shield', weight: 15 },
        { value: 'health', weight: 10 },
        { value: 'bomb', weight: 8 },
        { value: 'score', weight: 25 },
        { value: 'skill', weight: 12 }
      ];
      const type = Utils.weightedRandom(powerUpTypes);
      this.game.spawnPowerUp(this.x, this.y, type);
    }
  }

  render(ctx) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    if (this.hitFlash > 0) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
    }
    
    const w = this.width / 2;
    const h = this.height / 2;
    
    if (this.type === 'small') {
      this.renderSmall(ctx, w, h);
    } else if (this.type === 'medium') {
      this.renderMedium(ctx, w, h);
    } else if (this.type === 'large') {
      this.renderLarge(ctx, w, h);
    } else if (this.type === 'elite') {
      this.renderElite(ctx, w, h);
    } else if (this.type === 'suicide') {
      this.renderSuicide(ctx, w, h);
    } else {
      this.renderSmall(ctx, w, h);
    }
    
    if (this.hp < this.maxHp) {
      const barWidth = this.width;
      const barHeight = 3;
      const hpPercent = this.hp / this.maxHp;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(-barWidth / 2, -h - 8, barWidth, barHeight);
      
      ctx.fillStyle = hpPercent > 0.5 ? '#00ff88' : hpPercent > 0.25 ? '#ffff00' : '#ff0040';
      ctx.fillRect(-barWidth / 2, -h - 8, barWidth * hpPercent, barHeight);
    }
    
    ctx.restore();
  }

  renderSmall(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w, -h * 0.5);
    ctx.lineTo(-w * 0.3, -h);
    ctx.lineTo(w * 0.3, -h);
    ctx.lineTo(w, -h * 0.5);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#4a2a2a');
    grad.addColorStop(1, '#8a4a4a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  renderMedium(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.6, h * 0.3);
    ctx.lineTo(-w, -h * 0.2);
    ctx.lineTo(-w * 0.5, -h);
    ctx.lineTo(w * 0.5, -h);
    ctx.lineTo(w, -h * 0.2);
    ctx.lineTo(w * 0.6, h * 0.3);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#5a3a2a');
    grad.addColorStop(1, '#9a6a4a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.fillStyle = this.color;
    ctx.fillRect(-w * 0.7, -h * 0.3, w * 0.3, h * 0.2);
    ctx.fillRect(w * 0.4, -h * 0.3, w * 0.3, h * 0.2);
    
    ctx.beginPath();
    ctx.arc(0, -h * 0.2, w * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0040';
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  renderLarge(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.8, h * 0.5);
    ctx.lineTo(-w, 0);
    ctx.lineTo(-w * 0.8, -h * 0.5);
    ctx.lineTo(-w * 0.4, -h);
    ctx.lineTo(w * 0.4, -h);
    ctx.lineTo(w * 0.8, -h * 0.5);
    ctx.lineTo(w, 0);
    ctx.lineTo(w * 0.8, h * 0.5);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#4a3a4a');
    grad.addColorStop(0.5, '#7a5a7a');
    grad.addColorStop(1, '#4a3a4a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = this.color;
    ctx.fillRect(-w * 0.9, -h * 0.1, w * 0.25, h * 0.2);
    ctx.fillRect(w * 0.65, -h * 0.1, w * 0.25, h * 0.2);
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  renderElite(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.5, h * 0.7);
    ctx.lineTo(-w, h * 0.2);
    ctx.lineTo(-w * 0.7, -h * 0.5);
    ctx.lineTo(-w * 0.3, -h);
    ctx.lineTo(w * 0.3, -h);
    ctx.lineTo(w * 0.7, -h * 0.5);
    ctx.lineTo(w, h * 0.2);
    ctx.lineTo(w * 0.5, h * 0.7);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#3a4a5a');
    grad.addColorStop(0.5, '#6a8aaa');
    grad.addColorStop(1, '#3a4a5a');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = this.hitFlash > 0 ? '#ffffff' : '#00f5ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#00f5ff';
    ctx.shadowBlur = 12;
    ctx.fill();
    
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, -h * 0.3);
    ctx.lineTo(-w * 0.6, 0);
    ctx.lineTo(-w * 0.3, h * 0.3);
    ctx.moveTo(w * 0.3, -h * 0.3);
    ctx.lineTo(w * 0.6, 0);
    ctx.lineTo(w * 0.3, h * 0.3);
    ctx.stroke();
  }

  renderSuicide(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(-w * 0.8, 0);
    ctx.lineTo(-w * 0.5, -h);
    ctx.lineTo(w * 0.5, -h);
    ctx.lineTo(w * 0.8, 0);
    ctx.closePath();
    
    const pulse = 0.7 + Math.sin(this.age * 8) * 0.3;
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, `rgba(255, 0, 0, ${pulse})`);
    grad.addColorStop(1, '#880000');
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : grad;
    ctx.fill();
    
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10 * pulse;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.fill();
  }
}
