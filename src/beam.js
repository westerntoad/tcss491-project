class Beam {
    constructor(game, orig, dest, damage) {
        // not very intuitive naming convetion here:
        // isEnemyDealt will be true if this damage is being done
        // to an enemy.
        Object.assign(this, { game, orig, dest });
        this.z = 100_000;
        this.elapsed = 0;
        this.lifetime = 0.1;
        this.size = 2 + Math.sqrt(Math.pow(damage, 1.5)) * 0.2;
    }

    update() {
        this.elapsed += this.game.clockTick;
        
        if (this.elapsed >= this.lifetime) {
            console.log('clearing', this);
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = '#ff0000'
        ctx.moveTo(this.orig.x, this.orig.y);
        ctx.lineTo(this.dest.x, this.dest.y);
        ctx.lineWidth = this.size;
        ctx.stroke();

        ctx.restore();
    }
}
