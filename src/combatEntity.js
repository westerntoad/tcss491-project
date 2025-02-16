class CombatEntity {
    //constructor(entity, block, spaceHeightAdjusted, size, blockX, blockY, allBlocks, frameRate, game) {
    //block.unit = new CombatEntity(this.enemies[i], this, block);
    constructor(raw, battle, block) {
        this.block = block;
        this.granny = raw.granny;
        this.raw = raw;
        this.entity = raw;
        this.block = block;
        this.spaceHeightAdjusted = PARAMS.spaceHeightAdjusted; 
        this.size = ENTITY_SIZE;
        this.blockX = block.mapX; 
        this.blockY = block.mapY; 
        this.allBlocks = battle.allBlocks; 
        this.game = battle.game; 

        this.z = this.block.z + 1;
        this.x = this.block.x + this.block.width * this.block.scale / 2;
        this.y = this.block.y + this.spaceHeightAdjusted * this.block.scale / 2;
        this.frames = ASSET_MANAGER.getAsset(this.entity.asset).width / 32;
        this.currentFrame = 0;
        this.ticker = 0;
        this.attacking = false;
        this.ready = false;
        this.assetSize = ASSET_MANAGER.getAsset(this.entity.asset).height;
        this.elapsedTime = 0;
        this.drawTime = 0;
      //atk speed for frequency of attack rate
      //move speed for frequency of moving
    }
    bfs(){ // return the dx, dy to move. also return the x and y of closest enemy.
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        const queue = [];
        const visited = new Set();
        queue.push ({x: this.block.mapX, y: this.block.mapY, dist: 0}) // just find the nearest enemy, then move using the initial direction.
        while(queue.length) { //this'll stop, and when it does, we just return null;
            const current = queue.shift();
            const currBlock = this.allBlocks[current.y][current.x];

            if(currBlock.unit){
                if(currBlock.unit.raw.granny !== this.raw.granny) {
                    return current;
                }
                // console.log("unit: "+ this.entity.name + " | found: " + currBlock.occupied.entity.name
                //     + " @ [x: " + current.x + " | y:  " + current.y + " ]"
                // );
                // console.log(current);
                else if(currBlock.unit.raw !== this.raw) continue;
            }

            for (const d of directions) {
                const nx = current.x + d.dx;
                const ny = current.y + d.dy;
                if (nx < 0 || nx >= 7 || ny < 0 || ny >= 7) continue;
                const key = `${nx},${ny}`;
                if(visited.has(key)) continue;
                visited.add(key);
                queue.push({
                    x: nx,
                    y: ny,
                    dist: current.dist + 1,
                    initial: (current.initial ? current.initial : {x: d.dx, y: d.dy}) // check if current.initial exists.
                });
            }
        }
        return null;
    }
    update() {
        if(!this.ready) return;
        if(this.raw.hp <= 0) {
            PLAY.death();
            this.block.unit = null;
            this.removeFromWorld = true;
        }
        // 2 modes of operation, moving or attacking.
        // First, look for closest enemy location
        const found = this.bfs(); // initial.x & initial.y to move, & x,y of closestEnemy, dist of enemy
        if(found) { // there are enemies on map
            if(found.dist <= this.raw.attackRange) { // switch to attack if enemy is close
                // check the atkSpeed
                // granny attack speed is frequency in seconds. so 0.2 is 0.2 seconds per attack.
                this.elapsedTime += this.game.clockTick;
                if(this.elapsedTime >= this.raw.attackSpeed) {
                    if(this.target?.unit) {
                        const damage = Math.round((this.target.unit.raw.defense ? 
                                1 - (this.target.unit.raw.defense / (this.target.unit.raw.defense + 50))
                                 : 1) * this.raw.attack);
                        this.target.unit.raw.hp -= damage;

                        const origX  = this.block.isoX + this.block.width * 0.5;
                        const origY  = this.block.isoY - this.block.height * 0.2;
                        const destX  = this.target.isoX + this.target.width * 0.5;
                        const destY  = this.target.isoY + this.target.height * 0.2;
                        // damage number gen
                        this.game.addEntity(new DamageNum(this.game, destX, destY, damage, this.raw.granny));

                        // if ranged, shoot beam
                        if (this.raw.attackRange > 1) {
                            this.game.addEntity(new Beam(this.game, {x: origX, y: origY}, {x: destX, y: destY}, damage));
                        }

                        // temporary code - will replace with sounds unique to each combat entity
                        // DEBUG
                        if (Math.random() < 0.5) {
                            PLAY.hit1();
                        } else {
                            PLAY.hit2();
                        }
                    } else {
                        this.target = this.allBlocks[found.y][found.x];
                    }

                    this.elapsedTime = 0;// how timer is used
                    this.attacking = true;
                }
            } else {
                this.elapsedTime += this.game.clockTick;
                if(this.elapsedTime >= this.raw.moveSpeed){
                    // check the moveSpeed
                    this.blockMove(this.allBlocks[this.block.mapY + found.initial.y]
                        [this.block.mapX + found.initial.x]);
                    this.elapsedTime = 0;// how timer is used
                    this.attacking = false;
                }
            }
        } else this.attacking = false;
    }
  
    draw(ctx) {
        this.drawTime += this.game.clockTick;
        if(this.drawTime >= this.entity.attackSpeed && this.attacking){
            if(this.currentFrame >= this.frames -1) this.currentFrame = 0;
            else this.currentFrame++;
            this.drawTime = 0 ;
        }

        // draw the hp?
        const img = ASSET_MANAGER.getAsset(
            (this.entity.granny ? "./assets/battleScene/allyHp.png" :
                "./assets/battleScene/enemyHealth.png"
            ));
        // const adjustedX =
        const hpY = this.size / 4;
        // draw blackHp first
        ctx.drawImage( // magic numbers are hard defined just for hp.
            img,
            1 + 32,
            5,
            30,
            26,
            this.block.isoX + this.block.width /2
                + (this.raw.granny ? -1 : 1/2 ) * this.size * this.block.scale / 2,
            (this.block.isoY + this.spaceHeightAdjusted * this.block.scale / 2
                - this.size * this.block.scale) - hpY * 2,
            this.size / 4 * this.block.scale,
            this.size / 4 * this.block.scale * (26/30) // raw ratio
        );
        // draw realHp
        const currHpBar = this.raw.hp / this.raw.maxHp;
        const pHeight = 5 + currHpBar * 26;

        ctx.drawImage(
            img,
            1,
            (this.raw.granny ? 5 + ((1 - currHpBar) * 26) : pHeight ),
            30,
            26 * (this.raw.granny ? currHpBar : 1 - currHpBar),

            this.block.isoX + this.block.width / 2
                + (this.raw.granny ? -1 : 1/2 ) * this.size * this.block.scale / 2,

            (this.block.isoY + this.spaceHeightAdjusted * this.block.scale / 2
                - this.size * this.block.scale) - hpY *2 + 
                (this.raw.granny ? 
                    (1-currHpBar) : currHpBar)
                * (26/30) * this.size / 4 * this.block.scale,

            this.size / 4 * this.block.scale,

            (this.size / 4 * this.block.scale * (26/30) * 
                (this.raw.granny ? currHpBar : (1 - currHpBar))) // raw ratio
        );

        ctx.drawImage(
            ASSET_MANAGER.getAsset(this.raw.asset),
            this.currentFrame * this.assetSize,
            0,
            this.assetSize,
            this.assetSize,
            this.block.isoX + this.block.width / 2
                - this.size * this.block.scale / 2,
            (this.block.isoY + this.spaceHeightAdjusted * this.block.scale / 2
                - this.size * this.block.scale),
            this.size * this.block.scale,
            this.size * this.block.scale
        );
    }
    blockMove(newBlock){
        if(!newBlock.unit){
            this.block.unit = null;
            this.block.selected = false;
            this.z = newBlock.z + 1;
            this.block = newBlock;
            this.block.unit = this;
            this.blockX = this.block.mapX;
            this.blockY = this.block.mapY;
        }
    }
}
