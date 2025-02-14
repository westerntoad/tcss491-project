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

    showDialog(text, speaker) {
        this.dialog = new Dialog(this.game, this, text, speaker);
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
