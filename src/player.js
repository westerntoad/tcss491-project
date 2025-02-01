
class Player {
    constructor(game, scene, x, y) {
        Object.assign(this, { game, scene, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/arrow.png"); // placeholder dev art
        this.dir = 0; // 0 = north, 1 = east, 2 = south, 3 = west
        this.isMoving = false;
        this.speed = 10; // grandmas are slow :(
        this.dx = 0;
        this.dy = 0;
        this.z = 1;

        this.realX = () => this.x + Math.min(this.dx, 1);
        this.realY = () => this.y + Math.min(this.dy, 1);
        this.encounterRate = 1.00; // 100% chance of battle
        
    }

    facingTile() {
        const loc = {x:this.x, y:this.y};
        if (this.dir == 0) {
            loc.y -= 1;
        } else if (this.dir == 1) {
            loc.x += 1;
        } else if (this.dir == 2) {
            loc.y += 1;
        } else if (this.dir == 3) {
            loc.x -= 1;
        }

        return loc;
    }

    update() {
        if (this.isMoving) {
            //console.log(this.game.clockTick);
            //console.log(`(dx, dy) = (${this.dx}, ${this.dy})`);
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

                const tilesMovedOn = this.scene.getTile(this.x, this.y);
                tilesMovedOn.forEach((tile) => tile.stepOn?.());

                //Check for random dungeon battles
                if (this.scene.isDungeon) {
                    if (Math.random() <= this.encounterRate) {
                        console.log("A wild enemy appears!");
                        this.scene.battleScene(false); // true if boss type
                    }
                }
            }
        } else if (!this.disableMovement) {
            if (this.game.keys['ArrowRight']) {
                if (this.scene.isTraversable(this.x + 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 1;
            } else  if (this.game.keys['ArrowLeft']) {
                if (this.scene.isTraversable(this.x - 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 3;
            } else if (this.game.keys['ArrowUp']) {
                if (this.scene.isTraversable(this.x, this.y - 1)) {
                    this.isMoving = true;
                }
                this.dir = 0;
            } else if (this.game.keys['ArrowDown']) {
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
        ctx.drawImage(
            this.spritesheet,
            this.dir * w, 0,
            w, h,
            (PARAMS.canvasWidth - this.scene.cellSize) / 2, (PARAMS.canvasHeight - this.scene.cellSize) / 2,
            this.scene.cellSize, this.scene.cellSize
        );
    }
}
