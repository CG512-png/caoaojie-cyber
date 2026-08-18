class AudioSystem {
  constructor(game) {
    this.game = game;
    this.audioContext = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.bgmVolume = 0.5;
    this.sfxVolume = 0.7;
    this.enabled = true;
    this.currentBGM = null;
    this.bgmOscillator = null;
    this.bgmInterval = null;
    
    this.init();
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.bgmGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      this.bgmGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);
      
      const settings = this.game.saveData.settings;
      this.bgmVolume = settings.bgmVolume || 0.5;
      this.sfxVolume = settings.sfxVolume || 0.7;
      this.bgmGain.gain.value = this.bgmVolume;
      this.sfxGain.gain.value = this.sfxVolume;
    } catch (e) {
      console.warn('Web Audio not supported');
      this.enabled = false;
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setBGMVolume(vol) {
    this.bgmVolume = vol;
    if (this.bgmGain) {
      this.bgmGain.gain.value = vol;
    }
  }

  setSFXVolume(vol) {
    this.sfxVolume = vol;
    if (this.sfxGain) {
      this.sfxGain.gain.value = vol;
    }
  }

  playTone(frequency, duration, type = 'square', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  playShoot(weaponType = 'laser') {
    if (!this.enabled) return;
    
    switch (weaponType) {
      case 'laser':
        this.playTone(880, 0.05, 'square', 0.1);
        break;
      case 'spread':
        this.playTone(660, 0.06, 'sawtooth', 0.08);
        break;
      case 'tracking':
        this.playTone(440, 0.08, 'triangle', 0.1);
        break;
      case 'plasma':
        this.playTone(220, 0.1, 'sawtooth', 0.12);
        break;
      case 'shock':
        this.playTone(110, 0.15, 'square', 0.15);
        break;
      default:
        this.playTone(660, 0.05, 'square', 0.1);
    }
  }

  playExplosion(size = 'medium') {
    if (!this.enabled || !this.audioContext) return;
    
    const sizes = {
      small: { freq: 200, dur: 0.15, vol: 0.15 },
      medium: { freq: 150, dur: 0.25, vol: 0.2 },
      large: { freq: 100, dur: 0.4, vol: 0.3 },
      huge: { freq: 80, dur: 0.6, vol: 0.4 }
    };
    
    const config = sizes[size] || sizes.medium;
    
    const noise = this.audioContext.createBufferSource();
    const bufferSize = this.audioContext.sampleRate * config.dur;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.freq;
    
    const gain = this.audioContext.createGain();
    gain.gain.value = config.vol * this.sfxVolume;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    
    noise.start();
  }

  playHit() {
    if (!this.enabled) return;
    this.playTone(150, 0.1, 'sawtooth', 0.2);
    this.playTone(80, 0.15, 'square', 0.15);
  }

  playPickup() {
    if (!this.enabled) return;
    this.playTone(660, 0.05, 'sine', 0.15);
    setTimeout(() => this.playTone(880, 0.05, 'sine', 0.15), 50);
    setTimeout(() => this.playTone(1100, 0.08, 'sine', 0.12), 100);
  }

  playSkill() {
    if (!this.enabled) return;
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.playTone(200 + i * 100, 0.1, 'sawtooth', 0.15);
      }, i * 30);
    }
  }

  playBossWarning() {
    if (!this.enabled) return;
    
    const warn = () => {
      this.playTone(440, 0.15, 'square', 0.2);
      setTimeout(() => this.playTone(220, 0.15, 'square', 0.2), 150);
    };
    
    warn();
    setTimeout(warn, 400);
    setTimeout(warn, 800);
  }

  playBossExplosion() {
    if (!this.enabled) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playExplosion('large');
      }, i * 200);
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.playTone(800, 0.03, 'square', 0.08);
  }

  playBGM(type) {
    if (!this.enabled || !this.audioContext) return;
    if (this.currentBGM === type) return;
    
    this.stopBGM();
    this.currentBGM = type;
    
    const melodies = {
      menu: {
        notes: [220, 277, 330, 277, 220, 277, 330, 440],
        duration: 300,
        type: 'triangle'
      },
      battle: {
        notes: [165, 196, 220, 196, 165, 220, 247, 220, 165, 196, 220, 277],
        duration: 200,
        type: 'sawtooth'
      },
      boss: {
        notes: [110, 139, 110, 165, 110, 139, 110, 185],
        duration: 250,
        type: 'square'
      }
    };
    
    const melody = melodies[type] || melodies.battle;
    let noteIndex = 0;
    
    const playNote = () => {
      if (this.currentBGM !== type) return;
      
      const freq = melody.notes[noteIndex % melody.notes.length];
      this.playBGMTone(freq, melody.duration / 1000 * 0.8, melody.type);
      
      noteIndex++;
    };
    
    playNote();
    this.bgmInterval = setInterval(playNote, melody.duration);
  }

  playBGMTone(frequency, duration, type) {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.08 * this.bgmVolume, this.audioContext.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.05 * this.bgmVolume, this.audioContext.currentTime + duration * 0.5);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.bgmGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  stopBGM() {
    this.currentBGM = null;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}
