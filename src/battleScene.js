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
        this.turn = [];
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;


        // instantiate new fields for players for battleScene
        this.players.forEach((player) => {
             /**
             * 0 = awaiting moves | 1 = attack | 2 = defend | 3 = special move
             */
             player.createdTurn = {
                target: null,
                updateHp: null,
                buff: null,
                actionDetail: "" // construct string for actionDetail
            }
             player.ally = true; // instantiate new field
             player.actions = 0; // instantiate new field
             player.hovered = true; // instantiate new field
        });
        this.enemies.forEach((enemy, index) => {
            enemy.ally = false;
        });

        playerCount = this.players.length;
        enemiesCount = this.enemies.length;
        playableSpace = this.game.height - padding * 2 - guiHeight;

        // 0 = setting up battle scene
        // 1 = awaiting action input
        // 2 = drawing actions for turn
        this.actions = 0;

        this.playerReady = ASSET_MANAGER.getAsset("./assets/battleScene/playerReady.png"); // PLAYER READY
        this.targetPointer = ASSET_MANAGER.getAsset("./assets/battleScene/targetPointer.png"); // TARGET POINTER
        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
        this.grannyHp = ASSET_MANAGER.getAsset("./assets/battleScene/grannyhp.png"); // Load hp bar for player
        this.button = ASSET_MANAGER.getAsset("./assets/battleScene/endButton.png"); // Load button for actions

        this.attackButton = ASSET_MANAGER.getAsset("./assets/battleScene/attack.png"); // Load attack button
        this.defendButton = ASSET_MANAGER.getAsset("./assets/battleScene/defend.png"); // Load defend button
        this.specialButton = ASSET_MANAGER.getAsset("./assets/battleScene/special.png"); // Load special button

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
            enemy.startX = this.game.width * 3/4;
            enemy.startY = (playableSpace * index / enemiesCount) + padding;

            ctx.fillRect(enemy.startX, enemy.startY, 
                spriteSize, spriteSize); // Placeholder enemy sprite
            ctx.fillStyle = "white";
            ctx.fillText(enemy.name, 450, 220 + index * 50);

            //draw the enemy's health bar
        });
    }
    awaiting() {
        const currentTime = Date.now();
            
                // If less than 500ms since last click, ignore the event
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

            this.players.forEach((player) => {

                const startX = player.startX + spriteSize * 2;
                const startY = player.startY + spriteSize/2 - spriteSize * 2

                if(player.hovered && !this.awaitingTarget) {
                    ctx.drawImage(this.attackButton, 1, 1, 30, 30, 
                        startX, startY,
                        spriteSize * 2, spriteSize * 2);

                    ctx.drawImage(this.defendButton, 1, 1, 30, 30, 
                        startX + spriteSize * 2, startY,
                        spriteSize * 2, spriteSize * 2);

                    ctx.drawImage(this.specialButton, 1, 1, 30, 30, 
                        startX + spriteSize * 4, startY,
                        spriteSize * 2, spriteSize * 2);
                }
                const pointerSize = spriteSize * 3/4;
                
                
                // 15, 9, 7, 7 for pointer
                // 0, 0, 5, 5 for playerReady
                if(player.actions != 0) 
                    ctx.drawImage(this.playerReady, 0, 0, 5, 5, player.startX + spriteSize, 
                    player.startY - pointerSize, pointerSize, pointerSize);

                // ctx.drawImage(player.actions == 0 ? this.redPointer : this.greenPointer,
                //     16, 9, 7, 7, player.startX + spriteSize,  player.startY - pointerSize,
                //     pointerSize, pointerSize);

                // sx = 1, sy = 1, sw = 30, sh = 30 (size of options)
            });

            const handleMouseMove = (e) => {
                const rect = ctx.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const pointerSize = 3/4 * spriteSize;

                this.enemies.forEach((enemy) => {
                    if (mouseX >= enemy.startX && 
                        mouseX <= enemy.startX + spriteSize && 
                        mouseY >= enemy.startY && 
                        mouseY <= enemy.startY + spriteSize) {
                            
                        ctx.drawImage(this.targetPointer,
                                0, 0, 7, 7, enemy.startX - pointerSize,  enemy.startY - pointerSize,
                                pointerSize, pointerSize);
                    } else {
                        ctx.drawImage(this.background, enemy.startX - pointerSize,
                            enemy.startY - pointerSize, pointerSize, pointerSize,
                            enemy.startX - pointerSize, enemy.startY - pointerSize,
                            pointerSize, pointerSize);
                    }
                });
            };
            /** Add target type: 1 = enemy, 2 = ally */
            const handleTargetClick = (e, targetter) => { 
                if (!this.awaitingTarget) return; // Prevent incorrect targeting
            
                const rect = ctx.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
            
                let clickedEnemy = null; // Store the enemy being clicked
            
                this.enemies.forEach((enemy) => {
                    if (x >= enemy.startX && 
                        x <= enemy.startX + spriteSize && 
                        y >= enemy.startY && 
                        y <= enemy.startY + spriteSize) {
                        clickedEnemy = enemy;
                    }
                });
            
                if (clickedEnemy) {
                    console.log("Player", targetter.name, "chose to attack", clickedEnemy.name);
                    targetter.createdTurn.target = clickedEnemy;
            
                    targetter.hovered = false; // Reset hovered state
                    this.awaitingTarget = false; // Reset target selection state

                    this.removeTargetListener(); // Remove the target listener

                    ctx.canvas.removeEventListener("mousemove", handleMouseMove);
                    console.log("Target selected, mouse tracking removed.");

                    targetter.actions = targetter.queueActions;
                    targetter.queueActions = 0;

                    this.redraw(ctx);
                }
            };
            
            const handlePointerClick = (e) => { // click for options
                if (!this.awaiting() || this.awaitingTarget) return;
            
                const rect = ctx.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
            
                let clickedPlayer = null; // Store the player being clicked
            
                this.players.forEach((player) => {
                    const startX = player.startX + spriteSize * 2;
                    const startY = player.startY + spriteSize / 2 - spriteSize * 2;
            
                    if (player.hovered) {
                        if (x >= startX && x <= startX + spriteSize * 2 && y >= startY && y <= startY + spriteSize * 2) {
                            player.queueActions = 1; // Attack
                            
                            console.log("Waiting for target selection...");
                            this.awaitingTarget = true; // Set flag to indicate target selection is needed

                            // Bind the function with the specific player so we know who is attacking
                            const boundHandleTargetClick = (event) => handleTargetClick(event, player);

                            // Add event listener for selecting a target
                            ctx.canvas.addEventListener("click", boundHandleTargetClick);

                            // Remove event listener once the target is chosen
                            this.removeTargetListener = () => {
                                ctx.canvas.removeEventListener("click", boundHandleTargetClick);
                                this.awaitingTarget = false; // Reset target selection state
                            };

                            ctx.canvas.addEventListener("mousemove", handleMouseMove);
                        } else if (x >= startX + spriteSize * 2 && x <= startX + spriteSize * 4 && y >= startY && y <= startY + spriteSize * 2) {
                            player.actions = 2; // Defend
                        } else if (x >= startX + spriteSize * 4 && x <= startX + spriteSize * 6 && y >= startY && y <= startY + spriteSize * 2) {
                            player.actions = 3; // Special
                        }

                        if(x >= startX && x <= startX + spriteSize * 6 && 
                            y >= startY && y <= startY + spriteSize * 2) {
                            clickedPlayer = player;
                            this.createTurn(clickedPlayer, ctx);
                        }
                    }
                    else if(!this.awaitingTarget && x >= player.startX && x <= player.startX + spriteSize && y >= player.startY && y <= player.startY + spriteSize) {
                        player.hovered = true;
                    }
                });
            
                if (clickedPlayer) {
                    console.log("Player", clickedPlayer.name, "chose action:", clickedPlayer.actions);
                    clickedPlayer.hovered = false; // Only reset hovered for the clicked player
                    this.redraw(ctx);
                }
            };
            
            // Ensure event listener is only added once
            ctx.canvas.addEventListener("click", handlePointerClick);
            
            // this.button (26, 10)
            if(this.players.filter(player => player.actions == 0).length <= 0) {

                const buttonX = this.players[this.players.length - 1].startX + 100;
                const buttonY = this.players[this.players.length - 1].startY + 100;
                ctx.drawImage(this.button, 
                    buttonX, buttonY, 
                    32 * 4, 14 * 4); // 128, 56

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
    createTurn(initiate, ctx){
        /**
            Mary Yott: Main character. Likes birdwatching, gardening, and tea.
                - Tea Time: Gives one party member 2 turns.
                - Trusty Owl: Grants vision of enemy moves.
                - Green Thumb: Removes all debuffs and heals party. 
          
            Vera Mulberry (Team Minion Summoner/Cat Lady): NPC team member, cat lady. Can summon cat minions.
                - Cat Minion: Either attacks or defends.

            Pearl Martinez (Team Rogue/Knitter): NPC team member, knitting based moves.
                - Knit: Debuffs enemy
                    + reduces attack or defense

                "Pearl Martinez is knitting a sweater! 
                    "It's an extra-warm cozy! x's guard is lowered!" or
                    "It's an extra-cozy sweater! x loses fighting power!"

            Ye-soon Kim (Team Bard/Bingo): NPC team member, cheering, puns, bingo themed moves.
                - Bingo: Buffs team.
                    + increases attack or defense

                    "Ye-soon Kim is calling out numbers!" "BINGO!
                        Across! Fighting Power is increased!" or
                        Diagonal! Resillience is increased!"

            Bernice Campbell (Team Wizard/Baker): NPC team member, baking based moves.
                - Extra-hot Casserole: Attacks enemy
                    + deals damage 

            
        */

        /*
            Experience -> Determination
                Each "level up" -> "Grandma x is filled with determination!"
            
            Health Points -> Willpower
                Monster defeat ->  "x loses will to fight!"

            Attack -> Reasoning/Fighting Power
                Attack -> "x reasons with y! y loses _ fighting power!"

            Defense -> Resillience/Guard
                Debuff -> "x's guard is lowered!"
                Defend -> "Grandma x is on guard!"

            Speed -> Agility
            
        */
        // See what is targetable
        // store turn detail as an object
        let createdTurn = {
            origin: initiate,
            target: null,
            updateHp: null,
            actionDetail: "" // construct string for actionDetail
        }

        //
        if(origin.ally) {
            if(origin.actions == 1) {
                // attack
                createdTurn.target = this.enemies[0];
                createdTurn.updateHp = createdTurn.target.hp - origin.attack;
                createdTurn.actionDetail = `${origin.name} attacks ${createdTurn.target.name} for ${origin.attack} damage!`;
            }

            else if(origin.actions == 2) {

            }

            else if(origin.actions == 3) {
                switch(origin.name){
                    case "Mary Yott":
                        
                        break;
    
                    case "Vera Mulberry":
                        
                        break;
    
                    case "Pearl Martinez":
    
                        break;
    
                    case "Ye-soon Kim":
    
                        break;
    
                    case "Bernice Campbell":
    
                        break;
    
                    default:
                        
                        break;
                }
            }
        }
        // don't use ctx to draw for targetting
        else {
            // Bosses can buff, debuff, and attack for special moves
            // receive the action from *special monsters (Bosses)
            if(origin.isBoss) { // make isBoss a field for monsters
                createdTurn.actionDetail = "";
            }
        }

        this.turn.push(createdTurn);
    }
    removeAllEventListeners() {
        const oldCanvas = this.ctx.canvas;
        const newCanvas = oldCanvas.cloneNode(true);
        oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
        this.ctx = newCanvas.getContext("2d");
    }
}