class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 3;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = color;
        this.markedForDeletion = false;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95; // Shrink
        if (this.size < 0.5) this.markedForDeletion = true;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
    }
    create(x, y, color, count = 5) {
        for(let i=0; i<count; i++) {
            this.particles.push(new Particle(this.game, x, y, color));
        }
    }
    update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.markedForDeletion);
    }
    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}