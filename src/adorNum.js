class AdorNum {
    constructor(game, x, y, num) { // Copied from Abe's DamageNum
        Object.assign(this, { game, num});
        this.x = x + 48 + (Math.random()) * 40;
        this.y = y + (Math.random() - 0.25) * 80;
        this.z = 100_000;
        this.elapsed = 0;
        this.lifetime = 2;
        this.size = 18 + Math.sqrt(Math.pow(num, 1.75));
        // console.log("something died");
    }

    update() {
        this.elapsed += this.game.clockTick;
        
        if (this.elapsed >= this.lifetime) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.font = `bold ${this.size}px runescape`;
        ctx.fillStyle = '#b347cc';
        ctx.lineWidth = this.size / 32;
        ctx.strokeStyle = 'black';

        ctx.fillText("+ " + this.num, this.x, this.y - this.elapsed * 50);
        ctx.strokeText("+ " + this.num, this.x, this.y - this.elapsed * 50);

        ctx.restore();
    }
}
