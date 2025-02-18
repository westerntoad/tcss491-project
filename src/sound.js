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
PLAY.select = PARAMS.altMusic
    ? () => PLAY.__play('./assets/select.wav', 1)
    : () => PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.invalid = PARAMS.altMusic
    ? () => PLAY.__play('./assets/invalid.wav', 1)
    : () => PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.death = PARAMS.altMusic
    ? () => PLAY.__play('./assets/death.wav', 1)
    : () => PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.hit1 = PARAMS.altMusic
    ? () => PLAY.__play('./assets/hit1.wav', 0.75)
    : () => PLAY.__play('./assets/invalid.wav', 0.6); // placeholder
PLAY.hit2 = PARAMS.altMusic
    ? () => PLAY.__play('./assets/hit1.wav', 1)
    : () => PLAY.__play('./assets/invalid.wav', 0); // placeholder

// MUSIC
PLAY.gameover = PARAMS.altMusic
    ? () => PLAY.__play('./assets/gameover.wav', 0.2)
    : () => PLAY.__play('./assets/invalid.wav', 0); // placeholder

// MUSIC ~ looped
PLAY.battle1 = PARAMS.altMusic
    ? () => PLAY.__play('./assets/battle1.wav', 0.35, true)
    : () => PLAY.__play('./assets/invalid.wav', 0); // placeholder

STOP.battle1 = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/battle1.wav');
}
