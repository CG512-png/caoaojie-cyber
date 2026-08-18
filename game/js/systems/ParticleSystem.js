class ParticleSystem {
  constructor(game) {
    this.game = game;
  }

  spawnExplosion(x, y, size = 'medium', color = '#ff6600') {
    const configs = {
      small: { count: 8, speed: 80, size: 3, shake: 2 },
      medium: { count: 15, speed: 120, size: 5, shake: 5 },
      large: { count: 25, speed: 180, size: 8, shake: 10 },
      huge: { count: 40, speed: 250, size: 12, shake: 15 }
    };
    
    const config = configs[size] || configs.medium;
    
    for (let i = 0; i < config.count; i++) {
      const angle = Utils.rand(0, Math.PI * 2);
      const speed = Utils.rand(config.speed * 0.3, config.speed);
      this.game.spawnParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Utils.rand(0.3, 0.8),
        size: Utils.rand(config.size * 0.5, config.size),
        color: color,
        glow: true,
        shrink: true
      });
    }
    
    for (let i = 0; i < config.count * 0.5; i++) {
      const angle = Utils.rand(0, Math.PI * 2);
      const speed = Utils.rand(config.speed * 0.1, config.speed * 0.5);
      this.game.spawnParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Utils.rand(0.5, 1.2),
        size: Utils.rand(config.size * 0.3, config.size * 0.7),
        color: '#888888',
        friction: 0.95,
        shrink: true
      });
    }
    
    this.game.addScreenShake(config.shake);
  }

  spawnHitEffect(x, y, color = '#ffff00') {
    for (let i = 0; i < 5; i++) {
      const angle = Utils.rand(0, Math.PI * 2);
      const speed = Utils.rand(30, 80);
      this.game.spawnParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Utils.rand(0.15, 0.3),
        size: Utils.rand(2, 4),
        color: color,
        glow: true,
        shrink: true
      });
    }
  }

  spawnText(x, y, text, color = '#ffff00', size = 14) {
    this.game.spawnParticle(x, y, {
      type: 'text',
      text: text,
      vy: -60,
      life: 0.8,
      size: size,
      color: color,
      glow: true
    });
  }

  spawnTrail(x, y, color = '#00f5ff') {
    this.game.spawnParticle(x, y, {
      vx: Utils.rand(-10, 10),
      vy: Utils.rand(20, 50),
      life: Utils.rand(0.2, 0.4),
      size: Utils.rand(2, 4),
      color: color,
      glow: true,
      shrink: true
    });
  }

  spawnShieldBreak(x, y) {
    for (let i = 0; i < 20; i++) {
      const angle = Utils.rand(0, Math.PI * 2);
      const speed = Utils.rand(50, 150);
      this.game.spawnParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Utils.rand(0.3, 0.6),
        size: Utils.rand(3, 6),
        color: '#00ff88',
        glow: true,
        shrink: true
      });
    }
  }

  spawnCollectEffect(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 100;
      this.game.spawnParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4,
        size: 3,
        color: color,
        glow: true,
        shrink: true
      });
    }
  }
}
