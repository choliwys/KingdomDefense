import { game, ctx } from '../globals.js';

export class Projectile {
    constructor(x, y, target, damage, color, effect) {
        this.x = x; this.y = y; this.target = target;
        this.speed = 8; this.damage = damage; 
        this.hit = false; this.color = color; this.effect = effect;
    }
    update() {
        if (this.target.dead) { this.hit = true; return; }
        const dist = Math.hypot(this.target.x - this.x, this.target.y - this.y);
        if (dist < this.speed) {
            this.target.health -= this.damage;
            if (this.effect) this.target.applyEffect(this.effect);
            
            // --- BLOQUE MODIFICADO ---
            if (this.target.health <= 0 && !this.target.dead) { 
                this.target.dead = true; 
                this.target.spawnParticles(); // <--- ¡EXPLOSIÓN!
                game.money += 15; 
            }
            // -------------------------

            this.hit = true;
        } else {
            this.x += ((this.target.x - this.x) / dist) * this.speed;
            this.y += ((this.target.y - this.y) / dist) * this.speed;
        }
    }
    draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, 4, 0, Math.PI * 2); ctx.fill(); }
}