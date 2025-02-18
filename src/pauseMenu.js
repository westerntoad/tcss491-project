class pauseMenu {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height - height;
        
        //Background Image on the Canvas
        this.background = ASSET_MANAGER.getAsset("./assets/menuTempBackground.js");

        // Button dimensions and positions using Kaely's Title Screen as a base.
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonStartY = height / 2;
        this.buttonSpacing = 70;

        this.buttons = [
            {
                text: "Settings",
                x: width / 2,
                y: height / 2,
                //Go to the Options Menu
                action: () => this.openSettings()
            },
            { 
                text: "Save",
                x: width / 2,
                y: height / 2,
                //Save the game on the current file.
                action: () => this.saveGame()
            },
            {
                text: "Party",
                x: width / 2,
                y: height / 2,
                //Go to the party menu in the current game.
                action: () => this.openParty()
            },
            {
                text: "Return to Title",
                x: width / 2,
                y: height / 2,
                //Close the game file.
                action: () => this.openTitle()
            },
            {
                text: "Return to Game",
                x: width / 2,
                y: height / 2,
                //To exit the Pause Menu
                action: () => this.backToGame()  
            },
            {
                text: "Alt Music?",
                x: width / 2,
                y: height / 2,
                //To swap between alternative tracks.
                action: () => this.altMusic()
            }
        ];

        //Event Handler for Clicked Events
        this.game.ctx.canvas.addEventListener("click", (e) => this.handleClick(e));
    };

    handleClick(event) {
        const rect = this.game.ctx.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Check if any button was clicked
        this.buttons.forEach(button => {
            if (mouseX >= button.x && 
                mouseX <= button.x + this.buttonWidth &&
                mouseY >= button.y && 
                mouseY <= button.y + this.buttonHeight) {
                button.action();
            }
        });
    };

    openSettings() {
        //Debugging Code
        console.log("Options Button Clicked! :D"); 
        this.game.entities = this.game.entities.filter(entity => entity !== this);
        const options = new settingsMenu();
        this.game.addEntity(options.showSettings());
    };

    saveGame() {
        //Debugging Code
        console.log("Save Button Clicked! :D"); 
        //Logic for Saving the Game
    };

    openParty() {
        //Debugging Code
        console.log("Party Button Clicked! :D"); 
        this.game.entities = this.game.entities.filter(entity => entity !== this);
        const party = this.game.party.showParty();
        this.game.addEntity(party.showParty());
    }

    openTitle() {
        const save = false;
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
        this.game.addEntity(title.showTitle());
    };

    //To add the Title Screen as an entity when changing between menus.
    showMenu() {
        this.game.addEntity(this.draw(ctx));
        //this.game.ctx.drawImage
    }

    altMusic() {
        this.game.ASSET_MANAGER.playAsset();
    }

    update() {

    }

    draw(ctx) {
        if (this.background) {
            ctx.drawImage(this.background, 0, 0, this.width, this.height);
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(0, 0, this.width, this.height);
        }

        //Title of the Menu
        ctx.fillStyle = "rgba(23, 186, 255, 0.49)";
        ctx.font = "28px Tahoma";
        ctx.textAlign = "center";
        ctx.fillText("Pause Menu", this.width / 2, this.height / 2);

        //Adding Buttons to the Menu Canvas
        this.buttons.forEach(button => {
            ctx.fillStyle = "rgba(174, 39, 190, 1)";
            ctx.fillRect(button.x, button.y, this.buttonWidth, this.buttonHeight);
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.font = "18px Trebuchet MS";
            ctx.textAlign = "center";
            ctx.fillText(button.text,
                         button.x + this.buttonWidth / 2,
                         button.y + this.buttonHeight / 2 + 8);
        });
    }
}