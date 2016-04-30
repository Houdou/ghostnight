/*global stage createjs*/

var gn = function(stage, socket) {
	// Infos
	this.stage = stage;
	this.roomNo = -1;
	this.playerIndex = -1;
	this.mode = '';
	this.side = null;
	this.opposite = null;
	this.map = null;
	this.socket = socket;
	this.onKeys = [];
	
	// Assets
	this.manifest = [];
	this.layout = [];
	this.assets = {};
	this.mapData = null;
	
	// Game Elements
	this.objects = new createjs.Container();
	this.units = [];
	this.hero = null;
	this.heroName = null;
	this.towers = [];
	this.blockers = [];
	this.ensigns = [];
	this.roadsigns = [];
	this.goals = [];
	this.gold = 0;
	this.soul = 0;
	
	// UI
	this.currentMenu = "main";
	this.progressBar = null;
	this.inputState = 'normal';
	this.UI = [];
	this.Text = [];
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
		c.on('click', onclickFunction, this, false, eventData);

	c.x = x;
	c.y = y;
	
	this.UI[srcImgID] = c;
	
	if(draw) {
		stage.addChild(c);
		stage.update();
	}
	
	return c;
}
gn.prototype.BuildTextButton = function(srcImgID, x, y, width, height, offset, onclickFunction, eventData, draw, scale) {
	var c = new createjs.Bitmap(this.assets[srcImgID]);
	c.regX = width/2;
	c.regY = height/2;
	c.scaleX = scale || 1;
	c.scaleY = scale || 1;
	
	if(onclickFunction)
		c.on('click', onclickFunction, this, false, eventData);

	c.x = x;
	c.y = y;
	
	var hit = new createjs.Shape();
	hit.graphics.beginFill("#000").drawRect(0, 0, width, height);
	c.hitArea = hit;
	
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
gn.prototype.BuildText = function(text, name, size, color, align, x, y, draw, scale) {
	var str = new createjs.Text(text, size + " Brush Script MT", color);
	str.textAlign = align;
	str.x = x;
	str.y = y;
	str.scaleX = scale || 1;
	str.scaleY = scale || 1;
	
	this.Text[name] = str;
	
	if(draw) {
		stage.addChild(str);
		stage.update();
	}
	
	return str;
}
gn.prototype.BuildProgressBar = function() {
	var progressBar = new createjs.Shape();
	progressBar.graphics.beginFill("#EF5311").drawRect(0, 0, 1280, 4);
	// progressBar.x = 960;
	progressBar.y = 640;
	progressBar.scaleX = 0;
	this.progressBar = progressBar;
	
	stage.addChild(this.progressBar);
	stage.update();
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
								DATA.data = new Object();
								DATA.data.jid = this.FindNearestJoint(event.stageX, event.stageY, data.maxDistance);
								console.log(DATA);
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
								DATA.data = new Object();
								console.log(event.stageX + ', ' + event.stageY);
								DATA.data.sid = this.FindNearestSlot(event.stageX, event.stageY, data.maxDistance);
								console.log(DATA.data.sid);
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
		case 'text':
			return this.BuildText(element.text, element.name, element.size, element.color, element.align, element.x, element.y, draw);
		default: break;
	}
}

