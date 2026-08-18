class WeaponSystem {
  constructor() {
    this.player = null;
    this.game = null;
    this.currentWeapon = 'laser';
    this.weaponLevel = 1;
    this.maxLevel = 5;
    this.fireTimer = 0;
    this.fireRate = 0.2;
    this.baseDamage = 6;
  }

  init(player, game) {
    this.player = player;
    this.game = game;
    this.currentWeapon = 'laser';
    this.weaponLevel = 1;
    this.fireTimer = 0;
    this.updateFireRate();
  }

  update(dt) {
    if (!this.player || !this.player.active) return;
    
    this.fireTimer -= dt;
    
    if (Input.isShooting() && this.fireTimer <= 0) {
      this.fire();
      this.fireTimer = this.fireRate;
    }
  }

  fire() {
    if (!this.game) return;
    
    const weapon = Weapons[this.currentWeapon];
    if (!weapon) return;
    
    const level = this.weaponLevel;
    const damage = this.baseDamage * weapon.damageMult * (1 + (level - 1) * 0.3);
    
    const firePatterns = {
      laser: () => this.fireLaser(level, damage),
      spread: () => this.fireSpread(level, damage),
      tracking: () => this.fireTracking(level, damage),
      plasma: () => this.firePlasma(level, damage),
      shock: () => this.fireShock(level, damage)
    };
    
    const pattern = firePatterns[this.currentWeapon];
    if (pattern) pattern();
    
    if (this.game.audioSystem) {
      this.game.audioSystem.playShoot(this.currentWeapon);
    }
  }

  fireLaser(level, damage) {
    const bulletSpeed = 600;
    const offsets = [];
    
    if (level >= 1) offsets.push(0);
    if (level >= 2) offsets.push(-10, 10);
    if (level >= 3) offsets.push(-20, 20);
    if (level >= 4) offsets.push(-15, 15);
    if (level >= 5) offsets.push(-25, 25);
    
    offsets.forEach(offset => {
      this.game.spawnBullet(
        this.player.x + offset,
        this.player.y - this.player.height / 2,
        0, -bulletSpeed,
        damage, 'laser', true,
        { size: 4 + level * 0.5 }
      );
    });
  }

  fireSpread(level, damage) {
    const bulletSpeed = 500;
    let bulletCount = 3 + level;
    let spreadAngle = Math.PI * (0.2 + level * 0.05);
    
    for (let i = 0; i < bulletCount; i++) {
      const t = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
      const angle = -Math.PI / 2 - spreadAngle / 2 + t * spreadAngle;
      const vx = Math.cos(angle) * bulletSpeed;
      const vy = Math.sin(angle) * bulletSpeed;
      
      this.game.spawnBullet(
        this.player.x,
        this.player.y - this.player.height / 2,
        vx, vy,
        damage, 'spread', true,
        { size: 3 + level * 0.3 }
      );
    }
  }

  fireTracking(level, damage) {
    const bulletSpeed = 400;
    const count = 1 + Math.floor(level / 2);
    const offsets = [];
    
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 15;
      offsets.push(offset);
    }
    
    let target = this.findNearestEnemy();
    
    offsets.forEach(offset => {
      const bullet = this.game.spawnBullet(
        this.player.x + offset,
        this.player.y - this.player.height / 2,
        0, -bulletSpeed,
        damage, 'tracking', true,
        { size: 4 + level * 0.5, tracking: true, turnRate: 3 + level * 0.5 }
      );
      
      if (bullet && target) {
        bullet.trackTarget = target;
      }
    });
  }

  firePlasma(level, damage) {
    const bulletSpeed = 350;
    const count = 1 + Math.floor((level - 1) / 2);
    const spacing = 20;
    
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * spacing;
      
      this.game.spawnBullet(
        this.player.x + offset,
        this.player.y - this.player.height / 2,
        0, -bulletSpeed,
        damage * 1.5, 'plasma', true,
        { 
          size: 6 + level, 
          piercing: true, 
          maxPierce: 3 + level 
        }
      );
    }
  }

  fireShock(level, damage) {
    const bulletSpeed = 300;
    
    if (level % 2 === 1) {
      this.game.spawnBullet(
        this.player.x,
        this.player.y - this.player.height / 2,
        0, -bulletSpeed,
        damage * 2, 'shock', true,
        { size: 8 + level * 2 }
      );
    } else {
      this.game.spawnBullet(
        this.player.x - 15,
        this.player.y - this.player.height / 2,
        0, -bulletSpeed,
        damage * 1.5, 'shock', true,
        { size: 6 + level }
      );
      this.game.spawnBullet(
        this.player.x + 15,
        this.player.y - this.player.height / 2,
        0, -bulletSpeed,
        damage * 1.5, 'shock', true,
        { size: 6 + level }
      );
    }
  }

  findNearestEnemy() {
    let nearest = null;
    let nearestDist = Infinity;
    
    this.game.enemies.forEach(enemy => {
      if (!enemy.active) return;
      const dist = Utils.distance(this.player.x, this.player.y, enemy.x, enemy.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    });
    
    if (this.game.boss && this.game.boss.active) {
      const dist = Utils.distance(this.player.x, this.player.y, this.game.boss.x, this.game.boss.y);
      if (dist < nearestDist) {
        nearest = this.game.boss;
      }
    }
    
    return nearest;
  }

  upgradeWeapon() {
    if (this.weaponLevel < this.maxLevel) {
      this.weaponLevel++;
      this.updateFireRate();
      
      if (this.game && this.game.particleSystem) {
        this.game.particleSystem.spawnText(
          this.player.x, this.player.y - 30,
          'LV UP!',
          '#ffff00',
          16
        );
      }
    } else {
      if (this.game) {
        this.game.addScore(200);
        if (this.game.particleSystem) {
          this.game.particleSystem.spawnText(
            this.player.x, this.player.y - 30,
            '+200',
            '#ffff00',
            14
          );
        }
      }
    }
  }

  downgradeWeapon() {
    if (this.weaponLevel > 1) {
      this.weaponLevel--;
      this.updateFireRate();
    }
  }

  changeWeapon(weaponType) {
    if (Weapons[weaponType]) {
      this.currentWeapon = weaponType;
      this.weaponLevel = 1;
      this.updateFireRate();
    }
  }

  updateFireRate() {
    const weapon = Weapons[this.currentWeapon];
    if (weapon) {
      this.fireRate = weapon.fireRate * (1 - (this.weaponLevel - 1) * 0.1);
      this.fireRate = Math.max(this.fireRate, 0.05);
    }
  }

  getWeaponName() {
    const weapon = Weapons[this.currentWeapon];
    return weapon ? weapon.name : 'LASER';
  }

  getWeaponIcon() {
    const weapon = Weapons[this.currentWeapon];
    return weapon ? weapon.icon : '⚡';
  }
}
