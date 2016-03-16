var GameUnit = require('./GameUnit');

// Class Unit : GameUnit
// variables
var Unit = function (name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value) {
    GameUnit.call(this, name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value);
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
        var self = this;
        this.MoveTo(d.transform.x, d.transform.y, function() {
            // Notice the joint
            d.SteppedBy(self);
            
            // Get the nearest tower
            var target = d.GetNearesTower(self.range);
            if(target != null) {
                self.target = target;
                if(!self.isAttacking)
                    self.Attack();
            }
            
            // Move to next joint
            if(d.Next() != null) {
                self.joint = d.Next();
                self.Move();
            }
        });
    }
}
Unit.prototype.requireTarget = function() {
    return this.target;
}
module.exports = Unit;