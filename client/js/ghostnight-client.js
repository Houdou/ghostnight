/*global stage createjs*/

var gn = function(stage, socket) {
	// Infos
	this.stage = stage;
	this.roomNo = -1;
	this.playerIndex = -1;
	this.side = null;
	this.opposite = null;
	this.map = null;
	this.socket = socket;
	
	// Assets
	this.manifest = [];
	this.layout = [];
	this.assets = {};
	this.mapData = null;
	
	// Game Elements
	this.units = [];
	this.hero = null;
	this.heroName = null;
	this.towers = [];
	this.blockers = [];
	this.ensigns = [];
	this.gold = 0;
	this.soul = 0;
	
	// UI
	this.progressBar = null;
	this.inputState = 'normal';
	this.UI = [];
	this.panel = [];
	this.currentPanel = '';
};
// UI
gn.prototype.BuildPanel = function(srcID, x, y, width, height) {
	var c = new createjs.Container();
	
	c.x = x;
	c.y = y;
	this.panel[srcID] = c;
	c.name = srcID;
	
	this.stage.addChild(c);
	return c;
}
gn.prototype.TogglePanel = function(panelID) {
	for(var c in this.panel) {
		if(c == panelID) {
			stage.addChild(this.panel[c]);
			this.currentPanel = panelID;
		} else {
			stage.removeChild(this.panel[c]);
		}
	}
	stage.update();
}
gn.prototype.BuildButton = function(str, x, y, width, height, onclickFunction, data) {
	var c = new createjs.Container();
		
	var button = new createjs.Shape();
	button.graphics.beginStroke("#000").beginFill("#DDD").drawRect(0, 0, width, height);
	var buttonStr = new createjs.Text(str, "18px Arial", "#777777");
	buttonStr.x = width / 2 - buttonStr.getBounds().width / 2;
	buttonStr.y = height / 2 - buttonStr.getBounds().height / 2;
	
	c.addChild(button);
	c.addChild(buttonStr);

	if(onclickFunction)
		c.on('click', onclickFunction, null, false, data);
	
	c.x = x;
	c.y = y;
	
	this.stage.addChild(c);
	this.stage.update();
	return c;
}
gn.prototype.BuildImage = function(srcImgID, x, y, width, height, offset, onclickFunction, eventData, draw, scale) {
	var c = new createjs.Bitmap(this.assets[srcImgID]);
	c.regX = width/2;
	c.regY = height/2;
	c.scaleX = scale || 1;
	c.scaleY = scale || 1;
	
	if(onclickFunction)
		c.on('click', onclickFunction, null, false, eventData);

	c.x = x;
	c.y = y;
	
	this.UI[srcImgID] = c;
	
	if(draw) {
		stage.addChild(c);
		stage.update();
	}
	
	return c;
}
gn.prototype.BuildImageButton = function(name, srcImgID, x, y, width, height, offset, onclickFunction, eventData, draw, scale) {
	var c = new createjs.Container();
		
	var button = new createjs.Bitmap(this.assets[srcImgID]);
	button.regX = width/2;
	button.regY = height/2;
	button.scaleX = scale || 1;
	button.scaleY = scale || 1;
	button.cache(0, 0, width, height);
	
	var cover = new createjs.Shape();
	cover.graphics.clear().beginFill("rgba(50, 50, 50, 0.90)").drawRect(0, 0, width, height);
	// cover.graphics.clear().beginFill("rgba(50, 50, 50, 0.85)").moveTo(0, 0).arc(0, 0, 0.32 * width, (1.5 - 2 * 1) * Math.PI, -0.5 * Math.PI, false).lineTo(0, 0);
	cover.regX = width/2;
	cover.regY = height/2;
	cover.scaleX = scale || 1;
	cover.scaleY = scale || 1;
	cover.filters = [new createjs.AlphaMaskFilter(button.cacheCanvas)];
	cover.cache(0, 0, width, height);
	
	var buttonStr = new createjs.Text(name, "12px Arial", "#777777");
	buttonStr.textAlign = 'center';
	buttonStr.y = offset;
	
	c.addChild(button);
	c.addChild(cover);
	c.addChild(buttonStr);

	if(onclickFunction)
		c.on('click', onclickFunction, null, false, eventData);
	
	c.x = x;
	c.y = y;
	// c.cache(-width/2, -height/2, width, height + offset + 10);
	
	this.UI[srcImgID] = c;
	
	if(draw) {
		stage.addChild(c);
		stage.update();
	}
	
	return c;
}
gn.prototype.ParseLayout = function(element, draw) {
	switch (element.type) {
		case 'panel':
			var c = this.BuildPanel(element.srcID, element.x, element.y, element.width, element.height);
			element.children.forEach((child) => {
				var button = this.ParseLayout(child, false);
				if(button != undefined) {
					c.addChild(button);
				}
			});
			this.panel[element.srcID] = c;
			
			if(element.active) {
				this.TogglePanel(element.srcID);
			}
			
			return c;
		case 'build':
			switch (element.input) {
				case 'none':
					return this.BuildImageButton(element.name, element.srcID, element.x, element.y,
						element.width, element.height, element.buttonStrOffset, (event, DATA) => {
							this.socket.emit(element.event, DATA);
					}, element.data, draw, element.scale);
				case 'jid':
					return this.BuildImageButton(element.name, element.srcID, element.x, element.y,
						element.width, element.height, element.buttonStrOffset, (event, DATA) => {
							console.log('client state: input for joint');
							this.inputState = 'joint';
							this.stage.on('stagemousedown', (event, data) => {
								console.log('client state: normal');
								this.inputState = 'normal';
								DATA.jid = this.FindNearestJoint(event.stageX, event.stageY, data.maxDistance);
								console.log(DATA.jid);
								this.socket.emit(element.event, DATA)
							}, null, true, {maxDistance: 50})
					}, element.data, draw, element.scale);
				case 'sid':
					return this.BuildImageButton(element.name, element.srcID, element.x, element.y,
						element.width, element.height, element.buttonStrOffset, (event, DATA) => {
							console.log('client state: input for slot');
							this.inputState = 'slot';
							this.stage.on('stagemousedown', (event, data) => {
								console.log('client state: normal');
								this.inputState = 'normal';
								console.log(event.stageX + ', ' + event.stageY);
								DATA.sid = this.FindNearestSlot(event.stageX, event.stageY, data.maxDistance);
								console.log(DATA.sid);
								this.socket.emit(element.event, DATA)
							}, null, true, {maxDistance: 70})
					}, element.data, draw, element.scale);
				default: break;
			}
			break;
		case 'skill':
			switch (element.input) {
				case 'none':
					return this.BuildImageButton(element.name, element.srcID, element.x, element.y,
						element.width, element.height, element.buttonStrOffset, (event, DATA) => {
							this.socket.emit(element.event, DATA);
					}, element.data, draw, element.scale);
				case 'jid':
					return this.BuildImageButton(element.name, element.srcID, element.x, element.y,
						element.width, element.height, element.buttonStrOffset, (event, DATA) => {
							console.log('client state: input for joint');
							this.inputState = 'joint';
							this.stage.on('stagemousedown', (event, data) => {
								console.log('client state: normal');
								this.inputState = 'normal';
								DATA.jid = this.FindNearestJoint(event.stageX, event.stageY, data.maxDistance);
								console.log(DATA.jid);
								this.socket.emit(element.event, DATA)
							}, null, true, {maxDistance: 50})
					}, element.data, draw, element.scale);
				case 'sid':
					return this.BuildImageButton(element.name, element.srcID, element.x, element.y,
						element.width, element.height, element.buttonStrOffset, (event, DATA) => {
							console.log('client state: input for slot');
							this.inputState = 'slot';
							this.stage.on('stagemousedown', (event, data) => {
								console.log('client state: normal');
								this.inputState = 'normal';
								console.log(event.stageX + ', ' + event.stageY);
								DATA.sid = this.FindNearestSlot(event.stageX, event.stageY, data.maxDistance);
								console.log(DATA.sid);
								this.socket.emit(element.event, DATA)
							}, null, true, {maxDistance: 70})
					}, element.data, draw, element.scale);
				default: break;
			}
			break;
		case 'button':
			return this.BuildImage(element.srcID, element.x, element.y,
				element.width, element.height, element.buttonStrOffset, (event, DATA) => {
					this.socket.emit(element.event, DATA);
				}, element.data, draw, element.scale);
		case 'static':
			return this.BuildImage(element.srcID, element.x, element.y,
				element.width, element.height, element.buttonStrOffset, null, null, draw, element.scale);
		default: break;
	}
}
gn.prototype.BuildProgressBar = function() {
	var progressBar = new createjs.Shape();
	progressBar.graphics.beginFill("#FFF").drawRect(0, 0, 240, 10);
	progressBar.x = 960;
	progressBar.y = 640;
	progressBar.scaleX = 0;
	this.progressBar = progressBar;
	
	stage.addChild(this.progressBar);
	stage.update();
}

