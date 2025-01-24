class Tile {
    constructor(scene, isTraversable, x, y, z, asset) {
        Object.assign(this, { scene, isTraversable, x, y, z });

        if (asset) {
            this.img = ASSET_MANAGER.getAsset(asset);
        }
    }

    update() { /* ~ unused ~ */ }

    draw(ctx) {
        const x = (this.x - this.scene.player.x - this.scene.player.dx) * this.scene.cellSize + (PARAMS.canvasWidth - this.scene.cellSize) / 2;
        const y = (this.y - this.scene.player.y - this.scene.player.dy) * this.scene.cellSize + (PARAMS.canvasHeight - this.scene.cellSize) / 2;

        if (this.img) {
            ctx.drawImage(this.img, x, y, this.scene.cellSize, this.scene.cellSize);
        }
    }
}
