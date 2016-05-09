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
    // Convert (s) into (ms)
    duration *= 1000;
    
    if(this[property] != undefined) {
        // Multiply the value
        this[property] *= multiplier;
        // Notice client
        this.GM.GEM.emit(Tags[this.tag] + '-buff',
            {id: this.id, tag: Tags[this.tag], type: (multiplier >= 1 ? 'buff' : 'nerf'), property: property, duration: duration});
        // Log
        this.GM.LogBuff(this, property, multiplier);
        // Restore the value
        setTimeout(() => {
            this[property] /= multiplier;
            this.GM.LogBuff(this, property, 1 / multiplier);
        }, duration);
    } else {
        console.log("Wrong property type");
    }
}
GameUnit.prototype.Buff = GameUnit.prototype.Nerf;
GameUnit.prototype.setState = function(from, addState, duration) {
    // Check if the unit is already in that state
    if((this.state & addState) != 0) { return false; }
    
    // Convert (s) into (ms)
    duration *= 1000;
    
    // Set interval to handle the states
    this.stateUpdateInterval = setInterval(() => {
        if(this.state == States.normal || this.isDead) {
            clearInterval(this.stateUpdateInterval);
        } else {
            // On fire
            if((this.state & States.fire) != 0) {
                var dmg = Math.max(this.hp * 0.05 + 50, this.GM.settings.MinDamage);
                this.DealDamage(from, dmg);
            }
            // Paralyzed
            if((this.state & States.paralyzed) != 0) {
                // Nothing to do now
            }
        }
    }, 500);
    
    // Mark the state
    this.state |= addState;
    
    // Notice the client
    this.GM.GEM.emit(Tags[this.tag] + '-state', {id: this.id, tag: Tags[this.tag], state: States[addState]});
    
    // Set recovery delay
    setTimeout(() => {
        this.state &= ~addState;
    }, duration + 200);
    
    return true;
}
GameUnit.prototype.Attack = function() {
    // Prevent bursting attack
    if(this.rate <= 0) { return };
    
    this.isAttacking = true;
    
    // Attack time interval
    this.attackInterval = setInterval(() => {
        // Cannot attack under paralyzed state
        if((this.state & States.paralyzed) != 0) { return; }
        // Different classes will have different implementation of RequrieTarget
        var target = this.RequireTarget();
        
        if (target != null && !this.isDead) {
            // Minimal damage can be set in GameMaster
            var dmg = Math.max(this.atk - target.def, this.GM.settings.MinDamage);
            target.DealDamage(this, dmg);
            // Callback interface for unit feature
            if(this.didAttackedTarget) { this.didAttackedTarget(target, dmg); }
        } else {
            // Stop attacking
            clearInterval(this.attackInterval);
            this.isAttacking = false;
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
        this.GM.GEM.emit(Tags[this.tag] + '-hp-update', {id: this.id, tag: Tags[this.tag], hp: this.hp, maxhp: this.maxhp, dmg: dmg, type: 'damage'});
        this.GM.LogDamage(from, this, dmg);
        
        // The target is still alive
        return false;
    }
}
GameUnit.prototype.Heal = function(from, healhp) {
    // Limit the max hp
    if(this.maxhp < this.hp + healhp) {
        this.hp = this.maxhp;
        this.GM.GEM.emit(Tags[this.tag] + '-hp-update', {id: this.id, tag: Tags[this.tag], hp: this.hp, maxhp: this.maxhp, dmg: -healhp, type: 'heal'});
    } else {
        this.hp += healhp;
        console.log(this.name + " heals " + healhp);
        this.GM.GEM.emit(Tags[this.tag] + '-hp-update', {id: this.id, tag: Tags[this.tag], hp: this.hp, maxhp: this.maxhp, dmg: -healhp, type: 'heal'});
    }
    
}
GameUnit.prototype.Dead = function(killedBy) {
    // This is an abstract method to be override by the child class.
    console.log("Invalid call of abstract method Dead()");
    return null;
}


module.exports = GameUnit;