// Menu
gn.prototype.BuildMenu = function() {
	// Remove progress bar
	stage.removeChild(this.progressBar);
	
	// Add background
	var bg = new createjs.Bitmap(this.assets['assets-bg-main']);
	bg.cache(0, 0, stage.canvas.width, stage.canvas.height);
	stage.addChild(bg);
	
	// UI
	var cMenu = new createjs.Container();
	// Single Player
	// To-Do
	var btnSP = this.BuildTextButton('button-main-sp', 1200, 138, 244, 55, 0,
		this.ShowPanel, {panelID: 'SP', state: {x: 480}, time: 800, ease: createjs.Ease.quintOut,
			callback: (event)=>{this.socket.emit('create-room', {mode: 'SP'});}},
		false);
	btnSP.alpha = 0;
	cMenu.addChild(btnSP);
	
	// Multi Player
	var btnMP = this.BuildTextButton('button-main-mp', 1200, 238, 244, 55, 0,
		this.ShowPanel, {panelID: 'MP', state: {x: 480}, time: 800, ease: createjs.Ease.quintOut, callback: null},
		false);
	btnMP.alpha = 0;
	cMenu.addChild(btnMP);
	
	// Collection
	// To-Do
	var btnC = this.BuildTextButton('button-main-c', 1200, 338, 244, 55, 0, ()=>{console.log("c")}, null, false);
	btnC.alpha = 0;
	cMenu.addChild(btnC);
	
	// Entering animation
	createjs.Tween.get(btnSP).to({alpha: 1, x: 1000}, 800, createjs.Ease.cubicOut);
	createjs.Tween.get(btnMP).wait(100).to({alpha: 1, x: 1000}, 800, createjs.Ease.cubicOut);
	createjs.Tween.get(btnC).wait(200).to({alpha: 1, x: 1000}, 800, createjs.Ease.cubicOut);
	
	this.panel['main'] = cMenu;
	stage.addChild(cMenu);
	
	// SP Panel
	var cSP = new createjs.Container();
	cSP.x = 1280;
	var panelbgSP = new createjs.Bitmap(this.assets['assets-bg-panel']);
	panelbgSP.alpha = 0.97;
	cSP.addChild(panelbgSP);
	
	// Back button
	var btnBackSP = this.BuildTextButton('button-back', 660, 36, 89, 43, 0,
		this.HidePanel, {panelID: 'SP', state: {x: 1280}, time: 800, ease: createjs.Ease.quintOut, callback: null},
		false, 0.8);
	cSP.addChild(btnBackSP);
	
	// Room Text
	var strRoomSP = this.BuildText('---', 'roomNoSP', '48px', '#982205', 'left', 444, 148, true, 1);
	cSP.addChild(strRoomSP);
	
	this.panel['SP'] = cSP;
	stage.addChild(cSP);
	
	// Room panel
	var cSPRM = new createjs.Container();
	
	// Map Buttons
	var btnMapSP = this.BuildTextButton('button-map', 184, 383, 79, 54, 0,
		(event)=>{console.log("map")}, null,
		false);
	cSPRM.addChild(btnMapSP);
	var btnM01SP = this.BuildTextButton('button-m01', 409, 379, 22, 39, 0,
		(event)=>{this.socket.emit('choose-map', {map:'m01'});}, null,
		false);
	cSPRM.addChild(btnM01SP);
	var btnM02SP = this.BuildTextButton('button-m02', 484, 379, 31, 39, 0,
		(event)=>{this.socket.emit('choose-map', {map:'m02'});}, null,
		false);
	cSPRM.addChild(btnM02SP);
	var btnM03SP = this.BuildTextButton('button-m03', 559, 379, 28, 40, 0,
		(event)=>{this.socket.emit('choose-map', {map:'m03'});}, null,
		false);
	cSPRM.addChild(btnM03SP);
	// Map chosen mark
	var mapCircleSP = this.BuildImage('assets-icon-circle', 407, 379, 83, 83, 0, null, null, false);
	mapCircleSP.name = 'map';
	mapCircleSP.alpha = 0;
	cSPRM.addChild(mapCircleSP);
	
	// Start Game
	var btnStartSP = this.BuildTextButton('button-start', 360, 580, 353, 73, 0,
		(event)=>{this.socket.emit('start-game');}, null,
		false);
	cSPRM.addChild(btnStartSP);
	
	this.panel['SPRM'] = cSPRM;
	cSPRM.alpha = 0;
	cSP.addChild(cSPRM);
	
	// MP Panel
	var cMP = new createjs.Container();
	cMP.x = 1280;
	var panelbg = new createjs.Bitmap(this.assets['assets-bg-panel']);
	panelbg.alpha = 0.97;
	cMP.addChild(panelbg);
	
	// Back button
	var btnBack = this.BuildTextButton('button-back', 660, 36, 89, 43, 0,
		this.HidePanel, {panelID: 'MP', state: {x: 1280}, time: 800, ease: createjs.Ease.quintOut, callback: null},
		false, 0.8);
	cMP.addChild(btnBack);
	
	// Room Text
	var strRoom = this.BuildText('---', 'roomNoMP', '48px', '#982205', 'left', 354, 148, true, 1);
	cMP.addChild(strRoom);
	
	// Create Room 
	var btnCreateRoom = this.BuildTextButton('button-mp-create', 550, 140, 228, 43, 0,
		(event)=>{this.socket.emit('create-room', {mode: 'MP'});}, null,
		false, 0.5);
	cMP.addChild(btnCreateRoom);
	
	// Join Room 
	var btnJoinRoom = this.BuildTextButton('button-mp-join', 550, 200, 182, 42, 0,
		(event)=>{
			var rn = prompt('Room Number');
			if (rn != null) {
				var roomNo = ('000'+ rn).substr(-3, 3)
				this.socket.emit('join-room', roomNo);
			}
		}, null,
		false, 0.5);
	cMP.addChild(btnJoinRoom);
	
	this.panel['MP'] = cMP;
	stage.addChild(cMP);
	
	// Room panel
	var cMPRM = new createjs.Container();
	// Ghost Side
	var btnGhostSide = this.BuildTextButton('button-ghost', 203, 307, 199, 46, 0,
		(event)=>{this.socket.emit('choose-side', {side:'ghost'});}, null,
		false);
	cMPRM.addChild(btnGhostSide);
	// Human Side
	var btnHumanSide = this.BuildTextButton('button-human', 513, 307, 219, 46, 0,
		(event)=>{this.socket.emit('choose-side', {side:'human'});}, null,
		false);
	cMPRM.addChild(btnHumanSide);
	// Side chosen mark
	var checkRed = this.BuildImage('assets-icon-checkmark-red', 358, 360, 82, 70, 0, null, null, false, 0.75);
	var checkBlue = this.BuildImage('assets-icon-checkmark-blue', 358, 360, 82, 70, 0, null, null, false, 0.75);
	checkRed.name = 'check0';
	checkBlue.name = 'check1';
	checkRed.alpha = 0;
	checkBlue.alpha = 0;
	cMPRM.addChild(checkRed);
	cMPRM.addChild(checkBlue);
	
	// Map Buttons
	var btnMap = this.BuildTextButton('button-map', 184, 473, 79, 54, 0,
		(event)=>{console.log("map")}, null,
		false);
	cMPRM.addChild(btnMap);
	var btnM01 = this.BuildTextButton('button-m01', 409, 469, 22, 39, 0,
		(event)=>{this.socket.emit('choose-map', {map:'m01'});}, null,
		false);
	cMPRM.addChild(btnM01);
	var btnM02 = this.BuildTextButton('button-m02', 484, 469, 31, 39, 0,
		(event)=>{this.socket.emit('choose-map', {map:'m02'});}, null,
		false);
	cMPRM.addChild(btnM02);
	var btnM03 = this.BuildTextButton('button-m03', 559, 469, 28, 40, 0,
		(event)=>{this.socket.emit('choose-map', {map:'m03'});}, null,
		false);
	cMPRM.addChild(btnM03);
	// Map chosen mark
	var mapCircle = this.BuildImage('assets-icon-circle', 407, 469, 83, 83, 0, null, null, false);
	mapCircle.name = 'map';
	mapCircle.alpha = 0;
	cMPRM.addChild(mapCircle);
	
	// Start Game
	var btnStart = this.BuildTextButton('button-start', 360, 580, 353, 73, 0,
		(event)=>{this.socket.emit('start-game');}, null,
		false);
	cMPRM.addChild(btnStart);
	
	this.panel['MPRM'] = cMPRM;
	cMPRM.alpha = 0;
	cMP.addChild(cMPRM);
	
	stage.update();
}
gn.prototype.ShowPanel = function(event, data) {
	// Hide main
	createjs.Tween.get(this.panel['main'], {override: true})
		.to({alpha: 0}, 400);
	
	// Change menu
	this.currentMenu = data.panelID;
	this.mode = data.panelID;
	var c = this.panel[data.panelID];
	var tween = createjs.Tween.get(c, {override: true})
		.to(data.state, data.time, data.ease);
	if(data.callback != null)
		tween.call(data.callback);
}
gn.prototype.HidePanel = function(event, data) {
	// Show main
	createjs.Tween.get(this.panel['main'], {override: true})
		.to({alpha: 1}, 1000);
	
	// Hide menu
	this.currentMenu = 'main';
	this.mode = '';
	var c = this.panel[data.panelID];
	var tween = createjs.Tween.get(c, {override: true})
		.to(data.state, data.time, data.ease);
	if(data.callback != null)
		tween.call(data.callback);
};

