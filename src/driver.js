
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/arrow.png");
ASSET_MANAGER.queueDownload("./assets/brick.png");
ASSET_MANAGER.queueDownload("./maps/dev.json");
ASSET_MANAGER.queueDownload("./maps/battle_bg.png");

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
