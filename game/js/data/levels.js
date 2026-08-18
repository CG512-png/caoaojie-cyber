const Levels = {
  1: {
    name: 'City Assault',
    description: '赛博城市上空',
    boss: 'scout',
    waveInterval: 1.5,
    waves: [
      {
        enemies: [
          { type: 'small', count: 8, pattern: 'line', spacing: 40 },
          { type: 'suicide', count: 2, delay: 500 }
        ]
      },
      {
        enemies: [
          { type: 'small', count: 10, pattern: 'vshape' },
          { type: 'medium', count: 3, delay: 800 }
        ]
      },
      {
        enemies: [
          { type: 'medium', count: 5, pattern: 'line', spacing: 55 },
          { type: 'small', count: 8, pattern: 'vshape', delay: 600 },
          { type: 'suicide', count: 3, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 2, pattern: 'line', spacing: 80 },
          { type: 'medium', count: 4, pattern: 'vshape', delay: 1000 },
          { type: 'small', count: 10, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'small', count: 15, pattern: 'line', spacing: 25 },
          { type: 'suicide', count: 5, delay: 800 },
          { type: 'medium', count: 3, delay: 2000 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 2, pattern: 'line', spacing: 90 },
          { type: 'elite', count: 1, delay: 1200 },
          { type: 'small', count: 8, delay: 1800 }
        ]
      },
      {
        enemies: [
          { type: 'medium', count: 6, pattern: 'vshape' },
          { type: 'bomber', count: 2, delay: 1000 },
          { type: 'suicide', count: 5, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 2, pattern: 'line', spacing: 100 },
          { type: 'large', count: 1, delay: 1500 },
          { type: 'small', count: 12, delay: 2000 }
        ]
      }
    ]
  },
  2: {
    name: 'Cloud Siege',
    description: '云层之上',
    boss: 'battleship',
    waveInterval: 1.2,
    waves: [
      {
        enemies: [
          { type: 'medium', count: 6, pattern: 'vshape' },
          { type: 'small', count: 10, pattern: 'line', delay: 500 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 2 },
          { type: 'medium', count: 5, delay: 600 },
          { type: 'suicide', count: 4, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 4, pattern: 'line', spacing: 60 },
          { type: 'suicide', count: 6, delay: 800 },
          { type: 'medium', count: 4, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 2, pattern: 'vshape' },
          { type: 'elite', count: 2, delay: 1000 },
          { type: 'small', count: 12, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'sniper', count: 2, pattern: 'line', spacing: 100 },
          { type: 'medium', count: 6, delay: 800 },
          { type: 'suicide', count: 6, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 3, pattern: 'vshape' },
          { type: 'large', count: 2, delay: 1200 },
          { type: 'bomber', count: 2, delay: 1800 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 3, pattern: 'line', spacing: 70 },
          { type: 'elite', count: 2, delay: 1000 },
          { type: 'suicide', count: 8, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 3, pattern: 'vshape' },
          { type: 'sniper', count: 2, delay: 1000 },
          { type: 'medium', count: 6, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 4, pattern: 'vshape' },
          { type: 'large', count: 2, delay: 1200 },
          { type: 'suicide', count: 10, delay: 1800 }
        ]
      }
    ]
  },
  3: {
    name: 'Desert Base',
    description: '沙漠基地',
    boss: 'fortress',
    waveInterval: 1,
    waves: [
      {
        enemies: [
          { type: 'medium', count: 8, pattern: 'vshape' },
          { type: 'small', count: 12, pattern: 'line', delay: 400 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 3 },
          { type: 'bomber', count: 3, delay: 500 },
          { type: 'suicide', count: 6, delay: 800 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 5, pattern: 'line', spacing: 50 },
          { type: 'suicide', count: 8, delay: 600 },
          { type: 'sniper', count: 2, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 3, pattern: 'vshape' },
          { type: 'elite', count: 3, delay: 800 },
          { type: 'small', count: 15, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'sniper', count: 3, pattern: 'line', spacing: 70 },
          { type: 'elite', count: 2, delay: 700 },
          { type: 'medium', count: 8, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 4, pattern: 'vshape' },
          { type: 'large', count: 3, delay: 1000 },
          { type: 'suicide', count: 10, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 4, pattern: 'line', spacing: 60 },
          { type: 'bomber', count: 3, delay: 800 },
          { type: 'sniper', count: 2, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 5, pattern: 'vshape' },
          { type: 'large', count: 3, delay: 1000 },
          { type: 'suicide', count: 12, delay: 1500 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 4, pattern: 'vshape' },
          { type: 'sniper', count: 3, delay: 800 },
          { type: 'elite', count: 3, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 5, pattern: 'vshape' },
          { type: 'elite', count: 4, delay: 1000 },
          { type: 'suicide', count: 15, delay: 1500 }
        ]
      }
    ]
  },
  4: {
    name: 'Orbit Strike',
    description: '太空轨道',
    boss: 'carrier',
    waveInterval: 0.8,
    waves: [
      {
        enemies: [
          { type: 'elite', count: 4, pattern: 'vshape' },
          { type: 'medium', count: 8, delay: 400 },
          { type: 'small', count: 12, delay: 800 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 5, pattern: 'vshape' },
          { type: 'elite', count: 3, delay: 600 },
          { type: 'suicide', count: 8, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 4, pattern: 'line', spacing: 50 },
          { type: 'sniper', count: 3, delay: 700 },
          { type: 'elite', count: 2, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 5, pattern: 'vshape' },
          { type: 'bomber', count: 4, delay: 800 },
          { type: 'suicide', count: 10, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'sniper', count: 4, pattern: 'line', spacing: 60 },
          { type: 'elite', count: 4, delay: 600 },
          { type: 'medium', count: 10, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 4, pattern: 'vshape' },
          { type: 'elite', count: 5, delay: 800 },
          { type: 'suicide', count: 12, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 5, pattern: 'vshape' },
          { type: 'sniper', count: 3, delay: 700 },
          { type: 'elite', count: 4, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 6, pattern: 'vshape' },
          { type: 'large', count: 4, delay: 900 },
          { type: 'suicide', count: 15, delay: 1400 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 6, pattern: 'line', spacing: 45 },
          { type: 'elite', count: 5, delay: 800 },
          { type: 'bomber', count: 4, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 7, pattern: 'vshape' },
          { type: 'sniper', count: 4, delay: 700 },
          { type: 'suicide', count: 18, delay: 1200 }
        ]
      }
    ]
  },
  5: {
    name: 'Final Showdown',
    description: '最终决战',
    boss: 'final',
    waveInterval: 0.6,
    waves: [
      {
        enemies: [
          { type: 'elite', count: 6, pattern: 'vshape' },
          { type: 'large', count: 4, delay: 400 },
          { type: 'medium', count: 10, delay: 800 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 6, pattern: 'vshape' },
          { type: 'elite', count: 5, delay: 500 },
          { type: 'suicide', count: 12, delay: 800 }
        ]
      },
      {
        enemies: [
          { type: 'sniper', count: 5, pattern: 'line', spacing: 50 },
          { type: 'elite', count: 5, delay: 500 },
          { type: 'bomber', count: 4, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 5, pattern: 'vshape' },
          { type: 'elite', count: 6, delay: 600 },
          { type: 'suicide', count: 15, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 8, pattern: 'vshape' },
          { type: 'sniper', count: 4, delay: 500 },
          { type: 'medium', count: 15, delay: 900 }
        ]
      },
      {
        enemies: [
          { type: 'bomber', count: 6, pattern: 'vshape' },
          { type: 'large', count: 5, delay: 700 },
          { type: 'elite', count: 5, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 7, pattern: 'line', spacing: 40 },
          { type: 'elite', count: 6, delay: 600 },
          { type: 'suicide', count: 20, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'sniper', count: 6, pattern: 'vshape' },
          { type: 'elite', count: 7, delay: 500 },
          { type: 'bomber', count: 5, delay: 1000 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 10, pattern: 'vshape' },
          { type: 'large', count: 6, delay: 700 },
          { type: 'suicide', count: 20, delay: 1200 }
        ]
      },
      {
        enemies: [
          { type: 'large', count: 8, pattern: 'vshape' },
          { type: 'bomber', count: 6, delay: 600 },
          { type: 'sniper', count: 5, delay: 1000 },
          { type: 'elite', count: 6, delay: 1400 }
        ]
      },
      {
        enemies: [
          { type: 'elite', count: 12, pattern: 'line', spacing: 30 },
          { type: 'suicide', count: 25, delay: 800 },
          { type: 'large', count: 5, delay: 1500 }
        ]
      }
    ]
  }
};
