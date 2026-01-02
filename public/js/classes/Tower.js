import { game, ctx, IMAGES } from '../globals.js';
import { Projectile } from './Projectile.js';
import { SoundManager } from '../SoundManager.js';

export class Tower {
    constructor(x, y, type) {
        this.x = x; this.y = y; this.typeData = type;
        this.name = type.name; this.range = type.range; this.damage = type.damage;
        this.fireRate = type.fireRate; this.img = IMAGES[type.imgKey];
        this.timer = 0; this.level = 1; this.maxLevel = 5; this.baseCost = type.cost;
        this.effect = type.effect; this.soundType = type.soundType;
    }
    upgrade() {
        if (this.level >= this.maxLevel) return;
        this.level++;
        this.damage = Math.floor(this.damage * 1.4); this.range = Math.floor(this.range * 1.1);
        if (this.fireRate > 10) this.fireRate = Math.floor(this.fireRate * 0.9);
        SoundManager.playBuild();
    }
    getUpgradeCost() { return Math.floor(this.baseCost * 0.8 * this.level); }
    getSellValue() { return Math.floor(this.baseCost * 0.5 * this.level); }
    update() {
        this.timer++;
        if (this.timer >= this.fireRate) {
            for (let enemy of game.enemies) {
                if (Math.hypot(enemy.x - this.x, enemy.y - this.y) <= this.range) {
                    game.projectiles.push(new Projectile(this.x, this.y, enemy, this.damage, this.typeData.projectileColor, this.effect));
                    SoundManager.playShoot(this.soundType);
                    this.timer = 0; break;
                }
            }
        }
    }
    draw(selectedTower) {
        let drawn = false;
        if (this.img && this.img.complete) { try { ctx.drawImage(this.img, this.x - 20, this.y - 20, 40, 40); drawn = true; } catch (e) {} }
        if (!drawn) { ctx.fillStyle = this.typeData.fallbackColor; ctx.fillRect(this.x - 20, this.y - 20, 40, 40); }
        
        ctx.fillStyle = '#FFD700';
        for(let i=0; i<this.level; i++) { ctx.beginPath(); ctx.arc(this.x - 15 + (i*8), this.y - 15, 2, 0, Math.PI*2); ctx.fill(); }
        
        if (selectedTower === this) {
            ctx.beginPath(); ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)'; ctx.lineWidth = 2;
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = 'rgba(255, 215, 0, 0.1)'; ctx.fill();
        }
    }
}