/**
 * Party will hold current party-> grandma objects.
 * Party will also bring up a gui that will allow upgrades to grandma objects.
 */
class Party {
    constructor(game, scene, save) {
        Object.assign(this, {game, scene});
        this.members = []; // Array to store party members
        this.maxSize = 6; // Maximum party size (can be adjusted)
        this.exp = 0; // keep track of total exp in the pot.

        if (save) {
            save.party.members.forEach(mem => {
                let newMember = new Character(mem.name);
                Object.assign(newMember, mem);
                this.members.push(newMember);
            });
            this.exp = save.party.exp;
            console.log(this.members);
        }
    }
    showParty(){
        // kick off the gui for the party.
        // show each grandmas and their stats.
        this.partyGUI = new PartyGUI(this.members, this.game, this);
        this.game.addEntity(this.partyGUI);
        //this.game.ctx.drawImage
    }
    hideParty(){
        this.partyGUI.removeFromWorld = true;
        this.partyGUI = null;
    }
    addMember(grandma){
        if(this.members.length < this.maxSize) this.members.push(grandma);
    }
    changeSize(){
        if(this.partyGUI) this.partyGUI.changeSize();
    }
}
class PartyGUI {
    constructor(members, game, party){
        Object.assign(this, {members, game, party});
        this.z = 100;
        
        this.plus = ASSET_MANAGER.getAsset("./assets/plus.png");
        this.minus = ASSET_MANAGER.getAsset("./assets/minus.png");
        this.baseBorders = ASSET_MANAGER.getAsset("./assets/baseBorders.png");
        this.plusSize = this.plus.width;
        this.minusSize = this.minus.width;
        this.baseBordersSize = this.baseBorders.width;

        this.changeSize();

        this.squArr = Array.from({ length: 2 }, () => Array(3).fill(null));
        this.init();
        // this.redSquare = {
        //     w: width,
        //     h: height,
        //     x: this.sX,
        //     y: 600
        // }
    }
    changeSize(){
        if(this.party.scene.hud.visible){
            const padding = this.party.scene.hud.padding;
            this.sX = padding;
            this.eX = this.party.scene.hud.x - padding;
        } else {
            this.sX = this.game.width * (1/ 8);
            this.eX = this.game.width * (7/8);
        }
    }
    // lets start drawing this.
    init() {
        const numRows = 3;
        for(let i = 0; i < this.members.length; i++) {
            const col = Math.floor(i / numRows);
            const row = i % numRows;
            this.squArr[col][row] = 0;
            this.squArr[col][row] = 0;
        }
        this.colSize = Math.floor((this.members.length - 1) / 3);
        this.index = {
            row: 0,
            col: 0,
            index: 0
        };
    }
    update(){
        if(this.game.keys[`ArrowRight`]) {
            if(this.index.index == 0) {
                this.index.index = 1;
            } else {
                this.index.index = 0;
                if(this.colSize > this.index.col && this.squArr[this.index.col+1][this.index.row] !== null) {
                    this.index.col++;
                } else {
                    this.index.col = 0;
                }
            } this.game.keys[`ArrowRight`] = false;
        }
        if(this.game.keys[`ArrowLeft`]) {
            if(this.index.index == 1) {
                this.index.index = 0;
            } else {
                this.index.index = 1;
                if(this.index.col > 0 && this.squArr[this.index.col - 1][this.index.row] !== null) {
                    this.index.col--;
                } else{
                    if(this.squArr[this.colSize][this.index.row] == null) this.index.col = 0;
                    else this.index.col = this.colSize;
                }
            } this.game.keys[`ArrowLeft`] = false;
        }
        if(this.game.keys[`ArrowDown`]) {
            if(this.index.row < 2 && this.squArr[this.index.col][this.index.row+1] !== null) {
                this.index.row++;
            } else {
                this.index.row = 0;
            } this.game.keys[`ArrowDown`] = false;
        }
        if(this.game.keys[`ArrowUp`]) {
            if(this.index.row > 0 && this.squArr[this.index.col][this.index.row-1] !== null) {
                this.index.row--;
            } else {
                this.index.row = 2;
                while(this.squArr[this.index.col][this.index.row] === null) {
                    this.index.row--;
                }
            } this.game.keys[`ArrowUp`] = false;
        }

        let mouseX = this.game.mouse?.x;
        let mouseY = this.game.mouse?.y;

        const startX = this.sX;
        const endX = this.eX;
        const startY = this.game.height / 8;
        const endY = this.game.height * (7/8);
        
        const numRows = 3;
        const segmentX = (endX - startX) / 2;
        const segmentY = (endY - startY) / 3;
        for(let i = 0; i < this.members.length; i++){
            const col = Math.floor(i / numRows);
            const row = i % numRows;
            const x = segmentX* col + startX;
            const y = segmentY* row + startY;
            if(mouseX > x + segmentX / 10 && mouseX < x + segmentX / 10 + segmentX/8 &&
                mouseY > y + segmentY * (3/4) && mouseY < y + segmentY * (3/4) + segmentY/8
                && this.game.click){
                if(this.game.click){
                    const used = this.members[i].levelUp(this.party.exp);
                    used === 0 ? PLAY.invalid() : PLAY.select();
                    if(used === 0) {
                        PLAY.invalid();
                        this.game.addEntity({
                            click: (this.game.click ? true : false),
                            z: this.z + 1,
                            expire: 30,
                            exp: this.members[i].expReq[this.members[i].level - 1],
                            draw: function(ctx) {
                                ctx.save();
                                this.expire--;
                                ctx.font = `bold 16px runescape`;
                                ctx.fillStyle = 'black';
                                ctx.fillText(
                                    `can't :(`,
                                    mouseX + 10, 
                                    mouseY - 10
                                )
                                ctx.restore();
                                if(this.expire <= 0) this.removeFromWorld = true;
                            },
                            update: function() {}
                        });
                    }
                    this.party.exp -= used;
                }
            }
            else if(mouseX > x + segmentX * (3/10) && mouseX < x + segmentX * (3/10) + segmentX/8 &&
                mouseY > y + segmentY * (3/4) && mouseY < y + segmentY * (3/4) + segmentY/8
                && this.game.click){
                if(this.game.click){
                    const gain = this.members[i].levelDown();
                    gain === 0 ? PLAY.invalid() : PLAY.select();
                    if(gain === 0) {
                        PLAY.invalid();
                        this.game.addEntity({
                            click: (this.game.click ? true : false),
                            z: this.z + 1,
                            expire: 30,
                            exp: this.members[i].expReq[this.members[i].level - 1],
                            draw: function(ctx) {
                                ctx.save();
                                this.expire--;
                                ctx.font = `bold 16px runescape`;
                                ctx.fillStyle = 'black';
                                ctx.fillText(
                                    `nope :o`,
                                    mouseX + 10, 
                                    mouseY - 10
                                )
                                ctx.restore();
                                if(this.expire <= 0) this.removeFromWorld = true;
                            },
                            update: function() {}
                        });
                    }
                    this.party.exp += gain;
                }
            }
            else if(this.index.col == col && this.index.row == row && this.game.pressed[`z`]){
                if(this.index.index == 0) {
                    const used = this.members[i].levelUp(this.party.exp);
                    used === 0 ? PLAY.invalid() : PLAY.select();
                    if(used === 0) {
                        PLAY.invalid();
                        this.game.addEntity({
                            click: (this.game.click ? true : false),
                            z: this.z + 1,
                            expire: 30,
                            exp: this.members[i].expReq[this.members[i].level - 1],
                            draw: function(ctx) {
                                ctx.save();
                                this.expire--;
                                ctx.font = `bold 16px runescape`;
                                ctx.fillStyle = 'black';
                                ctx.fillText(
                                    `can't :(`,
                                    x + segmentX / 10, 
                                    y + segmentY * (3/4)
                                )
                                ctx.restore();
                                if(this.expire <= 0) this.removeFromWorld = true;
                            },
                            update: function() {}
                        });
                    }
                    this.party.exp -= used;
                } else {
                    const gain = this.members[i].levelDown();
                    gain === 0 ? PLAY.invalid() : PLAY.select();
                    if(gain === 0) {
                        PLAY.invalid();
                        this.game.addEntity({
                            click: (this.game.click ? true : false),
                            z: this.z + 1,
                            expire: 30,
                            exp: this.members[i].expReq[this.members[i].level - 1],
                            draw: function(ctx) {
                                ctx.save();
                                this.expire--;
                                ctx.font = `bold 16px runescape`;
                                ctx.fillStyle = 'black';
                                ctx.fillText(
                                    `nope :o`,
                                    x + segmentX / (10/3), 
                                    y + segmentY * (3/4)
                                )
                                ctx.restore();
                                if(this.expire <= 0) this.removeFromWorld = true;
                            },
                            update: function() {}
                        });
                    }
                    this.party.exp += gain;
                } this.game.pressed[`z`] = false;
            }
        }
    }
    draw(ctx){
        // start off background at z = 100;
        ctx.save();
        ctx.fillStyle = "#7DB2EB";
        ctx.globalAlpha = 0.5;
        const startX = this.sX;
        const endX = this.eX;
        const startY = this.game.height / 8;
        const endY = this.game.height * (7/8);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#9cd5ff';
        ctx.fillRect(startX, startY, (endX - startX), (endY - startY));
        ctx.restore(); 

        ctx.save();
        const aHeight = this.game.height * (1/16);
        const aWidth = this.game.width * (3/16);
        const aX = (startX + endX) / 2 - aWidth /2 ;
        const aY = startY - this.game.height / 16;

        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = `bold 22px m6x11`;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "black";
        ctx.textAlign = "start";
        ctx.fillStyle = "#b347cc";
        
        ctx.drawImage(this.baseBorders, 0, 0, 
            this.baseBordersSize,
            this.baseBordersSize, 
            aX, 
            aY,
            this.game.width * (3/16), 
            this.game.height * (1/16)
        );
        ctx.strokeText('Adoration', aX + aWidth / 8, aY + aHeight / 4);
        ctx.fillText('Adoration', aX + aWidth / 8, aY + aHeight / 4);
        this.getDefaultEndStyle(ctx);
        ctx.fillText(`${this.party.exp}`, aX + aWidth * (7/8), aY + aHeight / 4);
        ctx.restore();

        ctx.save();
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
        ctx.font = "17px m6x11";
        ctx.fillStyle = 'white';

        const numRows = 3;
        const segmentX = (endX - startX) / 2;
        const segmentY = (endY - startY) / 3;
        for(let i = 0; i < this.members.length; i++){
            const col = Math.floor(i / numRows);
            const row = i % numRows;
            const x = segmentX* col + startX;
            const y = segmentY* row + startY;
            ctx.drawImage(this.baseBorders, 0, 0, 
                this.baseBordersSize,
                this.baseBordersSize, 
                x, y,
                segmentX, segmentY
            );
            // draw Name
            const nameLength = ctx.measureText(this.members[i].name).width;
            ctx.fillText(`${this.members[i].name}`, 
                x + segmentX * (6.5/ 20) - nameLength/2,
                y + segmentY * (3/20));

            //draw Plus and Minus
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#6a7ddb';
            ctx.fillRect(x + segmentX / 10, y + segmentY * (3/4),
            (x + segmentX * (3/10))-(x + segmentX / 10) + segmentX /8, segmentY / 8);
            ctx.restore();
            ctx.drawImage(this.plus, 0, 0, // plus
                this.plusSize, this.plusSize,
                x + segmentX / 10,
                y + segmentY * (3/4), // placement tested.
                segmentX / 8, segmentY / 8
            );
            ctx.drawImage(this.minus, 0, 0, // plus
                this.minusSize, this.minusSize,
                x + segmentX * (3/10),
                y + segmentY * (3/4),
                segmentX / 8, segmentY / 8
            );
            

            // draw Character
            const img = ASSET_MANAGER.getAsset(this.members[i].asset);
            const imgSize = 32;
            ctx.drawImage(img, 0,
                0, imgSize, imgSize,
                x + segmentX * (2.65/ 10) - segmentX /16,
                y + segmentY * (1/5),
                segmentX / 4, segmentX / 4
            );

            // detail borders
            ctx.drawImage(this.baseBorders, 0, 0, 
                this.baseBordersSize,
                this.baseBordersSize, 
                x + segmentX / 2, y + segmentY / 16,
                segmentX * (7/16), segmentY * (7/8)
            );
            ctx.save();
            // ***** Did not use icons, text is more cohesive.
            // level, hp, attack, attackSpeed (players will see atkrange inBattle)
            // Only bernice has def (shield icon)
            const fontSize = 21; // can Change.
            const fontPadding = 1;
            this.game.ctx.font = `${fontSize}px m6x11`;
            const fields = [
                "level", "hp", "attack", "attackSpeed",
                "defense", "attackRange"
            ];
            ctx.textAlign = "start";
            ctx.textBaseline = "top";
            ctx.fillStyle = "#ebbf4d";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black"; // keep this strokeStyle

            // **************** Details **************
            const detailWidth = segmentX * (7/16);
            const detailPad = segmentX / 16;
            const detailX = x + segmentX / 2;
            const detailY = y + segmentY * (5 / 32);

            // Lvl
            ctx.strokeText(`Lvl`, detailX + detailPad, detailY);
            ctx.fillText(`Lvl`, detailX + detailPad, detailY);
            
            this.getDefaultEndStyle(ctx);
            //ctx.strokeText(this.members[i].level, detailX + detailWidth / 2, detailY);
            ctx.fillText(this.members[i].level, detailX + detailWidth - detailPad, detailY);

            // HP
            ctx.textAlign = "start";
            ctx.fillStyle = "#bd4444";
            ctx.strokeText('Hp', detailX + detailPad, detailY + (fontSize + fontPadding));
            ctx.fillText('Hp', detailX + detailPad, detailY + (fontSize + fontPadding));
            this.getDefaultEndStyle(ctx);
            ctx.fillText(this.members[i].hp, detailX + detailWidth - detailPad, detailY + (fontSize + fontPadding));

            // ATK
            ctx.textAlign = "start";
            ctx.fillStyle = "#a7e276";
            ctx.strokeText('Atk', detailX + detailPad, detailY + (fontSize + fontPadding) * 2);
            ctx.fillText('Atk', detailX + detailPad, detailY + (fontSize + fontPadding) * 2);
            this.getDefaultEndStyle(ctx);
            ctx.fillText(this.members[i].attack, detailX + detailWidth - detailPad, detailY + (fontSize + fontPadding) * 2);
            
            // DPS
            ctx.textAlign = "start";
            ctx.fillStyle = "#60a762";
            ctx.strokeText('Dps', detailX + detailPad, detailY + (fontSize + fontPadding) * 3);
            ctx.fillText('Dps', detailX + detailPad, detailY + (fontSize + fontPadding) * 3);
            this.getDefaultEndStyle(ctx);
            ctx.fillText(Math.round(100 * (this.members[i].attack / this.members[i].attackSpeed)) / 100,
                 detailX + detailWidth - detailPad, detailY + (fontSize + fontPadding) * 3);

            if(this.members[i].name == "Bernice Campbell") { // show defense.
                // DEF

                ctx.textAlign = "start";
                ctx.fillStyle = '#804f2b';
                ctx.strokeText('Def', detailX + detailPad, detailY + (fontSize + fontPadding) * 4);
                ctx.fillText('Def', detailX + detailPad, detailY + (fontSize + fontPadding) * 4);
                this.getDefaultEndStyle(ctx);
                ctx.fillText(Math.round((this.members[i].defense) * 100 / (this.members[i].defense + 50)) /100, 
                    detailX + detailWidth - detailPad, detailY + (fontSize + fontPadding) * 4);
            }
            if(this.members[i].name) {
                // Exp
                ctx.textAlign = "start";
                ctx.fillStyle = "#b347cc";
                ctx.strokeText('AdorReq', detailX + detailPad, detailY + (fontSize + fontPadding*2.5) * 5);
                ctx.fillText('AdorReq', detailX + detailPad, detailY + (fontSize + fontPadding*2.5) * 5);
                this.getDefaultEndStyle(ctx);
                ctx.fillText(this.members[i].getNextExp(), detailX + detailWidth - detailPad, detailY + (fontSize + fontPadding*2.5) * 5);
            }
            ctx.restore();
            // TODO: for ITEMS ** >>
            // ctx.fillRect(x + segmentX / 10, y + segmentY * (9/16), 25, 25);
            // *****
        }

        const x = segmentX* this.index.col + startX;
        const y = segmentY* this.index.row + startY;
            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.strokeRect(
                x + segmentX / (this.index.index ? (10/3) : (10)) - 5,
                y + segmentY * (3/4) - 5, // placement tested.
                segmentX / 8 + 10, segmentY / 8 + 10);
            ctx.restore();
        ctx.restore();
        // we can call to draw the item here. Just use Item's draw() function.
    }
    getDefaultMidStyle(ctx) {
        ctx.textAlign = "center";
        ctx.fillStyle = 'black';

    }
    getDefaultEndStyle(ctx, positive = true) {
        ctx.textAlign = 'end';
        ctx.fillStyle = 'black';
        //ctx.fillStyle = positive ? 'green' : 'red';
    }
}
class TextCreator{ // abe will never find me :o
    constructor(){
        error("You can't construct this bro");
    }
    static getText(string){
        // parse string
        // return an array of img object? ->
        /**
         * {
         * x: left
         * y: top
         * sx:
         * sy:
         * sw: defaults
         * sh: defaults
         * // we can also scale, then match with 
         * }
         * 
         */
    }
}
