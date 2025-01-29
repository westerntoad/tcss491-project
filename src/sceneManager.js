
const DUNGEON_ENCOUNTERS = {
    "Cave": [
        /**{
                    name: "Vera Mulberry",
                    asset: "./assets/grandmas/Vera_Mulberry.png",
                    maxHp: 20,
                    hp: 20,
                    attack: 10,
                    defense: 5,
                    speed: 1,
                    exp: 5,
                    attackRate: 0.7,
                    defendRate: 0.3,
                    specialRate: 0
                } */
        { name: "L0neb0ne",
            maxHp: 50,
            hp: 50,
            attack: 10,
            defense: 5,
            speed: 1,
            exp: 3,
            attackRate: 0.5,
            defendRate: 0.5,
            specialRate: 0,
            asset: "./assets/enemies/L0neb0ne.png"
         },
        { name: "D3pr3ss0",
            maxHp: 25,
            hp: 25,
            attack: 25,
            defense: 10,
            speed: 2,
            exp: 4,
            attackRate: 0.9,
            defendRate: 0.1,
            specialRate: 0,
            asset: "./assets/enemies/D3pr3ss0.png"
         },
        { name: "Mad@Chu",
            maxHp: 30,
            hp: 30,
            attack: 15,
            defense: 2,
            speed: 2,
            exp: 2,
            attackRate: 0.75,
            defendRate: 0.25,
            specialRate: 0,
            asset: "./assets/enemies/Mad@Chu.png"
         }
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
        this.backgroundColor = '#ffffff';
        this.isDungeon = false;

        this.savedState = null; // save entity state
        this.savedMap = null; // save map state


        this.load(ASSET_MANAGER.getAsset("./maps/house.json"));
        this.map.type = "Cave";
    }


    /*isDungeon() {
        /*console.log("Checking if dungeon. Current map type:", this.map?.type);
        console.log(this.map.type == "Cave");
        return (this.map.type === "Cave" ||
            this.map.type === "Ruins" ||
            this.map.type === "Volcano"
        )*/
        /*return this.isDungeon;
    }*/

    load(map) {
        // clear old map
        this.map?.tiles?.forEach(tile => tile.removeFromWorld = true);

        this.map = {};
        this.map.tiles = [];
        this.map.width = map.width;
        this.map.height = map.height;

        for (let i = 0; i < map.tiles.length; i++) {
            const tile = map.tiles[i];
            let sw = 32;
            let sh = 32;
            console.log(tile.asset);
            if (tile.asset == './assets/houseTiles.png') {
                sw = 16;
                sh = 16;
            }
            const entity = new Tile(this, tile.traversable, tile.x, tile.y, tile.z, tile.asset, 0, 0, sw, sh);

            this.map.tiles.push(entity);
            this.game.addEntity(entity);
        }

        /* ~DEBUG~ */
        if (map.height == 7) {
            const interactable = new Tile(this, false, 8, 3, 2, './assets/grandmas/Vera_Mulberry.png');
            interactable.interact = () => this.showDialog("y'like my cats?");
            this.map.tiles.push(interactable);
            this.game.addEntity(interactable);
            const portalPoint = new Tile(this, true, 8, 0, 0, './assets/portalPoint.png', 0, 0, 16, 16);
            this.map.tiles.push(portalPoint);
            this.game.addEntity(portalPoint);
            portalPoint.stepOn = () => {
                this.isDungeon = true;
                this.player.encounterRate = 0.1;
                this.load(ASSET_MANAGER.getAsset("./maps/dev2.json"));
                //const tile = new Tile(this, 0, 0, -5, "./assets/singlegrass.png");
                //this.map.tiles.push(tile);
                //this.game.addEntity(tile);
                for (let i = 0; i < 20 * 20; i++) {
                    const x = i % 20;
                    const y = Math.floor(i / 20);
                    const tile = new Tile(this, true, x, y, -5, "./assets/singlegrass.png");
                    this.map.tiles.push(tile);
                    this.game.addEntity(tile);
                }
            };
        }
        /* ~DEBUG~ */

        if (!this.player) {
            this.player = new Player(this.game, this, map.player.x, map.player.y);
            this.game.addEntity(this.player);
            this.game.addEntity(this);
        } else {
            this.player.x = map.player.x;
            this.player.y = map.player.y;
        }
    }

    getTile(x, y) {
        let tiles = [];
        for (let i = 0; i < this.map.tiles.length; i++) {
            const tile = this.map.tiles[i];
            if (tile.x == x && tile.y == y) {
                tiles.push(tile);
            }
        }

        return tiles;
    }

    isTraversable(x, y) {
        const tiles = this.getTile(x, y);
        for (let i = 0; i < tiles.length; i++) {
            if (!tiles[i].isTraversable) {
                return false;
            }
        }

        return x >= 0 && x < this.map.width && y >= 0 && y < this.map.height;
    }

    showDialog(text) {
        this.dialog = new Dialog(this.game, this, text);
        this.game.addEntity(this.dialog);
        this.player.disableMovement = true;
    }

    hideDialog() {
        this.dialog.removeFromWorld = true;
        this.dialog = undefined;
        this.player.disableMovement = false;
    }

    update() {
        // interactable tile
        if (this.game.keys['z']) {
            if (this.dialog) {
                this.hideDialog();
            } else {
                const facedTile = this.player.facingTile();
                const presentTiles = this.getTile(facedTile.x, facedTile.y);
                for (let i = 0; i < presentTiles.length; i++) {
                    presentTiles[i].interact?.();
                }
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
    getRandomEncounter(dungeonType) {
        const enemies = DUNGEON_ENCOUNTERS[dungeonType]; // Get the array of enemies
    
        if (!enemies) {
            console.error("Invalid dungeon type!");
            return null;
        }
    
        const randomIndex = Math.floor(Math.random() * enemies.length); // Roll for a random enemy
        return enemies[randomIndex]; // Return the selected enemy
    }
    battleScene(isBoss) {
        console.log("Entered Battle Scene");
        this.savedState = this.game.entities;
        this.savedMap = this.map;
        
        const enemies = [];
        const random = Math.floor(Math.random() * 2);
        let i = 0;
        while(i >= 0) {
            enemies.push(
                Object.assign({}, this.getRandomEncounter("Cave"))
            );
            i--;
        }

        const players = this.game.grannies;

        console.log('Enemies:', enemies);
        console.log('Players:', players);

        this.game.entities = []; // Clear current entities
        this.game.addEntity(new BattleScene(this.game, this, players, enemies));
    }
    restoreScene() {
        console.log("Restoring Overworld State");
        this.game.entities = this.savedState;
        this.map = this.savedMap;
        console.log("Restored Overworld");
    }
}
