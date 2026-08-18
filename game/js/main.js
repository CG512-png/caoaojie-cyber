let game = null;

function initGame() {
  const canvas = document.getElementById('game-canvas');
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const maxWidth = isMobile ? window.innerWidth : 480;
  const maxHeight = isMobile ? window.innerHeight : window.innerHeight;
  
  let gameWidth = Math.min(maxWidth, 480);
  let gameHeight = Math.min(maxHeight, 800);
  
  if (gameHeight / gameWidth > 1.7) {
    gameHeight = gameWidth * 1.7;
  }
  
  canvas.width = gameWidth;
  canvas.height = gameHeight;
  
  game = new Game(canvas);
  
  Input.init(canvas);
  
  game.particleSystem = new ParticleSystem(game);
  game.collisionSystem = new CollisionSystem(game);
  game.audioSystem = new AudioSystem(game);
  game.uiSystem = new UISystem(game);
  
  game.difficulty = game.saveData.settings.difficulty || 'normal';
  
  game.start();
  
  window.addEventListener('resize', () => {
    const newMaxWidth = isMobile ? window.innerWidth : 480;
    const newMaxHeight = isMobile ? window.innerHeight : window.innerHeight;
    
    let newWidth = Math.min(newMaxWidth, 480);
    let newHeight = Math.min(newMaxHeight, 800);
    
    if (newHeight / newWidth > 1.7) {
      newHeight = newWidth * 1.7;
    }
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    game.width = newWidth;
    game.height = newHeight;
  });
}

window.addEventListener('load', initGame);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && game && game.state === GameState.MENU) {
    if (game.audioSystem) {
      game.audioSystem.resume();
    }
  }
});