// Build
gn.prototype.BuildScene = function() {
	
}
gn.prototype.BuildUnit = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	unit.regX = 24;
	unit.regY = 36;
	
	unit.cache(0, 0, 48, 48);
	
	// Special for foxfire
	if(data.type == "Foxfire") {
		unit.y = -18;
		createjs.Tween.get(unit, {loop: true}, null, {override: true})
			.to({y: -30}, 800, createjs.Ease.sineInOut)
			.to({y: -18}, 800, createjs.Ease.sineInOut);
	} else {
		unit.rotation = -12;
		createjs.Tween.get(unit, {loop: true}, null, {override: true})
			.to({rotation: 12}, 800, createjs.Ease.sineInOut)
			.to({rotation: -12}, 800, createjs.Ease.sineInOut);
	}
	
	c.addChild(unit);
	
	c.x = data.x;
	c.y = data.y;
	
	this.units.push(c);
	stage.addChild(c);
	stage.update();
}
gn.prototype.DrawHeroSelection = function(data) {
	if(this.currentPanel == 'panel-Reborn') {
		var circle = this.panel['panel-Reborn'].getChildAt(3);
		switch (data.type) {
			case 'Nekomata':
				circle.x = 30;
				break;
			case 'Ameonna':
				circle.x = 110;
				break;
			case 'Todomeki':
				circle.x = 190;
				break;
			default:
				break;
		}
	}
}
gn.prototype.BuildHero = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	unit.regX = 32;
	unit.regY = 48;
	
	unit.cache(0, 0, 64, 64);
	
	unit.rotation = -8;
	createjs.Tween.get(unit, {loop: true}, null, {override: true})
		.to({rotation: 8}, 1200, createjs.Ease.sineInOut)
		.to({rotation: -8}, 1200, createjs.Ease.sineInOut);
	
	c.addChild(unit);
	
	c.x = data.x;
	c.y = data.y;
	
	this.hero = c;
	this.heroName = data.type;
	
	if(this.side == 'ghost') {
		this.heroMovement = stage.on('stagemousedown', (event, data) => {
			var jid = this.FindNearestJoint(event.stageX, event.stageY, 50);
			if(jid != -1) {
				this.socket.emit('move-hero', {jid: jid});
			}
		});
	}
	
	stage.addChild(c);
	stage.update();
}
gn.prototype.BuildTower = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	unit.regX = 40;
	unit.regY = 60;
	
	unit.cache(0, 0, 80, 80);
	
	c.addChild(unit);
	
	c.x = this.mapData.slots[+data.sid].x;
	c.y = this.mapData.slots[+data.sid].y;
	
	this.towers.push(c);
	stage.addChild(c);
	stage.update();
}
gn.prototype.BuildEnsign = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	unit.regX = 15;
	unit.regY = 176;
	unit.scaleX = 0.5;
	unit.scaleY = 0.5;
	
	unit.cache(0, 0, 70, 192);
	
	unit.rotation = -2;
	createjs.Tween.get(unit, {loop: true}, null, {override: true})
		.to({rotation: 4}, 1500, createjs.Ease.sineInOut)
		.to({rotation: -2}, 1500, createjs.Ease.sineInOut);
	
	c.addChild(unit);
	
	c.x = this.mapData.joints[+data.jid].x;
	c.y = this.mapData.joints[+data.jid].y;
	
	this.towers.push(c);
	stage.addChild(c);
	stage.update();
}
gn.prototype.BuildBlocker = function(data) {
	
}

