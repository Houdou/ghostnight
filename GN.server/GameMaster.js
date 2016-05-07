var Tags = require('./Statics/Tags');
var Weather = require('./Statics/Weather');
var Logger = require('./Utils/Logger');

var GameMaster = function(settings, GEM){
    this.slotCount = 0;
    this.slots = new Array();
    
    this.jointCount = 0;
    this.joints = new Array();
    
    this.roadSignCount = 0;
    this.roadSigns= new Array();
    
    this.heroCount = 0;
    this.hero = null;
    this.heroSelect = "Nekomata";
    this.heroRebornTimeout = -1;
    
    this.cdof = [];
    this.cds = [];
    // Copy the value;
    const _CDS = require('./Statics/CD');
    for(var u in _CDS)
    	this.cds[u] = _CDS[u];
    
    this.unitCount = 0;
    this.units = new Array();
    
    this.ensignCount = 0;
    this.ensigns = new Array();
    
    this.blockerCount = 0;
    this.blockers = new Array();
    
    this.towerCount = 0;
    this.towers = new Array();
    
    this.life = -1;
    this.maxlife = -1;
    this.goals = new Array();
    
    this.weather = Weather.night;
    this.time = -1;
    this.gameover = true;
    this.tickNumber = -1;
    this.startTime = -1;
    this.timerInterval = -1;
    this.soul = settings.soul || 0;
    this.gold = settings.gold || 0;
    this.soulIncreasing = settings.soulIncreasing || {value: 1000, interval: 10};
    
    this.mapLoaded = false;
    this.settings = settings;
    this.GEM = GEM;
    
    this.ghostTotalDMG = 0;
    this.ghostKill = 0;
    this.huamnTotalDMG = 0;
    this.humanKill = 0;
    this.statistics = {};
    
    this.debug = settings.debug || false;
    
    this.logger = new Logger({fileName: "Room" + this.settings.Room + ".txt"}, {settings: this.settings});
};
GameMaster.prototype.StartTiming = function() {
    var that = this;
    
    if(this.startTime == -1) {
        this.time = 0;
        this.startTime = (new Date()).getTime();
        this.gameover = false;
        
        this.tickNumber = 0;
        
        this.timerInterval = setInterval(function(){
            that.time = (new Date()).getTime() - that.startTime;
            
            // Econ system
            that.tickNumber++;
            if (that.tickNumber % that.soulIncreasing.interval == 0) {
            	
            	that.AddSoul(that.soulIncreasing.value);
            }
            // console.log("tickNumber", that.tickNumber);
            console.log(that.time);
            
            if(that.time >= that.settings.TimeLimit * 1000) {
            	that.GameEnd('timeout');
            	//that.GEM.emit('game-end', {type: 'timeout', win: 'human'});
                //console.log("Time out");
                clearInterval(that.timerInterval);
            }
        }, 1000);
        return true;
    } else {
        return false;
    }
}
GameMaster.prototype.GameEnd = function(type){
	this.gameover = true;
	
	var win = '';
	switch (type){
		case 'timeout': 
			win = 'human';
			break;
		case 'nolife':
			win = 'ghost';
			break;
		default:
			console.log('Wrong type input');
	}
	this.GEM.emit('game-end', {type: type, win: win});
	clearInterval(this.timerInterval);
	
	function StopGameUnit(u) {
		if(u == null || u.isDead) { return; }
		// Moving
		u.canMove = false;
		clearTimeout(u.moveTimeout);
		// Attack
		clearInterval(u.attackInterval);
	}
	
	// Stop Unit
	this.units.forEach(StopGameUnit);
	// Stop Tower
	this.towers.forEach(StopGameUnit);
	// Stop Hero
	StopGameUnit(this.hero);
	// Stop ensigns
	this.ensigns.forEach((e)=>{clearTimeout(e.removeTimeout)});
	
	console.log(this.statistics);
}

