export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 70; 
        this.height = 70;
        this.x = 100;
        this.groundLimit = this.game.height - 100;
        this.y = this.groundLimit;
        
        this.image = '😎';
        this.speedY = 0;
        this.weight = 1.2;
    }

    update(input) {
        // Jump Logic
        if (input.keys.includes(' ') && this.onGround()) {
            this.speedY = -25;
            this.game.audio.playJump();
            // Neon Jump Particles
            this.game.particles.create(this.x + 35, this.y + 70, '#00f3ff', 10);
        }

        this.y += this.speedY;
        
        if (!this.onGround()) {
            this.speedY += this.weight;
        } else {
            this.speedY = 0;
            this.y = this.groundLimit;
        }
    }

    draw(ctx) {
        // Player Glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ffff00'; // Yellow Glow

        // Draw Emoji
        ctx.font = '70px Segoe UI Emoji';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(this.image, this.x, this.y);
        
        // Reset Shadow for next items
        ctx.shadowBlur = 0;
    }

    onGround() {
        return this.y >= this.groundLimit;
    }

    setEmoji(emoji) {
        this.image = emoji;
    }
}