const STAT_CAPS = {
    attack: 50,
    attackSpeed: 0.25,
    defense: 50,
    hp: 100
  };
class Character {
    constructor(name) {
        Object.assign(this, {name});
        //, hp, attack, defense, attackSpeed, moveSpeed, level, exp
        this.level = 1;
        this.exp = 0;
        /**
         * defense damage reduction forumule: "defense / defense + 50"
         * // -Luke, this is a ripped-off and oversimplified version from "The First Descendent"
         * // 100 defense will lead to 66% damage reduction.
         */
        this.defend = () =>{
            return (this.defense / this.defense + 50);
        }
        this.expReq = [2, 3, 4, 5, 7, 10, 13, 18, 25]; // using the expRequirement.
        /** Everytime we level up, we push to the levelStack.
         *  If we want to remove levels, we pop from the levelStack and look at
         *      the amount to decrement for each stat improved.
         *  Bottom of stack will contain "base" stats that are growing.
         */
        this.levelStack = [];
        const parsedName = name.replace(/\s+/g, "_");
        this.asset = `./assets/grandmas/${parsedName}.png`;

        this.init();
    }
    init(){
        /**if (this.name == "Mary Yott" || this.name == "Vera Mulberry" ||
            this.name == "Pearl Martinez" || this.name == "Ye-soon Kim" ||
            this.name == "Bernice Campbell") { */
        switch(this.name) {
            // Warrior (melee, balanced stats)
            case "Mary Yott":
                this.granny = true;
                this.hp = 100; // can just create maxHp when passing off to autoBattler
                this.attack = 1;
                this.attackRange = 1; // default val for melees
                this.defense = 0;
                this.attackSpeed = 0.2; // atk & moveSpd currently is x * 1000 ms.
                this.moveSpeed = 1; // so this is 1000ms.
                this.hpGrowth = 0.5; // specify the distribution rate
                this.attackGrowth = 0.5;
                this.hpCap = 50;
                this.attackCap = 25;
                break; // 50% hp, 50% atk
            // Ranged (paper thin Hp, high attackSpeed)
            case "Vera Mulberry":
                this.granny = true;
                this.hp = 1;
                this.attack = 1;
                this.attackRange = 3;
                this.defense = 0;
                this.attackSpeed = 0.75;
                this.moveSpeed = 1.25; // 1250ms
                this.hpGrowth = 0.25;
                this.attackGrowth = 0.25;
                this.attackSpeedGrowth = 0.5;
                this.hpCap = 25;
                this.attackCap = 50;
                this.attackSpeedCap = 0.25;
                break; // 25% hp, 50% atkSpeed, 25% atk 
            // Warrior (melee, high attack)
            case "Pearl Martinez":
                this.granny = true;
                this.hp = 2;
                this.attack = 2;
                this.attackRange = 1;
                this.defense = 0;
                this.attackSpeed = 1;
                this.moveSpeed = 0.95; // 950ms
                this.hpGrowth = 0.25;
                this.attackGrowth = 0.5;
                this.attackSpeedGrowth = 0.25;
                this.hpCap = 60;
                this.attackCap = 50;
                this.attackSpeedCap = 0.5;
                break; // 25% hp, 50% atk, 25% atkSpeed
            // Ranged (paper thin Hp, high attack)
            case "Ye-soon Kim":
                this.granny = true;
                this.hp = 1;
                this.attack = 2;
                this.attackRange = 3;
                this.defense = 0;
                this.attackSpeed = 1.5;
                this.moveSpeed = 1.25;
                this.hpGrowth = 0.25;
                this.attackGrowth = 0.50;
                this.attackSpeedGrowth = 0.25;
                this.hpCap = 25;
                this.attackCap = 100;
                this.attackSpeedCap = 0.5;
                break; // 25% hp, 50% atk, 25% atkSpeed
            // Tank (melee, high defensive). Actually has level-scaling defense.
            case "Bernice Campbell":
                this.granny = true;
                this.hp = 5;
                this.attack = 1;
                this.attackRange = 1;
                this.defense = 5;
                this.attackSpeed = 1.5;
                this.moveSpeed = 1.5;
                this.hpGrowth = 0.5;
                this.defenseGrowth = 0.5;
                this.hpCap = 100;
                this.defenseCap = 100;
                break;// 50% hp, 50% def
            default:
                break;
        }

        const expArray = [];
        for(let i = 1; i < 10; i++) { // can change to allow for levels over 10
            expArray.push(Math.round(this.expRequired(i)));
        }
        this.expReq = expArray;
        // figure out the levelStack logic here
        const base = {
            hpBase: this.hp,
            attackBase: (this.attackGrowth ? this.attack : null),
            attackSpeedBase: (this.attackSpeedGrowth ? this.attackSpeed : null),
            defenseBase: (this.defenseGrowth ? this.defense : null)
        };
        this.levelStack.push(base)// intial push to stack, maintains base stat
    }
    openParty(scene){
        //scene.game.ctx.drawImage
    }
    expRequired(level) { // I didn't make this -ya boi *wink* *wink* (chat, is this real?)
        const baseExp = 2;         
        const multiplier = 25 / 2;     
        const exponent = (level - 1) / 8;
        return baseExp * Math.pow(multiplier, exponent);
    }
    growth(level, base, cap, rawGrowth) {
        const intervals = 9; // Levels 1 to 10 have 9 intervals.
        // Normalize the growth so that a rawGrowth of 0.5 equals full (1.0) growth.
        const normalizedGrowth = rawGrowth / 0.5;
        return base + (cap - base) * ((level - 1) / intervals) * normalizedGrowth;
    }
    levelUp(exp){// GO GO GO GO
        if(this.level > 9 || exp < this.expReq[this.level - 1]) return 0; // can't, hehe
        const usedExp = this.expReq[this.level - 1];
        const currGrowth = {};
        if (this.hpGrowth) {
            const newHP = Math.round(this.growth(this.level + 1, this.levelStack[0].hpBase, this.hpCap, this.hpGrowth));
            currGrowth.hpIncrease = newHP - this.hp;
            this.hp = newHP;
          }
          if (this.attackGrowth) {
            const newAttack = Math.round(this.growth(this.level + 1, this.levelStack[0].attackBase, this.attackCap, this.attackGrowth));
            currGrowth.attackIncrease = newAttack - this.attack;
            this.attack = newAttack;
          }
          if (this.attackSpeedGrowth) {
            // For fractional stats, you might want to round to a few decimal places.
            const newAttackSpeed = Math.round(this.growth(this.level + 1, this.levelStack[0].attackSpeedBase, this.attackSpeedCap, this.attackSpeedGrowth) * 1000) / 1000;
            currGrowth.attackSpeedIncrease = newAttackSpeed - this.attackSpeed;
            this.attackSpeed = newAttackSpeed;
          }
          if (this.defenseGrowth) {
            const newDefense = Math.round(this.growth(this.level + 1, this.levelStack[0].defenseBase, this.defenseCap, this.defenseGrowth));
            currGrowth.defenseIncrease = newDefense - this.defense;
            this.defense = newDefense;
          }
        this.levelStack.push(currGrowth);
        this.level++;
        return usedExp;
    }
    levelDown(){// GO BACK GO BACK *skrrt*
        if(this.levelStack.length < 2 || this.level < 2) return 0; //cannot, oh hi mark
        const curr = this.levelStack.pop();
        if(curr.hpIncrease) {
            this.hp -= curr.hpIncrease;
        }
        if(curr.attackIncrease) {
            this.attack -= curr.attackIncrease;
        }
        if(curr.attackSpeedIncrease) {
            this.attackSpeed -= curr.attackSpeedIncrease;
        }
        if(curr.defenseIncrease) {
            this.defense -= curr.defenseIncrease;
        }
        this.level--;
        return this.expReq[this.level - 1]; // should return the exp.
    }

