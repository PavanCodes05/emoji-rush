export default class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.isMuted = false;
        
        // Background Music (You need an mp3 for this, or we leave it silent for now)
        this.bgm = new Audio(); 
        this.bgm.loop = true;
        this.bgm.volume = 0.4;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if(this.isMuted) {
            this.bgm.pause();
            if(this.ctx.state === 'running') this.ctx.suspend();
        } else {
            // this.bgm.play(); // Uncomment if you add an mp3 source
            if(this.ctx.state === 'suspended') this.ctx.resume();
        }
        return this.isMuted;
    }

    playClick() {
        if (this.isMuted) return;
        this.playTone(600, 'sine', 0.05); // High beep
    }

    playJump() {
        if (this.isMuted) return;
        // Slide pitch up
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playCrash() {
        if (this.isMuted) return;
        // Sawtooth wave dropping in pitch (Explosion-ish)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Generic tone generator
    playTone(freq, type, duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
        osc.stop(this.ctx.currentTime + duration);
    }
}