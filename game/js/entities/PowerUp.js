const PowerUpTypes = {
  weapon: {
    color: '#00f5ff',
    icon: '⚡',
    weight: 30
  },
  shield: {
    color: '#00ff88',
    icon: '◇',
    weight: 20
  },
  health: {
    color: '#ff0040',
    icon: '♥',
    weight: 15
  },
  bomb: {
    color: '#ff8800',
    icon: '◆',
    weight: 10
  },
  score: {
    color: '#ffff00',
    icon: '★',
    weight: 25
  },
  skill: {
    color: '#bf00ff',
    icon: '◎',
    weight: 15
  },
  slow: {
    color: '#88ddff',
    icon: '◐',
    weight: 5
  }
};

class PowerUp {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.type = 'weapon';
    this.width = 24;
    this.height = 24;
    this.radius = 12;
    this.game = null;
    this.bobOffset = 0;
    this.bobSpeed = 3;
    this.rotationSpeed = 2;
    this.rotation = 0;
    this.pulsePhase = 0;
    this.color = '#00f5ff';
    this.icon = '⚡';
    this.magnetRange = 100;
    this.magnetSpeed = 200;
  }

  init(x, y, type = 'weapon', game = null) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.game = game;
    this.vx = 0;
    this.vy = 60;
    this.active = true;
    this.bobOffset = Math.random() * Math.PI * 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.pulsePhase = 0;
    
    const typeData = PowerUpTypes[type] || PowerUpTypes.weapon;
    this.color = typeData.color;
    this.icon = typeData.icon;
  }

  update(dt) {
    if (!this.active) return;
    
    this.bobOffset += this.bobSpeed * dt;
    this.rotation += this.rotationSpeed * dt;
    this.pulsePhase += dt * 4;
    
    if (this.game && this.game.player && this.game.player.active) {
      const dist = Utils.distance(this.x, this.y, this.game.player.x, this.game.player.y);
      if (dist < this.magnetRange) {
        const angle = Utils.angle(this.x, this.y, this.game.player.x, this.game.player.y);
        const magnetForce = (1 - dist / this.magnetRange) * this.magnetSpeed;
        this.vx += Math.cos(angle) * magnetForce * dt;
        this.vy += Math.sin(angle) * magnetForce * dt;
      }
    }
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    if (this.game && this.y > this.game.height + 30) {
      this.active = false;
    }
  }

  apply(player) {
    if (!this.active) return;
    
    switch (this.type) {
      case 'weapon':
        if (player.weaponSystem) {
          player.weaponSystem.upgradeWeapon();
        }
        break;
      case 'shield':
        player.addShield();
        break;
      case 'health':
        player.heal(1);
        break;
      case 'bomb':
        if (this.game) {
          this.game.slowMotion = 0.3;
          setTimeout(() => {
            if (this.game) this.game.slowMotion = 1;
          }, 500);
          
          this.game.enemyBullets.forEach(b => {
            if (b.active) {
              b.active = false;
              this.game.spawnExplosion(b.x, b.y, 'small', '#ff0040');
            }
          });
          
          this.game.enemies.forEach(e => {
            if (e.active) {
              e.takeDamage(100);
            }
          });
          
          if (this.game.boss && this.game.boss.active) {
            this.game.boss.takeDamage(50);
          }
          
          this.game.addScreenShake(10);
        }
        break;
      case 'score':
        if (this.game) {
          this.game.addScore(500);
        }
        break;
      case 'skill':
        player.addSkillEnergy(30);
        break;
      case 'slow':
        if (this.game) {
          this.game.slowMotion = 0.5;
          setTimeout(() => {
            if (this.game) this.game.slowMotion = 1;
          }, 5000);
        }
        break;
    }
    
    this.active = false;
    
    if (this.game) {
      for (let i = 0; i < 10; i++) {
        const angle = Utils.rand(0, Math.PI * 2);
        const speed = Utils.rand(50, 150);
        this.game.spawnParticle(this.x, this.y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Utils.rand(0.3, 0.6),
          size: Utils.rand(2, 5),
          color: this.color,
          glow: true,
          shrink: true
        });
      }
      
      if (this.game.audioSystem) {
        this.game.audioSystem.playPickup();
      }
    }
  }

  render(ctx) {
    if (!this.active) return;
    
    const bobY = Math.sin(this.bobOffset) * 3;
    const pulse = 1 + Math.sin(this.pulsePhase) * 0.1;
    
    ctx.save();
    ctx.translate(this.x, this.y + bobY);
    ctx.rotate(this.rotation);
    ctx.scale(pulse, pulse);
    
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const r = this.radius;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    
    ctx.fillStyle = this.color + '40';
    ctx.fill();
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.rotate(-this.rotation);
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 5;
    ctx.fillText(this.icon, 0, 1);
    
    ctx.restore();
  }
}
