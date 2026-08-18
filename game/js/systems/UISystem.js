class UISystem {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.initElements();
  }

  initElements() {
    this.elements = {
      hud: document.getElementById('hud'),
      scoreValue: document.getElementById('score-value'),
      comboDisplay: document.getElementById('combo-display'),
      comboMultiplier: document.querySelector('.combo-multiplier'),
      healthFill: document.getElementById('health-fill'),
      shieldIndicator: document.getElementById('shield-indicator'),
      bossBarContainer: document.getElementById('boss-bar-container'),
      bossName: document.getElementById('boss-name'),
      bossHpFill: document.getElementById('boss-hp-fill'),
      weaponIcon: document.getElementById('weapon-icon'),
      weaponName: document.getElementById('weapon-name'),
      weaponLevel: document.getElementById('weapon-level'),
      skillFill: document.getElementById('skill-fill'),
      skillBarContainer: document.querySelector('.skill-bar-container'),
      pauseBtn: document.getElementById('pause-btn'),
      
      mainMenu: document.getElementById('main-menu'),
      levelSelect: document.getElementById('level-select'),
      levelGrid: document.getElementById('level-grid'),
      pauseMenu: document.getElementById('pause-menu'),
      gameOver: document.getElementById('game-over'),
      victory: document.getElementById('victory'),
      settingsPanel: document.getElementById('settings-panel'),
      bossWarning: document.getElementById('boss-warning'),
      
      highScore: document.getElementById('high-score'),
      finalScore: document.getElementById('final-score'),
      finalHighScore: document.getElementById('final-high-score'),
      finalKills: document.getElementById('final-kills'),
      victoryScore: document.getElementById('victory-score'),
      victoryTime: document.getElementById('victory-time'),
      starsDisplay: document.getElementById('stars-display')
    };
    
    this.bindEvents();
    this.updateHighScoreDisplay();
  }

  bindEvents() {
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode === 'story') {
          this.showLevelSelect();
        } else {
          this.startGame(mode);
        }
        this.playClick();
      });
    });
    
    document.getElementById('back-to-menu').addEventListener('click', () => {
      this.showMainMenu();
      this.playClick();
    });
    
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.showSettings();
      this.playClick();
    });
    
    document.getElementById('settings-back').addEventListener('click', () => {
      this.showMainMenu();
      this.playClick();
    });
    
    document.getElementById('pause-btn').addEventListener('click', () => {
      this.game.pause();
      this.showPauseMenu();
      this.playClick();
    });
    
    document.getElementById('resume-btn').addEventListener('click', () => {
      this.game.resume();
      this.hidePauseMenu();
      this.playClick();
    });
    
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.hidePauseMenu();
      this.game.startGame(this.game.mode, this.game.currentLevel);
      this.playClick();
    });
    
    document.getElementById('quit-btn').addEventListener('click', () => {
      this.hidePauseMenu();
      this.game.goToMenu();
      this.showMainMenu();
      this.playClick();
    });
    
    document.getElementById('retry-btn').addEventListener('click', () => {
      this.hideGameOver();
      this.game.startGame(this.game.mode, this.game.currentLevel);
      this.playClick();
    });
    
    document.getElementById('gameover-menu-btn').addEventListener('click', () => {
      this.hideGameOver();
      this.game.goToMenu();
      this.showMainMenu();
      this.playClick();
    });
    
    document.getElementById('next-level-btn').addEventListener('click', () => {
      this.hideVictory();
      const nextLevel = this.game.currentLevel + 1;
      if (nextLevel <= Object.keys(Levels).length) {
        this.game.startGame('story', nextLevel);
      } else {
        this.game.goToMenu();
        this.showMainMenu();
      }
      this.playClick();
    });
    
    document.getElementById('victory-menu-btn').addEventListener('click', () => {
      this.hideVictory();
      this.game.goToMenu();
      this.showMainMenu();
      this.playClick();
    });
    
    const bgmSlider = document.getElementById('bgm-volume');
    const sfxSlider = document.getElementById('sfx-volume');
    
    bgmSlider.addEventListener('input', (e) => {
      const value = e.target.value / 100;
      document.getElementById('bgm-volume-value').textContent = e.target.value + '%';
      if (this.game.audioSystem) {
        this.game.audioSystem.setBGMVolume(value);
      }
      this.game.saveData.settings.bgmVolume = value;
      this.game.saveGame();
    });
    
    sfxSlider.addEventListener('input', (e) => {
      const value = e.target.value / 100;
      document.getElementById('sfx-volume-value').textContent = e.target.value + '%';
      if (this.game.audioSystem) {
        this.game.audioSystem.setSFXVolume(value);
      }
      this.game.saveData.settings.sfxVolume = value;
      this.game.saveGame();
    });
    
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.game.difficulty = btn.dataset.diff;
        this.game.saveData.settings.difficulty = btn.dataset.diff;
        this.game.saveGame();
        this.playClick();
      });
    });
    
    const shakeToggle = document.getElementById('shake-toggle');
    shakeToggle.addEventListener('click', () => {
      shakeToggle.classList.toggle('active');
      this.game.saveData.settings.screenShake = shakeToggle.classList.contains('active');
      this.game.saveGame();
      this.playClick();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (this.game.state === GameState.PAUSED) {
          this.game.resume();
          this.hidePauseMenu();
        }
      }
    });
    
    document.addEventListener('click', () => {
      if (this.game.audioSystem) {
        this.game.audioSystem.resume();
      }
    }, { once: false });
  }

  update(dt) {
    if (this.game.state === GameState.PLAYING || this.game.state === GameState.BOSS_WARNING) {
      this.updateHUD();
    }
    
    if (this.game.state === GameState.GAME_OVER && !this.elements.gameOver.classList.contains('hidden')) {
      return;
    }
    
    if (this.game.state === GameState.GAME_OVER) {
      this.showGameOver();
    }
    
    if (this.game.state === GameState.VICTORY) {
      this.showVictory();
    }
  }

  updateHUD() {
    this.elements.scoreValue.textContent = Utils.formatNumber(this.game.score);
    
    if (this.game.combo > 0) {
      this.elements.comboDisplay.classList.add('active');
      this.elements.comboMultiplier.textContent = 'x' + (1 + Math.min(this.game.combo * 0.2, 4)).toFixed(1);
    } else {
      this.elements.comboDisplay.classList.remove('active');
    }
    
    if (this.game.player) {
      const hpPercent = (this.game.player.health / this.game.player.maxHealth) * 100;
      this.elements.healthFill.style.width = hpPercent + '%';
      
      if (this.game.player.shield > 0) {
        this.elements.shieldIndicator.classList.add('active');
        this.elements.shieldIndicator.querySelector('.shield-icon').textContent = '◇'.repeat(this.game.player.shield);
      } else {
        this.elements.shieldIndicator.classList.remove('active');
      }
      
      if (this.game.player.weaponSystem) {
        this.elements.weaponIcon.textContent = this.game.player.weaponSystem.getWeaponIcon();
        this.elements.weaponName.textContent = this.game.player.weaponSystem.getWeaponName();
        this.elements.weaponLevel.textContent = 'LV.' + this.game.player.weaponSystem.weaponLevel;
      }
      
      const skillPercent = (this.game.player.skillEnergy / this.game.player.maxSkillEnergy) * 100;
      this.elements.skillFill.style.width = skillPercent + '%';
      
      if (skillPercent >= 100) {
        this.elements.skillBarContainer.classList.add('ready');
      } else {
        this.elements.skillBarContainer.classList.remove('ready');
      }
    }
  }

  showBossBar(name) {
    this.elements.bossBarContainer.classList.remove('hidden');
    this.elements.bossName.textContent = name;
    this.elements.bossHpFill.style.width = '100%';
  }

  updateBossHP(percent) {
    this.elements.bossHpFill.style.width = Math.max(0, percent * 100) + '%';
  }

  hideBossBar() {
    this.elements.bossBarContainer.classList.add('hidden');
  }

  showBossWarning() {
    this.elements.bossWarning.classList.remove('hidden');
    setTimeout(() => {
      this.elements.bossWarning.classList.add('hidden');
    }, 2000);
  }

  showMainMenu() {
    this.hideAllMenus();
    this.elements.mainMenu.classList.remove('hidden');
    this.elements.hud.classList.add('hidden');
    this.updateHighScoreDisplay();
  }

  showLevelSelect() {
    this.hideAllMenus();
    this.elements.levelSelect.classList.remove('hidden');
    this.generateLevelButtons();
  }

  showSettings() {
    this.hideAllMenus();
    this.elements.settingsPanel.classList.remove('hidden');
    
    const settings = this.game.saveData.settings;
    document.getElementById('bgm-volume').value = (settings.bgmVolume || 0.5) * 100;
    document.getElementById('bgm-volume-value').textContent = Math.round((settings.bgmVolume || 0.5) * 100) + '%';
    document.getElementById('sfx-volume').value = (settings.sfxVolume || 0.7) * 100;
    document.getElementById('sfx-volume-value').textContent = Math.round((settings.sfxVolume || 0.7) * 100) + '%';
    
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === (settings.difficulty || 'normal'));
    });
    
    const shakeToggle = document.getElementById('shake-toggle');
    if (settings.screenShake !== false) {
      shakeToggle.classList.add('active');
    } else {
      shakeToggle.classList.remove('active');
    }
  }

  showPauseMenu() {
    this.elements.pauseMenu.classList.remove('hidden');
  }

  hidePauseMenu() {
    this.elements.pauseMenu.classList.add('hidden');
  }

  showGameOver() {
    this.elements.gameOver.classList.remove('hidden');
    this.elements.hud.classList.add('hidden');
    this.elements.finalScore.textContent = Utils.formatNumber(this.game.score);
    this.elements.finalHighScore.textContent = Utils.formatNumber(this.game.getHighScore());
    this.elements.finalKills.textContent = Utils.formatNumber(this.game.kills);
  }

  hideGameOver() {
    this.elements.gameOver.classList.add('hidden');
  }

  showVictory() {
    this.elements.victory.classList.remove('hidden');
    this.elements.hud.classList.add('hidden');
    this.elements.victoryScore.textContent = Utils.formatNumber(this.game.score);
    this.elements.victoryTime.textContent = Utils.formatTime(this.game.gameTime);
    
    const stars = this.game.calculateStars();
    const starElements = this.elements.starsDisplay.querySelectorAll('.star');
    starElements.forEach((star, i) => {
      star.classList.toggle('earned', i < stars);
    });
    
    const nextBtn = document.getElementById('next-level-btn');
    if (this.game.currentLevel >= Object.keys(Levels).length) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }
  }

  hideVictory() {
    this.elements.victory.classList.add('hidden');
  }

  hideAllMenus() {
    this.elements.mainMenu.classList.add('hidden');
    this.elements.levelSelect.classList.add('hidden');
    this.elements.pauseMenu.classList.add('hidden');
    this.elements.gameOver.classList.add('hidden');
    this.elements.victory.classList.add('hidden');
    this.elements.settingsPanel.classList.add('hidden');
    this.elements.bossWarning.classList.add('hidden');
  }

  showHUD() {
    this.elements.hud.classList.remove('hidden');
  }

  hideHUD() {
    this.elements.hud.classList.add('hidden');
  }

  generateLevelButtons() {
    const grid = this.elements.levelGrid;
    grid.innerHTML = '';
    
    const levelCount = Object.keys(Levels).length;
    const unlocked = this.game.saveData.unlockedLevels || 1;
    const stars = this.game.saveData.levelStars || {};
    
    for (let i = 1; i <= levelCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      
      const isUnlocked = i <= unlocked;
      if (!isUnlocked) {
        btn.classList.add('locked');
      }
      
      btn.innerHTML = `
        <span class="level-num">${i}</span>
        <span class="level-stars">${isUnlocked ? '★'.repeat(stars['level' + i] || 0) + '☆'.repeat(3 - (stars['level' + i] || 0)) : '🔒'}</span>
      `;
      
      if (isUnlocked) {
        btn.addEventListener('click', () => {
          this.startGame('story', i);
          this.playClick();
        });
      }
      
      grid.appendChild(btn);
    }
  }

  startGame(mode, level = 1) {
    this.hideAllMenus();
    this.showHUD();
    this.game.startGame(mode, level);
  }

  updateHighScoreDisplay() {
    if (this.elements.highScore) {
      this.elements.highScore.textContent = Utils.formatNumber(this.game.getHighScore());
    }
  }

  playClick() {
    if (this.game.audioSystem) {
      this.game.audioSystem.playClick();
    }
  }
}
