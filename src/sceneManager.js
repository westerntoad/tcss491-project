class SceneManager {
    constructor(game, save) {
        this.game = game;
        this.z = 100;
        this.backgroundColor = '#ffffff';
        this.isDungeon = false;

        this.savedState = null; // save entity state
        this.savedMap = null; // save map state

        this.map = new Map(this.game, this, save);
        this.game.addEntity(this.map);

        this.game.addEntity(this);
        this.story = false;


        this.party = new Party(this.game, this, save);
        if (!save) {
            this.party.addMember(new Character("Mary Yott"));// initial party.
            this.party.addMember(new Character("Vera Mulberry"));
        }
        // this.party.addMember(new Character("Vera Mulberry"));// initial party.
        // const item = Object.assign({}, Item.laserPointer());
        // console.log("item: ");
        // console.log(item);
        // this.party.members[1].item = item;
        // this.party.addMember(new Character("Pearl Martinez"));
        // this.party.addMember(new Character("Ye-soon Kim"));
        // this.party.addMember(new Character("Bernice Campbell"));
        // const tea = Object.assign({}, Item.teaCup());
        // this.party.members[0].item = tea;
        this.hud = new HUD(this.game, this);
        this.game.addEntity(this.hud);
        this.hud.visible = true;

        
    }
    addToParty(name){
        const names = ["Bernice Campbell", "Pearl Martinez",
            "Vera Mulberry", "Ye-soon Kim"];
        this.party.addMember(new Character(name));
    }

    showParty(){
        this.party.showParty();
        this.map.player.disableMovement = true;
    }
    hideParty(){
        this.party.hideParty();
        this.map.player.disableMovement = false;
    }

    showPause() {
        this.hideHUD();
        this.map.player.disableMovement = true;
        this.pauseMenu = new PauseMenu(this.game, this);
        this.game.addEntity(this.pauseMenu);
    }
    hidePause() {
        this.map.player.disableMovement = false;
        this.pauseMenu.removeFromWorld = true;
        this.pauseMenu = undefined;
    }
    showSettings() {
        this.settingsMenu = new SettingsMenu(this.game, this);
        this.map.player.disableMovement = true;
        this.game.addEntity(this.settingsMenu);
    }
    hideSettings() {
        this.map.player.disableMovement = false;
        this.settingsMenu.removeFromWorld = true;
        this.settingsMenu.seSlider.remove();
        this.settingsMenu.mSlider.remove();
        this.settingsMenu = undefined;
    }


    showDialog(textArr) { //changed to accomodate an array of dialog.
        this.dialogArr = textArr;
        this.dialogIndex = 0;
        this.dialog = new Dialog(this.game, this, this.dialogArr[this.dialogIndex].content, 
            this.dialogArr[this.dialogIndex].speaking);
        if(this.dialogArr[this.dialogIndex].asset){
            this.showManga(this.game, this.dialogArr[this.dialogIndex].asset);
        }
        this.game.addEntity(this.dialog);
        this.map.player.disableMovement = true;
        this.dialogIndex++;
    }

    hideDialog() {
        this.dialog.removeFromWorld = true;
        this.dialog = undefined;
        this.map.player.disableMovement = false;
        this.dialogArr = null;
    }
    showManga() {
        this.manga = new Manga(this, this.dialogArr[this.dialogIndex].asset);
        this.game.addEntity(this.manga);
    }
    hideManga(){
        this.manga.removeFromWorld = true;
        this.manga = null;
    }

    update() {
        // if a dialog is on screen, advance the dialog.
        if (this.game.pressed['z']) {
            if (this.dialog) {
                if(this.dialogIndex < this.dialogArr.length){
                    this.dialog.removeFromWorld = true;
                    this.dialog = new Dialog(this.game, this, this.dialogArr[this.dialogIndex].content, 
                        this.dialogArr[this.dialogIndex].speaking);
                    this.game.addEntity(this.dialog);
                    this.manga?.load(this.dialogArr[this.dialogIndex]?.asset);
                    this.dialogIndex++;
                } else {

                    this.map.story.next();
                    if(this.manga) this.hideManga();
                    this.hideDialog();
                }
                this.game.pressed['z'] = false;
            }
        } else if (this.game.pressed['x'] && !this.dialog){
            if (this.pauseMenu) {
                this.hidePause();
            } else if (this.party.partyGUI) {
                this.hideParty();
                this.showPause();
            } else if (this.settingsMenu) {
                this.hideSettings();
                this.showPause();
            } else {
                this.showPause();
            }
            this.game.pressed['x'] = false;
        } else if (this.game.pressed['h']) {
            this.hud.toggle();
            this.party.changeSize();
            this.game.pressed['h'] = false;
        }
    }

    // Helper methods to control the HUD
    showHUD() {
        this.hud.show();
    }

    hideHUD() {
        this.hud.hide();
    }

// Method to add custom controls to the HUD if we want
    addHUDControl(key, description) {
        this.hud.addControl(key, description);
    }
    

    draw(ctx) { /* ~ unused ~ */ }

    battleScene(enemyArr, type, story = false, title = "", endless = false, grannyLimit = 6) {
        const gLimit = grannyLimit;
        console.log("Entered Battle Scene");
        this.savedState = this.game.entities;
        this.savedMap = this.map;
        // enemyArr = CHAPTER1_ROUNDS;
        const enemies = [];
        const random = Math.floor(Math.random() * 2);
        for(let i = 0; i < enemyArr.length; i++){
            const d1 = [];
            for(let j = 0; j < enemyArr[i].length; j++){
                for(const enemy of DUNGEON_ENCOUNTERS[type]) {
                    if(enemy.name === enemyArr[i][j].name) {
                        const toPush = Object.assign({}, enemy);
                        toPush.x = enemyArr[i][j].x;
                        toPush.y = enemyArr[i][j].y;
                        toPush.maxHp = toPush.hp;
                        d1.push(toPush);
                        break;
                    }
                }
            }
            enemies.push(d1);
        }
        if(story) enemies.story = true;

        // Endless, story, boss rush*
        const players = [];
        for(let i = 0; i < this.party.members.length; i++){
            const player = this.party.members[i];
            player.maxHp = player.hp;
            players.push(Object.assign({}, player));
        }

        console.log('Enemies:', enemies);
        console.log('Players:', players);

        this.game.entities = []; // Clear current entities

        endless ?
        this.game.addEntity(new AutoBattler(this.game, this, players, enemies, "Endless")) : 
        this.game.addEntity(new AutoBattler(this.game, this, players, enemies, `${title}`, gLimit));
        // ASSET_MANAGER.getAsset("./assets/soundtrack/battle-theme.mp3").play();
    }
    restoreScene() {
        console.log("Restoring Overworld State");
        this.game.entities = this.savedState;
        this.map = this.savedMap;
        if(this.story) this.map.story.fromBattle();
        this.story = false; 
        console.log(this.game.entities);
    }

}
class Manga {
    constructor(scene, asset){
        Object.assign(this, {scene, asset});
        this.asset = ASSET_MANAGER.getAsset(this.asset);
        this.padding = 20;
        this.z = 9;
        // stash previous assets in a set
        this.set = new Set();
        this.scale = this.asset.width /this.asset.height;
        // just determine size of asset here.
        this.height = this.scene.dialog?.boxY - this.padding;
        this.width = this.height * this.scale;
        this.x = this.scene.game.width / 2 - this.width / 2;
    }
    draw (ctx) {
        // scale enough to fill height.
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.scene.game.width, this.scene.game.height);
        ctx.drawImage(this.asset, 0, 0, this.asset.width, this.asset.height,
            this.x, this.padding, this.width, this.height
        );
        ctx.restore();
    }
    update() {}
    load(asset){
        this.asset = ASSET_MANAGER.getAsset(asset);
    }
}
CHAPTER1_ROUNDS = [
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
]
