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
PLAY.select = () => PLAY.__play('./assets/select.wav', 1);
PLAY.invalid = () => PLAY.__play('./assets/invalid.wav', 1);
PLAY.transition = () => PLAY.__play('./assets/scene-transition.wav', 0.25);
PLAY.death = () => PARAMS.altMusic
    ? PLAY.__play('./assets/death.wav', 1)
    : PLAY.__play('./assets/invalid.wav', 0); // placeholder
PLAY.hit1 = () => PLAY.__play('./assets/hit1.wav', 0.75);
PLAY.hit2 = () => PLAY.__play('./assets/hit1.wav', 1);

// MUSIC
PLAY.gameover = () => PARAMS.altMusic
    ? PLAY.__play('./assets/gameover.wav', 0.2, true, true)
    : PLAY.__play('./assets/soundtrack/Passed-Away.mp3', 1, true, true);

// MUSIC ~ looped
PLAY.title = () => PARAMS.altMusic
    ? PLAY.__play('./assets/main-menu.wav', 0.20, true)
    : PLAY.__play('./assets/soundtrack/title.qt', 1, true); // placeholder

PLAY.battle1 = () => PARAMS.altMusic
    ? PLAY.__play('./assets/battle1.wav', 0.35, true)
    : PLAY.__play('./assets/soundtrack/Chapter1Battle.qt', 1, true);

PLAY.battle2 = () => PARAMS.altMusic
    ? PLAY.__play('./assets/battle2.wav', 0.35, true)
    : PLAY.__play('./assets/Chapter2Battle.qt', 1, true);

PLAY.overworld = () => PARAMS.altMusic
    ? PLAY.__play('./assets/mary-theme.wav', 0.3, true)
    : PLAY.__play("./assets/soundtrack/TCSS-491-Mary-Yotts-Overworld.mp3", 0.1, true);

PLAY.dogfight = () => PARAMS.altMusic
    ? PLAY.__play('./assets/dogfight.wav', 0.2, true)
    : void 0; // placeholder

PLAY.house = () => PARAMS.altMusic
    ? void 0 // placeholder
    : PLAY.__play("./assets/soundtrack/Chapter1ThemePhoneCallToANewAdventure.qt", 1, true);

STOP.gameover = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/gameover.wav');
    STOP.__stop('./assets/soundtrack/Passed-Away.mp3');
}

STOP.title = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/soundtrack/title.qt'); // placeholder
    STOP.__stop('./assets/main-menu.wav');
}

STOP.battle1 = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/battle1.wav');
    STOP.__stop('./assets/soundtrack/Chapter1Battle.qt');
}

STOP.battle2 = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/battle2.wav');
    STOP.__stop('./assets/soundtrack/Chapter2Battle.qt');
}

STOP.dogfight = () => {
    // add other looped music here to avoid unstoppable music
    STOP.__stop('./assets/dogfight.wav');
}

STOP.overworld = () => {
    STOP.__stop('./assets/mary-theme.wav');
    STOP.__stop("./assets/soundtrack/TCSS-491-Mary-Yotts-Overworld.mp3");
}

STOP.house = () => {
    STOP.__stop("./assets/soundtrack/Chapter1ThemePhoneCallToANewAdventure.qt");
}

STOP.allMusic = () => {
    STOP.gameover();
    STOP.title();
    STOP.battle1();
    STOP.battle2();
    STOP.overworld();
    STOP.dogfight();
    STOP.house();
}
