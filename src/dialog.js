class Dialog {
    constructor(game, scene, text) {
        Object.assign(this, {game, scene, text});
        this.z = 10;
        this.textSpeed = 0.2; // characters per second
        this.timeElapsed = 0;
        this.dText = '';
        this.nextCharIndex = 0;
    }

    update() {
        this.timeElapsed += this.game.clockTick
        if (this.timeElapsed >= this.textSpeed) {
            this.timeElapsed -= this.textSpeed;
            this.dText += this.text.charAt(this.nextCharIndex);
            this.nextCharIndex++;
        }
        
    }

    draw(ctx) {
        const padding = 20;
        ctx.fillStyle = '#bbbbbb';
        ctx.fillRect(padding, PARAMS.canvasHeight * 2/3 + padding, PARAMS.canvasWidth - 2 * padding, PARAMS.canvasHeight / 3 - 2 * padding);
        ctx.fillStyle = '#000000';
        ctx.font = '40pt comic sans';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(this.dText, padding * 2, PARAMS.canvasHeight * 2/3 + 2 * padding);
    }
}
