var Slot = require('../RoadSystem/Slot');
var Joint = require('../RoadSystem/Joint');
var RoadSign = require('../RoadSystem/RoadSign');

var SceneMangement = function(GM){
    this.GM = GM;
}

SceneMangement.prototype.LoadMap = function(MapID, end) {
    var map = new Object();
    
    var that = this;
    
    // Load the joints from the map data stored in file
    var fs = require('fs');
    fs.readFile('./GN.server/data/map/' + MapID, 'utf8', function(err, data){
        if(err){ console.log('unable to read map ' + MapID); return}
        map = JSON.parse(data);
        
        // Slot
        // Load the slots into GameMaster
        if(map.slots != undefined) {
            // Travesal of all slots data
            map.slots.forEach(function(s) {
                // Push new slot
                that.GM.slots.push(new Slot(that.GM.assignSlotID(), s.x, s.y, that.GM));
            });
        }
        
        // Joint
        // Load the joints into GameMaster
        if(map.joints != undefined) {
            // Travesal of all joints data
            map.joints.forEach(function(j) {
                // Push new joint
                that.GM.joints.push(new Joint(that.GM.assignJointID(), j.x, j.y, that.GM));
                // Connect to the attach joint
                if(j.attach.length > 0) {
                    for(var i = 0; i < j.attach.length; i++) {
                        that.GM.joints[j.id].AttachTo(that.GM.joints[j.attach[i]]);
                    }
                }
            });
        }
        
        that.GM.entryJoint = that.GM.joints[map.entryJoint.id];
        
        if(end)
            return end();
    });
}

module.exports = SceneMangement;