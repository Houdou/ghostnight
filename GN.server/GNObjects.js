var Tags = require('./Statics/Tags');
var Layers = require('./Statics/Layers');

//Values
var _HERO = {
    Nekomata: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 6, price: 100, value: 30, layer: Layers.land },
    Ameonna: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 6, price: 100, value: 30, layer: Layers.land },
    Todomeki: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 6, price: 100, value: 30, layer: Layers.land }
};

var _UNIT = {
    Kappa: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 4, price: 100, value: 30, layer: Layers.land },
    Wanyudo: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Foxfire: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.sky },
    Dojoji: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Futakuchi: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Raiju: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Ubume: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.sky }
};

var _TOWER = {
    Miko: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Inari: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land | Layers.sky },
    Inugami: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land | Layers.sky },
    Ebisu: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Snake: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Asura: {
        hp: 100, atk: 100, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land },
    Amaterasu: {
        hp: 100, atk: 100, range: 400, rate: 10, def: 10, spd: 10, price: 100, value: 30, layer: Layers.land | Layers.sky }
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
        Unit.call(this, "Kappa", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Kappa.hp, _UNIT.Kappa.atk, _UNIT.Kappa.range,
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
        Unit.call(this, "Wanyudo", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Wanyudo.hp, _UNIT.Wanyudo.atk, _UNIT.Wanyudo.range,
            _UNIT.Wanyudo.rate, _UNIT.Wanyudo.def, _UNIT.Wanyudo.spd, _UNIT.Wanyudo.layer, _UNIT.Wanyudo.price, _UNIT.Wanyudo.value, that.GM);
        // var
    }
    Wanyudo.prototype = new Unit();
    // functions
    Wanyudo.prototype.funA = function() {
        //...
    }
    
    this.Wanyudo = Wanyudo;
    
    // Class Foxfire : Unit
    // variables
    var Foxfire = function(x, y, joint) {
        Unit.call(this, "Foxfire", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Foxfire.hp, _UNIT.Foxfire.atk, _UNIT.Foxfire.range,
            _UNIT.Foxfire.rate, _UNIT.Foxfire.def, _UNIT.Foxfire.spd, _UNIT.Foxfire.layer, _UNIT.Foxfire.price, _UNIT.Foxfire.value, that.GM);
        // var
    }
    Foxfire.prototype = new Unit();
    // functions
    Foxfire.prototype.funA = function() {
        //...
    }
    
    this.Foxfire = Foxfire;
    
    // Class Dojoji : Unit
    // variables
    var Dojoji = function(x, y, joint) {
        Unit.call(this, "Dojoji", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Dojoji.hp, _UNIT.Dojoji.atk, _UNIT.Dojoji.range,
            _UNIT.Dojoji.rate, _UNIT.Dojoji.def, _UNIT.Dojoji.spd, _UNIT.Dojoji.layer, _UNIT.Dojoji.price, _UNIT.Dojoji.value, that.GM);
        // var
    }
    Dojoji.prototype = new Unit();
    // functions
    Dojoji.prototype.funA = function() {
        //...
    }
    
    this.Dojoji = Dojoji;
    
    // Class Futakuchi : Unit
    // variables
    var Futakuchi = function(x, y, joint) {
        Unit.call(this, "Futakuchi", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Futakuchi.hp, _UNIT.Futakuchi.atk, _UNIT.Futakuchi.range,
            _UNIT.Futakuchi.rate, _UNIT.Futakuchi.def, _UNIT.Futakuchi.spd, _UNIT.Futakuchi.layer, _UNIT.Futakuchi.price, _UNIT.Futakuchi.value, that.GM);
        // var
    }
    Futakuchi.prototype = new Unit();
    // functions
    Futakuchi.prototype.funA = function() {
        //...
    }
    
    this.Futakuchi = Futakuchi;
    
    // Class Raiju : Unit
    // variables
    var Raiju = function(x, y, joint) {
        Unit.call(this, "Raiju", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Raiju.hp, _UNIT.Raiju.atk, _UNIT.Raiju.range,
            _UNIT.Raiju.rate, _UNIT.Raiju.def, _UNIT.Raiju.spd, _UNIT.Raiju.layer, _UNIT.Raiju.price, _UNIT.Raiju.value, that.GM);
        // var
    }
    Raiju.prototype = new Unit();
    // functions
    Raiju.prototype.funA = function() {
        //...
    }
    
    this.Raiju = Raiju;
    
    // Class Ubume : Unit
    // variables
    var Ubume = function(x, y, joint) {
        Unit.call(this, "Ubume", that.GM.assignUnitID(), Tags.unit, x, y, joint, _UNIT.Ubume.hp, _UNIT.Ubume.atk, _UNIT.Ubume.range,
            _UNIT.Ubume.rate, _UNIT.Ubume.def, _UNIT.Ubume.spd, _UNIT.Ubume.layer, _UNIT.Ubume.price, _UNIT.Ubume.value, that.GM);
        // var
    }
    Ubume.prototype = new Unit();
    // functions
    Ubume.prototype.funA = function() {
        //...
    }
    
    this.Ubume = Ubume;
    
    /**
     * Towers
     *
     */
    
    // Class Miko : Tower
    var Miko = function(slot) {
        Tower.call(this, "Miko", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Miko.hp, _TOWER.Miko.atk, _TOWER.Miko.range,
            _TOWER.Miko.rate, _TOWER.Miko.def, _TOWER.Miko.spd, _TOWER.Miko.layer, _TOWER.Miko.price, _TOWER.Miko.value, that.GM);
            
        slot.tower = this;
    }
    Miko.prototype = new Tower();
    this.Miko = Miko;
    
    // Class Inari : Tower
    var Inari = function(slot) {
        Tower.call(this, "Inari", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Inari.hp, _TOWER.Inari.atk, _TOWER.Inari.range,
            _TOWER.Inari.rate, _TOWER.Inari.def, _TOWER.Inari.spd, _TOWER.Inari.layer, _TOWER.Inari.price, _TOWER.Inari.value, that.GM);
            
        slot.tower = this;
    }
    Inari.prototype = new Tower();
    this.Inari = Inari;
    
    // Class Inugami : Tower
    var Inugami = function(slot) {
        Tower.call(this, "Inugami", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Inugami.hp, _TOWER.Inugami.atk, _TOWER.Inugami.range,
            _TOWER.Inugami.rate, _TOWER.Inugami.def, _TOWER.Inugami.spd, _TOWER.Inugami.layer, _TOWER.Inugami.price, _TOWER.Inugami.value, that.GM);
            
        slot.tower = this;
    }
    Inugami.prototype = new Tower();
    this.Inugami = Inugami;
    
    // Class Ebisu : Tower
    var Ebisu = function(slot) {
        Tower.call(this, "Ebisu", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Ebisu.hp, _TOWER.Ebisu.atk, _TOWER.Ebisu.range,
            _TOWER.Ebisu.rate, _TOWER.Ebisu.def, _TOWER.Ebisu.spd, _TOWER.Ebisu.layer, _TOWER.Ebisu.price, _TOWER.Ebisu.value, that.GM);
            
        slot.tower = this;
    }
    Ebisu.prototype = new Tower();
    this.Ebisu = Ebisu;
    
    // Class Snake : Tower
    var Snake = function(slot) {
        Tower.call(this, "Snake", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Snake.hp, _TOWER.Snake.atk, _TOWER.Snake.range,
            _TOWER.Snake.rate, _TOWER.Snake.def, _TOWER.Snake.spd, _TOWER.Snake.layer, _TOWER.Snake.price, _TOWER.Snake.value, that.GM);
            
        slot.tower = this;
    }
    Snake.prototype = new Tower();
    this.Snake = Snake;
    
    // Class Asura : Tower
    var Asura = function(slot) {
        Tower.call(this, "Asura", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Asura.hp, _TOWER.Asura.atk, _TOWER.Asura.range,
            _TOWER.Asura.rate, _TOWER.Asura.def, _TOWER.Asura.spd, _TOWER.Asura.layer, _TOWER.Asura.price, _TOWER.Asura.value, that.GM);
            
        slot.tower = this;
    }
    Asura.prototype = new Tower();
    this.Asura = Asura;
    
    // Class Amaterasu : Tower
    var Amaterasu = function(slot) {
        Tower.call(this, "Amaterasu", that.GM.assignUnitID(), Tags.tower, slot.transform.x, slot.transform.y, null, _TOWER.Amaterasu.hp, _TOWER.Amaterasu.atk, _TOWER.Amaterasu.range,
            _TOWER.Amaterasu.rate, _TOWER.Amaterasu.def, _TOWER.Amaterasu.spd, _TOWER.Amaterasu.layer, _TOWER.Amaterasu.price, _TOWER.Amaterasu.value, that.GM);
            
        slot.tower = this;
    }
    Amaterasu.prototype = new Tower();
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
            return null;
    }
};

module.exports = GNObjects;