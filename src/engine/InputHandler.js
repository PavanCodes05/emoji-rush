export default class InputHandler {
    constructor() {
        this.keys = [];
        this.touchY = '';
        this.touchThreshold = 30;

        window.addEventListener('keydown', e => {
            if ((e.key === ' ' || e.key === 'ArrowUp') && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });

        window.addEventListener('keyup', e => {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });

        window.addEventListener('touchstart', () => {
            this.keys.push(' '); // Simulate Space on tap
        });

        window.addEventListener('touchend', () => {
            this.keys.splice(this.keys.indexOf(' '), 1);
        });
    }
}