// Econ system
GameMaster.prototype.InitMoney = function() {
	this.GEM.emit('soul-update', {ok: true, soul: this.soul});
	this.GEM.emit('gold-update', {ok: true, gold: this.gold});
}
GameMaster.prototype.AddSoul = function (value) {
	if (this.debug) console.log('AddSoul', value);
	this.soul += value;
	this.GEM.emit('soul-update', {ok: true, soul: this.soul});
	return this.soul;
}
GameMaster.prototype.SubSoul = function (value) {
	if (value > this.soul) {
		if (this.debug) console.log('Soul not enough', value);
		this.GEM.emit('soul-update', {ok: false, soul: this.soul});
		return -1;
	} else {
		if (this.debug) console.log('SubSoul', value);
		this.soul -= value;
		this.GEM.emit('soul-update', {ok: true, soul: this.soul});
		return this.soul;
	}
}
GameMaster.prototype.AddGold = function (value) {
	if (this.debug) console.log('AddGold', value);
	this.gold += value;
	this.GEM.emit('gold-update', {ok: true, gold: this.gold});
	return this.gold;
}
GameMaster.prototype.SubGold = function (value) {
	if (value > this.gold) {
		if (this.debug) console.log('Gold not enough', value);
		this.GEM.emit('gold-update', {ok: false, gold: this.gold});
		return -1;
	} else {
		if (this.debug) console.log('SubGold', value);
		this.gold -= value;
		this.GEM.emit('gold-update', {ok: true, gold: this.gold});
		return this.gold;
	}
}

GameMaster.prototype.UnitReachEnd = function(value, jid) {
	for(var i = 0; i < this.goals.length; i++) {
		if(this.goals[i].jid == jid && this.goals[i].life > 0) {
			if(value > this.goals[i].life)
				value = this.goals[i].life;
			
			this.goals[i].life -= 1;
			this.life -= 1;
			this.GEM.emit("goal-damage", {gid: i, goalLife: this.goals[i].life, life: this.life, maxlife: this.maxlife});
			
			if(this.debug)
				console.log("Goal " + i + " deduct life to " + this.goals[i].life);
			
			if(this.goals[i].life == 0) {
				console.log("Goal " + i + " dead");
				this.GEM.emit('goal-dead', {gid: i});
			}
			
			if(this.life == 0) {
				this.GameEnd('nolife')
			}
		}
	}
}

