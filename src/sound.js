PLAY = {};

STOP = {};

__CURRENT_SONG = undefined;
__PLAYED_SONGS = [];

PLAY.__play = (path, volume, isMusic, endsEarly) => {
    const audio = ASSET_MANAGER.getAsset(path);
    if (isMusic) {
        STOP.allMusic();
        __CURRENT_SONG = {
          aud: audio,
          volume: volume
        };
        audio.volume = volume * PARAMS.musicVolume;
        if (!__PLAYED_SONGS.includes(path) && !endsEarly) {
            audio.addEventListener("ended", () => {
                audio.play();
            });
            __PLAYED_SONGS.push(path);
        }
        audio.play();
    } else {
        audio.volume = volume * PARAMS.soundEffectsVolume;
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

PLAY.update = () => {
    if (__CURRENT_SONG)
        __CURRENT_SONG.aud.volume = __CURRENT_SONG.volume * PARAMS.musicVolume;
}

STOP.__stop = (path) => {
    const audio = ASSET_MANAGER.getAsset(path);
    audio.pause();
    audio.currentTime = 0;
}

// SOUND EFFECTS
PLAY.select = () => PARAMS.altMusic
    ? PLAY.__play('./assets/select.wav', 1)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.invalid = () => PARAMS.altMusic
    ? PLAY.__play('./assets/invalid.wav', 1)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.death = () => PARAMS.altMusic
    ? PLAY.__play('./assets/death.wav', 1)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.hit1 = () => PARAMS.altMusic
    ? PLAY.__play('./assets/hit1.wav', 0.75)
    : PLAY.__play('./assets/invalid.wav', 0.6); // placeholder
PLAY.hit2 = () => PARAMS.altMusic
    ? PLAY.__play('./assets/hit1.wav', 1    * PARAMS.soundEffectsVolume)
    : PLAY.__play('./assets/invalid.wav', 0 * PARAMS.soundEffectsVolume); // placeholder

// MUSIC
PLAY.gameover = () => PARAMS.altMusic
    ? PLAY.__play('./assets/gameover.wav', 0.2, true, true)
    : void 0; // placeholder

// MUSIC ~ looped
PLAY.title = () => PARAMS.altMusic
    ? PLAY.__play('./assets/main-menu.wav', 0.20, true)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder

PLAY.battle1 = () => PARAMS.altMusic
    ? PLAY.__play('./assets/battle1.wav', 0.35, true)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder

PLAY.battle2 = () => PARAMS.altMusic
    ? PLAY.__play('./assets/battle2.wav', 0.35, true)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder

PLAY.overworld = () => PARAMS.altMusic
    ? PLAY.__play('./assets/mary-theme.wav', 0.3, true)
    : PLAY.__play("./assets/soundtrack/TCSS-491-Mary-Yotts-Overworld.mp3", 0.1, true); // placeholder

PLAY.dogfight = () => PARAMS.altMusic
    ? PLAY.__play('./assets/dogfight.wav', 0.2, true)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder

STOP.gameover = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/gameover.wav');
}

STOP.title = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/main-menu.wav');
}

STOP.battle1 = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/battle1.wav');
}

STOP.battle2 = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/battle2.wav');
}

STOP.dogfight = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/dogfight.wav');
}

STOP.overworld = () => {
    STOP.__stop('./assets/mary-theme.wav');
    STOP.__stop("./assets/soundtrack/TCSS-491-Mary-Yotts-Overworld.mp3");
}

STOP.allMusic = () => {
    STOP.gameover();
    STOP.title();
    STOP.battle1();
    STOP.battle2();
    STOP.overworld();
    STOP.dogfight();
}
