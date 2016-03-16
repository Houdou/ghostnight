var GN = GN || {};

(function(){
    "use strict";
    
    // Class GameObject
    var GameObject = function (name, tag, x, y) {
        this.transform = new GN.Transform(x, y);
        this.name = name;
        this.tag = tag;
    }
    
    var p = GameObject.prototype;
    // Public methods
    
    
    GN.GameObject = GameObject;
    
}());