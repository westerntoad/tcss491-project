class Card {
    constructor (name, statChange, tier, level, exp) {
        this.name = name;
        this.statChange = statChange;
        this.tier = tier;
        this.level = level;
        this.exp = exp;
    }

    cardLevel() {
        if (this.exp <= 10) {
            this.tier = "Bronze";
        }
        if (this.level == 1 && this.exp == 10) {
            this.level++;
            this.tier = "Silver";
        } if (this.level == 2 && this.exp == 20) {
            this.level++;
            this.tier = "Gold";
        }

    }

    increaseCardExp() {
        //Add Skill Allocation
    }

    ability() {
        if (this.name == "Soup") {
            if (this.level == 1) {
                Character.hp += 15;
            } if (this.level == 2) {
                Character.hp += 30;
            } if (this.level == 3) {
                Character.hp += 50;
            }
        } if (this.name == "Soap") {
            if (this.level == 1) {
                //Code for removing a debuff
            } if (this.level == 2) {
                //Code for removing two debuffs
            } if (this.level == 3) {
                //Code for removing all debuff
            }
        } if (this.name == "Sponge") {
            if (this.level == 1) {
                Character.defense += 5;
            } if (this.level == 2) {
                Character.defense += 10;
            } if (this.level == 3) {
                Character.defense += 15;
            }
        }
    }
}