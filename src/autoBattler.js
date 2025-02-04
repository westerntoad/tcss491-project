class AutoBattler{
    constructor(game, sceneManager, players, enemies, text) {
        this.prevTextAlign = game.ctx.textAlign;
        this.prevTextBaseline = game.ctx.textBaseline;
        game.ctx.textAlign = "start";
        game.ctx.textBaseline = "alphabetic";

        // this.id = Math.random();
        // console.log("ID for BattleScene: ", this.id);
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;

        this.frameRate = 60;
        this.toDraw = 0;
        this.buttonPressed = false;
        this.eventListener = [];
        this.dialogue = null;
        this.game.ctx.font = "22px serif";
        this.countDown = 0;
        this.arena = [[]];
        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
        this.z = -5; // draw this first.

        this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlock.png");
        this.spaceWidth = this.isoBlock.width;
        this.spaceHeight = 24; // hard value from image 32x32
        this.spaceHeightAdjusted = 15;
        this.scale = 3;
        this.nextX = 16; // the nextX for the next block.
        this.nextY = 8; // the nextY for the next block

        this.allBlocks = Array.from({ length: 7 }, () => Array(7).fill(null));
        this.init(text);
    }
    
    init(text){ // show the starting Chapter ? 
        this.game.ctx.save();
        const textSize = 50; // modifiable

        this.game.ctx.font = "" + this.size + "px serif";
        const textWidth = this.game.ctx.measureText(this.text).width;

        const frames = 120; // modifiable
        const textStartFrames = Animate.easeInOut(-textWidth, this.game.height/2, this.game.width - textWidth, 
            this.game.height/2, frames);
        this.game.addEntity(new Text(text, textStartFrames, textSize, frames));
        this.countDown = frames;

        this.game.ctx.restore();
        
        this.nextSequence = []; // create all blocks, let them fall then bounce

        let z = 0;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                let isoX = (i - j) * this.spaceWidth * this.scale / 2 + 500;
                let isoY = (i + j) * this.spaceHeight * this.scale / 3 + 200;

                // Make the blocks fall from higher up and bounce once
                const position = Animate.bounceSpace(0, isoY, 60); 

                const space = new Block(
                    this.isoBlock, 
                    isoX,  
                    this.spaceWidth, 
                    this.spaceHeight, 
                    this.scale, 
                    position, 
                    z
                );

                // Store block in 2D array
                this.allBlocks[i][j] = {
                    x: isoX,
                    y: isoY,
                    block: space
                };

                this.nextSequence.push(space);
                z++;
            }
        }

        this.game.ctx.canvas.addEventListener("mousemove", (event) => {
            let mouseX = event.offsetX;
            let mouseY = event.offsetY;

            let found = false;
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 7; j++) {
                    let block = this.allBlocks[i][j];
                    if (!found && this.isMouseOverTile(mouseX, mouseY, block)) {
                        block.block.hovered = true;
                        found = true;
                    } else {
                        block.block.hovered = false;
                    }
                }
            }
        });


        // const position = Animate.bounceSpace(0, 500, 60) // startY, endY, frames
        // this.nextSequence.push(new Space(this.isoBlock, 500, this.spaceWidth, this.spaceHeight, 
        //     this.scale, position, 5)); // x, width, height, scale, position, z
    }
    update(){
        // if we move to next round, we can kill everything, place it back into stands
        // two states: set up grandmas, play>
        if(this.nextSequence.length > 0) {
            this.game.addEntity(this.nextSequence[0]);
            this.nextSequence.shift();
        } // image, block, spaceHeightAdjusted, size
        if(this.countDown == 0) {


                this.game.addEntity(new Entity(
                    Object.assign({}, this.players[0]),
                    this.allBlocks[6][0].block, 
                    this.spaceHeightAdjusted, 
                    this.spaceWidth,
                    6, 3, 
                    this.allBlocks, 
                    this.frameRate));
                this.game.addEntity(new Entity(
                    Object.assign({}, this.players[1]),
                    this.allBlocks[6][0].block, 
                    this.spaceHeightAdjusted, 
                    this.spaceWidth,
                    5, 2, 
                    this.allBlocks, 
                    this.frameRate));
                this.game.addEntity(new Entity(
                    Object.assign({}, this.players[2]),
                    this.allBlocks[6][0].block, 
                    this.spaceHeightAdjusted, 
                    this.spaceWidth,
                    4, 4, 
                    this.allBlocks, 
                    this.frameRate));
                    
                    this.game.addEntity(new Entity(
                        Object.assign({}, this.enemies[0]),
                        this.allBlocks[0][1].block, 
                        this.spaceHeightAdjusted, 
                        this.spaceWidth,
                        0, 1, 
                        this.allBlocks, 
                        this.frameRate));
                    this.game.addEntity(new Entity(
                        Object.assign({}, this.enemies[1]),
                        this.allBlocks[0][1].block, 
                        this.spaceHeightAdjusted, 
                        this.spaceWidth,
                        0, 2, 
                        this.allBlocks, 
                        this.frameRate));
                    this.game.addEntity(new Entity(
                        Object.assign({}, this.enemies[2]),
                        this.allBlocks[0][1].block, 
                        this.spaceHeightAdjusted, 
                        this.spaceWidth,
                        0, 3, 
                        this.allBlocks, 
                        this.frameRate));    
        }
        this.countDown--;

    }
    draw(ctx){
        ctx.drawImage(this.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
        
    }
    isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
        let area = 0.5 * (-by * cx + ay * (-bx + cx) + ax * (by - cy) + bx * cy);
        let s = (ay * cx - ax * cy + (cy - ay) * px + (ax - cx) * py) / (2 * area);
        let t = (ax * by - ay * bx + (ay - by) * px + (bx - ax) * py) / (2 * area);
    
        return s >= 0 && t >= 0 && (s + t) <= 1;
    }
    isMouseOverTile(mouseX, mouseY, tile) {
        let { x, y } = tile; // Get tile properties
        const width = 32 * this.scale;
        const height = 15 * this.scale;
    
        let Tx = x + width / 2, Ty = y;            // Top
        let Lx = x, Ly = y + height / 2;           // Left
        let Rx = x + width, Ry = y + height / 2;   // Right
        let Bx = x + width / 2, By = y + height;   // Bottom
    
        return (
            this.isPointInTriangle(mouseX, mouseY, Tx, Ty, Lx, Ly, Rx, Ry) || 
            this.isPointInTriangle(mouseX, mouseY, Bx, By, Lx, Ly, Rx, Ry)
        );
    }
    
    
    lose(){
        
    }
    endGame() {
        this.game.entities = [];
        this.game.ctx.fillStyle = "white"; 
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.sceneManager.restoreScene();
        this.game.ctx.textAlign = this.prevTextAlign;
        this.game.ctx.textBaseline = this.prevTextBaseline;
    }
}
class Entity {
    constructor(entity, block, spaceHeightAdjusted, size, blockX, blockY, allBlocks, frameRate) {
      Object.assign(this, { entity, block, spaceHeightAdjusted, size, blockX, blockY, allBlocks, frameRate });
      this.z = this.block.z;
      this.x = this.block.x + this.block.width * this.block.scale / 2;
      this.y = this.block.y + this.spaceHeightAdjusted * this.block.scale / 2;
      this.frames = ASSET_MANAGER.getAsset(this.entity.asset).width / size;
      this.currentFrame = 0;
      this.block.occupied = this;
      this.ticker = 0;
      this.attacking = false;
    }
  
