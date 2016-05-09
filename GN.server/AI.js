const EventEmitter = require('events');
const util = require('util');
var gameSettings = {
	m01:{level: 1, slotNum: 4, destNum: 2},
	m02:{level: 2, slotNum: 6, destNum: 3},
	m03:{level: 3, slotNum: 9, destNum: 1}
}
var towerLists = {
    	m01:
    	[
	    	['Inugami', 'Ebisu', 'Asura', 'Snake', 'Amaterasu', 'Inari', 'Miko'],
	    	['Inugami', 'Ebisu', 'Asura', 'Snake', 'Amaterasu', 'Inari', 'Miko'],
	    	['Inugami', 'Ebisu', 'Asura', 'Snake', 'Amaterasu', 'Inari', 'Miko'],
	    	['Inugami', 'Ebisu', 'Asura', 'Snake', 'Amaterasu', 'Inari', 'Miko']
    	],
    	m02:
    	[
	    	[],
	    	[],
	    	[],
	    	[]
    	],
    	m03:
    	[
	    	[],
	    	[],
	    	[],
	    	[]
    	 ]
    };
var AI = function(room) {
    EventEmitter.call(this);
    this.room = room;
    this.set = gameSettings[room.map];
    
    // Time
    this.timerInterval;
    this.startTime = 0;
    
    // States
    this.goldState = 0; // -1:tight, 0:normal, 1:sufficient
    this.situState = 0; // -1:tense, 0:normal, 1:relax
    
    // Game data
    this.gold = 0;
    this.lifes = [];
    this.hero = {alive: false, type: '', hp: 0, x: 0, y: 0};
    this.units = [];
    this.slots = [];
    
    
    
    var that = this;
    function BuildTower(type, sid) {
        that.emit('build-tower', {type: type, sid: sid});
    }
    function BuildEnsign(type, jid) {
        that.emit('build-ensign', {type: type, jid: jid});
    }
    
    // Default buildings
    function initBuild() {
	    setTimeout(()=>{BuildTower('Inugami', 0);}, 9000);
	    setTimeout(()=>{BuildTower('Snake', 1);}, 10000);
	    //setTimeout(()=>{BuildTower('Inugami', 2);}, 11000);
	    //setTimeout(()=>{BuildTower('Inugami', 3);}, 12000);
	    
		//setTimeout(()=>{BuildEnsign('Atk', 12);}, 10000);
    }
    
    function startThinking() {
    	that.timerInterval = setInterval(() => {
            think();
        }, 500);
    }
    
    function stopThinking() {
    	clearInterval(that.timerInterval);
    }
    
    function think() {
    	console.log('im thinking');
    	
    	// build tower
    	for (var i in that.slots) {
    		var slot = that.slots[i];
    		if (slot == null || !slot.hasTower) {
    			// can build in slot
    			//what & when to build
    		}
    	}
    	
    	// build ensign
    	
    }

    // assisting methods
    function goldStateJudge() {
    	if (that.gold < 700 && getSlotsVacancy() != 0) {
    		that.goldState = -1;
    	}
    }
    // 

    function situStateJudge() {
    	
    }
    
    function getSlotsVacancy() {
    	var vNum = 0;
    	for (var i in that.slots){
    		var slot = that.slots[i];
    		if (slot == null || !slot.hasTower){
    			vNum++; 
    		}
    	}
    	return vNum;
    }
    
	this.on('game-started', function() {
	    that.startTime = (new Date()).getTime();
	    initBuild();
	    setTimeout(()=>startThinking(), 12000);
	});
	
	this.on('game-end', function(data) {
	    that.stopThinking();
	});
	
	this.on('roadsign-built', function(data) {
	   // gnclient.BuildRoadSign(data);
	});
	
	this.on('roadsign-changed', function(data) {
	   // gnclient.ChangeRoadSign(data);
	});
	
	this.on('goal-life-bar-built', function() {
	   // gnclient.BuildGoalLife();
	});
	
	this.on('goal-built', function(data) {
	   // gnclient.BuildGoal(data);
	});
	
	this.on('goal-damage', function(data) {
// 		gnclient.UpdateGoalLife(data);
	});
	
	this.on('goal-dead', function(data) {
// 		gnclient.RemoveGoal(data);
	});
	
	this.on('button-cd', function(data){
// 		gnclient.CoolDownEffect(data);
	});
	
	this.on('map-data', function(data) {
// 		gnclient.mapData = data;
	});
	
	this.on('soul-update', function(data) {
// 		if (gnclient.side == 'ghost'){
// 			gnclient.soul = data.soul;
// 			gnclient.UpdateText('money', {text: "" + data.soul});
// 			if (!data.ok){
// 				console.log('Insufficient money');
// 			}
// 		}
	});
	
	this.on('gold-update', function(data) {
		that.gold = data.gold;
// 		if (gnclient.side == 'human'){
// 			gnclient.gold = data.gold;
// 			gnclient.UpdateText('money', {text: "" + data.gold});
// 			if (!data.ok){
// 				console.log('Insufficient money');
// 			}
// 		}

	});
	
	// Unit
	this.on('unit-created', function(data) {
		//data = {uid, type, x, y}
		that.units[data.uid] = data;
		
// 		gnclient.BuildUnit(data);
	});
	
	this.on('unit-moving', function(data) {
		// data = {uid, x, y, duration}
		if (that.units[data.uid] == undefined){console.log('wrong unit id');return;}
		that.units[data.uid].x = data.x;
		that.units[data.uid].y = data.y;
// 		gnclient.MoveUnitTo(data);
	});
	
	this.on('unit-attack', function() {
		console.log('');
	});
	
	this.on('unit-hp-update', function(data) {
		if (that.units[data.id] == undefined){console.log('wrong unit id');return;}
		that.units[data.id].hp = data.hp;
// 		gnclient.UpdateHPBar('unit', data);
	});
	
	this.on('unit-buff', function(data) {
		//console.log('');
	});
	
	this.on('unit-dead', function(data) {
		// data = {id: this.id, dmg: dmg}
		if (that.units[data.id] == undefined){console.log('wrong unit id');return;}
		that.units[data.id] = undefined;
// 		gnclient.RemoveUnit(data);
	});
	
	this.on('unit-remove', function(data) {
		// data = {uid}
		if (that.units[data.uid] == undefined){console.log('wrong unit id');return;}
		that.units[data.uid] = undefined;
// 		gnclient.RemoveUnit(data);
	});
	
	// Hero
	this.on('hero-moving', function(data) {
		if (that.hero == null || !that.hero.alive){console.log('wrong hero data');return;}
		that.hero.x = data.x;
		that.hero.y = data.y;
// 		gnclient.MoveHeroTo(data);
	});
	
	// this.on('hero-arrived', function(){
	//     console.log('');
	// });
	
	this.on('hero-skill', function(data) {
		//console.log('');
	});
	
	this.on('hero-attack', function(data) {
		//console.log('');
	});
	
	this.on('hero-skill-cd', function(data) {
// 		data.type = gnclient.heroName + '-Skill' + data.skillID;
	   // gnclient.CoolDownEffect(data);
	});
	
	this.on('hero-hp-update', function(data) {
		if (that.hero == null || !that.hero.alive){console.log('wrong hero data');return;}
		that.hero.hp = data.hp;
// 		gnclient.UpdateHPBar('hero', data);
	});
	
	this.on('hero-buff', function(data) {
		//console.log('');
	});
	
	this.on('hero-dead', function(data) {
		if (that.hero == null || !that.hero.alive){console.log('wrong hero data');return;}
		that.hero.alive = false;
		that.hero.hp = 0;
// 		gnclient.RemoveHero(data);
// 		gnclient.TogglePanel('panel-Reborn');
	});
	
	this.on('hero-select', function(data) {
// 		gnclient.DrawHeroSelection(data);
	})
	
	this.on('hero-reborn', function(data) {
		// data = {type, x, y}
		that.hero.alive = true;
		that.hero.type = data.type;
		that.hero.x = data.x;
		that.hero.y = data.y;
		
// 		gnclient.BuildHero(data);
// 		gnclient.TogglePanel('panel-' + data.type);
	});
	
	this.on('hero-reborn-cd', function(data) {
		
	});
	
	// Tower
	this.on('tower-built', function(data) {
		//data = {tid, type, sid}
		that.slots[data.sid] = {hasTower: true, type: data.type, tid: data.tid, hp: 0}
// 		gnclient.BuildTower(data);
	});
	
	this.on('tower-attack', function(data) {
		console.log('');
	});
	
	this.on('tower-buff', function(data) {
		console.log('');
	});
	
	this.on('tower-hp-update', function(data) {
		// dat = {id, tag, hp, maxhp, dmg, type: 'damage'/'heal'}
		for (var i in that.slots){
			if (that.slots[i].hasTower){
				if (that.slots[i].tid == data.id){
					that.slots[i].hp = data.hp;
				}
			}
		}
// 		gnclient.UpdateHPBar('tower', data);
	});
	
	this.on('tower-dead', function(data) {
		// data = {id, dmg});
		for (var i in that.slots){
			if (that.slots[i].hasTower){
				if (that.slots[i].tid == data.id){
					that.slots[i].hasTower = false;
					that.slots[i].hp = 0;
				}
			}
		}
	});
	
	// Blocker
	this.on('blocker-built', function(data) {
		data.type = 'Blocker';
// 		gnclient.BuildBlocker(data);
	});
	
	this.on('blocker-buff', function(data) {
		
	});
	
	this.on('blocker-hp-update', function(data) {
// 		gnclient.UpdateHPBar('blocker', data);
	});
	
	this.on('blocker-dead', function(data) {
// 		gnclient.RemoveBlocker(data);
	});
	
	this.on('ensign-built', function(data) {
// 		gnclient.BuildEnsign(data)
	});
	
	this.on('ensign-removed', function(data) {
// 		gnclient.RemoveEnsign(data);
	});
	
	this.on('message-send', function(data) {
	    console.log(data.side + ": " + data.message);
	});
}
util.inherits(AI, EventEmitter);

module.exports = AI;