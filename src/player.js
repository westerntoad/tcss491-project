
class Player {
    constructor(game, scene, map, x, y) {
        Object.assign(this, { game, scene, map, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/player.png");
        this.dir = 0; // 0 = north, 1 = east, 2 = south, 3 = west
        this.isMoving = false;
        this.speed = 3; // grandmas are slow :(
        this.dx = 0;
        this.dy = 0;
        this.z = 1;

        // keep track of which step the player is on
        // used for drawing purposes
        this.stepSpeed = 0.1;
        this.stepElapsed = 0;
        this.currStep = 0;

        this.realX = () => this.x + Math.min(this.dx, 1);
        this.realY = () => this.y + Math.min(this.dy, 1);
        this.encounterRate = 0; // 100% chance of battle
        
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
            // calculate current step used in drawing
            this.stepElapsed += this.game.clockTick;
            if (this.stepElapsed >= this.stepSpeed) {
                // switch the opposite step
                // if 1, turn to 0. if 0, turn to 1.
                this.currStep = (this.currStep + 1) % 2;
                //console.log(this.currStep);
                this.stepElapsed -= this.stepSpeed;
            }

            // determine how far the player is to reaching the next cell
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

                const tilesMovedOn = this.map.getTile(this.x, this.y);
                tilesMovedOn.forEach((tile) => tile.stepOn?.());
                console.log("x: " + this.x + " | y: " + this.y);
            }
        } else if (!this.disableMovement) {
            // parse user input into movement
            if (this.game.keys['ArrowRight']) {
                if (this.map.isTraversable(this.x + 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 1;
            } else  if (this.game.keys['ArrowLeft']) {
                if (this.map.isTraversable(this.x - 1, this.y)) {
                    this.isMoving = true;
                }
                this.dir = 3;
            } else if (this.game.keys['ArrowUp']) {
                if (this.map.isTraversable(this.x, this.y - 1)) {
                    this.isMoving = true;
                }
                this.dir = 0;
            } else if (this.game.keys['ArrowDown']) {
                if (this.map.isTraversable(this.x, this.y + 1)) {
                    this.isMoving = true;
                }
                this.dir = 2;
            }
        }
    }
    
    draw(ctx) {
        const w = 32;
        const h = 32;

        // disgusting conversion of this.dir into sy indexing.
        // this can be easily fixed by slightly modifying the player asset.
        // complain to Abe.
        let sy = h;
        if (this.dir == 0) {
            sy *= 3;
        } else if (this.dir == 1) {
            sy *= 0;
        } else if (this.dir == 2) {
            sy *= 2;
        }

        ctx.drawImage(
            this.spritesheet,
            this.currStep * w, sy,
            w, h,
            (PARAMS.canvasWidth - PARAMS.cellSize) / 2, (PARAMS.canvasHeight - PARAMS.cellSize) / 2,
            PARAMS.cellSize, PARAMS.cellSize
        );
    }
}
