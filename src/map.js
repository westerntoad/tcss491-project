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
        this.globalDialogIndex = 0;
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
        if (this.game.pressed['z'] && !this.player.disableMovement) {
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
    json.specialTiles.push(...map.story.load(string));

    // const portalPoint = new Tile(map, true, 5, 4, 0, '');
    // portalPoint.stepOn = () => {
    //     // change to next map
    //     map.changeMap(MAPS.marysMap(map), 5, 7);
    //     map.player.dir = 2;
    // };
    // json.specialTiles.push(portalPoint);

    // // Chapter 1

    //testing combat in marysRoom
    // Chapter 2
    // const portals = new Tile(map, false, 1, 1, 0, "./assets/enemies/Jerry_Mulberry.png", 0, 0, 32, 32);
    // portals.interact = () => {
    //     map.scene.battleScene(
    //         [[{name: "1ntern", x: 0, y: 2}, {name: "1ntern", x: 0, y: 3}, {name: "1ntern", x: 0, y: 4},
    //         {name: "1ntern", x: 6, y: 2}, {name: "1ntern", x: 6, y: 3}, {name: "1ntern", x: 6, y: 4}
    //             ],

    //             [{name: "1ntern", x: 0, y: 1}, {name: "1ntern", x: 0, y: 0},
    //                 {name: "1ntern", x: 1, y: 0}, {name: "0verworked", x: 0, y: 2},
    //                 {name: "0verworked", x: 2, y: 0}],

    //             [{name: "J4nitor", x: 6, y: 0}, {name: "J4nitor", x: 6, y: 1},
    //                 {name: "J4nitor", x: 5, y: 0},
    //                 {name: "1ntern", x: 0, y: 6}, {name: "1ntern", x: 1, y: 6},
    //                 {name: "1ntern", x: 0, y: 5}],

    //             [{name: "J4nitor", x: 3, y: 6}, {name: "J4nitor", x: 3, y: 0},
    //                 {name: "J4nitor", x: 6, y: 3}, {name: "J4nitor", x: 6, y: 0},
    //                 {name: "J4nitor", x: 6, y: 6},
    //                 {name: "1ntern", x: 0, y: 2}, {name: "1ntern", x: 0, y: 3}, 
    //                 {name: "1ntern", x: 0, y: 4}
    //             ]], "Office", true, "Office");
    // };
    // const jerry = new Tile(map, false, 4, 1, 0, "./assets/enemies/Jerry_Mulberry.png", 0, 0, 32, 32);
    // jerry.interact = () => {
    //     map.scene.battleScene([
    //         [{name: "Jerry Mulberry", x: 3, y: 0}]], 
    //                 "Grass", false);
    // }
    // json.specialTiles.push(jerry);
    // json.specialTiles.push(portals);

    // const portal2 = new Tile(map, false, 17, 15, 0, "");
    // portal2.interact = () => {
    //     map.scene.battleScene([[{name: "chu", x: 0, y: 0}]], "Grass", false, "???", false, 1);
    // };
    // json.specialTiles.push(portal2);

    // //Chapter 3
    // const portals1 = new Tile(map, false, 1, 3, 0, "./assets/enemies/Derek_King.png", 0, 0, 32, 32);
    // portals1.interact = () => {
    //     map.scene.battleScene( // bernice & vera
    //         [[{name: "droplet", x: 0, y: 2}, {name: "droplet", x: 0, y: 3}, {name: "droplet", x: 0, y: 4},
    //             {name: "droplet", x: 1, y: 2}, {name: "droplet", x: 1, y: 3}, {name: "droplet", x: 1, y: 4},
    //             {name: "droplet", x: 0, y: 1}, {name: "droplet", x: 0, y: 5},
    //             {name: "droplet", x: 1, y: 1}, {name: "droplet", x: 1, y: 5},
    //             {name: "droplet", x: 0, y: 0}, {name: "droplet", x: 1, y: 0},
    //             {name: "droplet", x: 0, y: 6}, {name: "droplet", x: 1, y: 6}
    //         ],
    //         // bernice & ye-soon
    //         [{name: "waneChime", x: 2, y: 2}, {name: "waneChime", x: 1, y: 3}, {name: "waneChime", x: 2, y: 4},
    //             {name: "waneChime", x: 1, y: 2}, {name: "waneChime", x: 2, y: 3}, {name: "waneChime", x: 1, y: 4},
    //             {name: "waneChime", x: 0, y: 2}, {name: "waneChime", x: 0, y: 3}, {name: "waneChime", x: 0, y: 4},
    //             {name: "waneChime", x: 6, y: 6}, {name: "waneChime", x: 6, y: 0}
    //         ],
    //         [{name: "hopless", x: 0, y: 0}, {name: "hopless", x: 6, y: 0}, {name: "hopless", x: 3, y: 0}
    //         ]
    //         // at the end: bernice & pearl to clear the small fries.
    //         ], "Park", true, "Woebegone Park", false, 2);
    // };
    // json.specialTiles.push(portals1);
    return json;
};

MAPS.marysMap = (map) => {
    const json = ASSET_MANAGER.getAsset("./maps/marysMap.json");

    json.specialTiles = [];
    json.name = 'marysMap';
    json.specialTiles.push(...map.story.load("marysMap"));
    
    const marysRoom = new Tile(map, true, 6, 6, 0, './assets/portalPoint.png');
    marysRoom.stepOn = () => {
        map.changeMap(MAPS.marysRoom(map), 5, 4);
        map.player.dir = 2;
    };
    json.specialTiles.push(marysRoom);
    return json;
}

