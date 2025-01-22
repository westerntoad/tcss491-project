class GUI {
    constructor(game, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.battleScene = null;
        this.battleActive = false;
        this.battleButton = document.getElementById('battleButton');
        this.battleButton.addEventListener('click', () => {
            if (this.battleActive) {
                this.endBattle();
            } else {
                this.startBattle();
            }
        });
    }

    startBattle() {
        this.battleActive = true;
        this.battleScene = new BattleScene(this.game, this.sceneManager, this.game.grannies, this.game.grannies);
        this.game.addEntity(this.battleScene);
        this.battleButton.innerText = "End Battle";
    }
    
    endBattle() {
        this.battleActive = false;
        this.game.entities = this.game.entities.filter(entity => entity !== this.battleScene);
        this.battleButton.innerText = "Start Battle";
    }
}