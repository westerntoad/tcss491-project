class Dialog {
    constructor(game, scene, text, speaker) {
        Object.assign(this, {game, scene, text, speaker});
        this.z = 10;
        //luke- this is for variable textSpeed
        this.textSpeed = 0.25 / this.text.length;
        // can we make it so all texts are displayed in 2 seconds?
        // this.textSpeed = 0.2; // characters per second
        this.timeElapsed = 0;
        this.dText = '';
        this.nextCharIndex = 0;
        // find the width of the text, divide it into segments.
        this.length = 0;
        this.cutLength = 0;
        this.defaultFontSize = 30;

        this.padding = 20;
        this.boxX = this.padding;
        this.boxY = PARAMS.canvasHeight * 2/3 + this.padding;
        this.boxWidth = PARAMS.canvasWidth - 2 * this.padding;
        this.boxHeight = PARAMS.canvasHeight / 3 - 2 * this.padding;

        this.playScroll = true;
        this.scrolls = {
            mary: [
                ASSET_MANAGER.getAsset("./assets/scrolls/mary1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/mary2.wav")
            ],
            vera: [
                ASSET_MANAGER.getAsset("./assets/scrolls/vera1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/vera2.wav")
            ],
            yesoon: [
                ASSET_MANAGER.getAsset("./assets/scrolls/yesoon1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/yesoon2.wav")
            ],
            bernice: [
                ASSET_MANAGER.getAsset("./assets/scrolls/bernice1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/bernice2.wav")
            ],
            pearl: [
                ASSET_MANAGER.getAsset("./assets/scrolls/pearl1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/pearl2.wav"),
            ],
            derek: [
                ASSET_MANAGER.getAsset("./assets/scrolls/derek1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/derek2.wav")
            ],
            mmulberry: [
                ASSET_MANAGER.getAsset("./assets/scrolls/mmulberry1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/mmulberry2.wav")
            ],
            fmulberry: [
                ASSET_MANAGER.getAsset("./assets/scrolls/fmulberry1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/fmulberry2.wav")
            ],
            jerry: [
                ASSET_MANAGER.getAsset("./assets/scrolls/jerry1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/jerry2.wav")
            ],
        };
    }

    update() {
        console.log(this.dText == this.text);
        this.timeElapsed += this.game.clockTick
        if (this.timeElapsed >= this.textSpeed) {
            this.timeElapsed -= this.textSpeed;
            const dChar = this.text.charAt(this.nextCharIndex);
            this.dText += dChar;
            this.nextCharIndex++;
            
            if (this.playScroll && this.dText != this.text) {
                this.playScroll = false;
                let scrolls = undefined;
                if (this.speaker == "Mary") {
                    scrolls = this.scrolls.mary;
                } else if (this.speaker == "Vera" || this.speaker == "Vera (from the background)") {
                    scrolls = this.scrolls.vera;
                    scrolls[0].volume = 0.1;
                    scrolls[1].volume = 0.1;
                } else if (this.speaker == "Pearl") {
                    scrolls = this.scrolls.pearl;
                    scrolls[0].volume = 0.15;
                    scrolls[1].volume = 0.15;
                } else if (this.speaker == "Ye-soon") {
                    scrolls = this.scrolls.yesoon;
                    scrolls[0].volume = 0.15;
                    scrolls[1].volume = 0.15;
                } else if (this.speaker == "Bernice") {
                    scrolls = this.scrolls.bernice;
                    scrolls[0].volume = 0.35;
                    scrolls[1].volume = 0.35;
                } else if (this.speaker == "Mr.Mulberry") {
                    scrolls = this.scrolls.mmulberry;
                    scrolls[0].volume = 0.55;
                    scrolls[1].volume = 0.55;
                } else if (this.speaker == "Mrs.Mulberry") {
                    scrolls = this.scrolls.fmulberry;
                    scrolls[0].volume = 0.2;
                    scrolls[1].volume = 0.2;
                } else if (this.speaker == 'Jerry') {
                    scrolls = this.scrolls.jerry;
                    scrolls[0].volume = 0.25;
                    scrolls[1].volume = 0.25;
                } else if (this.speaker == 'Derek King') {
                    scrolls = this.scrolls.derek;
                    scrolls[0].volume = 0.35;
                    scrolls[1].volume = 0.35;
                } else {
                    scrolls = this.scrolls.mary;
                }
                const rand = Math.random();
                let flag = true;
                const flagIdx = this.text.includes('?') ? 1 : 0;
                const audio = scrolls[flagIdx];
                audio.currentTime = 0;
                if (audio.currentTime != 0) {
                    let bak = audio.cloneNode();
                    bak.currentTime = 0;
                    bak.volume = audio.volume;
                    bak.play();
                }
                audio.play();
            }
            if (this.dText == this.text || dChar.match(/[.?!]/)) {
                this.playScroll = true;
            }
        }
    }

    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
          let word = words[i];
          let testLine = currentLine + " " + word;
          if (ctx.measureText(testLine).width > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        return lines;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = '#bbbbbb';
        ctx.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        ctx.restore();
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.font = `${this.defaultFontSize}pt m6x11`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Wrap the text using our helper function:
        const wrappedLines = this.wrapText(ctx, this.dText, this.boxWidth - this.padding * 2);
        
        for (let i = 0; i < wrappedLines.length; i++) {
          ctx.fillText(wrappedLines[i], this.padding * 2, this.boxY + 3 * this.padding + (i + 0.5) * (this.defaultFontSize + 10));
        }
        ctx.font = `${this.defaultFontSize + 5}pt m6x11`;
        if (this.speaker == "Mary") {
            ctx.fillStyle = '#ff98cf';
        } else if (this.speaker == "Vera" || this.speaker == "Vera (from the background)") {
            ctx.fillStyle = '#f5a169';
        } else if (this.speaker == "Pearl") {
            ctx.fillStyle = '#57d9d9';
        } else if (this.speaker == "Ye-soon") {
            ctx.fillStyle = '#87db37';
        } else if (this.speaker == "Bernice") {
            ctx.fillStyle = '#e6e3ac';
        } else if (this.speaker == "Mr.Mulberry") {
            ctx.fillStyle = '#c7c501';
        } else if (this.speaker == "Mrs.Mulberry") {
            ctx.fillStyle = '#840ea7';
        } else if (this.speaker == 'Jerry') {
            ctx.fillStyle = '#2d0bd5';
        } else if (this.speaker == 'Derek King') {
            ctx.fillStyle = '#cc1503';
        }
        //ctx.fillStyle = 'blue';
        ctx.fillText(this.speaker, this.padding * 1.5, this.boxY + this.padding);
        ctx.restore();
      }
}

