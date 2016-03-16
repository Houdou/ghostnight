var States = require('./Statics/States')
var GameObject = require('./GameObject');

var GM = require('./GameMaster');

// Class GameUnit : GameObject
// variables
var GameUnit = function(name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value) {
    GameObject.call(this, name, tag, x, y);
    this.joint = joint;
    this.hp = hp;
    this.atk = atk;
    this.range = range;
    this.rate = rate;
    this.def = def;
    this.spd = spd;
    this.layer = layer;
    this.price = price;
    this.value = value;
    this.state = States.normal;
    this.id = GM.assignUnitID();
    
    this.isAttacking = false;
    this.attackInterval = null;
}
GameUnit.prototype = new GameObject();
// functions
GameUnit.prototype.DealDamage = function(dmg) {
    if(this.hp < dmg) {
        this.hp = 0;
        
        console.log(this.name + " is dead.");
    } else {
        this.hp -= dmg;
    }
}
GameUnit.prototype.Attack = function() {
    var self = this;
    
    this.isAttacking = true;
    
    // Attack time interval
    this.attackInterval = setInterval(function(){
        // Different classes will have different implementation of requrieTarget
        var target = self.requireTarget();
        
        if (target != null) {
            // Minimal damage can be set in GameMaster
            var dmg = Math.max(self.atk - target.def, GM.settings.MinDamage);
            target.DealDamage(dmg);
            
            //DEBUG
            console.log(self.name + " attack " + target.name);
            console.log("Deal " + dmg + " damage");
            //DEBUG
            
            // Set the next attack time
            //self.nextAtkTime = (new Date()).getTime() + 1000 / self.rate;
        } else {
            clearInterval(self.attackInterval);
            self.isAttacking = false;
        }
        
    }, 1000 / this.rate);
}
GameUnit.prototype.requireTarget = function() {
    // This is a abstract method to be override by the child class.
    console.log("Invalid call of abstract method requireTarget()");
    return null;
}

module.exports = GameUnit;