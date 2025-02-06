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
        //this.battleScene(false);
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

        const players = this.game.grannies;

        console.log('Enemies:', enemies);
        console.log('Players:', players);

        this.game.entities = []; // Clear current entities
        this.game.addEntity(new AutoBattler(this.game, this, this.game.grannies, enemies, "Round 1"));
        // ASSET_MANAGER.getAsset("./assets/soundtrack/battle-theme.mp3").play();
    }
    restoreScene() {
        console.log("Restoring Overworld State");
        this.game.entities = this.savedState;
        this.map = this.savedMap;
        console.log("Restored Overworld");
    }
}
