
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const PARAMS = {
    altMusic: true,
    soundEffectsVolume: 1,
    musicVolume: 1,
    cellSize: 96,
    spaceHeight: 24,
    spaceHeightAdjusted: 15,
    scale: 3,
    dialogScrollChance: 0.25,
    tips: []
};

ASSET_MANAGER.queueDownload("./assets/arrow.png");
ASSET_MANAGER.queueDownload("./assets/brick.png");
ASSET_MANAGER.queueDownload("./assets/player.png");
ASSET_MANAGER.queueDownload("./assets/singlegrass.png");
ASSET_MANAGER.queueDownload("./assets/black-rect.png");
ASSET_MANAGER.queueDownload("./assets/houseTiles.png");
ASSET_MANAGER.queueDownload("./assets/portalPoint.png");
ASSET_MANAGER.queueDownload("./assets/baseBorders.png");
ASSET_MANAGER.queueDownload("./assets/minus.png");
ASSET_MANAGER.queueDownload("./assets/plus.png");


//Title screen
ASSET_MANAGER.queueDownload("./assets/titleBackgroundTemp.png");
ASSET_MANAGER.queueDownload("./assets/bigFinger.png");

// Maps
ASSET_MANAGER.queueDownload("./maps/dev.json");
ASSET_MANAGER.queueDownload("./maps/dev2.json");
ASSET_MANAGER.queueDownload("./maps/house.json");
ASSET_MANAGER.queueDownload("./maps/marysMap.json");
ASSET_MANAGER.queueDownload("./maps/marysHouse.json");
ASSET_MANAGER.queueDownload("./maps/marysHouse.png");
ASSET_MANAGER.queueDownload("./maps/bed.png");
ASSET_MANAGER.queueDownload("./maps/tableChairTop.png");
ASSET_MANAGER.queueDownload("./maps/tableChairBot.png");
ASSET_MANAGER.queueDownload("./maps/basketH.png");
ASSET_MANAGER.queueDownload("./assets/tileSheet_main.png");
ASSET_MANAGER.queueDownload("./maps/areaOpen.png");




// Manga Panels + dialog
ASSET_MANAGER.queueDownload("./dialog/dialogLoad.json");
ASSET_MANAGER.queueDownload("./dialog/chapter1_1.png");
ASSET_MANAGER.queueDownload("./dialog/chapter1_2.png");
ASSET_MANAGER.queueDownload("./dialog/panelExample.png");
ASSET_MANAGER.queueDownload("./dialog/panelExample2.png");
ASSET_MANAGER.queueDownload("./dialog/quest.png");
ASSET_MANAGER.queueDownload("./dialog/basket.png");


// All Grandmas (32 x 32)
ASSET_MANAGER.queueDownload("./assets/grandmas/Mary_Yott.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Pearl_Martinez.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Bernice_Campbell.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Vera_Mulberry.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Ye-soon_Kim.png");

// Enemies
ASSET_MANAGER.queueDownload("./assets/enemies/endlessPortal.png");

ASSET_MANAGER.queueDownload("./assets/enemies/Mad@Chu.png");
ASSET_MANAGER.queueDownload("./assets/enemies/D3pr3ss0.png");
ASSET_MANAGER.queueDownload("./assets/enemies/L0neb0ne.png");
ASSET_MANAGER.queueDownload("./assets/enemies/Jerry_Mulberry.png");
ASSET_MANAGER.queueDownload("./assets/enemies/0bL1V15k.png");
ASSET_MANAGER.queueDownload("./assets/enemies/dearless.png");

ASSET_MANAGER.queueDownload("./assets/enemies/1ntern.png");
ASSET_MANAGER.queueDownload("./assets/enemies/0verworked.png");
ASSET_MANAGER.queueDownload("./assets/enemies/J4nitor.png");
ASSET_MANAGER.queueDownload("./assets/enemies/Derek_King.png");

ASSET_MANAGER.queueDownload("./assets/enemies/droplet.png");
ASSET_MANAGER.queueDownload("./assets/enemies/waneChime.png");
ASSET_MANAGER.queueDownload("./assets/enemies/hopless.png");

// For BattleScene
ASSET_MANAGER.queueDownload("./maps/battle_bg.png");

ASSET_MANAGER.queueDownload("./assets/battleScene/allyHp.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/grannyhp.png");

