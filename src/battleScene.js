let playerCount = null;
let enemiesCount = null;
let playableSpace = null;
const spriteSize = 100;

let lastClickTime = 0; // Tracks the last click timestamp
const clickCooldown = 500; // 0.5 seconds (500ms)

// size of incomingSprite
const inputSprite = 32;
const optionSize = 3/4;
const padding = spriteSize * (3/4);
class BattleScene {
    constructor(game, sceneManager, players, enemies) {
        this.id = Math.random();
        console.log("ID for BattleScene: ", this.id);
        this.turn = [];
        this.game = game;
        this.sceneManager = sceneManager;
        this.players = players;
        this.enemies = enemies;
        this.toDraw = 0;
        this.buttonPressed = false;
        this.eventListener = [];
        this.dialogue = null;
        this.game.ctx.font = "22px serif";


        // instantiate new fields for players for battleScene
        this.players.forEach((player) => {
             /**
             * 0 = awaiting moves | 1 = attack | 2 = defend | 3 = special move
             */
             player.createdTurn = {
                ticker: 0,
                caster: player,
                target: null,
                updateHp: null,
                buff: null,
                actionDetail: "" // construct string for actionDetail
            }
            player.isDefending = 0;
            player.drawAsset = ASSET_MANAGER.getAsset(player.asset);
            player.frames = player.drawAsset.width / inputSprite;
            player.currentFrame = 0;
             player.ally = true; // instantiate new field
             player.actions = 0; // instantiate new field
             player.hovered = true; // instantiate new field
        });
        this.enemies.forEach((enemy, index) => {
            enemy.currentFrame = 0;
            enemy.drawAsset = ASSET_MANAGER.getAsset(enemy.asset);
            console.log(enemy.asset);
            enemy.frames = enemy.drawAsset.width / inputSprite;
            enemy.isDefending = false;
            enemy.index = index;
            enemy.ally = false;
            enemy.maxHp = enemy.hp;
        });

        playerCount = this.players.length;
        enemiesCount = this.enemies.length;
        playableSpace = this.game.height - padding * 2;
        console.log(this.game.height);

        // 0 = setting up battle scene
        // 1 = awaiting action input
        // 2 = drawing actions for turn
        this.actions = 0;

        this.playerReady = ASSET_MANAGER.getAsset("./assets/battleScene/playerReady.png"); // PLAYER READY
        this.targetPointer = ASSET_MANAGER.getAsset("./assets/battleScene/targetPointer.png"); // TARGET POINTER
        this.background = ASSET_MANAGER.getAsset("./maps/battle_bg.png"); // Load battle background
        this.grannyHp = ASSET_MANAGER.getAsset("./assets/battleScene/grannyhp.png"); // Load hp bar for player
        this.allyHp = ASSET_MANAGER.getAsset("./assets/battleScene/allyHp.png");
        this.enemyHp = ASSET_MANAGER.getAsset("./assets/battleScene/enemyHealth.png"); // Load hp bar for enemy
        this.button = ASSET_MANAGER.getAsset("./assets/battleScene/endButton.png"); // Load button for actions

        this.attackTransparent = ASSET_MANAGER.getAsset("./assets/battleScene/attackTransparent.png");
        this.defendTransparent = ASSET_MANAGER.getAsset("./assets/battleScene/defendTransparent.png");
        this.specialTransparent = ASSET_MANAGER.getAsset("./assets/battleScene/specialTransparent.png");
        this.attackButton = ASSET_MANAGER.getAsset("./assets/battleScene/attack.png"); // Load attack button
        this.defendButton = ASSET_MANAGER.getAsset("./assets/battleScene/defend.png"); // Load defend button
        this.specialButton = ASSET_MANAGER.getAsset("./assets/battleScene/special.png"); // Load special button

        console.log('Granny HP Image:', this.grannyHp); // Debugging statement

        
    }
    update() {return;} // not utilized.
    removeStackingFrames(x, y, width, height){ // just redraw background around the selected image
        if (this.background) {
            this.game.ctx.drawImage(this.background, x, y, width, height, x, y, width, height);
        } else {
            console.log("removeStackingFrames not executed due to no background available");
        }
    }
    redraw(ctx) {
        // Draw background
        if (this.background) {
            ctx.drawImage(this.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        // Draw players
        /* Very janky scaling and positioning of hp bar, grannies, and text. */
        this.players.forEach((player, index) => {

            // ctx.fillStyle = "blue";

            // x, y, width, height
            // get game.width and game.height
            // (playableSpace * i / (playerCount * 2)) + padding 

            const startX = this.game.width / 4;
            const startY = padding - (spriteSize / 2) + (index + 1) * playableSpace / (playerCount + 1);

            // ctx.fillRect(startX, startY,
            //     spriteSize, spriteSize); // Placeholder player sprite

            ctx.drawImage(player.drawAsset, 0, 0, inputSprite, inputSprite, 
                startX, startY, spriteSize, spriteSize);
            // placeholder GUI cover
            // ctx.fillRect(0, this.game.height - guiHeight, this.game.width, guiHeight)

            //draw the player's health bar
            const upscale = 3; // UPSCALE used only for hp bar and player name!!
            const currentHp = player.hp / player.maxHp;
                //player.hp/ player.maxHp
            // new field in player for startX and startY
            player.startX = startX;
            player.startY = startY;

            ctx.drawImage(this.allyHp, inputSprite + 1, 5,
                30, 26, 
                player.startX + spriteSize * (3/5) - this.game.width / 8, player.startY,
                spriteSize * (3/5) , spriteSize * (26/30) * (3/5)
            );
                //draw the red heart
            ctx.drawImage(this.allyHp, 1, 5 + ((1 - currentHp) * 26),
                30, 26 * currentHp,
                player.startX + spriteSize * (3/5) - this.game.width / 8, player.startY + Math.floor((1 - currentHp) * spriteSize * (26/30) * (3/5)),
                spriteSize * (3/5) , Math.floor((currentHp) * spriteSize * (26/30) * (3/5))
            );

            ctx.fillStyle = "white";
            const nameLength = ctx.measureText(player.name).width;
            ctx.fillText(player.name, player.startX + spriteSize * (6/5)  - this.game.width / 8 - nameLength, 
                player.startY - spriteSize / 6);
        });


        // Draw enemies
        this.enemies.forEach((enemy, index) => {
            ctx.fillStyle = "red";
            if(!(enemy.startX && enemy.startY)) {
                enemy.startX = this.game.width * 3/4;
                enemy.startY = padding - (spriteSize / 2) + (index + 1) * playableSpace / (enemiesCount + 1);
            }

            ctx.drawImage(enemy.drawAsset, 0, 0, inputSprite, inputSprite, 
                enemy.startX, enemy.startY, spriteSize, spriteSize)
    
            ctx.fillStyle = "white";
            
            // const nameLength = ctx.measureText(enemy.name).width;
            ctx.fillText(enemy.name, enemy.startX + spriteSize * (13/10), enemy.startY - spriteSize / 6)
            this.updateEnemyHp(enemy, ctx);
                
        });
    }
    updateEnemyHp(enemy, ctx){
        //draw the enemy's health bar
             //enemy.hp / enemy.maxHp
        const currHpBar = enemy.hp/enemy.maxHp;
    
             //draw the black heart
             ctx.drawImage(this.enemyHp, inputSprite + 1, 5,
                 30, 26, 
                 enemy.startX + this.game.width/8, enemy.startY,
                 spriteSize * (3/5) , spriteSize * (26/30) * (3/5)
             );

             const pHeight = 5 + currHpBar * 26;
             //draw the purple heart
             // x: 1, y: 5, width: 30, height: 26
            //  ctx.drawImage(this.enemyHp, 1, 5,
            //      30, 26, 
            //      enemy.startX + this.game.width/8, enemy.startY,
            //      spriteSize * (3/5) , spriteSize * (26/30) * (3/5)
            //  );
             ctx.drawImage(this.enemyHp, 1, pHeight,
                    30, Math.floor((1 - currHpBar) * 26),
                    enemy.startX + this.game.width/8, 
                    enemy.startY + currHpBar* spriteSize * (26/30) * (3/5), // startY
                    spriteSize * (3/5) , //width
                    Math.floor((1 - currHpBar)* spriteSize * (26/30) * (3/5)) //height
                );
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
    updateHp(target, caster, ctx) {
        if(target.hp <= 0) {
            target.hp = 0;
            if (target.ally) { 
                // Remove defeated player
                this.players = this.players.filter(player => player.name !== target.name);
            } else {
                // Remove defeated enemy
                caster.exp += target.exp;  
    
                this.enemies = this.enemies.filter(enemy => enemy.index !== target.index);
                console.log("Remaining Enemies:", this.enemies);
                this.removeStackingFrames(target.startX + this.game.width/8, target.startY, // remove enemy
                    spriteSize * (3/5) , spriteSize * (26/30) * (3/5));
                    
                //remove name
                let textWidth = ctx.measureText(target.name).width;
                this.removeStackingFrames(target.startX + spriteSize * (13/10), 
                    target.startY - spriteSize / 6 - 22, textWidth, 22);
                this.turn = this.turn.filter(turn => turn.caster.index !== target.index); // remove dead enemies turn

                if(this.enemies.length > 0){ // just for players targetting dead enemies
                    this.turn.forEach((turns) => {
                        if(turns.target.index == target.index){
                            turns.target = this.enemies[0];
                            this.updateDialogue(turns.caster, this.enemies[0], turns.actions, turns);
                        }
                    });
                    // this.updateDialogue(this.turn[0].caster, this.turn[0].target, 
                    //     this.turn[0].actions, this.turn[0]);
                } else this.endGame;
            }
            this.removeStackingFrames(target.startX,
                target.startY, spriteSize, spriteSize);
                        
            
        } else {
            if(target.granny) {
                //draw the player's health bar
                const player = target;
                const currentHp = player.hp / player.maxHp;
                ctx.drawImage(this.allyHp, inputSprite + 1, 5,
                    30, 26, 
                    player.startX + spriteSize * (3/5) - this.game.width / 8, player.startY,
                    spriteSize * (3/5) , spriteSize * (26/30) * (3/5)
                );
                    //draw the red heart
                    ctx.drawImage(this.allyHp, 1, 5 + ((1 - currentHp) * 26),
                    30, 26 * currentHp,
                    player.startX + spriteSize * (3/5) - this.game.width / 8, player.startY + Math.floor((1 - currentHp) * spriteSize * (26/30) * (3/5)),
                    spriteSize * (3/5) , Math.floor((currentHp) * spriteSize * (26/30) * (3/5))
                );
            } else {
                this.updateEnemyHp(target, ctx);
            }
        }
    }
    draw(ctx) {
        // if(this.toDraw >= 15){
        //     this.players.forEach((player, index) => {
        //         const startX = this.game.width / 4;
        //         const startY = (playableSpace * index / playerCount) + padding;
    
        //         this.removeStackingFrames(startX, startY, spriteSize, spriteSize);
        //         ctx.drawImage(player.drawAsset, inputSprite * player.currentFrame, 0, inputSprite, inputSprite, 
        //         startX, startY, spriteSize, spriteSize);
    
        //         player.currentFrame = player.currentFrame + 1 > player.frames - 1 ? 0 : player.currentFrame + 1;
        //     });
        //     this.toDraw = 0;
        // } else {
        //     this.toDraw++;
        // }
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
            
            this.players.forEach((player) => { // drawing options

                const startX = player.startX + spriteSize + spriteSize / 2 * optionSize;
                const startY = player.startY + spriteSize/2 - spriteSize * optionSize;

                if(player.hovered && !this.awaitingTarget) {
                    ctx.drawImage(this.attackButton, 1, 1, 30, 30, 
                        startX, startY,
                        spriteSize * optionSize, spriteSize * optionSize);

                    ctx.drawImage(this.defendButton, 1, 1, 30, 30, 
                        startX + spriteSize * optionSize, startY,
                        spriteSize * optionSize, spriteSize * optionSize);

                    ctx.drawImage(this.specialButton, 1, 1, 30, 30, 
                        startX + spriteSize * optionSize * 2, startY,
                        spriteSize * optionSize, spriteSize * optionSize);
                }
                const pointerSize = spriteSize * 2/5;
                
                
                // 15, 9, 7, 7 for pointer
                // 0, 0, 5, 5 for playerReady
                if(player.actions != 0) 
                    ctx.drawImage(this.playerReady, 0, 0, 5, 5, player.startX + spriteSize, 
                    player.startY - pointerSize, pointerSize, pointerSize);
            });

            const handleMouseMove = (e, targetType) => {
                console.log("handleMouseMove active: ", this.id);
                const rect = ctx.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const pointerSize = 2/5 * spriteSize;

                if(targetType == 1){
                    this.enemies.forEach((enemy) => {
                        if (mouseX >= enemy.startX && 
                            mouseX <= enemy.startX + spriteSize && 
                            mouseY >= enemy.startY && 
                            mouseY <= enemy.startY + spriteSize) {
                                
                            ctx.drawImage(this.targetPointer,
                                    0, 0, 7, 7, enemy.startX - pointerSize,  enemy.startY - pointerSize,
                                    pointerSize, pointerSize);
                        } else {

                            this.removeStackingFrames(enemy.startX - pointerSize, enemy.startY - pointerSize,
                                pointerSize, pointerSize
                            );
                        }
                    });
                } else if(targetType == 2) {
                    this.players.forEach((player) => {
                        if (mouseX >= player.startX && 
                            mouseX <= player.startX + spriteSize && 
                            mouseY >= player.startY && 
                            mouseY <= player.startY + spriteSize) {
                                
                            ctx.drawImage(this.targetPointer,
                                    0, 0, 7, 7, player.startX - pointerSize, player.startY - pointerSize,
                                    pointerSize, pointerSize);
                        } else {

                            this.removeStackingFrames(player.startX - pointerSize, player.startY - pointerSize,
                                pointerSize, pointerSize
                            );
                        }
                    });
                }
            };
            /** Add target type: 1 = enemy, 2 = ally */
            const handleTargetClick = (e, targetter, targetType) => { 
                console.log("handleTargetClick active: ", this.id);
                if (!this.awaitingTarget) return; // Prevent incorrect targeting
            
                const rect = ctx.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
            
                let clickedTarget = null; // Store the enemy being clicked
                
            
                if(targetType == 1) {
                    this.enemies.forEach((enemy) => {
                        if (x >= enemy.startX && 
                            x <= enemy.startX + spriteSize && 
                            y >= enemy.startY && 
                            y <= enemy.startY + spriteSize) {
                            clickedTarget = enemy;
                        }
                    });
                } else if(targetType == 2) {
                    this.players.forEach((player) => {
                        if (x >= player.startX && 
                            x <= player.startX + spriteSize && 
                            y >= player.startY && 
                            y <= player.startY + spriteSize) {
                            clickedTarget = player;
                        }
                    });
                } else {
                    console.error("Invalid target type");
                }
            
                if (clickedTarget) {
                    console.log("Player", targetter.name, "chose to target", clickedTarget.name);
                    targetter.createdTurn.target = clickedTarget;
            
                    targetter.hovered = false; // Reset hovered state
                    this.awaitingTarget = false; // Reset target selection state

                    this.removeTargetListener(); // Remove the target listener
                    this.removeMouseListener();

                    ctx.canvas.removeEventListener("mousemove", handleMouseMove);
                    console.log("Target selected, mouse tracking removed.");

                    targetter.actions = targetter.queueActions;
                    targetter.queueActions = 0;

                    this.redraw(ctx);
                }
            };
            
            const handlePointerClick = (e) => { // click for options
                console.log("handlePointerClick active: ", this.id);
                if (!this.awaiting() || this.awaitingTarget) return;
            
                const rect = ctx.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
            
                let clickedPlayer = null; // Store the player being clicked
            
                this.players.forEach((player) => {
                    const startX = player.startX + spriteSize + spriteSize / 2 * optionSize;
                    const startY = player.startY + spriteSize / 2 - spriteSize * optionSize;
            
                    if (player.hovered) {
                        // const startX = player.startX + spriteSize + spriteSize / 2 * optionSize;
                        // const startY = player.startY + spriteSize/2 - spriteSize * optionSize;

                        // if(player.hovered && !this.awaitingTarget) {
                        //     ctx.drawImage(this.attackButton, 1, 1, 30, 30, 
                        //         startX, startY,
                        //         spriteSize * optionSize, spriteSize * optionSize);
        
                        //     ctx.drawImage(this.defendButton, 1, 1, 30, 30, 
                        //         startX + spriteSize * optionSize, startY,
                        //         spriteSize * optionSize, spriteSize * optionSize);
        
                        //     ctx.drawImage(this.specialButton, 1, 1, 30, 30, 
                        //         startX + spriteSize * optionSize * 2, startY,
                        //         spriteSize * optionSize, spriteSize * optionSize);
                        // }
                        if (x >= startX && x <= startX + spriteSize * optionSize 
                            && y >= startY && y <= startY + spriteSize * optionSize) {
                            player.queueActions = 1; // Attack
                            
                            console.log("Waiting for target selection...");
                            
                            this.awaitingTarget = true; // Set flag to indicate target selection is needed

                            // Bind the function with the specific player so we know who is attacking
                            const boundHandleTargetClick = (event) => handleTargetClick(event, player, 1);

                            // Add event listener for selecting a target
                            ctx.canvas.addEventListener("click", boundHandleTargetClick);

                            // Remove event listener once the target is chosen
                            this.removeTargetListener = () => {
                                ctx.canvas.removeEventListener("click", boundHandleTargetClick);
                                this.awaitingTarget = false; // Reset target selection state
                            };


                            const mouseMoveForAttack = (event) => handleMouseMove(event, 1);
                            ctx.canvas.addEventListener("mousemove", mouseMoveForAttack);

                            this.removeMouseListener = () => {
                                ctx.canvas.removeEventListener("mousemove", mouseMoveForAttack);
                            }

                        } else if (x >= startX + spriteSize * optionSize 
                            && x <= startX + spriteSize * optionSize * 2 
                            && y >= startY && y <= startY + spriteSize * optionSize) {
                            player.actions = 2; // Defend
                        } else if (x >= startX + spriteSize * optionSize * 2 
                            && x <= startX + spriteSize * optionSize * 3 
                            && y >= startY && y <= startY + spriteSize * optionSize) {
                            player.queueActions = 3; // Special
                            switch(player.special.target) {
                                case "self":
                                    player.createdTurn.target = player;
                                    break;
                                case "ally":
                                    this.awaitingTarget = true; // Set flag to indicate target selection is needed

                                    // Bind the function with the specific player so we know who is attacking
                                    const boundedHandleTargetClick = (event) => handleTargetClick(event, player, 2);

                                    // Add event listener for selecting a target
                                    ctx.canvas.addEventListener("click", boundedHandleTargetClick);

                                    // Remove event listener once the target is chosen
                                    this.removeTargetListener = () => {
                                        ctx.canvas.removeEventListener("click", boundedHandleTargetClick);
                                        this.awaitingTarget = false; // Reset target selection state
                                    };


                                    const mouseMoveForHeal = (event) => handleMouseMove(event, 2);
                                    ctx.canvas.addEventListener("mousemove", mouseMoveForHeal);

                                    this.removeMouseListener = () => {
                                        ctx.canvas.removeEventListener("mousemove", mouseMoveForHeal);
                                    }
                                    break;
                                case "allies":
                                    player.createdTurn.target = this.players;
                                    break;
                                case "enemy":
                                    this.awaitingTarget = true; // Set flag to indicate target selection is needed

                                    // Bind the function with the specific player so we know who is attacking
                                    const boundHandleTargetClick = (event) => handleTargetClick(event, player, 1);

                                    // Add event listener for selecting a target
                                    ctx.canvas.addEventListener("click", boundHandleTargetClick);

                                    // Remove event listener once the target is chosen
                                    this.removeTargetListener = () => {
                                        ctx.canvas.removeEventListener("click", boundHandleTargetClick);
                                        this.awaitingTarget = false; // Reset target selection state
                                    };


                                    const mouseMoveForAttack = (event) => handleMouseMove(event, 1);
                                    ctx.canvas.addEventListener("mousemove", mouseMoveForAttack);

                                    this.removeMouseListener = () => {
                                        ctx.canvas.removeEventListener("mousemove", mouseMoveForAttack);
                                    }
                                    break;
                                case "enemies":
                                    player.createdTurn.target = this.enemies;
                                    break;
                                default:
                                    break;
                            }
                        }

                        if(x >= startX && x <= startX + spriteSize * optionSize * 3 && 
                            y >= startY && y <= startY + spriteSize * optionSize) {
                            clickedPlayer = player;
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
            
            this.handlePointerClick = handlePointerClick;
            ctx.canvas.addEventListener("click", handlePointerClick);
            this.eventListener.push(this.handlePointerClick);
            
            // this.button (26, 10)
            if(this.players.filter(player => player.actions == 0).length <= 0 && !this.awaitingTarget) {

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

                            if(!this.buttonPressed) {
                                this.createTurn(); // construct the turn[]
                                console.log("Clicked on Button, X:", e.clientX, "Y:", e.clientY);
                                this.players.forEach(player => {
                                });
                            
                                // Properly remove the event listener
                                ctx.canvas.removeEventListener("click", handleTurnClick);

                                this.redraw(ctx);
                                this.buttonPressed = true;
                                return;
                            }
                        }
                    };
                    
                    this.handleTurnClick = handleTurnClick;
                    // Add event listener using the function reference
                    ctx.canvas.addEventListener("click", handleTurnClick);
                    this.eventListener.push(this.handleTurnClick);
                
            }
        }
        else if(this.actions == 2) { // drawing actions for turn
            //move forward and animate
            const currChar = this.turn[0].caster;
            if(currChar.hp <= 0) {
                this.turn.shift();
                return;
            }
            // ctx.drawImage(player.drawAsset, inputSprite, 0, inputSprite, inputSprite, 
            //     startX, startY, spriteSize, spriteSize);
            const updateChar = () => {
                currChar.currentFrame = currChar.currentFrame >= currChar.frames - 1 ? 0 : currChar.currentFrame+1;
                let removeStartX = currChar.granny ? currChar.startX : currChar.startX - spriteSize;
                this.removeStackingFrames(removeStartX, currChar.startY, spriteSize * 2, spriteSize);


                ctx.drawImage(currChar.drawAsset, currChar.currentFrame * inputSprite,
                    0, inputSprite, inputSprite,
                    currChar.startX + (currChar.granny ? this.turn[0].moveX : -this.turn[0].moveX),
                    currChar.startY, spriteSize, spriteSize);
            }
            if(this.turn[0].ticker % 4 == 0 && !this.turn[0].complete) { // janky way of limiting drawFrames
                if(this.dialogue == null) {
                    this.dialogue = this.turn[0].actionDetail;


                    let textWidth = ctx.measureText(this.dialogue).width;
                    this.textHeight = 22; //22px for font above
                    const startY = this.game.height - spriteSize / (4/3);

                    ctx.fillStyle = "black";
                    ctx.fillRect(this.game.width / 4 + spriteSize, 
                        startY, 
                        textWidth, this.textHeight);

                    ctx.fillStyle = "white";
                    const textY = this.game.height - spriteSize / (4/3) + this.textHeight / 2;
                    ctx.fillText(this.dialogue, this.game.width / 4 + spriteSize, 
                        startY + this.textHeight / (4/3));
                }
                if(this.turn[0].movedX > 0){
                    updateChar();

                    this.turn[0].moveX += spriteSize / 12;
                    this.turn[0].movedX --;
                }
                else if(this.turn[0].movedX == 0){ //execute moves
                    if(Math.round(this.turn[0].moveX) == 100) {
                        updateChar();

                        ctx.save();
                            ctx.globalAlpha = 0.75; // 50% transparency
                            let image = null;
                            switch (this.turn[0].actions) {
                                case 1:
                                    image = this.attackTransparent;
                                    break;
                                case 2:
                                    image = this.defendTransparent;
                                    break;
                                case 3:
                                    image = this.specialTransparent;
                                    break;
                                default: 
                                    break;
                            }
                        ctx.drawImage(image, currChar.startX +
                                (currChar.granny ? this.turn[0].moveX : -this.turn[0].moveX), 
                                currChar.startY, spriteSize, spriteSize);
                        ctx.restore();
                    }


                        // player.createdTurn = {
                        //     caster: player
                        //     target: null, // done for atk
                        //     updateHp: null,
                        //     actions: 0,
                        //     buff: null,
                        //     actionDetail: "" // construct string for actionDetail
                        // }
                    if(currChar.actions == 1) {
                        if(this.turn[0].target.hp <= 0) {
                            if(this.enemies.length > 0) {
                                this.turn[0].target = this.enemies[0];
                            }
                            else return;
                        }
                        this.turn[0].target.hp -= this.turn[0].target.isDefending > 0 ? 
                            (currChar.attack - this.turn[0].target.defense <= 0 ? 
                                0 : currChar.attack - this.turn[0].target.defense) 
                            : currChar.attack;
                        currChar.isDefending = false;
                    } else if(currChar.actions == 2){
                        currChar.isDefending = true;
                    } else if(currChar.actions == 3){

                    }

                    currChar.actions = 0;
                    this.trackFrames = this.trackFrames ? this.trackFrames + 1 : 1;
                    if(this.trackFrames >= 8) {
                        if(Math.round(this.turn[0].moveX) == 100) this.updateHp(this.turn[0].target, 
                            this.turn[0].caster, ctx);
                        if(this.turn[0].moveX > 0){

                            updateChar();
                            this.turn[0].moveX -= spriteSize / 12;

                        }
                        else{
                            updateChar();
                            this.trackFrames = 0;
                            this.turn[0].complete = true;
                        }
                    }

                    // ticker for scrollingPane: 24?
                    // scrolling pane too disctracting.
                    // if(this.turn[0].actionDetail != null) {
                    //     this.scrollingPane.string = this.turn[0].actionDetail;
                    //     this.turn[0].actionDetail = null;
                    //     this.scrollingPane.ticker = 24;
                    //     this.scrollingPane.update = () => {
                    //         this.scrollingPane.ticker =
                    //             (this.scrollingPane.ticker == 0 ? 0 :
                    //                 this.scrollingPane.ticker - 1
                    //             );
                    //     }
                    //     this.scrollingPane.draw = () => {
                    //         ctx.font = "18px serif";

                    //         let textWidth = ctx.measureText(this.scrollingPane.string).width;
                    //         let textHeight = 18; //18px for font above
                    //         const startY = this.game.height - spriteSize / (4/3);

                    //         ctx.fillStyle = "black";
                    //         ctx.fillRect(this.game.width / 4 + spriteSize, 
                    //             startY, 
                    //             textWidth, textHeight);

                    //         ctx.fillStyle = "white";
                    //         const textY = this.game.height - spriteSize / (4/3) + textHeight / 2;
                    //         ctx.fillText(this.scrollingPane.string, this.game.width / 4 + spriteSize +
                    //             textWidth - 2 * textWidth * (24-this.scrollingPane.ticker) /24, 
                    //             startY + textHeight / (4/3));

                    //             this.removeStackingFrames(this.game.width / 4 + spriteSize + textWidth, 
                    //                 startY, this.game.width, textHeight);
                    //             this.removeStackingFrames(0, startY, 
                    //                 this.game.width / 4 + spriteSize, textHeight);
                    //     }
                        
                    // }
                    // this.scrollingPane.update();
                    // this.scrollingPane.draw();
                } else{ // maybe work with negative movedX to move it back
                }
            } else if(this.turn[0].movedX <= 0){

            }
            this.turn[0].ticker++;

            if(this.turn[0].complete) {
                const caster = this.turn[0].caster;
                if(caster.granny) {
                    caster.hovered = true;
                    caster.actions = 0;
                } 
                if(this.enemies.length <= 0) {
                    this.endGame();
                    return;
                }
                this.removeStackingFrames(0, this.game.height - spriteSize / (4/3),
                    this.game.width, this.textHeight);
                this.dialogue = null;
                this.turn.shift();
                
               
                // return to selecting moves
                if(this.turn.length <= 0) {
                    console.log("Turn is complete!");
                    this.players.forEach(player => {
                        player.hovered = true;
                        player.isDefending = false;
                    });
                    
                    this.enemies.forEach((enemy) => {
                        enemy.isDefending = false;
                    });
                    this.buttonPressed = false;
                    this.actions --;
                }
            }
        }
        
        /*
        padding top and bottom = 100;
        gui height = 300;
        */

        //Draw the GUI elements
    }

    // this.updateDialogue(this.turn[0].caster, this.turn[0].target, this.turn[0].actions);
    updateDialogue(caster, target, actions, turn){
        switch(actions) {
            case 1: //attack
                turn.actionDetail =  caster.name + " heals " + target.name + "'s heart" + 
                " for " +  caster.attack + " points!";
                break;
            case 3: // special
                break;
            default:
                break;
        }
    }
    createTurn(){
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
            // player.createdTurn = {
                // caster: player
                // target: null, // done for atk
                // updateHp: null,
                // actions: 0,
                // buff: null,
                // actionDetail: "" // construct string for actionDetail
            // }

        // See what is targetable
        // store turn detail as an object
        this.players.forEach(player => {
            // PLACEHOLDER FOR ACTION TEXT, EACH CHARACTER SHOULD CREATE THEIR OWN ACTION TEXT 
            if(player.actions == 1){
                player.createdTurn.actionDetail = player.name + " heals " + player.createdTurn.target.name + " heart" +
                    " for " +  player.attack + " points!";
                // console.log(player.name, " | target: ", player.createdTurn.target.name)
                // console.log(player.name, " attacks ", player.createdTurn.target.name, " for "
                //     , player.attack, " damage");
                player.createdTurn.actions = 1;
            }
            else if(player.actions == 2){
                player.createdTurn.actionDetail = 
                    player.name + " chose to defend with " + player.defense + " shield!";
                    player.createdTurn.actions = 2;
                    player.createdTurn.target = player;
            } else if(player.actions == 3){
                player.createdTurn.actionDetail = 
                    player.name + " chose to use their special move!";
                    player.createdTurn.actions = 3;
            }
            player.createdTurn.actions = player.actions;
            console.log(player.createdTurn.actionDetail);
            
            this.turn.push(player.createdTurn);
        });
        this.enemies.forEach((enemy) => {
            enemy.createdTurn = {
                ticker: 0,
                caster: enemy,
                target: null, // done for atk
                updateHp: null,
                actions: 0,
                buff: null,
                actionDetail: "" // construct string for actionDetail
            };
            const randomNum = Math.random();
            if(randomNum <= enemy.attackRate) {
                enemy.actions = 1;
                enemy.createdTurn.target = this.players[this.getRandomInt(this.players.length)];
                enemy.createdTurn.actionDetail = 
                    enemy.name + " attacks " + enemy.createdTurn.target.name +
                    " for " +  enemy.attack + " damage!";
            } else if(randomNum <= enemy.attackRate + enemy.defendRate){
                enemy.actions = 2;
                enemy.createdTurn.target = enemy;
                enemy.createdTurn.actionDetail = 
                    enemy.name + " chose to defend with " + enemy.defense + " shield!";
            } else {
                enemy.actions = 3;
            }
            enemy.createdTurn.actions = enemy.actions;
            this.turn.push(enemy.createdTurn);
        });
        this.turn.forEach(curr => {
            curr.moveX = 0;
            curr.movedX = 12;
            curr.complete = false;
        });
        this.actions++;
        console.log(this.turn);
        return;
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    /** From ChatGPT */
    getBouncyAnimationFrame(startX, startY, endX, endY, frames) {
        let positions = [];
    
        for (let i = 0; i <= frames; i++) {
            let progress = i / frames; // Normalize progress (0 to 1)
    
            // Easing function for a bouncy effect (ease-in, speed up, ease-out)
            let bounceEffect = this.easeInOutQuad(progress);
    
            // Calculate new positions
            let currentX = startX + (endX - startX) * bounceEffect;
            let currentY = startY + (endY - startY) * bounceEffect;
    
            positions.push({ x: currentX, y: currentY });
        }
    
        return positions;
    }
    endGame() {
        this.eventListener.forEach((event) => {
            this.game.ctx.canvas.removeEventListener("click", event);
        })
        console.log(this.eventListener);
        this.game.entities = [];
        this.game.ctx.fillStyle = "white"; 
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.sceneManager.restoreScene();
    }
    // Quadratic easing function (ease-in-out for bouncy effect)
    /** From ChatGPT */
    removeAllEventListeners() {
        const oldCanvas = this.game.ctx.canvas;
        const newCanvas = oldCanvas.cloneNode(true);
        oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
        this.game.ctx = newCanvas.getContext("2d");
    }
}