// Build
gn.prototype.BuildRoadSign = function(data) {
	var imgstick = this.assets['assets-road-stick'];
	var imgsign = this.assets['assets-road-sign'];
	
	var c = new createjs.Container();
	var stick = new createjs.Bitmap(imgstick);
	var sign = new createjs.Bitmap(imgsign);
	
	c.addChild(stick);
	c.addChild(sign);
	
	stick.regX = 6;
	stick.regY = 67;
	sign.regX = 25;
	sign.regY = 10;
	sign.y = -53;
	
	sign.on('click', ()=>{
		this.socket.emit('switch-roadsign', {rid: data.rid});
	})
	
	c.x = data.x;
	c.y = data.y;
	
	this.roadsigns[data.rid] = sign;
	stage.addChild(c);
	stage.update();
}
gn.prototype.BuildGoal = function(data) {
	var goalimg = this.assets['assets-goal-red'];
	
	var goal = new createjs.Bitmap(goalimg);
	
	goal.regX = 96;
	goal.regY = 96;
	
	goal.x = data.x;
	goal.y = data.y;
	goal.scaleX = 0.25;
	goal.scaleY = 0.18;
	
	this.goals[data.gid] = goal;
	stage.addChild(goal);
	stage.update();
}
gn.prototype.BuildGoalLife = function() {
	var img = this.assets['assets-goal-life-value'];
	var c = new createjs.Container();
	var value = new createjs.Bitmap(img);
	var fill = new createjs.Shape();
	
	fill.graphics.clear().beginFill("rgba(0, 0, 0, 1)").drawRect(0, 0, 175, 13);
	fill.cache(0, 0, 175, 13);
	value.filters = [new createjs.AlphaMaskFilter(fill.cacheCanvas)];
	value.cache(0, 0, 175, 13);
	
	c.x = 138;
	c.y = 64;
	
	c.addChild(value);
	
	this.UI['goal-life'] = value;
	
	stage.addChild(c);
	stage.update();
}
gn.prototype.BuildUnit = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	var hpbar = new createjs.Bitmap(this.assets['assets-unit-life-bar']);
	var value = new createjs.Bitmap(this.assets['assets-unit-life-value']);
	var fill = new createjs.Shape();
	
	fill.graphics.clear().beginFill("rgba(0, 0, 0, 1)").drawRect(0, 0, 45, 14);
	fill.cache(0, 0, 45, 14);
	value.filters = [new createjs.AlphaMaskFilter(fill.cacheCanvas)];
	value.cache(0, 0, 45, 14);
	// hp fill offset
	value.x = 3;
	
	hpbar.regX = 28;
	hpbar.regY = 56;
	value.regX = 25.5;
	value.regY = 56;
	
	c.addChild(hpbar);
	c.addChild(value);
	
	unit.regX = 24;
	unit.regY = 36;
	
	unit.cache(0, 0, 48, 48);
	
	// Special for foxfire
	if(data.type == "Foxfire") {
		unit.y = -18;
		hpbar.y = -24;
		value.y = -24;
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
	
	this.units[data.uid] = c;
	this.objects.addChild(c);
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
	
	var hpbar = new createjs.Bitmap(this.assets['assets-hero-life-bar']);
	var value = new createjs.Bitmap(this.assets['assets-hero-life-value']);
	var fill = new createjs.Shape();
	
	fill.graphics.clear().beginFill("rgba(0, 0, 0, 1)").drawRect(0, 0, 68, 21);
	fill.cache(0, 0, 68, 21);
	value.filters = [new createjs.AlphaMaskFilter(fill.cacheCanvas)];
	value.cache(0, 0, 68, 21);
	// hp fill offset
	value.x = 3;
	
	hpbar.regX = 40;
	hpbar.regY = 80;
	value.regX = 36;
	value.regY = 80;
	
	c.addChild(hpbar);
	c.addChild(value);
	
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
			if(this.inputState == "normal"){
				var jid = this.FindNearestJoint(event.stageX, event.stageY, 50);
				if(jid != -1) {
					this.socket.emit('move-hero', {jid: jid});
				}
			}
		});
	}
	
	this.objects.addChild(c);
	stage.update();
}
gn.prototype.BuildTower = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	var hpbar = new createjs.Bitmap(this.assets['assets-tower-life-bar']);
	var value = new createjs.Bitmap(this.assets['assets-tower-life-value']);
	var fill = new createjs.Shape();
	
	fill.graphics.clear().beginFill("rgba(0, 0, 0, 1)").drawRect(0, 0, 68, 21);
	fill.cache(0, 0, 68, 21);
	value.filters = [new createjs.AlphaMaskFilter(fill.cacheCanvas)];
	value.cache(0, 0, 68, 21);
	// hp fill offset
	value.x = 3;
	
	hpbar.regX = 40;
	hpbar.regY = 90;
	value.regX = 36;
	value.regY = 90;
	
	c.addChild(hpbar);
	c.addChild(value);
	
	unit.regX = 40;
	unit.regY = 66;
	
	unit.cache(0, 0, 80, 80);
	
	c.addChild(unit);
	
	c.x = this.mapData.slots[+data.sid].x;
	c.y = this.mapData.slots[+data.sid].y;
	
	this.towers[data.tid] = c;
	this.objects.addChild(c);
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
	
	this.ensigns[data.eid] = c;
	this.objects.addChild(c);
	stage.update();
}
gn.prototype.BuildBlocker = function(data) {
	var img = this.assets['assets-' + data.type];
	var unit = new createjs.Bitmap(img);
	var c = new createjs.Container();
	
	var hpbar = new createjs.Bitmap(this.assets['assets-blocker-life-bar']);
	var value = new createjs.Bitmap(this.assets['assets-blocker-life-value']);
	var fill = new createjs.Shape();
	
	fill.graphics.clear().beginFill("rgba(0, 0, 0, 1)").drawRect(0, 0, 68, 21);
	fill.cache(0, 0, 68, 21);
	value.filters = [new createjs.AlphaMaskFilter(fill.cacheCanvas)];
	value.cache(0, 0, 68, 21);
	// hp fill offset
	value.x = 3;
	
	hpbar.regX = 40;
	hpbar.regY = 60;
	value.regX = 36;
	value.regY = 60;
	
	c.addChild(hpbar);
	c.addChild(value);
	
	
	unit.regX = 32;
	unit.regY = 54;
	
	unit.cache(0, 0, 64, 64);
	
	c.addChild(unit);
	
	c.x = data.x;
	c.y = data.y;
	
	this.blockers[data.bid] = c;
	this.objects.addChild(c);
	stage.update();
}

