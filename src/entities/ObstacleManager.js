class Obstacle {
    constructor(game) {
        this.game = game;
        this.width = 60;
        this.height = 60;
        this.x = this.game.width;
        this.markedForDeletion = false;
        
        this.isFlying = Math.random() > 0.7;
        
        if (this.isFlying) {
            this.y = this.game.height - 220;
            this.image = '🛸'; // UFO
            this.color = '#ff0055'; // Red Glow
        } else {
            this.y = this.game.height - 110;
            // High visibility obstacles
            const types = ['🔥', '⚡', '🛑', '👾']; 
            this.image = types[Math.floor(Math.random() * types.length)];
            this.color = '#ff0000';
        }
    }

    update() {
        this.x -= this.game.speed;
        if (this.x < -100) this.markedForDeletion = true;
    }

    draw(ctx) {
        // Obstacle Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        ctx.font = '60px Segoe UI Emoji';
        ctx.fillText(this.image, this.x, this.y);
        
        ctx.shadowBlur = 0;
    }
}

export default class ObstacleManager {
    constructor(game) {
        this.game = game;
        this.obstacles = [];
        this.timer = 0;
        this.interval = 1500;
    }

    update(deltaTime) {
        if (this.timer > this.interval) {
            this.obstacles.push(new Obstacle(this.game));
            this.timer = 0;
            this.interval = Math.max(700, 1500 - (this.game.speed * 15));
        } else {
            this.timer += deltaTime;
        }

        this.obstacles.forEach(obj => obj.update());
        this.obstacles = this.obstacles.filter(obj => !obj.markedForDeletion);
    }

    draw(ctx) {
        this.obstacles.forEach(obj => obj.draw(ctx));
    }
}