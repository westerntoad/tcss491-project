class SceneManager {
    constructor(game) {
        this.game = game;
        this.cellSize = 75;

        gameEngine.addEntity(this);

        this.load(ASSET_MANAGER.getAsset("./maps/dev.json"));
    }

    load(map) {
        this.map = map;

        gameEngine.addEntity(new Player(gameEngine, this, map.player.x, map.player.y));
    }

    update() { /* currently unused */ }

    draw(ctx) {
        if (this.map) {
            for (let i = 0; i < this.map.width * this.map.height; i++) {
                const x = i % this.map.width * this.cellSize;
                const y = Math.floor(i / this.map.height) * this.cellSize;
                ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                //this.ctx.clearRect((i % width) + 1, Math.floor(i / height) + 1, cellSize - 2, cellSize - 2);
            }
        }
    }
}
