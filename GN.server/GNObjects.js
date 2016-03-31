var Tags = require('./Statics/Tags');
var Layers = require('./Statics/Layers');
var States = require('./Statics/States');

//Values
var _HERO = {
    Nekomata: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 6, price: 100, value: 30, layer: Layers.land },
    Ameonna: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 6, price: 100, value: 30, layer: Layers.land },
    Todomeki: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 6, price: 100, value: 30, layer: Layers.land }
};

var _UNIT = {
    Kappa: {
        hp: 600, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Wanyudo: {
        hp: 1000, atk: 300, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Foxfire: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.sky },
    Dojoji: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Futakuchi: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Raiju: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Ubume: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.sky }
};

var _TOWER = {
    Miko: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Inari: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land | Layers.sky },
    Inugami: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land | Layers.sky },
    Ebisu: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Snake: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Asura: {
        hp: 1000, atk: 100, range: 100, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land },
    Amaterasu: {
        hp: 1000, atk: 100, range: 200, rate: 3, def: 10, spd: 1000 / 500, price: 100, value: 30, layer: Layers.land | Layers.sky }
};

var Hero = require('./Hero');
var Unit = require('./Unit');
var Tower = require('./Tower');

var GNObjects = function(GM){
    this.GM = GM;
    
    var that = this;
    
    // Class Nekomata : Hero
    // variables
    var Nekomata = function(x, y, joint) {
        Hero.call(this, "Nekomata", that.GM.assignUnitID(), Tags.hero, x, y, joint, _HERO.Nekomata.hp, _HERO.Nekomata.atk, _HERO.Nekomata.range,
            _HERO.Nekomata.rate, _HERO.Nekomata.def, _HERO.Nekomata.spd, _HERO.Nekomata.layer, _HERO.Nekomata.price, _HERO.Nekomata.value, that.GM);
        // var
    }
    Nekomata.prototype = new Hero();
    // functions
    Nekomata.prototype.funA = function() {
        //...
    }
    
    this.Nekomata = Nekomata;
    
    
    // Class Ameonna : Hero
    // variables
    var Ameonna = function(x, y, joint) {
        Hero.call(this, "Ameonna", that.GM.assignUnitID(), Tags.hero, x, y, joint, _HERO.Ameonna.hp, _HERO.Ameonna.atk, _HERO.Ameonna.range,
            _HERO.Ameonna.rate, _HERO.Ameonna.def, _HERO.Ameonna.spd, _HERO.Ameonna.layer, _HERO.Ameonna.price, _HERO.Ameonna.value, that.GM);
        // var
    }
    Ameonna.prototype = new Hero();
    // functions
    Ameonna.prototype.funA = function() {
        //...
    }
    
    this.Ameonna = Ameonna;
    
    
    // Class Todomeki : Hero
    // variables
    var Todomeki = function(x, y, joint) {
        Hero.call(this, "Todomeki", that.GM.assignUnitID(), Tags.hero, x, y, joint, _HERO.Todomeki.hp, _HERO.Todomeki.atk, _HERO.Todomeki.range,
            _HERO.Todomeki.rate, _HERO.Todomeki.def, _HERO.Todomeki.spd, _HERO.Todomeki.layer, _HERO.Todomeki.price, _HERO.Todomeki.value, that.GM);
        // var
    }
    Todomeki.prototype = new Hero();
    // functions
    Todomeki.prototype.funA = function() {
        //...
    }
    
    this.Todomeki = Todomeki;
    
    
    /**
     * Unit
     *
     */
    
    // Class Kappa : Unit
    // variables
    var Kappa = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Kappa-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Kappa.hp, _UNIT.Kappa.atk, _UNIT.Kappa.range,
            _UNIT.Kappa.rate, _UNIT.Kappa.def, _UNIT.Kappa.spd, _UNIT.Kappa.layer, _UNIT.Kappa.price, _UNIT.Kappa.value, that.GM);
        // var
    }
    Kappa.prototype = new Unit();
    // functions
    Kappa.prototype.funA = function() {
        //...
    }
    
    this.Kappa = Kappa;
    
    // Class Wanyudo : Unit
    // variables
    var Wanyudo = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Wanyudo-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Wanyudo.hp, _UNIT.Wanyudo.atk, _UNIT.Wanyudo.range,
            _UNIT.Wanyudo.rate, _UNIT.Wanyudo.def, _UNIT.Wanyudo.spd, _UNIT.Wanyudo.layer, _UNIT.Wanyudo.price, _UNIT.Wanyudo.value, that.GM);
        // var
    }
    Wanyudo.prototype = new Unit();
    // functions
    Wanyudo.prototype.Move = function () {
        if(this.joint != null) {
            var j = this.joint;
            var that = this;
            
            // DEBUG
            console.log(this.name + " will move to " + j.name);
            // DEBUG
            
            this.MoveTo(j.transform.x, j.transform.y, function() {
                if(that.isDead)
                    return false;
                
                // DEBUG
                console.log(that.name + " arrive at " + j.name);
                // DEBUG
                
                // Notice the Joint and get blocker (if exist)
                var blocker = j.SteppedBy(that);
                // If blocked
                if(blocker != null) {
                    // Attack the blocker
                    that.target = blocker;
                    if(that.target != null && !that.isAttacking) {
                        that.Attack();
                    }
                    // The unit will stay at the same position
                    that.Move();
                } else {
                    // Move to next joint
                    if(j.Next() != null && that.canMove) {
                        that.joint = j.Next();
                        that.Move();
                    } else {
                        
                        // DEBUG
                        if(j.dest == null)
                            console.log(that.name + " reach the end.");
                        // DEBUG
                        
                    }
                    
                }
            });
        }
    }
    this.Wanyudo = Wanyudo;
    
    // Class Foxfire : Unit
    // variables
    var Foxfire = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Foxfire-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Foxfire.hp, _UNIT.Foxfire.atk, _UNIT.Foxfire.range,
            _UNIT.Foxfire.rate, _UNIT.Foxfire.def, _UNIT.Foxfire.spd, _UNIT.Foxfire.layer, _UNIT.Foxfire.price, _UNIT.Foxfire.value, that.GM);
        // var
    }
    Foxfire.prototype = new Unit();
    // functions
    Foxfire.prototype.Move = function () {
        if(this.joint != null) {
            var j = this.joint;
            var that = this;
            
            // DEBUG
            console.log(this.name + " will move to " + j.name);
            // DEBUG
            
            this.MoveTo(j.transform.x, j.transform.y, function() {
                if(that.isDead)
                    return false;
                
                // DEBUG
                console.log(that.name + " arrive at " + j.name);
                // DEBUG
                
                // Notice the Joint and get blocker (if exist)
                var blocker = j.SteppedBy(that);
                // Ignore blocker and move to next joint
                if(j.Next() != null && that.canMove) {
                    that.joint = j.Next();
                    that.Move();
                } else {
                    
                    // DEBUG
                    if(j.dest == null)
                        console.log(that.name + " reach the end.");
                    // DEBUG
                    
                }
                
                // Get the nearest tower
                var target = j.GetNearestTower(that.range);
                that.target = target;
                if(target != null && !that.isAttacking) {
                    that.Attack();
                }
            });
        }
    }
    
    this.Foxfire = Foxfire;
    
    // Class Dojoji : Unit
    // variables
    var Dojoji = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Dojoji-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Dojoji.hp, _UNIT.Dojoji.atk, _UNIT.Dojoji.range,
            _UNIT.Dojoji.rate, _UNIT.Dojoji.def, _UNIT.Dojoji.spd, _UNIT.Dojoji.layer, _UNIT.Dojoji.price, _UNIT.Dojoji.value, that.GM);
        // var
        this.nerfPossibility = 0.4;
        this.nerfRate = 0.5;
        this.nerfDuration = 5;
    }
    Dojoji.prototype = new Unit();
    // functions
    Dojoji.prototype.didAttackedTarget = function(target, dmg) {
        if(Math.random() > (1 - this.nerfPossibility)) {
            target.Nerf('def', this.nerfRate, this.nerfDuration);
        }
    }
    
    this.Dojoji = Dojoji;
    
    // Class Futakuchi : Unit
    // variables
    var Futakuchi = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Futakuchi-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Futakuchi.hp, _UNIT.Futakuchi.atk, _UNIT.Futakuchi.range,
            _UNIT.Futakuchi.rate, _UNIT.Futakuchi.def, _UNIT.Futakuchi.spd, _UNIT.Futakuchi.layer, _UNIT.Futakuchi.price, _UNIT.Futakuchi.value, that.GM);
        // var
        this.eaten = false;
    }
    Futakuchi.prototype = new Unit();
    // functions
    Futakuchi.prototype.didAttackedTarget = function(target, dmg) {
        // Can only eat one tower
        if(!target.isBlocker && !this.eaten) {
            // Kill the target firmly by maximize the damage
            var dmgToKill = Math.max(this.atk * 1000 - target.def, this.GM.settings.MinDamage);
            target.DealDamage(this, dmgToKill);
            // Mark as eaten
            this.eaten = true;
            // Increase value for reward
            this.Buff('value', 2, 10);
            return true;
        }
    }
    this.Futakuchi = Futakuchi;
    
    // Class Raiju : Unit
    // variables
    var Raiju = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Raiju-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Raiju.hp, _UNIT.Raiju.atk, _UNIT.Raiju.range,
            _UNIT.Raiju.rate, _UNIT.Raiju.def, _UNIT.Raiju.spd, _UNIT.Raiju.layer, _UNIT.Raiju.price, _UNIT.Raiju.value, that.GM);
        // var
        this.firePossibility = 0.5;
        this.fireDuration = 5000;
    }
    Raiju.prototype = new Unit();
    // functions
    Raiju.prototype.didAttackedTarget = function(target, dmg) {
        if(Math.random() > (1 - this.firePossibility)) {
            if(target.setState(this, States.fire, this.fireDuration)) {
                // DEBUG
                console.log(this.name + " set " + target.name + " on fire state");
                // DEBUG
                
            }
        }
    }
    
    this.Raiju = Raiju;
    
    // Class Ubume : Unit
    // variables
    var Ubume = function(x, y, joint) {
        this.uid = that.GM.assignUnitID();
        Unit.call(this, "Ubume-" + this.uid, this.uid, Tags.unit, x, y, joint, _UNIT.Ubume.hp, _UNIT.Ubume.atk, _UNIT.Ubume.range,
            _UNIT.Ubume.rate, _UNIT.Ubume.def, _UNIT.Ubume.spd, _UNIT.Ubume.layer, _UNIT.Ubume.price, _UNIT.Ubume.value, that.GM);
        // var
        this.healRate = 0.1;
    }
    Ubume.prototype = new Unit();
    // functions
    Ubume.prototype.didAttackedTarget = function(target, dmg) {
        // Heal hp with a given percentage;
        this.Heal(this, dmg * this.healRate);
    }
    
    this.Ubume = Ubume;
    
    /**
     * Towers
     *
     */
    
    // Class Miko : Tower
    var Miko = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Miko-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Miko.hp, _TOWER.Miko.atk, _TOWER.Miko.range,
            _TOWER.Miko.rate, _TOWER.Miko.def, _TOWER.Miko.spd, _TOWER.Miko.layer, _TOWER.Miko.price, _TOWER.Miko.value, that.GM);
            
        this.slot = slot;
    }
    Miko.prototype = new Tower();
    this.Miko = Miko;
    
    // Class Inari : Tower
    var Inari = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Inari-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Inari.hp, _TOWER.Inari.atk, _TOWER.Inari.range,
            _TOWER.Inari.rate, _TOWER.Inari.def, _TOWER.Inari.spd, _TOWER.Inari.layer, _TOWER.Inari.price, _TOWER.Inari.value, that.GM);
            
        this.slot = slot;
    }
    Inari.prototype = new Tower();
    this.Inari = Inari;
    
    // Class Inugami : Tower
    var Inugami = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Inugami-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Inugami.hp, _TOWER.Inugami.atk, _TOWER.Inugami.range,
            _TOWER.Inugami.rate, _TOWER.Inugami.def, _TOWER.Inugami.spd, _TOWER.Inugami.layer, _TOWER.Inugami.price, _TOWER.Inugami.value, that.GM);
            
        this.slot = slot;
        this.lastNerfTime = -1;
        this.nerfInterval = 5000;
    }
    Inugami.prototype = new Tower();
    Inugami.prototype.didAttackedTarget = function(target, dmg) {
        if((new Date()).getTime() - this.lastNerfTime > this.nerfInterval) {
            target.Nerf('atk', 0.5, 4);
        }
    }
    this.Inugami = Inugami;
    
    // Class Ebisu : Tower
    var Ebisu = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Ebisu-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Ebisu.hp, _TOWER.Ebisu.atk, _TOWER.Ebisu.range,
            _TOWER.Ebisu.rate, _TOWER.Ebisu.def, _TOWER.Ebisu.spd, _TOWER.Ebisu.layer, _TOWER.Ebisu.price, _TOWER.Ebisu.value, that.GM);
            
        this.slot = slot;
        
        this.pullPosibility = 0.6;
        this.pullLastTime = -1;
        this.pullInterval = 5000;
        
        this.skillInterval = -1;
        
        this.enableSkill();
        
        var bindJoint = this.GM.findNearestJoint(this.transform, this.range);
        if(bindJoint != null) {
            // DEBUG
            console.log(this.name + " bind to " + bindJoint.name);
            // DEBUG
            
            this.joint = bindJoint;
        } else {
            console.log("Slot setting unreasonable, Ebisu cannot reach any joint");
        }
    }
    Ebisu.prototype = new Tower();
    Ebisu.prototype.enableSkill = function() {
        var that = this;
        this.skillInterval = setInterval(function(){
            that.Skill((new Date().getTime()));
        }, 1000);
    }
    Ebisu.prototype.Skill = function(time) {
        if(this.isDead) {
            clearInterval(this.skillInterval);
            return;
        }
        
        if(time - this.pullLastTime > this.pullInterval) {
            // Find the unit that is closest to the end (based on x)
            var target = this.GM.findLastUnit(this.joint.transform.x);
            
            if(target != null) {
                // Move to bindJoint
                target.transform.MoveTo(this.joint.transform);
                target.joint = this.joint;
                
                // DEBUG
                console.log("target will move to " + this.joint.name);
                // DEBUG
                
                // Update time
                this.pullLastTime = time;
            }
        }
    }
    this.Ebisu = Ebisu;
    
    // Class Snake : Tower
    var Snake = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Snake-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Snake.hp, _TOWER.Snake.atk, _TOWER.Snake.range,
            _TOWER.Snake.rate, _TOWER.Snake.def, _TOWER.Snake.spd, _TOWER.Snake.layer, _TOWER.Snake.price, _TOWER.Snake.value, that.GM);
            
        this.slot = slot;
        this.AOETargetsNumber = 3;
        this.AOEAttenuation = 0.25;
    }
    Snake.prototype = new Tower();
    Snake.prototype.didAttackedTarget = function(target, dmg) {
        var AOETargets = new Array();
        
        for(var i = 0; i < this.unitsInRange.length; i++) {
            // Obtain targets in the range
            var t = this.unitsInRange[i];
            // Prevent duplicated target
            if(AOETargets.indexOf(t) == -1 && t != target) {
                // Array.push will return the length of array
                if(AOETargets.push(t) >= this.AOETargetsNumber) { break; }
            }
        }
        
        // Deal damage
        for(var i = 0; i < AOETargets.length; i++) {
            AOETargets[i].DealDamage(this, dmg * this.AOEAttenuation);
        }
    };
    this.Snake = Snake;
    
    // Class Asura : Tower
    var Asura = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Asura-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Asura.hp, _TOWER.Asura.atk, _TOWER.Asura.range,
            _TOWER.Asura.rate, _TOWER.Asura.def, _TOWER.Asura.spd, _TOWER.Asura.layer, _TOWER.Asura.price, _TOWER.Asura.value, that.GM);
            
        this.slot = slot;
    }
    Asura.prototype = new Tower();
    this.Asura = Asura;
    
    // Class Amaterasu : Tower
    var Amaterasu = function(slot) {
        this.tid = that.GM.assignTowerID();
        Tower.call(this, "Amaterasu-" + this.tid, this.tid, Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Amaterasu.hp, _TOWER.Amaterasu.atk, _TOWER.Amaterasu.range,
            _TOWER.Amaterasu.rate, _TOWER.Amaterasu.def, _TOWER.Amaterasu.spd, _TOWER.Amaterasu.layer, _TOWER.Amaterasu.price, _TOWER.Amaterasu.value, that.GM);
            
        this.slot = slot;
        this.TsukiyomiRate = 0.1;
        this.TsukiyomiMax = 10;
    }
    Amaterasu.prototype = new Tower();
    // functions
    Amaterasu.prototype.didAttackedTarget = function(target, dmg) {
        // Damage permanently
        target.maxhp -= Math.min(dmg * this.TsukiyomiRate, this.TsukiyomiMax);
    }
    this.Amaterasu = Amaterasu;
};



