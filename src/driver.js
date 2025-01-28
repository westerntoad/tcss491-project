
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const PARAMS = {};

ASSET_MANAGER.queueDownload("./assets/arrow.png");
ASSET_MANAGER.queueDownload("./assets/brick.png");
ASSET_MANAGER.queueDownload("./assets/the-hardest-asset-ever.png");
ASSET_MANAGER.queueDownload("./assets/houseTiles.png");
ASSET_MANAGER.queueDownload("./assets/portalPoint.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Bernice_Campbell.png");
ASSET_MANAGER.queueDownload("./assets/grandmas/Vera_Mulberry.png");
ASSET_MANAGER.queueDownload("./maps/dev.json");
ASSET_MANAGER.queueDownload("./maps/dev2.json");
ASSET_MANAGER.queueDownload("./maps/house.json");

// For BattleScene
ASSET_MANAGER.queueDownload("./maps/battle_bg.png");

ASSET_MANAGER.queueDownload("./assets/battleScene/grannyhp.png");

ASSET_MANAGER.queueDownload("./assets/battleScene/playerReady.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/targetPointer.png");

ASSET_MANAGER.queueDownload("./assets/battleScene/button.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/attack.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/defend.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/special.png");
ASSET_MANAGER.queueDownload("./assets/battleScene/endButton.png");

gameEngine.grannies = [{
        granny: "true",
        name: "Mary Yott",
        maxHp: 100,
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 1
    },
    {
        granny: "true",
        name: "Boss Granny",
        maxHp: 200,
        hp: 200,
        attack: 20,
        defense: 10,
        speed: 2
    },
    {
        granny: "true",
        name: "Granny Smith",
        maxHp: 150,
        hp: 150,
        attack: 15,
        defense: 7,
        speed: 1.5,
        position: { x: 0, y: 2 }
    },
    {
        granny: "true",
        name: "Granny Weatherwax",
        maxHp: 175,
        hp: 175,
        attack: 17,
        defense: 8,
        speed: 1.75,
        position: { x: 1, y: 0 }
    },
    {
        granny: "true",
        name: "Granny Rags",
        maxHp: 125,
        hp: 125,
        attack: 12,
        defense: 6,
        speed: 1.25,
        position: { x: 1, y: 1 }
    },
        {
        granny: "true",
        name: "Granny Goodness",
        maxHp: 250,
        hp: 250,
        attack: 25,
        defense: 12,
        speed: 2.5,
        position: { x: 1, y: 2 }
    }];
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
