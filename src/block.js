class Block {
    constructor(mapX, mapY, img = ASSET_MANAGER.getAsset("./assets/autoBattler/isoBlock.png"), z = null) {
        Object.assign(this, {mapX, mapY})
        this.scale = PARAMS.scale;
        this.width = PARAMS.spaceWidth * PARAMS.scale;
        this.height = PARAMS.spaceHeight * PARAMS.scale;
        this.isoX = (mapY - mapX) * PARAMS.spaceWidth * PARAMS.scale / 2 + 500;
        this.isoY = (mapY + mapX) * PARAMS.spaceHeight * PARAMS.scale / 3 + 200;

        if(!z) this.z = this.isoY; // TODO better calculation
        else this.z = z;

        this.hovered = false;
        this.selected = false;

        this.img = img;
    }

    animate(deltas, delay) {
        this.delay = delay;
        this.deltas = deltas;
        this.destX = this.isoX;
        this.destY = this.isoY;
        this.isoX = -this.width;
        this.isoY = -this.height;
    }

    update() {
        if (this.delay) {
            this.delay--;
        } else if(this.deltas.length > 0){
            const delta = this.deltas.shift();
            this.isoX = this.destX + delta.x;
            this.isoY = this.destY + delta.y;
        }

        if (this.deltas.length == 0) {
            this.isoX = this.destX;
            this.isoY = this.destY;
        }

        if (this.hovered || this.selected) {
            if(this.shadow) this.shadow.hovered = true;
            this.isoY += this.height * 0.25;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img,
            0, 0, PARAMS.spaceWidth, PARAMS.spaceHeight,
            this.isoX, this.isoY,
            PARAMS.spaceWidth * PARAMS.scale, PARAMS.spaceHeight * PARAMS.scale
        );
        
    }
    position(position){
        this.position = position;
    }
}
