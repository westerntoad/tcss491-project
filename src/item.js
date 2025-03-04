const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
];
class Item { // am I keeping all items here?
    // static class
    constructor(){
        throw new Error("Item is a static class poo poo");
    }
    static bfs(cEntity, startX, startY, ally = false, prev = null) { // lets look for all 
        // search = true to look for allies, search = false for enemies
        const queue = [];
        const visited = new Set();
        queue.push({x: startX, y: startY, dist: 0});
        visited.add(`${startX},${startY}`);
        if(prev) {
            visited.add(...prev);
        }
        let target = null;
        while (queue.length) {
            const current = queue.shift();
            const currBlock = cEntity.allBlocks[current.y][current.x];
            if(current.dist > cEntity.raw.attackRange) continue;
            if(currBlock.unit?.raw.hp > 0) {
                const isAlly = currBlock.unit.granny === cEntity.granny;
                if((ally && isAlly) || (!ally && !isAlly)) {
                    target = currBlock.unit;
                    break;
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
            level: 1,
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
    static laserPointer() {
        const laser = this.createInitial();
        laser.name = "Vera's Laser Pointer";
        laser.asset = ASSET_MANAGER.queueDownload("./assets/items/laserPointer.png");
        laser.attack = (cEntity) => {
            let bounce = 1 + laser.level * 2;
            const struck = new Set();
            let startX = cEntity.blockX;
            let startY = cEntity.blockY;
            while(bounce && target) { // break early if no more enemies that can be chained
                
                const target = Item.bfs(cEntity, startX, startY, false);
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
        laser.bfsChain = (cEntity) => {

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
    static teaCup(){ // Mary's
        const tea = this.createInitial();
        tea.name = "Mary's Teacup";
        tea.attack = function (cEntity) {

        }
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