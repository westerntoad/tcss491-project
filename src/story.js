class Story {
    constructor(map){
        Object.assign(this, {map});
        this.map = map;
        this.globalProg = 0;
        this.key = null;
        this.questIcon = './dialog/quest.png';
        this.dialog = ASSET_MANAGER.getAsset("./dialog/dialogLoad.json");
        this.specialTiles = [];
        this.dialogIndex = 0;
        this.getPortal = null; // use to get portal.
        this.npc = [false, false, false];
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
        
            case 5: // tutorial
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 23, 10, 5, this.questIcon);
                    const bone = new Tile(this.map, false, 23, 11, 1, './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone.interact = () => {
                        this.map.scene.battleScene([[{name: "L0neb0ne", x: 3, y: 3}]], "Grass", true, "Tutorial");
                        this.questBattle = this.globalProg;
                    };
                    const quest1 = new Tile(this.map, true, 23, 11, 5, this.questIcon);
                    const bone1 = new Tile(this.map, false, 23, 12, 1, './assets/enemies/L0neb0ne.png', 0, 0, 32, 32);
                    bone1.interact = () => {
                        this.map.scene.battleScene([[{name: "L0neb0ne", x: 3, y: 3}]], "Grass", true, "Tutorial");
                        this.questBattle = this.globalProg;
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
                        this.map.scene.battleScene([[{name: "Jerry Mulberry", x: 3, y: 3}]], "Grass", true, "Jerry Mulberry");
                        this.questBattle = this.globalProg;
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
            
            case 10: // add pearl here // Chapter 1 Over
                if(this.currMap == "marysMap") {
                    console.log("case 10 reached");
                    const quest3 = new Tile(this.map, true, 23, 10, 5, this.questIcon);
                    const pearl = new Tile(this.map, false, 23, 11, 5, './assets/grandmas/Pearl_Martinez.png', 0, 0, 32, 32);
                    pearl.interact = () => {
                        this.progress();
                        this.map.scene.addToParty("Pearl Martinez");
                    }
                    this.specialTiles.push(quest3, pearl);
                }
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
                    const quest2 = new Tile(this.map, true, 11, 18, 5, this.questIcon);
                    const jerry2 = new Tile(this.map, false, 11, 19, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                    jerry2.interact = () => this.progress();
                    this.specialTiles.push(quest2, jerry2);
                }
                break;
            case 13: // talk to Ye-soon
                if(this.currMap == "marysMap") {
                    this.npc[0] = true; // jerry's shop is open

                    const quest = new Tile(this.map, true, 10, 22, 5, this.questIcon);
                    const yesoon = new Tile(this.map, false, 10, 23, 5, './assets/grandmas/Ye-soon_Kim.png', 0, 0, 32, 32)
                    yesoon.interact = () => {
                        this.progress();
                        this.map.scene.addToParty("Ye-soon Kim");
                    };
                    this.specialTiles.push(yesoon, quest);
                }
                break;
            case 14: // Office map is the quest
                if(this.currMap == "marysMap") {
                    for(let i = 0; i < 3; i++){
                        const quest = new Tile(this.map, true, 10+i, 30, 5, this.questIcon);
                        this.specialTiles.push(quest);
                    }
                }
                break;
            case 15: // recruit bernice
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 10, 25, 5, this.questIcon);
                    const bernice = new Tile(this.map, false, 10, 26, 5, './assets/grandmas/Bernice_Campbell.png', 0, 0, 32, 32)
                    bernice.interact = () => {
                        this.progress();
                        this.map.scene.addToParty("Bernice Campbell");
                    };
                    this.specialTiles.push(bernice, quest);
                }
                break;
            case 16: // talk to Derek King
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 12, 27, 5, this.questIcon);
                    const derek = new Tile(this.map, false, 12, 28, 5, './assets/enemies/Derek_King.png', 0, 0, 32, 32)
                    derek.interact = () => {
                        this.progress();
                    };
                    this.specialTiles.push(derek, quest);
                }
                break;
            case 17: // fight Derek King
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 12, 27, 5, this.questIcon);
                    const derek = new Tile(this.map, false, 12, 28, 5, './assets/enemies/Derek_King.png', 0, 0, 32, 32)
                    derek.interact = () => {
                        this.map.scene.battleScene([[{name: "Derek King", x: 3, y: 3}]], "Office", true, "Derek King");
                        this.questBattle = this.globalProg;
                    };
                    this.specialTiles.push(derek, quest);
                }
                break;
            case 18: // talk to Derek King // Chapter 2 Over
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 12, 27, 5, this.questIcon);
                    const derek = new Tile(this.map, false, 12, 28, 5, './assets/enemies/Derek_King.png', 0, 0, 32, 32)
                    derek.interact = () => {
                        this.progress();
                    };
                    this.specialTiles.push(derek, quest);
                }
            case 19: // at Mary's house
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 6, 5, 5, this.questIcon);
                    this.specialTiles.push(quest);
                } else if(this.currMap == "marysRoom") {
                    const vera = new Tile(this.map, false, 6, 1, 2, './assets/grandmas/Vera_Mulberry.png', 0, 0, 32, 32);
                    const pearl = new Tile(this.map, false, 6, 2, 2, './assets/grandmas/Pearl_Martinez.png', 0, 0, 32, 32);
                    pearl.interact = () => {
                        this.progress();
                    };
                    const quest = new Tile(this.map, true, 6, 1, 5, this.questIcon);
                    const yesoon = new Tile(this.map, false, 10, 1, 2, './assets/grandmas/Ye-soon_Kim.png', 0, 0, 32, 32);
                    const bernice = new Tile(this.map, false, 10, 2, 2, './assets/grandmas/Bernice_Campbell.png', 0, 0, 32, 32);
                    this.specialTiles.push(vera, pearl, yesoon, bernice, quest);
                }
                break;
            case 20: // Quest in the Woebegone Park
                if(this.currMap == "marysMap") {
                    for(let i = 0; i < 4; i++) {
                        const quest = new Tile(this.map, true, 0, 13+i, 2, this.questIcon);
                        this.specialTiles.push(quest);
                    }
                }
                break;
            case 21: // Talk to Melanie
                if(this.currMap == "marysMap") {
                    const derek = new Tile(this.map, false, 2, 14, 5, './assets/enemies/Derek_King.png', 0, 0, 32, 32);
                    derek.interact = () => {
                        this.progress();
                    };
                    this.specialTiles.push(derek);
                }
                break;
            case 22: // Fight Melanie
                if(this.currMap == "marysMap") {
                    const derek = new Tile(this.map, false, 2, 14, 5, './assets/enemies/Derek_King.png', 0, 0, 32, 32);
                    derek.interact = () => {
                        this.map.scene.battleScene([[{name: "Derek King", x: 3, y: 3}]], "Office", true, "Derek King");
                        this.questBattle = this.globalProg;
                    };
                    this.specialTiles.push(derek);
                }
                break;
            case 23: // Talk to Melanie // Chapter 3 Over
                if(this.currMap == "marysMap") {
                    const derek = new Tile(this.map, false, 2, 14, 5, './assets/enemies/Derek_King.png', 0, 0, 32, 32);
                    derek.interact = () => {
                        this.progress();
                    };
                    this.specialTiles.push(derek);
                    break;
                }
            default:
                break;
        }
        this.openNpc();
        return this.specialTiles;
    }
    openNpc(){
        if(this.currMap == "marysMap") {
            if(this.npc[0]) {
                const jerry = new Tile(this.map, false, 11, 19, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                jerry.interact = () => {};// this.map.scene.openShop();
                this.specialTiles.push(jerry);
            }
        }
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
        if(this.questBattle && this.questBattle === this.globalProg) {
            this.dialogIndex--;
            this.next();
        }
    }
}