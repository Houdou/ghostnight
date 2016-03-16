var GN = GN || {};

(function(){
    "use strict";
    
    // Class Blocker : GameUnit
    var Blocker = function (name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value) {
        GN.GameUnit.call(this, name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value);
        
    }
    
    var p = GN.extend(Blocker, GN.GameUnit);
    
    // public methods
    p.funA = function() {
        //...
    }
    
    GN.Blocker = Blocker;
    
}());