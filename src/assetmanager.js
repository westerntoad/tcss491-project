class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    }

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    }

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const path = this.downloadQueue[i];
            const split = path.split(".");
            const ext = split[split.length - 1];

            switch (ext) {
                case 'jpg':
                case 'png':
                    const img = new Image();
                    img.addEventListener("load", () => {
                        console.log(`Loaded ${path}`);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    img.addEventListener("error", () => {
                        console.log(`Error loading ${path}`);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;
                case 'json':
                    fetch(path)
                        .then(response => response.json())
                        .then(data => {
                            console.log(`Loaded ${path}`);
                            this.successCount++;
                            this.cache[path] = data;
                            if (this.isDone()) callback();
                        })
                        .catch(error => {
                            this.errorCount++;
                            console.error(error);
                            if (this.isDone()) callback();
                        });
                    break;
                case 'wav':
                case 'mp3':
                case 'mp4':
                    const aud = new Audio();
                    aud.addEventListener("loadeddata", () => {
                        console.log("Loaded " + this.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    aud.addEventListener("error", () => {
                        console.log("Error loading " + this.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    aud.addEventListener("ended", () => {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();

                    this.cache[path] = aud;
                    break;
            }
        }
    }

    getAsset(path) {
        return this.cache[path];
    }

    //Based on example code in order to swap songs such as for alt music.
    playAsset() {
        const sound = this.cache[path];
        sound = this.musicChange.original;
        if (cache.currentTime != 0) {
            const another = sound.cloneNode();
            another = this.musicChange.newSong;
            another.currentTime = 0;
            another.volume = sound.volume;
            another.play();
        } else {
            sound.currentTime = 0;
            sound.play();
        }
    }

    //Based on Example Code to mute the game.
    muteAudio(mute) {
        for (var key in this.cache) {
            const audioAsset = this.cache[key];
            if (audioAsset instanceof Audio) {
                audioAsset.muted = mute;
            }
        }
    }

    //Based on Example Code to change the volume in the game.
    adjustVolume() {
        for (var key in this.cache) {
            const audioAsset = this.cache[key];
            if (audioAsset instanceof Audio) {
                audioAsset.volume = volume;
            }
        }
    }

    //Based on Example Code to loop the music.
    loopMusic(path) {
        const audio = this.cache[path];
        audio.addEventListener("ended", function () {
            audio.play();
        });
    };

};

