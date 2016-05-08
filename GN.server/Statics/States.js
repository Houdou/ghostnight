// Static Class State
var States = {
    normal: 0b0,
    paralyzed: 1 << 0,
    fire: 1 << 1,
    sound: 1 << 2
};

States[0b0] = 'normal';
States[1 << 0] = 'paralyzed';
States[1 << 1] = 'fire';
States[1 << 2] = 'sound';

module.exports = States;