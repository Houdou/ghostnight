var GameUnit = require('./GameUnit');

// Class Unit : GameUnit
// variables
var Unit = function (name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value, GM);
    // var
    this.target = null;
    this.canMove = true;
    this.moveTimeout = -1;
    
    this.reachEnd = false;
}
Unit.prototype = new GameUnit();
// functions
Unit.prototype.MoveTo = function(x, y, end) {
    this.transform.MoveTo(x, y);
    this.moveTimeout = setTimeout(end, 1000 / this.spd);
    
    this.GM.GEM.emit('unit-moving', {uid: this.id, x: x, y: y, duration: 1000 / this.spd});
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
            if(that.isDead)
                return false;
            
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
                    if(j.dest == null)
                        that.End(j.jid);
                }
                
            }
            
            // Get the nearest tower
            var target = j.FindNearestTower(that.range);
            that.target = target;
            if(target != null && !that.isAttacking) {
                that.Attack();
            }
        });
    }
}
Unit.prototype.End = function(jid) {
    console.log(this.name + " reach the end.");
    this.reachEnd = true;
    this.GM.UnitReachEnd(this.value / 10, jid);
    this.GM.GEM.emit('unit-remove', {uid: this.uid});
}
// Override the RequireTarget method
Unit.prototype.RequireTarget = function() {
    if(this.target != null && !this.target.isDead && this.transform.DistanceTo(this.target.transform) < this.range)
        return this.target;
    else
        return null;
}
// Override the Dead method
Unit.prototype.Dead = function() {
    this.canMove = false;
    // Econ system
    this.GM.AddGold(this.value);
    
}
module.exports = Unit;