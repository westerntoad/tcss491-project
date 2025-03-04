class Item { // am I keeping all items here?
    // static class
    constructor(){
        throw new Error("Item is a static class poo poo");
    }
    static bfs(cEntity, startX, startY, ally = false, prev = null, all = false) { // lets look for all 
        // search = true to look for allies, search = false for enemies
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];
        const queue = [];
        const visited = new Set();
        const hitb4 = new Set();
        queue.push({x: startX, y: startY, dist: 0});
        visited.add(`${startX},${startY}`);
        if(prev) {
            hitb4.add(...prev);
        }
        if(all) {
            hitb4.add(`${startX},${startY}`);
        }
        let target = null;
        if(all) target = [];
        while (queue.length) {
            const current = queue.shift();
            const currBlock = cEntity.allBlocks[current.y][current.x];
            if(current.dist > cEntity.raw.attackRange) continue;
            if(currBlock.unit?.raw.hp > 0) {
                const isAlly = currBlock.unit.granny === cEntity.granny;
                if((ally && isAlly) || (!ally && !isAlly) && !hitb4.has(`${current.x},${current.y}`)) {
                    if(all) {
                        target.push(currBlock.unit);
                    } else {
                        target = currBlock.unit;
                        break;
                    }
                }
            }
            for(const d of directions) {
                const nx = current.x + d.dx;
                const ny = current.y + d.dy;
                if (nx < 0 || nx >= 7 || ny < 0 || ny >= 7) continue;
                const key = `${nx},${ny}`;
                if(visited.has(key)) continue;
                visited.add(key);
                queue.push({
                    x: nx,
                    y: ny,
                    dist: current.dist + 1
                })
            }
        }
        return target;
    }
    static createInitial() {
        const item = {
            level: 3,
            expReq: [750, 2000],
            name: "",
            hasSpecial: true,
            z: 101, // +1 more than partyGUI
            draw: function(ctx, x, y, width, height) {
                ctx.drawImage(this.asset,
                    0, 0, 16, 16, // default size
                    x, y, width, height);
            },
            update: function() {},
            levelUp: function(exp) {
                if(!this.expReq[this.level-1] < exp || this.level == 3) return;
                else {
                    this.level++;
                    exp -= this.expReq[this.level - 1];
                }
            }
        }
        item.draw = item.draw.bind(item);
        item.levelUp = item.levelUp.bind(item);
        // adding addition functions:

        // just receive this, and then alter its properties.
        return item;
    }
    static teaCup(){ // Mary's
        const tea = this.createInitial();
        tea.name = "Mary's Teacup";
        tea.attack = function (cEntity) {
            if(cEntity.target.raw.hp + cEntity.raw.attack > cEntity.target.raw.maxHp) cEntity.target.raw.hp = cEntity.target.raw.maxHp;
            else cEntity.target.raw.hp += cEntity.raw.attack;

            const destX  = cEntity.target.block.isoX + cEntity.target.block.width * 0.5;
            const destY  = cEntity.target.block.isoY + cEntity.target.block.height * 0.2;

            cEntity.game.addEntity(new HealNum(cEntity.game, destX, destY, cEntity.raw.attack));
        }
        tea.bfsAttack = function (cEntity) {
            const num = tea.level;
            const target = Item.bfs(cEntity, cEntity.blockX, cEntity.blockY, true, false, true);
            console.log("here in bfsAttack");
            console.log(target);
            if(!target) return null;
            let lowest = target[0];
            target.forEach(t => {
                const low = lowest.raw.hp / lowest.raw.maxHp;
                const got = t.raw.hp / t.raw.maxHp;
                lowest = low < got ? lowest : t; // if got is === low, it is farther away from source, which is better to heal.
            });
            if(lowest.blockX === cEntity.blockX && lowest.blockY === cEntity.blockY) return null;
            return lowest;
        }
        tea.stat = {
            attackSpeed: 2,
            attack: 0.2,
            range: 4
        }
        return tea;
    }
    static laserPointer() {
        const laser = this.createInitial();
        laser.name = "Vera's Laser Pointer";
        laser.asset = ASSET_MANAGER.queueDownload("./assets/items/laserPointer.png");
        laser.attack = (cEntity) => {
            let bounce = 1 + laser.level * 2;
            const struck = new Set();
            let startX = cEntity.blockX;
            let startY = cEntity.blockY;
            while(bounce) { // break early if no more enemies that can be chained
                
                const target = Item.bfs(cEntity, startX, startY, false, struck);
                if(!target) break;
                struck.add(`${target.blockX},${target.blockY}`);
                
                const damage = Math.round((target.raw.defense ? 
                    1 - (target.raw.defense / (target.raw.defense + 50))
                    : 1) * cEntity.raw.attack);
                target.raw.hp -= damage;

                // determining damageNum and beam placement.
                const origX  = cEntity.allBlocks[startY][startX].isoX + cEntity.block.width * 0.5;
                const origY  = cEntity.allBlocks[startY][startX].isoY - cEntity.block.height * 0.2;
                const destX  = target.block.isoX + target.block.width * 0.5;
                const destY  = target.block.isoY + target.block.height * 0.2;

                // dmg num
                cEntity.game.addEntity(new DamageNum(cEntity.game, destX, destY, damage, cEntity.granny));

                // if ranged, shoot beam
                if (cEntity.raw.attackRange > 1) {
                    cEntity.game.addEntity(new Beam(cEntity.game, {x: origX, y: origY}, {x: destX, y: destY}, damage));
                }
                startX = target.blockX;
                startY = target.blockY;
                bounce--;
            }
            // target that we get is fine.
            // we just need to create our own bfsAttackAgain()
        }
        laser.stat = {
            attack: 0.5
        }
        return laser;
    }
    static bingoBall(){ // Ye-soon's
       const bingo =  this.createInitial();
       bingo.name = "Ye-Soon's Bingo Balls";
        // if (bingo.attack && typeof bingo.attack === 'function') {
        //       bingo.attack()} // this checks if it exists.
       bingo.attack = function (cEntity){

       }
       bingo.stat = function (){
        // alters stat
       }
       bingo.asset = 0;
        // make this return the object.
        return bingo;
    }
    static cableNeedles() { // Pearl's
        const needle = this.createInitial();
        needle.name = "Pearl's Cable Needles";
        needle.attack = function(cEntity) {

        }
        needle.stat = () => {

        }
    }
}
class HealNum {
    constructor(game, x, y, num) {
        // not very intuitive naming convetion here:
        // isEnemyDealt will be true if this damage is being done
        // to an enemy.
        Object.assign(this, { game, num});
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y + (Math.random() - 0.5) * 40;
        this.z = 100_000;
        this.elapsed = 0;
        this.lifetime = 1;
        this.size = 16 + Math.sqrt(num);
    }

    update() {
        this.elapsed += this.game.clockTick;
        
        if (this.elapsed >= this.lifetime) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.font = `bold ${this.size}px runescape`;
        ctx.fillStyle = 'green';
        ctx.fillText("+" + this.num, this.x, this.y - this.elapsed * 50);

        ctx.restore();
    }
}
