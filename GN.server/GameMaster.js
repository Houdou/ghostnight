var Weather = require('./Statics/Weather.js');

var GameMaster = function(settings){
    this.slotCount = 0;
    this.slots = new Array();
    
    this.jointCount = 0;
    this.joints = new Array();
    
    this.roadSignCount = 0;
    this.roadSigns= new Array();
    
    this.hero = null;
    
    this.unitCount = 0;
    this.units = new Array();
    
    this.towerCount = 0;
    this.towers = new Array();
    
    this.weather = Weather.Night;
    this.time = 0;
    this.soul = 0;
    this.gold = 0;
    
    this.settings = settings;
};


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
GameMaster.prototype.assignTowerID = function () {
    return this.towerCount++;
};

module.exports = GameMaster;