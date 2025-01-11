const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/arrow.png");

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    gameEngine.init(ctx);

    gameEngine.start();

    gameEngine.addEntity(new Player(gameEngine, canvas.width / 2 - 16 * 5, canvas.height / 2 - 16 * 5));
});
