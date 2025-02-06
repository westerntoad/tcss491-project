class Character {
    constructor(name, hp, attack, defense, speed, level, exp, attackType) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.level = level;
        this.exp = exp;
        this.attackType = attackType;
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
            if (this.level == 1 && this.exp >= 5) {
                this.level++;
                this.attack += 4;
                this.defense += 3;
                this.hp += 5;
            } if (this.level == 2 && this.exp >= 8) {
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
            } if (this.level == 3 && this.exp >= 11) {
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
            } if (this.level == 4 && this.exp >= 14) {
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
            } if (this.level == 6 && this.exp >= 23) {
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
            } if (this.level == 7 && this.exp >= 26) {
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
            } if (this.level == 8 && this.exp >= 29) {
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
            } if (this.level == 9 && this.exp >= 32) {
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
             if (this.level == 5 && this.exp >= 20) {
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
