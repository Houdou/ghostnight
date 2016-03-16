var GN = {};

// Game objects
GN.GM = require("./GameMaster");
GN.GNObjects = require('./GNObjects');
GN.Transform = require('./Transform');

// Road system
GN.Slot = require('./RoadSystem/Slot');
GN.Joint = require('./RoadSystem/Joint');
GN.RoadSign = require('./RoadSystem/RoadSign');

// Setup
GN.SetupGhost = require('./Setup/Ghost');
// GN.SetupHuman = require('./Setup/Human');
// GN.SceneMangement = require('./Setup/Scene');

module.exports = GN;