class Map {
    constructor(game, scene) {
        Object.assign(this, { game, scene });
        this.z = -5;
        this.specialTiles = [];
        this.mainTileSheet = "./assets/tileSheet_main.png";

        this.player = new Player(game, scene, this, 0, 0);
        this.player.dir = 2; // set player facing south
        this.game.addEntity(this.player);
        this.dialogs = {};
        this.changeMap(MAPS.marysRoom(this), 3, 2);
        this.globalDialogIndex = 0;
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
        this.width = map.width;
        this.height = map.height;

        // load tiles from JSON
        for (let i = 0; i < map.tiles.length; i++) {
            const tile = map.tiles[i];
            const entity = new Tile(
                this, tile.traversable,
                tile.x, tile.y, tile.z,
                tile.asset, tile.sx, tile.sy
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
        if (this.game.pressed['z']) {
            if (!this.scene.dialog) {
                const facedTile = this.player.facingTile();
                const presentTiles = this.getTile(facedTile.x, facedTile.y);
                for (let i = 0; i < presentTiles.length; i++) {
                    presentTiles[i].interact?.();
                }
            }
        }
    }

    draw(ctx) {
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
    // initialize map from JSON asset
    const json = ASSET_MANAGER.getAsset("./maps/house.json");
    json.specialTiles = [];

    // TODO parse dialogue from JSON

    // SPECIAL TILES
    // Vera Mulberry
    const dialog = ASSET_MANAGER.getAsset("./dialogLoad.json");
    console.log(dialog);
    const interactable = new Tile(map, false, 8, 3, 2, './assets/grandmas/Vera_Mulberry.png', 0, 0, 32, 32);
    // interactable.interact = () => map.scene.showDialog("So, after she told me, I decided to whip up some of my best cookies this morning and head in while they’re fresh to speak with this Derek King.", "Vera");
    // interactable.interact = () => map.scene.showDialog("y'like my cats?");
    interactable.interact = () => {
        console.log(dialog.chapter1.length);
        console.log(dialog.chapter1[map.globalDialogIndex]);
        map.scene.showDialog(dialog.chapter1[map.globalDialogIndex]);
    };
    /**
     * interactable.interact = () => {
     * let i = 0;
     * }
     */
    json.specialTiles.push(interactable);

    // Exit
    const portalPoint = new Tile(map, true, 8, 0, 0, './assets/portalPoint.png');
    portalPoint.stepOn = () => {
        // change to next map
        map.changeMap(MAPS.marysMap(map), 6, 6);
        map.player.dir = 2;
    };
    json.specialTiles.push(portalPoint);

    return json;
};

MAPS.marysMap = (map) => {
    const json = ASSET_MANAGER.getAsset("./maps/marysMap.json");

    json.specialTiles = [];

    // temporary special tile to start auto battler
    const autobattlerTest = new Tile(map, true, 8, 8, 0, './assets/portalPoint.png');
    autobattlerTest.stepOn = () => {
        map.scene.battleScene(false);
    };
    json.specialTiles.push(autobattlerTest);

    return json;
}

