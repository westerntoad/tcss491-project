class settingsMenu {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;

        //Background Image on the Canvas
        this.background = ASSET_MANAGER.getAsset("./assets/menuTempBackground.js");
        
        // Button dimensions and positions using Kaely's Title Screen as a base.
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonStartY = height / 2;
        this.buttonSpacing = 70;

        this.buttons = [
            {
                text: "Volume",
                x: width / 2,
                y: height / 2,
                action: () => this.changeAudio()
            },
            {
                text: "Mute",
                x: width / 2,
                y: height / 2,
                action: () => this.changeAudio()
            },
            {
                text: "Return to Game",
                x: width / 2,
                y: height / 2,
                action: () => this.backToGame()
            },
            {
                text: "Delete Save Data?",
                x: width / 2,
                y: height / 2,
                action: () => this.deleteSave()
            }
        ]

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

    changeAudio() {
        const scene = new SceneManager();
        this.game.scene(updateAudio());
    };

    backToGame() {
        //Going back to the game.
        //this.game.;
    }

    deleteSave() {
        //Logic to delete the save data.
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
        ctx.font = "30px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.fillText("Options Menu", this.width / 2, this.height / 2);

        //Adding Buttons to the Menu Canvas
        this.buttons.forEach(button => {
            ctx.fillStyle = "rgba(98, 0, 136, 1)";
            ctx.fillRect(button.x, button.y, this.buttonWidth, this.buttonHeight);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.font = "20px Tahoma";
            ctx.textAlign = "center";
            ctx.fillText(button.text,
                         button.x + this.buttonWidth / 2,
                         button.y + this.buttonHeight / 2 + 8);
        });
    }
}