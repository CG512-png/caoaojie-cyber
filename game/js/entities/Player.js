class Player {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.width = 40;
    this.height = 50;
    this.hitboxRadius = 4;
    this.pickupRadius = 25;
    this.speed = 260;
    this.health = 3;
    this.maxHealth = 3;
    this.shield = 0;
    this.maxShield = 1;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.skillEnergy = 0;
    this.maxSkillEnergy = 100;
    this.skillActive = false;
    this.skillTimer = 0;
    this.skillCooldown = 0;
    this.weaponSystem = null;
    this.game = null;
    this.engineFlameTimer = 0;
    this.thrusterParticles = [];
    this.flickerTimer = 0;
    this.moveTarget = null;
  }

  init(x, y, game) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.active = true;
    this.health = 2;
    this.maxHealth = 3;
    this.shield = 0;
    this.maxShield = 1;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.skillEnergy = 0;
    this.maxSkillEnergy = 200;
    this.skillActive = false;
    this.skillTimer = 0;
    this.skillCooldown = 0;
    this.flickerTimer = 0;
    
    this.weaponSystem = new WeaponSystem();
    this.weaponSystem.init(this, game);
  }

  update(dt) {
    if (!this.active) return;
    
    this.updateMovement(dt);
    
    if (this.invincible) {
      this.invincibleTimer -= dt;
      this.flickerTimer += dt * 20;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
        this.flickerTimer = 0;
      }
    }
    
    if (this.skillActive) {
      this.skillTimer -= dt;
      if (this.skillTimer <= 0) {
        this.skillActive = false;
      }
    }
    
    if (this.skillCooldown > 0) {
      this.skillCooldown -= dt;
    }
    
    this.engineFlameTimer += dt * 30;
    
    this.updateThrusterParticles(dt);
    
    if (this.weaponSystem) {
      this.weaponSystem.update(dt);
    }
    
    if (Input.isSkillPressed() && this.skillEnergy >= this.maxSkillEnergy && this.skillCooldown <= 0) {
      this.activateSkill();
    }
    
    this.x = Utils.clamp(this.x, this.width / 2, this.game.width - this.width / 2);
    this.y = Utils.clamp(this.y, this.height / 2, this.game.height - this.height / 2);
  }

  updateMovement(dt) {
    const axisX = Input.getHorizontalAxis();
    const axisY = Input.getVerticalAxis();
    
    if (axisX !== 0 || axisY !== 0) {
      this.x += axisX * this.speed * dt;
      this.y += axisY * this.speed * dt;
    }
    
    const target = Input.getMoveTarget();
    if (target.active) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        const moveSpeed = Math.min(this.speed * 1.5, dist * 10);
        this.x += (dx / dist) * moveSpeed * dt;
        this.y += (dy / dist) * moveSpeed * dt;
      }
    }
  }

  updateThrusterParticles(dt) {
    if (Math.random() < 0.5) {
      const offsetX = Utils.rand(-5, 5);
      this.game.spawnParticle(
        this.x + offsetX,
        this.y + this.height / 2,
        {
          vx: Utils.rand(-20, 20),
          vy: Utils.rand(100, 200),
          life: Utils.rand(0.1, 0.3),
          size: Utils.rand(2, 5),
          color: Math.random() < 0.5 ? '#00f5ff' : '#ffffff',
          glow: true,
          shrink: true
        }
      );
    }
  }

  activateSkill() {
    if (this.skillEnergy < this.maxSkillEnergy) return;
    
    this.skillEnergy = 0;
    this.skillActive = true;
    this.skillTimer = 3;
    this.skillCooldown = 5;
    this.invincible = true;
    this.invincibleTimer = 3;
    
    if (this.game) {
      this.game.slowMotion = 0.2;
      setTimeout(() => {
        if (this.game) this.game.slowMotion = 1;
      }, 300);
      
      this.game.addScreenShake(20);
      
      this.game.enemyBullets.forEach(b => {
        if (b.active) {
          b.active = false;
          this.game.spawnExplosion(b.x, b.y, 'small', '#ff00ff');
        }
      });
      
      this.game.enemies.forEach(e => {
        if (e.active) {
          e.takeDamage(200);
        }
      });
      
      if (this.game.boss && this.game.boss.active) {
        this.game.boss.takeDamage(100);
      }
      
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const speed = Utils.rand(200, 400);
        this.game.spawnParticle(this.x, this.y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Utils.rand(0.5, 1),
          size: Utils.rand(4, 8),
          color: '#bf00ff',
          glow: true,
          shrink: true
        });
      }
      
      if (this.game.audioSystem) {
        this.game.audioSystem.playSkill();
      }
    }
  }

  takeDamage(amount = 1) {
    if (this.invincible) return false;
    
    if (this.shield > 0) {
      this.shield--;
      this.invincible = true;
      this.invincibleTimer = 0.5;
      
      if (this.game) {
        this.game.addScreenShake(5);
        for (let i = 0; i < 15; i++) {
          const angle = Utils.rand(0, Math.PI * 2);
          const speed = Utils.rand(50, 150);
          this.game.spawnParticle(this.x, this.y, {
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
      return false;
    }
    
    this.health -= amount;
    this.invincible = true;
    this.invincibleTimer = 1;
    
    if (this.game) {
      this.game.resetCombo();
      this.game.addScreenShake(10);
      
      if (this.weaponSystem) {
        this.weaponSystem.downgradeWeapon();
        this.weaponSystem.downgradeWeapon();
      }
      
      if (this.game.audioSystem) {
        this.game.audioSystem.playHit();
      }
    }
    
    if (this.health <= 0) {
      this.die();
      return true;
    }
    
    return false;
  }

  die() {
    this.active = false;
    
    if (this.game) {
      this.game.spawnExplosion(this.x, this.y, 'huge', '#00f5ff');
      this.game.addScreenShake(20);
      
      setTimeout(() => {
        if (this.game) {
          this.game.gameOver();
        }
      }, 1000);
    }
  }

  heal(amount = 1) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  addShield() {
    this.shield = Math.min(this.shield + 1, this.maxShield);
  }

  addSkillEnergy(amount) {
    this.skillEnergy = Math.min(this.skillEnergy + amount, this.maxSkillEnergy);
  }

  getHitbox() {
    return {
      x: this.x - this.hitboxRadius,
      y: this.y - this.hitboxRadius,
      width: this.hitboxRadius * 2,
      height: this.hitboxRadius * 2
    };
  }

  getPickupBox() {
    return {
      x: this.x - this.pickupRadius,
      y: this.y - this.pickupRadius,
      width: this.pickupRadius * 2,
      height: this.pickupRadius * 2
    };
  }

  render(ctx) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    if (this.invincible && Math.floor(this.flickerTimer) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }
    
    if (this.shield > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.pickupRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    if (this.skillActive) {
      ctx.beginPath();
      ctx.arc(0, 0, this.pickupRadius + 15, 0, Math.PI * 2);
      ctx.strokeStyle = '#bf00ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#bf00ff';
      ctx.shadowBlur = 20;
      ctx.stroke();
    }
    
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 15;
    
    const w = this.width / 2;
    const h = this.height / 2;
    
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(-w * 0.3, -h * 0.3);
    ctx.lineTo(-w, h * 0.5);
    ctx.lineTo(-w * 0.5, h * 0.3);
    ctx.lineTo(-w * 0.3, h);
    ctx.lineTo(w * 0.3, h);
    ctx.lineTo(w * 0.5, h * 0.3);
    ctx.lineTo(w, h * 0.5);
    ctx.lineTo(w * 0.3, -h * 0.3);
    ctx.closePath();
    
    const bodyGradient = ctx.createLinearGradient(0, -h, 0, h);
    bodyGradient.addColorStop(0, '#1a3a5c');
    bodyGradient.addColorStop(0.5, '#2a5a8c');
    bodyGradient.addColorStop(1, '#1a3a5c');
    ctx.fillStyle = bodyGradient;
    ctx.fill();
    
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.6);
    ctx.lineTo(-w * 0.15, 0);
    ctx.lineTo(w * 0.15, 0);
    ctx.closePath();
    ctx.fillStyle = '#00f5ff';
    ctx.shadowBlur = 10;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, -h * 0.3, w * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.fill();
    
    const flameSize = 8 + Math.sin(this.engineFlameTimer) * 3;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, h);
    ctx.lineTo(0, h + flameSize);
    ctx.lineTo(w * 0.2, h);
    ctx.closePath();
    const flameGradient = ctx.createLinearGradient(0, h, 0, h + flameSize);
    flameGradient.addColorStop(0, '#00f5ff');
    flameGradient.addColorStop(0.5, '#ffffff');
    flameGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGradient;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 15;
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-w * 0.1, h);
    ctx.lineTo(0, h + flameSize * 0.7);
    ctx.lineTo(w * 0.1, h);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.restore();
    
    if (this.game && this.game.saveData.settings.showHitbox) {
      ctx.save();
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.hitboxRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