// CD system
GameMaster.prototype.ResetCoolDown = function(list) {
	list.forEach((type) => {
		this.UpdateCoolDown(type);
	});
}
GameMaster.prototype.CheckCoolDown = function(type) {
	return ((new Date()).getTime() >= this.cdof[type] + this.cds[type]);
}
GameMaster.prototype.UpdateCoolDown = function(type) {
	var time = (new Date()).getTime();
	this.cdof[type] = time;
	this.GEM.emit('button-cd', {type: type, duration: this.cds[type]});
}
GameMaster.prototype.CancelCoolDown = function(type) {
	this.cdof[type] = 0;
}
GameMaster.prototype.SetWeather = function(newWeather, duration) {
    this.weather = newWeather;
    var that = this;
    this.weatherTimeout = setTimeout(function(){
        that.weather = Weather.night;
    }, duration);
    
    if(this.debug)
    	console.log("The weather is changed to " + this.weather);
}
// Unit function
GameMaster.prototype.findPathTo = function(j, at) {
    var path = new Array();
    var list = new Array();
    var end = false;
    
    this.joints.forEach(function(joint) {
        joint.visited = false;
        joint.prev = null;
    })
    
    if(at == j) return [j];
    at.visited = true;
    
    for(var i = 0; i < at.nbs.length; i++) {
        if(at.nbs[i] != j) {
        	at.nbs[i].prev = at;
        	list.push(at.nbs[i]);
        }
        else
            return [j];
    }
    
    while(list.length > 0 && !end){
    	var node = list[0];
    	if(node.visited) { list.shift(); continue; }
    	
    	var newNodes = node.getDests(node.prev);
    	for(var i = 0; i < newNodes.length; i++) {
    		newNodes[i].prev = node;
    		
    		if(newNodes[i] != j) {
    			list.push(newNodes[i]);
    		} else {
    			end = true;
    			break;
    		}
    	}
    	
    	node.visited = true;
    	list.shift();
    }
    
    if(end) {
	    var node = j;
	    while(node != null) {
	    	path.unshift(node);
	    	node = node.prev;
	    }
	    path.shift();
	    return path;
    } else {
    	return [at];
    }
}
GameMaster.prototype.findNearestJoint = function(at, maxDistance) {
    var d = maxDistance;
    var j = null;
    
    this.joints.forEach(function(joint) {
        var nd = at.DistanceTo(joint.transform);
        if (nd < d) {
            j = joint;
            d = nd;
        }
    });

    return j;
}
GameMaster.prototype.findLastUnit = function(minDistance) {
    var d = minDistance;
    var u = null;
    
    this.units.forEach(function(unit) {
        if(unit.isDead || unit.reachEnd) { return }
        
        var nd = unit.transform.x;
        if (nd > d) {
            u = unit;
            d = nd;
        }
    });

    return u;
}
GameMaster.prototype.assignSlotID = function () {
    return this.slotCount++;
};
GameMaster.prototype.assignJointID = function () {
    return this.jointCount++;
};
GameMaster.prototype.assignSignID = function () {
    return this.roadSignCount++;
};
GameMaster.prototype.assignBlockerID = function () {
    return this.blockerCount++;
};
GameMaster.prototype.assignHeroID = function () {
    return this.heroCount++;
};
GameMaster.prototype.assignUnitID = function () {
    return this.unitCount++;
};
GameMaster.prototype.assignEnsignID = function () {
    return this.ensignCount++;
}
GameMaster.prototype.assignTowerID = function () {
    return this.towerCount++;
};
// Log system
GameMaster.prototype.InitStatistics = function(list) {
	for(var i in list) {
		this.statistics[list[i]] = {build: 0, dmg: 0};
	}
}
GameMaster.prototype.LogCreate = function(side, type, id) {
	this.time = (new Date()).getTime() - this.startTime;
	this.logger.Log(this.time, side, "CREATE", type + " at " + id);
	
	// Statistics
	this.statistics[type].build += 1;
}
GameMaster.prototype.LogDamage = function(source, target, dmg) {
    this.time = (new Date()).getTime() - this.startTime;
    this.logger.Log(this.time, source.name , ((dmg > 0)?"ATTACK":"HEAL"), 
        target.name + " " + dmg + " to " + target.hp);
    
    // Statistic
    if(source.tag == Tags.unit || source.tag == Tags.tower)
    	this.statistics[source.name.substr(0, source.name.indexOf('-'))].dmg += dmg
   	else if(source.tag == Tags.hero)
   		this.statistics[source.name].dmg += dmg
    
    if(source.tag == Tags.unit || source.tag == Tags.hero) {
        this.ghostTotalDMG += dmg;
    } else {
        this.humanTotalDMG += dmg;
    }
}
GameMaster.prototype.LogDeath = function(source, killedBy) {
    this.time = (new Date()).getTime() - this.startTime;
    this.logger.Log(this.time, source.name , "DIE", "killed by " + killedBy.name);
    
    // Statistic
    if(killedBy.Tags == Tags.unit || killedBy.tag == Tags.hero) {
        this.ghostKill++;
    } else {
        this.humanKill++;
    }
}
GameMaster.prototype.LogBuff = function(source, buffType, buffMultiplier) {
    this.time = (new Date()).getTime() - this.startTime;
    this.logger.Log(this.time, source.name , ((buffMultiplier > 1)?"BUFF":"NERF"),
        buffType + " x" + buffMultiplier);
}

module.exports = GameMaster;