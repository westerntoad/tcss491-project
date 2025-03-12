44// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.keys = {};
        this.pressed = {};

        //Player Movement in the Overworld -> Arrow Keys AND WASD movement support.
        this.left = false;
        this.A = false;
        this.right = false;
        this.D = false;
        this.up = false;
        this.W = false;
        this.down = false;
        this.S = false;

        //Dialogue Scenes Select A
        this.F = null;

        //Escape key to exit 
        this.esc = null;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;

        //Having 3 states for the 3 different gameplay types of the game.
        this.battle = false;
        this.overworld = false;
        this.dialogue = true;

        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        const that = this;

        function mouseListener(e) {
            that.mouse  = handleMouseMove(e);
        };

    //mouseDebugClickListener() is a temp debug method only.
    //To log the information of the coordinates
    function mouseDebugClickListener(e) {
        that.mouse  = handleMouseMove(e);
        if (PARAMS.DEBUG) console.log(that.mouse);
    };
        this.mouseMove = mouseListener;
        this.mouseClick = mouseDebugClickListener;

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keydown", event => this.pressed[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
        //this.ctx.canvas.addEventListener("mousemove", handleMouseMove);


        //when key is pressed
        function keydownListener (e) {
            that.keyboardActive = true;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = true;
                    break;
                case "KeyF":
                    that.A = true;
                case "KeyEsc":
                    that.esc = true;
                    break;
            }
        }

        //when key is not pressed
        function keyupListener (e) {
            that.keyboardActive = false;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = false;
                    break;
                case "KeyF":
                    that.A = false;
                case "KeyEsc":
                    that.esc = false;
                    break;
            }
        }
        that.keydown = keydownListener;
        that.keyup = keyupListener;

    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        this.ctx.clearRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (!this.entities[i].noDraw) {
                this.entities[i].draw(this.ctx, this);
            }
        }
    };

    gamepadUpdate() {
        this.gamepad = navigator.getGamepads()[0];
        const controller = this.gamepad;
        //If the controller is connected to the computer.
        if (controller != null) {
            this.F = controller.buttons[0].pressed;
            this.up = controller.buttons[12].pressed || controller.axes[1] < -0.3;
            this.W = controller.buttons[12].pressed || controller.axes[1] < -0.3;
            this.down = controller.buttons[13].pressed || controller.axes[1] > 0.3;
            this.S = controller.buttons[13].pressed || controller.axes[1] > 0.3;
            this.left = controller.buttons[14].pressed || controller.axes[0] < -0.3;
            this.A = controller.buttons[14].pressed || controller.axes[0] < -0.3;
            this.right = controller.buttons[15].pressed || controller.axes[0] > 0.3;
            this.D = controller.buttons[15].pressed || controller.axes[0] > 0.3;
        }
    };

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (entity && !entity.removeFromWorld && !entity.noUpdate) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.entities.sort((a, b) => b.z - a.z);
        // this.ctx.canvas.addEventListener("keydown", event => this.pressed[event.key] = true);
        this.update();
        this.draw();

        Object.keys(this.pressed).forEach(v => this.pressed[v] = false)
        this.click = null;
    };

};
