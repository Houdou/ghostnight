var Tower = require('./Tower');
var Tags = require('./Statics/Tags');
var Layers = require('./Statics/Layers');

var _Blocker = {
    hp: 1000, atk: 0, range: 0, rate: 0, def: 10, spd: 0, price: 0, value: 30, layer: Layers.land
}

// Class Blocker : Tower
// variables
var Blocker = function(name, id, x, y, bindJoint, slot, GM) {
    Tower.call(this, name, id, Tags.blocker, x, y, bindJoint, _Blocker.hp, _Blocker.atk, _Blocker.range,
        _Blocker.rate, _Blocker.def, _Blocker.spd, _Blocker.layer, _Blocker.price, _Blocker.value, GM);
    bindJoint.blocker = this;
    // var
    this.slot = slot;
}
Blocker.prototype = new Tower();
// functions
// Override the RequireTarget method
Blocker.prototype.Sight = function(unit) {
    // Blocker will not check environment
    return null;
}
// Override the RequireTarget method
Blocker.prototype.RequireTarget = function() {
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

module.exports = Blocker;