class Character {
    constructor(name, hp, attack, defense, speed) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
    }

    takeDamage(amount) {
        this.hp -= Math.max(0, amount - this.defense); // Reduce damage by defense
        console.log(`${this.name} takes ${amount} damage. HP: ${this.hp}`);
    }

    attackEnemy(enemy) {
        console.log(`${this.name} attacks ${enemy.name} for ${this.attack} damage!`);
        enemy.takeDamage(this.attack);
    }

    isDead() { // expand on it
        return hp <= 0;
    }
}
