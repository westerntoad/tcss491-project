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

        this.scrolls = {
            mary: [
                ASSET_MANAGER.getAsset("./assets/scrolls/mary1.wav"),
                ASSET_MANAGER.getAsset("./assets/scrolls/mary2.wav")
            ]
        };
    }

    update() {
        this.timeElapsed += this.game.clockTick
        if (this.timeElapsed >= this.textSpeed) {
            this.timeElapsed -= this.textSpeed;
            this.dText += this.text.charAt(this.nextCharIndex);
            this.nextCharIndex++;
            
            if (Math.random() <= PARAMS.dialogScrollChance && this.dText != this.text) {
                const scrolls = this.scrolls.mary;
                const rand = Math.random();
                for (let i = 0; i < scrolls.length; i++) {
                    //scrolls[i].currentTime = 0;
                    
                    if (rand < i / scrolls.length) {
                        const audio = scrolls[i];
                        if (audio.currentTime != 0) {
                            let bak = audio.cloneNode();
                            bak.currentTime = 0;
                            bak.volume = audio.volume;
                            bak.play();
                        }
                        audio.play();
                    }
                }
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
        ctx.fillStyle = '#bbbbbb';
        ctx.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        
        ctx.fillStyle = '#000000';
        ctx.font = `${this.defaultFontSize}pt comic sans`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Wrap the text using our helper function:
        const wrappedLines = this.wrapText(ctx, this.dText, this.boxWidth - this.padding * 2);
        
        for (let i = 0; i < wrappedLines.length; i++) {
          ctx.fillText(wrappedLines[i], this.padding * 2, this.boxY + 3 * this.padding + (i + 0.5) * (this.defaultFontSize + 10));
        }
        ctx.font = `${this.defaultFontSize + 5}pt comic sans`;
        ctx.fillStyle = 'blue';
        ctx.fillText(this.speaker, this.padding * 1.5, this.boxY + this.padding);
        ctx.restore();
      }
}

