import { CELL_SIZE, GAME_STATE, TOWER_TYPES, WAVES_CONFIG, SVG_ASSETS } from './constants.js';
import { game, canvas, ctx, IMAGES } from './globals.js';
import { SoundManager } from './SoundManager.js';
import { Enemy } from './classes/Enemy.js';
import { Tower } from './classes/Tower.js';

// --- VARIABLES GLOBALES (Deben estar aquí arriba) ---
let currentState = GAME_STATE.MENU;
let buildType = 'ARCHER';
let selectedTower = null;
let assetsLoaded = 0;

// RECUPERAR RECORD (Si no existe, es 0)
let highScore = parseInt(localStorage.getItem('kingdomDefense_highScore')) || 0;

// CARGAR ASSETS
function loadAssets(callback) {
    const keys = Object.keys(SVG_ASSETS);
    const total = keys.length;
    if (total === 0) callback();

    keys.forEach(key => {
        const img = new Image();
        img.src = SVG_ASSETS[key];
        img.onload = () => { assetsLoaded++; if(assetsLoaded === total) callback(); };
        img.onerror = () => { assetsLoaded++; if(assetsLoaded === total) callback(); };
        IMAGES[key] = img;
    });
}

function initGame() {
    SoundManager.init();
    
    // Reseteamos variables globales
    game.lives = 10;
    game.money = 200;
    game.enemies = [];
    game.towers = [];
    game.projectiles = [];
    game.particles = []; // Limpiamos partículas
    game.waveIndex = 0;
    game.enemiesSpawned = 0;
    game.spawnTimer = 0;
    game.waveCooldown = 300;
    
    game.path = [
        {x: 0, y: 2}, {x: 17, y: 2}, {x: 17, y: 7},
        {x: 2, y: 7}, {x: 2, y: 12}, {x: 19, y: 12}
    ];
}

// UI - Cargar Iconos
setTimeout(() => {
    const iconArcher = document.getElementById('iconArcher');
    const iconCannon = document.getElementById('iconCannon');
    const iconIce = document.getElementById('iconIce');
    if(iconArcher) iconArcher.src = SVG_ASSETS.archer;
    if(iconCannon) iconCannon.src = SVG_ASSETS.cannon;
    if(iconIce) iconIce.src = SVG_ASSETS.ice;
}, 100);

document.querySelectorAll('.tower-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        buildType = btn.dataset.type;
        document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

const btnUpgrade = document.getElementById('btnUpgrade');
if(btnUpgrade) btnUpgrade.addEventListener('click', upgradeSelectedTower);
const btnSell = document.getElementById('btnSell');
if(btnSell) btnSell.addEventListener('click', sellSelectedTower);

// INPUTS DEL JUEGO
if(canvas) {
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // --- MENU PRINCIPAL ---
        if (currentState === GAME_STATE.MENU) {
            // Botón Jugar (Coordenadas ajustadas para no chocar con el texto de Récord)
            if (mouseX > 300 && mouseX < 500 && mouseY > 300 && mouseY < 380) {
                initGame(); 
                currentState = GAME_STATE.PLAYING;
            }
            return;
        }
        
        // --- GAME OVER / VICTORIA ---
        if (currentState === GAME_STATE.GAMEOVER || currentState === GAME_STATE.VICTORY) {
            // Botón Reiniciar
            if (mouseX > 300 && mouseX < 500 && mouseY > 350 && mouseY < 450) {
                initGame(); 
                currentState = GAME_STATE.PLAYING;
            }
            return;
        }

        if (currentState !== GAME_STATE.PLAYING) return;

        // --- JUEGO (Construir) ---
        const gridX = Math.floor(mouseX / CELL_SIZE);
        const gridY = Math.floor(mouseY / CELL_SIZE);
        const clickedTower = game.towers.find(t => Math.floor(t.x/CELL_SIZE) === gridX && Math.floor(t.y/CELL_SIZE) === gridY);

        if (clickedTower) {
            selectedTower = clickedTower; 
            updateUpgradePanel();
        } else {
            selectedTower = null; 
            const panel = document.getElementById('upgrade-panel');
            if(panel) panel.style.display = 'none';
            
            const stats = TOWER_TYPES[buildType];
            if (game.money >= stats.cost && !isPointOnPath(gridX, gridY)) {
                game.towers.push(new Tower(gridX*CELL_SIZE+20, gridY*CELL_SIZE+20, stats));
                game.money -= stats.cost;
                SoundManager.playBuild();
            }
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (currentState === GAME_STATE.PLAYING) currentState = GAME_STATE.PAUSED;
        else if (currentState === GAME_STATE.PAUSED) currentState = GAME_STATE.PLAYING;
    }
});

