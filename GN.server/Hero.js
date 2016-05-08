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
        
        this.MoveTo(j.transform.x, j.transform.y, () => {
            if(this.isDead)
                return false;
            
            //Notice the joint
            var blocker = j.SteppedBy(this);
            this.joint = j;
            
            // If blocked
            if(blocker != null) {
                // The unit will stay at the same position
                this.Move(this.path);
            } else {
                // Move to next joint on path
                if(this.path.length > 0 && this.canMove) {
                    if(this.path.length > 1)
                        this.path.shift();
                    this.Move(this.path);
                }
            }
            
            // Get the nearest tower
            var target = j.FindNearestTower(this.range, true);
            this.target = target;
            if(target != null && !this.isAttacking) {
                this.Attack();
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
Hero.prototype.usedSkill = function(skillID, skillData) {
    this.skillLastTime[skillID] = (new Date()).getTime();
    this.GM.GEM.emit('hero-skill', {skillID: +skillID + 1, duration: this.skillCDTime[skillID], skillData: skillData || {}});
    this.GM.GEM.emit('hero-skill-cd', {skillID: +skillID + 1, duration: this.skillCDTime[skillID]});
}
module.exports = Hero;