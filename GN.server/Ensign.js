var Layers = require('./Statics/Layers');
var Tags = require('./Statics/Tags');
var GameUnit = require('./GameUnit');

var _Ensign = {
    hp: 1000, atk: 0, range: -1, rate: 0, def: 10, spd: 0, value: 30, layer: Layers.land
}

// Class Ensign : GameUnit
// variables
var Ensign = function(name, id, tag, x, y, joint, buffType, buffAreaRadius, buffDuration, price, GM) {
    GameUnit.call(this, name, id, Tags.ensign, x, y, joint, _Ensign.hp, _Ensign.atk, _Ensign.range,
    _Ensign.rate, _Ensign.def, _Ensign.spd, _Ensign.layer, price, _Ensign.value, GM);
    // var
    this.target = null;
    
    this.BuffType = buffType;
    this.BuffAreaRadius = buffAreaRadius;
    this.BuffAttenuation = -0.5;
    this.BuffMagnitude = 2;
    this.BuffDuration = buffDuration;
}
Ensign.prototype = new GameUnit();
// functions
Ensign.prototype.Effect = function() {
    // Get distance to tower from the joint;
    var distances = this.joint.GetDistances();
    
    for(var i = 0; i < this.GM.slots.length; i++) {
        var t = this.GM.slots[i].tower;
        if(t != null && !t.isDead && distances[i] < this.BuffAreaRadius) {
            // TO-DO
            // Buff the tower according the distance
            t.Buff(this.BuffType, 2, this.BuffDuration);
        }
    }
    
    setTimeout(()=>{
        this.hp = 0;
        this.isDead = true;
        this.GM.GEM.emit('ensign-removed', {eid: this.eid});
    }, this.BuffDuration);
}
// Override the Dead method
Ensign.prototype.Dead = function(killedBy) {
    // TODO
    /*
    
    */
}

module.exports = Ensign;