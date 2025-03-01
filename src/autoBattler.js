const ENTITY_SIZE = 24;
class AutoBattler {
    constructor(game, sceneManager, players, enemies, text) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;

        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
        this.z = -5; // draw this first.

        this.currRound = 1;
        this.totalRounds = this.enemies.length;

        this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlock.png");
        PARAMS.spaceWidth = this.isoBlock.width; // TODO replace with hard value
        this.spaceWidth = this.isoBlock.width;
        this.spaceHeight = 24; // hard value from image 32x32
        this.spaceHeightAdjusted = 15;
        this.scale = 3;

        this.allBlocks = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.showText(text);
        this.blockImg(text);
        this.prep = true;
        this.drawTrans = null;

        this.text = text;
        if(!this.sceneManager.setSpot) this.sceneManager.setSpot = [{name: text}]; // remember spots
        if(text == "Endless") {
            this.initEndless();
            this.endless = true;
        } else {
            this.initStory();
        }
    }
    blockImg(text) {
        console.log("Text being read: " + text);
        if(text === "Office" || text === "Derek King") {
            console.log("isoBlock changed.")
            this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlockCh3.png");
        }
    }
    setSpots(round) { // also recordSpots when `start` is pressed.
        const get  = this.sceneManager.setSpot.find(spot => spot.name === `${this.text}`);
        if(get) {
            console.log("we Got it");
            if(`round${round}` in get) {
                let i = 0;
                const got = get[`round${round}`];
                this.units().forEach(unit => {
                    if(unit.raw.granny) {
                        console.log(unit);
                        const isRecorded = got.find(spot => spot.granny === unit.raw.name);
                        if(isRecorded) {
                            unit.blockMove(this.allBlocks[isRecorded.y][isRecorded.x]);
                        } else {
                            if(unit.block.mapX !== 8){
                                unit.blockMove(this.allBlocks[i][8]);
                                i++;
                            }
                        }
                        unit.ready = false;
                    }
                });
            } else {
                let i = 0;
                this.units().forEach(unit => {
                    if(unit.raw.granny) {
                        console.log(unit);
                        unit.blockMove(this.allBlocks[i][8]);
                        unit.ready = false;
                        i++;
                    }
                });
            }
        }
        // remember previous spots in the map, store info in sceneManager
    }
    recordSpots(round) {
        let get  = this.sceneManager.setSpot.find(spot => spot.name === `${this.text}`);
        if(!get) {
            const newSpot = { name: this.text };
            this.sceneManager.setSpot.push(newSpot);
            get = newSpot;
        }

        //for loop through all granny unit positions and add them to an object.
        let arr = [];
        this.allBlocks.forEach(column => column.forEach(block => {
            if (block?.unit && block.unit.granny && block.unit.raw?.hp> 0) {
                arr.push({granny: block.unit.raw.name, x: block.mapX, y: block.mapY});
            }
        }));
        get[`round${round}`] = arr; // this should work lol.
        console.log(get);
    }

    showText(text) {
        const textWidth = this.game.ctx.measureText(this.text).width;
        const frames = 120; // modifiable
        const textStartFrames = Animate.moveExp(-textWidth, this.game.height/2, this.game.width / 2, 
            this.game.height/2, frames);
        this.game.addEntity(new Text(text, textStartFrames, frames));
    }

    // return all units within each block
    units() {
        let arr = [];
        this.allBlocks.forEach(column => column.forEach(block => {
            if (block?.unit && block.unit.raw?.hp > 0) {
                arr.push(block.unit);
            }
        }));

        return arr;
    }

    spawn(){
        // get spawnCost of enemies from input to autoBattler?
        // send in one of each enemy for the designated Chapter
        // Can we determine their cost via how much exp they give?

        //get spawnValue, determine which enemies to put out.
        //  Taking big reference from Risk of Rain spawning mechanic
        //increment spawnValue with spawnRate.
    }
    spawnRate(){
        //return spawnRate for the this.game.tick*
    }

    initEndless() {
        // initialize all blocks in battlefield
        for (let i = 0; i < 7*7; i++) {
            const block = new Block(i % 7, Math.floor(i / 7));
            block.animate(Animate.moveExp(0, -block.isoY, 0, 0, 45), i);
            this.allBlocks[block.mapY][block.mapX] = block;

            this.game.addEntity(block);
        }
        // initialize all blocks on bench
        for(let i = 0; i < 7; i++) {
            const block = new Block(8, i);
            block.animate(Animate.moveExp(0, 1050 - block.isoY, 0, 0, 45), i + 64);
            this.allBlocks[block.mapY][block.mapX] = block;
        
            this.game.addEntity(block);
        }
        // initialize all friendly units and place on bench
        for(let i = 0; i < this.players.length && i < 7; i++) {
            const block = this.allBlocks[i][8];
            block.unit = new CombatEntity(this.players[i], this, block);
            this.game.addEntity(block.unit);
        }
        const block = this.allBlocks[3][0];
        block.unit = new EndlessPortal(block, this.game); // create the portal
        this.game.addEntity(block.unit);
        this.spawnValue = 0;
        this.spawnRate = // important for increasing the rate of spawn
        this.init();
    }
    
    initStory() { // moveExp(startX, startY, endX, endY, frames)
        // initialize all blocks in battlefield
        for (let i = 0; i < 7*7; i++) {
            const block = new Block(i % 7, Math.floor(i / 7), this.isoBlock);
            block.animate(Animate.moveExp(0, -block.isoY, 0, 0, 50), i);
            this.allBlocks[block.mapY][block.mapX] = block;

            this.game.addEntity(block);
        }

        // initialize all blocks on bench
        for(let i = 0; i < 7; i++) {
            const block = new Block(8, i, this.isoBlock);
            block.animate(Animate.moveExp(0, 1050 - block.isoY, 0, 0, 40), i + 64);
            this.allBlocks[block.mapY][block.mapX] = block;

            this.game.addEntity(block);
        }

        // initialize all friendly units and place on bench
        for(let i = 0; i < this.players.length && i < 7; i++) {
            const block = this.allBlocks[i][8];
            block.unit = new CombatEntity(this.players[i], this, block);
            this.game.addEntity(block.unit);
        }
        this.setSpots(this.currRound - 1);
        // initialize all enemy units and place onto battlefield
        for (let i = 0; i < this.enemies[this.currRound - 1].length; i++) {
            const curr = this.enemies[this.currRound - 1][i];
            const block = ((curr.x || curr.x === 0) && (curr.y || curr.y === 0)) ? // 0 is falsey.
                this.allBlocks[(curr.x)][curr.y] : this.allBlocks[6][i];
            block.unit = new CombatEntity(this.enemies[this.currRound - 1][i], this, block);
            this.game.addEntity(block.unit);
        }
        this.init();
    }
    init() {
        this.startButton = new StartButton(this.game, () => {
            let canStart = true;
            this.units().forEach(unit => {
                if (unit.blockX == 8 || unit.ready)
                    canStart = false;
            });

            return canStart;
        }, () => { // HERE
            this.recordSpots(this.currRound-1);
            this.units().forEach(unit => {
                unit.ready = true;
            });

            this.prep = false;

            if(this.drawTrans) this.drawTrans.removeFromWorld = true;
            this.drawTrans = null;
            if(this.selectedBlock) this.selectedBlock.selected = false;
            this.selectedBlock = null
        });
        this.game.addEntity(this.startButton);
        PLAY.battle1();
    }
    update() {
        // force game over
        if(this.game.pressed['Escape']){
            this.exit = (this.exit ? this.exit + 1 : 1);
            console.log(this.exit);
            if(this.exit >= 5) {
                this.cleanup();
                this.game.addEntity(new GameOver(this.game, this.sceneManager, this));
            }
        } 
        // else if(this.game.pressed['a']) {
        //     this.sceneManager.story = true;
        //             this.cleanup();
        //             this.sceneManager.restoreScene();
        // }
        if(this.prep){ // uh oh, this is gross (but functional).
            // handle mouse input
            let mouseX = this.game.mouse?.x;
            let mouseY = this.game.mouse?.y;
            let flag = false;
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 9; j++) {
                    let block = this.allBlocks[i][j];
                    if (!block) continue;
                    if (this.isMouseOverTile(mouseX, mouseY, block) && !this.disableControl) {
                        //console.log(`x: ${i} | y : ${j}`);
                        block.hovered = true;
                        flag = (block.unit ? false : true);
                        if(this.selectedBlock && !block.unit) {
                            if(this.drawTrans) {
                                this.drawTrans.block = block;
                                this.drawTrans.z = block.z + 1;
                            }
                        }
                        if (this.game.click) {
                            if (!this.selectedBlock && block.unit && block.unit.granny) {
                                block.selected = true;
                                this.selectedBlock = block;

                                if(this.drawTrans) this.drawTrans.removeFromWorld = true;
                                this.drawTrans = new Transparent(block, this);
                                this.game.addEntity(this.drawTrans);
                            } else if (this.selectedBlock) {
                                if(!block.unit) {
                                    const entity = this.selectedBlock.unit;
                                    entity.blockMove(block);
                                    this.selectedBlock = null;
                                    this.drawTrans.removeFromWorld = true;
                                    this.drawTrans = null;
                                    PLAY.hit1();
                                } else if(block.unit == this.selectedBlock.unit){
                                    if(this.drawTrans) {
                                        this.drawTrans.removeFromWorld = true;
                                        this.drawTrans = null;
                                    }
                                    this.selectedBlock.selected = false;
                                    this.selectedBlock = null;
                                }else if(block.unit.granny){
                                    this.selectedBlock.selected = false;
                                    this.selectedBlock = block;
                                    block.selected = true;
                                    if(this.drawTrans) this.drawTrans.removeFromWorld = true;
                                    this.drawTrans = new Transparent(block, this);
                                    this.game.addEntity(this.drawTrans);
                                }
                            }
                        }
                    } else {
                        block.hovered = false;
                    }
                }
            }
            if(!flag && this.selectedBlock) {
                if(this.drawTrans) this.drawTrans.block = null;
            } 
        }
        // count the total number of players.
        let numAlivePlayers = 0;
        this.units().forEach(unit => {
            if (unit.granny) {
                numAlivePlayers++;
            }
        });

        if(this.endless){// endless case
            this.spawn();
        } else {

            // count the total number of players.
            const numAliveEnemies = this.units().length - numAlivePlayers;

            // player wins
            if (numAliveEnemies == 0 && !this.showingDialog) {
                let adoration = 0; // adding adoration display on 'Round Complete' screen
                this.enemies[this.currRound - 1].forEach((enemy) => {
                    adoration += enemy.exp;
                });
                this.currRound++;

                const finalRound = this.currRound > this.totalRounds;
                const title = `Round ${this.currRound - 1} complete`; // if final round
                                         // boss complete  // otherwise, current round complete
                if(this.story) title = 'Story complete';
                const callback = finalRound ? () => {
                    if(this.enemies.story) {console.log("story, here"); this.sceneManager.story = true;}
                    this.cleanup();
                    this.sceneManager.restoreScene();
                } : () => {
                    this.setSpots(this.currRound - 1);
                    this.showingDialog = false;
                    this.disableControl = false;

                    // TODO pass multiple round enemies from constructor
                    // DEBUG // similar to init for enemy placement.
                    // initialize all enemy units and place onto battlefield
                    for (let i = 0; i < this.enemies[this.currRound - 1].length; i++) {
                        const curr = this.enemies[this.currRound - 1][i];
                        const block = (curr.x || curr.x === 0) ? // 0 is falsey.
                            this.allBlocks[(curr.x)][curr.y] : this.allBlocks[6][i];
                        block.unit = new CombatEntity(this.enemies[this.currRound - 1][i], this, block);
                        this.game.addEntity(block.unit);
                    }
                    this.prep = true
                    
                }

                let buttonLabel = ``;
                if (this.currRound <= this.totalRounds) {
                    buttonLabel = `Next Round`;
                } 
                // else if (this.currRound == this.totalRounds) {
                //     buttonLabel = `Start Boss`;
                    // when we get to this round, we want to check if we have story checked,
                    // and play the dialogue.
                // } 
                else {
                    buttonLabel = `Return to Home`;
                }

                this.showingDialog = true;
                this.disableControl = true;
                this.selectedBlock = null;
                this.game.addEntity(new RoundComplete(this.game, title, adoration, buttonLabel, callback));
            }
        }
        // enemy wins
        if (numAlivePlayers == 0) {
            // game over
            
            this.cleanup();
            STOP.battle1();
            PLAY.gameover();
            this.game.addEntity(new GameOver(this.game, this.sceneManager, this));
        }
    }

    cleanup() {
        this.units().forEach(unit => unit.removeFromWorld = true);
        this.allBlocks.forEach(column => column.forEach(block => block ? block.removeFromWorld = true : void 0));
        this.startButton ? this.startButton.removeFromWorld = true : void 0;
        this.removeFromWorld = true;
    }

    draw(ctx) { // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.save();
        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        //ctx.drawImage(this.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
        
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
}

