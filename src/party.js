/**
 * Party will hold current party-> grandma objects.
 * Party will also bring up a gui that will allow upgrades to grandma objects.
 */
class Party {
    constructor(game) {
        Object.assign(this, {game});
        this.members = []; // Array to store party members
        this.maxSize = 7; // Maximum party size (can be adjusted)
        this.exp = 0; // keep track of total exp in the pot.
    }
    showParty(){
        // kick off the gui for the party.
        // show each grandmas and their stats.


        //this.game.ctx.drawImage
    }
    addMember(grandma){
        if(this.members.length < this.maxSize) this.members.push(grandma);
    }
}