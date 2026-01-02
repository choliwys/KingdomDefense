import { game, ctx, IMAGES } from '../globals.js';
import { CELL_SIZE } from '../constants.js';
import { Particle } from './Particle.js';

export class Enemy {
    constructor(speed, hp, isBoss) {
        this.waypointIndex = 0;
        const startPoint = game.path[0];
        this.x = startPoint.x * CELL_SIZE + CELL_SIZE/2;
        this.y = startPoint.y * CELL_SIZE + CELL_SIZE/2;
        this.radius = 15;
        this.baseSpeed = speed; this.currentSpeed = speed;
        this.health = hp; this.maxHealth = hp;
        this.dead = false; this.isBoss = isBoss || false;
        this.img = this.isBoss ? IMAGES.boss : IMAGES.orc;
        this.freezeTimer = 0;
    }

    applyEffect(type) { if (type === 'FREEZE') this.freezeTimer = 90; }

    update() {
        // ... lógica de movimiento ...
        if (this.freezeTimer > 0) { this.currentSpeed = this.baseSpeed * 0.5; this.freezeTimer--; } 
        else { this.currentSpeed = this.baseSpeed; }

        const target = game.path[this.waypointIndex + 1];
        if (!target) { this.dead = true; game.lives -= 1; return; }
        
        const tx = target.x * CELL_SIZE + CELL_SIZE/2;
        const ty = target.y * CELL_SIZE + CELL_SIZE/2;
        const dist = Math.hypot(tx - this.x, ty - this.y);

        if (dist < this.currentSpeed) { this.x = tx; this.y = ty; this.waypointIndex++; } 
        else { this.x += ((tx - this.x) / dist) * this.currentSpeed; this.y += ((ty - this.y) / dist) * this.currentSpeed; }
    }

    spawnParticles() {
        const count = this.isBoss ? 20 : 8; // Más partículas si es jefe
        const color = this.isBoss ? '#800080' : '#6C8E23'; // Morado o Verde
        
        for (let i = 0; i < count; i++) {
            game.particles.push(new Particle(this.x, this.y, color));
        }
    }

    draw() {
        // ... (Tu draw sigue igual) ...
        let size = this.isBoss ? 40 : 30;
        if (this.img && this.img.complete) { try { ctx.drawImage(this.img, this.x - size/2, this.y - size/2, size, size); } catch (e) {} } 
        else { ctx.fillStyle = this.isBoss ? 'purple' : 'red'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fill(); }
        
        if (this.freezeTimer > 0) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.4)'; ctx.beginPath(); ctx.arc(this.x, this.y, size/1.5, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = 'black'; ctx.fillRect(this.x - 15, this.y - 25, 30, 4);
        ctx.fillStyle = this.health < this.maxHealth * 0.3 ? 'red' : '#0f0';
        ctx.fillRect(this.x - 15, this.y - 25, 30 * (this.health / this.maxHealth), 4);
    }
}