const ENTITY_SIZE = 24;
class AutoBattler {
    constructor(game, sceneManager, players, enemies, text) {
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
        this.selectedSpot = false;
        this.arena = [[]];
        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
        this.z = -5; // draw this first.

        this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlock.png");
        PARAMS.spaceWidth = this.isoBlock.width; // TODO replace with hard value
        this.spaceWidth = this.isoBlock.width;
        this.spaceHeight = 24; // hard value from image 32x32
        this.spaceHeightAdjusted = 15;
        this.scale = 3;
        this.nextX = 16; // the nextX for the next block.
        this.nextY = 8; // the nextY for the next block

        this.allBlocks = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.showText(text)
        this.init();
    }

    showText(text) {
        const textWidth = this.game.ctx.measureText(this.text).width;
        const frames = 120; // modifiable
        const textStartFrames = Animate.easeInOut(-textWidth, this.game.height/2, this.game.width - textWidth, 
            this.game.height/2, frames);
        this.game.addEntity(new Text(text, textStartFrames, frames));
    }
    
    init() {
        // initialize all blocks in battlefield
        for (let i = 0; i < 7*7; i++) {
            const block = new Block(i % 7, Math.floor(i / 7));
            block.animate(Animate.bounceSpace(-block.isoY, 0, 60), i);
            console.log(block);
            this.allBlocks[block.mapY][block.mapX] = block;

            this.game.addEntity(block);
        }

        // initialize all blocks on bench
        for(let i = 0; i < 7; i++) {
            const block = new Block(8, i);
            block.animate(Animate.bounceSpace(1050 - block.isoY, 0, 90), i + 64);
            this.allBlocks[block.mapY][block.mapX] = block;

            this.game.addEntity(block);
        }

        // initialize all friendly units and place on bench
        for(let i = 0; i < this.players.length && i < 7; i++) {
            const block = this.allBlocks[i][8];
            block.unit = new CombatEntity(this.players[i], this, block);
            this.game.addEntity(block.unit);
        }
        // initialize all enemy units and place onto battlefield
        for (let i = 0; i < 3; i++) {
            const block = this.allBlocks[6][i];
            block.unit = new CombatEntity(this.enemies[i], this, block);
            this.game.addEntity(block.unit);
        }
    }

