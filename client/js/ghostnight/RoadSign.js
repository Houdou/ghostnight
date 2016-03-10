var GN = GN || {};

(function(){
    "use strict";
    
    // Class RoadSign : GameObject
    // variables
    var RoadSign = function (x, y, joint, from) {
        this.rid = GN.GM.assignSignID();
    
        GN.GameObject.call(this, "_RS" + this.rid, GN.Tags.roadsign, x, y);
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
    
    var p = GN.extend(RoadSign, GN.GameObject);
    
    // public methods
    p.Turn = function() {
        this.currentDestIndex = (this.currentDestIndex + 1) % this.dests.length;
        this.joint.dest = this.dests[this.currentDestIndex];
    }
    
    GN.RoadSign = RoadSign;
    
}());