    update() {
        if(this.entity.hp <= 0){
            this.block.occupied = null;
            this.removeFromWorld = true;
        }
      // Every 60 ticks, decide what to do.
      if (this.ticker % (this.frameRate/2) === 0) {
        const startX = this.blockX;
        const startY = this.blockY;
        const attackRange = this.entity.attackRange;
        // For a non-granny entity (enemy), targetTeam should be true (i.e. granny entities).
        const targetTeam = !this.entity.granny;
        
        // Initialize BFS.
        const queue = [];
        const visited = new Set();
        queue.push({ x: startX, y: startY, dist: 0, path: [] });
        visited.add(`${startX},${startY}`);
        
        let found = null;
        
        // Run BFS.
        while (queue.length) {
          const current = queue.shift();
          // Retrieve the block at (current.x, current.y)
          const currentBlockData = this.allBlocks[current.y][current.x];
          const currentBlock = currentBlockData.block;
          
          // If the block is occupied by some entity other than ourselves…
          if (currentBlock.occupied && currentBlock.occupied !== this) {
            // If that entity is our target (e.g., granny), we have found a candidate.
            if (currentBlock.occupied.entity.granny === targetTeam) {
              found = current;
              break;
            }
            // Otherwise, treat this block as an obstacle; skip expanding it.
            continue;
          }
          
          // Expand neighbors (up, down, left, right).
          const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
          ];
          for (const d of directions) {
            const nx = current.x + d.dx;
            const ny = current.y + d.dy;
            if (nx < 0 || nx >= 7 || ny < 0 || ny >= 7) continue;
            const key = `${nx},${ny}`;
            if (visited.has(key)) continue;
            visited.add(key);
            queue.push({
              x: nx,
              y: ny,
              dist: current.dist + 1,
              path: current.path.concat({ x: nx, y: ny })
            });
          }
        }
        
        // Decision making:
        if (found) {
          if (found.dist <= attackRange) {
            console.log(`Target within range at (${found.x}, ${found.y}). Attack!`);
            // Insert attack logic here.
            this.attacking = true;
            this.allBlocks[found.y][found.x].block.occupied.entity.hp -= this.entity.attack;
          } else {
            this.attacking = false;
            // Move one block along the BFS path.
            // We choose the first step in the found path.
            const nextBlockPos = found.path[0];
            console.log(`Moving from (${startX}, ${startY}) to (${nextBlockPos.x}, ${nextBlockPos.y}).`);
            
            // Unoccupy the current block.
            this.block.occupied = null;
            
            // Update grid coordinates.
            this.blockX = nextBlockPos.x;
            this.blockY = nextBlockPos.y;
            this.block = this.allBlocks[this.blockY][this.blockX].block;
            
            // Mark the new block as occupied.
            this.block.occupied = this;
            
            // Update pixel coordinates (assuming center of the block).
            this.x = this.block.x + this.block.width * this.block.scale / 2;
            this.y = this.block.y + this.spaceHeightAdjusted * this.block.scale / 2;
            
            // Update the entity’s z to match the new block.
            this.z = this.block.z;
          }
        } else {
            this.attacking = false;
          console.log("No opposing unit found via BFS.");
        }
      }
      this.ticker++;
    }
  
    draw(ctx) {
        if(this.ticker % (this.frameRate / 4) === 0 && this.attacking){
            if(this.currentFrame >= this.frames -1) this.currentFrame = 0;
            else this.currentFrame++;
        }
        // draw the hp?
        
        ctx.drawImage(
            ASSET_MANAGER.getAsset(this.entity.asset),
            this.currentFrame * this.size,
            0,
            this.size,
            this.size,
            this.x - this.size * this.block.scale / 2,
            (this.y - this.size * this.block.scale) +
            (this.block.hovered ? this.block.height * this.block.scale / 4 : 0),
            this.size * this.block.scale,
            this.size * this.block.scale
        );
    }
  }
  
  