// LOGICA AUXILIAR
function isPointOnPath(gx, gy) {
    if(!game.path) return false;
    for (let i = 0; i < game.path.length - 1; i++) {
        const p1 = game.path[i]; const p2 = game.path[i+1];
        if (gx >= Math.min(p1.x, p2.x) && gx <= Math.max(p1.x, p2.x) &&
            gy >= Math.min(p1.y, p2.y) && gy <= Math.max(p1.y, p2.y)) return true;
    } return false;
}

function updateUpgradePanel() {
    if (!selectedTower) return;
    const panel = document.getElementById('upgrade-panel');
    const title = document.getElementById('upg-title');
    const info = document.getElementById('upg-info');
    const btn = document.getElementById('btnUpgrade');
    
    if(panel && title && info && btn) {
        panel.style.display = 'flex';
        title.innerText = `${selectedTower.name} (Nv. ${selectedTower.level})`;
        info.innerText = `Daño: ${selectedTower.damage} | Rango: ${selectedTower.range}`;
        const cost = selectedTower.getUpgradeCost();
        if (selectedTower.level >= selectedTower.maxLevel) { 
            btn.innerText = "MAX"; btn.disabled = true; 
        } else { 
            btn.innerText = `Mejorar ($${cost})`; btn.disabled = (game.money < cost); 
        }
    }
}
function upgradeSelectedTower() {
    if (selectedTower && game.money >= selectedTower.getUpgradeCost()) {
        game.money -= selectedTower.getUpgradeCost(); selectedTower.upgrade(); updateUpgradePanel();
    }
}
function sellSelectedTower() {
    if (selectedTower) {
        game.money += selectedTower.getSellValue();
        game.towers = game.towers.filter(t => t !== selectedTower);
        selectedTower = null; 
        const panel = document.getElementById('upgrade-panel');
        if(panel) panel.style.display = 'none';
    }
}

// DIBUJO DE PANTALLAS
function drawMap() {
    if(!ctx) return;
    ctx.fillStyle = '#2d5a27'; ctx.fillRect(0,0, canvas.width, canvas.height);
    if(game.path && game.path.length > 0) {
        ctx.lineWidth = 40; ctx.strokeStyle = '#5d4037'; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; 
        ctx.beginPath();
        const start = game.path[0]; ctx.moveTo(start.x*CELL_SIZE+20, start.y*CELL_SIZE+20);
        for (let i = 1; i < game.path.length; i++) ctx.lineTo(game.path[i].x*CELL_SIZE+20, game.path[i].y*CELL_SIZE+20);
        ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = '#3e2723'; ctx.stroke(); 
    }
}

function drawMenu() {
    if(!ctx) return;
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0,0, canvas.width, canvas.height);
    
    // Titulo
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 60px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText("KINGDOM DEFENSE", 400, 200);
    
    // Récord (Aquí usa la variable global highScore)
    ctx.fillStyle = '#AAAAAA'; ctx.font = '30px Segoe UI';
    ctx.fillText(`Récord: Oleada ${highScore}`, 400, 260);

    // Botón Jugar
    ctx.fillStyle = '#28a745'; ctx.fillRect(300, 300, 200, 80);
    ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.strokeRect(300, 300, 200, 80);
    ctx.fillStyle = 'white'; ctx.font = 'bold 40px Segoe UI'; ctx.fillText("JUGAR", 400, 355);
}

function drawGameOver() {
    if(!ctx) return;
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 60px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText("GAME OVER", 400, 300);
    ctx.fillStyle = '#333'; ctx.fillRect(300, 350, 200, 100);
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.strokeRect(300, 350, 200, 100);
    ctx.fillStyle = 'white'; ctx.font = '30px Segoe UI'; ctx.fillText("Reiniciar", 400, 410);
}

