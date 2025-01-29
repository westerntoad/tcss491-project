
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const PARAMS = {};

ASSET_MANAGER.queueDownload("./assets/arrow.png");
ASSET_MANAGER.queueDownload("./assets/brick.png");
ASSET_MANAGER.queueDownload("./assets/black-rect.png");
ASSET_MANAGER.queueDownload("./assets/houseTiles.png");
ASSET_MANAGER.queueDownload("./assets/portalPoint.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Bernice_Campbell.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Vera_Mulberry.png");
ASSET_MANAGER.queueDownload("./maps/dev.json");
ASSET_MANAGER.queueDownload("./maps/dev2.json");
ASSET_MANAGER.queueDownload("./maps/house.json");

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

ASSET_MANAGER.queueDownload("./assets/battleScene/grannyhp.png");

ASSET_MANAGER.queueDownload("./assets/battleScene/enemyHealth.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/playerReady.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/targetPointer.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/attackTransparent.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/defendTransparent.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/specialTransparent.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/button.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/attack.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/defend.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/special.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/endButton.png");

// MUSIC 
ASSET_MANAGER.queueDownload("./assets/soundtrack/battle-theme.mp3");
ASSET_MANAGER.queueDownload("./assets/soundtrack/TCSS 491 Phone Call to a New Adventure.mp3");


gameEngine.grannies = [
    {
        granny: "true",
        name: "Mary Yott",
        asset: "./assets/grandmas/Mary_Yott.png",
        maxHp: 100,
        hp: 100,
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
        speed: 1
    }
    // , 
    // {
    //     granny: "true",
    //     name: "Bernice Campbell",
    //     asset: "./assets/grandmas/Bernice_Campbell.png",
    //     maxHp: 100,
    //     hp: 100,
    //     attack: 10,
    //     defense: 5,
    //     speed: 1
    // }
    // , 
    // {
    //     granny: "true",
    //     name: "Pearl Martinez",
    //     asset: "./assets/grandmas/Pearl_Martinez.png",
    //     maxHp: 100,
    //     hp: 100,
    //     attack: 10,
    //     defense: 5,
    //     speed: 1
    // }
    // , 
    // {
    //     granny: "true",
    //     name: "Vera Mulberry",
    //     asset: "./assets/grandmas/Vera_Mulberry.png",
    //     maxHp: 100,
    //     hp: 100,
    //     attack: 10,
    //     defense: 5,
    //     speed: 1
    // }
    // , 
    // {
    //     granny: "true",
    //     name: "Ye-soon Kim",
    //     asset: "./assets/grandmas/Ye-soon_Kim.png",
    //     maxHp: 100,
    //     hp: 100,
    //     attack: 10,
    //     defense: 5,
    //     speed: 1
    // }
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

    gameEngine.start();

    const scene = new SceneManager(gameEngine, canvas.width, canvas.height);
});