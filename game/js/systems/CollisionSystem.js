class CollisionSystem {
  constructor(game) {
    this.game = game;
  }

  checkAllCollisions() {
    this.checkPlayerBulletsVsEnemies();
    this.checkPlayerBulletsVsBoss();
    this.checkEnemyBulletsVsPlayer();
    this.checkEnemiesVsPlayer();
    this.checkPowerUpsVsPlayer();
  }

  checkPlayerBulletsVsEnemies() {
    const bullets = this.game.bullets;
    const enemies = this.game.enemies;
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (!bullet.active || !bullet.isPlayer) continue;
      
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (!enemy.active) continue;
        
        if (this.bulletVsEnemy(bullet, enemy)) {
          enemy.takeDamage(bullet.damage);
          bullet.onHit();
          
          if (this.game.particleSystem) {
            this.game.particleSystem.spawnHitEffect(bullet.x, bullet.y, '#ffff00');
          }
          
          if (!bullet.piercing) break;
        }
      }
    }
  }

  checkPlayerBulletsVsBoss() {
    if (!this.game.boss || !this.game.boss.active) return;
    
    const bullets = this.game.bullets;
    const boss = this.game.boss;
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (!bullet.active || !bullet.isPlayer) continue;
      
      if (this.bulletVsBoss(bullet, boss)) {
        boss.takeDamage(bullet.damage);
        bullet.onHit();
        
        if (this.game.particleSystem) {
          this.game.particleSystem.spawnHitEffect(bullet.x, bullet.y, '#ff00ff');
        }
      }
    }
  }

  checkEnemyBulletsVsPlayer() {
    if (!this.game.player || !this.game.player.active) return;
    if (this.game.player.invincible) return;
    
    const bullets = this.game.enemyBullets;
    const player = this.game.player;
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (!bullet.active || bullet.isPlayer) continue;
      
      if (this.bulletVsPlayer(bullet, player)) {
        bullet.active = false;
        player.takeDamage(1);
        
        if (this.game.particleSystem) {
          this.game.particleSystem.spawnHitEffect(bullet.x, bullet.y, '#ff0040');
        }
        
        break;
      }
    }
  }

  checkEnemiesVsPlayer() {
    if (!this.game.player || !this.game.player.active) return;
    if (this.game.player.invincible) return;
    
    const enemies = this.game.enemies;
    const player = this.game.player;
    
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (!enemy.active) continue;
      
      if (this.enemyVsPlayer(enemy, player)) {
        enemy.takeDamage(10);
        player.takeDamage(1);
        break;
      }
    }
  }

  checkPowerUpsVsPlayer() {
    if (!this.game.player || !this.game.player.active) return;
    
    const powerUps = this.game.powerUps;
    const player = this.game.player;
    
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];
      if (!powerUp.active) continue;
      
      if (this.powerUpVsPlayer(powerUp, player)) {
        powerUp.apply(player);
      }
    }
  }

  bulletVsEnemy(bullet, enemy) {
    return Utils.circlesOverlap(
      bullet.x, bullet.y, bullet.radius,
      enemy.x, enemy.y, enemy.radius
    );
  }

  bulletVsBoss(bullet, boss) {
    return Utils.circlesOverlap(
      bullet.x, bullet.y, bullet.radius,
      boss.x, boss.y, boss.radius
    );
  }

  bulletVsPlayer(bullet, player) {
    return Utils.circleRectCollision(
      bullet.x, bullet.y, bullet.radius,
      player.x - player.hitboxRadius,
      player.y - player.hitboxRadius,
      player.hitboxRadius * 2,
      player.hitboxRadius * 2
    );
  }

  enemyVsPlayer(enemy, player) {
    return Utils.circlesOverlap(
      enemy.x, enemy.y, enemy.radius * 0.7,
      player.x, player.y, player.hitboxRadius
    );
  }

  powerUpVsPlayer(powerUp, player) {
    return Utils.circleRectCollision(
      powerUp.x, powerUp.y, powerUp.radius,
      player.x - player.pickupRadius,
      player.y - player.pickupRadius,
      player.pickupRadius * 2,
      player.pickupRadius * 2
    );
  }
}
