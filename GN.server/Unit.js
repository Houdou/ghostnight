var GameUnit = require('./GameUnit');

// Class Unit : GameUnit
// variables
var Unit = function (name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM);
    // var
    this.target = null;
    this.canMove = true;
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
        var j = this.joint;
        var that = this;
        
        // DEBUG
        console.log(this.name + " will move to " + j.name);
        // DEBUG
        
        this.MoveTo(j.transform.x, j.transform.y, function() {
            
            // DEBUG
            console.log(that.name + " arrive at " + j.name);
            // DEBUG
            
            // Notice the Joint and get blocker (if exist)
            var blocker = j.SteppedBy(that);
            // If blocked
            if(blocker != null) {
                // The unit will stay at the same position
                that.Move();
            } else {
                // Move to next joint
                if(j.Next() != null && that.canMove) {
                    that.joint = j.Next();
                    that.Move();
                } else {
                    
                    // DEBUG
                    if(j.dest == null)
                        console.log(that.name + " reach the end.");
                    // DEBUG
                    
                }
                
            }
            
            // Get the nearest tower
            var target = j.GetNearestTower(that.range);
            that.target = target;
            if(target != null && !that.isAttacking) {
                that.Attack();
            }
        });
    }
}
// Override the requireTarget method
Unit.prototype.requireTarget = function() {
    if(this.transform.DistanceTo(this.target.transform) <  this.range)
        return this.target;
    else
        return null;
}
// Override the Dead method
Unit.prototype.Dead = function() {
    // TODO
    // Currency for the enemy
    this.isDead = true;
    this.canMove = false;
}
module.exports = Unit;