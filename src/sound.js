PLAY = {};

STOP = {};

PLAY.__play = (path, volume, loop) => {
    const audio = ASSET_MANAGER.getAsset(path);
    audio.volume = volume;

    if (loop) {
        audio.addEventListener("ended", () => {
            audio.play();
        });
        audio.play();
    } else {
        if (audio.currentTime != 0) {
            let bak = audio.cloneNode();
            bak.currentTime = 0;
            bak.volume = audio.volume;
            bak.play();
        } else {
            audio.currentTime = 0;
            audio.play();
        }
    }
}

STOP.__stop = (path) => {
    const audio = ASSET_MANAGER.getAsset(path);
    audio.pause();
    audio.currentTime = 0;
}

// SOUND EFFECTS
PLAY.select = () => PLAY.__play('./assets/select.wav', 1);
PLAY.invalid = () => PLAY.__play('./assets/invalid.wav', 1);
PLAY.death = () => PLAY.__play('./assets/death.wav', 1);
PLAY.hit1 = () => PLAY.__play('./assets/hit1.wav', 0.75);
PLAY.hit2 = () => PLAY.__play('./assets/hit2.wav', 0.6);

// MUSIC
PLAY.gameover = () => PLAY.__play('./assets/gameover.wav', 0.2);

// MUSIC ~ looped
PLAY.battle1 = () => PLAY.__play('./assets/battle1.wav', 0.35, true);
STOP.battle1 = () => STOP.__stop('./assets/battle1.wav');
