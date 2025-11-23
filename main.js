import Game from './src/Game.js';
import AudioManager from './src/engine/AudioManager.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const audio = new AudioManager(); // Init Audio
    const game = new Game(canvas, audio); // Pass Audio to Game

    // UI Elements
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const hud = document.getElementById('hud');
    const scoreDisplay = document.getElementById('score-display');
    const finalScoreDisplay = document.getElementById('final-score');
    const bestScoreDisplay = document.getElementById('best-score');
    
    // Buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const soundBtn = document.getElementById('sound-btn');
    const charBtns = document.querySelectorAll('.char-btn');

    let selectedChar = '😎';

    // Sound Toggle
    soundBtn.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        soundBtn.innerText = isMuted ? '🔇' : '🔊';
        audio.playClick();
    });

    // Character Selection
    charBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            charBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedChar = btn.dataset.char;
            audio.playClick(); // UI Click Sound
        });
    });

    // Start Game
    startBtn.addEventListener('click', () => {
        audio.playClick();
        startScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        game.start(selectedChar);
        gameLoopUI();
    });

    // Restart Game
    restartBtn.addEventListener('click', () => {
        audio.playClick();
        gameOverScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        game.start(selectedChar);
        gameLoopUI();
    });

    // Game Over Handler
    document.addEventListener('gameover', (e) => {
        const score = e.detail.score;
        hud.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        finalScoreDisplay.innerText = score;
        
        const best = localStorage.getItem('bestScore') || 0;
        if (score > best) {
            localStorage.setItem('bestScore', score);
            bestScoreDisplay.innerText = score;
        } else {
            bestScoreDisplay.innerText = best;
        }
    });

    function gameLoopUI() {
        if (game.isRunning) {
            scoreDisplay.innerText = game.score;
            requestAnimationFrame(gameLoopUI);
        }
    }
});