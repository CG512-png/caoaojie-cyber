class Particle {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.life = 1;
    this.maxLife = 1;
    this.size = 5;
    this.initialSize = 5;
    this.color = '#ffffff';
    this.glow = false;
    this.shrink = false;
    this.gravity = 0;
    this.friction = 1;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.type = 'normal';
  }

  init(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.ax = options.ax || 0;
    this.ay = options.ay || 0;
    this.life = options.life || 1;
    this.maxLife = this.life;
    this.size = options.size || 5;
    this.initialSize = this.size;
    this.color = options.color || '#ffffff';
    this.glow = options.glow || false;
    this.shrink = options.shrink || false;
    this.gravity = options.gravity || 0;
    this.friction = options.friction || 1;
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
    this.type = options.type || 'normal';
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return;
    }
    
    this.vx += this.ax * dt;
    this.vy += (this.ay + this.gravity) * dt;
    
    this.vx *= this.friction;
    this.vy *= this.friction;
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    this.rotation += this.rotationSpeed * dt;
    
    if (this.shrink) {
      const t = this.life / this.maxLife;
      this.size = this.initialSize * t;
    }
  }

  render(ctx) {
    if (!this.active) return;
    
    const alpha = this.life / this.maxLife;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
    }
    
    if (this.type === 'text') {
      ctx.font = `bold ${this.size}px Orbitron, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = this.color;
      ctx.fillText(this.text || '', 0, 0);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    ctx.restore();
  }
}
