var GN = GN || {};

(function(){
    "use strict";
    
    // Class Joint : GameObject
    var Joint = function(x, y) {
        this.jid = GN.GM.assignJointID();
    
        GN.GameObject.call(this, "_J" + this.jid, GN.Tags.joint, x, y);
        // var
        var that = this;
        this.nbs = [];
        this.dest = null;
    
        this.distances = [];
        GN.GM.slots.forEach(function(slot) {
            that.distances.push(slot.transform.DistanceTo(that.transform));
        });
    
        GN.GM.joints.push(this);
    };
    
    // static methods
    Joint.FindPathTo = function (j, at) {
        var path = new Array();
        
        GN.GM.joints.forEach(function(joint) {
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
            var p = list[i].FindPath(at, j);
            list[i].visited = true;
            if(p != null)
                path = p;
        }
        return path;
    };
    
    Joint.FindNearest = function (at, maxDistance) {
        var d = maxDistance;
        var j = null;
        
        GN.GM.joints.forEach(function(joint) {
            var nd = at.DistanceTo(joint.transform);
            if (nd < d) {
                j = joint;
                d = nd;
            }
        })
    
        return j;
    };
    
    var p = GN.extend(Joint, GN.GameObject);
    
    // public methods
    p.AttachTo = function(joint) {
        this.nbs.push(joint);
        joint.nbs.push(this);
    
        if (joint.dest == null) {
            joint.dest = this;
        }
    };
    
    p.Next = function() {
        return this.dest;
    };
    
    p.FindPath = function(from, to) {
        var list = new Array();
        for(var i = 0; i < this.nbs.length; i++) {
            if (this.nbs[i].visited)
                continue;
            
            if (this.nbs[i] == to)
            {
                console.log([this, to]);
                return [this, to];
            }
            else if (this.nbs[i] == from)
                continue;
            else
                list.push(this.nbs[i]);
        }
        for(var i = 0; i < list.length; i++) {
            var path = list[i].FindPath(this, to);
            list[i].visited = true;
            if(path != null) {
                path.unshift(this);
                return path;
            }
        }
        return null;
    };
    
    p.GetTowers = function(range) {
        var towerBitMask = 0b0;
        for (var i = 0; i < this.distances.length; i++) {
            if (GN.GM.slots[i].tower != null) {
                if (this.distances[i] <= range) {
                    towerBitMask = towerBitMask | (1 << i);
                }
            }
        }
        return towerBitMask;
    };
    
    p.GetDistances = function() {
        return this.distances;
    };
    
    p.SteppedBy = function(unit) {
        //Notice all the towers
        for(var i = 0; i < this.distances.length; i++) {
            if (GN.GM.slots[i].tower != null) {
                if (this.distances[i] <= GN.GM.slots[i].tower.range) {
                    GN.GM.slots[i].tower.Sight(unit);
                    
                    //DEBUG
                    console.log("Tower: " + GN.GM.slots[i].tower.name + " sight " + unit.name);
                    //DEBUG
                }
            }
        }
    };
    
    GN.Joint = Joint;
    
}());