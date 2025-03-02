class SettingsMenu {
    constructor(game, scene) {
        Object.assign(this, { game, scene });
        this.game = game;
        this.width = PARAMS.canvasWidth / 3;
        this.height = PARAMS.canvasHeight - 100;
        this.x = PARAMS.canvasWidth - this.width - 100;
        this.y = (PARAMS.canvasHeight - this.height) / 2;
        this.z = 300_000;


        const sW = this.width - 100;
        const sX = this.x + (this.width - sW) / 2;
        let sY = 200;
        this.seSlider = document.createElement('input');
        this.seSlider.min = 0;
        this.seSlider.max = 1;
        this.seSlider.step = 0.05;
        this.seSlider.value = PARAMS.soundEffectsVolume;
        this.seSlider.type = 'range';
        this.seSlider.style.width = `${sW}px`;
        this.seSlider.style.position = 'absolute';
        this.seSlider.style.top = `${sY}px`;
        this.seSlider.style.left = `${sX}px`;

        sY += 200;
        this.mSlider = document.createElement('input');
        this.mSlider.min = 0;
        this.mSlider.max = 1;
        this.mSlider.step = 0.05;
        this.mSlider.value = PARAMS.musicVolume;
        this.mSlider.type = 'range';
        this.mSlider.style.width = `${sW}px`;
        this.mSlider.style.position = 'absolute';
        this.mSlider.style.top = `${sY}px`;
        this.mSlider.style.left = `${sX}px`;

        // cheeky html business >.>
        const wrap = document.getElementById("mainWrap");
        wrap.appendChild(this.seSlider);
        wrap.appendChild(this.mSlider);

        //this.canvas = document.getElementById("gameWorld");
    };

    update() {
        PARAMS.soundEffectsVolume = this.seSlider.value;
        PARAMS.musicVolume = this.mSlider.value;
        PLAY.update();
        //this.canvas.focus();
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "rgba(23, 186, 255, 0.49)";
        ctx.font = "28px Tahoma";
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = "center";
        ctx.fillText("Settings", this.x + this.width / 2, this.y + 40);

        ctx.font = "26px runescape";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText("Sound Effects", this.x + 50, this.y + 130);
        ctx.fillText("Music", this.x + 50, this.y + 330);
        ctx.textAlign = "right";
        ctx.fillText(Math.floor(this.seSlider.value * 100) + "%", this.x + this.width - 50, this.y + 130);
        ctx.fillText(Math.floor(this.mSlider.value * 100) + "%", this.x + this.width - 50, this.y + 330);
    }
}
