class BattleScene {
    constructor(game, sceneManager, players, enemies) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;
        console.log('Screen Width:', this.game.width);
        console.log('Screen Height:', this.game.height);
        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
    }

    update() {
        if (this.enemies.every(enemy => enemy.hp <= 0)) {
            console.log("Battle Over! Returning to Overworld...");
            this.sceneManager.restoreScene(); // Return to map
        }
    }
    draw(ctx) {
        const playerCount = this.players.length;
        const enemiesCount = this.enemies.length;
        // ✅ Draw background
        if (this.background) {
            ctx.drawImage(this.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        // ✅ Draw players
        this.players.forEach((player, index) => {
            ctx.fillStyle = "blue";
            ctx.fillRect(100, 200 + index * 50, 40, 40); // Placeholder player sprite
            ctx.fillStyle = "white";
            ctx.fillText(player.name, 150, 220 + index * 50);
        });


        // ✅ Draw enemies
        this.enemies.forEach((enemy, index) => {
            ctx.fillStyle = "red";
            ctx.fillRect(400, 200 + index * 50, 40, 40); // Placeholder enemy sprite
            ctx.fillStyle = "white";
            ctx.fillText(enemy.name, 450, 220 + index * 50);
        });
    }
}