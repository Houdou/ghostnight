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
        if(err) {
            console.log('Unable to read map ' + MapID);
            if(end) {
                return end(true, err);
            } else { return false; }
        }
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
        
        // RoadSign
        // Load the roadSigns into GameMaster
        if(map.roadSigns != undefined) {
            // Travesal of all joints data
            map.roadSigns.forEach(function(r) {
                // Exclude the coming joint
                var exclJoints = new Array();
                if(r.froms.length > 0) {
                    for(var i = 0; i < r.froms.length; i++) {
                        exclJoints.push(that.GM.joints[r.froms[i]]);
                    }
                }
                
                // Push new joint
                that.GM.roadSigns.push(new RoadSign(that.GM.assignJointID(), r.x, r.y, that.GM.joints[r.bindJoint], exclJoints, that.GM));
                
            });
        }
        
        if(map.entryJoint != undefined) {
            that.GM.entryJoint = that.GM.joints[map.entryJoint.id];
        } else {
            console.log("The entry joint of map is not defined.");
            if(that.GM.joints[0] != null) {
                that.GM.entryJoint = that.GM.joints[0];
                console.log("Use the first joint instead.");
            } else {
                console.log("The map is invalid.");
            }
        }
        
        if(end)
            return end(false, null);
    });
}

module.exports = SceneMangement;