// Update
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
gn.prototype.ChangeRoadSign = function(data) {
	var roadsign = this.roadsigns[data.rid];
	
	var r = Math.atan2(data.dy, data.dx);
	roadsign.rotation = r / Math.PI * 180;
	stage.update();
}
gn.prototype.UpdateGoalLife = function(data) {
	var value = this.UI['goal-life'];
	
	value.cache(0, 0, 175 * data.life / data.maxlife, 13);
	stage.update();
}
gn.prototype.UpdateHPBar = function(type, data) {
	var c = null;
	var width = 0;
	var height = 0;
	switch (type) {
		case 'unit':
			c = this.units[data.uid];
			width = 45; height = 14;
			break;
		case 'hero':
			c = this.hero;
			width = 68; height = 21;
			break;
		case 'tower':
			c = this.towers[data.tid];
			width = 68; height = 21;
			break;
		case 'blocker':
			c = this.blockers[data.bid];
			width = 68; height = 21;
			break;
		default:
			break;
	}
	
	if(c != null) {
		// Value
		var value = c.getChildAt(1);
		value.cache(0, 0, data.hp / data.maxhp * width, height);
		stage.update();
	}
}
gn.prototype.UpdateText = function(name, data) {
	var text = this.Text[name];
	text.text = data.text;
	
	stage.update();
	return text;
}
gn.prototype.Resorting = function() {
	this.objects.sortChildren((a, b, option)=>{
		return a.y - b.y;
	});
	stage.update();
}

