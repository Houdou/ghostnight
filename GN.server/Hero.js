var GameUnit = require('./GameUnit');

// Class Hero : GameUnit
// variables
function Hero(name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value) {
    GameUnit.call(this, name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value);
    // var
    this.target = null;
}
Hero.prototype = new GameUnit();
// functions
Hero.prototype.MoveTo = function(x, y, end) {
    this.transform.MoveTo(x, y);
    setTimeout(end, 1000 / this.spd);
    
    // createjs.Tween.get(this.transform, {override: true})
    //     .to({x: x, y: y}, 1000 / this.spd)
    //     .call(function() {
    //         if(end) return end();
    //     }, this);
}
Hero.prototype.Move = function(path) {
    this.path = path;
    
    if(this.path.length > 0) {
        var d = this.path.shift();
        var self = this;
        this.MoveTo(d.transform.x, d.transform.y, function() {
            //Notice the joint
            d.SteppedBy(self);
            self.joint = d;
            
            // Get the nearest tower
            var target = d.GetNearesTower(self.range);
            if(target != null) {
                self.target = target;
                if(!self.isAttacking)
                    self.Attack();
            }
            
            //Move to next joint
            if(self.path.length > 0) {
                self.Move(self.path);
            }
        });
    }
}
Hero.prototype.requireTarget = function() {
    return this.target;
}

module.exports = Hero;