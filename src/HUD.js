class HUD {
    constructor(game, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.z = 200; // Above everything else
        this.visible = true;
        this.padding = 20;
        this.width = game.width / 4;
        this.height = game.height / 4.1;
        this.x = game.width - this.width - this.padding;
        this.y = this.padding;

        // Controls to display
        this.controls = [
            {key: "Z: ", description: "Interact / Next Dialogue"},
            {key: "Hold Z: ", description: "Skip Dialogue"},
            {key: "X: ", description: "Party and Settings"},
            {key: "Arrow/WASD: ", description: "Move Character"},
            {key: "H: ", description: "Toggle Controls HUD"}
        ];
    }
    update() {
        // Add any animations or updates here if needed
    }

    draw(ctx) {
        if (!this.visible) return;

        // Draw semi-transparent background
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw title
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText("CONTROLS", this.x + 130, this.y + 25);

        // Draw controls list
        ctx.font = "14px Arial";
        for (let i = 0; i < this.controls.length; i++) {
            const control = this.controls[i];
            // Draw key in a box
            ctx.fillStyle = "#4a90e2";
            ctx.fillRect(this.x + 10, this.y + 40 + (i * 30), 235, 20);
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.x + 10, this.y + 40 + (i * 30), 235, 20);

            // Draw key text
            ctx.fillStyle = "white";
            ctx.fillText(control.key, this.x + 60, this.y + 55 + (i * 30));

            // Draw description
            ctx.fillText(control.description, this.x + 160, this.y + 55 + (i * 30));
        }

        ctx.restore();
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    toggle() {
        this.visible = !this.visible;
    }

    // Add a new control to the HUD
    addControl(key, description) {
        this.controls.push({ key, description });
    }
}
