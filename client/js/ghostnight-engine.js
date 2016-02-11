// Static Class Tags
var Tags =
{
    unit: 0,
    hero: 1,
    tower: 2,
    blocker: 3,
    roadsign: 4,
    joint: 5
}

// Static Class State
var State = 
{
    normal: 0,
    paralyzed: 1 << 0,
    fire: 1 << 1
    
};

// Static Class Weather
var Weather = 
{
    Night: 0,
    Rain: 1
    
}

// Game Master
var GM = 
{
    count: 0,
    assignID: function()
    {
        return this.count++;
    },
    jointCount: 0,
    joints: [],
    assignJointID: function() {
        return this.jointCount++;
    },
    roadSignCount: 0,
    assignSignID: function(){
        return this.roadSignCount++;
    },
    weather: Weather.Night,
    time: 0,
    soul: 0,
    gold: 0
};

var reachDistance = 5;



// Class Transform
function Transform(x, y)
{
    this.x = x;
    this.y = y;
}
Transform.prototype.DistanceTo = function()
{
    if(arguments[0] instanceof Transform)
    {
        var target = arguments[0];
        var dx, dy, d;
    	dx = target.x - this.x;
    	dy = target.y - this.y;
    	d = Math.sqrt(dx*dx + dy*dy);
    	return d;
    }
    else if(arguments.length == 2)
    {
        var dx, dy, d;
        dx = arguments[0] - this.x;
        dy = arguments[0] - this.y;
        d = Math.sqrt(dx*dx + dy*dy);
        return d;
    }
}

Transform.prototype.Move = function()
{
    if(arguments.length == 1)
    {
        this.x += arguments[0].x;
        this.y += arguments[0].y;
    }
    else if(arguments.length == 2)
    {
        this.x += arguments[0];
        this.y += arguments[1];
    }
}
Transform.prototype.MoveTo = function(target) {
    this.x = target.x;
    this.y = target.y;
}


// Class GameObject
// variables
function GameObject(name, tag, x, y)
{
    this.transform = new Transform(x, y);
    this.name = name;
    this.tag = tag;
}
// functions
GameObject.prototype.funA = function()
{
    //...
}


// Class GameUnit : GameObject
// variables
function GameUnit(name, tag, x, y, joint, hp, atk, range, rate, def, spd, price, value)
{
    GameObject.call(this, name, tag, x, y);
    this.joint = joint;
    this.hp = hp;
    this.atk = atk;
    this.range = range;
    this.rate = rate;
    this.def = def;
    this.spd = spd;
    this.price = price;
    this.value = value;
    this.state = State.normal;
    this.id = GM.assignID();
}
GameUnit.prototype = new GameObject();
// functions
GameUnit.prototype.Attack = function(obj)
{
    //...
}


// Class Slot : GameObject
// variables
function Slot(name, tag, x, y)
{
    GameObject.call(this, name, tag, x, y);
    // var
}
Slot.prototype = new GameObject();
// functions
Slot.prototype.funA = function()
{
    //...
}


// Class Hero : GameUnit
// variables
function Hero(name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, price, value)
{
    GameUnit.call(this, name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, price, value);
    // var
}
Hero.prototype = new GameUnit();
// functions
Hero.prototype.move = function()
{
    //...
}


// Class Unit : GameUnit
// variables
function Unit(name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, price, value)
{
    GameUnit.call(this, name, tag, x, y, destJoint, hp, atk, range, rate, def, spd, price, value);
    // var
}
Unit.prototype = new GameUnit();
// functions
Unit.prototype.move = function()
{
    if (this.transform.DistanceTo(this.destJoint.transform) >= reachDistance)
    {
        
    }
}


// Class Tower : GameUnit
// variables
function Tower(name, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, price, value)
{
    GameUnit.call(this, name, tag, x, y, bindJoint, hp, atk, range, rate, def, spd, price, value);
    // var
}
Tower.prototype = new GameUnit();
// functions
Tower.prototype.funA = function()
{
    //...
}

// Class Blocker : GameUnit
function Blocker(name, tag, x, y, joint, hp, atk, range, rate, def, spd, price, value)
{
    GameUnit.call(this, name, tag, x, y, joint, hp, atk, range, rate, def, spd, price, value);
    // var
    
}
Blocker.prototype = new GameUnit();
// functions
Blocker.prototype.funA = function()
{
    //...
}


// Class RoadSign : GameObject
// variables
function RoadSign(x, y, joint, from)
{
    this.rid = GM.assignSignID();
    
    GameObject.call(this, "_RS"+this.rid, Tags.roadsign, x, y);
    // var
    this.joint = joint;
    
    this.dests = this.joint.nbs;
    
    for(var i = 0; i < from.length; i++)
    {
        this.dests.splice(this.joint.nbs.indexOf(from[i]), 1);
    }
    
    
    this.currentDestIndex = 0;
    // this.rotations = rotations;
    
}
RoadSign.prototype = new GameObject();
// functions
RoadSign.prototype.Turn = function()
{
    //DEBUGING
    console.log("RoadSign " + this.rid + " changed from " + this.dests[this.currentDestIndex].jid);
    //DEBUGING
    
    this.currentDestIndex = (this.currentDestIndex + 1) % this.dests.length;
    this.joint.dest = this.dests[this.currentDestIndex];
    
    //DEBUGING
    console.log("to " + this.dests[this.currentDestIndex].jid);
    //DEBUGING
}

