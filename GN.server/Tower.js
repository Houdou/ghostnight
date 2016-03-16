var GameUnit = require('./GameUnit');

// Class Tower : GameUnit
// variables
var Tower = function (name, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value) {
    GameUnit.call(this, name, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value);
    // var
    this.unitsInRange = [];
    
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
}

module.exports = Tower;