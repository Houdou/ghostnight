var GN = GN || {};

(function(){
    "use strict";
    
    // Class Tower : GameUnit
    function Tower(name, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value) {
        GN.GameUnit.call(this, name, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, layer, price, value);
        
        this.unitsInRange = [];
        
    }
    
    var p = GN.extend(Tower, GN.GameUnit);
    
    // public methods
    p.Sight = function(unit) {
        if(this.layer & unit.layer != 0) {
            this.unitsInRange.push(unit);
        }
    };
    
    p.Attack = function() {
        if ((new Date()).getTime() > this.nextAtkTime) {
            var target = this._requireTarget();
            if (target != null) {
                var dmg = Math.max(this.atk - target.def, 1);
                target.DealDamage(dmg);
                
                //DEBUG
                console.log(this.name + " attack " + target.name);
                console.log("Deal " + dmg + " damage");
                //DEBUG
                
                
                // this.nextAtkTime = (new Date()).getTime() + 1000 / this.rate;
            }
        }
    }
    
    // private methods
    p._requireTarget = function() {
        var target = null;
        while (this.unitsInRange.length > 0) {
            target = this.unitsInRange[0];
            if (target.transform.DistanceSquare(this.transform) <= this.range * this.range && target.hp > 0) {
                return target;
            } else {
                this.unitsInRange.shift();
            }
        }
        return null;
    }
    
    GN.Tower = Tower;
    
}());