var GameObject = require('../GameObject');
var Tags = require('../Statics/Tags');

var GM = require('../GameMaster');

// Class RoadSign : GameObject
// variables
var RoadSign = function (id, x, y, joint, from, GM) {
    this.rid = id

    GameObject.call(this, "_RS" + this.rid, Tags.roadsign, x, y, GM);
    // var
    this.joint = joint;
    this.dests = this.joint.nbs;

    for (var i = 0; i < from.length; i++) {
        var index = this.joint.nbs.indexOf(from[i]);
        if(index >= 0)
            this.dests.splice(this.joint.nbs.indexOf(from[i]), 1);
    }

    this.currentDestIndex = 0;
    // this.rotations = rotations;

}
RoadSign.prototype = new GameObject();
// functions
RoadSign.prototype.Turn = function() {
    //DEBUGING
    console.log("RoadSign " + this.rid + " changed from " + this.dests[this.currentDestIndex].jid);
    //DEBUGING

    this.currentDestIndex = (this.currentDestIndex + 1) % this.dests.length;
    this.joint.dest = this.dests[this.currentDestIndex];

    //DEBUGING
    console.log("to " + this.dests[this.currentDestIndex].jid);
    //DEBUGING
}

module.exports = RoadSign;