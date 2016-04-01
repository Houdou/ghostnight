var Tags = require('./Statics/Tags');
var Weather = require('./Statics/Weather');
var Logger = require('./Utils/Logger');

var GameMaster = function(settings){
    this.slotCount = 0;
    this.slots = new Array();
    
    this.jointCount = 0;
    this.joints = new Array();
    
    this.roadSignCount = 0;
    this.roadSigns= new Array();
    
    this.hero = null;
    this.heroSelect = "Nekomata";
    
    this.unitCount = 0;
    this.units = new Array();
    
    this.ensignCount = 0;
    this.ensigns = new Array();
    
    this.towerCount = 0;
    this.towers = new Array();
    
    this.weather = Weather.night;
    this.time = -1;
    this.startTime = -1;
    this.timerInterval = -1;
    this.soul = 0;
    this.gold = 0;
    
    this.settings = settings;
    
    this.ghostTotalDMG = 0;
    this.ghostKill = 0;
    this.huamnTotalDMG = 0;
    this.humanKill = 0;
    
    this.logger = new Logger({fileName: "log.txt"});
};
GameMaster.prototype.StartTiming = function() {
    var that = this;
    
    if(this.startTime == -1) {
        this.time = 0;
        this.startTime = (new Date()).getTime();
        
        this.timerInterval = setInterval(function(){
            that.time = (new Date()).getTime() - that.startTime;
            
            console.log(that.time);
            
            if(that.time >= that.settings.TimeLimit * 1000) {
                console.log("Time out");
                clearInterval(that.timerInterval);
            }
        }, 1000);
        return true;
    } else {
        return false;
    }
}
GameMaster.prototype.SetWeather = function(newWeather, duration) {
    this.weather = newWeather;
    var that = this;
    this.weatherTimeout = setTimeout(function(){
        that.weather = Weather.night;
    }, duration);
    console.log("The weather is changed to " + this.weather);
}
// Unit function
GameMaster.prototype.findPathTo = function(j, at) {
    var path = new Array();
    
    this.joints.forEach(function(joint) {
        joint.visited = false;
    })
    
    if(at == j) return j;
    var list = new Array();
    for(var i = 0; i < at.nbs.length; i++) {
        if(at.nbs[i] != j)
            list.push(at.nbs[i]);
        else
            return [j];
    }
    for(var i = 0; i< list.length; i++) {
        var p = list[i].findPath(at, j);
        list[i].visited = true;
        if(p != null)
            path = p;
    }
    return path;
}
GameMaster.prototype.findNearestJoint = function(at, maxDistance) {
    var d = maxDistance;
    var j = null;
    
    this.joints.forEach(function(joint) {
        var nd = at.DistanceTo(joint.transform);
        if (nd < d) {
            j = joint;
            d = nd;
        }
    });

    return j;
}
GameMaster.prototype.findLastUnit = function(minDistance) {
    var d = minDistance;
    var u = null;
    
    this.units.forEach(function(unit) {
        if(unit.isDead) { return }
        
        var nd = unit.transform.x;
        if (nd > d) {
            u = unit;
            d = nd;
        }
    });

    return u;
}
GameMaster.prototype.assignSlotID = function () {
    return this.slotCount++;
};
GameMaster.prototype.assignJointID = function () {
    return this.jointCount++;
};
GameMaster.prototype.assignSignID = function () {
    return this.roadSignCount++;
};
GameMaster.prototype.assignUnitID = function () {
    return this.unitCount++;
};
GameMaster.prototype.assignEnsignID = function () {
    return this.ensignCount++;
}
GameMaster.prototype.assignTowerID = function () {
    return this.towerCount++;
};
GameMaster.prototype.LogDamage = function(source, target, dmg) {
    this.time = (new Date()).getTime() - this.startTime;
    this.logger.Log(this.time, source.name , ((dmg > 0)?"ATTACK":"HEAL"), 
        target.name + " " + dmg + " to " + target.hp);
    
    // Statistic
    if(source.tag == Tags.unit || source.tag == Tags.hero) {
        this.ghostTotalDMG += dmg;
    } else {
        this.humanTotalDMG += dmg;
    }
}
GameMaster.prototype.LogDeath = function(source, killedBy) {
    this.time = (new Date()).getTime() - this.startTime;
    this.logger.Log(this.time, source.name , "DIE", "killed by " + killedBy.name);
    
    // Statistic
    if(killedBy.Tags == Tags.unit || killedBy.tag == Tags.hero) {
        this.ghostKill++;
    } else {
        this.humanKill++;
    }
}
GameMaster.prototype.LogBuff = function(source, buffType, buffMultiplier) {
    this.time = (new Date()).getTime() - this.startTime;
    this.logger.Log(this.time, source.name , ((buffMultiplier > 1)?"BUFF":"NERF"),
        buffType + " x" + buffMultiplier);
}

module.exports = GameMaster;