class Projectile{
    constructor(x, y, velocityX, velocityY){
        Object.assign(this, {x, y, velocityX, velocityY});
        this.velocityX;
        this.velocityY;
    }
    update(){
        // keep moving 
    }
    draw(){

    }
}
class Text {
    /**
     * 
     * @param {string} text text to display
     * @param {array of objects} position [{x, y}, {x, y}]
     * @param {number} size size of text
     * @param {number} expire time until text vanishes
     */
    constructor(text, position, size, expire){
        Object.assign(this, {text, position, size, expire});
        this.z = 35; // highest, should come before everything
        this.vanish = this.expire / 2;
        this.vanishCounter = this.vanish;
        this.index = 0;
    }
    update(){ // update position of the text
        this.x = this.position[this.index].x;
        this.y = this.position[this.index].y;
        this.index++;
    }
    draw(ctx){
        ctx.save();
        if(this.expire < 2) {
            this.removeFromWorld = true;
            return;
        } else if(this.expire <= this.vanish){
            // make it vanish, lower its transparency.
            ctx.globalAlpha = this.vanishCounter / this.vanish;
            this.vanishCounter --;
        }
        ctx.font = "" + this.size + "px serif";
        const width = ctx.measureText(this.text).width;
        // string, x, y
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
        this.expire--;
    }
}
class Block {
    constructor(isoBlock, x, width, height, scale, position, z){
        Object.assign(this, {isoBlock, x, width, height, scale, position, z});
        this.hovered = false
    }
    update(){
        if(this.position.length > 0){
            this.y = this.position[0].y;
            this.position.shift();
        }
    }
    draw(ctx){
        
        ctx.drawImage(this.isoBlock, 0, 0, this.width, this.height,
            this.x, this.y + (this.hovered == true ?
            this.height * this.scale / 4 : 0), // if hovered
            this.width * this.scale, this.height * this.scale);
    }
    position(position){
        this.position = position;
    }

