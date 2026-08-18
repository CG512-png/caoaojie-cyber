const BossTypes = {
  scout: {
    type: 'scout',
    name: 'SCOUT HELI',
    width: 100,
    height: 80,
    hp: 1200,
    score: 5000,
    speed: 100,
    targetY: 80,
    phases: [
      {
        hpPercent: 0.8,
        movePattern: 'fast',
        patterns: ['spread', 'aimed', 'spiral'],
        fireRate: 0.5
      },
      {
        hpPercent: 0.5,
        movePattern: 'fast',
        patterns: ['spiral', 'spread', 'circle', 'aimed'],
        fireRate: 0.35
      },
      {
        hpPercent: 0.25,
        movePattern: 'chase',
        patterns: ['spiral', 'rain', 'laser', 'aimed'],
        fireRate: 0.25
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['spiralDual', 'rain', 'cross', 'aimed', 'laser'],
        fireRate: 0.18
      }
    ]
  },
  battleship: {
    type: 'battleship',
    name: 'BATTLESHIP',
    width: 140,
    height: 100,
    hp: 2500,
    score: 10000,
    speed: 80,
    targetY: 70,
    phases: [
      {
        hpPercent: 0.85,
        movePattern: 'sine',
        patterns: ['spread', 'double', 'circle'],
        fireRate: 0.4
      },
      {
        hpPercent: 0.65,
        movePattern: 'fast',
        patterns: ['spread', 'circle', 'laser', 'aimed'],
        fireRate: 0.3
      },
      {
        hpPercent: 0.45,
        movePattern: 'fast',
        patterns: ['spiral', 'cross', 'rain', 'aimed'],
        fireRate: 0.25
      },
      {
        hpPercent: 0.25,
        movePattern: 'chase',
        patterns: ['spiralDual', 'wave', 'laser', 'rain'],
        fireRate: 0.2
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['spiralDual', 'cross', 'rain', 'laser', 'aimed'],
        fireRate: 0.15
      }
    ]
  },
  carrier: {
    type: 'carrier',
    name: 'AIR CARRIER',
    width: 160,
    height: 90,
    hp: 4000,
    score: 15000,
    speed: 70,
    targetY: 60,
    phases: [
      {
        hpPercent: 0.85,
        movePattern: 'sine',
        patterns: ['rain', 'spread', 'circle'],
        fireRate: 0.35
      },
      {
        hpPercent: 0.7,
        movePattern: 'sine',
        patterns: ['circle', 'rain', 'spiral', 'aimed'],
        fireRate: 0.28
      },
      {
        hpPercent: 0.55,
        movePattern: 'fast',
        patterns: ['spiral', 'cross', 'rain', 'spread'],
        fireRate: 0.22
      },
      {
        hpPercent: 0.4,
        movePattern: 'fast',
        patterns: ['spiralDual', 'laser', 'cross', 'aimed'],
        fireRate: 0.18
      },
      {
        hpPercent: 0.25,
        movePattern: 'chase',
        patterns: ['spiralDual', 'wave', 'rain', 'laser'],
        fireRate: 0.15
      },
      {
        hpPercent: 0.1,
        movePattern: 'chase',
        patterns: ['spiralDual', 'rain', 'cross', 'laser', 'aimed'],
        fireRate: 0.12
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['hexagon', 'spiralDual', 'rain', 'laser', 'aimed'],
        fireRate: 0.1
      }
    ]
  },
  fortress: {
    type: 'fortress',
    name: 'DESERT FORTRESS',
    width: 130,
    height: 130,
    hp: 6000,
    score: 20000,
    speed: 60,
    targetY: 80,
    phases: [
      {
        hpPercent: 0.9,
        movePattern: 'hover',
        patterns: ['circle', 'spread', 'double'],
        fireRate: 0.35
      },
      {
        hpPercent: 0.75,
        movePattern: 'sine',
        patterns: ['cross', 'circle', 'spiral', 'aimed'],
        fireRate: 0.28
      },
      {
        hpPercent: 0.6,
        movePattern: 'sine',
        patterns: ['spiral', 'laser', 'cross', 'rain'],
        fireRate: 0.22
      },
      {
        hpPercent: 0.45,
        movePattern: 'chase',
        patterns: ['spiralDual', 'wave', 'laser', 'aimed'],
        fireRate: 0.18
      },
      {
        hpPercent: 0.3,
        movePattern: 'fast',
        patterns: ['hexagon', 'spiralDual', 'rain', 'cross'],
        fireRate: 0.15
      },
      {
        hpPercent: 0.18,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'wave', 'laser', 'rain'],
        fireRate: 0.12
      },
      {
        hpPercent: 0.08,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'hexagon', 'rain', 'laser', 'aimed'],
        fireRate: 0.09
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'hexagon', 'cross', 'rain', 'laser', 'aimed'],
        fireRate: 0.07
      }
    ]
  },
  final: {
    type: 'final',
    name: 'CORE MOTHER',
    width: 150,
    height: 130,
    hp: 10000,
    score: 50000,
    speed: 90,
    targetY: 70,
    phases: [
      {
        hpPercent: 0.92,
        movePattern: 'sine',
        patterns: ['spread', 'circle', 'spiral'],
        fireRate: 0.3
      },
      {
        hpPercent: 0.82,
        movePattern: 'fast',
        patterns: ['spiral', 'aimed', 'spread', 'circle'],
        fireRate: 0.25
      },
      {
        hpPercent: 0.7,
        movePattern: 'fast',
        patterns: ['spiralDual', 'cross', 'rain', 'laser'],
        fireRate: 0.2
      },
      {
        hpPercent: 0.58,
        movePattern: 'chase',
        patterns: ['spiralDual', 'wave', 'aimed', 'cross'],
        fireRate: 0.17
      },
      {
        hpPercent: 0.46,
        movePattern: 'chase',
        patterns: ['hexagon', 'spiralDual', 'rain', 'laser'],
        fireRate: 0.14
      },
      {
        hpPercent: 0.34,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'wave', 'cross', 'aimed'],
        fireRate: 0.12
      },
      {
        hpPercent: 0.22,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'hexagon', 'rain', 'laser', 'aimed'],
        fireRate: 0.1
      },
      {
        hpPercent: 0.12,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'starburst', 'wave', 'cross'],
        fireRate: 0.08
      },
      {
        hpPercent: 0.05,
        movePattern: 'chase',
        patterns: ['starburst', 'spiralTriple', 'hexagon', 'rain', 'laser'],
        fireRate: 0.06
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['starburst', 'spiralTriple', 'hexagon', 'rain', 'laser', 'aimed'],
        fireRate: 0.05
      }
    ]
  },
  bullet0: {
    type: 'bullet0',
    name: 'DANCE MASTER',
    width: 100,
    height: 100,
    hp: 3000,
    score: 10000,
    speed: 80,
    targetY: 80,
    phases: [
      {
        hpPercent: 0.7,
        movePattern: 'fast',
        patterns: ['circle', 'spiral', 'spiralDual'],
        fireRate: 0.15
      },
      {
        hpPercent: 0.4,
        movePattern: 'chase',
        patterns: ['spiralDual', 'hexagon', 'wave'],
        fireRate: 0.1
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'starburst', 'cross'],
        fireRate: 0.07
      }
    ]
  },
  bullet1: {
    type: 'bullet0',
    name: 'BULLET STORM',
    width: 110,
    height: 100,
    hp: 5000,
    score: 15000,
    speed: 90,
    targetY: 70,
    phases: [
      {
        hpPercent: 0.75,
        movePattern: 'fast',
        patterns: ['rain', 'spiral', 'circle'],
        fireRate: 0.12
      },
      {
        hpPercent: 0.5,
        movePattern: 'fast',
        patterns: ['spiralDual', 'rain', 'wave', 'cross'],
        fireRate: 0.09
      },
      {
        hpPercent: 0.25,
        movePattern: 'chase',
        patterns: ['hexagon', 'spiralDual', 'rain', 'aimed'],
        fireRate: 0.06
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'starburst', 'rain', 'laser'],
        fireRate: 0.04
      }
    ]
  },
  bullet2: {
    type: 'bullet0',
    name: 'NIGHTMARE',
    width: 120,
    height: 110,
    hp: 8000,
    score: 20000,
    speed: 100,
    targetY: 60,
    phases: [
      {
        hpPercent: 0.85,
        movePattern: 'fast',
        patterns: ['spiralDual', 'circle'],
        fireRate: 0.1
      },
      {
        hpPercent: 0.7,
        movePattern: 'fast',
        patterns: ['spiralDual', 'hexagon', 'rain'],
        fireRate: 0.08
      },
      {
        hpPercent: 0.55,
        movePattern: 'chase',
        patterns: ['spiralTriple', 'wave', 'laser'],
        fireRate: 0.06
      },
      {
        hpPercent: 0.4,
        movePattern: 'chase',
        patterns: ['starburst', 'spiralTriple', 'rain'],
        fireRate: 0.05
      },
      {
        hpPercent: 0.25,
        movePattern: 'chase',
        patterns: ['starburst', 'hexagon', 'spiralTriple', 'laser'],
        fireRate: 0.04
      },
      {
        hpPercent: 0,
        movePattern: 'chase',
        patterns: ['starburst', 'spiralTriple', 'hexagon', 'rain', 'cross'],
        fireRate: 0.03
      }
    ]
  }
};
