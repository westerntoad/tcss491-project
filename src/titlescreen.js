class TitleScreen {
    constructor(game) {
        this.game = game;
        this.width = PARAMS.canvasWidth;
        const width = this.width;
        this.height = PARAMS.canvasHeight;
        const height = this.height;
        this.z = 100; // Ensure it renders on top
        this.started = false;
        
        // Background image
        this.backgroundImage = ASSET_MANAGER.getAsset("./assets/bigFinger.png");
        
        // Button dimensions and positions
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonStartY = height *(3/8);
        this.buttonSpacing = 70;

        const altW = 50;
        const altH = 50;
        this.altTick = {
            w: altW,
            h: altH,
            x: PARAMS.canvasWidth  - 2 * altW,
            y: PARAMS.canvasHeight - 2 * altH,
        }
        
        // Create buttons
        this.buttons = [
            {
                text: "New Game",
                x: width / 2 - this.buttonWidth / 2,
                y: this.buttonStartY,
                action: () => this.startNewGame()
            },
            {
                text: "Load Game",
                x: width / 2 - this.buttonWidth / 2,
                y: this.buttonStartY + this.buttonSpacing,
                action: () => this.loadGame()
            }
            // {
            //     text: "Settings",
            //     x: width / 2 - this.buttonWidth / 2,
            //     y: this.buttonStartY + this.buttonSpacing * 2,
            //     action: () => this.openSettings()
            //  } //,
            // {
            //     text: "Exit",
            //     x: width / 2 - this.buttonWidth / 2,
            //     y: this.buttonStartY + this.buttonSpacing * 3,
            //     action: () => this.exitGame()
            // }
        ];

        //Storing click handler as a class property so it can be removed later
        this.boundClickHandler = (e) => this.handleClick(e);
        
        // Add click event listener
        this.game.ctx.canvas.addEventListener("click", this.boundClickHandler);
    }
    
    handleClick(event) {
        if (!this.started) {
            this.started = true;
            PLAY.title();
            return;
        }
        const rect = this.game.ctx.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Check if any button was clicked
        this.buttons.forEach(button => {
            if (mouseX >= button.x && 
                mouseX <= button.x + this.buttonWidth &&
                mouseY >= button.y && 
                mouseY <= button.y + this.buttonHeight) {
                    console.log(button.text + " pressed");
                button.action();
            }
        });
        if (mouseX >= this.altTick.x && mouseX <= this.altTick.x + this.altTick.w
                && mouseY >= this.altTick.y && mouseY <= this.altTick.y + this.altTick.h) {
            PARAMS.altMusic ^= true; // true => false, false => true
            STOP.allMusic();
            PLAY.title();
        }
    }

    // Removes listener after the title screen is no longer needed.
    removeEventListener() {
        this.game.ctx.canvas.removeEventListener("click", this.boundClickHandler);
    }
    
    startNewGame(save) {
        // Cleans up event listener before removing the title screen.
        this.removeEventListener();
        // Remove title screen and start new game
        this.game.entities = this.game.entities.filter(entity => entity !== this);
        STOP.allMusic();
        PLAY.overworld();
        this.newScene = new SceneManager(this.game, save);
        if (save) {
            PARAMS.soundEffectsVolume = save.soundEffectsVolume;
            PARAMS.musicVolume = save.musicVolume;
        } else {
            PARAMS.soundEffectsVolume = 1;
            PARAMS.musicVolume = 1;
        }
    }
    
    loadGame() {
        console.log("Load game clicked");
        // https://stackoverflow.com/a/40971885
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 
            let file = e.target.files[0]; 
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            reader.onload = readerEvent => {
                //let content = JSON.parse(readerEvent.target.result);
                let content = readerEvent.target.result;
                console.log("encrypted:", content);
                const password = 'lukeisREALLYstinky123';
                const decrypted = JSON.parse(jumbleWithPhrase(content, password));
                console.log("decrypted:", decrypted);
                this.startNewGame(decrypted);
                console.log(this.newScene);
            }
        }
        input.click();
    }
    
    openSettings() {
        // Implement settings menu?
        console.log("Settings clicked");
    }
    
    // exitGame() {
    //     // Implement exit functionality
    //     console.log("Exit clicked");
    //     // Might want to show a confirmation dialog here?
    //     window.close();
    // }
    
    update() {
        // Update logic if needed
    }
    
    draw(ctx) {
        if (!this.started) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
            ctx.fillStyle = "white";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = '80pt runescape';
            ctx.fillText('Click to start', PARAMS.canvasWidth / 2, PARAMS.canvasHeight / 2);
            return;
        }
        ctx.textBaseline = 'alphabetic';
        // Draw background
        if (this.backgroundImage) {
            ctx.fillStyle = "#292929";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
        } else {
            // Fallback background color
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
        }
        
        // Draw title
        ctx.fillStyle = "#b347cc";
        ctx.strokeStyle = "black"; // Color of the outline
        ctx.lineWidth = 10; // Thickness of the outline
        ctx.font = "72px runescape";
        ctx.textAlign = "center";
        ctx.strokeText("Grandmas vs. Unhappiness", this.width / 2, this.height / 4); // Draw the outline
        ctx.fillText("Grandmas vs. Unhappiness", this.width / 2, this.height / 4); // Draw the text

        ctx.lineWidth = 1; // Thickness of the outline
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.fillRect(this.altTick.x, this.altTick.y, this.altTick.w, this.altTick.h);
        ctx.strokeRect(this.altTick.x, this.altTick.y, this.altTick.w, this.altTick.h);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = "32px runescape";
        ctx.fillText("Alt Music", this.altTick.x - 18, this.altTick.y + 0.5 * this.altTick.h);
        if (PARAMS.altMusic) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ff0000';
            ctx.font = '40pt monospace';
            ctx.fillText('✓', this.altTick.x + this.altTick.w / 2, this.altTick.y + this.altTick.h / 2 + 2);
        }
        ctx.lineWidth = 10; // Thickness of the outline
        ctx.textBaseline = 'alphabetic';
        
        // Draw buttons
        this.buttons.forEach(button => {
            // Button background
            ctx.fillStyle = "rgba(130, 145, 155, 0.8)";
            const radius = 6; // Adjust corner radius as needed
            ctx.beginPath();
            ctx.roundRect(button.x, button.y, this.buttonWidth, this.buttonHeight, radius);
            ctx.fill();

            // Reset lineWidth for button border
            ctx.lineWidth = 2; // Set consistent line width for all button borders
            
            // Button border
            ctx.strokeStyle = "#b347cc";
            ctx.beginPath();
            ctx.roundRect(button.x, button.y, this.buttonWidth, this.buttonHeight, radius);
            ctx.stroke();
            
            // Button text
            ctx.font = "36px runescape";
            ctx.textAlign = "center";

            // button text outline
            ctx.strokeStyle = "black";  // Color of the outline
            ctx.lineWidth = 3.5;          // Thickness of the outline
            ctx.strokeText(button.text,
                button.x + this.buttonWidth / 2,
                button.y + this.buttonHeight / 2 + 10);

            // button text color
            ctx.fillStyle = "#b347cc";
            ctx.fillText(button.text, 
                        button.x + this.buttonWidth / 2, 
                        button.y + this.buttonHeight / 2 + 10);
        });
    }
}
