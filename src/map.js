class Map {
    constructor(game, scene) {
        Object.assign(this, { game, scene });
        this.z = -5;
        this.specialTiles = [];
        this.mainTileSheet = "./assets/tileSheet_main.png";

        this.player = new Player(game, scene, this, 0, 0);
        this.player.dir = 2; // set player facing south
        this.game.addEntity(this.player);
        this.story = new Story(this);
        this.changeMap(MAPS.marysRoom(this), 3, 2);
        this.globalDialogIndex = 0;
        this.secret = [false];
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
                    if(!presentTiles[i].removeFromWorld) presentTiles[i].interact?.();
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
    json.specialTiles = []; // receive a array of special tiles.
    const string = "marysRoom";
    json.specialTiles.push(...map.story.load(string));

    const portalPoint = new Tile(map, true, 8, 0, 0, './assets/portalPoint.png');
    portalPoint.stepOn = () => {
        // change to next map
        map.changeMap(MAPS.marysMap(map), 5, 7);
        map.player.dir = 2;
    };
    json.specialTiles.push(portalPoint);

    //testing combat in marysRoom
    //Chapter 1
    const portals = new Tile(map, false, 1, 1, 0, "./assets/enemies/Jerry_Mulberry.png", 0, 0, 32, 32);
    portals.interact = () => {
        map.scene.battleScene([
            [{name: "L0neb0ne", x: 0, y: 3}, {name:"L0neb0ne", x: 6, y: 3}],

                [{name: "L0neb0ne", x: 1, y: 3}, {name:"L0neb0ne", x: 5, y: 3},
                    {name: "Mad@Chu", x: 3, y: 3}],

                [{name: "Mad@Chu", x: 2, y: 1}, {name:"Mad@Chu", x: 4, y: 1},
                    {name: "D3pr3ss0", x: 3, y: 0}],

                [{name:"Mad@Chu", x: 1, y: 1}, {name: "D3pr3ss0", x: 0, y: 1}, 
                    {name: "D3pr3ss0", x: 0, y: 0}],

                [{name: "L0neb0ne", x: 1, y: 1}, {name:"L0neb0ne", x: 2, y: 1},
                    {name: "L0neb0ne", x: 3, y: 1}, {name:"L0neb0ne", x: 4, y: 1},
                    {name: "L0neb0ne", x: 5, y: 1},
                    {name: "D3pr3ss0", x: 3, y: 0}, {name: "D3pr3ss0", x: 2, y: 0},
                    {name: "D3pr3ss0", x: 4, y: 0},
                    {name: "Mad@Chu", x: 0, y: 0}, {name:"Mad@Chu", x: 6, y: 0}]
                    ], 
                    "Grass", true);
    };
    // const jerry = new Tile(map, false, 4, 1, 0, "./assets/enemies/Jerry_Mulberry.png", 0, 0, 32, 32);
    // jerry.interact = () => {
    //     map.scene.battleScene([
    //         [{name: "Jerry Mulberry", x: 3, y: 0}]], 
    //                 "Grass", false);
    // }
    // json.specialTiles.push(jerry);
    json.specialTiles.push(portals);
    // //Chapter 2
    const portals1 = new Tile(map, false, 1, 3, 0, "./assets/enemies/Derek_King.png", 0, 0, 32, 32);
    portals1.interact = () => {
        map.scene.battleScene(
            [[{name: "droplet", x: 0, y: 2}, {name: "droplet", x: 0, y: 3}, {name: "droplet", x: 0, y: 4},
                {name: "droplet", x: 1, y: 2}, {name: "droplet", x: 1, y: 3}, {name: "droplet", x: 1, y: 4},
                {name: "droplet", x: 0, y: 1}, {name: "droplet", x: 0, y: 5},
                {name: "droplet", x: 1, y: 1}, {name: "droplet", x: 1, y: 5},
            ],
            [{name: "droplet", x: 0, y: 2}, {name: "droplet", x: 0, y: 3}, {name: "droplet", x: 0, y: 4},
                {name: "droplet", x: 1, y: 2}, {name: "droplet", x: 1, y: 4},
                {name: "waneChime", x: 2, y: 2}, {name: "waneChime", x: 1, y: 3}, {name: "waneChime", x: 2, y: 4}
            ],
            [{name: "hopless", x: 0, y: 0}, {name: "hopless", x: 6, y: 0}, {name: "hopless", x: 3, y: 0}
            ]
            ], "Park", true, "Woebegone Park");
    };
    json.specialTiles.push(portals1);
    return json;
};

MAPS.marysMap = (map) => {
    const json = ASSET_MANAGER.getAsset("./maps/marysMap.json");

    json.specialTiles = [];
    json.specialTiles.push(...map.story.load("marysMap"));

    
    const marysRoom = new Tile(map, true, 6, 6, 0, './assets/portalPoint.png');
    marysRoom.stepOn = () => {
        map.changeMap(MAPS.marysRoom(map), 8, 1);
        map.player.dir = 2;
    };
    json.specialTiles.push(marysRoom);

    if(!map.secret[0]){
        const secret = new Tile(map, true, 6, 3, 0, './assets/portalPoint.png', 16, 16, 16, 16);
        secret.interact = () => {
            map.scene.party.exp += 15;
            secret.removeFromWorld = true;
            map.secret[0] = true;
        };
        json.specialTiles.push(secret);
    }
    //ASSET_MANAGER.queueDownload("./assets/maps/areaOpen.png");
    const forest = [];
    forest.push(new Tile(map, false, 24, 9, -1, "./maps/areaOpen.png"));
    forest.push(new Tile(map, false, 24, 10, -1, "./maps/areaOpen.png"));
    forest.push(new Tile(map, false, 24, 11, -1, "./maps/areaOpen.png"));
    forest.push(new Tile(map, false, 24, 12, -1, "./maps/areaOpen.png"));
    forest.forEach(portals => {
        portals.interact = () => {
            map.scene.battleScene([
                [{name: "L0neb0ne", x: 0, y: 3}, {name:"L0neb0ne", x: 6, y: 3}],

                [{name: "L0neb0ne", x: 1, y: 3}, {name:"L0neb0ne", x: 5, y: 3},
                    {name: "Mad@Chu", x: 3, y: 3}],

                [{name: "Mad@Chu", x: 2, y: 1}, {name:"Mad@Chu", x: 4, y: 1},
                    {name: "D3pr3ss0", x: 3, y: 0}],

                [{name:"Mad@Chu", x: 1, y: 1}, {name: "D3pr3ss0", x: 0, y: 1}, 
                    {name: "D3pr3ss0", x: 0, y: 0}],

                [{name: "Mad@Chu", x: 1, y: 1}, {name: "Mad@Chu", x: 5, y: 1},
                    {name: "Mad@Chu", x: 2, y: 1}, {name: "Mad@Chu", x: 4, y: 1},
                    {name: "D3pr3ss0", x: 3, y: 0}, {name: "D3pr3ss0", x: 2, y: 0},
                    {name: "D3pr3ss0", x: 4, y: 0},
                    {name: "Mad@Chu", x: 0, y: 0}, {name:"Mad@Chu", x: 6, y: 0}]
                    ], 
                    "Grass", true, "Lonely Forest");
            map.story.questBattle = 7;
        };
    });
    json.specialTiles.push(...forest);

    for(let i = 0; i < 3; i++) { // Office
        const zone = new Tile(map, false, 10 + i, 30, -1, "./maps/areaOpen.png", 16, 0, 16, 16);
        zone.interact = () => {
            map.scene.battleScene(
                [[{name: "1ntern", x: 0, y: 2}, {name: "1ntern", x: 0, y: 3}, {name: "1ntern", x: 0, y: 4},
                {name: "1ntern", x: 6, y: 2}, {name: "1ntern", x: 6, y: 3}, {name: "1ntern", x: 6, y: 4}
                    ],
    
                    [{name: "1ntern", x: 0, y: 1}, {name: "1ntern", x: 0, y: 0},
                        {name: "1ntern", x: 1, y: 0}, {name: "0verworked", x: 0, y: 2},
                        {name: "0verworked", x: 2, y: 0}],
    
                    [{name: "J4nitor", x: 6, y: 0}, {name: "J4nitor", x: 6, y: 1},
                        {name: "J4nitor", x: 5, y: 0},
                        {name: "1ntern", x: 0, y: 6}, {name: "1ntern", x: 1, y: 6},
                        {name: "1ntern", x: 0, y: 5}],
    
                    [{name: "J4nitor", x: 3, y: 6}, {name: "J4nitor", x: 3, y: 0},
                        {name: "J4nitor", x: 6, y: 3}, {name: "J4nitor", x: 6, y: 0},
                        {name: "J4nitor", x: 6, y: 6},
                        {name: "1ntern", x: 0, y: 2}, {name: "1ntern", x: 0, y: 3}, 
                        {name: "1ntern", x: 0, y: 4}
                    ]], "Office", true, "Office");
                map.story.questBattle = 15;
        }
        json.specialTiles.push(zone);
    }

    for(let i = 0; i < 4; i++) { // Woebegone Park
        const zone = new Tile(map, false, 0, 13+i, -1, "./maps/areaOpen.png", 32, 0, 16, 16);
        zone.interact = () => {
            map.scene.battleScene(
                [[{name: "droplet", x: 0, y: 2}, {name: "droplet", x: 0, y: 3}, {name: "droplet", x: 0, y: 4},
                {name: "droplet", x: 6, y: 2}, {name: "droplet", x: 6, y: 3}, {name: "droplet", x: 6, y: 4}
                    ]], "Park", true, "Woebegone Park");
        }
        json.specialTiles.push(zone);
    }
    return json;
}

