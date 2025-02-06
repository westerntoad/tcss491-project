class Tile {
    constructor(map, isTraversable, x, y, z, asset, sx, sy, sw, sh) {
        Object.assign(this, { map, isTraversable, x, y, z });
        this.sx = sx || 0;
        this.sy = sy || 0;
        this.sw = sw || 16;
        this.sh = sh || 16;

        if (asset) {
            this.img = ASSET_MANAGER.getAsset(asset);
        }
    }

    update() { /* ~ unused ~ */ }

    draw(ctx) {
        if (!this.map.player) {
            //console.log('returned');
            return;
        }
        
        const x = (this.x - this.map.player.x - this.map.player.dx) * PARAMS.cellSize + (PARAMS.canvasWidth - PARAMS.cellSize) / 2;
        const y = (this.y - this.map.player.y - this.map.player.dy) * PARAMS.cellSize + (PARAMS.canvasHeight - PARAMS.cellSize) / 2;

        if (this.img) {
            ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, x, y, PARAMS.cellSize, PARAMS.cellSize);
        }
    }
}
