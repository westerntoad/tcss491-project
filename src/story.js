class Story {
    constructor(map){
        Object.assign(this, {map});
        this.map = map;
        this.globalProg = 0;
        this.key = null;
        this.questIcon = './dialog/quest.png';
        this.dialog = ASSET_MANAGER.getAsset("./dialog/dialogLoad.json");
        console.log("here");
        this.specialTiles = [];
        this.dialogIndex = 0;
        this.getPortal = null; // use to get portal.
        this.openPortals = [];
        this.awaitBattle = false;
        this.queue = [];
    }
    // PLEASE DON'T ERASE THIS YET (mentally processing next steps).
        // mangaPanel on this same class, pulled from "asset":, in dialogLoad.
        /** additions to dialogLoad:
         *      asset, assetX, assetY,
         *      asset.width, asset.height
         * Showing progression in mangaPanel will be track currPanel with [], 
         * anything else in array, previously, will be drawn transparent = 50% OVER a black screen?
         * STORE previous panel's x and y in a set with:
         *      const string = `${x}, ${y}`
         * 
         * we'll also store the current asset, and if the current asset
         * we can also have a "end" : true, in dialogLog, that will signify ending >>> if(ending) end;
         * 
         * this.manga.currPanel;
         * if(this.manga.currPanel.ending) this.manga.removeFromWorld = true;
         */ 
        // we already send in the full object containing the:
        // (speaking, content, asset, assetX, assetY, assetWidth, assetHeight);

        /** create a new class storyProgression that keeps track of current dialog index
         *  and assigns what has the key to next dialog. 
         *      Should be allowed to change map.json entities (announce them dead or not),
         *      might have to change the entity in the Tile[] that is held in map.js
         * */
    load(string = this.currMap){// let's just manually input
        this.currMap = string;
        switch(this.globalProg) {
            case 0:
                if(this.currMap === "marysRoom"){
                const quest = new Tile(this.map, false, 2, 0, 5, this.questIcon);
                quest.interact = () => this.progress();
                this.specialTiles.push(quest);
                }
                break;
            // case 1:
            //     const portalPoint = new Tile(this.map, true, 8, 0, 0, './assets/portalPoint.png');
            //     portalPoint.stepOn = () => {
            //         // change to next map
            //         this.map.changeMap(MAPS.marysMap(this.map), 6, 7);
            //         this.map.player.dir = 2;
            //     };
            //     this.specialTiles.push(portalPoint);
            //     break;
            case 1:
                if(this.currMap == "marysRoom"){
                    const quest = new Tile(this.map, true, 6, 0, 5, this.questIcon);
                    const basket = new Tile(this.map, false, 6, 1, 5, 
                        './dialog/basket.png', 0, 0, 32, 32
                    );
                    basket.interact = () => this.progress();
                this.specialTiles.push(basket);
                this.specialTiles.push(quest);
                }
            case 2:
                if(this.currMap == "marysMap"){
                    const quest = new Tile(this.map, true, 4, 8, 5, this.questIcon);
                    const vera =  new Tile(this.map, false, 4, 9, 5, 
                        './assets/grandmas/Vera_Mulberry.png', 0, 0, 32, 32);
                    vera.interact = () => {
                        this.progress();
                        this.map.scene.addToParty("Vera Mulberry");
                    };
                    this.specialTiles.push(quest);
                    this.specialTiles.push(vera);
                }
            case 3:
                if(this.currMap == "marysMap"){
                    const quest = new Tile(this.map, true, 14, 11, 5, this.questIcon);
                    quest.interact = () => this.progress();
                    this.specialTiles.push(quest);
                }
                break;
            case 4:
                if(this.currMap == "marysMap"){
                    const quest = new Tile(this.map, true, 23, 8, 5, this.questIcon);
                    const bone = new Tile(this.map, false, 23, 9, 5,
                        './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone.interact = () => {
                        this.progress();
                    };
                    this.specialTiles.push(quest);
                    this.specialTiles.push(bone);
                }
                break;
            case 5: // meet jerry in the forest, at round 5.
                const quest = new Tile(this.map, true, 23, 8, 5, this.questIcon);
                const bone = new Tile(this.map, false, 23, 9, 5,
                    './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                bone.interact = () => {
                    // pass in story progress in here
                    this.map.scene.battleScene([[{name: "L0neb0ne", x: 3, y: 3}]], "Grass", true);
                    this.currMap = "autoBattler";
                    this.awaitBattle = true;
                    this.openPortals.push(new Tile(this.map, true, 24, 9, 0, this.questIcon));
                    this.openPortals.push(new Tile(this.map, true, 24, 10, 0, this.questIcon));
                    this.openPortals.push(new Tile(this.map, true, 24, 11, 0, this.questIcon));
                    this.openPortals.push(new Tile(this.map, true, 24, 12, 0, this.questIcon));
                    this.openPortals.forEach(portals => {
                        portals.currMap = "marysMap";
                        portals.stepOn = () => {
                            this.map.scene.battleScene([
                                [{name: "L0neb0ne", x: 1, y: 3}, {name:"L0neb0ne", x: 5, y: 3}],
                                [{name: "L0neb0ne", x: 1, y: 3}, {name:"L0neb0ne", x: 5, y: 3},
                                    {name: "Mad@Chu", x: 3, y: 3}
                                ],
                                [{name: "Mad@Chu", x: 2, y: 1}, {name:"Mad@Chu", x: 4, y: 1},
                                    {name: "D3pr3ss0", x: 3, y: 0}
                                ],
                                [{name:"Mad@Chu", x: 1, y: 1}, {name: "D3pr3ss0", x: 0, y: 1}, 
                                    {name: "D3pr3ss0", x: 0, y: 0}],
                                [{name: "Jerry Mulberry", x: 3, y: 0}]
                            ], "Grass", true);
                        };
                    });
                };
                this.specialTiles.push(quest);
                this.specialTiles.push(bone);
                break;
            case 6: // beat jerry in the forest, at round 5.
                if(this.currMap == "autoBattler") {

                }
                break;
            case 7: // after beating jerry, jump right into this case.
            default:
                break;
        }
        this.openPortals.forEach(portals => {
            if(portals.currMap === this.currMap) {
                console.log("portal pushed");
                this.specialTiles.push(Object.assign({}, portals));
            }
        });
        return this.specialTiles;
    }
    outOfBattle() {
        this.dialogIndex--;
        this.awaitBattle = false;
        this.currMap = "marysMap"
        this.globalProg++;
        this.next();
    }
    next() {
        // kill current specialTiles.
        while(this.specialTiles.length > 0) {
            for(let i = 0; i < this.map.tiles.length; i++){
                // remove from map.tiles.
                if(this.map.tiles[i] === this.specialTiles[0]) {
                    this.map.tiles.splice(i, 1);
                    this.specialTiles.shift().removeFromWorld = true;
                    break;
                }
            }
        }
        const currArr = this.dialog.chapter1[this.dialogIndex];
        console.log(currArr);
        if(currArr[currArr.length - 1].end) {
            this.globalProg++;
        }
        this.dialogIndex++;
        const loaded = this.load();
        console.log(loaded);
        loaded.forEach(tile => {
            this.map.tiles.push(tile);
            this.map.game.addEntity(tile);
        })
    }
    progress(){
        this.map.scene.showDialog(this.dialog.chapter1[this.dialogIndex]);
    }
}