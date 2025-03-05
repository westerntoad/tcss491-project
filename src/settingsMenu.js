class SettingsMenu {
    constructor(game, scene) {
        Object.assign(this, { game, scene });
        this.game = game;
        this.width = PARAMS.canvasWidth / 3;
        this.height = PARAMS.canvasHeight - 100;
        this.x = PARAMS.canvasWidth - this.width - 100;
        this.y = (PARAMS.canvasHeight - this.height) / 2;
        this.z = 300_010;


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

        // return button
        const width = 200;
        const height = 50; 
        this.rButt = {
            w: width,
            h: height,
            x: this.x + (this.width - width) / 2,
            y: 600
        }
    };

    update() {
        PARAMS.soundEffectsVolume = this.seSlider.value;
        PARAMS.musicVolume = this.mSlider.value;
        PLAY.update();

        //this.canvas.focus();

        const mX = this.game.click ? this.game.click.x : -999_999;
        const mY = this.game.click ? this.game.click.y : -999_999;

        if (this.game.keys['z'] || (mX >= this.rButt.x && mX <= this.rButt.x + this.rButt.w
                                 && mY >= this.rButt.y && mY <= this.rButt.y + this.rButt.h)) {

            this.scene.hideSettings();
            this.scene.showPause();
            this.scene.pauseMenu.highlightButtonIdx = 2;
            this.game.keys['z'] = false;
        }
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

        ctx.fillStyle = "#4a90e2";
        ctx.fillRect(this.rButt.x, this.rButt.y, this.rButt.w, this.rButt.h);
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.rButt.x, this.rButt.y, this.rButt.w, this.rButt.h);

        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.font = "18px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(
            "Return",
            this.rButt.x + this.rButt.w / 2,
            this.rButt.y + this.rButt.h / 2 + 8
        );

        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(this.rButt.x - 10, this.rButt.y - 10, this.rButt.w + 20, this.rButt.h + 20);

    }
}
