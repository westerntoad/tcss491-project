class PauseMenu {
    constructor(game, scene) {
        Object.assign(this, { game, scene });
        this.game = game;
        this.width = PARAMS.canvasWidth / 3;
        const width = this.width;
        this.height = PARAMS.canvasHeight - 100;
        const height = this.height;
        this.x = PARAMS.canvasWidth - this.width - 100;
        this.y = (PARAMS.canvasHeight - height) / 2;
        this.z = 300_000;
        
        // Button dimensions and positions using Kaely's Title Screen as a base.
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonStartY = this.y + 120;
        this.buttonSpacing = 30;

        this.highlightButtonIdx = 0;

        const buttX = this.x + (this.width - this.buttonWidth) / 2;
        this.buttons = [
            {
                text: "Party",
                x: buttX,
                y: this.buttonStartY,
                //Go to the party menu in the current game.
                action: () => this.openParty(),
                highlighted: true
            },
            { 
                text: "Save",
                x: buttX,
                y: this.buttonStartY,
                //Save the game on the current file.
                action: () => this.saveGame()
            },
            {
                text: "Settings",
                x: buttX,
                y: this.buttonStartY,
                //Go to the Options Menu
                action: () => this.openSettings()
            },
            {
                text: "Wiki",
                x: buttX,
                y: this.buttonStartY,
                action: () => window.open('https://github.com/westerntoad/tcss491-project/wiki', '_blank').focus()
            },
            {
                text: "Alt Music",
                x: buttX,
                y: this.buttonStartY,
                //To swap between alternative tracks.
                action: () => this.altMusic()
            },
            {
                text: "Return to Title",
                x: buttX,
                y: this.buttonStartY,
                //Close the game file.
                action: () => this.openTitle()
            },
        ];
        let i = 0;
        this.buttons.forEach(butt => {
            butt.y += (this.buttonHeight + this.buttonSpacing) * i;
            i++;
        });
        
        // choose a random tip
        this.tip = PARAMS.tips[randomInt(PARAMS.tips.length)];
        this.jerryImg = ASSET_MANAGER.getAsset("./assets/enemies/Jerry_Mulberry.png");
    }

    openSettings() {
        //Debugging Code
        console.log("Options Button Clicked! :D"); 
        this.scene.hidePause();
        this.scene.showSettings();
    };

    saveGame() {
        //Debugging Code
        console.log("Save Button Clicked! :D"); 
        const save = {
            dialogIndex: this.scene.map.story.dialogIndex,
            globalProg: this.scene.map.story.globalProg,
            npc: this.scene.map.story.npc,
            secret: this.scene.map.story.secret,
            loc: {x: this.scene.map.player.x, y: this.scene.map.player.y},
            map: this.scene.map.currMapName,
            party: {
                members: this.scene.party.members,
                exp: this.scene.party.exp
            },
            soundEffectsVolume: PARAMS.soundEffectsVolume,
            musicVolume: PARAMS.musicVolume
        }
        save.party.scene = undefined;
        save.party.game = undefined;
        const date = new Date();
        const saveName = `gvh_save-${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.bin`;
        downloadFile(save, saveName);

    };

    openParty() {
        //Debugging Code
        console.log("Party Button Clicked! :D"); 
        this.scene.hidePause();
        this.scene.showParty();
        //const party = this.game.party.showParty();
        //this.game.addEntity(party.showParty());
    }

    openTitle() {
        /*const save = false;
        if (save == false) {
            //Open a pop-up window to double check if a player wants to save their progress.
            const question = "Do you want to leave without saving?";
            const response = false; 
            if (response == false) {
                this.game.entities = this.game.entities.filter(entity => entity !== this);
                const title = new TitleScreen();
                this.game.addEntity(title.showTitle());
                //break;
            } else {
                this.game.entities = this.game.entities.filter(entity => entity !== this);
                const menu = new pauseMenu();
                this.game.addEntity(menu.showMenu());
                //break;
            }
        }
        this.game.entities = this.game.entities.filter(entity => entity !== this);
        const title = new TitleScreen();
        this.game.addEntity(title.showTitle());*/
        this.game.entities.forEach(entity => entity.removeFromWorld = true);
        const ts = new TitleScreen(this.game);
        ts.started = true;
        STOP.allMusic();
        PLAY.title();
        this.game.addEntity(ts);
    };

    //To add the Title Screen as an entity when changing between menus.
    showMenu() {
        //this.game.addEntity(this.draw(ctx));
        //this.game.ctx.drawImage
    }

    altMusic() {
        //this.game.ASSET_MANAGER.playAsset();
        STOP.allMusic();
        PARAMS.altMusic ^= true; // true => false, false => true
        PLAY.overworld();
        console.log(PARAMS.altMusic);

    }

    update() {
        if (this.game.click) {
            const mouseX = this.game.click.x;
            const mouseY = this.game.click.y;
            
            // Check if any button was clicked
            this.buttons.forEach(button => {
                if (mouseX >= button.x && 
                    mouseX <= button.x + this.buttonWidth &&
                    mouseY >= button.y && 
                    mouseY <= button.y + this.buttonHeight) {
                    button.action();
                }
            });
        }

        if (this.game.keys['ArrowDown']) {
            this.highlightButtonIdx = (this.highlightButtonIdx + 1) % this.buttons.length;
            this.game.keys['ArrowDown'] = false;
        } else if (this.game.keys['ArrowUp']) {
            this.highlightButtonIdx = ((this.highlightButtonIdx - 1) + this.buttons.length) % this.buttons.length;
            this.game.keys['ArrowUp'] = false;
        } else if (this.game.keys['z'] || this.game.keys['e']) {
            this.buttons[this.highlightButtonIdx].action();
            this.game.keys['z'] = false;
            this.game.keys['e'] = false;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        //Title of the Menu
        ctx.fillStyle = "rgba(23, 186, 255, 0.49)";
        ctx.font = "28px Tahoma";
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = "center";
        ctx.fillText("Pause Menu", this.x + this.width / 2, this.y + 40);

        //Adding Buttons to the Menu Canvas
        for (let i = 0; i < this.buttons.length; i++) {
            const currButt = this.buttons[i];
            let tempWidth = this.buttonWidth;
            // alt music toggle
            if (currButt.text == 'Alt Music') {
                tempWidth /= 1.5;
                const h = this.buttonHeight;
                const w = h;
                const x = currButt.x + this.buttonWidth - h;
                const y = currButt.y;
                ctx.fillStyle = '#000000';
                ctx.strokeStyle = '#ffffff';
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
                if (PARAMS.altMusic) {
                    ctx.fillStyle = '#ff0000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = '40pt monospace';
                    ctx.fillText('✓', x + w / 2, y + h / 2 + 2);
                }
            }

            if (i == this.highlightButtonIdx) {
                ctx.strokeStyle = '#ff0000'
                ctx.strokeRect(currButt.x - 10, currButt.y - 10, tempWidth + 20, this.buttonHeight + 20);
            }

            ctx.fillStyle = "#4a90e2";
            ctx.fillRect(currButt.x, currButt.y, tempWidth, this.buttonHeight);
            ctx.strokeStyle = "white";
            ctx.strokeRect(currButt.x, currButt.y, tempWidth, this.buttonHeight);

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.font = "18px Trebuchet MS";
            ctx.textAlign = "center";
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(
                currButt.text,
                currButt.x + tempWidth / 2,
                currButt.y + this.buttonHeight / 2 + 8
            );

        }

        // jerry giving a tip
        ctx.drawImage(this.jerryImg, 0, 0, 32, 32, 100, 600, 100, 100);
        ctx.font = '20pt runescape';
        const measure = ctx.measureText(this.tip);
        const numLines = Math.ceil(measure.width / 600);
        const textHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
        const lines = splitStringByWords(this.tip, Math.ceil(numLines));
        const w = 500;
        const h = 20 + textHeight * numLines * 1.4;
        const x = 290 - w / 2;
        const y = 580 - h;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(180, 610);
        ctx.lineTo(250, 580);
        ctx.lineTo(210, 580);
        ctx.fill();
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let i = 0; i < lines.length; i++) {
            //ctx.fillRect(x + w / 2, y + 10 + textHeight * (i + 1), w, textHeight);
            ctx.fillText(lines[i], x + w / 2, y + 10 + textHeight * i, w);
        }
        ctx.restore();
        
    }
}