function drawVictory() {
    if(!ctx) return;
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 60px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText("¡VICTORIA!", 400, 300);
    ctx.fillStyle = '#333'; ctx.fillRect(300, 350, 200, 100);
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.strokeRect(300, 350, 200, 100);
    ctx.fillStyle = 'white'; ctx.font = '30px Segoe UI'; ctx.fillText("Jugar de Nuevo", 400, 410);
}

// BUCLE PRINCIPAL
function gameLoop() {
    if(!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GAME_STATE.MENU) { 
        drawMenu(); 
    } 
    else if (currentState === GAME_STATE.PLAYING || currentState === GAME_STATE.PAUSED) {
        drawMap();
        if (currentState === GAME_STATE.PLAYING) {
            // Lógica de Oleadas
            if (game.waveIndex < WAVES_CONFIG.length) {
                const wv = WAVES_CONFIG[game.waveIndex];
                if (game.waveCooldown > 0) {
                    game.waveCooldown--; 
                    ctx.fillStyle = 'white'; ctx.font = '20px monospace'; ctx.textAlign = 'left';
                    ctx.fillText(`Próxima oleada en: ${(game.waveCooldown/60).toFixed(1)}s`, 20, 580);
                } else {
                    if (game.enemiesSpawned < wv.count) {
                        game.spawnTimer++;
                        if (game.spawnTimer >= wv.interval) {
                            game.enemies.push(new Enemy(wv.speed, wv.hp, wv.isBoss));
                            game.enemiesSpawned++; game.spawnTimer = 0;
                        }
                    } else if (game.enemies.length === 0) {
                        game.waveIndex++; game.enemiesSpawned = 0; game.waveCooldown = 300; game.money += 200;
                    }
                }
            } else if (game.enemies.length === 0) { 
                currentState = GAME_STATE.VICTORY; SoundManager.playWin(); 
            }

            // Updates
            game.towers.forEach(t => t.update());
            game.enemies.forEach(e => e.update());
            game.projectiles.forEach(p => p.update());
            game.particles.forEach(p => p.update()); // Partículas

            game.enemies = game.enemies.filter(e => !e.dead);
            game.projectiles = game.projectiles.filter(p => !p.hit);
            game.particles = game.particles.filter(p => p.life > 0);
            
            if (game.lives <= 0) { 
                currentState = GAME_STATE.GAMEOVER; 
                SoundManager.playLose();
                // GUARDAR RECORD
                if (game.waveIndex + 1 > highScore) {
                    highScore = game.waveIndex + 1;
                    localStorage.setItem('kingdomDefense_highScore', highScore);
                }
            }
        }
        
        // Renders
        game.towers.forEach(t => t.draw(selectedTower));
        game.enemies.sort((a,b) => a.y - b.y);
        game.enemies.forEach(e => e.draw());
        game.particles.forEach(p => p.draw()); // Dibujar partículas
        game.projectiles.forEach(p => p.draw());

        if (selectedTower) updateUpgradePanel(); 
        document.getElementById('livesDisplay').innerText = game.lives;
        document.getElementById('moneyDisplay').innerText = game.money;
        document.getElementById('waveDisplay').innerText = game.waveIndex + 1;
        
        if (currentState === GAME_STATE.PAUSED) {
             ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0, canvas.width, canvas.height);
             ctx.fillStyle = 'white'; ctx.font = 'bold 40px Segoe UI'; ctx.textAlign = 'center'; ctx.fillText("PAUSA", 400, 300);
        }
    }
    else if (currentState === GAME_STATE.GAMEOVER) { drawMap(); game.towers.forEach(t => t.draw(null)); drawGameOver(); }
    else if (currentState === GAME_STATE.VICTORY) { drawMap(); game.towers.forEach(t => t.draw(null)); drawVictory(); }

    requestAnimationFrame(gameLoop);
}

loadAssets(() => { 
    console.log("Juego cargado. Esperando en MENU.");
    // NO llamamos a initGame() aquí para que el juego empiece en el MENÚ
    gameLoop(); 
});