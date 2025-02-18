class TitleScreen {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.z = 100; // Ensure it renders on top
        
        // Background image
        this.backgroundImage = ASSET_MANAGER.getAsset("./assets/titleBackgroundTemp.png");
        
        // Button dimensions and positions
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonStartY = height / 2;
        this.buttonSpacing = 70;
        
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
            },
            {
                text: "Settings",
                x: width / 2 - this.buttonWidth / 2,
                y: this.buttonStartY + this.buttonSpacing * 2,
                action: () => this.openSettings()
            },
            {
                text: "Exit",
                x: width / 2 - this.buttonWidth / 2,
                y: this.buttonStartY + this.buttonSpacing * 3,
                action: () => this.exitGame()
            }
        ];
        
        // Add click event listener
        this.game.ctx.canvas.addEventListener("click", (e) => this.handleClick(e));
    }
    
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
    }
    
    startNewGame() {
        // Remove title screen and start new game
        this.game.entities = this.game.entities.filter(entity => entity !== this);
        const scene = new SceneManager(this.game, this.width, this.height);
    }
    
    loadGame() {
        // Implement load game functionality
        console.log("Load game clicked");
    }
    
    openSettings() {
        // Implement settings menu
        console.log("Settings clicked");
    }
    
    exitGame() {
        // Implement exit functionality
        console.log("Exit clicked");
        // You might want to show a confirmation dialog here
        window.close();
    }
    
    update() {
        // Update logic if needed
    }
    
    draw(ctx) {
        // Draw background
        if (this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
        } else {
            // Fallback background color
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
        }
        
        // Draw title
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Grandmas vs. Unhappiness", this.width / 2, this.height / 3);
        
        // Draw buttons
        this.buttons.forEach(button => {
            // Button background
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(button.x, button.y, this.buttonWidth, this.buttonHeight);
            
            // Button border
            ctx.strokeStyle = "white";
            ctx.strokeRect(button.x, button.y, this.buttonWidth, this.buttonHeight);
            
            // Button text
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            ctx.fillText(button.text, 
                        button.x + this.buttonWidth / 2, 
                        button.y + this.buttonHeight / 2 + 8);
        });
    }
}