// Class Joint : GameObject
function Joint(x, y)
{
    this.jid = GM.assignJointID();
    
    GameObject.call(this, "_J" + this.jid, Tags.joint, x, y);
    // var
    this.nbs = [];
    this.dest = null;
    
    GM.joints.push(this);
}
Joint.prototype = new GameObject();
// functions
Joint.prototype.AttachTo = function(joint)
{
    this.nbs.push(joint);
    joint.nbs.push(this);
    
    if(joint.dest == null)
    {
        joint.dest = this;
    }
}
Joint.prototype.next = function() {
    return this.dest;
}

/**
 * Objects
 *
 */
 
//Values
var _HERO = 
{
    Nekomata:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Ameonna:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Todomeki:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30}
};

var _UNIT =
{
    Kappa:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Wanyudo:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Foxfire:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Dojoji:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Futakuchi:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Raiju:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Ubume:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30}
};

var _TOWER = 
{
    Miko:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Inari:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Inugami:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Ebisu:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Snake:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Asura:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30},
    Amaterasu:{
        hp: 100, atk: 10, range: 100, rate: 10, def: 10, spd: 10, price: 100, value: 30}
}
//

/**
 * Heros
 *
 */

// Class Nekomata : Hero
// variables
function Nekomata(x, y, joint)
{
    Hero.call(this, "Nekomata", Tags.hero, x, y, joint, _HERO.Nekomata.hp, _HERO.Nekomata.atk, _UNIT.Nekomata.range,
        _UNIT.Nekomata.rate, _HERO.Nekomata.def, _HERO.Nekomata.spd, _HERO.Nekomata.price, _HERO.Nekomata.value);
    // var
}
Nekomata.prototype = new Hero();
// functions
Nekomata.prototype.funA = function()
{
    //...
}

// Class Ameonna : Hero
// variables
function Ameonna(x, y, joint)
{
    Hero.call(this, "Ameonna", Tags.hero, x, y, joint, _HERO.Ameonna.hp, _HERO.Ameonna.atk, _UNIT.Ameonna.range,
        _UNIT.Ameonna.rate, _HERO.Ameonna.def, _HERO.Ameonna.spd, _HERO.Ameonna.price, _HERO.Ameonna.value);
    // var
}
Ameonna.prototype = new Hero();
// functions
Ameonna.prototype.funA = function()
{
    //...
}

// Class Todomeki : Hero
// variables
function Todomeki(x, y, joint)
{
    Hero.call(this, "Todomeki", Tags.hero, x, y, joint, _HERO.Todomeki.hp, _HERO.Todomeki.atk, _UNIT.Todomeki.range,
        _UNIT.Todomeki.rate, _HERO.Todomeki.def, _HERO.Todomeki.spd, _HERO.Todomeki.price, _HERO.Todomeki.value);
    // var
}
Todomeki.prototype = new Hero();
// functions
Todomeki.prototype.funA = function()
{
    //...
}

/**
 * Unit
 *
 */

// Class Kappa : Unit
// variables
function Kappa(x, y, joint)
{
    Unit.call(this, "Kappa", x, y, joint, _UNIT.Kappa.hp, _UNIT.Kappa.atk, _UNIT.Kappa.range,
        _UNIT.Kappa.rate, _UNIT.Kappa.def, _UNIT.Kappa.spd, _UNIT.Kappa.price, _UNIT.Kappa.value);
    // var
}
Kappa.prototype = new Unit();
// functions
Kappa.prototype.funA = function()
{
    //...
}

// Class Wanyudo : Unit
// variables
function Wanyudo(x, y, joint)
{
    Unit.call(this, "Wanyudo", x, y, joint, _UNIT.Wanyudo.hp, _UNIT.Wanyudo.atk, _UNIT.Wanyudo.range,
        _UNIT.Wanyudo.rate, _UNIT.Wanyudo.def, _UNIT.Wanyudo.spd, _UNIT.Wanyudo.price, _UNIT.Wanyudo.value);
    // var
}
Wanyudo.prototype = new Unit();
// functions
Wanyudo.prototype.funA = function()
{
    //...
}

// Class Foxfire : Unit
// variables
function Foxfire(x, y, joint)
{
    Unit.call(this, "Foxfire", x, y, joint, _UNIT.Foxfire.hp, _UNIT.Foxfire.atk, _UNIT.Foxfire.range,
        _UNIT.Foxfire.rate, _UNIT.Foxfire.def, _UNIT.Foxfire.spd, _UNIT.Foxfire.price, _UNIT.Foxfire.value);
    // var
}
Foxfire.prototype = new Unit();
// functions
Foxfire.prototype.funA = function()
{
    //...
}

