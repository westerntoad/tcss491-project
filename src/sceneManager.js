
const DUNGEON_ENCOUNTERS = {
    "Grass": [
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
        this.z = 0;
        this.cellSize = 75; // in px
        this.pxWidth = pxWidth;
        this.pxHeight = pxHeight;
        this.cellWidth = pxHeight;
        this.cellHeight = Math.ceil(game.ctx.height / this.cellSize);
        this.backgroundColor = '#ffffff';
        this.isDungeon = false;
        this.player = new Player(this.game, this, 0, 0);
        this.game.addEntity(this.player);

        this.savedState = null; // save entity state
        this.savedMap = null; // save map state

        this.map = new Map(this.game, this, MAPS.marysRoom(this));
        this.player.dir = 2;
        this.game.addEntity(this.map);

        this.game.addEntity(this);
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
                console.log('test');
                this.hideDialog();
            } else {
                const facedTile = this.player.facingTile();
                const presentTiles = this.getTile(facedTile.x, facedTile.y);
                console.log('test');
                for (let i = 0; i < presentTiles.length; i++) {
                    presentTiles[i].interact?.();
                }
            }
            this.game.keys['z'] = false;
        }
    }

    draw(ctx) { /* ~ unused */ }

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
        let i = 2;
        while(i >= 0) {
            enemies.push(
                Object.assign({}, this.getRandomEncounter("Grass"))
            );
            i--;
        }

        const players = this.game.grannies;

        console.log('Enemies:', enemies);
        console.log('Players:', players);

        this.game.entities = []; // Clear current entities
        this.game.addEntity(new BattleScene(this.game, this, players, enemies));
        ASSET_MANAGER.getAsset("./assets/soundtrack/battle-theme.mp3").play();
    }
    restoreScene() {
        console.log("Restoring Overworld State");
        this.game.entities = this.savedState;
        this.map = this.savedMap;
        console.log("Restored Overworld");
    }
}