class StartButton {
    constructor(game, isEnabled, onClick) {
        this.game = game;
        this.onClick = onClick;
        this.isEnabled = isEnabled;
        this.enabled = isEnabled();
        this.z = 100_000;
        this.x = 750;
        this.y = 570;
        this.width = 200;
        this.height = 75;
    }

    update() {
        this.enabled = this.isEnabled();

        const x = this.game.mouse?.x;
        const y = this.game.mouse?.y;
        if (this.game.click
                && clamp(this.x, x, this.x + this.width ) == x
                && clamp(this.y, y, this.y + this.height) == y) {

            if (this.enabled) {
                this.onClick();
                PLAY.select();
            } else {
                PLAY.invalid();
            }
        }
    }

    draw(ctx) {
        ctx.save();
        // background
        let decoration = '';
        if (this.enabled) {
            ctx.fillStyle = 'green';
            decoration += 'bold '
        } else {
            ctx.fillStyle = 'red';
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);

        // text
        ctx.fillStyle = '#000000';
        ctx.font = `${decoration}32px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.fillText('Start', this.x + this.width * 0.5, this.y + this.height * 0.5 + 10);
        ctx.restore();
    }
}

class RoundComplete {
    constructor(game, title, adoration, buttonLabel, callback) {
        Object.assign(this, { game, title, adoration, buttonLabel, callback });
        this.z = 100_000;
        this.elapsed = 0;
        this.titleDelay = 0.75;
        this.adorationDelay = 1;
        this.buttonDelay = 1.5;
    }

    update() {
        this.elapsed += this.game.clockTick;

        // is player's mouse hovered over the button?
        const mX = this.game.mouse?.x;
        const mY = this.game.mouse?.y;
        this.buttonHighlighted = mX > this.buttonX && mX < this.buttonX + this.buttonWidth
            && mY > this.buttonY && mY < this.buttonY + this.buttonHeight;

        // if hovered & player clicked, return to Mary's House.
        if (this.game.click && this.buttonHighlighted) {
            this.removeFromWorld = true;
            this.callback();
        }
    }

    draw(ctx) {
        ctx.save();
        // background
        const backgroundWidth = 500;
        const backgroundHeight = 300;
        const backgroundX = (PARAMS.canvasWidth - backgroundWidth) * 0.5;
        const backgroundY = (PARAMS.canvasHeight - backgroundHeight) * 0.5;
        ctx.fillStyle = '#ffffff99';
        ctx.fillRect(
            backgroundX, backgroundY,
            backgroundWidth, backgroundHeight
        );

        // header text
        if (this.elapsed >= this.titleDelay) {
            ctx.fillStyle = '#00ff00';
            ctx.font = '40px monospace';
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillText(this.title, PARAMS.canvasWidth * 0.5, backgroundY + 50);
        }

        // adoration
        if (this.elapsed >= this.adorationDelay) {
            const adorationDisplaySpeed = 320;
            const deltaAdoration = Math.min(this.adoration, Math.round((this.elapsed - this.adorationDelay) * adorationDisplaySpeed));
            ctx.fillStyle = '#44ff44';
            ctx.font = '24px monospace';
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillText(`+${deltaAdoration}`, PARAMS.canvasWidth * 0.5, backgroundY + 80);
        }

        // callback button
        if (this.elapsed >= this.buttonDelay) {
            // background
            this.buttonWidth = 300;
            this.buttonHeight = 100;
            this.buttonX = (PARAMS.canvasWidth - this.buttonWidth) * 0.5;
            this.buttonY = backgroundY + 160;
            ctx.fillStyle = this.buttonHighlighted ? '#aaaaaa' : '#ffffff';
            ctx.fillRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
            ctx.fillStyle = '#000000';
            ctx.strokeRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);

            // text
            ctx.fillStyle = '#000000';
            ctx.font = '32px monospace';
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillText(this.buttonLabel, PARAMS.canvasWidth * 0.5, this.buttonY + this.buttonHeight * 0.5);
        }


        ctx.restore();
    }
}

class GameOver {
    constructor(game, scene, battle) {
        Object.assign(this, { game, scene, battle });
        
        this.buttonWidth = 300;
        this.buttonHeight = 75;
        this.buttonX = (PARAMS.canvasWidth - this.buttonWidth) * 0.5;
        this.buttonY = PARAMS.canvasHeight * 0.5 + 50;
        this.buttonHighlighted = false;
    }

    update() {
        // is player's mouse hovered over the button?
        const mX = this.game.mouse?.x;
        const mY = this.game.mouse?.y;
        this.buttonHighlighted = mX > this.buttonX && mX < this.buttonX + this.buttonWidth
            && mY > this.buttonY && mY < this.buttonY + this.buttonHeight;

        // if hovered & player clicked, return to Mary's House.
        if (this.game.click && this.buttonHighlighted) {
            this.battle.cleanup();
            this.scene.restoreScene();
        }
    }

    draw(ctx) {
        ctx.save();
        // background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);

        // game over text
        ctx.fillStyle = '#ff0000';
        ctx.font = '50px monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.fillText("Game Over", PARAMS.canvasWidth * 0.5, PARAMS.canvasHeight * 0.5 - 100);

        // button
        ctx.fillStyle = this.buttonHighlighted ? '#aaaaaa' : '#ffffff';
        ctx.fillRect(
            this.buttonX, // x
            this.buttonY, // y
            this.buttonWidth, this.buttonHeight            // width, height
        );
        // button text
        ctx.fillStyle = '#00ff00'
        ctx.font = '20px monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.fillText("Return to Mary's House", PARAMS.canvasWidth * 0.5, (PARAMS.canvasHeight + this.buttonHeight) * 0.5 + 50);

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
        this.z = 100000; // highest, should come before everything
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
        ctx.textAlign = 'center';
        ctx.textBaseline = "alphabetic";
        const textSize = 50; // modifiable
        ctx.font = "" + textSize + "px serif";
        ctx.fillStyle = 'black'
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
        this.expire--;
    }
}
class EndlessPortal {
    constructor(block, game) {
        this.game = game;
        this.block = block;
        this.size = ENTITY_SIZE;
        this.blockX = block.mapX; 
        this.blockY = block.mapY;
        this.z = this.block.z + 1;
        this.img = ASSET_MANAGER.getAsset("./assets/enemies/endlessPortal.png");

        this.currentFrame = 0;
        this.frames = this.img.width / 32;
        this.assetSize = this.frames - 1;
        this.drawTime = 0;
        this.refreshRate = 200; // every 0.2 secs
        this.spaceHeightAdjusted = PARAMS.spaceHeightAdjusted;
    }
    update(){}
    draw(ctx){
        this.drawTime += this.game.clockTick;
        if(this.drawTime >= this.refreshRate) {
            this.currentFrame = this.currentFrame >= this.frames - 1 ? 0 :
                this.currentFrame + 1;
            this.drawTime = 0;
        }
        ctx.drawImage(this.img, 
            this.currentFrame * this.assetSize,
            0, 32, 32,
            this.block.isoX + this.block.width / 2
                - this.size * this.block.scale / 2,
            (this.block.isoY + this.spaceHeightAdjusted * this.block.scale / 2
                - this.size * this.block.scale),
            this.size * this.block.scale,
            this.size * this.block.scale
        );
    }
}
