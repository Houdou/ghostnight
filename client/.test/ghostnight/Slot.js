var GN = GN || {};

(function(){
    "use strict";
    
    // Class Slot : GameObject
    // variables
    var Slot = function(x, y) {
        this.sid = GN.GM.assignSlotID();
        
        GN.GameObject.call(this, "_S" + this.sid, GN.Tags.slot, x, y);
        
        this.tower = null;
        this.disabled = false;
    
        GN.GM.slots.push(this);
    }
    
    var p = GN.extend(Slot, GN.GameObject);
    
    // functions
    p.funA = function() {
        //...
    }
    
    
    GN.Slot = Slot;
    
}());