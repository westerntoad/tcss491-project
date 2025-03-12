class Map {
    constructor(game, scene, save) {
        Object.assign(this, { game, scene });
        this.z = -5;
        this.specialTiles = [];
        this.mainTileSheet = "./assets/tileSheet_main.png";

        this.player = new Player(game, scene, this, 0, 0);
        this.player.dir = 2; // set player facing south
        this.game.addEntity(this.player);
        this.story = new Story(this, save);
        if (save) {
            if (save.map == 'marysRoom') {
                this.changeMap(MAPS.marysRoom(this), save.loc.x, save.loc.y);
            } else if (save.map == 'marysMap') {
                this.changeMap(MAPS.marysMap(this), save.loc.x, save.loc.y);
            }
        } else {
            this.changeMap(MAPS.marysRoom(this), 3, 2);
        }
        this.secret = [false, false, false];
    }

    hide() {
        this.tiles?.forEach(tile => tile.removeFromWorld = true);
    }

    show() {
        this.tiles?.forEach(tile => this.game.addEntity(tile));
    }

    getTile(x, y) {
        let tiles = [];
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
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

        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    changeMap(map, x, y) {
        // clear old map
        this.tiles?.forEach(tile => tile.removeFromWorld = true);

        this.tiles = [];
        this.currMapName = map.name;
        this.width = map.width;
        this.height = map.height;

        // load tiles from JSON
        for (let i = 0; i < map.tiles.length; i++) {
            const tile = map.tiles[i];
            const entity = new Tile(
                this, tile.traversable,
                tile.x, tile.y, tile.z,
                tile.asset, tile.sx, tile.sy,
                ...(tile.sh && tile.sw ? [tile.sh, tile.sw] : [])
            );

            this.tiles.push(entity);
            this.game.addEntity(entity);
        }

        // load special tiles from function
        this.specialTiles = map.specialTiles;
        this.specialTiles.forEach(tile => {
            this.tiles.push(tile);
            this.game.addEntity(tile);
        });

        // add a grass tile for each tile within the map width and height
        for (let i = 0; i < map.width * map.height; i++) {
            const x = i % map.width;
            const y = Math.floor(i / map.width);
            const randIdx = Math.floor(Math.random() * 6);
            const sx = 96 +           (randIdx % 3) * 16;
            const sy = 32 + Math.floor(randIdx / 3) * 16;

            const entity = new Tile(
                this, true,
                x, y, -10,
                this.mainTileSheet, sx, sy
            );

            this.tiles.push(entity);
            this.game.addEntity(entity);
        }

        // place player at given x and y
        this.player.x = x;
        this.player.y = y;
    }

    
    update() {
        if ((this.game.pressed['z'] || this.game.pressed['e']) && !this.player.disableMovement) {
            if (!this.scene.dialog) {
                const facedTile = this.player.facingTile();
                const presentTiles = this.getTile(facedTile.x, facedTile.y);
                for (let i = 0; i < presentTiles.length; i++) {
                    if(!presentTiles[i].removeFromWorld) presentTiles[i].interact?.();
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `#c8f6aa`;
        // draw tile outlines
        for (let i = 0; i < this.width * this.height; i++) {
            const x = i % this.width;
            const y = Math.floor(i / this.width);
            
            ctx.strokeRect(
                (x - this.player.x - this.player.dx) * PARAMS.cellSize + (PARAMS.canvasWidth  - PARAMS.cellSize) / 2,
                (y - this.player.y - this.player.dy) * PARAMS.cellSize + (PARAMS.canvasHeight - PARAMS.cellSize) / 2,
                PARAMS.cellSize, PARAMS.cellSize
            );

        }
        ctx.restore();
    }
}

/*
 * MAPS LISTED AS INDIVIDUAL FUNCTIONS
 *
 * Each map is stored as a single function. All the static tilemap data is stored as
 * a JSON file in maps/* while all interactables (here named special tiles) are within
 * this method.
 */
const MAPS = {}
MAPS.marysRoom = (map) => {
    // // initialize map from JSON asset
    const json = ASSET_MANAGER.getAsset("./maps/marysHouse.json");
    json.specialTiles = []; // receive a array of special tiles.
    const string = "marysRoom";
    json.name = string;
    json.specialTiles.push(...map.story.load(string));

    return json;
};

MAPS.marysMap = (map) => {
    const json = ASSET_MANAGER.getAsset("./maps/marysMap.json");

    json.specialTiles = [];
    json.name = 'marysMap';
    json.specialTiles.push(...map.story.load("marysMap"));
    
    const marysRoom = new Tile(map, true, 6, 6, 0, './assets/portalPoint.png');
    marysRoom.stepOn = () => {
        map.player.noUpdate = true;
        map.noUpdate = true;
        map.game.addEntity(new Transition(map.game, [
            () => {
                map.changeMap(MAPS.marysRoom(map), 5, 4);
                map.player.dir = 2;
                if (!PARAMS.altMusic) {
                    STOP.allMusic();
                }
            },
            () => {
                map.player.noUpdate = false;
                map.noUpdate = false;
                if (!PARAMS.altMusic) {
                    PLAY.house();
                }
            }
        ]));

    };
    json.specialTiles.push(marysRoom);
    return json;
}

