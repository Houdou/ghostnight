var GN = GN || {};

(function(){
    "use strict";
    
    // Class Transform
    var Transform = function(x, y) {
        this.x = x;
        this.y = y;
    }
    
    // Static methods
    Transform.DistanceBetween = function(ta, tb){
        var dx, dy;
        dx = ta.x - tb.x;
        dy = ta.y - tb.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    
    var p = Transform.prototype;
    
    // Public methods
    p.DistanceTo = function() {
        if (arguments[0] instanceof Transform) {
            var target = arguments[0];
            var dx, dy, d;
            dx = target.x - this.x;
            dy = target.y - this.y;
            d = Math.sqrt(dx * dx + dy * dy);
            return d;
        }
        else if (arguments.length == 2) {
            var dx, dy, d;
            dx = arguments[0] - this.x;
            dy = arguments[0] - this.y;
            d = Math.sqrt(dx * dx + dy * dy);
            return d;
        }
    }
    
    p.DistanceSquare = function() {
        if (arguments[0] instanceof Transform) {
            var target = arguments[0];
            var dx, dy, d2;
            dx = target.x - this.x;
            dy = target.y - this.y;
            d2 = dx * dx + dy * dy;
            return d2;
        }
        else if (arguments.length == 2) {
            var dx, dy, d2;
            dx = arguments[0] - this.x;
            dy = arguments[0] - this.y;
            d2 = dx * dx + dy * dy;
            return d2;
        }
    }
    
    p.Move = function() {
        if (arguments.length == 1) {
            this.x += arguments[0].x;
            this.y += arguments[0].y;
        }
        else if (arguments.length == 2) {
            this.x += arguments[0];
            this.y += arguments[1];
        }
    }
    
    p.MoveTo = function(target) {
        this.x = target.x;
        this.y = target.y;
    }
    
    GN.Transform = Transform;
    
}());