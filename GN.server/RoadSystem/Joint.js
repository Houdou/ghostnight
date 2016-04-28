var GameObject = require('../GameObject');
var Tags = require('../Statics/Tags');

// Class Joint : GameObject
var Joint = function(id, x, y, GM) {
    this.jid = id;
    
    GameObject.call(this, "_J" + this.jid, Tags.joint, x, y, GM);
    // var
    var that = this;
    this.nbs = [];
    this.dest = null;
    
    // path finding
    this.visited = true;
    this.prev = null;
    
    this.blocker = null;
    
    this.distances = [];
    
    
    this.GM.slots.forEach(function(slot) {
        that.distances.push(slot.transform.DistanceTo(that.transform));
    });
    
    // For NodeJS inspect
    this.inspect = function(depth) {
        var str = '';
        if(depth <= 0)
            str += '{"jid": ' + this.jid + "}";
        else {
            str += '{';
                str += '"jid": ' + this.jid + ', ';
                
                str += '"nbs": ';
                if(depth <= 1)
                    str += '"Joint[' + this.nbs.length + ']"' + ', ';
                else {
                    str += '[';
                    for(var i = 0; i < this.nbs.length; i++) {
                        str += this.nbs[i].inspect(0);
                        if(i + 1 != this.nbs.length) str += ', ';
                    }   
                    str += ']' + ', ';
                }
                
                if(this.dest != null)
                    str += '"dest": ' + this.dest.inspect(0) + ', ';
                else
                    str += '"dest": null' + ', ';
                
                if(this.blocker != null)
                    str += '"blocker": ' + this.blocker.inspect(1) + ', ';
                else
                    str += '"blocker": null' + ', ';
                
                if(depth <= 1)
                    str += '"distances": "float[' + this.distances.length + ']" ';
                else
                    str += '"distances": [' + this.distances.join(', ') + '] '
            str += '}';
        }
        return str;
    }
    
}
Joint.prototype = new GameObject();
// functions
Joint.prototype.AttachTo = function(joint) {
    this.nbs.push(joint);
    joint.nbs.push(this);

    if (joint.dest == null) {
        joint.dest = this;
    }
}
Joint.prototype.Next = function() {
    return this.dest;
}

Joint.prototype.findPath = function(from, to) {
    var list = new Array();
    
    for(var i = 0; i < this.nbs.length; i++) {
        if (this.nbs[i].visited) { continue; }
        
        if (this.nbs[i] == to)
            return [this, to];
        else if (this.nbs[i] == from)
            continue;
        else
            list.push(this.nbs[i]);
    }
    
    for(var i = 0; i < list.length; i++) {
        list[i].visited = true;
        var path = list[i].findPath(this, to);
        
        if(path != null) {
            path.unshift(this);
            return path;
        }
    }
    return null;
};
Joint.prototype.getDests = function(from) {
    var dests = new Array();
    for(var i = 0; i < this.nbs.length; i++) {
        if(this.nbs[i] == from)
            continue;
        else
            dests.push(this.nbs[i]);
    }
    return dests;
}

Joint.prototype.FindNearestTower = function(range) {
    var tower = null;
    var d = 9999;
    for(var i = 0; i < this.distances.length; i++) {
        if(this.GM.slots[i].tower != null) {
            if(!this.GM.slots[i].tower.isDead && this.distances[i] <= range && this.distances[i] < d) {
                tower = this.GM.slots[i].tower;
                d = this.distances[i];
            }
        }
    }
    return tower;
}
Joint.prototype.GetDistances = function() {
    return this.distances;
}
Joint.prototype.SteppedBy = function(unit) {
    //Notice all the towers
    for(var i = 0; i < this.distances.length; i++) {
        if (this.GM.slots[i].tower != null) {
            if (this.distances[i] <= this.GM.slots[i].tower.range) {
                this.GM.slots[i].tower.Sight(unit);
                
                //DEBUG
                console.log("Tower: " + this.GM.slots[i].tower.name + " sight " + unit.name);
                //DEBUG
            }
        }
    }
    
    return this.blocker;
}
module.exports = Joint;