var States = require('./Statics/States');
var GameObject = require('./GameObject');

// Class GameUnit : GameObject
// variables
var GameUnit = function(name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameObject.call(this, name, tag, x, y, GM);
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
    this.id = id;
    
    this.isAttacking = false;
    this.attackInterval = null;
}
GameUnit.prototype = new GameObject();
// functions
GameUnit.prototype.Attack = function() {
    var that = this;
    
    this.isAttacking = true;
    
    // Attack time interval
    this.attackInterval = setInterval(function(){
        // Different classes will have different implementation of requrieTarget
        var target = that.requireTarget();
        
        if (target != null) {
            // Minimal damage can be set in GameMaster
            var dmg = Math.max(that.atk - target.def, this.GM.settings.MinDamage);
            target.DealDamage(that, dmg);
            
            //DEBUG
            console.log(that.name + " attack " + target.name);
            console.log("Deal " + dmg + " damage");
            //DEBUG
            
            // Set the next attack time
            //that.nextAtkTime = (new Date()).getTime() + 1000 / that.rate;
        } else {
            clearInterval(that.attackInterval);
            that.isAttacking = false;
        }
        
    }, 1000 / this.rate);
}
GameUnit.prototype.requireTarget = function() {
    // This is an abstract method to be override by the child class.
    console.log("Invalid call of abstract method requireTarget()");
    return null;
}
GameUnit.prototype.DealDamage = function(from, dmg) {
    if(this.hp < dmg) {
        this.hp = 0;
        
        this.Dead(from);
        console.log(this.name + " is dead.");
        // The target is dead
        return true;
    } else {
        this.hp -= dmg;
        // The target is still alive
        return false;
    }
}
GameUnit.prototype.Dead = function(killedBy) {
    // This is an abstract method to be override by the child class.
    console.log("Invalid call of abstract method Dead()");
    return null;
}


module.exports = GameUnit;