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
        this.npc = [];
        this.queue = [];
        this.storyCheck = [false, false, false, false, false];
        this.questBattle = null;
        //this.globalExp = [0, 0, 0, 0, 0, 0, 0, 0];
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
                if(this.currMap === "marysRoom") {
                    const quest = new Tile(this.map, false, 2, 0, 5, this.questIcon);
                    quest.interact = () => this.progress();
                    this.specialTiles.push(quest);
                }
                break;
        
            case 1:
                if(this.currMap == "marysRoom") {
                    const quest = new Tile(this.map, true, 6, 0, 5, this.questIcon);
                    const basket = new Tile(this.map, false, 6, 1, 5, './dialog/basket.png', 0, 0, 32, 32);
                    basket.interact = () => this.progress();
                    this.specialTiles.push(basket);
                    this.specialTiles.push(quest);
                }
                break;
        
            case 2:
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 4, 8, 5, this.questIcon);
                    const vera = new Tile(this.map, false, 4, 9, 5, './assets/grandmas/Vera_Mulberry.png', 0, 0, 32, 32);
                    vera.interact = () => {
                        this.progress();
                        this.map.scene.addToParty("Vera Mulberry");
                    };
                    this.specialTiles.push(quest);
                    this.specialTiles.push(vera);
                }
                break;
        
            case 3:
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 14, 11, 5, this.questIcon);
                    quest.interact = () => this.progress();
                    this.specialTiles.push(quest);
                }
                break;
        
            case 4:
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 23, 10, 5, this.questIcon);
                    const bone = new Tile(this.map, false, 23, 11, 1, './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone.interact = () => this.progress();
                    const quest1 = new Tile(this.map, true, 23, 11, 5, this.questIcon);
                    const bone1 = new Tile(this.map, false, 23, 12, 1, './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone1.interact = () => this.progress();
                    this.specialTiles.push(quest1, bone1, quest, bone);
                }
                break;
        
            case 5: // meet jerry in the forest, at round 5.
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 23, 10, 5, this.questIcon);
                    const bone = new Tile(this.map, false, 23, 11, 1, './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone.interact = () => {
                        this.map.scene.battleScene([[{name: "L0neb0ne", x: 3, y: 3}]], "Grass", true, "Tutorial");
                    };
                    const quest1 = new Tile(this.map, true, 23, 11, 5, this.questIcon);
                    const bone1 = new Tile(this.map, false, 23, 12, 1, './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone1.interact = () => {
                        this.map.scene.battleScene([[{name: "L0neb0ne", x: 3, y: 3}]], "Grass", true, "Tutorial");
                    };
                    this.specialTiles.push(bone1, quest1, quest, bone);
                }
                break;
        
            case 6: // beat forest
                if(this.currMap == "marysMap") {
                    console.log("case 6 reached");
                    for(let i = 0; i < 4; i++){
                        const quest = new Tile(this.map, true, 24, 9 + i, 2, this.questIcon);
                        this.specialTiles.push(quest);
                    }
                }
                break;
            case 7: // talk to jerry
                if(this.currMap == "marysMap") {
                    console.log("case 7 reached"); // This should now appear
                    const quest = new Tile(this.map, true, 21, 10, 5, this.questIcon);
                    const jerry = new Tile(this.map, false, 21, 11, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                    jerry.interact = () => {
                        this.progress();
                    };
                    this.specialTiles.push(quest, jerry);
                }
                break;
            case 8: // beat jerry
                if(this.currMap == "marysMap") {
                    console.log("case 8 reached"); // This should now appear
                    const quest1 = new Tile(this.map, true, 21, 10, 5, this.questIcon);
                    const jerry1 = new Tile(this.map, false, 21, 11, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                    jerry1.interact = () => {
                        this.map.scene.battleScene([[{name: "Jerry Mulberry", x: 3, y: 3}]], "Grass", true, "Jerry Mulberry")
                    };
                    this.specialTiles.push(quest1, jerry1);
                }
                break;

            case 9: // talk to jerry
                if(this.currMap == "marysMap") {
                    console.log("case 9 reached");
                    const quest2 = new Tile(this.map, true, 21, 10, 5, this.questIcon);
                    const jerry2 = new Tile(this.map, false, 21, 11, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                    jerry2.interact = () => this.progress();
                    this.specialTiles.push(quest2, jerry2);
                }
                break;
            
            case 10: // add pearl here
                console.log("case 10 reached");
                const quest3 = new Tile(this.map, true, 23, 10, 5, this.questIcon);
                const pearl = new Tile(this.map, false, 23, 11, 5, './assets/grandmas/Pearl_Martinez.png', 0, 0, 32, 32);
                pearl.interact = () => {
                    this.progress();
                    this.map.scene.addToParty("Pearl Martinez");
                }
                this.specialTiles.push(quest3, pearl);
                break;
            case 11: // go to jerry's house
                console.log("case 11 reached");
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 14, 11, 5, this.questIcon);
                    quest.interact = () => this.progress();
                    this.specialTiles.push(quest);
                }
                break;
            case 12: // talk to jerry
                if(this.currMap == "marysMap") {
                    const quest2 = new Tile(this.map, true, 21, 10, 5, this.questIcon);
                    const jerry2 = new Tile(this.map, false, 21, 11, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                    jerry2.interact = () => this.progress();
                    this.specialTiles.push(quest2, jerry2);
                }
                break;
            default:
                this.specialTiles.push(quest4);
                break;
        }
        return this.specialTiles;
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
            // this.map.scene.party.exp += this.globalExp[this.globalProg];
            this.globalProg++;
        }
        this.dialogIndex++;
        const loaded = this.load();
        console.log(loaded);
        loaded.forEach(tile => {
            this.map.tiles.push(tile);
            this.map.game.addEntity(tile);
        });
    }
    progress(){
        this.map.scene.showDialog(this.dialog.chapter1[this.dialogIndex]);
    }
    fromBattle(){
        console.log(`GlobalIndex: ` + this.globalProg);
        switch (this.globalProg) {
            case 5:
                this.dialogIndex--;
                this.next();
                break;
            case 6:
                if(!this.storyCheck[0]) {
                    this.storyCheck[0] = true;
                    this.dialogIndex--;
                    this.next();
                }
                break;
            case 8:
                this.dialogIndex--;
                this.next();
                break;
            default: break;
        }
    }
}