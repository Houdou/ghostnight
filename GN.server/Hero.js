var GameUnit = require('./GameUnit');

// Class Hero : GameUnit
// variables
var Hero = function(name, id, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value, GM);
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
        var j = this.path.shift();
        var that = this;
        this.MoveTo(j.transform.x, j.transform.y, function() {
            //Notice the joint
            j.SteppedBy(that);
            that.joint = j;
            
            // Get the nearest tower
            var target = j.GetNearestTower(that.range);
            if(target != null) {
                that.target = target;
                if(!that.isAttacking)
                    that.Attack();
            }
            
            //Move to next joint
            if(that.path.length > 0) {
                that.Move(that.path);
            }
        });
    }
}
// Override the requireTarget method
Hero.prototype.requireTarget = function() {
    return this.target;
}
// Override the Dead method
Hero.prototype.Dead = function(killedBy) {
    // TODO
    /*
    Re-enable the hero selection function and also UI
    */
}

module.exports = Hero;