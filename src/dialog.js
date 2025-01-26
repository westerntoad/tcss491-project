class Dialog {
    constructor(scene, text) {
        Object.assign(this, {scene, text});
        this.z = 5;
        this.textSpeed = 1;
        this.timeElapsed = 0;
        this.dText = '';
    }

    update() {
        //this.timeElapsed += this.game.clockTick
        
    }

    draw(ctx) {
        const padding = 20;
        ctx.fillStyle = '#bbbbbb';
        ctx.fillRect(padding, PARAMS.canvasHeight * 2/3 + padding, PARAMS.canvasWidth - 2 * padding, PARAMS.canvasHeight / 3 - 2 * padding);
        ctx.fillStyle = '#000000';
        ctx.font = '40pt comic sans';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(this.text, padding * 2, PARAMS.canvasHeight * 2/3 + 2 * padding);
    }
}
