class DamageNum {
    constructor(game, x, y, num, isEnemyDealt) {
        // not very intuitive naming convetion here:
        // isEnemyDealt will be true if this damage is being done
        // to an enemy.
        Object.assign(this, { game, num, isEnemyDealt });
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y + (Math.random() - 0.5) * 40;
        this.z = 100_000;
        this.elapsed = 0;
        this.lifetime = 1;
        this.size = 16 + Math.sqrt(num);
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
        ctx.fillStyle = this.isEnemyDealt ? '#ff00aa' : '#ffaa00';
        ctx.fillText(this.num, this.x, this.y - this.elapsed * 50);

        ctx.restore();
    }
}
