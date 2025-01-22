const guiHeight = 0;
const padding = 100;
let playerCount = null;
let enemiesCount = null;
let playableSpace = null;
const spriteSize = 40;

let lastClickTime = 0; // Tracks the last click timestamp
const clickCooldown = 500; // 0.5 seconds (500ms)
class BattleScene {
    constructor(game, sceneManager, players, enemies) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;


        // instantiate new fields for players for battleScene
        this.players.forEach((player, index) => {
             /**
             * 0 = awaiting moves | 1 = attack | 2 = defend | 3 = special move
             */
             player.actions = 1; // instantiate new field
             player.hovered = true; // instantiate new field
        });

        playerCount = this.players.length;
        enemiesCount = this.enemies.length;
        playableSpace = this.game.height - padding * 2 - guiHeight;
        console.log("Division: ", playableSpace / playerCount);

        // 0 = setting up battle scene
        // 1 = awaiting action input
        // 2 = drawing actions for turn
        this.actions = 0;

        console.log('Screen Width:', this.game.width);
        console.log('Screen Height:', this.game.height);
        this.battleOptions = ASSET_MANAGER.getAsset("./assets/options.png"); // Load battle options
        this.greenPointer = ASSET_MANAGER.getAsset("./assets/greenPointer.png"); // OPTION SELECTED
        this.redPointer = ASSET_MANAGER.getAsset("./assets/redPointer.png"); // OPTION NOT SELECTED
        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
        this.grannyHp = ASSET_MANAGER.getAsset("./assets/grannyhp.png"); // Load hp bar for player
        this.button = ASSET_MANAGER.getAsset("./assets/button.png"); // Load button for actions
        console.log('Granny HP Image:', this.grannyHp); // Debugging statement
    }

    update() {
        // wait for all player actions, then generate enemy actions
        // const actions = {};
        // for(){
        //     actions[player] =
        // }

        if(this.actions == 1) {
            // for each player, get the action
            // for each enemy, get the action
        }

        else if(this.actions == 2) {
            // for each player, do the action
            // for each enemy, do the action
        }

        // if (this.enemies.every(enemy => enemy.hp <= 0)) {
        //     console.log("Battle Over! Returning to Overworld...");
        //     this.sceneManager.restoreScene(); // Return to map
        // }
    }
    redraw(ctx) {

        console.log('Playable Space:', playableSpace);
        // Draw background
        if (this.background) {
            ctx.drawImage(this.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        // Draw players
        /* Very janky scaling and positioning of hp bar, grannies, and text. */
        this.players.forEach((player, index) => {

            ctx.fillStyle = "blue";
            // x, y, width, height
            // get game.width and game.height
            // (playableSpace * i / (playerCount * 2)) + padding 
            const startX = this.game.width / 4;
            const startY = (playableSpace * index / playerCount) + padding;

            ctx.fillRect(startX, startY,
                spriteSize, spriteSize); // Placeholder player sprite
        
            // placeholder GUI cover
            // ctx.fillRect(0, this.game.height - guiHeight, this.game.width, guiHeight)

            //draw the player's health bar
            const upscale = 3; // UPSCALE used only for hp bar and player name!!
            const hpBarX = 5 * upscale;
            const hpBarY = 1 * upscale;
            const currentHp = player.hp/ player.maxHp;

            // new field in player for startX and startY
            player.startX = startX;
            player.startY = startY;

            ctx.fillStyle = "white";
            ctx.fillText(player.name, 10 + startX - this.game.width/8, hpBarY + startY -2);

            ctx.fillStyle = "black";
            ctx.fillRect(hpBarX + startX - this.game.width/8, hpBarY + startY, 19 * upscale, 4 * upscale);
            ctx.fillStyle = "red";
            ctx.fillRect(hpBarX + startX - this.game.width/8, hpBarY + startY, currentHp * 19 * upscale, 4 * upscale);
            ctx.drawImage(this.grannyHp, 3, 10, 27, 10, startX - this.game.width/8, startY, 27 * upscale, 10 * upscale);
        });


        // Draw enemies
        this.enemies.forEach((enemy, index) => {
            ctx.fillStyle = "red";
            ctx.fillRect(this.game.width * 3/4, 200 + index * 50, 
                40, 40); // Placeholder enemy sprite
            ctx.fillStyle = "white";
            ctx.fillText(enemy.name, 450, 220 + index * 50);

            //draw the enemy's health bar
        });
    }
    awaiting() {
        const currentTime = Date.now();
            
                // ✅ If less than 500ms since last click, ignore the event
                if (currentTime - lastClickTime < clickCooldown) {
                    return false;
                }
            
                lastClickTime = currentTime;
            return true;

    }
    draw(ctx) {
            // SETTING UP BATTLE SCENE
            if(this.actions == 0){ 
                this.redraw(ctx);
            // example pointers and options
            // make sure to incrememt this.actions
            this.actions ++;
        }
        else if(this.actions == 1){ // awaiting action input
            // only draw around the GUI or selection system
            /**
             * 0 = awaiting moves | 1 = attack | 2 = defend | 3 = special move
             */
            

            // (img, startX/Y of img, w/h of img, canvas-coord, resize);
            // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
            // sx = 1, sy = 1, sw = 30, sh = 30 (size of options.png)
            const handlePointerClick = (e) => {
                if(this.awaiting()){
                    const rect = ctx.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                
                    this.players.forEach((player) => {
                        if (x >= player.startX && 
                            x <= player.startX + spriteSize &&
                            y >= player.startY &&
                            y <= player.startY + spriteSize) {
                                if(player.hovered) {
                                    player.hovered = false;
                                    console.log("Unhovered on Player", player.name);
                                    this.redraw(ctx);
                                }
                                else {
                                    player.hovered = true;
                                    console.log("Hovered on Player", player.name);
                                }
                        }
                    });
                }
            };
            ctx.canvas.addEventListener("click", handlePointerClick);

            this.players.forEach((player) => {
                if(player.hovered) {
                    ctx.drawImage(this.battleOptions, 1, 1, 30, 30, player.startX + spriteSize * 2, player.startY + spriteSize/2 - spriteSize * 2,
                        spriteSize * 2, spriteSize * 2);
                }
                const pointerSize = spriteSize * 3/4;
                // 15, 9, 7, 7 for pointer
                ctx.drawImage(this.greenPointer, 16, 9, 7, 7, player.startX + spriteSize,  player.startY - pointerSize,
                    pointerSize, pointerSize);
            });
            // this.button (26, 10)
            if(this.players.filter(player => player.actions == 0).length <= 0) {

                const buttonX = this.players[this.players.length - 1].startX + 100;
                const buttonY = this.players[this.players.length - 1].startY + 100;
                ctx.drawImage(this.button, 
                    buttonX, buttonY, 
                    26 * 5, 10 * 5); // 130, 50

                    const inBound = (x, y) => {
                        return x >= buttonX && 
                        x <= buttonX + 130 &&
                        y >= buttonY &&
                        y <= buttonY + 50;
                    }

                    const handleTurnClick = (e) => {
                        const rect = ctx.canvas.getBoundingClientRect();
                        if (inBound(e.clientX - rect.left, e.clientY - rect.top)) {
                            console.log("Clicked on Button, X:", e.clientX, "Y:", e.clientY);
                            this.players.forEach(player => {
                                player.actions = 0;
                                console.log(player.actions);
                            });
                        
                            // Properly remove the event listener
                            ctx.canvas.removeEventListener("click", handleTurnClick);
                            this.redraw(ctx);
                        }
                    };
                    
                    // Add event listener using the function reference
                    ctx.canvas.addEventListener("click", handleTurnClick);
                
            }
            
            // at end, actions++;
            this.actions ++;
        }
        else if(this.actions == 2) { // drawing actions for turn

            // at end, actions++;
            this.actions --;
        }
        
        /*
        padding top and bottom = 100;
        gui height = 300;
        */

        //Draw the GUI elements
    }
    
}