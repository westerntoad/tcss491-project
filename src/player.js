class Player {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        // placeholder dev art
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/arrow.png");
        this.dir = 0; // 0 = north, 1 = east, 2 = south, 3 = west
    }

    update() {
        // TODO
    }
    
    draw(ctx) {
        const w = 32;
        const h = 32;
        const scale = 5;
        ctx.drawImage(this.spritesheet, this.dir * w, 0, w, h, this.x, this.y, w * scale, h * scale);
    }
}