    update() {
        // handle mouse input
        let mouseX = this.game.mouse?.x;
        let mouseY = this.game.mouse?.y;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 9; j++) {
                let block = this.allBlocks[i][j];
                if (!block) continue;
                if (this.isMouseOverTile(mouseX, mouseY, block)) {
                    console.log("x: " + j + " | y: " + i);
                    block.hovered = true;
                    if (this.game.click) {
                        if (!this.selectedBlock && block.unit?.granny) {
                            block.block.selected = true;
                            this.selectedBlock = block;
                        } else if (this.selectedBlock && !block.block.occupied) {
                            const entity = this.selectedBlock.block.occupied;
                            entity.blockMove(block.block);
                            this.setUnits.add(entity);
                            this.selectedBlock = null;
                        }
                    }
                } else {
                    block.hovered = false;
                }
            }
        }

        /*if(this.setUnits.size == this.players.length){
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 9; j++) {
                    let block = this.allBlocks[i][j];
                    if(!block) continue;
                    if(block.block.occupied) {
                        console.log(block.block.occupied.entity.name
                            + " => x: " + j + " | y: " + i
                        );
                        // start the battle.
                        // block.block.occupied.ready = true;
                    }
                }
            }
            console.log(this.allBlocks);
            // this.setUnits.forEach((unit) => {
            //     unit.ready = true;
            // })
        }*/

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
        if (!tile) return false;

        let x = tile.isoX;
        let y = tile.isoY;
        if (tile.hovered || tile.selected) {
            y -= tile.height * 0.25;
        }
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
    }
}
class CombatEntity {
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
      this.ready = false;
      this.assetSize = ASSET_MANAGER.getAsset(this.entity.asset).height;
    }
  
    update() {
        if(this.entity.hp <= 0){
            this.block.occupied = null;
            this.removeFromWorld = true;
        }
      // Every 60 ticks, decide what to do.
      if (this.ticker % (this.frameRate/2) === 0 && this.ready) {
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
            // Insert attack logic here.
            this.attacking = true;
            this.allBlocks[found.y][found.x].block.occupied.entity.hp -= this.entity.attack;
          } else {
            this.attacking = false;
            // Move one block along the BFS path.
            // We choose the first step in the found path.
            const nextBlockPos = found.path[0];
            
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
        const img = ASSET_MANAGER.getAsset(
            (this.entity.granny ? "./assets/battleScene/allyHp.png" :
                "./assets/battleScene/enemyHealth.png"
            ));
        // const adjustedX =
        const hpY = this.size / 4;
        // draw blackHp first
        ctx.drawImage( // magic numbers are hard defined just for hp.
            img,
            1,
            5,
            30,
            26,
            this.block.x + this.block.width * this.block.scale / 2
                + (this.entity.granny ? -1 : 1/2 ) * this.size * this.block.scale / 2,
            (this.block.y + this.spaceHeightAdjusted * this.block.scale / 2
                - this.size * this.block.scale) - hpY *2 +
                (this.block.hovered || this.block.selected ? 
                    this.block.height * this.block.scale / 4 : 0),
            this.size / 4 * this.block.scale,
            Math.floor(this.size / 4 * this.block.scale * (26/30)) // raw ratio
        );
        // draw realHp
        const currHpBar = this.entity.hp / this.entity.maxHp;
        const pHeight = 5 + currHpBar * 26;

        ctx.drawImage(
            img,
            1,
            5,
            30,
            26,
            this.block.x + this.block.width * this.block.scale / 2 + (this.entity.granny ? -1 : 1/2 ) * this.size * this.block.scale / 2,
            (this.block.y + this.spaceHeightAdjusted * this.block.scale / 2 - this.size * this.block.scale) - hpY *2 + (this.block.hovered || this.block.selected ? 
                    this.block.height * this.block.scale / 4 : 0),
            this.size / 4 * this.block.scale,
            Math.floor(this.size / 4 * this.block.scale * (26/30)) // raw ratio
        );

        ctx.drawImage(
            ASSET_MANAGER.getAsset(this.entity.asset),
            this.currentFrame * this.assetSize,
            0,
            this.assetSize,
            this.assetSize,
            this.block.x + this.block.width * this.block.scale / 2 - this.size * this.block.scale / 2,
            (this.block.y + this.spaceHeightAdjusted * this.block.scale / 2 - this.size * this.block.scale) + (this.block.hovered || this.block.selected ? 
                    this.block.height * this.block.scale / 4 : 0),
            this.size * this.block.scale,
            this.size * this.block.scale
        );
    }
    blockMove(newBlock){
        this.block.occupied = null;
        this.block.selected = false;
        this.z = newBlock.z;
        this.block = newBlock;
        this.block.occupied = this;
        this.blockX = this.block.blockX;
        this.blockY = this.block.blockY;
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
    constructor(text, position, expire) {
        Object.assign(this, {text, position, expire});
        this.z = 35; // highest, should come before everything
        this.vanish = this.expire / 2;
        this.vanishCounter = this.vanish;
        this.index = 0;
    }
    update() { // update position of the text
        this.x = this.position[this.index].x;
        this.y = this.position[this.index].y;
        this.index++;
    }
    draw(ctx) {
        ctx.save();

        if(this.expire < 2) {
            this.removeFromWorld = true;
            return;
        } else if(this.expire <= this.vanish){
            // make it vanish, lower its transparency.
            ctx.globalAlpha = this.vanishCounter / this.vanish;
            this.vanishCounter --;
        }
        const width = ctx.measureText(this.text).width;
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
        const textSize = 50; // modifiable
        ctx.font = "" + textSize + "px serif";
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
        this.expire--;
    }
}
