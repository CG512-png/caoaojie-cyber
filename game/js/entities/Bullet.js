class Bullet {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.damage = 1;
    this.type = 'normal';
    this.isPlayer = true;
    this.width = 6;
    this.height = 15;
    this.radius = 4;
    this.color = '#00f5ff';
    this.trailColor = 'rgba(0, 245, 255, 0.5)';
    this.piercing = false;
    this.pierceCount = 0;
    this.maxPierce = 3;
    this.tracking = false;
    this.trackTarget = null;
    this.turnRate = 3;
    this.life = 5;
    this.trailTimer = 0;
    this.rotation = -Math.PI / 2;
    this.size = 4;
  }

  init(x, y, vx, vy, damage, type = 'normal', options = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.type = type;
    this.active = true;
    this.life = options.life || 5;
    this.piercing = options.piercing || false;
    this.maxPierce = options.maxPierce || 3;
    this.pierceCount = 0;
    this.tracking = options.tracking || false;
    this.turnRate = options.turnRate || 3;
    this.size = options.size || 4;
    this.radius = this.size;
    this.width = this.size * 1.5;
    this.height = this.size * 2.5;
    
    if (type === 'laser') {
      this.color = '#00f5ff';
      this.trailColor = 'rgba(0, 245, 255, 0.6)';
      this.piercing = true;
      this.maxPierce = 10;
    } else if (type === 'spread') {
      this.color = '#ffff00';
      this.trailColor = 'rgba(255, 255, 0, 0.5)';
    } else if (type === 'tracking') {
      this.color = '#ff00ff';
      this.trailColor = 'rgba(255, 0, 255, 0.5)';
      this.tracking = true;
    } else if (type === 'plasma') {
      this.color = '#00ff88';
      this.trailColor = 'rgba(0, 255, 136, 0.5)';
      this.piercing = true;
      this.maxPierce = 5;
    } else if (type === 'shock') {
      this.color = '#ff8800';
      this.trailColor = 'rgba(255, 136, 0, 0.5)';
      this.size = 8;
    } else if (type === 'enemy') {
      this.color = '#ff0040';
      this.trailColor = 'rgba(255, 0, 64, 0.5)';
    } else if (type === 'enemyBullet') {
      this.color = '#ff0040';
      this.trailColor = 'rgba(255, 0, 64, 0.5)';
    }
    
    if (options.color) {
      this.color = options.color;
      this.trailColor = options.trailColor || this.color + '80';
    }
    
    this.rotation = Math.atan2(vy, vx);
  }

  update(dt) {
    if (!this.active) return;
    
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return;
    }
    
    if (this.tracking && this.trackTarget && this.trackTarget.active) {
      const angleToTarget = Math.atan2(
        this.trackTarget.y - this.y,
        this.trackTarget.x - this.x
      );
      
      const currentAngle = Math.atan2(this.vy, this.vx);
      let angleDiff = angleToTarget - currentAngle;
      
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      
      const turnAmount = this.turnRate * dt;
      const newAngle = currentAngle + Utils.clamp(angleDiff, -turnAmount, turnAmount);
      
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.vx = Math.cos(newAngle) * speed;
      this.vy = Math.sin(newAngle) * speed;
    }
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation = Math.atan2(this.vy, this.vx);
    
    const game = this.game || null;
    if (game) {
      if (this.x < -50 || this.x > game.width + 50 ||
          this.y < -50 || this.y > game.height + 50) {
        this.active = false;
      }
    }
  }

  onHit() {
    if (this.piercing) {
      this.pierceCount++;
      if (this.pierceCount >= this.maxPierce) {
        this.active = false;
      }
    } else {
      this.active = false;
    }
  }

  render(ctx) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation + Math.PI / 2);
    
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    
    if (this.type === 'laser') {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size * 0.3, -this.size * 2, this.size * 0.6, this.size * 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-this.size * 0.1, -this.size * 2, this.size * 0.2, this.size * 4);
    } else if (this.type === 'plasma') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else if (this.type === 'shock') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.5);
      ctx.lineTo(-this.size * 0.6, this.size);
      ctx.lineTo(this.size * 0.6, this.size);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(-this.size * 0.3, this.size * 0.5);
      ctx.lineTo(this.size * 0.3, this.size * 0.5);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    
    ctx.restore();
  }
}
