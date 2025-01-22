
class Player {
    constructor(game, scene, x, y) {
        Object.assign(this, { game, scene, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/arrow.png"); // placeholder dev art
        this.dir = 0; // 0 = north, 1 = east, 2 = south, 3 = west
        this.isMoving = false;
        this.speed = 10; // grandmas are slow :(
        this.dx = 0;
        this.dy = 0;
        this.encounterRate = 1.00; // 100% chance of battle
        
        game.ctx.canvas.addEventListener("keydown", e => {
            if (e.key == 'ArrowRight' && !this.isMoving) {
                if (this.scene.isTraversable(this.x + 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 1;
            }
            if (e.key == "ArrowLeft" && !this.isMoving) {
                if (this.scene.isTraversable(this.x - 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 3;
            }
            if (e.key == "ArrowUp" && !this.isMoving) {
                if (this.scene.isTraversable(this.x, this.y - 1)) {
                    this.isMoving = true;
                }
                this.dir = 0;
            }
            if (e.key == "ArrowDown" && !this.isMoving) {
                if (this.scene.isTraversable(this.x, this.y + 1)) {
                    this.isMoving = true;
                }
                this.dir = 2;
            }
        });
    }

    update() {
        if (this.isMoving) {
            console.log(this.game.clockTick);
            console.log(`(dx, dy) = (${this.dx}, ${this.dy})`);
            const dm = this.game.clockTick * this.speed;
            if (this.dir == 0) {
                this.dy -= dm
            } else if (this.dir == 1) {
                this.dx += dm
            } else if (this.dir == 2) {
                this.dy += dm
            } else if (this.dir == 3) {
                this.dx -= dm
            }
            
            // moved full cell
            if (Math.abs(this.dx) >= 1 || Math.abs(this.dy) >= 1) {
                this.x += clamp(-1, this.dx, 1);
                this.y += clamp(-1, this.dy, 1);
                this.dx = 0;
                this.dy = 0;
                this.isMoving = false;

                // Check for random dungeon battles
                if (this.scene.isDungeon()) { 
                    if (Math.random() <= this.encounterRate) {
                        console.log("A wild enemy appears!");
                        this.scene.battleScene(false); // true if boss type
                    }
                }
            }
        }
    }
    
    draw(ctx) {
        const w = 32;
        const h = 32;
        const scale = 5;
        ctx.drawImage(this.spritesheet,
            this.dir * w, 0,
            w, h,
            (this.x + this.dx) * this.scene.cellSize, (this.y + this.dy) * this.scene.cellSize,
            this.scene.cellSize, this.scene.cellSize
        );
    }
}
