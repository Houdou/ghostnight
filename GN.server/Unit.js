var GameUnit = require('./GameUnit');

// Class Unit : GameUnit
// variables
var Unit = function (name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM);
    // var
    this.target = null;
}
Unit.prototype = new GameUnit();
// functions
Unit.prototype.MoveTo = function(x, y, end) {
    this.transform.MoveTo(x, y);
    setTimeout(end, 1000 / this.spd);
    
    // createjs.Tween.get(this.transform, {override: true})
    //     .to({x: x, y: y}, 1000 / this.spd)
    //     .call(function() {
    //         if(end) return end();
    //     }, this);
}

Unit.prototype.Move = function () {
    if(this.joint != null) {
        var d = this.joint;
        var that = this;
        this.MoveTo(d.transform.x, d.transform.y, function() {
            // Notice the Joint and get blocker (if exist)
            var blocker = d.SteppedBy(that);
            // If blocked
            if(blocker != null) {
                // The unit will stay at the same position
                that.Move();
            } else {
                // Move to next joint
                if(d.Next() != null) {
                    that.joint = d.Next();
                    that.Move();
                }
            }
            
            // Get the nearest tower
            var target = d.GetNearestTower(that.range);
            if(target != null) {
                that.target = target;
                if(!that.isAttacking)
                    that.Attack();
            }
        });
    }
}
// Override the requireTarget method
Unit.prototype.requireTarget = function() {
    return this.target;
}
// Override the Dead method
Unit.prototype.Dead = function() {
    // TODO
    /*
    Currency for the enemy
    */
}
module.exports = Unit;