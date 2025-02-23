
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const PARAMS = {
    altMusic: true,
    cellSize: 75,
    spaceHeight: 24,
    spaceHeightAdjusted: 15,
    scale: 3
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

// Maps
ASSET_MANAGER.queueDownload("./maps/dev.json");
ASSET_MANAGER.queueDownload("./maps/dev2.json");
ASSET_MANAGER.queueDownload("./maps/house.json");
ASSET_MANAGER.queueDownload("./maps/marysMap.json");
ASSET_MANAGER.queueDownload("./assets/tileSheet_main.png");

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
ASSET_MANAGER.queueDownload("./assets/enemies/Mad@Chu.png");
ASSET_MANAGER.queueDownload("./assets/enemies/D3pr3ss0.png");
ASSET_MANAGER.queueDownload("./assets/enemies/L0neb0ne.png");
ASSET_MANAGER.queueDownload("./assets/enemies/Jerry_Mulberry.png");

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
ASSET_MANAGER.queueDownload("./assets/gameover.wav");
ASSET_MANAGER.queueDownload("./assets/battle1.wav");

// For Auto Battler
ASSET_MANAGER.queueDownload("./assets/autoBattler/isoBlock.png");

// Sound effects
ASSET_MANAGER.queueDownload("./assets/select.wav");
ASSET_MANAGER.queueDownload("./assets/invalid.wav");
ASSET_MANAGER.queueDownload("./assets/death.wav");
ASSET_MANAGER.queueDownload("./assets/hit1.wav");
ASSET_MANAGER.queueDownload("./assets/hit2.wav");

// Fonts
// NOTE: fonts must not start with './'
ASSET_MANAGER.queueDownload("assets/runescape.ttf");

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
            hp: 10,
            attack: 2,
            defense: 0,
            exp: 2,
            attackSpeed: 0.95,
            moveSpeed: 0.4,
            asset: "./assets/enemies/Mad@Chu.png"
         },
        { name: "D3pr3ss0",
            attackRange: 3,
            granny: false,
            hp: 10,
            attack: 5,
            defense: 0,
            exp: 4,
            attackSpeed: 0.75,
            moveSpeed: 0.5,
            asset: "./assets/enemies/D3pr3ss0.png"
         },
         { name: "Jerry Mulberry",
            attackRange: 5,
            granny: false,
            hp: 250,
            attack: 10,
            defense: 20,
            exp: 25,
            attackSpeed: 1,
            moveSpeed: Infinity,
            asset: "./assets/enemies/Jerry_Mulberry.png"
         },
         { name: "testL0neb0ne",
            attackRange: 1,
            granny: false,
            hp: 50,
            attack: 0,
            defense: 0,
            exp: 1,
            attackSpeed: 0.2,
            moveSpeed: 0.4,
            asset: "./assets/enemies/L0neb0ne.png"
         }
    ],
    "Ruins": [
        { name: "Skeleton", hp: 60, attack: 12 },
        { name: "Ghost", hp: 40, attack: 8 },
        { name: "Zombie", hp: 70, attack: 15 }
    ],
    "Volcano": [
        { name: "Fire Sprite", hp: 35, attack: 7 },
        { name: "Lava Slime", hp: 45, attack: 10 },
        { name: "Flame Serpent", hp: 80, attack: 18 }
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

    const scene = new SceneManager(gameEngine, canvas.width, canvas.height);
    //gameEngine.addEntity(new TitleScreen(gameEngine, canvas.width, canvas.height));

    gameEngine.start();
});