// Move
gn.prototype.MoveUnitTo = function(data) {
	var unit = this.units[data.uid];
	if(unit != undefined) {
		createjs.Tween.get(unit, {override: true})
			.to({x: data.x, y: data.y}, data.duration);
	}
}
gn.prototype.MoveHeroTo = function(data) {
	if(this.hero != undefined) {
		createjs.Tween.get(this.hero, {override: true})
			.to({x: data.x, y: data.y}, data.duration);
	}
}

// Remove
gn.prototype.RemoveUnit = function(data) {
	// {uid}
	
}

gn.prototype.RemoveHero = function(data) {
	// {}
}

gn.prototype.RemoveTower = function(data) {
	
}

// Effects
gn.prototype.DamageEffect = function() {
	
}
gn.prototype.CoolDownEffect = function(data) {
	// Check if the corresponding button exists.
	if(this.UI['button-' + data.type] != undefined) {
		// Start the cool down timing (This time is a little bit late than server)
		var startTime = (new Date()).getTime();
		// Find the Cover effect layer
		var cover = this.UI['button-' + data.type].getChildAt(1);
		if(cover.graphics != undefined) {
			const width = cover.getBounds().width;
			const height = cover.getBounds().height;
			// Bind the animation to tick event
			cover._onTick = cover.on('tick', function(event, DATA){
				// Each tick
				var time = (new Date()).getTime();
				// Stop the animation if time out
				if(time >= DATA.startTime + DATA.duration) {
					// Remove the tick listener
					cover.off('tick', cover._onTick);
					// Make sure the mask is removed
					cover.updateCache();
					stage.update();
				}
				// Calculate the length of mask
				var percentage = (time - DATA.startTime)/(DATA.duration);
				// Draw the mask
				cover.graphics.clear().beginFill("rgba(50, 50, 50, 0.90)").drawRect(0, height * percentage, width, height * (1 - percentage));
				// Update cache to display it
				cover.updateCache();
			}, null, false, {startTime: startTime, duration: data.duration});
		} else {
			console.log('Unable to find button-' + data.type);
		}
	}
}

