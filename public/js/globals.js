// Variable Global del Juego
export const game = {
    lives: 0,
    money: 0,
    enemies: [],
    towers: [],
    projectiles: [],
    waveIndex: 0,
    enemiesSpawned: 0,
    spawnTimer: 0,
    waveCooldown: 0,
    path: [
        {x: 0, y: 2}, {x: 17, y: 2}, {x: 17, y: 7},
        {x: 2, y: 7}, {x: 2, y: 12}, {x: 19, y: 12}
    ]
};

// Contexto Gráfico Global
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export const IMAGES = {};