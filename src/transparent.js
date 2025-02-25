class Transparent {
    constructor(block, battle) {
        this.img = block.unit.raw.asset;
        this.z = block.z + 1;
        this.allBlocks = battle.allBlocks;
        this.redSpots = []; // don't keep creating redSpots
        this.range = block.unit.raw.attackRange;
        this.game = battle.game;
        this.init();
    }

    init() {
        // Creating red spots
        let totalReds = 1;
        for (let i = 1; i < this.range + 1; i++) {
            totalReds += i * 4; // simple for calculating # of reds.
        }
        for (let i = 0; i < totalReds; i++) { // create redSpots.
            const spot = new RedSpots(this);
            this.redSpots.push(spot);
            this.game.addEntity(spot);
        }
    }

    draw(ctx) {
        if (this.block) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.drawImage(
                ASSET_MANAGER.getAsset(this.img),
                0,
                0,
                32,
                32,
                this.block.isoX + this.block.width / 2
                    - ENTITY_SIZE * this.block.scale / 2,
                (this.block.isoY + PARAMS.spaceHeightAdjusted * this.block.scale / 2
                    - ENTITY_SIZE * this.block.scale),
                ENTITY_SIZE * this.block.scale,
                ENTITY_SIZE * this.block.scale
            );
            ctx.restore();
        }
    }

    update() {
        if (this.block) {
            this.visited = new Set();
            this.attackTiles = new Set();
            this.simpleAttackRange(this.block.mapX, this.block.mapY);

            let attackArr = [...this.attackTiles]; // Convert to array if necessary
            this.redSpots.forEach(spot => {
                const pull = attackArr.shift(); // Get next attack spot
                if (pull) {
                    const [x, y] = pull.split(','); // Get coordinates from string
                    spot.block = this.allBlocks[parseInt(y)][parseInt(x)];
                    spot.z = spot.block.z + 1;
                } else {
                    spot.block = null;
                }
            });
        } else {
            this.redSpots.forEach(spot => {
                spot.block = null;
            });
        }
    }

    simpleAttackRange(x, y) {
        for (let dx = -this.range; dx <= this.range; dx++) {
            for (let dy = -this.range; dy <= this.range; dy++) {
                const newX = x + dx;
                const newY = y + dy;

                if (Math.abs(dx) + Math.abs(dy) <= this.range && newX >= 0 && newX < 7 && newY >= 0 && newY < 7) {
                    const key = `${newX},${newY}`;
                    this.attackTiles.add(key);
                }
            }
        }
    }
}

class RedSpots {
    constructor(transparent) {
        this.transparent = transparent;
        this.img = ASSET_MANAGER.getAsset("./assets/autoBattler/redSpot.png");
    }
    draw(ctx){ // draw indicator (make top of isoBlock light transparent yellow)
        if(this.block) {
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.drawImage(this.img, 
                0, 0, PARAMS.spaceWidth, PARAMS.spaceHeight,
                this.block.isoX, this.block.isoY,
                PARAMS.spaceWidth * PARAMS.scale, PARAMS.spaceHeight * PARAMS.scale
            );
            ctx.restore();
        }
    }
    update(){
        if(this.transparent.removeFromWorld) this.removeFromWorld = true;
    }
}