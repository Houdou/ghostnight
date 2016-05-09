const EventEmitter = require('events');
const util = require('util');
var gameSettings = {
	m01:{level: 1, slotNum: 4, destNum: 2},
	m02:{level: 2, slotNum: 6, destNum: 3},
	m03:{level: 3, slotNum: 9, destNum: 1}
}
// for random tower
const allTowers = ['Miko', 'Inari', 'Inugami', 'Ebisu', 'Snake', 'Asura', 'Amaterasu'];
const cheapTowers = ['Miko', 'Inari', 'Inugami'];
const atkTowers = ['Asura', 'Amaterasu'];
const specialTowers = ['Inugami', 'Snake', 'Ebisu'];
const skyTowers = ['Inari', 'Inugami', 'Amaterasu'];
const ensigns = ['Atk', 'Def', 'Rng']
function getRandomFrom(col){
	return col[Math.floor(Math.random() * col.length)];
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
    this.timerInterval = -1;
    this.startTime = 0;
    
    // States
    this.goldState = 0; // -1:tight, 0:normal, 1:sufficient
    this.situState = 0; // -1:tense, 0:normal, 1:relax
    
    // Game data
    this.gold = 0;
    this.goals = [];
    this.hero = {alive: false, type: '', hp: 0, x: 0, y: 0};
    this.units = [];
    this.slots = [];
    this.ensigns = [];
    
    this.unitsNum = {};
    
    
    
    var that = this;
    function BuildTower(type, sid) {
        that.emit('build-tower', {type: type, sid: sid});
    }
    function BuildEnsign(type, jid) {
        that.emit('build-ensign', {type: type, jid: jid});
    }
    function buildRandomEnsigns(ensignInfo, maxNum){
    	if (ensignInfo.num < maxNum){
    		for (var i = 0; i < maxNum; i++){
    			BuildEnsign(getRandomFrom(ensigns), ensignInfo.pos + i);
    		}
			ensignInfo.num += maxNum;
			setTimeout(function(){ensignInfo.num -= maxNum;}, 10000);
		}
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
    	//console.log('im thinking');
    	
    	getUnitsNum(); 
    	
    	goldStateJudge();
    	
    	build();
    	
    	// // build tower
    	// for (var i in that.slots) {
    	// 	var slot = that.slots[i];
    	// 	if (slot == null || !slot.hasTower) {
    	// 		// can build in slot
    	// 		//what & when to build
    	// 	}
    	// }
    	
    	// // build ensign
    	
    }

    // assisting methods
    function getUnitsNum(){
    	var unitsNum = {
    		all: 0
    	};
    	switch (that.set.level) {
    		case 1:
    			unitsNum = {
		    		all: 0, 
		    		s: 0,
		    		d0: {s: 0, e: 0},
		    		d1: {s: 0, e: 0}
		    	};
		    	var judgeX1 = 386; // before roadSign // joint id 19
		    	var judgeY1 = 400;
		    	var judgeX2 = 765; // dest0 reachless
		    	var judgeX3 = 796; // dest1 reachless
		    	for (var i in that.units){
		    		var unit = that.units[i];
		    		if (unit != undefined){
		    			if (unit.x < judgeX1){ // s
		    				unitsNum.s += 1;
		    			} else if (unit.y < 400){ // dest0
		    				if(unit.x < judgeX2){
		    					unitsNum.d0.s += 1;
		    				} else {
		    					unitsNum.d0.e += 1;
		    				}
		    			} else { // dest1
		    				if(unit.x < judgeX3){
		    					unitsNum.d1.s += 1;
		    				} else {
		    					unitsNum.d1.e += 1;
		    				}
		    			}
		    		}
		    	}
		    	unitsNum.all = unitsNum.s + unitsNum.d0.s + unitsNum.d0.e + unitsNum.d1.s + unitsNum.d1.e;
    			break;
    		case 2:
    			break;
    		case 3:
    			break;
    		default:
    			break;
    	}
    	that.unitsNum = unitsNum;
    	return unitsNum;
    }
    
    function unitsNumCut() {
    	switch (that.set.level){
    		case 1:
    			for (var i in that.goals){
    				if (that.goals[i] != null && !that.goals[i].alive){
    					that.unitsNum.all -= that.unitsNum['d'+i].s;
    					that.unitsNum.all -= that.unitsNum['d'+i].e;
    					that.unitsNum['d'+i].s = 0;
    					that.unitsNum['d'+i].e = 0;
    				}
    			}
    			break;
    		case 2:
    			break;
    		case 3:
    			break;
    		default:
    		
    	}
    }
    
    function goldStateJudge() {
    	if (that.gold < 700 && getSlotsVacancy() != 0) {
    		that.goldState = -1;
    	} else if (that.gold >= 1300 + 400 * (getSlotsVacancy() - that.set.level)) {
    		that.goldState = 1;
    	} else {
    		that.goldState = 0;
    	}
    }
    
    function build() {
    	switch (that.set.level) {
    		
    		case 1: // ******************** level 1 ******************** //
    			var ensign1 = {pos: 13, num: 0}; // slot 0
    			var ensign2 = {pos: 29, num: 0}; // slot 1 & 3
    			var ensign3 = {pos: 76, num: 0}; // slot 1 & 2
    			switch (that.goldState){
    				
    				case -1: // tight level 1
    					if (that.unitsNum.d0.e + that.unitsNum.d1.e >= 2){
    						if (that.goals[0] != null && !that.goals[0].alive){
    							BuildTower('Ebisu', 3);
    						}else if (that.goals[1] != null && !that.goals[1].alive){
    							BuildTower('Ebisu', 2);
    						}else if (that.slots[1].type != 'Ebisu'){
    							if (!that.slots[0].alive){
    								BuildTower('Ebisu', 0);
    							} else {
    								BuildTower('Ebisu', 1);
    							}
    						}
    					}
    					
    					if (that.unitsNum.d0.s + that.unitsNum.d1.s >= 3){
    						BuildTower('Snake', 1);
    						BuildTower('Inugami', 1);
    						BuildTower('Inari', 1);
    						BuildTower('Miko', 1);
    					} else if (that.unitsNum.d0.s + that.unitsNum.d1.s >= 1){
    						BuildTower('Inugami', 1);
    					}
    					
    					if (that.unitsNum.d0.s >= 1){
    						BuildTower('Inari', 3);
    						BuildTower('Miko', 3);
    					}
    					
    					if (that.unitsNum.d1.s >= 1){
    						BuildTower('Inari', 2);
    						BuildTower('Miko', 2);
    					}
    				
    					if (that.unitsNum.s >= 4){
    						BuildTower('Inugami', 0);
    						BuildTower('Inari', 0);
    						BuildTower('Miko', 0);
    						BuildTower('Snake', 1);
    						BuildTower('Inugami', 0);
    					} else if (that.unitsNum.s >= 2){
    						BuildTower('Inari', 0);
    						BuildTower('Miko', 0);
    					} else if (that.unitsNum.s >= 1){
    						//BuildTower('Miko', 0);
    					}
    					
    					break;
    					
    				case 1: // sufficient level 1
    					if (that.unitsNum.d0.e + that.unitsNum.d1.e >= 1){
    						if (that.goals[0] != null && !that.goals[0].alive){
    							BuildTower('Ebisu', 3);
    						}else if (that.goals[1] != null && !that.goals[1].alive){
    							BuildTower('Ebisu', 2);
    						}else if (that.slots[1].type != 'Ebisu'){
    							if (!that.slots[0].alive){
    								BuildTower('Ebisu', 0);
    							} else {
    								BuildTower('Ebisu', 1);
    							}
    						}
    					}
    					
    					if (that.unitsNum.d0.s + that.unitsNum.d1.s >= 3){
    						BuildTower('Snake', 1);
    					} 
    					
    					if (that.unitsNum.d0.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 3);
    						buildRandomEnsigns(ensign2, 2);
    						// if (ensign2.num < 2){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign2.pos);
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign2.pos + 1);
    						// 	ensign2.num += 2;
    						// 	setTimeout(function(){ensign2.num -= 2;}, 10000);
    						// }
    					} else if (that.unitsNum.d0.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 3);
    						buildRandomEnsigns(ensign2, 1);
    						// if (ensign2.num < 1){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign2.pos);
    						// 	ensign2.num += 1;
    						// 	setTimeout(function(){ensign2.num -= 1;}, 10000);
    						// }
    					} else {
    						if (Math.random() < 0.2){
    							BuildTower(getRandomFrom(allTowers), 3);
    						}
    						if (Math.random() < 0.1){
    							BuildTower(getRandomFrom(allTowers), 1);
    						}
    					}
    					
    					if (that.unitsNum.d1.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 2);
    						buildRandomEnsigns(ensign3, 2);
    						// if (ensign3.num < 2){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign3.pos);
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign3.pos + 1);
    						// 	ensign3.num += 2;
    						// 	setTimeout(function(){ensign3.num -= 2;}, 10000);
    						// }
    					} else if (that.unitsNum.d1.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 2);
    						buildRandomEnsigns(ensign3, 1);
    						// if (ensign3.num < 1){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign3.pos);
    						// 	ensign3.num += 1;
    						// 	setTimeout(function(){ensign3.num -= 1;}, 10000);
    						// }
    					} else {
    						if (Math.random() < 0.2){
    							BuildTower(getRandomFrom(allTowers), 2);
    						}
    						if (Math.random() < 0.1){
    							BuildTower(getRandomFrom(allTowers), 1);
    						}
    					}
    				
    					if (that.unitsNum.s >= 3){
    						BuildTower('Snake', 0);
    						buildRandomEnsigns(ensign1, 1);
    					} else if (that.unitsNum.s >= 1){
    						BuildTower(getRandomFrom(atkTowers), 0);
    					}
    					break;
    					
    				default: // normal level 1
    					if (that.unitsNum.d0.e + that.unitsNum.d1.e >= 1){
    						if (that.goals[0] != null && !that.goals[0].alive){
    							BuildTower('Ebisu', 3);
    						}else if (that.goals[1] != null && !that.goals[1].alive){
    							BuildTower('Ebisu', 2);
    						}else if (that.slots[1].type != 'Ebisu'){
    							if (!that.slots[0].alive){
    								BuildTower('Ebisu', 0);
    							} else {
    								BuildTower('Ebisu', 1);
    							}
    						}
    					}
    					
    					if (that.unitsNum.d0.s + that.unitsNum.d1.s >= 3){
    						BuildTower('Snake', 1);
    						
    					} 
    					
    					if (that.unitsNum.d0.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 3);
    						buildRandomEnsigns(ensign2, 1);
    						// if (ensign2.num < 2){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign2.pos);
    						// 	BuildEnsign(getRandomFrom(ensigns), ensign2.pos + 1);
    						// 	ensign2.num += 2;
    						// 	setTimeout(function(){ensign2.num -= 2;}, 10000);
    						// }
    					} else if (that.unitsNum.d0.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(cheapTowers), 3);
    					}
    					
    					if (that.unitsNum.d1.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 2);
    						buildRandomEnsigns(ensign3, 1);
    					} else if (that.unitsNum.d1.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(cheapTowers), 2);
    					}
    				
    					if (that.unitsNum.s >= 3){
    						BuildTower('Snake', 0);
    						buildRandomEnsigns(ensign1, 1);
    					} else if (that.unitsNum.s >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 0);
    					}
    					break;
    			}
    			break;
    			
    		case 2: // ******************** level 2 ******************** //
    			switch (that.goldState){
    				case -1: // tight
    					
    					break;
    				case 1: // sufficient
    					
    					break;
    				default: //normal
    					
    					break;
    			}
    			break;
    		case 3:
    			switch (that.goldState){
    				case -1: // tight
    					
    					break;
    				case 1: // sufficient
    					
    					break;
    				default: //normal
    					
    					break;
    			}
    			break;
    		default:
    			break;
    	}
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
	    stopThinking();
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
		// data {gid, goalLife, life, maxlife}
// 		gnclient.UpdateGoalLife(data);
	});
	
	this.on('goal-dead', function(data) {
		// data {gid}
		that.goals[data.gid] = {alive: false};
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
					that.slots[i].type = '';
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