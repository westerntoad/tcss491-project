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
            ]
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
                const scrolls = this.scrolls.mary;
                const rand = Math.random();
                let flag = true;
                const flagIdx = this.text.includes('?') ? 0 : 1;
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
        if (this.speaker = "Mary") {
            ctx.fillstyle = '#ff98cf';
        } if (this.speaker = "Vera" || "Vera (from the background)") {
            ctx.fillstyle = '#f5a169';
        } if (this.speaker = "Pearl") {
            ctx.fillstyle = '#57d9d9';
        } if (this.speaker = "Ye-soon") {
            ctx.fillstyle = '#87db37';
        } if (this.speaker = "Bernice") {
            ctx.fillstyle = '#e6e3ac';
        } if (this.speaker = "Mr.Mulberry") {
            ctx.fillstyle = '#c7c501';
        } if (this.speaker = "Mrs.Mulberry") {
            ctx.fillstyle = '#840ea7';
        } if (this.speaker = 'Jerry') {
            ctx.fillstyle = '#2d0bd5';
        } if (this.speaker = 'Derek King') {
            ctx.fillstyle = '#cc1503';
        }
        //ctx.fillStyle = 'blue';
        ctx.fillText(this.speaker, this.padding * 1.5, this.boxY + this.padding);
        ctx.restore();
      }
}