GNObjects.prototype.GetHeroType = function(type) {
    switch (type) {
        case 'Nekomata':
            return this.Nekomata;
        case 'Ameonna':
            return this.Ameonna;
        case 'Todomeki':
            return this.Todomeki;
        default:
            console.log("Wrong spelling of hero type");
            return null;
    }
}
GNObjects.prototype.GetUnitType = function(type) {
    switch (type) {
        case 'Kappa':
            return this.Kappa;
        case 'Wanyudo':
            return this.Wanyudo;
        case 'Foxfire':
            return this.Foxfire;
        case 'Dojoji':
            return this.Dojoji;
        case 'Futakuchi':
            return this.Futakuchi;
        case 'Raiju':
            return this.Raiju;
        case 'Ubume':
            return this.Ubume;
        default:
            console.log("Wrong spelling of unit type");
            return null;
    }
}
GNObjects.prototype.GetTowerType = function(type) {
    switch (type) {
        case 'Miko':
            return this.Miko;
        case 'Inari':
            return this.Inari;
        case 'Inugami':
            return this.Inugami;
        case 'Ebisu':
            return this.Ebisu;
        case 'Snake':
            return this.Snake;
        case 'Asura':
            return this.Asura;
        case 'Amaterasu':
            return this.Amaterasu;
        default:
            console.log("Wrong spelling of tower type");
            return null;
    }
};

module.exports = GNObjects;