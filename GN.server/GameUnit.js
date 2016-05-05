var Tags = require('./Statics/Tags');
var States = require('./Statics/States');
var GameObject = require('./GameObject');

// Class GameUnit : GameObject
// variables
var GameUnit = function(name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameObject.call(this, name, tag, x, y, GM);
    this.joint = joint;
    this.hp = hp;
    this.maxhp = hp;
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
    this.attackInterval = -1;
    
    this.stateUpdateInterval = -1;
    
    this.isDead = false;
    this.canMove = false;
}
GameUnit.prototype = new GameObject();
// functions
GameUnit.prototype.Nerf = function(property, multiplier, duration){
    if((multiplier < 0) || (duration < 0)) {
        console.log("Nagative multiplier or duration setting");
        return false;
    }
    // Convert (ms) into (s)
    duration *= 1000;
    var that = this;
    
    // New Method
    if(this[property] != undefined) {
        this[property] *= multiplier;
        this.GM.LogBuff(that, property, multiplier);
        // Restore the value
        setTimeout(function(){
            that[property] /= multiplier;
            that.GM.LogBuff(that, property, 1 / multiplier);
        }, duration);
    } else { console.log("Wrong property type"); }
    
    // Back up
    // switch (property) {
    //     case 'atk':
    //         this.atk *= multiplier;
    //         setTimeout(function(){that.atk /= multiplier;}, duration);
    //         break;
    //     case 'def': 
    //         this.def *= multiplier;
    //         setTimeout(function(){that.def /= multiplier;}, duration);
    //         break;
    //     case 'range':
    //         this.range *= multiplier;
    //         setTimeout(function(){that.range /= multiplier;}, duration);
    //         break;
    //     case 'spd':
    //         this.spd *= multiplier;
    //         setTimeout(function(){that.spd /= multiplier;}, duration);
    //         break;
    //     case 'rate':
    //         this.rate *= multiplier;
    //         setTimeout(function(){that.rate /= multiplier;}, duration);
    //         break;
    //     case 'value':
    //         this.value *= multiplier;
    //         setTimeout(function(){that.value /= multiplier;}, duration);
    //         break;
    //     default: 
    //         console.log("Wrong property type");
    //         break;
    // }
}
GameUnit.prototype.Buff = GameUnit.prototype.Nerf;
GameUnit.prototype.setState = function(from, addState, duration) {
    // Check if the unit is already in that state
    if((this.state & addState) != 0) { return false; }
    
    var that = this;
    
    if(this.state == States.normal) {
        // Set interval to handle the states
        this.stateUpdateInterval = setInterval(function(){
            if(that.state == States.normal || that.isDead) {
                clearInterval(that.stateUpdateInterval);
            } else {
                // On fire
                if((that.state & States.fire) != 0) {
                    var dmg = Math.max(that.hp * 0.05, that.GM.settings.MinDamage);
                    console.log(that.name + " is on fire, and deal " + dmg);
                    that.DealDamage(from, dmg);
                }
                // Paralyzed
                if((that.state & States.paralyzed) != 0) {
                    // Nothing right now
                }
            }
        }, 500);
    }
    // Mark the state
    this.state |= addState;
    
    // Set recovery delay
    setTimeout(function(){
        that.state &= ~addState;
    }, duration);
    
    return true;
}
GameUnit.prototype.Attack = function() {
    // Prevent bursting attack
    if(this.rate <= 0) { return };
    
    var that = this;
    
    this.isAttacking = true;
    
    // Attack time interval
    this.attackInterval = setInterval(function(){
        // Cannot attack under paralyzed state
        if((that.state & States.paralyzed) != 0) { return; }
        // Different classes will have different implementation of RequrieTarget
        var target = that.RequireTarget();
        
        if (target != null && !that.isDead) {
            // Minimal damage can be set in GameMaster
            var dmg = Math.max(that.atk - target.def, that.GM.settings.MinDamage);
            // 'that' is refering to the attacker, not target (ry
            target.DealDamage(that, dmg);
            // Callback interface for unit feature
            if(that.didAttackedTarget) { that.didAttackedTarget(target, dmg); }
        } else {
            // Stop attacking
            clearInterval(that.attackInterval);
            that.isAttacking = false;
        }
        
    }, 1000 / this.rate);
}
GameUnit.prototype.RequireTarget = function() {
    // This is an abstract method to be override by the child class.
    console.log("Invalid call of abstract method RequireTarget()");
    return null;
}
GameUnit.prototype.DealDamage = function(from, dmg) {
    // DEBUG
    if(this.GM.debug)
        console.log(from.name + " attack " + this.name + " and deal " + dmg + " damage");
    // DEBUG
    
    if(this.hp < dmg) {
        dmg = this.hp;
        this.hp = 0;
        
        // DEBUG
        if(this.GM.debug)
            console.log(this.name + " now : " + this.hp + "/" + this.maxhp);
        // DEBUG
        
        this.GM.GEM.emit(Tags[from.tag] + '-attack', {source: from.name, target: this.name, from: from.transform, to: this.transform});
        this.GM.GEM.emit(Tags[this.tag] + '-dead', {id: this.id, dmg: dmg});
        this.GM.LogDamage(from, this, dmg);
        
        this.isDead = true;
        
        // Handle the death
        this.Dead(from);
        this.GM.LogDeath(this, from);
        console.log(this.name + " is dead.");
        // The target is dead
        return true;
    } else {
        this.hp -= dmg;
        
        // DEBUG
        if(this.GM.debug)
            console.log(this.name + " now : " + this.hp + "/" + this.maxhp);
        // DEBUG
        
        this.GM.GEM.emit(Tags[from.tag] + '-attack', {source: from.name, target: this.name, from: from.transform, to: this.transform});
        this.GM.GEM.emit(Tags[this.tag] + '-hp-update', {id: this.id, hp: this.hp, maxhp: this.maxhp, dmg: dmg});
        this.GM.LogDamage(from, this, dmg);
        
        // The target is still alive
        return false;
    }
}
GameUnit.prototype.Heal = function(from, healhp) {
    // Limit the max hp
    if(this.maxhp < this.hp + healhp) {
        this.hp = this.maxhp;
        this.GM.GEM.emit(Tags[this.tag] + '-hp-update', {id: this.id, hp: this.hp, maxhp: this.maxhp, dmg: -healhp});
    } else {
        this.hp += healhp;
        console.log(this.name + " heals " + healhp);
        this.GM.GEM.emit(Tags[this.tag] + '-hp-update', {id: this.id, hp: this.hp, maxhp: this.maxhp, dmg: -healhp});
    }
    
}
GameUnit.prototype.Dead = function(killedBy) {
    // This is an abstract method to be override by the child class.
    console.log("Invalid call of abstract method Dead()");
    return null;
}


module.exports = GameUnit;