class Player {
    constructor(game, scene, x, y) {
        Object.assign(this, { game, scene, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/arrow.png"); // placeholder dev art
        this.dir = 0; // 0 = north, 1 = east, 2 = south, 3 = west
        this.isMoving = false;
        this.speed = 0.5; // grandmas are slow :(
        this.dx = 0;
        this.dy = 0;
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
            }
        } else {
            if (this.game.keys['ArrowRight']) {
                if (this.scene.isTraversable(this.x + 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 1;
            }
            if (this.game.keys['ArrowLeft']) {
                if (this.scene.isTraversable(this.x - 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 3;
            }
            if (this.game.keys['ArrowUp']) {
                if (this.scene.isTraversable(this.x, this.y - 1)) {
                    this.isMoving = true;
                }
                this.dir = 0;
            }
            if (this.game.keys['ArrowDown']) {
                if (this.scene.isTraversable(this.x, this.y + 1)) {
                    this.isMoving = true;
                }
                this.dir = 2;
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
