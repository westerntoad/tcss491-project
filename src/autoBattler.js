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
        this.allUnits = [];
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
            this.allUnits.push(block.unit);
            this.game.addEntity(block.unit);
        }
        // initialize all enemy units and place onto battlefield
        for (let i = 0; i < 3; i++) {
            const block = this.allBlocks[6][i];
            block.unit = new CombatEntity(this.enemies[i], this, block);
            this.allUnits.push(block.unit);
            this.game.addEntity(block.unit);
        }


        this.startButton = new StartButton(this.game, () => {
            this.allUnits.forEach(unit => {
                if (unit.blockX == 8)
                    return false;
            });

            return true;
        }, () => {
            this.allUnits.forEach(unit => {
                unit.ready = true;
            });
            console.log(this.allBlocks);
            console.log(this.allUnits);
            console.log('game started');
        });
        this.game.addEntity(this.startButton);
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
                    block.hovered = true;
                    if (this.game.click) {
                        console.log(block);
                        if (!this.selectedBlock && block.unit && block.unit.granny) {
                            block.selected = true;
                            this.selectedBlock = block;
                        } else if (this.selectedBlock && !block.unit) {
                            const entity = this.selectedBlock.unit;
                            entity.blockMove(block);
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
    draw(ctx) {
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
    
    
    lose() {
        
    }
    endGame() {
        this.game.entities = [];
        this.game.ctx.fillStyle = "white"; 
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.sceneManager.restoreScene();
    }
}

class StartButton {
    constructor(game, isEnabled, onClick) {
        this.game = game;
        this.onClick = onClick;
        this.isEnabled = isEnabled;
        this.enabled = isEnabled();
        this.z = 100;
        this.x = 100;
        this.y = 100;
        this.width = 100;
        this.height = 100;
    }

    update() {
        this.enabled = this.isEnabled();

        const x = this.game.mouse?.x;
        const y = this.game.mouse?.y;
        if (this.game.click && this.enabled
                && clamp(this.x, x, this.x + this.width ) == x
                && clamp(this.y, y, this.y + this.height) == y) {

            this.onClick();
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.enabled)
            ctx.fillStyle = 'green';
        else
            ctx.fillStyle = 'red';

        ctx.fillRect(100, 100, 100, 100);
        ctx.restore();
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
        this.z = 100; // highest, should come before everything
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
