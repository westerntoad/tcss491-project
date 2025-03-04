class AutoBG {
    constructor(game, num) {
        Object.assign(this, { game, num });
        this.z = -1;
        
        this.elapsed = 0;
        this.particleElapsed = 0;
        this.particleTimeout = 0.02;
    }

    update() {
        this.elapsed += this.game.clockTick;
        this.particleElapsed += this.game.clockTick;

        if (this.particleElapsed >= this.particleTimeout) {
            this.particleElapsed -= this.particleTimeout;
            const x = Math.random() * PARAMS.canvasWidth;
            const y = Math.random() * PARAMS.canvasHeight - 300;
            this.game.addEntity(new BGTriangle(this.game, x, y));
        }
        
    }

    draw(ctx) {
        
    }
}

class BGTriangle {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.z = -1;

        this.creationElapsed = 0;
        this.creationTimeout = 0;
        this.elapsed = 0;
        this.ySpeed = 1;
    }

    update() {
        console.log('x:', this.x, 'y:', this.y);
        this.elapsed += this.game.clockTick;
        this.ySpeed += this.elapsed * 0.2;
        this.y += this.ySpeed;

        if (this.y > PARAMS.canvasHeight) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        const base = 50;
        const height = 50;
        const lifetime = 1.5;
        ctx.fillStyle = `rgba(0, 144, 20, ${((lifetime - this.elapsed) / lifetime) * 100}%)`;
        //ctx.fillStyle = `#ff000088`;
        ctx.beginPath();
        ctx.moveTo(this.x - base / 2, this.y - height / 2);
        ctx.lineTo(this.x + base / 2, this.y - height / 2);
        ctx.lineTo(this.x, this.y + height / 2);
        ctx.fill();
        //ctx.fillRect(this.x, this.y, 100, 100);

    }
}
