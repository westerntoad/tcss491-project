
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/arrow.png");
ASSET_MANAGER.queueDownload("./assets/brick.png");
ASSET_MANAGER.queueDownload("./maps/dev.json");
ASSET_MANAGER.queueDownload("./maps/battle_bg.png");
ASSET_MANAGER.queueDownload("./assets/grannyhp.png");

ASSET_MANAGER.queueDownload("./assets/options.png");
ASSET_MANAGER.queueDownload("./assets/greenPointer.png");
ASSET_MANAGER.queueDownload("./assets/redPointer.png");
ASSET_MANAGER.queueDownload("./assets/button.png");
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
    ctx.imageSmoothingEnabled = false;

    gameEngine.width = canvas.width;
    gameEngine.height = canvas.height; 

    gameEngine.init(ctx);

    gameEngine.start();

    const scene = new SceneManager(gameEngine);
});
