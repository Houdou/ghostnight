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

GhostNight.prototype.newHero = function(type) {
    var hero = (new this.GNObjects.GetHeroType(type))(
        this.GM.entryJoint.transform.x, this.GM.entryJoint.transform.y,
        this.GM.entryJoint, this.GM);
}

GhostNight.prototype.NewUnit = function(type) {
    
}
GhostNight.prototype.NewTower = function(type) {
    
}

module.exports = GhostNight;