    // create spaces, see what is occupying the space, and attach it to the space?
}
class Enemy {
    constructor(){
        Object.assign(this, {})
    }
    update(){

    }
    draw(ctx){

    }
}
class Ally {
    constructor(){

    }
}
class Animate {
    constructor() {
        throw new Error("Animate is a static class and cannot be instantiated.");
    }

    static textDisplay(text) {
        // return the entire x and y value of the text?
    }

    static easeInOut(startX, startY, endX, endY, frames) {
        let positions = [];

        for (let i = 0; i < frames; i++) {
            let progress = i / frames; // Normalize progress (0 to 1)
            let bounceEffect = this.easeInOutQuad(progress);

            let currentX = startX + (endX - startX) * bounceEffect;
            let currentY = startY + (endY - startY) * bounceEffect;

            positions.push({ x: currentX, y: currentY });
        }

        return positions;
    }

    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    /**
     * Simulates a falling effect with a single bounce.
     * @param {number} startY - The initial Y position (higher up).
     * @param {number} endY - The final Y position where the object lands.
     * @param {number} frames - Total number of frames for the animation.
     * @param {number} overshootFactor - How much below endY the object falls before bouncing.
     * @return {Array} - Returns an array of {x, y} positions for animation.
     */
    static bounceSpace(startY, endY, frames, overshootFactor = 0.2) {
        let positions = [];
        let overshootY = endY + (endY - startY) * overshootFactor; // Overshoot below endY

        let halfFrames = Math.floor(frames * 0.6); // Time to reach overshoot
        let bounceFrames = frames - halfFrames; // Remaining frames for bounce

        // Falling to overshoot
        for (let i = 0; i < halfFrames; i++) {
            let progress = i / halfFrames; // Normalize 0 to 1
            let easedProgress = this.easeInQuad(progress); // Fall fast
            let currentY = startY + (overshootY - startY) * easedProgress;
            positions.push({ x: 0, y: currentY });
        }

        // Bouncing up to settle at endY
        for (let i = 0; i < bounceFrames; i++) {
            let progress = i / bounceFrames; // Normalize 0 to 1
            let easedProgress = this.easeOutQuad(progress); // Bounce slows down
            let currentY = overshootY + (endY - overshootY) * easedProgress;
            positions.push({ x: 0, y: currentY });
        }

        return positions;
    }

    /**
     * Ease-in function (falling phase, starts slow, speeds up)
     */
    static easeInQuad(t) {
        return t * t;
    }
    
    /**
     * Simulates a skew effect that peaks at the midpoint of an animation.
     * @param {number} frames - Total frames for animation.
     * @return {Array} - Returns an array of skew values.
     */
    static skewEffect(frames) {
        let skews = [];
        
        for (let i = 0; i < frames; i++) {
            let progress = i / frames; // Normalize progress (0 to 1)
            
            // Skew peaks at 50% progress, then eases back to 0
            let skewAmount = Math.sin(progress * Math.PI) * 0.5; // Max skew = ±0.5
            
            skews.push(skewAmount);
        }
        
        return skews;
    }


    /**
     * Ease-out function (bounce phase, starts fast, slows down)
     */
    static easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }
    static hit() {

    }
}
