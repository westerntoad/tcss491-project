class Tile {
    constructor(scene, isTraversable, x, y, z, asset, sx, sy, sw, sh) {
        Object.assign(this, { scene, isTraversable, x, y, z });
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
        if (!this.scene.player) {
            //console.log('returned');
            return;
        }
        
        const x = (this.x - this.scene.player.x - this.scene.player.dx) * this.scene.cellSize + (PARAMS.canvasWidth - this.scene.cellSize) / 2;
        const y = (this.y - this.scene.player.y - this.scene.player.dy) * this.scene.cellSize + (PARAMS.canvasHeight - this.scene.cellSize) / 2;

        if (this.img) {
            ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, x, y, this.scene.cellSize, this.scene.cellSize);
        }
    }
}

const TILES = {};
TILES.grass = () => {};
