var Transform = require('./Transform');

// Class GameObject
// variables
var GameObject = function(name, tag, x, y, GM) {
    this.transform = new Transform(x, y);
    this.name = name;
    this.tag = tag;
    this.GM = GM;
}
module.exports = GameObject;