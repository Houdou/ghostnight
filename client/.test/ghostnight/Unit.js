/*global createjs*/

var GN = GN || {};

(function(){
    "use strict";
    
    // Class Unit : GameUnit
    function Unit(name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value) {
        GN.GameUnit.call(this, name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value);
    }
    
    var p = GN.extend(Unit, GN.GameUnit);
    
    // Public Methods
    p.MoveTo = function(x, y, end) {
        createjs.Tween.get(this.transform, {override: true})
            .to({x: x, y: y}, 1000 / this.spd)
            .call(function() {
                if(end) return end();
            }, this);
    }
    
    p.Move = function () {
        if(this.joint != null) {
            var d = this.joint;
            var self = this;
            this.MoveTo(d.transform.x, d.transform.y, function() {
                //Notice the joint
                d.SteppedBy(self);
                
                //Move to next joint
                if(d.Next() != null) {
                    self.joint = d.Next();
                    self.Move();
                }
            });
        }
    }
    
    GN.Unit = Unit;
    
}());