const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/arrow.png");
ASSET_MANAGER.queueDownload("./assets/brick.png");
ASSET_MANAGER.queueDownload("./maps/dev.json");

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    gameEngine.init(ctx);

    gameEngine.start();

    const scene = new SceneManager(gameEngine);
});
