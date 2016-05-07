var GameUnit = require('./GameUnit');

// Class Hero : GameUnit
// variables
var Hero = function(name, id, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value, GM) {
    GameUnit.call(this, name, id, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value, GM);
    // var
    this.target = null;
    this.canMove = true;
    this.moveTimeout = -1;
    
    this.skillLastTime = [-1, -1];
    // Default skill time, to be overriden.
    this.skillCDTime = [180000, 180000];
}
Hero.prototype = new GameUnit();
// functions
Hero.prototype.MoveTo = function(x, y, end) {
    this.transform.MoveTo(x, y);
    this.GM.GEM.emit('hero-moving', {x: x, y: y, duration: 1000 / this.spd});
    this.moveTimeout = setTimeout(end, 1000 / this.spd);
    
    // createjs.Tween.get(this.transform, {override: true})
    //     .to({x: x, y: y}, 1000 / this.spd)
    //     .call(function() {
    //         if(end) return end();
    //     }, this);
}
Hero.prototype.Move = function(path) {
    clearTimeout(this.moveTimeout);
    
    if(this.joint.blocker != null)
        path.unshift(this.joint);
    
    this.path = path;
    
    if(this.path.length > 0) {
        var j = this.path[0];
        var that = this;
        
        this.MoveTo(j.transform.x, j.transform.y, function() {
            if(that.isDead)
                return false;
            
            //Notice the joint
            var blocker = j.SteppedBy(that);
            that.joint = j;
            
            // If blocked
            if(blocker != null) {
                // The unit will stay at the same position
                that.Move(that.path);
            } else {
                // Move to next joint on path
                if(that.path.length > 0 && that.canMove) {
                    if(that.path.length > 1)
                        that.path.shift();
                    that.Move(that.path);
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
// Override the RequireTarget method
Hero.prototype.RequireTarget = function() {
    return this.target;
}
// Override the Dead method
Hero.prototype.Dead = function(killedBy) {
    // Econ system
    this.GM.AddGold(this.value);
    this.GM.hero = null;
    // TODO
    /*
    Re-enable the hero selection function and also UI
    */
}
Hero.prototype.Skill = function(skillID, data) {
    // This is an abstract method to be override by the child class.
    console.log("Invalid call of abstract method Skill()");
    return false;
}
// Skill cood down control
Hero.prototype.ResetSkill = function() {
    for(var skillID in this.skillCDTime) {
        this.skillLastTime[skillID] = (new Date()).getTime();
        this.GM.GEM.emit('hero-skill-cd', {skillID: +skillID + 1, duration: this.skillCDTime[skillID]});
    }
}
Hero.prototype.canUseSkill = function(skillID) {
    return (new Date().getTime() > this.skillLastTime[skillID] + this.skillCDTime[skillID]);
}
Hero.prototype.usedSkill = function(skillID) {
    this.skillLastTime[skillID] = (new Date()).getTime();
    this.GM.GEM.emit('hero-skill', {skillID: +skillID + 1, duration: this.skillCDTime[skillID]});
    this.GM.GEM.emit('hero-skill-cd', {skillID: +skillID + 1, duration: this.skillCDTime[skillID]});
}
module.exports = Hero;