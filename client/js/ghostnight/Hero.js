/*global createjs*/

var GN = GN || {};

(function(){
    "use strict";
    
    // Class Hero : GameUnit
    var Hero = function (name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value) {
        GN.GameUnit.call(this, name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, layer, price, value);
        
    }
    
    var p = GN.extend(Hero, GN.GameUnit);
    
    // Public Methods
    p.MoveTo = function(x, y, end) {
        createjs.Tween.get(this.transform, {override: true})
            .to({x: x, y: y}, 1000 / this.spd)
            .call(function() {
                if(end) return end();
            }, this);
    }
    p.Move = function(path) {
        this.path = path;
        
        if(this.path.length > 0) {
            var d = this.path.shift();
            var self = this;
            this.MoveTo(d.transform.x, d.transform.y, function() {
                //Notice the joint
                d.SteppedBy(self);
                self.joint = d;
                
                //Move to next joint
                if(self.path.length > 0) {
                    self.Move(self.path);
                }
            });
        }
    }
    
    GN.Hero = Hero;
    
}());