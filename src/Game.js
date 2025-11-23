import Player from './entities/Player.js';
import ObstacleManager from './entities/ObstacleManager.js';
import ParticleSystem from './entities/ParticleSystem.js';
import InputHandler from './engine/InputHandler.js';
import { checkCollision } from './utils/collision.js';

export default class Game {
    constructor(canvas, audioManager) {
        this.canvas = canvas;
        this.audio = audioManager;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth;
        this.height = canvas.height = window.innerHeight;
        
        this.input = new InputHandler();
        this.player = new Player(this);
        this.obstacles = new ObstacleManager(this);
        this.particles = new ParticleSystem(this);

        this.speed = 0; 
        this.score = 0;
        this.isRunning = false;
        
        // Grid Animation
        this.gridOffset = 0;
        
        window.addEventListener('resize', () => {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.player.groundLimit = this.height - 100;
        });
    }

    start(emoji) {
        this.player.setEmoji(emoji);
        this.reset();
        this.isRunning = true;
        this.speed = 10; 
        this.animate(0);
    }

    reset() {
        this.player.y = this.player.groundLimit;
        this.player.speedY = 0;
        this.obstacles.obstacles = [];
        this.particles.particles = [];
        this.score = 0;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Move Grid
        this.gridOffset -= this.speed;
        if (this.gridOffset < -100) this.gridOffset = 0;

        // Logic
        this.player.update(this.input);
        this.obstacles.update(deltaTime);
        this.particles.update();

        this.speed += 0.005;
        this.score++;

        // Collision
        this.obstacles.obstacles.forEach(obstacle => {
            if (checkCollision(this.player, obstacle)) {
                this.gameOver();
            }
        });
    }

    draw() {
        // 1. Clear with Trail Effect (Motion Blur)
        this.ctx.fillStyle = 'rgba(5, 5, 16, 0.3)'; // Semi-transparent black
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2. Draw Retro Grid Floor (Synthwave Style)
        this.drawGrid();

        // 3. Draw Floor Line
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 50);
        this.ctx.lineTo(this.width, this.height - 50);
        this.ctx.stroke();

        // 4. Entities (With Glow)
        this.player.draw(this.ctx);
        this.obstacles.draw(this.ctx);
        
        // Particles (No glow to save performance)
        this.ctx.shadowBlur = 0; 
        this.particles.draw(this.ctx);
    }

    drawGrid() {
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'rgba(188, 19, 254, 0.2)'; // Faint Purple
        this.ctx.lineWidth = 2;
        
        // Vertical Lines (Perspective)
        const centerX = this.width / 2;
        for (let i = -10; i <= 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + (i * 100), this.height);
            this.ctx.lineTo(centerX + (i * 20), this.height / 2); // Vanishing point
            this.ctx.stroke();
        }

        // Horizontal Moving Lines
        for (let i = 0; i < 10; i++) {
            const y = (this.height / 2) + (i * 50) + (this.gridOffset % 50);
            if (y > this.height) continue;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    gameOver() {
        this.isRunning = false;
        this.audio.playCrash();
        // Explosion Effect
        this.particles.create(this.player.x + 30, this.player.y + 30, '#ff0000', 50);
        this.draw(); // Draw one last frame with explosion
        
        const event = new CustomEvent('gameover', { detail: { score: this.score } });
        document.dispatchEvent(event);
    }

    animate(timeStamp) {
        if (!this.isRunning) return;
        const deltaTime = timeStamp - this.lastTime || 0;
        this.lastTime = timeStamp;
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }
}