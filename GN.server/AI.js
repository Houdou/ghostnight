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
    function say(msg){ 
		that.emit('send-message', {message: msg});
	};
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
    	switch (that.set.level){
    		case 1: 
    			setTimeout(()=>{BuildTower('Inugami', 0);}, 15100);
	    		setTimeout(()=>{BuildTower('Snake', 1);}, 16100);
    			break;
    		case 2:
    			setTimeout(()=>{BuildTower('Inari', 0);}, 15100);
	    		setTimeout(()=>{BuildTower('Amaterasu', 1);}, 16100);
    			break;
			case 3:
				setTimeout(()=>{BuildTower('Asura', 0);}, 15100);
	    		setTimeout(()=>{BuildTower('Snake', 1);}, 16100);
				break;
    		default:
    			break;
    	}
	    
    }
    
    function startThinking() {
    	that.timerInterval = setInterval(() => {
            think();
        }, 2000);
    }
    
    function stopThinking() {
    	clearInterval(that.timerInterval);
    }
    
    function think() {
    	
    	// count units in each part
    	getUnitsNum(); 
    	
    	// cut useless units
    	unitsNumCut();
    	
    	// judge the currency state
    	goldStateJudge();
    	
    	// decide to build towers and ensigns
    	build();
    	
    }

    // assisting methods
    function getUnitsNum(){
    	var unitsNum = {
    		all: 0
    	};
    	var unit;
    	var judge = {};
    	switch (that.set.level) {
    		case 1: { // ******************** Level 1 ******************** //
    			unitsNum = {
		    		all: 0, 
		    		s: 0,
		    		d0: {s: 0, e: 0},
		    		d1: {s: 0, e: 0}
		    	};
		    	judge.X1 = 386; // before roadSign // joint id 19
		    	judge.Y1 = 400;
		    	judge.X2 = 765; // dest0 reachless
		    	judge.X3 = 796; // dest1 reachless
		    	for (var i in that.units){
		    		unit = that.units[i];
		    		if (unit != undefined){
		    			unitsNum.all++;
		    			if (unit.x <= judge.X1){ // s
		    				unitsNum.s++;
		    			} else if (unit.y <= judge.Y1){ // dest0
		    				if(unit.x <= judge.X2){
		    					unitsNum.d0.s++;
		    				} else {
		    					unitsNum.d0.e++;
		    				}
		    			} else { // dest1
		    				if(unit.x <= judge.X3){
		    					unitsNum.d1.s++;
		    				} else {
		    					unitsNum.d1.e++;
		    				}
		    			}
		    		}
		    	}
    		}
    		break;
    			
    		case 2: { // ******************** Level 2 ******************** //
    			unitsNum = {
    				all: 0, 
    				s: 0,
    				d0: {s: 0, e: 0},
    				m: 0,
    				d1: 0, 
    				d2: 0
    			}
    			judge.X1 = 351; // before first roadSign // joint id 17
		    	judge.Y1 = 480; // after first roadSign
		    	judge.X2 = 892; // dest0 reachless
		    	judge.X3 = 825; // before second roadSign // joint id 85
		    	judge.Y3 = 365; // dest 1 & 2
		    	for (var i in that.units){
		    		unit = that.units[i];
		    		if (unit != undefined){
		    			unitsNum.all++;
		    			if (unit.x <= judge.X1){ // s
		    				unitsNum.s++;
		    			} else if (unit.y >= judge.Y1){ // d0
		    				if(unit.x <= judge.X2){
		    					unitsNum.d0.s++;
		    				} else {
		    					unitsNum.d0.e++;
		    				}
		    			} else { // m & d0 & d1
		    				if(unit.x <= judge.X3){ // m
		    					unitsNum.m++;
		    				} else {
		    					if (unit.y >= judge.Y3){ // d1
		    						unitsNum.d1++;
		    					} else { // d2
		    						unitsNum.d2++;
		    					}
		    				}
		    			}
		    		}
		    	}
    		}
    		break;
    			
    		case 3: { // ******************** Level 3 ******************** //
    			unitsNum = {
		    		all: 0, 
		    		s0: 0,
		    		s1: 0,
		    		m0: 0, 
		    		m1: 0,
		    		m2: 0,
		    		b0: 0,
		    		b1: 0,
		    		d: 0
		    	};
		    	judge.X0 = 235; // first slot reachless // joint 26
		    	judge.Y0 = 377; // first slot reachless // joint 26
		    	judge.X1 = 433; // before first roadSign // joint 38
		    	judge.Y1 = 245; // before first roadSign // joint 38
		    	judge.X1_ = 346; // digout point
		    	judge.Y1_ = 330; // digout point
		    	judge.X2 = 745; // b0 end
		    	judge.Y2 = 240; // b0 end
		    	judge.X3 = 532; // before second roadSign // joint 57
		    	judge.Y3 = 500; // before second roadSign // joint 57
		    	judge.X4 = 724; // before upper join 
		    	judge.Y4 = 210; // before upper join 
		    	judge.X5 = 989; // before lower join // joint 126
		    	judge.Y5 = 376; // before lower join // joint 126
		    	for (var i in that.units){
		    		unit = that.units[i];
		    		if (unit != undefined){
		    			unitsNum.all++;
		    			if (unit.x <= judge.X0){
		    				unitsNum.s0++; 
		    			} else if (unit.x <= judge.X1 && unit.y <= judge.Y1 && (unit.x <= judge.X1_ || unit.y <= judge.X2_)){
		    				unitsNum.s1++;
		    			} else if (unit.x <= judge.X2 && unit.y <= judge.Y2){ 
		    				unitsNum.b0++;
		    			} else if (unit.x <= judge.X3){
		    				unitsNum.m0++;
		    			} else if (unit.x <= judge.X4 && unit.y >= judge.Y3){
		    				unitsNum.m1++;
		    			} else if (unit.x <= judge.X5){
		    				if (unit.y >= judge.Y5){
		    					unitsNum.b1++;
		    				} else {
		    					unitsNum.m2++;
		    				}
		    			} else {
		    				unitsNum.d++;
		    			}
		    		}
		    	}
    		}
    		break;
    		
    		default:
    			break;
    	}
    	that.unitsNum = unitsNum;
    	// say(JSON.stringify(unitsNum));
    	return unitsNum;
    }
    
    function unitsNumCut() {
    	switch (that.set.level){
    		case 1:
    			for (var i = 0; i < that.set.destNum; i++){
    				if (that.goals[i] != null && !that.goals[i].alive){
    					that.unitsNum.all -= that.unitsNum['d'+i].s;
    					that.unitsNum.all -= that.unitsNum['d'+i].e;
    					that.unitsNum['d'+i].s = 0;
    					that.unitsNum['d'+i].e = 0;
    				}
    			}
    			break;
    		case 2:
    			for (var i = 0; i < that.set.destNum; i++){
    				if (that.goals[i] != null && !that.goals[i].alive){
    					if (i == 0){
	    					that.unitsNum.all -= that.unitsNum['d'+i].s;
	    					that.unitsNum.all -= that.unitsNum['d'+i].e;
	    					that.unitsNum['d'+i].s = 0;
	    					that.unitsNum['d'+i].e = 0;
    					} else {
    						that.unitsNum.all -= that.unitsNum['d'+i];
    						that.unitsNum['d'+i] = 0;
    					}
    				}
    			}
    			break;
    		case 3:
    			break;
    		default:
    		
    	}
    }
    
    function goldStateJudge() {
    	if (that.gold < 700 && getSlotsVacancy() != 0) {
    		that.goldState = -1;
    		//say('poor: '+that.gold);
    	} else if (that.gold >= 1300 + 350 * (Math.min(getSlotsVacancy(), 5))) {
    		that.goldState = 1;
    		//say('rich: '+that.gold);
    	} else {
    		that.goldState = 0;
    		//say('normal: '+that.gold);
    	}
    }
    
    function build() {
    	var ensignInfos = [];
    	switch (that.set.level) {
    		case 1: { // ******************** level 1 ******************** //
    			ensignInfos[0] = {pos: 13, num: 0}; // slot 0
    			ensignInfos[1] = {pos: 29, num: 0}; // slot 1 & 3
    			ensignInfos[2] = {pos: 76, num: 0}; // slot 1 & 2
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
    						buildRandomEnsigns(ensignInfos[1], 2);
    						// if (ensignInfos[1].num < 2){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensignInfos[1].pos);
    						// 	BuildEnsign(getRandomFrom(ensigns), ensignInfos[1].pos + 1);
    						// 	ensignInfos[1].num += 2;
    						// 	setTimeout(function(){ensignInfos[1].num -= 2;}, 10000);
    						// }
    					} else if (that.unitsNum.d0.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 3);
    						buildRandomEnsigns(ensignInfos[1], 1);
    						// if (ensignInfos[1].num < 1){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensignInfos[1].pos);
    						// 	ensignInfos[1].num += 1;
    						// 	setTimeout(function(){ensignInfos[1].num -= 1;}, 10000);
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
    						buildRandomEnsigns(ensignInfos[2], 2);
    						// if (ensignInfos[2].num < 2){
    						// 	BuildEnsign(getRandomFrom(ensigns), ensignInfos[2].pos);
    						// 	BuildEnsign(getRandomFrom(ensigns), ensignInfos[2].pos + 1);
    						// 	ensignInfos[2].num += 2;
    						// 	setTimeout(function(){ensignInfos[2].num -= 2;}, 10000);
    						// }
    					} else if (that.unitsNum.d1.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 2);
    						buildRandomEnsigns(ensignInfos[2], 1);
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
    						buildRandomEnsigns(ensignInfos[0], 1);
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
    						buildRandomEnsigns(ensignInfos[1], 1);
    					} else if (that.unitsNum.d0.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(cheapTowers), 3);
    					}
    					
    					if (that.unitsNum.d1.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(atkTowers), 2);
    						buildRandomEnsigns(ensignInfos[2], 1);
    					} else if (that.unitsNum.d1.s >= 1) {
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(cheapTowers), 2);
    					}
    				
    					if (that.unitsNum.s >= 3){
    						BuildTower('Snake', 0);
    						buildRandomEnsigns(ensignInfos[0], 1);
    					} else if (that.unitsNum.s >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 0);
    					}
    					break;
    			}
    		}
    		break;
    			
    		case 2: { // ******************** level 2 ******************** //
    			ensignInfos[0] = {pos: 11, num: 0}; // slot 0
				ensignInfos[1] = {pos: 70, num: 0}; // slot 1
				ensignInfos[2] = {pos: 82, num: 0}; // slot 2 & 3
				ensignInfos[3] = {pos: 119, num: 0}; // slot 4 & 5
    			switch (that.goldState){
    				case -1: // tight // Level 2
    					if (that.unitsNum.d0.e + that.unitsNum.d1 + that.unitsNum.d2 >= 1){
    						if (that.goals[0] != null && !that.goals[0].alive){
    							BuildTower('Ebisu', 2);
    						}else if (that.slots[1].type != 'Ebisu'){
    							if (!that.slots[0].alive){
    								BuildTower('Ebisu', 0);
    							} else {
    								BuildTower('Ebisu', 1);
    							}
    						}
    					}
    					
    					if (that.unitsNum.d2 + that.unitsNum.d1 >= 3){
    						BuildTower('Snake', 4);
    						BuildTower(getRandomFrom(cheapTowers), 4);
    					}
    					
    					if (that.unitsNum.d2 >= 2){
    						BuildTower(getRandomFrom(cheapTowers), 4);
    						BuildTower(getRandomFrom(cheapTowers), 4);
    						BuildTower(getRandomFrom(cheapTowers), 5);
    					} else if (that.unitsNum.d2 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 4);
    					}
    					
    					if (that.unitsNum.d1 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 4);
    					}
    					
    					if (that.unitsNum.m + that.unitsNum.d0.s >= 3){
    						BuildTower('Snake', 1);
    						BuildTower('Snake', 2);
    					} else if (that.unitsNum.m + that.unitsNum.d0.s >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 1);
    						BuildTower(getRandomFrom(cheapTowers), 2);
    					}
    					
    					if (that.unitsNum.m >= 2){
    						BuildTower(getRandomFrom(cheapTowers), 3);
    					} 
    					
    					if (that.unitsNum.s >= 2){
    						BuildTower(getRandomFrom(cheapTowers), 0);
    					} 
    					break;
    					
    				case 1: // sufficient // Level 2
    					if (that.unitsNum.d0.e + that.unitsNum.d1 + that.unitsNum.d2 >= 1){
    						if (that.goals[0] != null && !that.goals[0].alive){
    							BuildTower('Ebisu', 2);
    						}else if (that.slots[1].type != 'Ebisu'){
    							if (!that.slots[0].alive){
    								BuildTower('Ebisu', 0);
    							} else {
    								BuildTower('Ebisu', 1);
    							}
    						}
    					}
    					
    					if (that.unitsNum.d2 + that.unitsNum.d1 >= 3){
    						BuildTower('Snake', 4);
    						buildRandomEnsigns(ensignInfos[3], 2)
    					} else if (that.unitsNum.d2 + that.unitsNum.d1 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						buildRandomEnsigns(ensignInfos[3], 1)
    					}
    					
    					if (that.unitsNum.d2 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						BuildTower(getRandomFrom(specialTowers), 4);
    						BuildTower(getRandomFrom(atkTowers), 5);
    						buildRandomEnsigns(ensignInfos[3], 1)
    					} else if (that.unitsNum.d2 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						BuildTower(getRandomFrom(allTowers), 5);
    					}
    					
    					if (that.unitsNum.d1 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 4);
    					}
    					
    					if (that.unitsNum.m + that.unitsNum.d0.s >= 3){
    						BuildTower('Snake', 1);
    						BuildTower(getRandomFrom(atkTowers), 2);
    						buildRandomEnsigns(ensignInfos[2], 2);
    						if (Math.random() < 0.3) {buildRandomEnsigns(ensignInfos[1], 1);}
    					} else if (that.unitsNum.m + that.unitsNum.d0.s >= 1){
    						BuildTower(getRandomFrom(allTowers), 1);
    						if (Math.random() < 0.3) {BuildTower(getRandomFrom(allTowers), 2);}
    					}
    					
    					if (that.unitsNum.m >= 1){
    						if (Math.random() < 0.6) {BuildTower(getRandomFrom(skyTowers), 3);}
    					} 
    					
    					if (that.unitsNum.d0.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						if (Math.random() < 0.4) {buildRandomEnsigns(ensignInfos[1], 1);}
    					} 
    					
    					if (that.unitsNum.s >= 3){
    						BuildTower('Snake', 0);
    						buildRandomEnsigns(ensignInfos[0], 1);
    					} else if (that.unitsNum.s >= 1){
    						BuildTower(getRandomFrom(specialTowers), 0);
    					}
    					
    					for (var i = 0; i < that.set.slotNum; i++){
    						if (that.slots[i] == null || !that.slots[i].hasTower){
    							if (Math.random() < 0.05) {BuildTower(getRandomFrom(allTowers), i);}
    						}
    					}
    					break;
    					
    				default: // normal // Level 2
    					if (that.unitsNum.d0.e + that.unitsNum.d1 + that.unitsNum.d2 >= 1){
    						if (that.goals[0] != null && !that.goals[0].alive){
    							BuildTower('Ebisu', 2);
    						}else if (that.slots[1].type != 'Ebisu'){
    							if (!that.slots[0].alive){
    								BuildTower('Ebisu', 0);
    							} else {
    								BuildTower('Ebisu', 1);
    							}
    						}
    					}
    					
    					if (that.unitsNum.d2 + that.unitsNum.d1 >= 3){
    						BuildTower('Snake', 4);
    						buildRandomEnsigns(ensignInfos[3], 1)
    					} else if (that.unitsNum.d2 + that.unitsNum.d1 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 4);
    					}
    					
    					if (that.unitsNum.d2 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						BuildTower(getRandomFrom(specialTowers), 5);
    						buildRandomEnsigns(ensignInfos[3], 1)
    					} else if (that.unitsNum.d2 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						BuildTower(getRandomFrom(allTowers), 5);
    					} else if (that.unitsNum.d2 >= 1){
    						BuildTower(getRandomFrom(allTowers), 4);
    					}
    					
    					if (that.unitsNum.d1 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 4);
    					}
    					
    					if (that.unitsNum.m + that.unitsNum.d0.s >= 3){
    						BuildTower('Snake', 1);
    						BuildTower(getRandomFrom(allTowers), 2);
    						buildRandomEnsigns(ensignInfos[2], 1);
    						if (Math.random() < 0.3) {buildRandomEnsigns(ensignInfos[1], 1);}
    					} else if (that.unitsNum.m + that.unitsNum.d0.s >= 2){
    						BuildTower(getRandomFrom(atkTowers), 1);
    					}
    					
    					if (that.unitsNum.m >= 2){
    						BuildTower(getRandomFrom(allTowers), 3);
    					}
    					
    					if (that.unitsNum.d0.s >= 1){
    						BuildTower(getRandomFrom(atkTowers), 1);
    						BuildTower(getRandomFrom(allTowers), 2);
    					} 
    					
    					if (that.unitsNum.s >= 3){
    						BuildTower('Snake', 0);
    						buildRandomEnsigns(ensignInfos[0], 1);
    					} else if (that.unitsNum.s >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 0);
    					}
    					break;
    			}
    		}
    		break;
    		
    		case 3: { // ******************** level 3 ******************** //
    			ensignInfos[0] = {pos: 11, num: 0}; // slot 0
    			ensignInfos[1] = {pos: 42, num: 0}; // slot 1 & 3
    			ensignInfos[2] = {pos: 56, num: 0}; // slot 2
    			ensignInfos[3] = {pos: 85, num: 0}; // slot 4 & 6
    			ensignInfos[4] = {pos: 69, num: 0}; // slot 5 & 6
    			ensignInfos[5] = {pos: 94, num: 0}; // slot 8 & 6
    			ensignInfos[6] = {pos: 115, num: 0}; // slot 7
    			switch (that.goldState){
    				case -1: // tight // Level 3
    					if (that.unitsNum.d >= 1){
    						if (!hasTowerType("Ebisu")){
    							buildTowerAtFirstSlot('Ebisu');
    						}
    					}
    					
    					if (that.unitsNum.b1 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 7);
    						BuildTower(getRandomFrom(cheapTowers), 7);
    					}
    					
    					if (that.unitsNum.m2 >= 2){
    						BuildTower(getRandomFrom(cheapTowers), 6);
    						BuildTower(getRandomFrom(cheapTowers), 8);
    						BuildEnsign('Rng', ensignInfos[5].pos)
    					} else if (that.unitsNum.m2 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 6);
    					}
    					
    					if (that.unitsNum.b0 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 4);
    					}
    					
    					if (that.unitsNum.m1 >= 2){
    						BuildTower(getRandomFrom(cheapTowers), 5);
    					}
    					
    					if (that.unitsNum.m0 >= 3){
    						BuildTower('Snake', 2);
    						BuildTower(getRandomFrom(cheapTowers), 2);
    						BuildTower('Miko', 2);
    					} else if (that.unitsNum.m0 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 2);
    						BuildTower('Miko', 2);
    					}
    					
    					if (that.unitsNum.s0 + that.unitsNum.s1 >= 3){
    						BuildTower('Snake', 1);
    						BuildTower(getRandomFrom(cheapTowers), 1);
    					} else if (that.unitsNum.s0 + that.unitsNum.s1 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 1);
    					}
    					break;
    					
    				case 1: // sufficient // Level 3
    					if (that.unitsNum.d >= 1){
    						buildTowerAtFirstSlot('Ebisu');
    					}
    					
    					if (that.unitsNum.b1 >= 3){
    						BuildTower('Asura', 7);
    						buildRandomEnsigns(ensignInfos[6], 2)
    					} else if (that.unitsNum.b1 >= 2){
    						BuildTower('Asura', 7);
    						buildRandomEnsigns(ensignInfos[6], 1)
    					} else if (that.unitsNum.b1 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 7);
    					}
    					
    					if (that.unitsNum.m2 + that.unitsNum.m1 + that.unitsNum.b0 >= 3){
    						BuildTower('Snake', 6);
    					}
    					
    					if (that.unitsNum.m2 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 6);
    						BuildTower('Amaterasu', 8);
    						buildRandomEnsigns(ensignInfos[5], 1)
    					} else if (that.unitsNum.m2 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 6);
    						BuildTower(getRandomFrom(specialTowers), 8);
    					}
    					
    					if (that.unitsNum.b0 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						buildRandomEnsigns(ensignInfos[3], 1);
    					} else if (that.unitsNum.b0 >= 1){
    						BuildTower(getRandomFrom(specialTowers), 4);
    					}
    					
    					if (that.unitsNum.m1 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 5);
    						buildRandomEnsigns(ensignInfos[4], 1);
    					} else if (that.unitsNum.m1 >= 1){
    						BuildTower(getRandomFrom(allTowers), 5);
    					}
    					
    					if (that.unitsNum.m0 >= 3){
    						BuildTower('Snake', 2);
    						if (Math.random() < 0.3){
    							buildRandomEnsigns(ensignInfos[2], 2);
    						} else {
    							buildRandomEnsigns(ensignInfos[2], 1);
    						}
    					} else if (that.unitsNum.m0 >= 1){
    						BuildTower(getRandomFrom(atkTowers), 2);
    					}
    					
    					if (that.unitsNum.m0 + that.unitsNum.m1 >= 2){
    						BuildTower('Amaterasu', 3);
    					}
    					
    					if (that.unitsNum.s1 >= 3){
    						BuildTower('Snake', 1);
    						buildRandomEnsigns(ensignInfos[1], 1);
    					} else if (that.unitsNum.s1 >= 1){
    						BuildTower(getRandomFrom(allTowers), 1);
    					}
    					
    					if (that.unitsNum.s0 >= 1){
    						BuildTower(getRandomFrom(allTowers), 0);
    					}
    					
    					for (var i = 0; i < that.set.slotNum; i++){
    						if (that.slots[i] == null || !that.slots[i].hasTower){
    							if (Math.random() < 0.05) {BuildTower(getRandomFrom(allTowers), i);}
    						}
    					}
    					break;
    					
    				default: //normal // Level 3
    					if (that.unitsNum.d >= 1){
    						buildTowerAtFirstSlot('Ebisu');
    					}
    					
    					if (that.unitsNum.b1 >= 3){
    						BuildTower('Snake', 7);
    						buildRandomEnsigns(ensignInfos[6], 1)
    					} else if (that.unitsNum.b1 >= 2){
    						BuildTower('Asura', 7);
    					} else if (that.unitsNum.b1 >= 1){
    						if (Math.random() < 0.5){
    							BuildTower(getRandomFrom(atkTowers), 7);
    						} else {
    							BuildTower(getRandomFrom(specialTowers), 7);
    						}
    					}
    					
    					if (that.unitsNum.m2 + that.unitsNum.m1 + that.unitsNum.b0 >= 3){
    						BuildTower('Snake', 6);
    					}
    					
    					if (that.unitsNum.m2 >= 2){
    						BuildTower(getRandomFrom(atkTowers), 6);
    						BuildTower(allTowers, 8);
    						buildRandomEnsigns(ensignInfos[5], 1)
    					} else if (that.unitsNum.m2 >= 1){
    						BuildTower('Amaterasu', 8);
    					}
    					
    					if (that.unitsNum.b0 >= 3){
    						BuildTower(getRandomFrom(atkTowers), 4);
    						buildRandomEnsigns(ensignInfos[3], 1);
    					} else if (that.unitsNum.b0 >= 2){
    						BuildTower(getRandomFrom(specialTowers), 4);
    					} else if (that.unitsNum.b0 >= 1){
    						if (Math.random() < 0.5){
    							BuildTower(getRandomFrom(specialTowers), 4);
    						} else {
    							BuildTower(getRandomFrom(cheapTowers), 4);
    						}
    					}
    					
    					if (that.unitsNum.m1 >= 3){
    						BuildTower(getRandomFrom(specialTowers), 5);
    						buildRandomEnsigns(ensignInfos[4], 1);
    					} else if (that.unitsNum.m1 >= 1){
    						BuildTower(getRandomFrom(specialTowers), 5);
    					} else if (that.unitsNum.m1 >= 1){
    						if (Math.random() < 0.5){
    							BuildTower(getRandomFrom(specialTowers), 5);
    						} else {
    							BuildTower(getRandomFrom(cheapTowers), 5);
    						}
    					}
    					
    					if (that.unitsNum.m0 >= 3){
    						BuildTower('Snake', 2);
    						buildRandomEnsigns(ensignInfos[2], 1);
    					} else if (that.unitsNum.m0 >= 1){
    						BuildTower(getRandomFrom(allTowers), 2);
    					}
    					
    					if (that.unitsNum.m0 + that.unitsNum.m1 >= 3){
    						BuildTower('Amaterasu', 3);
    					}
    					
    					if (that.unitsNum.s1 >= 3){
    						BuildTower('Snake', 1);
    						buildRandomEnsigns(ensignInfos[1], 1);
    					} else if (that.unitsNum.s1 >= 1){
    						BuildTower(getRandomFrom(specialTowers), 1);
    					}
    					
    					if (that.unitsNum.s0 >= 1){
    						BuildTower(getRandomFrom(cheapTowers), 0);
    					}
    					break;
    			}
    		}
    		break;
    		
    		default:
    			break;
    	}
    }
    
    function getSlotsVacancy() {
    	var vNum = 0;
    	for (var i = 0; i < that.set.slotNum; i++){
    		var slot = that.slots[i];
    		if (slot == null || !slot.hasTower){
    			vNum++; 
    		}
    	}
    	return vNum;
    }
    
    function hasTowerType(type) {
    	for (var i = 0; i < that.set.slotNum; i++){
			if (that.slots[i] != null && that.slots[i].hasTower){
				if (that.slots[i].type == type){
					return true;
				}
			}
		}
		return false;
    }
    
    function buildTowerAtFirstSlot(type) {
    	for (var i = 0; i < that.set.slotNum; i++){
			if (that.slots[i] == null || !that.slots[i].hasTower){
				BuildTower(type, i);
				return true;
			}
		}
		return false;
    }
    
	this.on('game-started', function() {
	    that.startTime = (new Date()).getTime();
	    initBuild();
	    setTimeout(()=>startThinking(), 17000);
	    say('Hello! i\'m Mr. AI.');
	    say('Let\'s have a wonderful game!');
	});
	
	this.on('game-end', function(data) {
		// data {type: type, win: win}
		switch (data.win){
			case 'human': 
				say('Ha! Would you try again?');
				break;
			case 'ghost':
				say('Good game!');
				break;
			default:
				break;
		}
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
		say('Oh my life!');

	});
	
	this.on('goal-dead', function(data) {
		// data {gid}
		that.goals[data.gid] = {alive: false};
		say('Oh no!');
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
		for (var i = 0; i < that.set.slotNum; i++){
			if (that.slots[i] != null && that.slots[i].hasTower){
				if (that.slots[i].tid == data.id){
					that.slots[i].hp = data.hp;
				}
			}
		}
// 		gnclient.UpdateHPBar('tower', data);
	});
	
	this.on('tower-dead', function(data) {
		// data = {id, dmg});
		for (var i = 0; i < that.set.slotNum; i++){
			if (that.slots[i] != null && that.slots[i].hasTower){
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