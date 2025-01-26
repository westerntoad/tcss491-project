
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
    constructor(game, pxWidth, pxHeight) {
        this.game = game;
        this.cellSize = 75;
        this.z = 0;
        this.cellSize = 75; // in px
        this.pxWidth = pxWidth;
        this.pxHeight = pxHeight;
        this.cellWidth = pxHeight;
        this.cellHeight = Math.ceil(game.ctx.height / this.cellSize);

        this.savedState = null; // save entity state
        this.savedMap = null; // save map state


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
        this.map = {};
        this.map.tiles = [];
        this.map.width = map.width;
        this.map.height = map.height;

        for (let i = 0; i < map.tiles.length; i++) {
            const tile = map.tiles[i];
            const entity = new Tile(this, tile.traversable, tile.x, tile.y, tile.z, tile.asset);

            this.map.tiles.push(entity);
            this.game.addEntity(entity);
        }

        /* ~DEBUG~ */
        const interactable = new Tile(this, false, 6, 2, 2, './assets/brick.png');
        interactable.interact = () => alert('hi');
        this.map.tiles.push(interactable);
        this.game.addEntity(interactable);
        /* ~DEBUG~ */

        this.player = new Player(this.game, this, map.player.x, map.player.y);
        this.game.addEntity(this.player);
        this.game.addEntity(this);
    }

    getTile(x, y) {
        for (let i = 0; i < this.map.tiles.length; i++) {
            const tile = this.map.tiles[i];
            if (tile.x == x && tile.y == y) {
                return tile;
            }
        }
        return null;
    }

    isTraversable(x, y) {
        const tile = this.getTile(x, y);
        if (tile) {
            return tile.isTraversable;
        } else {
            return x >= 0 && x < this.map.width && y >= 0 && y < this.map.height;
        }
    }

    update() {
        if (this.map) {
            this.game.ctx.restore();
            this.game.ctx.save();
            this.game.ctx.translate(100, 100);
        }


        // interactable tile
        if (this.game.keys['z']) {
            const facedTile = this.player.facingTile();
            const presentTile = this.getTile(facedTile.x, facedTile.y);
            if (presentTile && presentTile.interact) {
                presentTile.interact();
            }
            this.game.keys['z'] = false;
        }
    }

    draw(ctx) {
        if (this.map) {
            for (let i = 0; i < this.map.width * this.map.height; i++) {
                const x = i % this.map.width;
                const y = Math.floor(i / this.map.width);

                
                //ctx.strokeRect((x - this.player.x - this.player.dx) * this.cellSize, (y - this.player.y - this.player.dy) * this.cellSize, this.cellSize, this.cellSize);
                ctx.strokeRect((x - this.player.x - this.player.dx) * this.cellSize + (PARAMS.canvasWidth - this.cellSize) / 2, (y - this.player.y - this.player.dy) * this.cellSize + (PARAMS.canvasHeight - this.cellSize) / 2, this.cellSize, this.cellSize);

            }

            /*ctx.save();
            ctx.fillStyle = 'red';
            this.map.tiles.forEach((tile) =>{
                const x = (tile.x - this.player.x - this.player.dx) * this.cellSize + (PARAMS.canvasWidth - this.cellSize) / 2;
                const y = (tile.y - this.player.y - this.player.dy) * this.cellSize + (PARAMS.canvasHeight - this.cellSize) / 2;
                if (tile.img) {
                    ctx.drawImage(tile.img, x, y, this.cellSize, this.cellSize);
                } else if (!tile.traversable) {
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            });
            ctx.restore();*/
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