ASSET_MANAGER.queueDownload("./assets/battleScene/allyHp.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/enemyHealth.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/playerReady.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/targetPointer.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/attackTransparent.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/defendTransparent.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/specialTransparent.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/attack.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/defend.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/special.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/endButton.png");

// MUSIC
ASSET_MANAGER.queueDownload("./assets/soundtrack/battle-theme.mp3");
ASSET_MANAGER.queueDownload("./assets/soundtrack/TCSS-491-Mary-Yotts-Overworld.mp3");

// ALT MUSIC 
ASSET_MANAGER.queueDownload("./assets/main-menu.wav");
ASSET_MANAGER.queueDownload("./assets/mary-theme.wav");
ASSET_MANAGER.queueDownload("./assets/battle1.wav");
ASSET_MANAGER.queueDownload("./assets/battle2.wav");
ASSET_MANAGER.queueDownload("./assets/gameover.wav");

//Items
ASSET_MANAGER.queueDownload("./assets/items/laserPointer.png");

// For Auto Battler
ASSET_MANAGER.queueDownload("./assets/autoBattler/isoBlock_park1.png");
ASSET_MANAGER.queueDownload("./assets/autoBattler/isoBlock_park.png");
ASSET_MANAGER.queueDownload("./assets/autoBattler/isoBlockCh2.png");
ASSET_MANAGER.queueDownload("./assets/autoBattler/isoBlockCh3.png");
ASSET_MANAGER.queueDownload("./assets/autoBattler/isoBlock.png");
ASSET_MANAGER.queueDownload("./assets/autoBattler/redSpot.png");

// Sound effects
ASSET_MANAGER.queueDownload("./assets/select.wav");
ASSET_MANAGER.queueDownload("./assets/invalid.wav");
ASSET_MANAGER.queueDownload("./assets/death.wav");
ASSET_MANAGER.queueDownload("./assets/hit1.wav");
ASSET_MANAGER.queueDownload("./assets/hit2.wav");

// scrolls
ASSET_MANAGER.queueDownload("./assets/scrolls/mary1.wav");
ASSET_MANAGER.queueDownload("./assets/scrolls/mary2.wav");

// Fonts
// NOTE: fonts must not start with './'
ASSET_MANAGER.queueDownload("assets/runescape.ttf");
ASSET_MANAGER.queueDownload("assets/m6x11.ttf");

ASSET_MANAGER.queueDownload("./assets/jerryTips.json");

