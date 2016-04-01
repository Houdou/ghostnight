var GameObject = require('../GameObject');
var Tags = require('../Statics/Tags');

// Class Slot : GameObject
// variables
var Slot = function(id, x, y, GM) {
    this.sid = id;
    GameObject.call(this, "_S" + this.sid, Tags.slot, x, y, GM);
    // var
    this.tower = null;
    this.disabled = false;
    
    this.canBuild = true;
}
Slot.prototype = new GameObject();
// functions
Slot.prototype.BuildTower = function(tower) {
    if(this.canBuild) {
        this.tower = tower;
        this.canBuild = false;
        this.tower.slot = this;
    }
}
Slot.prototype.ResetTower = function() {
    if(this.tower != null) {
        this.tower.hp = 0;
        this.tower.isDead = true;
    }
    this.tower = null;
    this.canBuild = true;
}
module.exports = Slot;