var GameObject = require('../GameObject');
var Tags = require('../Statics/Tags');

var GM = require('../GameMaster');

// Class Slot : GameObject
// variables
var Slot = function(x, y) {
    this.sid = GM.assignSlotID();

    GameObject.call(this, "_S" + this.sid, Tags.slot, x, y);
    // var
    this.tower = null;
    this.disabled = false;

    GM.slots.push(this);
}
Slot.prototype = new GameObject();
// functions
Slot.prototype.funA = function() {
    //...
}

module.exports = Slot;