
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

        this.player = new Player(this.game, this, map.player.x, map.player.y);
        this.game.addEntity(this.player);
        this.game.addEntity(this);
    }

    isTraversable(x, y) {
        for (let i = 0; i < this.map.tiles.length; i++) {
            const tile = this.map.tiles[i];
            if (tile.x == x && tile.y == y) {
                return tile.isTraversable;
            }
        }

        return x >= 0 && x < this.map.width && y >= 0 && y < this.map.height;
    }

    update() {
        if (this.map) {
            this.game.ctx.restore();
            this.game.ctx.save();
            this.game.ctx.translate(100, 100);
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
        let i = random;
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
        this.game.ctx.translate(-100, -100);
        this.game.addEntity(new BattleScene(this.game, this, players, enemies));
    }
    restoreScene() {
        this.game.ctx.translate(100, 100);
        console.log("Restoring Overworld State");
        this.game.entities = this.savedState;
        this.map = this.savedMap;
        console.log("Restored Overworld");
    }
}
