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
        this.nextX = 16; // the nextX for the next block.
        this.nextY = 8; // the nextY for the next block

        this.allBlocks = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.showText(text)
        this.init();
    }

    showText(text) {
        const textWidth = this.game.ctx.measureText(this.text).width;
        const frames = 90; // modifiable
        const textStartFrames = Animate.moveExp(-textWidth, this.game.height/2, this.game.width / 2 - textWidth / 2, 
            this.game.height/2, frames);
        this.game.addEntity(new Text(text, textStartFrames, frames));
    }

    // return all units within each block
    units() {
        let arr = [];
        this.allBlocks.forEach(column => column.forEach(block => {
            if (block?.unit) {
                arr.push(block.unit);
            }
        }));

        return arr;
    }
    
    init() { // moveExp(startX, startY, endX, endY, frames)
        // initialize all blocks in battlefield
        for (let i = 0; i < 7*7; i++) {
            const block = new Block(i % 7, Math.floor(i / 7));
            block.animate(Animate.moveExp(0, -block.isoY, 0, 0, 35), i);
            this.allBlocks[block.mapY][block.mapX] = block;

            this.game.addEntity(block);
        }

        // initialize all blocks on bench
        for(let i = 0; i < 7; i++) {
            const block = new Block(8, i);
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
        // initialize all enemy units and place onto battlefield
        for (let i = 0; i < this.enemies[this.currRound - 1].length; i++) {
            const curr = this.enemies[this.currRound - 1][i];
            const block = ((curr.x || curr.x === 0) && (curr.y || curr.y === 0)) ? // 0 is falsey.
                this.allBlocks[(curr.x)][curr.y] : this.allBlocks[6][i];
            block.unit = new CombatEntity(this.enemies[this.currRound - 1][i], this, block);
            this.game.addEntity(block.unit);
        }


        this.startButton = new StartButton(this.game, () => {
            let canStart = true;
            this.units().forEach(unit => {
                if (unit.blockX == 8 || unit.ready)
                    canStart = false;
            });

            return canStart;
        }, () => {
            this.units().forEach(unit => {
                unit.ready = true;
            });

        });
        this.game.addEntity(this.startButton);
        PLAY.battle1();
    }

    update() {
        // handle mouse input
        let mouseX = this.game.mouse?.x;
        let mouseY = this.game.mouse?.y;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 9; j++) {
                let block = this.allBlocks[i][j];
                if (!block) continue;
                if (this.isMouseOverTile(mouseX, mouseY, block) && !this.disableControl) {
                    block.hovered = true;
                    if (this.game.click) {
                        if (!this.selectedBlock && block.unit && block.unit.granny) {
                            block.selected = true;
                            this.selectedBlock = block;
                        } else if (this.selectedBlock && !block.unit) {
                            const entity = this.selectedBlock.unit;
                            entity.blockMove(block);
                            this.selectedBlock = null;
                            PLAY.hit1();
                        }
                    }
                } else {
                    block.hovered = false;
                }
            }
        }


        // count the total number of enemies & players.
        let numAlivePlayers = 0;
        this.units().forEach(unit => {
            if (unit.granny) {
                numAlivePlayers++;
            }
        });
        const numAliveEnemies = this.units().length - numAlivePlayers;

        // player wins
        if (numAliveEnemies == 0 && !this.showingDialog) {
            let adoration = 0; // adding adoration display on 'Round Complete' screen
            this.enemies[this.currRound - 1].forEach((enemy) => {
                adoration += enemy.exp;
            });
            this.currRound++;

            const finalRound = this.currRound > this.totalRounds;
            const title = finalRound ?                  // if final round
                `Boss complete` :                       // boss complete
                `Round ${this.currRound - 1} complete`; // otherwise, current round complete
            
            const callback = finalRound ? () => {
                if(this.enemies.story) {console.log("story, here"); this.sceneManager.map.story.outOfBattle();}
                this.cleanup();
                this.sceneManager.restoreScene();
            } : () => {
                let i = 0;
                this.units().forEach(unit => {
                    console.log(unit);
                    unit.blockMove(this.allBlocks[i][8]);
                    unit.ready = false;
                    i++;
                });
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
            }

            let buttonLabel = ``;
            if (this.currRound < this.totalRounds) {
                buttonLabel = `Next Round`;
            } else if (this.currRound == this.totalRounds) {
                buttonLabel = `Start Boss`;
                // when we get to this round, we want to check if we have story checked,
                // and play the dialogue.
            } else {
                buttonLabel = `Return to Home`;
            }

            this.showingDialog = true;
            this.disableControl = true;
            this.game.addEntity(new RoundComplete(this.game, title, adoration, buttonLabel, callback));
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
        this.titleDelay = 1;
        this.adorationDelay = 2;
        this.buttonDelay = 3;
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
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
        const textSize = 50; // modifiable
        ctx.font = "" + textSize + "px serif";
        ctx.fillStyle = 'black'
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
        this.expire--;
    }
}
