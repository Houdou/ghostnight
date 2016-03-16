var GN = GN || {};

(function(){
    "use strict";
    
    // Class GameUnit : GameObject
    // variables
    var GameUnit = function (name, tag, x, y, joint, hp, atk, range, rate, def, spd, layer, price, value) {
        GN.GameObject.call(this, name, tag, x, y);
        this.joint = joint;
        this.hp = hp;
        this.atk = atk;
        this.range = range;
        this.rate = rate;
        this.def = def;
        this.spd = spd;
        this.layer = layer;
        this.price = price;
        this.value = value;
        this.state = GN.State.normal;
        this.id = GN.GM.assignUnitID();
        this.nextAtkTime = 0;
    }
    
    // functions
    GameUnit.prototype.DealDamage = function(dmg) {
        this.hp -= dmg;
        
        //DEBUG
        if(this.hp <= 0)
            console.log(this.name + " is DEAD");
        //DEBUG
        
    }
    
    GN.extend(GameUnit, GN.GameObject);
    
    GN.GameUnit = GameUnit;
    
}());