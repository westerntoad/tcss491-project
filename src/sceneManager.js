class SceneManager {
    constructor(game) {
        this.game = game;
        this.cellSize = 75;

        gameEngine.addEntity(this);

        this.load(ASSET_MANAGER.getAsset("./maps/dev.json"));
    }

    load(map) {
        this.map = map;

        for (let i = 0; i < this.map.tiles.length; i++) {
            console.log(this.map.tiles[i]);
            this.map.tiles[i].img = ASSET_MANAGER.getAsset(this.map.tiles[0].asset);
        }

        gameEngine.addEntity(new Player(gameEngine, this, map.player.x, map.player.y));
    }

    isTraversable(x, y) {
        console.log(`${x}, ${y}`);

        for (let i = 0; i < this.map.tiles.length; i++) {
            const tile = this.map.tiles[i];
            if (tile.x == x && tile.y == y) {
                return tile.traversable;
            }
        }

        return x >= 0 && x < this.map.width && y >= 0 && y < this.map.height;
    }

    update() { /* currently unused */ }

    draw(ctx) {
        if (this.map) {
            for (let i = 0; i < this.map.width * this.map.height; i++) {
                const x = i % this.map.width;
                const y = Math.floor(i / this.map.height);

                
                ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);

                ctx.restore();
            }

            ctx.save();
            ctx.fillStyle = 'red';
            this.map.tiles.forEach((tile) =>{
                console.log(tile);
                if (tile.img) {
                    ctx.drawImage(tile.img, tile.x * this.cellSize, tile.y * this.cellSize, this.cellSize, this.cellSize);
                } else if (!tile.traversable) {
                    ctx.fillRect(tile.x * this.cellSize, tile.y * this.cellSize, this.cellSize, this.cellSize);
                }
            });
            ctx.restore();
        }
    }
}
