var GameUnit = require('./GameUnit');

// Class Tower : GameUnit
// variables
var Tower = function (name, id, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value, GM);
    // var
    this.unitsInRange = [];
    this.slot = null;
}
Tower.prototype = new GameUnit();
// functions
Tower.prototype.Sight = function(unit) {
    if(this.layer & unit.layer != 0) {
        this.unitsInRange.push(unit);
        if(!this.isAttacking)
            this.Attack();
    }
};
// Override the requireTarget method
Tower.prototype.requireTarget = function() {
    var target = null;
    while (this.unitsInRange.length > 0) {
        target = this.unitsInRange[0];
        if (target.transform.DistanceSquare(this.transform) <= this.range * this.range && target.hp > 0) {
            return target;
        } else {
            this.unitsInRange.shift();
        }
    }
    return null;
};
// Override the Dead method
Tower.prototype.Dead = function(killedBy) {
    this.slot.ResetTower();
}

module.exports = Tower;