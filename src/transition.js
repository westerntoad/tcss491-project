class Transition {
    constructor(game, callbacks) {
        Object.assign(this, { game, callbacks });
        this.z = 500_000;
        this.performedCallback = false;
        this.isTransitionThing = true; // for the love of god don't ask what this is for
        PLAY.transition();

        this.elapsed = 0;
        //this.transitionType = randomInt(2);
        this.transitionType = 2;
    }

    update() {
        this.elapsed += this.game.clockTick;
        
        if (this.elapsed >= 1) {
            this.callbacks[1]();
            this.removeFromWorld = true;
        } else if (this.elapsed >= 0.5 && !this.performedCallback) {
            this.callbacks[0]();
            this.performedCallback = true;
        }
    }

    draw(ctx) {
        if (this.transitionType == 0) {
            const transp = 100 - Math.abs(100 - this.elapsed * 200);
            const color = Math.pow(this.elapsed * 20, 2);
            ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${transp}%)`;
            ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasWidth);
        } else if (this.transitionType == 1) {
            const w = PARAMS.canvasWidth - Math.abs(PARAMS.canvasWidth - this.elapsed * PARAMS.canvasWidth * 2);
            const h = PARAMS.canvasHeight;
            const x = (PARAMS.canvasWidth - w) / 2;
            const y = 0;
            ctx.fillStyle = `#000000`;
            ctx.fillRect(x, y, w, h);
        } else if (this.transitionType == 2) {
            ctx.fillStyle = `#000000`;
            const numRows = 12;
            const numColumns = 16;
            const bH = PARAMS.canvasHeight / numRows;
            const bW = PARAMS.canvasWidth / numColumns;

            for (let i = 0; i < numColumns; i++) {
                for (let j = 0; j < numRows; j++) {
                    const offset = (i + j) / 35;
                    let dt = 0;
                    if (this.elapsed <= 0.5) {
                        dt = clamp(0, this.elapsed*1.5 - offset, 0.5);
                    } else {
                        dt = clamp(0.5, this.elapsed*1.5 - offset, 1);
                    }
                    const dW = bW - Math.abs(bW - dt * bW * 2);
                    const dH = bH - Math.abs(bH - dt * bH * 2);
                    ctx.fillRect(i * bW + (bW - dW) / 2, j * bH + (bH - dH) / 2, dW, bH);
                }
            }
        }
    }
}
