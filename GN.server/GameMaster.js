var Weather = require('./Statics/Weather.js');

var GM = {
    unitCount: 0,
    assignUnitID: function () {
        return GM.unitCount++;
    },
    jointCount: 0,
    joints: [],
    assignJointID: function () {
        return GM.jointCount++;
    },
    roadSignCount: 0,
    assignSignID: function () {
        return GM.roadSignCount++;
    },
    slotCount: 0,
    slots: [],
    assignSlotID: function () {
        return GM.slotCount++;
    },
    weather: Weather.Night,
    time: 0,
    soul: 0,
    gold: 0,
    
    settings: {
        MinDamage: 1
    }
};

module.exports = GM;