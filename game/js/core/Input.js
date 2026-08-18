const Input = {
  keys: {},
  mouse: { x: 0, y: 0, down: false },
  touch: { x: 0, y: 0, active: false },
  canvas: null,

  init(canvas) {
    this.canvas = canvas;

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
    });

    canvas.addEventListener('mouseup', (e) => {
      this.mouse.down = false;
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.touch.x = (touch.clientX - rect.left) * scaleX;
      this.touch.y = (touch.clientY - rect.top) * scaleY;
      this.touch.active = true;
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.touch.x = (touch.clientX - rect.left) * scaleX;
      this.touch.y = (touch.clientY - rect.top) * scaleY;
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touch.active = false;
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
      this.touch.active = false;
    });
  },

  isKeyPressed(code) {
    return !!this.keys[code];
  },

  getHorizontalAxis() {
    let axis = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) axis -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) axis += 1;
    return axis;
  },

  getVerticalAxis() {
    let axis = 0;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) axis -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) axis += 1;
    return axis;
  },

  isShooting() {
    return this.keys['KeyZ'] || this.keys['KeyJ'] || this.mouse.down || this.touch.active;
  },

  isSkillPressed() {
    return this.keys['Space'] || this.keys['KeyX'] || this.keys['KeyK'];
  },

  isPausePressed() {
    return this.keys['Escape'] || this.keys['KeyP'];
  },

  getMoveTarget() {
    if (this.touch.active) {
      return { x: this.touch.x, y: this.touch.y, active: true };
    }
    if (this.mouse.down) {
      return { x: this.mouse.x, y: this.mouse.y, active: true };
    }
    return { x: 0, y: 0, active: false };
  },

  clear() {
    this.keys = {};
    this.mouse.down = false;
    this.touch.active = false;
  }
};