// Remove
gn.prototype.RemoveUnit = function(data) {
	this.objects.removeChild(this.units[data.uid]);
	stage.update();
}
gn.prototype.RemoveHero = function(data) {
	this.objects.removeChild(this.hero);
	this.hero = null;
	stage.update();
}
gn.prototype.RemoveTower = function(data) {
	this.objects.removeChild(this.towers[data.tid]);
	stage.update();
}
gn.prototype.RemoveEnsign = function(data){
	this.objects.removeChild(this.ensigns[data.eid]);
	stage.update();
}
gn.prototype.RemoveBlocker = function(data) {
	this.objects.removeChild(this.blockers[data.bid]);
	stage.update();
}
gn.prototype.RemoveGoal = function(data) {
	stage.removeChild(this.goals[data.gid]);
	stage.update();
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
	
	var menuPreload = new createjs.LoadQueue(true, './assets/');
	var settingPreload = new createjs.LoadQueue(true, './settings/');
	var preload = new createjs.LoadQueue(true, './assets/');
	
	loadMenu();
	
	window.addEventListener("keydown", (event)=>{
		gnclient.Resorting();
	})
	
	
	socket.on('room-joined', function(data){
		// {roomNo, playerIndex, map, side, (opposite)}
		gnclient.roomNo = data.roomNo;
		gnclient.playerIndex = data.playerIndex;
		
		// Display Room panel
		createjs.Tween.get(gnclient.panel[gnclient.mode + 'RM'])
			.to({alpha: 1}, 400);
		gnclient.UpdateText('roomNo' + data.mode, {text: gnclient.roomNo});
		stage.update();
		
		// Side choose
		gnclient.side = data.side;
		sidesChange(data);
		
		// Map choose
		gnclient.map = data.map;
		mapChange(data);
		
		// Somebody already in
		gnclient.opposite = data.opposite;
		if (data.opposite != null) {
			sidesChange({playerIndex: 0, side: data.opposite});
		}
		
		stage.update();
	});
	
	var sidesChange = function(data){
		if (data.playerIndex == undefined) { return; }
		
		if (data.playerIndex == gnclient.playerIndex){
			gnclient.side = data.side;
		} else {
			gnclient.opposite = data.side;
		}
		
		if(gnclient.mode == 'MP') {
			var checkmark = gnclient.panel[gnclient.mode + 'RM'].getChildByName('check' + data.playerIndex);
			createjs.Tween.get(checkmark, {override: true})
				.to({
					alpha: 1,
					x: 143 + parseInt(data.playerIndex) * 120 + (data.side == 'human'? 310 : 0)
				}, 500, createjs.Ease.quartOut);
		}
	};
	
	var mapChange = function(data){
		if(data.map == undefined) { return; }
		
		gnclient.map = data.map;
		
		if(gnclient.mode != '') {
			var circleMark = gnclient.panel[gnclient.mode + 'RM'].getChildByName('map');
			createjs.Tween.get(circleMark, {override: true})
				.to({
					alpha: 1,
					x: 334 + parseInt(data.map.substr(-1, 1)) * 75
				}, 500, createjs.Ease.quartOut);
		}
	}
	
	function handleSettingsLoad(event) {
		if(event.item.type == 'manifest') {
			// Append the loaded manifest to current one.
			gnclient.manifest = gnclient.manifest.concat(event.result);
		}
	}
	
	function handleProgress(event) {
		// Use progress bar to indicate the loading progress
		gnclient.progressBar.scaleX = event.progress;
		stage.update();
	}
	
	function handleAssetsLoad(event) {
		// Store the loaded assets into ghostnight client
		switch (event.item.type) {
			case createjs.AbstractLoader.IMAGE:
				gnclient.assets[event.item.id] = event.target.getResult(event.item.id);
				break;
			case createjs.AbstractLoader.JSON:
				if(event.item.id.substr(0, 6) == 'layout')
					gnclient.layout = event.result;
				break;
			default:
				break;
		}
	}
	
	function handleMenuComplete(event) {
		gnclient.BuildMenu();
	}
	
	function handleComplete(event) {
		// Remove progress bar
		stage.removeChild(gnclient.progressBar);
		
		// Add background
		var bg = new createjs.Bitmap(gnclient.assets['assets-map']);
		bg.cache(0, 0, stage.canvas.width, stage.canvas.height);
		stage.addChild(bg);
		
		// UI
		gnclient.layout.forEach(function(element) {
			gnclient.ParseLayout(element, true);
		});
		
		stage.update();
		console.log("loading-complete");
		socket.emit('load-complete');
	}
	
	function loadMenu() {
		console.log('loading menu...');
		
		var menuManifest = [
			{"src": "img/bg/home.png", "id": "assets-bg-main"},
			{"src": "img/bg/panel-shadow.png", "id": "assets-bg-panel"},
			{"src": "img/icons/checkmark-red.png", "id": "assets-icon-checkmark-red"},
			{"src": "img/icons/checkmark-blue.png", "id": "assets-icon-checkmark-blue"},
			{"src": "img/icons/circle.png", "id": "assets-icon-circle"},
			{"src": "img/text-buttons/main-menu-c.png", "id": "button-main-c"},
			{"src": "img/text-buttons/main-menu-sp.png", "id": "button-main-sp"},
			{"src": "img/text-buttons/main-menu-mp.png", "id": "button-main-mp"},
			{"src": "img/text-buttons/mp-create-rm.png", "id": "button-mp-create"},
			{"src": "img/text-buttons/mp-join-rm.png", "id": "button-mp-join"},
			{"src": "img/text-buttons/btn-ghost.png", "id": "button-ghost"},
			{"src": "img/text-buttons/btn-human.png", "id": "button-human"},
			{"src": "img/text-buttons/btn-map.png", "id": "button-map"},
			{"src": "img/text-buttons/btn-m01.png", "id": "button-m01"},
			{"src": "img/text-buttons/btn-m02.png", "id": "button-m02"},
			{"src": "img/text-buttons/btn-m03.png", "id": "button-m03"},
			{"src": "img/text-buttons/back-btn.png", "id": "button-back"},
			{"src": "img/text-buttons/start-btn.png", "id": "button-start"}
		];
		
		menuPreload.on('progress', handleProgress);
		menuPreload.on("fileload", handleAssetsLoad);
		menuPreload.on("complete", handleMenuComplete);
		
		stage.removeAllChildren();
		stage.clear();
		
		gnclient.BuildProgressBar();
		menuPreload.loadManifest(menuManifest);
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
		sidesChange(data);
	})
	
	socket.on('side-chosen', function(data) {
		sidesChange(data);
	});
	
	socket.on('map-chosen', function(data) {
		mapChange(data);
	});
	
	socket.on('load-scene', function(data) {
		loadSetting(data);
	});
	
	
	socket.on('game-started', function() {
		stage.addChild(gnclient.objects);
		setInterval(()=>{gnclient.Resorting();}, 200);
		console.log('game-started');
	});
	
	socket.on('game-end', function(data) {
		
		console.log('Game end.', data);
	});
	
	socket.on('roadsign-built', function(data) {
	    gnclient.BuildRoadSign(data);
	});
	
	socket.on('roadsign-changed', function(data) {
	    gnclient.ChangeRoadSign(data);
	});
	
	socket.on('goal-life-bar-built', function() {
	    gnclient.BuildGoalLife();
	});
	
	socket.on('goal-built', function(data) {
	    gnclient.BuildGoal(data);
	});
	
	socket.on('goal-damage', function(data) {
		gnclient.UpdateGoalLife(data);
	});
	
	socket.on('goal-dead', function(data) {
		gnclient.RemoveGoal(data);
	});
	
	socket.on('button-cd', function(data){
		gnclient.CoolDownEffect(data);
	});
	
	socket.on('map-data', function(data) {
		gnclient.mapData = data;
	});
	
	socket.on('soul-update', function(data){
		if (gnclient.side == 'ghost'){
			gnclient.soul = data.soul;
			gnclient.UpdateText('money', {text: "" + data.soul});
			if (!data.ok){
				console.log('Insufficient money');
			}
		}
	});
	
	socket.on('gold-update', function(data){
		if (gnclient.side == 'human'){
			gnclient.gold = data.gold;
			gnclient.UpdateText('money', {text: "" + data.gold});
			if (!data.ok){
				console.log('Insufficient money');
			}
		}
	});
	
	// Unit
	socket.on('unit-created', function(data){
		gnclient.BuildUnit(data);
	});
	
	socket.on('unit-moving', function(data){
		gnclient.MoveUnitTo(data);
	});
	
	socket.on('unit-attack', function(){
		console.log('');
	});
	
	socket.on('unit-hp-update', function(data){
		gnclient.UpdateHPBar('unit', data);
	});
	
	socket.on('unit-nerf', function(uid, attr){
		console.log('');
	});
	
	socket.on('unit-dead', function(data){
		gnclient.RemoveUnit(data);
	});
	
	socket.on('unit-remove', function(data){
		gnclient.RemoveUnit(data);
	});
	
	// Hero
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
	
	socket.on('hero-skill-cd', function(data) {
		data.type = gnclient.heroName + '-Skill' + data.skillID;
	    gnclient.CoolDownEffect(data);
	});
	
	socket.on('hero-hp-update', function(data){
		gnclient.UpdateHPBar('hero', data);
	});
	
	socket.on('hero-nerf', function(){
		console.log('');
	});
	
	socket.on('hero-dead', function(data){
		gnclient.RemoveHero(data);
		gnclient.TogglePanel('panel-Reborn');
	});
	
	socket.on('hero-select', function(data){
		gnclient.DrawHeroSelection(data);
	})
	
	socket.on('hero-reborn', function(data){
		gnclient.BuildHero(data);
		gnclient.TogglePanel('panel-' + data.type);
	});
	
	socket.on('hero-reborn-cd', function(data) {
		
	});
	
	// Tower
	socket.on('tower-built', function(data) {
		gnclient.BuildTower(data);
	});
	
	socket.on('tower-removed', function(){
		console.log('');
	});
	
	socket.on('tower-attack', function(){
		console.log('');
	});
	
	socket.on('tower-nerf', function(){
		console.log('');
	});
	
	socket.on('tower-hp-update', function(data) {
		gnclient.UpdateHPBar('tower', data);
	});
	
	socket.on('tower-dead', function(data){
		gnclient.RemoveTower(data);
	});
	
	// Blocker
	socket.on('blocker-built', function(data) {
		data.type = 'Blocker';
		gnclient.BuildBlocker(data);
	});
	
	socket.on('blocker-nerf', function(){
		console.log('');
	});
	
	socket.on('blocker-hp-update', function(data) {
		gnclient.UpdateHPBar('blocker', data);
	});
	
	socket.on('blocker-dead', function(data){
		gnclient.RemoveBlocker(data);
	});
	
	socket.on('ensign-built', function(data) {
		gnclient.BuildEnsign(data)
	});
	
	socket.on('ensign-removed', function(data){
		gnclient.RemoveEnsign(data);
	});
	
	socket.on('message-send', function(data){
	    console.log(data.side + ": " + data.message);
	});
	
	var say = function(msg){
		gnclient.socket.emit('send-message', {message: msg});
	}
}