// Utilities
gn.prototype.FindNearestJoint = function(x, y, maxDistance) {
	var d = maxDistance * maxDistance;
	var jid = -1;
	
	for(var i = 0; i < this.mapData.joints.length; i++) {
		var nd = (this.mapData.joints[i].x - x) * (this.mapData.joints[i].x - x)
			+ (this.mapData.joints[i].y - y) * (this.mapData.joints[i].y - y);
		if(nd < d) {
			d = nd;
			jid = i;
		}
	}
	
	return jid;
}
gn.prototype.FindNearestSlot = function(x, y, maxDistance) {
	var d = maxDistance * maxDistance;
	var sid = -1;
	
	for(var i = 0; i < this.mapData.slots.length; i++) {
		var nd = (this.mapData.slots[i].x - x) * (this.mapData.slots[i].x - x)
			+ (this.mapData.slots[i].y - y) * (this.mapData.slots[i].y - y);
		if(nd < d) {
			d = nd;
			sid = i;
		}
	}
	
	return sid;
}

function initGame(socket){
	var gnclient = new gn(stage, socket);
	
	var settingPreload = new createjs.LoadQueue(true, './settings/');
	var preload = new createjs.LoadQueue(true, './assets/');
	
	gnclient.BuildButton("Create Room", 900, 200, 120, 50, function(event) {
		socket.emit('create-room');
	}, {});
	
	gnclient.BuildButton("Join Room", 1100, 200, 120, 50, function(event) {
		var rn = prompt('Room Number');
		if (rn != null) {
			var roomNo = ('000'+ rn).substr(-3, 3)
			socket.emit('join-room', roomNo);
		}
	}, {});
	
	socket.on('room-joined', function(data){
		// {roomNo, playerIndex, map, side, (opposite)}
		gnclient.roomNo = data.roomNo;
		gnclient.playerIndex = data.playerIndex;
		gnclient.map = data.map;
		gnclient.side = data.side;
		gnclient.opposite = data.opposite;
		
		gnclient.BuildButton("Room: " + data.roomNo, 900, 300, 320, 50, null, {});
		
		gnclient.BuildButton('Ghost Side', 900, 400, 120, 50, function(event) {
			socket.emit('choose-side', {side:'ghost'});
		}, {});
		
		gnclient.BuildButton('Human Side', 1100, 400, 120, 50, function(event) {
			socket.emit('choose-side', {side:'human'});
		}, {});
		
		gnclient.BuildButton('m01', 900, 500, 80, 50, function(event) {
			socket.emit('choose-map', {map:'m01'});
		}, {});
		
		gnclient.BuildButton('m02', 1020, 500, 80, 50, function(event) {
			socket.emit('choose-map', {map:'m02'});
		}, {});
		
		gnclient.BuildButton('m03', 1140, 500, 80, 50, function(event) {
			socket.emit('choose-map', {map:'m03'});
		}, {});
		
		gnclient.BuildButton('Start Game', 900, 600, 320, 50, function(event) {
			socket.emit('start-game', {});
			
			// See loadScene() below
			
			// socket.emit('load-complete');
			// stage.removeAllChildren();
			// stage.clear();
			// // stage.canvas = gamecanvas;
			
			// // enter loading page
			// gnclient.BuildButton("Loading...", 0, 300, 1280, 50, function(event) {
				
			// }, {});
			
		}, {});
		
		// Somebody already in
		if (data.playerIndex == 1) {
			mapChange(data);
			sidesChange({player:0, side: data.side});
		}
		
		stage.update();
	});
	
	var sidesChange = function(data){
		// console.log(gnclient.playerIndex);
		if (data.player == undefined) {return;}
		if (data.player == gnclient.playerIndex){
			console.log("change side to " + data.side);
			// change my side
		} else {
			console.log("opponent change side to " + data.side);
			// change opponent's side
		}
	};
	
	var mapChange = function(data){
		if (!data.map) {return;}
		gnclient.map = data.map;
	}
	
	function handleSettingsLoad(event) {
		if(event.item.type == 'manifest') {
			// console.log(event);
			gnclient.manifest = gnclient.manifest.concat(event.result);
		}
	}
	
	var loadSetting = function(data) {
		console.log('loading settings.');
		var manifest = [
			{src: 'common.json', type: 'manifest'},
			{src: gnclient.side + '.json', type: 'manifest'}
		]
		
		settingPreload.on("fileload", handleSettingsLoad);
		settingPreload.on("complete", loadScene);
		
		settingPreload.loadManifest(manifest);
	}
	
	function handleProgress(event) {
		// use progress bar to indicate the loading progress
		gnclient.progressBar.scaleX = event.progress;
		stage.update();
		// console.log(event.progress);
	}
	
	function handleAssetsLoad(event) {
		// Store the loaded assets into ghostnight client
		switch (event.item.type) {
			case createjs.AbstractLoader.IMAGE:
				gnclient.assets[event.item.id] = preload.getResult(event.item.id);
				break;
			case createjs.AbstractLoader.JSON:
				if(event.item.id.substr(0, 6) == 'layout') {
					// console.log(event);
					gnclient.layout = event.result;
				}
			default:
				// code
		}
	}
	
	function handleComplete(event) {
		// var bt = document.getElementById("bt");
		// bt.innerHTML = "file complete";
		// document.body.appendChild(event.result);
		// gnclient.progressBar.graphics.clear();
		stage.removeChild(gnclient.progressBar);
		
		// Add background
		var bg = new createjs.Bitmap(gnclient.assets['assets-map']);
		bg.cache(0, 0, stage.canvas.width, stage.canvas.height);
		stage.addChild(bg);
		
		// UI
		// console.log(gnclient.layout);
		gnclient.layout.forEach(function(element) {
			gnclient.ParseLayout(element, true);
		});
		
		stage.update();
		console.log("loading-complete");
		socket.emit('load-complete');
	}
	
	var loadScene = function() {
		console.log('loading scene...');
		
		var manifest = gnclient.manifest;
		manifest.push({src: 'img/bg/' + gnclient.map + '.png', id:'assets-map'});
		
		preload.on('progress', handleProgress);
		preload.on("fileload", handleAssetsLoad);
		preload.on("complete", handleComplete);
		
		stage.removeAllChildren();
		stage.clear();
		
		gnclient.BuildProgressBar();
		preload.loadManifest(manifest);
	}
	
	socket.on('other-joined-room', function(data){
		console.log('other joined room');
	})
	
	socket.on('side-chosen', function(data) {
		// console.log('side-chosen', data);
		sidesChange(data);
	});
	
	socket.on('map-chosen', function(data) {
		// console.log('map-chosen', data); 
		mapChange(data);
	});
	
	socket.on('load-scene', function(data) {
		// console.log('load-scene', data); 
		loadSetting(data);
	});
	
	socket.on('button-cd', function(data){
		gnclient.CoolDownEffect(data);
	});
	
	socket.on('hero-reborn-cd', function(data) {
		
	});
	
	socket.on('hero-skill-cd', function(data) {
		data.type = gnclient.heroName + '-Skill' + data.skillID;
	    gnclient.CoolDownEffect(data);
	});
	
	socket.on('map-data', function(data) {
		gnclient.mapData = data;
	})
	
	socket.on('game-started', function(){
		
		console.log('game-started');
		
	});
	
	socket.on('game-end', function(){
		console.log('');
	});
	
	socket.on('soul-update', function(data){
		if (gnclient.side == 'ghost'){
			console.log("soul-update", data.soul);
			gnclient.soul = data.soul;
			if (!data.ok){
				console.log('Insufficient money');
			}
		}
	});
	
	socket.on('gold-update', function(data){
		if (gnclient.side == 'human'){
			console.log("gold-update", data.gold);
			gnclient.soul = data.gold;
			if (!data.ok){
				console.log('Insufficient money');
			}
		}
	});
	
	socket.on('unit-created', function(data){
		gnclient.BuildUnit(data);
	});
	
	socket.on('unit-moving', function(data){
		gnclient.MoveUnitTo(data);
	});
	
	socket.on('unit-attack', function(){
		console.log('');
	});
	
	socket.on('unit-hp-update', function(uid, hp){
		console.log('');
	});
	
	socket.on('unit-nerf', function(uid, attr){
		console.log('');
	});
	
	socket.on('unit-dead', function(data){
		console.log('unit-dead', data);
		gnclient.RemoveUnit(data);
	});
	
	socket.on('unit-destroyed', function(uid){
		console.log('');
	});
	
	socket.on('hero-moving', function(data){
		gnclient.MoveHeroTo(data);
	});
	
	// socket.on('hero-arrived', function(){
	//     console.log('');
	// });
	
	socket.on('hero-skill', function(skill, target){
		console.log('');
	});
	
	socket.on('hero-attack', function(){
		console.log('');
	});
	
	socket.on('hero-hp-update', function(){
		console.log('');
	});
	
	socket.on('hero-nerf', function(){
		console.log('');
	});
	
	socket.on('hero-dead', function(data){
		console.log('hero-dead', data);
		gnclient.RemoveHero(data);
	});
	
	socket.on('hero-select', function(data){
		gnclient.DrawHeroSelection(data);
	})
	
	socket.on('hero-reborn', function(data){
		console.log('hero-reborn', data);
		gnclient.BuildHero(data);
		gnclient.TogglePanel('panel-' + data.type);
	});
	
	socket.on('tower-built', function(data){
		gnclient.BuildTower(data);
	});
	
	socket.on('tower-removed', function(){
		console.log('');
	});
	
	socket.on('tower-attack', function(){
		console.log('');
	});
	
	socket.on('tower-hp-update', function(){
		console.log('');
	});
	
	socket.on('tower-nerf', function(){
		console.log('');
	});
	
	socket.on('ensign-built', function(data) {
		gnclient.BuildEnsign(data)
	});
	
	socket.on('ensign-removed', function(){
		console.log('');
	});
	
	// socket.on('', function(){
	//     console.log('');
	// });
}