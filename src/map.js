class Map {
    constructor(game, scene, map) {
        Object.assign(this, { game, scene });
        this.z = -5;

        this.specialTiles = [];
        
        this.changeMap(map, 3, 2);
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
            const entity = new Tile(this.scene, tile.traversable, tile.x, tile.y, tile.z, tile.asset);

            this.tiles.push(entity);
            this.game.addEntity(entity);
        }

        // load special tiles
        this.specialTiles = map.specialTiles;
        this.specialTiles.forEach(tile => {
            this.tiles.push(tile);
            this.game.addEntity(tile);
        });

        // place player at given x and y
        this.scene.player.x = x;
        this.scene.player.y = y;
    }

    update() { /* ~ unused */ }

    draw(ctx) {
        for (let i = 0; i < this.width * this.height; i++) {
            const x = i % this.width;
            const y = Math.floor(i / this.width);
            
            // draw tile outlines
            ctx.strokeRect(
                (x - this.scene.player.x - this.scene.player.dx) * this.scene.cellSize + (PARAMS.canvasWidth  - this.scene.cellSize) / 2,
                (y - this.scene.player.y - this.scene.player.dy) * this.scene.cellSize + (PARAMS.canvasHeight - this.scene.cellSize) / 2,
                this.scene.cellSize, this.scene.cellSize
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
MAPS.maryHouse = (scene) => {
    // initialize map from JSON asset
    const map = ASSET_MANAGER.getAsset("./maps/house.json");
    map.specialTiles = [];

    // set encounter rate
    scene.player.encounterRate = map.encounterRate;

    // TODO parse dialogue from JSON

    // SPECIAL TILES
    // Vera Mulberry
    const interactable = new Tile(scene, false, 8, 3, 2, './assets/grandmas/Vera_Mulberry.png', 0, 0, 32, 32);
    interactable.interact = () => scene.showDialog("y'like my cats?");
    map.specialTiles.push(interactable);

    // Exit
    const portalPoint = new Tile(scene, true, 8, 0, 0, './assets/portalPoint.png');
    portalPoint.stepOn = () => {
        // change to next map
        scene.map.changeMap(MAPS.dev(scene), 2, 2);
    };
    map.specialTiles.push(portalPoint);

    return map;
};

MAPS.dev = (scene) => {
    const map = ASSET_MANAGER.getAsset("./maps/dev.json");
    map.specialTiles = [];
    scene.player.encounterRate = 0.01;


    // SPECIAL TILES
    const exit = new Tile(scene, true, 0, 0, 10, './assets/portalPoint.png');
    exit.stepOn = () => {
        // change to next map
        scene.map.changeMap(MAPS.maryHouse(scene), 8, 1);
    };
    
    return map;
}
