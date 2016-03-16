var Transform = require('./Transform');

// Class GameObject
// variables
var GameObject = function(name, tag, x, y) {
    this.transform = new Transform(x, y);
    this.name = name;
    this.tag = tag;
}
// functions
GameObject.prototype.funA = function() {
    //...
}

module.exports = GameObject;