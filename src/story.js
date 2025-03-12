class Story {
    constructor(map, save){
        Object.assign(this, {map});
        this.map = map;
        this.globalProg = save ? save.globalProg : 0;
        this.key = null;
        this.questIcon = './dialog/quest.png';
        this.dialog = ASSET_MANAGER.getAsset("./dialog/dialogLoad.json");
        this.specialTiles = [];
        this.dialogIndex = save ? save.dialogIndex : 0;
        this.getPortal = null; // use to get portal.
        this.npc = save ? save.npc : [false, false, false, false, false, false];
        this.questBattle = null;
        this.secret = save ? save.secret : [false, false, false, false];
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
                    const quest = new Tile(this.map, false, 1, 0, 5, this.questIcon);
                    quest.interact = () => {
                        this.progress();
                        quest.interact = null;
                    }
                    this.specialTiles.push(quest);
                }
                break;
        
            case 1:
                if(this.currMap == "marysRoom") {
                    const quest = new Tile(this.map, true, 1, 2, 5, this.questIcon);
                    const basket = new Tile(this.map, false, 1, 3, 5, './maps/basketH.png', 0, 0, 32, 32);
                    basket.interact = () => {
                        this.progress();
                        basket.interact = null;
                        this.npc[1] = true;
                    }
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
                        vera.interact = null;
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
                    this.npc[2] = true;
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
            case 6:
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 23, 10, 5, this.questIcon);
                    const heart = new Tile(this.map, false, 23, 11, 1, './assets/battleScene/enemyHealth.png', 0, 0, 32, 32);
                    heart.interact = () => {
                        this.progress();
                    }
                    this.specialTiles.push(quest, heart);
                }
                break;
            case 7: // beat forest
                if(this.currMap == "marysMap") {
                    for(let i = 0; i < 4; i++){
                        const quest = new Tile(this.map, true, 24, 9 + i, 2, this.questIcon);
                        this.specialTiles.push(quest);
                    }
                }
                break;
            case 8: // talk to jerry
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
            case 9: // beat jerry
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

            case 10: // talk to jerry
                if(this.currMap == "marysMap") {
                    console.log("case 9 reached");
                    const quest2 = new Tile(this.map, true, 21, 10, 5, this.questIcon);
                    const jerry2 = new Tile(this.map, false, 21, 11, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                    jerry2.interact = () => this.progress();
                    this.specialTiles.push(quest2, jerry2);
                }
                break;
            
            case 11: // add pearl here // Chapter 1 Over
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
            case 12: // go to jerry's house
                console.log("case 11 reached");
                if(this.currMap == "marysMap") {
                    const quest = new Tile(this.map, true, 14, 11, 5, this.questIcon);
                    quest.interact = () => this.progress();
                    this.specialTiles.push(quest);
                }
                break;
            // case 13: // talk to jerry
            //     if(this.currMap == "marysMap") {
            //         const quest2 = new Tile(this.map, true, 11, 18, 5, this.questIcon);
            //         const jerry2 = new Tile(this.map, false, 11, 19, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
            //         jerry2.interact = () => this.progress();
            //         this.specialTiles.push(quest2, jerry2);
            //     }
            //     break;
            case 13: // talk to Ye-soon
                if(this.currMap == "marysMap") {
                    // this.npc[0] = true; // jerry's shop is open

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
                    this.npc[3] = true;
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
                    const vera = new Tile(this.map, false, 1, 1, 2, './assets/grandmas/Vera_Mulberry.png', 0, 0, 32, 32);
                    const pearl = new Tile(this.map, false, 0, 2, 2, './assets/grandmas/Pearl_Martinez.png', 0, 0, 32, 32);
                    pearl.interact = () => {
                        this.progress();
                    };
                    const quest = new Tile(this.map, true, 0, 1, 5, this.questIcon);
                    const yesoon = new Tile(this.map, false, 4, 2, 2, './assets/grandmas/Ye-soon_Kim.png', 0, 0, 32, 32);
                    const bernice = new Tile(this.map, false, 2, 4, 2, './assets/grandmas/Bernice_Campbell.png', 0, 0, 32, 32);
                    this.specialTiles.push(vera, pearl, yesoon, bernice, quest);
                }
                break;
            case 20: // Quest in the Woebegone Park
                if(this.currMap == "marysMap") {
                    this.npc[4] = true;
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
        this.getSecret();
        return this.specialTiles;
    }
    openNpc(){
        if(this.currMap == "marysMap") {
            if(this.npc[0]) {
                const jerry = new Tile(this.map, false, 11, 19, 5, './assets/enemies/Jerry_Mulberry.png', 0, 0, 32, 32);
                jerry.interact = () => {};// this.map.scene.openShop();
                this.specialTiles.push(jerry);
            }
            if(this.npc[2]) { // forest
                const forest = [];
                forest.push(new Tile(this.map, false, 24, 9, -1, "./maps/areaOpen.png"));
                forest.push(new Tile(this.map, false, 24, 10, -1, "./maps/areaOpen.png"));
                forest.push(new Tile(this.map, false, 24, 11, -1, "./maps/areaOpen.png"));
                forest.push(new Tile(this.map, false, 24, 12, -1, "./maps/areaOpen.png"));
                forest.forEach(portals => {
                    portals.interact = () => {
                        this.map.scene.battleScene([
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
                        this.questBattle = 7;
                    };
                });
                this.specialTiles.push(...forest);
            }
            if(this.npc[3]) {
                for(let i = 0; i < 3; i++) { // Office
                    const zone = new Tile(this.map, false, 10 + i, 30, -1, "./maps/areaOpen.png", 16, 0, 16, 16);
                    zone.interact = () => {
                        this.map.scene.battleScene(
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
                            this.questBattle = 14;
                    }
                    this.specialTiles.push(zone);
                }
            }
            if(this.npc[4]) {
                for(let i = 0; i < 4; i++) { // Woebegone Park
                    const zone = new Tile(this.map, false, 0, 13+i, -1, "./maps/areaOpen.png", 32, 0, 16, 16);
                    zone.interact = () => {
                        this.map.scene.battleScene( // bernice & vera
                            [[{name: "droplet", x: 0, y: 2}, {name: "droplet", x: 0, y: 3}, {name: "droplet", x: 0, y: 4},
                                {name: "droplet", x: 1, y: 2}, {name: "droplet", x: 1, y: 3}, {name: "droplet", x: 1, y: 4},
                                {name: "droplet", x: 0, y: 1}, {name: "droplet", x: 0, y: 5},
                                {name: "droplet", x: 1, y: 1}, {name: "droplet", x: 1, y: 5},
                                {name: "droplet", x: 0, y: 0}, {name: "droplet", x: 1, y: 0},
                                {name: "droplet", x: 0, y: 6}, {name: "droplet", x: 1, y: 6}
                            ],
                            // bernice & ye-soon
                            [{name: "waneChime", x: 2, y: 2}, {name: "waneChime", x: 1, y: 3}, {name: "waneChime", x: 2, y: 4},
                                {name: "waneChime", x: 1, y: 2}, {name: "waneChime", x: 2, y: 3}, {name: "waneChime", x: 1, y: 4},
                                {name: "waneChime", x: 0, y: 2}, {name: "waneChime", x: 0, y: 3}, {name: "waneChime", x: 0, y: 4},
                                {name: "waneChime", x: 6, y: 6}, {name: "waneChime", x: 6, y: 0}
                            ],
                            [{name: "hopless", x: 0, y: 0}, {name: "hopless", x: 6, y: 0}, {name: "hopless", x: 3, y: 0}
                            ]
                            // at the end: bernice & pearl to clear the big fries.
                            ], "Park", true, "Woebegone Park", false, 2);
                            this.questBattle = 20;
                    }
                    this.specialTiles.push(zone);
                }
            }
        } else if(this.currMap == "marysRoom") {
            if(this.npc[1]) {
                const roomExit = new Tile(this.map, true, 5, 4, 0, '');
                roomExit.stepOn = () => {
                    // change to next map
                    this.map.player.noUpdate = true;
                    this.map.noUpdate = true;
                    this.map.game.addEntity(new Transition(this.map.game, [
                        () => {
                            this.map.changeMap(MAPS.marysMap(this.map), 5, 7);
                            this.map.player.dir = 2;
                        },
                        () => {
                            this.map.player.noUpdate = false;
                            this.map.noUpdate = false;
                        }
                    ]));
                };
                this.specialTiles.push(roomExit);
            }
        }
    }
    next() {
        // Remove all specialTiles from the game world and mark them for garbage collection
        this.specialTiles.forEach(tile => {
            // Mark the tile for removal
            tile.removeFromWorld = true;
    
            // Remove the tile from the map.tiles array
            const index = this.map.tiles.indexOf(tile);
            if (index !== -1) {
                this.map.tiles.splice(index, 1);
            }
    
            // Remove the tile from the game engine's entities array
            const entityIndex = this.map.game.entities.indexOf(tile);
            if (entityIndex !== -1) {
                this.map.game.entities.splice(entityIndex, 1);
            }
        });
    
        // Clear the specialTiles array
        this.specialTiles.length = 0;
    
        console.log("Removed specialTiles, remaining: ", this.specialTiles.length);
    
        // Proceed with the next dialog and load new tiles
        const currArr = this.dialog.chapter1[this.dialogIndex];
        console.log(currArr);
    
        if (currArr[currArr.length - 1].end) {
            this.globalProg++;
        }
    
        this.dialogIndex++;
        const loaded = this.load();
        console.log(loaded);
    
        // Add the newly loaded tiles to the game world
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
        } else if(this.questBattle && this.questBattle >= 90) {
            this.dialogueIndex--;
            this.globalProg--;
            this.secret[this.questBattle % 90] = true;
            this.next();
        }
    }
    getSecret() {
        if(this.currMap === "marysMap") {
            if(!this.secret[0]) {
                const secret = new Tile(this.map, true, 6, 3, 0, './assets/portalPoint.png', 16, 16, 16, 16);
                secret.interact = () => {
                    this.map.scene.party.exp += 15;
                    secret.removeFromWorld = true;
                    this.secret[0] = true;
                };
                this.specialTiles.push(secret);
            }
            if(!this.secret[1]){
                const dep = new Tile(this.map, false, 14, 20, 0, "");
                dep.interact = () => {
                    this.map.scene.battleScene([[{name: "dep", x: 0, y: 0}]], "Grass", true, "??!??", false, 1);
                    this.questBattle = 91;
                };
                this.specialTiles.push(dep);
            }
            if(!this.secret[2]) {
                const mad = new Tile(this.map, false, 17, 15, 0, "");
                mad.interact = () => {
                    this.map.scene.battleScene([[{name: "chu", x: 0, y: 0}]], "Grass", true, "????!", false, 1);
                    this.questBattle = 92;
                };
                this.specialTiles.push(mad);
            }
            if(!this.secret[3]) {
                const dogs = new Tile(this.map, false, 18, 22, 0, "");
                dogs.interact = () => {
                    this.map.scene.battleScene(
                        [[{name: "upDog", x: 6, y: 0}, {name: "upDog", x: 6, y: 3}, {name: "upDog", x: 6, y: 6},
                            {name: "upDog", x: 0, y: 0}, {name: "upDog", x: 0, y: 6}, {name: "upDog", x: 0, y: 2}
                            ],
                            [{name: "upDog", x: 6, y: 6}, {name: "upDog", x: 5, y: 6},
                                {name: "upDog", x: 0, y: 0}, {name: "upDog", x: 0, y: 1}, {name: "guideDog", x: 3, y: 3},
                                {name: "guideDog", x: 0, y: 6}, {name: "guideDog", x: 6, y: 0},
                                {name: "guideDog", x: 0, y: 5}, {name: "guideDog", x: 5, y: 0}
                                ],
                            [{name: "guideDog", x: 3, y: 3}, {name: "guideDog", x: 6, y: 3},
                                {name: "guideDog", x: 0, y: 3}, {name: "guideDog", x: 3, y: 6}
                                ],
                            [
                            {name: "upDog", x: 6, y: 0}, {name: "upDog", x: 6, y: 3}, {name: "upDog", x: 6, y: 6},
                            {name: "upDog", x: 0, y: 0}, {name: "upDog", x: 0, y: 6}, {name: "upDog", x: 0, y: 2},
            
                            ],
                            [{name: "dogBone", x: 3, y: 3}]
                        ], "Grass", true, "Dog Level", false, 3);
                    this.questBattle = 93;
                };
                this.specialTiles.push(dogs);
            }
        }
    }
}
