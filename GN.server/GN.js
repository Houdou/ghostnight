var GhostNight = function(settings) {
    // Game setup
    this.GM = new (require("./GameMaster"))(settings);
    this.SceneMangement = new (require('./Setup/Scene'))(this.GM);
    
    // Player setup
    this.SetupGhost = require('./Setup/Ghost');
    // this.SetupHuman = require('./Setup/Human');
    
    // Game object
    this.GNObjects = new (require('./GNObjects'))(this.GM);
    this.Transform = require('./Transform');
    
    // Road system
    this.Slot = require('./RoadSystem/Slot');
    this.Joint = require('./RoadSystem/Joint');
    this.RoadSign = require('./RoadSystem/RoadSign');
    this.Blocker = require('./Blocker');
    
    
    
};


GhostNight.prototype.createHero = function(type) {
    // Validation: ???
    
    if(true) {
        var entryJoint = this.GM.entryJoint;
        // Get the class from GNObjects
        var newHero = new (this.GNObjects.GetHeroType(type))(
            entryJoint.transform.x, entryJoint.transform.y, entryJoint, this.GM);
        this.GM.hero = newHero;
        return newHero;
    } else
        return false;
}
GhostNight.prototype.createUnit = function(type) {
    // Validation: check cooldown time in GameMaster
    
    if(true) {
        var entryJoint = this.GM.entryJoint;
        // Get the class from GNObjects and create new unit
        var newUnit = new (this.GNObjects.GetUnitType(type))(
            entryJoint.transform.x, entryJoint.transform.y, entryJoint, this.GM);
        this.GM.units.push(newUnit);
        return newUnit;
    } else
        return false;
}
GhostNight.prototype.createTower = function(type, slot) {
    // Validation: check slot's canBuild property
    if(slot.canBuild) {
        // Get the class from GNObjects and create new tower
        var newTower = new (this.GNObjects.GetTowerType(type))(slot);
        // Update the slot state
        slot.BuildTower(newTower);
        this.GM.towers.push(newTower);
        return newTower;
    } else
        return null;
}

module.exports = GhostNight;