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
        this.buttonSpacing = 50;

        const buttX = this.x + (this.width - this.buttonWidth) / 2;
        this.buttons = [
            {
                text: "Settings",
                x: buttX,
                y: this.buttonStartY,
                //Go to the Options Menu
                action: () => this.openSettings()
            },
            { 
                text: "Save",
                x: buttX,
                y: this.buttonStartY,
                //Save the game on the current file.
                action: () => this.saveGame()
            },
            {
                text: "Party",
                x: buttX,
                y: this.buttonStartY,
                //Go to the party menu in the current game.
                action: () => this.openParty()
            },
            {
                text: "Return to Title",
                x: buttX,
                y: this.buttonStartY,
                //Close the game file.
                action: () => this.openTitle()
            },
            {
                text: "Alt Music?",
                x: buttX,
                y: this.buttonStartY,
                //To swap between alternative tracks.
                //action: () => this.altMusic()
                action: () => console.log('todo')
            }
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
        //const options = new SettingsMenu();
        //this.game.addEntity(options);
    };

    saveGame() {
        //Debugging Code
        console.log("Save Button Clicked! :D"); 
        //Logic for Saving the Game
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
    };

    //To add the Title Screen as an entity when changing between menus.
    showMenu() {
        //this.game.addEntity(this.draw(ctx));
        //this.game.ctx.drawImage
    }

    altMusic() {
        //this.game.ASSET_MANAGER.playAsset();
        PARAMS.altMusic ^= true; // true => false, false => true
    }

    update() {
        if (!this.game.click) return;
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
        ctx.textAlign = "center";
        ctx.fillText("Pause Menu", this.x + this.width / 2, this.y + 40);

        //Adding Buttons to the Menu Canvas
        for (let i = 0; i < this.buttons.length; i++) {
            const currButt = this.buttons[i];
            ctx.fillStyle = "#4a90e2";
            ctx.fillRect(currButt.x, currButt.y, this.buttonWidth, this.buttonHeight);
            ctx.strokeStyle = "white";
            ctx.strokeRect(currButt.x, currButt.y, this.buttonWidth, this.buttonHeight);

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.font = "18px Trebuchet MS";
            ctx.textAlign = "center";
            ctx.fillText(
                currButt.text,
                currButt.x + this.buttonWidth / 2,
                currButt.y + this.buttonHeight / 2 + 8
            );

            // jerry giving a tip
            ctx.drawImage(this.jerryImg, 0, 0, 32, 32, 100, 600, 100, 100);
            ctx.font = '20pt runescape';
            const numLines = Math.ceil(ctx.measureText(this.tip).width / 700);
            const lines = splitStringByWords(this.tip, Math.ceil(numLines));
            console.log(lines);
            const w = 500;
            const h = 60 + 40 * numLines;
            const x = 280 - w / 2;
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
            ctx.textBaseline = 'center';
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], x + w / 2, y + 40 + 40 * i);
            }
            ctx.restore();
        }
    }
}
