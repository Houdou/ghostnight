var Tower = require('./Tower');
var Tags = require('./Statics/Tags');
var Layers = require('./Statics/Layers');

var _Blocker = {
    hp: 100, atk: 0, range: 0, rate: 0, def: 10, spd: 0, price: 0, value: 30, layer: Layers.land
}

// Class Blocker : Tower
// variables
var Blocker = function(name, id, x, y, bindJoint, GM) {
    Tower.call(this, name, id, Tags.blocker, x, y, bindJoint, _Blocker.hp, _Blocker.atk, _Blocker.range,
        _Blocker.rate, _Blocker.def, _Blocker.spd, _Blocker.layer, _Blocker.price, _Blocker.value, GM);
    // var
    
}
Blocker.prototype = new Tower();
// functions
// Override the requireTarget method
Blocker.prototype.requireTarget = function() {
    // Blocker will not attack
    return null;
}
Blocker.prototype.UnblockJoint = function() {
    this.joint.blocker = null;
}
// Override the Dead method
Blocker.prototype.Dead = function(killedBy) {
    this.UnblockJoint();
    // Prevent accidental overkill
    this.slot.tower = null;
}