    takeDamage(amount) {
        this.hp -= Math.max(0, amount - this.defense); // Reduce damage by defense
        console.log(`${this.name} takes ${amount} damage. HP: ${this.hp}`);
    }

    attackEnemy(enemy) {
        //console.log(`${this.name} attacks ${enemy.name} for ${this.attack} damage!`);
        //enemy.takeDamage(this.attack);
        if (this.attackType == "Splash") {

        } if (this.attackType == "Single") {
            console.log(`${this.name} attacks ${enemy.name} for ${this.attack} damage!`);
            enemy.takeDamage(this.attack);
        } if (this.attackType == "Spread") {

        }
    }

    blockedAttack(enemy) {
        console.log(`${this.name} blocked ${enemy.name}'s attack! ${this.name} took 0 damage!`);
    }

    isDead() { // expand on it
        if (this.hp == 0) {
            return hp <= 0;
        }
    }

    increaseCharacterExp(expAmount) {
        //Add Skill Allocation
        points = expAmount;
        this.exp += points;
    }

    characterLevel() {
        if (this.name == "Mary Yott" || this.name == "Vera Mulberry" ||
            this.name == "Pearl Martinez" || this.name == "Ye-soon Kim" ||
            this.name == "Bernice Campbell") {
            if (this.level == 1 && this.exp >= 2) {
                this.level++;
                this.attack += 4;
                this.defense += 3;
                this.hp += 5;
            } if (this.level == 2 && this.exp >= 4) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.attack += 2;
                    this.defense += 1;
                } if (this.name == "Vera Mulberry") {
                    this.defense += 3;
                } if (this.name == "Pearl Martinez") {
                    this.attack += 3;
                } if (this.name == "Ye-soon Kim") {
                    this.hp += 5;
                } if (this.name == "Bernice Campbell") {
                    this.defense += 2;
                    this.hp += 3;
                }
            } if (this.level == 3 && this.exp >= 7) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.attack += 4;
                    this.hp += 10;
                } if (this.name == "Vera Mulberry") {
                    this.defense += 2;
                } if (this.name == "Pearl Martinez") {
                    this.attack += 4;
                } if (this.name == "Ye-soon Kim") {
                    this.hp += 7;
                } if (this.name == "Bernice Campbell") {
                    this.defense += 4;
                    this.hp += 5;
                }
            } if (this.level == 4 && this.exp >= 11) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.attack += 4;
                    this.hp += 10;
                } if (this.name == "Vera Mulberry") {
                    this.defense += 2;
                } if (this.name == "Pearl Martinez") {
                    this.attack += 4;
                } if (this.name == "Ye-soon Kim") {
                    this.hp += 7;
                } if (this.name == "Bernice Campbell") {
                    this.defense += 4;
                    this.hp += 5;
                }
            } if (this.level == 6 && this.exp >= 15) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.defense += 4;
                    this.hp += 10;
                } if (this.name == "Vera Mulberry") {
                    this.attack += 2;
                } if (this.name == "Pearl Martinez") {
                    this.defense += 4;
                } if (this.name == "Ye-soon Kim") {
                    this.defense += 7;
                } if (this.name == "Bernice Campbell") {
                    this.attack += 4;
                    this.hp += 5;
                }
            } if (this.level == 7 && this.exp >= 20) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.attack += 4;
                    this.hp += 10;
                } if (this.name == "Vera Mulberry") {
                    this.defense += 2;
                } if (this.name == "Pearl Martinez") {
                    this.attack += 4;
                } if (this.name == "Ye-soon Kim") {
                    this.hp += 7;
                } if (this.name == "Bernice Campbell") {
                    this.defense += 4;
                    this.hp += 5;
                }
            } if (this.level == 8 && this.exp >= 27) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.attack += 4;
                    this.hp += 10;
                } if (this.name == "Vera Mulberry") {
                    this.defense += 2;
                } if (this.name == "Pearl Martinez") {
                    this.attack += 4;
                } if (this.name == "Ye-soon Kim") {
                    this.hp += 7;
                } if (this.name == "Bernice Campbell") {
                    this.defense += 4;
                    this.hp += 5;
                }
            } if (this.level == 9 && this.exp >= 35) {
                this.level++;
                this.attack += 2;
                this.defense += 2;
                this.hp += 5;
                if (this.name == "Mary Yott") {
                    this.attack += 4;
                    this.hp += 10;
                } if (this.name == "Vera Mulberry") {
                    this.defense += 2;
                } if (this.name == "Pearl Martinez") {
                    this.attack += 4;
                } if (this.name == "Ye-soon Kim") {
                    this.hp += 7;
                } if (this.name == "Bernice Campbell") {
                    this.defense += 4;
                    this.hp += 5;
                }
            }
             if (this.level == 5 && this.exp >= 50) {
                this.level++;
                this.attack += 4;
                this.defense += 3;
                this.hp += 5;
                //Code for the individual skills
                if (this.name == "Mary Yott") {

                } if (this.name == "Vera Mulberry") {

                } if (this.name == "Pearl Martinez") {

                } if (this.name == "Ye-soon Kim") {

                } if (this.name == "Bernice Campbell") {

                }
            } if (this.level == 10 && this.exp >= 40) {
                this.level++;
                this.attack += 4;
                this.defense += 3;
                this.hp += 5;
                //Code for the individual skills
                if (this.name == "Mary Yott") {

                } if (this.name == "Vera Mulberry") {

                } if (this.name == "Pearl Martinez") {

                } if (this.name == "Ye-soon Kim") {

                } if (this.name == "Bernice Campbell") {
                    
                }
            }
        }
    }
}