const DUNGEON_ENCOUNTERS = {
    "Grass": [
        /**{
                    name: "Vera Mulberry",
                    asset: "./assets/grandmas/Vera_Mulberry.png",
                    maxHp: 20,
                    hp: 20,
                    attack: 10,
                    defense: 5,
                    speed: 1,
                    exp: 5,
                    attackRate: 0.7,
                    defendRate: 0.3,
                    specialRate: 0
                } */
        { name: "L0neb0ne",
            attackRange: 1,
            granny: false,
            hp: 5,
            attack: 1,
            defense: 0,
            exp: 1,
            attackSpeed: 1,
            moveSpeed: 0.4,
            asset: "./assets/enemies/L0neb0ne.png"
         },
         { name: "Mad@Chu",
            attackRange: 1,
            granny: false,
            hp: 8,
            attack: 3,
            defense: 0,
            exp: 1,
            attackSpeed: 1.1,
            moveSpeed: 0.4,
            asset: "./assets/enemies/dearless.png"
         },
        { name: "D3pr3ss0",
            attackRange: 3,
            granny: false,
            hp: 12,
            attack: 4,
            defense: 0,
            exp: 1,
            attackSpeed: 0.95,
            moveSpeed: 0.5,
            asset: "./assets/enemies/0bL1V15k.png"
         },
         { name: "Jerry Mulberry",
            attackRange: 5,
            granny: false,
            hp: 160,
            attack: 3,
            defense: 20,
            exp: 18,
            attackSpeed: 0.35,
            moveSpeed: Infinity,
            asset: "./assets/enemies/Jerry_Mulberry.png"
         },
         { name: "chu",
            attackRange: 1,
            granny: false,
            hp: 11,
            attack: 23,
            defense: 0,
            exp: 500,
            attackSpeed: 0.05,
            moveSpeed: 0.05,
            asset: "./assets/enemies/Mad@Chu.png"
         },
         { name: "dep",
            attackRange: 1,
            granny: false,
            hp: 1200,
            attack: 9999,
            defense: 0,
            exp: 500,
            attackSpeed: 3,
            moveSpeed: 0.1,
            asset: "./assets/enemies/D3pr3ss0.png"
         }
    ],
    "Office": [
        { name: "1ntern",
            attackRange: 3,
            granny: false,
            hp: 30,
            attack: 2,
            defense: 0,
            exp: 2,
            attackSpeed: 0.45,
            moveSpeed: 0.4,
            asset: "./assets/enemies/1ntern.png"
         },
         { name: "0verworked",
            attackRange: 1,
            granny: false,
            hp: 150,
            attack: 6,
            defense: 0,
            exp: 4,
            attackSpeed: 0.9,
            moveSpeed: 1,
            asset: "./assets/enemies/0verworked.png"
         },
         { name: "J4nitor",
            attackRange: 1,
            granny: false,
            hp: 200,
            attack: 14,
            defense: 0,
            exp: 3,
            attackSpeed: 1.6,
            moveSpeed: 1.25,
            asset: "./assets/enemies/J4nitor.png"
         },
         { name: "Derek King",
            attackRange: 5,
            granny: false,
            hp: 2400,
            attack: 16,
            defense: 38,
            exp: 75,
            attackSpeed: 0.5,
            moveSpeed: Infinity,
            asset: "./assets/enemies/Derek_King.png"
         }
        ],
    "Park": [
        { name: "droplet",
            attackRange: 3,
            granny: false,
            hp: 50,
            attack: 3,
            defense: 0,
            exp: 7,
            attackSpeed: 0.65,
            moveSpeed: 0.35,
            asset: "./assets/enemies/droplet.png"
         },
         { name: "waneChime",
            attackRange: 4,
            granny: false,
            hp: 210,
            attack: 6,
            defense: 0,
            exp: 12,
            attackSpeed: 0.85,
            moveSpeed: 0.75,
            asset: "./assets/enemies/waneChime.png"
         },
         { name: "hopless",
            attackRange: 10,
            granny: false,
            hp: 1000,
            attack: 24,
            defense: 0,
            exp: 25,
            attackSpeed: 1.2,
            moveSpeed: 10,
            asset: "./assets/enemies/hopless.png"
         }
    ]
};


gameEngine.grannies = [
    {
        attackRange: 1,
        granny: true,
        name: "Mary Yott",
        asset: "./assets/grandmas/Mary_Yott.png",
        maxHp: 1,
        hp: 1,
        attack: 10,
        defense: 5,
        special: {
            name: "Tea Time",
            detail: "heal", // shows when hovering special move
            // target: self, ally, allies (all), enemy, enemies # 
            target: "ally",
            use : () => {

            }
        },
        moveSpeed: 1,
        attackSpeed: 1
    }
    , 
    {
        attackRange: 1,
        granny: true,
        name: "Bernice Campbell",
        asset: "./assets/grandmas/Bernice_Campbell.png",
        maxHp: 100,
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 1
    }
    , 
    {
        attackRange: 1,
        granny: true,
        name: "Pearl Martinez",
        asset: "./assets/grandmas/Pearl_Martinez.png",
        maxHp: 100,
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 1
    }
    , 
    {
        granny: "true",
        name: "Vera Mulberry",
        asset: "./assets/grandmas/Vera_Mulberry.png",
        maxHp: 100,
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 1
    }
    , 
    {
        granny: "true",
        name: "Ye-soon Kim",
        asset: "./assets/grandmas/Ye-soon_Kim.png",
        maxHp: 100,
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 1
    }
];
ASSET_MANAGER.downloadAll(() => { // prototyping the battleScene. SceneManager will jump straight into combat
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    PARAMS.canvasWidth = canvas.width;
    PARAMS.canvasHeight = canvas.height;
    ctx.imageSmoothingEnabled = false;

    gameEngine.width = canvas.width;
    gameEngine.height = canvas.height; 

    gameEngine.init(ctx);
    PARAMS.tips = ASSET_MANAGER.getAsset("./assets/jerryTips.json");
    console.log("Loaded Jerry's Tips:", PARAMS.tips);

    gameEngine.addEntity(new TitleScreen(gameEngine));

    gameEngine.start();

    //const scene = new SceneManager(gameEngine, canvas.width, canvas.height);
});