// Class Dojoji : Unit
// variables
function Dojoji(x, y, joint)
{
    Unit.call(this, "Dojoji", x, y, joint, _UNIT.Dojoji.hp, _UNIT.Dojoji.atk, _UNIT.Dojoji.range,
        _UNIT.Dojoji.rate, _UNIT.Dojoji.def, _UNIT.Dojoji.spd, _UNIT.Dojoji.price, _UNIT.Dojoji.value);
    // var
}
Dojoji.prototype = new Unit();
// functions
Dojoji.prototype.funA = function()
{
    //...
}

// Class Futakuchi : Unit
// variables
function Futakuchi(x, y, joint)
{
    Unit.call(this, "Futakuchi", x, y, joint, _UNIT.Futakuchi.hp, _UNIT.Futakuchi.atk, _UNIT.Futakuchi.range,
        _UNIT.Futakuchi.rate, _UNIT.Futakuchi.def, _UNIT.Futakuchi.spd, _UNIT.Futakuchi.price, _UNIT.Futakuchi.value);
    // var
}
Futakuchi.prototype = new Unit();
// functions
Futakuchi.prototype.funA = function()
{
    //...
}

// Class Raiju : Unit
// variables
function Raiju(x, y, joint)
{
    Unit.call(this, "Raiju", x, y, joint, _UNIT.Raiju.hp, _UNIT.Raiju.atk, _UNIT.Raiju.range,
        _UNIT.Raiju.rate, _UNIT.Raiju.def, _UNIT.Raiju.spd, _UNIT.Raiju.price, _UNIT.Raiju.value);
    // var
}
Raiju.prototype = new Unit();
// functions
Raiju.prototype.funA = function()
{
    //...
}

// Class Ubume : Unit
// variables
function Ubume(x, y, joint)
{
    Unit.call(this, "Ubume", x, y, joint, _UNIT.Ubume.hp, _UNIT.Ubume.atk, _UNIT.Ubume.range,
        _UNIT.Ubume.rate, _UNIT.Ubume.def, _UNIT.Ubume.spd, _UNIT.Ubume.price, _UNIT.Ubume.value);
    // var
}
Ubume.prototype = new Unit();
// functions
Ubume.prototype.funA = function()
{
    //...
}

/**
 * Towers
 *
 */

// Class Miko : Tower
function Miko(x, y, joint)
{
    Tower.call(this, "Miko", Tags.tower, x, y, joint, _TOWER.Miko.hp, _TOWER.Miko.atk, _TOWER.Miko.range,
        _TOWER.Miko.rate, _TOWER.Miko.def, _TOWER.Miko.spd, _TOWER.Miko.price, _TOWER.Miko.value);
}
// Class Inari : Tower
function Inari(x, y, joint)
{
    Tower.call(this, "Inari", Tags.tower, x, y, joint, _TOWER.Inari.hp, _TOWER.Inari.atk, _TOWER.Inari.range,
        _TOWER.Inari.rate, _TOWER.Inari.def, _TOWER.Inari.spd, _TOWER.Inari.price, _TOWER.Inari.value);
}
// Class Inugami : Tower
function Inugami(x, y, joint)
{
    Tower.call(this, "Inugami", Tags.tower, x, y, joint, _TOWER.Inugami.hp, _TOWER.Inugami.atk, _TOWER.Inugami.range,
        _TOWER.Inugami.rate, _TOWER.Inugami.def, _TOWER.Inugami.spd, _TOWER.Inugami.price, _TOWER.Inugami.value);
}
// Class Ebisu : Tower
function Ebisu(x, y, joint)
{
    Tower.call(this, "Ebisu", Tags.tower, x, y, joint, _TOWER.Ebisu.hp, _TOWER.Ebisu.atk, _TOWER.Ebisu.range,
        _TOWER.Ebisu.rate, _TOWER.Ebisu.def, _TOWER.Ebisu.spd, _TOWER.Ebisu.price, _TOWER.Ebisu.value);
}
// Class Snake : Tower
function Snake(x, y, joint)
{
    Tower.call(this, "Snake", Tags.tower, x, y, joint, _TOWER.Snake.hp, _TOWER.Snake.atk, _TOWER.Snake.range,
        _TOWER.Snake.rate, _TOWER.Snake.def, _TOWER.Snake.spd, _TOWER.Snake.price, _TOWER.Snake.value);
}
// Class Asura : Tower
function Asura(x, y, joint)
{
    Tower.call(this, "Asura", Tags.tower, x, y, joint, _TOWER.Asura.hp, _TOWER.Asura.atk, _TOWER.Asura.range,
        _TOWER.Asura.rate, _TOWER.Asura.def, _TOWER.Asura.spd, _TOWER.Asura.price, _TOWER.Asura.value);
}
// Class Amaterasu : Tower
function Amaterasu(x, y, joint)
{
    Tower.call(this, "Amaterasu", Tags.tower, x, y, joint, _TOWER.Amaterasu.hp, _TOWER.Amaterasu.atk, _TOWER.Amaterasu.range,
        _TOWER.Amaterasu.rate, _TOWER.Amaterasu.def, _TOWER.Amaterasu.spd, _TOWER.Amaterasu.price, _TOWER.Amaterasu.value);
}