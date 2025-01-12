class Player {
    constructor(game, scene, x, y) {
        Object.assign(this, { game, scene, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/arrow.png"); // placeholder dev art
        this.dir = 0; // 0 = north, 1 = east, 2 = south, 3 = west
        
        game.ctx.canvas.addEventListener("keydown", e => {
            if (e.key == 'ArrowRight') {
                if (this.x < scene.map.width - 1) {
                    this.x++;
                }
                this.dir = 1;
            }
            if (e.key == "ArrowLeft") {
                if (this.x > 0) {
                    this.x--;
                }
                this.dir = 3;
            }
            if (e.key == "ArrowUp") {
                if (this.y > 0) {
                    this.y--;
                }
                this.dir = 0;
            }
            if (e.key == "ArrowDown") {
                if (this.y < scene.map.height - 1) {
                    this.y++;
                }
                this.dir = 2;
            }
        });
    }

    update() { /* unused */ }
    
    draw(ctx) {
        const w = 32;
        const h = 32;
        const scale = 5;
        ctx.drawImage(this.spritesheet, this.dir * w, 0, w, h, this.x * this.scene.cellSize, this.y * this.scene.cellSize, this.scene.cellSize, this.scene.cellSize);
    }
}
