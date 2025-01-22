
const DUNGEON_ENCOUNTERS = {
    "Cave": [
        { name: "Sad Bones", hp: 30, attack: 5 },
        { name: "BooHoo", hp: 50, attack: 10 },
        { name: "Mad@chu", hp: 25, attack: 3 }
    ],
    "Ruins": [
        { name: "Skeleton", hp: 60, attack: 12 },
        { name: "Ghost", hp: 40, attack: 8 },
        { name: "Zombie", hp: 70, attack: 15 }
    ],
    "Volcano": [
        { name: "Fire Sprite", hp: 35, attack: 7 },
        { name: "Lava Slime", hp: 45, attack: 10 },
        { name: "Flame Serpent", hp: 80, attack: 18 }
    ]
};

class SceneManager {
    constructor(game) {
        this.game = game;
        this.cellSize = 75;

        this.savedState = null; // save entity state
        this.savedMap = null; // save map state

        gameEngine.addEntity(this);

        this.load(ASSET_MANAGER.getAsset("./maps/dev.json"));
        this.map.type = "Cave";
    }
    isDungeon(){
        console.log("Checking if dungeon. Current map type:", this.map?.type);
        console.log(this.map.type == "Cave");
        return (this.map.type === "Cave" ||
            this.map.type === "Ruins" ||
            this.map.type === "Volcano"
        )
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
                if (tile.img) {
                    ctx.drawImage(tile.img, tile.x * this.cellSize, tile.y * this.cellSize, this.cellSize, this.cellSize);
                } else if (!tile.traversable) {
                    ctx.fillRect(tile.x * this.cellSize, tile.y * this.cellSize, this.cellSize, this.cellSize);
                }
            });
            ctx.restore();
        }
    }
    battleScene(isBoss) {
        console.log("Entered Battle Scene");
        this.savedState = this.game.entities;
        this.savedMap = this.map;
        
        const enemies = DUNGEON_ENCOUNTERS[this.map.type];
        const players = this.game.grannies;

        console.log('Enemies:', enemies);
        console.log('Players:', players);

        this.game.entities = []; // Clear current entities
        this.game.addEntity(new BattleScene(this.game, this, players, enemies));
    }
    restoreScene() {
        console.log("Restoring Overworld State");
        this.game.entities = savedState;
        this.map = savedMap;
        console.log("Restored Overworld");
    }
}
