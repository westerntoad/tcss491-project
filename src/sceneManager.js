class SceneManager {
    constructor(game, pxWidth, pxHeight) {
        this.game = game;
        this.z = 100;
        this.backgroundColor = '#ffffff';
        this.isDungeon = false;

        this.savedState = null; // save entity state
        this.savedMap = null; // save map state

        this.map = new Map(this.game, this);
        this.game.addEntity(this.map);

        this.game.addEntity(this);

        // debug
        // this.map.hide();

        this.party = new Party(this.game);
        this.party.addMember(new Character("Mary Yott"));// initial party. 
        this.addToParty(); //test function for Luek.
    }
    addToParty(){
        const names = ["Bernice Campbell", "Pearl Martinez",
            "Vera Mulberry", "Ye-soon Kim"];
        names.forEach((name) =>{
            this.party.addMember(new Character(name));
        });
    }

    showParty(){
        this.party.showParty();
        this.map.player.disableMovement = true;
    }
    hideParty(){
        this.party.hideParty();
        this.map.player.disableMovement = false;
    }

    showDialog(text) {
        this.dialog = new Dialog(this.game, this, text);
        this.game.addEntity(this.dialog);
        this.map.player.disableMovement = true;
    }

    hideDialog() {
        this.dialog.removeFromWorld = true;
        this.dialog = undefined;
        this.map.player.disableMovement = false;
    }

    update() {
        // if a dialog is on screen, advance the dialog.
        if (this.game.pressed['z']) {
            if (this.dialog) {
                this.hideDialog();
                this.game.pressed['z'] = false;
            }
        } else if (this.game.pressed['x']){
            if(!this.dialog) {
                if(!this.party.partyGUI) {
                    this.showParty();
                } else {
                    this.hideParty();
                    this.game.pressed['x'] = false;
                }
            }
        }
    }

    //From example code for mute and volume support.
    updateAudio() {
        const mute = getDocumentbyID("mute");
        const volume = getDocumentbyID("volume");

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    //For changing songs!
    musicChange(original, nextSong, gameSection) {
        this.original = original;
        this.nextSong = nextSong;
        this.gameSection = gameSection;
        if (gameSection == chapter1) { //Chapter 1 - Story
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/TCSS 491 Phone Call to a New Adventure.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Chapter 1 Story.mp3");
        } if (gameSection == chapter2) { //Chapter 2 - Story
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/Chapter 2 Story.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Chapter 2 Story.mp3");
        } if (gameSection == chapter3) { //Chapter 3 - Story
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/Chapter 3 Story.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Chapter 3 Story.mp3");
        } if (gameSection == battle) { //Battle Theme
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/battle-theme.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Battle Theme.mp3");
        } if (gameSection == battle1) { //Chapter 1 - Boss Battle
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/Chapter 1 Boss Battle.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Chapter 1 Boss Battle.mp3");
        } if (gameSection == battle2) { //Chapter 2 - Boss Battle
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/Chapter 2 Boss Battle.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Chapter 2 Boss Battle.mp3");
        } if (gameSection == battle3) { //Chapter 3 - Boss Battle
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/Chapter 3 Boss Battle.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Chapter 4 Boss Battle.mp3");
        } if (gameSection == finalBattle) { //Final Battle
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/Final Battle.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Final Battle.mp3");
        } if (gameSection == overworld) { //Overworld
            //Example Format!
            original = ASSET_MANAGER.getAsset("/assets/soundtrack/TCSS-491-Mary-Yott's-Overworld.mp3");
            newSong = ASSET_MANAGER.getAsset("/assets/soundtrack/Alt Overworld Theme.mp3");
        };
    };

    draw(ctx) { /* ~ unused ~ */ }

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
        let i = 2;
        while(i >= 0) {
            enemies.push(
                Object.assign({}, this.getRandomEncounter("Grass"))
            );
            i--;
        }

        const players = [];
        for(let i = 0; i < this.party.members.length; i++){
            const player = this.party.members[i];
            player.maxHp = player.hp;
            players.push(Object.assign({}, player));
        }

        console.log('Enemies:', enemies);
        console.log('Players:', players);

        this.game.entities = []; // Clear current entities
        this.game.addEntity(new AutoBattler(this.game, this, players, enemies, "Round 1"));
        // ASSET_MANAGER.getAsset("./assets/soundtrack/battle-theme.mp3").play();
    }
    restoreScene() {
        console.log("Restoring Overworld State");
        this.game.entities = this.savedState;
        this.map = this.savedMap;
        console.log("Restored Overworld");
    }
}
