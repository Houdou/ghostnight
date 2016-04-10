var GameUnit = require('./GameUnit');

// Class Tower : GameUnit
// variables
var Tower = function (name, id, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value, GM);
    // var
    this.unitsInRange = [];
    this.slot = null;
    this.isBlocker = false;
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
// Override the RequireTarget method
Tower.prototype.RequireTarget = function() {
    var target = null;
    while (this.unitsInRange.length > 0) {
        target = this.unitsInRange[0];
        if (target.transform.DistanceSquare(this.transform) <= this.range * this.range && !target.isDead) {
            return target;
        } else {
            this.unitsInRange.shift();
        }
    }
    return null;
};
Tower.prototype.FindTarget = function() {
    this.unitsInRange = [];
    if(this.GM.hero != null && this.transform.DistanceTo(this.GM.hero.transform) < this.range)
        this.unitsInRange.push(this.GM.hero);
    this.GM.units.forEach((u) => {
        if(this.transform.DistanceTo(u.transform) < this.range)
            this.unitsInRange.push(u);
    });
}
// Override the Dead method
Tower.prototype.Dead = function(killedBy) {
    // Econ system
    this.GM.AddSoul(this.value);
    
    this.slot.ResetTower();
}

module.exports = Tower;