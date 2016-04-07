var GhostNight = function(settings, GEM) {
    // Game setup
    this.GM = new (require("./GameMaster"))(settings, GEM);
    this.Scene = new (require('./Setup/Scene'))(this.GM);
    
    // Player setup
    // this.SetupGhost = require('./Setup/Ghost');
    // this.SetupHuman = require('./Setup/Human');
    
    // Game object
    this.GNObjects = new (require('./GNObjects'))(this.GM);
    this.Transform = require('./Transform');
    
    // Road system
    this.Slot = require('./RoadSystem/Slot');
    this.Joint = require('./RoadSystem/Joint');
    this.RoadSign = require('./RoadSystem/RoadSign');
    this.Blocker = require('./Blocker');
    
    // Sockets
    this.ghost = null;
    this.human = null;
    
};

GhostNight.prototype.StartGame = function() {
    if(this.GM.mapLoaded) {
        this.GM.StartTiming();
        this.GM.ResetCoolDown(this.GNObjects.GetGameUnitList());
        this.SetHeroReborn();
        return true;
    } else {
        return false;
    }
}

// Ghost side
// Unit
GhostNight.prototype.CreateUnit = function(type) {
    // Validation: check cooldown time in GameMaster
    console.log(0 + this.GM.cdof[type] + this.GM.cds[type]);
    console.log((new Date()).getTime());
    
    if(this.GM.CheckCoolDown(type)) {
        if(this.GM.startTime != -1) {
            if (this.GM.SubSoul (this.GNObjects._UNIT[type].price) != -1) {
                var entryJoint = this.GM.entryJoint;
                // Get the class from GNObjects and create new unit
                var newUnit = new (this.GNObjects.GetUnitType(type))(
                    entryJoint.transform.x, entryJoint.transform.y, entryJoint);
                this.GM.units.push(newUnit);
                // Update created time;
                this.GM.UpdateCoolDown(type);
                // Start moving at beginning
                newUnit.Move();
                return newUnit;
            } else {
                console.log("Soul insufficient");
                return null;
            }
        }
        console.log("The game havn't started.");
        return null;
    } else {
        console.log("Still cooling down for " + type);
        return null;
    }
}
GhostNight.prototype.TurnRoadSign = function(roadSignID) {
    if(this.GM.roadSigns[roadSignID] != undefined)
        this.GM.roadSigns[roadSignID].Turn();
}
// Hero
GhostNight.prototype.SetHeroReborn = function() {
    setTimeout(()=>{this.RebornHero(false)}, this.GM.cds['Hero']);
    this.GM.GEM.emit('hero-select', {type: this.GM.heroSelect});
}
GhostNight.prototype.RebornHero = function(pay) {
    if(this.GM.hero == null) {
        if(!pay)
            this.GM.CancelCoolDown('Hero');
        var hero = this.CreateHero(this.GM.heroSelect);
        this.GM.GEM.emit('hero-reborn', {type: this.GM.heroSelect, x: hero.transform.x, y: hero.transform.y})
        // Reset CD time for skills
        hero.ResetSkill();
        this.GM.cds['Hero'] *= 1.5;
    }
}
GhostNight.prototype.CreateHero = function(type) {
    // Validation: ???
    if(this.GM.startTime != -1) {
        // TODO CheckCoolDown(HERO). MAYBE bug
        if(this.GM.CheckCoolDown('Hero') || this.GM.SubSoul(this.GNObjects._HERO[type].price) != -1) { // TYPE ???
            // Reset coolDown
            var entryJoint = this.GM.entryJoint;
            // Get the class from GNObjects
            var newHero = new (this.GNObjects.GetHeroType(type))(
                entryJoint.transform.x, entryJoint.transform.y, entryJoint);
            this.GM.hero = newHero;
            return newHero;
        } else {
            console.log('Still cooling down or not enough money');
            return null;
        }
    } else {
        console.log("The game havn't started.");
        return null;
    }
}

GhostNight.prototype.MoveHeroTo = function(jid) {
    // Find jid in the game master
    var joint = this.GM.joints[jid];
    // Move the hero
    if(joint != undefined && this.GM.hero != null && !this.GM.hero.isDead) {
        // Call game master to find the path to the position
        console.log('Move hero path:');
        var path = this.GM.findPathTo(joint, this.GM.hero.joint)
        if(this.GM.debug)
            console.log(path);
        if (path.length > 0) {
            this.GM.hero.Move(path);
        }
    }
}
GhostNight.prototype.UseHeroSkill = function(skillID, data) {
    if(!this.GM.hero.isDead) {
        return this.GM.hero.Skill(skillID, data);
    } else {
        return false;
    }
}
GhostNight.prototype.ChangeHeroSelection = function(type) {
    if(this.GNObjects.GetHeroType(type) != null) {
        this.GM.heroSelect = type;
        this.GM.GEM.emit('hero-select', {type: type});
    }
}

// Human side
// Ensign
GhostNight.prototype.CreateEnsign = function(type, jid) {
    // Validation: check cooldown time in GameMaster
    if(this.GM.CheckCoolDown(type)) {
        // Find jid in the game master
        var joint = this.GM.joints[jid];
        if(joint != undefined && this.GM.startTime != -1) {
            if (this.GM.SubGold (this.GNObjects._ENSIGN[type].price) != -1) {
                // Get the class from GNObjects and create new ensign
                var newEnsign = new (this.GNObjects.GetEnsignType(type))(
                    joint.transform.x, joint.transform.y, joint);
                this.GM.ensigns.push(newEnsign);
                // Update created time;
                this.GM.UpdateCoolDown(type);
                // Start buff effect
                newEnsign.Effect();
                return newEnsign;
            } else {
                console.log("Gold insufficient");
                return null;
            }
        } else {
            console.log("The game havn't started.");
            return null;
        }
    } else {
        console.log("Still cooling down for " + type);
        return null;
    }
}
// Tower
GhostNight.prototype.CreateTower = function(type, slotID) {
    var slot = this.GM.slots[slotID];
    // Validation: check if slotID exists
    if(slot == undefined) {
        console.log("Fail to build tower: Invalid SlotID");
        return null;
    }
    
    // Validation: check cooldown time in GameMaster
    if(this.GM.CheckCoolDown(type)) {
        // Validation: check slot's canBuild property
        if(slot.canBuild) {
            if (this.GM.SubGold (this.GNObjects._TOWER[type].price) != -1) {
                // Get the class from GNObjects and create new tower
                var newTower = new (this.GNObjects.GetTowerType(type))(slot);
                // Update the slot state
                slot.BuildTower(newTower);
                this.GM.towers.push(newTower);
                // Update created time;
                this.GM.UpdateCoolDown(type);
                return newTower;
            } else {
                console.log("Gold insufficient");
                return null;
            }
        } else
        console.log("Slot cannot build");
            return null;
    } else {
        console.log("Still cooling down for " + type);
        return null;
    }
}
GhostNight.prototype.RemoveTower = function(slotID) {
    var slot = this.GM.slots[slotID];
    if(slot != undefined)
        slot.ResetTower();
}
module.exports = GhostNight;