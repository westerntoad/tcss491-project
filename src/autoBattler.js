const ENTITY_SIZE = 24;
class AutoBattler {
    constructor(game, sceneManager, players, enemies, text, grannyLimit) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;
        this.z = -5; // draw this first.

        this.currRound = 1;
        this.totalRounds = this.enemies.length;

        this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlock.png");
        PARAMS.spaceWidth = this.isoBlock.width; // TODO replace with hard value
        this.spaceWidth = this.isoBlock.width;
        this.spaceHeight = 24; // hard value from image 32x32
        this.spaceHeightAdjusted = 15;
        this.scale = PARAMS.scale;

        this.allBlocks = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.allShadows = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.showText(text);
        this.blockImg(text);
        this.prep = true;
        this.drawTrans = null;

        this.text = text;
        this.grannyLimit = grannyLimit;
        if(!this.sceneManager.setSpot) this.sceneManager.setSpot = [{name: text}]; // remember spots
        if(text == "Endless") {
            this.initEndless();
            this.endless = true;
        } else {
            this.initStory();
        }
        if (text == "Office") {
            PLAY.battle2();
        } else if (text == "Tutorial" || text == "Dog Level") {
            PLAY.dogfight();
        } else {
            PLAY.battle1();
        }
    }
    blockImg(text) {
        console.log("Text being read: " + text);
        this.backGround = ASSET_MANAGER.getAsset("./assets/autoBattler/forestBG.png");
        this.shadow = ASSET_MANAGER.getAsset("./assets/autoBattler/forestShadow.png");
        if(text === "Office" || text === "Derek King") {
            this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlockCh3.png");
            this.backGround = null;
            // set BG here.
        } else if(text === "Woebegone Park" || text === "Melanie Martinez") {
            this.isoBlock = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlock_park1.png");
            this.backGround = null;
            // set BG here.
        }
        if(this.backGround) {
            this.extra = {
                img: ASSET_MANAGER.getAsset("./assets/autoBattler/forestBush.png"),
                z: -2,
                draw: function(ctx) {
                    ctx.drawImage(this.img, 0, 0, ctx.canvas.width, ctx.canvas.height);
                },
                update: () => {}
            };
            this.game.addEntity(this.extra);
        }
        if(text == "Dog Level") {
            let max = 1;
            this.players.forEach(player => {
                max = Math.max(player.level, max);
            });
            if(max > 1) {
                this.loseText = [null, null, null];
                this.loseText[0] = "Dogs don't like"
                this.loseText[1] = max == 20 ? 
                    "Maxed Lvls." : `Lvl ${max}s.`;
                this.loseText[2] = "Everyone knows that...";
                this.enemies[0].forEach(enemy => {
                    enemy.maxHp = 9999;
                    enemy.hp = 9999;
                    enemy.attack = 9999;
                    enemy.moveSpeed = 0.1;
                });
            } if(this.players.length < 5) {
                this.loseText = [null, null];
                this.loseText[0] = "Dogs require 5 grandmas.";
                this.loseText[1] = "Everyone knows that...";
                this.enemies[0].forEach(enemy => {
                    enemy.maxHp = 9999;
                    enemy.hp = 9999;
                    enemy.attack = 9999;
                    enemy.moveSpeed = 0.1;
                });
            }
        }
    }
    setSpots(round) {
        const get = this.sceneManager.setSpot.find(spot => spot.name === `${this.text}`);
        if (get) {
            if (`round${round}` in get) {
                // If the round data exists, place units in their recorded positions
                const got = get[`round${round}`];
                let i = 0;
                this.units().forEach(unit => {
                    if (unit.raw.granny) {
                        const isRecorded = got.find(spot => spot.granny === unit.raw.name);
                        if (isRecorded) {
                            // Move the unit to the recorded position
                            unit.blockMove(this.allBlocks[isRecorded.y][isRecorded.x]);
                        } else {
                            // If no recorded position, move the unit to the bench
                            while (this.allBlocks[i][8].unit) {
                                i++;
                            }
                            unit.blockMove(this.allBlocks[i][8]);
                            i++;
                        }
                        unit.ready = false;
                    }
                });
            } else {
                // If no round data exists, place all granny units on the bench
                let i = 0;
                this.units(true, true).forEach(unit => {
                    if (unit.raw.granny) {
                        while(this.allBlocks[i][8].unit) {
                            i++
                        }
                        unit.blockMove(this.allBlocks[i][8]);
                        unit.ready = false;
                        i++;
                    }
                });
            }
        }
        console.log("settingSpot: ")
        console.log(get); // Debugging: Log the spot object
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
        console.log("recordingSpot: ")
        console.log(get[`round${round}`]);
    }

    showText(text) {
        const textWidth = this.game.ctx.measureText(this.text).width;
        const frames = 150; // modifiable
        const textStartFrames = Animate.moveExp(-textWidth, this.game.height/2, this.game.width / 2, 
            this.game.height/2, frames);
        this.game.addEntity(new Text(text, textStartFrames, frames));
    }

    // return all units within each block
    units(onField = false, granny = false) {
        let arr = [];
        this.allBlocks.forEach(column => column.forEach(block => {
            if (block?.unit && block.unit.raw?.hp > 0 && (onField ? block.mapX !== 8 : true) && (granny ? block.unit.granny : true)) {
                arr.push(block.unit);
            }
        }));

        return arr;
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
        this.spawnRate();// important for increasing the rate of spawn
        this.init();
    }
    
    initStory() { // moveExp(startX, startY, endX, endY, frames)
        // initialize all blocks in battlefield
        for (let i = 0; i < 7*7; i++) {
            const block = new Block(i % 7, Math.floor(i / 7), this.isoBlock);
            block.animate(Animate.moveExp(0, -block.isoY, 0, 0, 50), i);
            this.allBlocks[block.mapY][block.mapX] = block;

            const shadow = new Block((i % 7) + 2.5, Math.floor(i / 7) + 2.5, this.shadow, -3);
            shadow.animate(Animate.moveExp(0, -block.isoY, 0, 0, 50), i);
            this.allShadows[i % 7][Math.floor(i/7)] = shadow;
            block.shadow = shadow;
            this.game.addEntity(shadow);

            this.game.addEntity(block);
        }

        // initialize all blocks on bench
        for(let i = 0; i < 7; i++) {
            const block = new Block(8, i, this.isoBlock);
            block.animate(Animate.moveExp(0, 1050 - block.isoY, 0, 0, 40), i + 64);
            this.allBlocks[block.mapY][block.mapX] = block;

            const shadow = new Block (8 + 2.5, i + 2.5, this.shadow, -3);
            shadow.animate(Animate.moveExp(0, 1050 - block.isoY, 0, 0, 40), i + 64);
            this.allShadows[7][i] = shadow;
            block.shadow = shadow;
            this.game.addEntity(shadow);

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
        this.startButton = new StartButton(this.game, this, () => {
            const len = this.units(true, true).length;
            return (len > 0 && len <= this.grannyLimit && !this.startPressed);
        }, () => {
            this.recordSpots(this.currRound-1);
            this.startPressed = true;
            this.units(true).forEach(unit => {
                unit.ready = true;
            });

            this.prep = false;

            if(this.drawTrans) this.drawTrans.removeFromWorld = true;
            this.drawTrans = null;
            if(this.selectedBlock) this.selectedBlock.selected = false;
            this.selectedBlock = null
        });
        this.startButton.grannyLimit = this.grannyLimit;
        this.startButton.limit = () => {
            return this.units(true, true).length > this.grannyLimit;
        };
        this.game.addEntity(this.startButton);
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
                        block.shadow.hovered = false;
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
                this.startPressed = false;
                let adoration = 0; // adding adoration display on 'Round Complete' screen
                this.enemies[this.currRound - 1].forEach((enemy) => {
                    adoration += enemy.exp;
                });
                this.currRound++;

                const finalRound = this.currRound > this.totalRounds;
                let title = `Round ${this.currRound - 1} complete`; // if final round
                                         // boss complete  // otherwise, current round complete
                if(this.enemies.story && finalRound) title = `${this.text} complete`;
                const callback = finalRound ? () => {
                    if(this.enemies.story) {console.log("story, here"); this.sceneManager.story = true;}
                    this.cleanup();
                    STOP.battle1();
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
                    buttonLabel = `Return to Map`;
                }

                this.showingDialog = true;
                this.disableControl = true;
                this.selectedBlock = null;
                this.game.addEntity(new RoundComplete(this.game, title, adoration, buttonLabel, callback));
            }
        }
        // enemy wins
        if (numAlivePlayers == 0 || (this.startPressed && this.units(true, true).length <= 0)) {
            // game over
            
            this.cleanup();
            STOP.battle1();
            PLAY.gameover();
            if(this.loseText) this.game.addEntity(new GameOver(this.game, this.sceneManager, this, this.loseText));
            else this.game.addEntity(new GameOver(this.game, this.sceneManager, this));
        }
    }

    cleanup() {
        this.units().forEach(unit => unit.removeFromWorld = true);
        this.allBlocks.forEach(column => column.forEach(block => block ? block.removeFromWorld = true : void 0));
        this.allShadows.forEach(column => column.forEach(shadow => shadow ? shadow.removeFromWorld = true : void 0));
        this.startButton ? this.startButton.removeFromWorld = true : void 0;
        if(this.extra) this.extra.removeFromWorld = true;
        this.removeFromWorld = true;
        PLAY.overworld();
    }

    draw(ctx) { // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.save();

        // ASSET_MANAGER.queueDownload("./assets/autoBattler/redSpot.png");
        if(this.backGround) {
            ctx.drawImage(this.backGround, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            ctx.fillStyle = "grey";
            ctx.fillRect(0, 0, this.game.width, this.game.height);
        }
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
    constructor(game, battle, isEnabled, onClick) {
        this.game = game;
        this.battle = battle;
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
        this.enabled = this.isEnabled() && !this.battle.disableControl;
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
                if(this.limit()) { // shows the granny limit for the stage.
                    this.game.addEntity({
                        grannyLimit: this.grannyLimit,
                        z: this.z + 1,
                        expire: 25,
                        fontSize: 25,
                        removeFromWorld: false,
                        draw: function(ctx){
                            ctx.save();
                            this.expire--;
                            ctx.font = `bold ${this.fontSize}px runescape`;
                            ctx.fillStyle = 'black';
                            ctx.fillText(
                                `RESTRICTED to ${this.grannyLimit} Grandmas!!`,
                                x + 10, y - 10
                            )
                            ctx.restore();
                            if(this.expire <= 0) this.removeFromWorld = true;
                        },
                        update: function() {}
                    });
                }
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
            ctx.save();
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 40px m6x11';
            ctx.strokeStyle = `black`;
            ctx.lineWidth = 1;
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillText(this.title, PARAMS.canvasWidth * 0.5, backgroundY + 50);
            ctx.strokeText(this.title, PARAMS.canvasWidth * 0.5, backgroundY + 50);
        }

        // adoration
        if (this.elapsed >= this.adorationDelay) {
            const adorationDisplaySpeed = 320;
            const deltaAdoration = Math.min(this.adoration, Math.round((this.elapsed - this.adorationDelay) * adorationDisplaySpeed));
            ctx.fillStyle = '#d087e0';
            ctx.font = '35px m6x11';
            ctx.strokeStyle = `black`;
            ctx.lineWidth = 1.5;
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillText(`+${deltaAdoration}`, PARAMS.canvasWidth * 0.5, backgroundY + 120);
            ctx.strokeText(`+${deltaAdoration}`, PARAMS.canvasWidth * 0.5, backgroundY + 120);
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
    constructor(game, scene, battle, loseText = null) {
        Object.assign(this, { game, scene, battle });
        
        this.buttonWidth = 300;
        this.buttonHeight = 75;
        this.buttonX = (PARAMS.canvasWidth - this.buttonWidth) * 0.5;
        this.buttonY = PARAMS.canvasHeight * 0.5 + 50;
        this.buttonHighlighted = false;

        this.loseText = loseText;
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

        // if loseText
        if(this.loseText) {
            const fontSize = 30;
            ctx.font = `${fontSize}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.tex
            let i = 0;
            this.loseText.forEach(txt => {
                ctx.fillText(txt, PARAMS.canvasWidth * 0.5, 
                    PARAMS.canvasHeight * 0.575 - 100 + (fontSize*1.2 * i));
                    i++;
            });
        }

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
        ctx.fillText("Return to Entrance", PARAMS.canvasWidth * 0.5, (PARAMS.canvasHeight + this.buttonHeight) * 0.5 + 50);

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
        ctx.font = "" + textSize + "px m6x11";
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
