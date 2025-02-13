/**
 * Party will hold current party-> grandma objects.
 * Party will also bring up a gui that will allow upgrades to grandma objects.
 */
class Party {
    constructor(game) {
        Object.assign(this, {game});
        this.members = []; // Array to store party members
        this.maxSize = 6; // Maximum party size (can be adjusted)
        this.exp = 1000; // keep track of total exp in the pot.
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
    }
    init(){

    }
    // lets start drawing this.
    update(){

        let mouseX = this.game.mouse?.x;
        let mouseY = this.game.mouse?.y;

        const startX = this.game.width / 8;
        const endX = this.game.width * (7/8);
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
                mouseY > y + segmentY * (3/4) && mouseY < y + segmentY * (3/4) + segmentY/8){
                if(this.game.click){
                    this.party.exp -= this.members[i].levelUp(this.party.exp);
                }
            }
            else if(mouseX > x + segmentX * (3/10) && mouseX < x + segmentX * (3/10) + segmentX/8 &&
                mouseY > y + segmentY * (3/4) && mouseY < y + segmentY * (3/4) + segmentY/8){
                if(this.game.click){
                    this.party.exp += this.members[i].levelDown();
                }
            }
        }
    }
    draw(ctx){
        // start off background at z = 100;
        ctx.save();
        ctx.fillStyle = "#7DB2EB";
        ctx.globalAlpha = 0.5;
        const startX = this.game.width / 8;
        const endX = this.game.width * (7/8);
        const startY = this.game.height / 8;
        const endY = this.game.height * (7/8);
        ctx.fillRect(startX, startY,
            this.game.width * (3/4), this.game.height * (3/4)
        )
        // lets draw the adorations hehe
        ctx.fillRect(startX + this.game.width * (2/7), 
            startY - this.game.height / 16,
            this.game.width * (3/16), this.game.height * (1/16)
        )
        ctx.restore();
        ctx.save();
        ctx.drawImage(this.baseBorders, 0, 0, 
            this.baseBordersSize,
            this.baseBordersSize, 
            startX + this.game.width * (2/7), 
            startY - this.game.height / 16,
            this.game.width * (3/16), 
            this.game.height * (1/16)
        );
        this.game.ctx.font = "17px serif";
        ctx.fillText(`Adoration: ${this.party.exp}`,
            startX + this.game.width * (2/7) + this.game.width / 32,
            startY - this.game.height / 32
        )
        ctx.restore();
        // (img, startX/Y of img, w/h of img, canvas-coord, resize);
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        //ctx.drawImage(this.plus, );
        ctx.save();
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
        this.game.ctx.font = "17px serif";

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
            // define x and y, filler.
            const nameLength = ctx.measureText(this.members[i].name).width;
            ctx.fillText(`${this.members[i].name}`, 
                x + segmentX * (5/ 20) - nameLength/2,
                y + segmentY * (3/20)
            )
            /**
             * this.plus = ASSET_MANAGER.getAsset("./assets/plus.png");
             * this.minus = ASSET_MANAGER.getAsset("./assets/minus.png");
             * his.baseBorders = ASSET_MANAGER.getAsset("./assets/baseBorders.png"); 
             * */
            // lets add padding.
            //draw pluses and minuses.
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
            ); // attach listeners on these bad boys.
            const img = ASSET_MANAGER.getAsset(this.members[i].asset);
            const imgSize = 32; // draw character imgs
            ctx.drawImage(img, 0,
                0, imgSize, imgSize,
                x + segmentX * (2/ 10) - segmentX /16,
                y + segmentY * (1/5),
                segmentX / 4, segmentX / 4
            );

            ctx.drawImage(this.baseBorders, 0, 0, 
                this.baseBordersSize,
                this.baseBordersSize, 
                x + segmentX / 2, y + segmentY / 16,
                segmentX *(7/16), segmentY * (7/8)
            );
            ctx.save();
            this.game.ctx.font = "17px serif";
            const fields = [
                "level", "hp", "attack", "attackSpeed",
                "defense", "attackRange"
            ];
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            for(let j = 0; j < fields.length; j++){
                ctx.fillText(`${fields[j]}: ${this.members[i][fields[j]]}`,
                    x + segmentX / 2 + segmentX /16,
                    y + segmentY *(3/ 16) + j * (20)
                );
            }
            ctx.restore();
            // level, hp, attack, attackSpeed, defense, attackRange
        }
        ctx.restore();
    }
    // handle click the same as autoBattler refactored by Abe
}