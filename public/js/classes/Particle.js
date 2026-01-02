import { ctx } from '../globals.js';

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        // Velocidad aleatoria en X e Y (explosión)
        this.vx = (Math.random() - 0.5) * 5; 
        this.vy = (Math.random() - 0.5) * 5; 
        this.radius = Math.random() * 3 + 2; // Tamaño aleatorio entre 2 y 5
        this.life = 1.0; // Opacidad (empieza en 100%)
        this.decay = Math.random() * 0.03 + 0.02; // Qué tan rápido desaparece
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw() {
        ctx.save(); // Guardamos el estado del canvas
        ctx.globalAlpha = this.life; // Hacemos transparente lo siguiente que dibujemos
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore(); // Restauramos para no afectar a otros dibujos
    }
}