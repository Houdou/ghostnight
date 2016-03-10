/*global Backbone, createjs*/
var app = app || {}

var canvas, stage;
var drawingCanvas;
var oldPt;
var oldMidPt;
var title;
var color;
var stroke;
var colors;
var index;

var neko, nekomata;

var startJoint, prevJoint, newJoint;

var CanvasView = Backbone.View.extend({
    initialize: function(args) {
        //     this.stage = args.stage;
        //     this.stage.autoclear = true;
            
            this.collection = new app.GameObjectCollection();
            
        //     this.collection.add(new app.GameObject({img: new createjs.Bitmap("/img/assets/neko.png"), obj: new Nekomata(200, 200, null)}));
            
        //     this.collection.listenTo(this.collection, "update", function(){
        //         console.log(this.collection);
        //     }, this);
            
        //     createjs.Ticker.addEventListener("tick", this.stage);
    	   // createjs.Ticker.setInterval(25);
    	   // createjs.Ticker.setFPS(60);
	    
        canvas = document.getElementById("canvas");
    	index = 0;
    	colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];
    
    	//check to see if we are running in a browser with touch support
    	stage = new createjs.Stage(canvas);
    	stage.autoClear = false;
    	stage.enableDOMEvents(true);
    	
    	canvas.oncontextmenu = function (event) {
            event.preventDefault();
        };
    	
    	createjs.Touch.enable(stage);
    	createjs.Ticker.setFPS(24);
    
    	drawingCanvas = new createjs.Shape();
    
    	stage.on("stagemousedown", this.handleMouseDown, this, false, app);
    	stage.on("stagemouseup", this.handleMouseUp, null, false, app);
    
    	stage.addChild(drawingCanvas);
    	stage.update();
    	
    	createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);
        
        var tower = new createjs.Shape();
        	tower.graphics.clear().beginFill("rgba(255,255,255,0.01)").drawCircle(0, 0, 400);
        	tower.x = 400;
        	tower.y = 200;
        
        stage.addChild(tower);
        
        setTimeout(function(){
            nekomata = new Nekomata(startJoint.transform.x - 10, startJoint.transform.y - 10, startJoint);
        	
        neko = new createjs.Shape();
        	neko.graphics.clear().beginFill("#FF3300").drawCircle(0, 0, 15);
        	neko.x = startJoint.transform.x;
        	neko.y = startJoint.transform.y;
        	
    	stage.addChild(neko);
    	
    	neko.addEventListener("tick", function() {
    	    neko.x = nekomata.transform.x;
    	    neko.y = nekomata.transform.y;
    	});
        }, 1000);
        
        
        stage.addChild(this.buildButton("Neko", 30, 640, 50, 50, function(event){
            if(startJoint == null) return;
    	    event.preventDefault();
    	    color = colors[(index++) % colors.length];
    	    
    	    var circle = new createjs.Shape();
        	circle.graphics.clear().beginFill(color).drawCircle(0, 0, 20);
        	circle.x = startJoint.transform.x;
        	circle.y = startJoint.transform.y;
        	
        	
        	var kappa = new Kappa(startJoint.transform.x - 10, startJoint.transform.y - 10, startJoint)
        	
        	console.log(kappa);
        	
        	
        	stage.addChild(circle);
        	
        	circle.addEventListener("tick", function() {
        	    circle.x = kappa.transform.x;
        	    circle.y = kappa.transform.y;
        	})
        	
        	kappa.Move();
        	
    	}, {}));
        
    },
    render: function() {
        console.log(this.collection);
        
        var that = this;
        
        this.collection.forEach(function(obj){
            that.renderObj(obj);
        })
        
        console.log("render");
        
        
        
    },
    renderObj: function(obj) {
        var img = obj.get("img");
        this.stage.addChild(img);
        
        obj.alignTransform();
        var that = this;
        
        var trans = obj.get("obj").transform;
        
        console.log("start");
        console.log(trans);
        console.log(obj.get("obj"));
        
        // this.stage.on("stagemousedown",function(event){
        //     createjs.Tween.get(trans, {override: true})
        //         .to({x: event.stageX - img.getBounds().width/2, y: event.stageY - img.getBounds().height/2}, 400)
        //         .call(function() {
        //             console.log("end");
        //             console.log(trans);
        //             console.log(obj.get("obj"));
        //         });
        // });
        
        img.addEventListener("tick", function(){
            obj.alignTransform();
        });
        
        
        // createjs.Tween.get(img)
        //     .to({x: 10, y : 10}, 300)
        //     .call(function () {
        //         console.log("end");
        //     })
        
        this.stage.update();
    },
    handleMouseMove: function (event) {
        if (!event.primary) { return; }
    	if(new GN.Transform(stage.mouseX, stage.mouseY).DistanceTo(new GN.Transform(oldPt.x, oldPt.y)) > 20)
        {
            drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(oldPt.x, oldPt.y).lineTo(stage.mouseX, stage.mouseY);
            drawingCanvas.graphics.setStrokeStyle(stroke, 'round', 'round').beginStroke(color).drawCircle(stage.mouseX, stage.mouseY, 8);
            oldPt.x = stage.mouseX;
            oldPt.y = stage.mouseY;
        	stage.update();
        	
        	newJoint = new GN.Joint(Math.round(stage.mouseX), Math.round(stage.mouseY));
        	newJoint.AttachTo(prevJoint);
        	prevJoint = newJoint;
        }
    },
    handleMouseUp: function (event) {
        if (!event.primary) { return; }
        stage.removeEventListener("stagemousemove");
        
    },
    handleMouseDown:function (event) {
        if (!event.primary) { return; }
    	if(event.nativeEvent.button == 0)
    	{
    	    if(stage.mouseY > 640) return;
    	    
        	color = colors[(index++) % colors.length];
        	stroke = 3;
        	oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
        	oldMidPt = oldPt.clone();
        	
        	if(startJoint != null)
        	{
            	var connectPoint = GN.Joint.FindNearest(new GN.Transform(stage.mouseX, stage.mouseY), 40);
            	if(connectPoint != null)
            	{
            	    drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round')
            	        .beginStroke(color)
            	        .moveTo(connectPoint.transform.x, connectPoint.transform.y)
            	        .lineTo(stage.mouseX, stage.mouseY);
        	        drawingCanvas.graphics.setStrokeStyle(stroke, 'round', 'round')
        	            .beginStroke(color)
        	            .drawCircle(stage.mouseX, stage.mouseY, 8);
        	            
    	            prevJoint = new GN.Joint(stage.mouseX, stage.mouseY);
    	            prevJoint.AttachTo(connectPoint);
    	            
    	            var rs = new GN.RoadSign(connectPoint.transform.x, connectPoint.transform.x, connectPoint, []);
    	            console.log(rs);
    	            
    	            stage.on("stagemousemove", this.handleMouseMove, null, false, app);
            	}
        	}
        	else
        	{
            	var circle = new createjs.Shape();
            	circle.graphics.clear().beginFill(color).drawCircle(0, 0, 10);
            	circle.x = stage.mouseX;
            	circle.y = stage.mouseY;
            	stage.addChild(circle);
            	stage.update();
            	
            	startJoint = new GN.Joint(stage.mouseX, stage.mouseY);
            	prevJoint = startJoint;
            	
            	console.log(this.handleMouseMove);
        	    stage.on("stagemousemove", this.handleMouseMove, null, false, app);
        	}
    	} else if(event.nativeEvent.button == 1) {
    	    color = colors[(index++) % colors.length];
    	    var circle = new createjs.Shape();
        	circle.graphics.clear().beginFill(color).drawCircle(0, 0, 20);
        	circle.x = stage.mouseX;
        	circle.y = stage.mouseY;
        	
        	circle.moveToNext = function () {
        	    var nearestJoint = GN.Joint.FindNearest(new GN.Transform(this.x, this.y)).Next();
        	    console.log(nearestJoint);
        	    
        	    createjs.Tween.get(circle)
        	        .to({x: nearestJoint.transform.x, y: nearestJoint.transform.y}, 200)
        	        .call(function(){
        	            if(nearestJoint.Next() != null)
        	                circle.moveToNext();
        	            else
        	                stage.removeChild(circle);
        	        });
        	};
        	
        	if(GN.GM.jointCount > 0)
        	{
        	    var nearestJoint = GN.Joint.FindNearest(new GN.Transform(circle.x, circle.y), 50);
        	    console.log(nearestJoint);
        	    
        	    if(nearestJoint != null) {
            	    createjs.Tween.get(circle)
            	        .set({x: nearestJoint.transform.x, y: nearestJoint.transform.y})
            	        .call(function(){stage.addChild(circle);});
        	    }
        	}
        	stage.update();
    	} else if (event.nativeEvent.button == 2) {
    	    var selectJoint = GN.Joint.FindNearest(new GN.Transform(stage.mouseX, stage.mouseY), 40);
    	    if(selectJoint != null)
    	    {
    	        drawingCanvas.graphics.setStrokeStyle(stroke, 'round', 'round').beginStroke("#DDDD00").drawCircle(selectJoint.transform.x, selectJoint.transform.y, 8);
                
                console.log(selectJoint);
                
    	        var path = GN.Joint.FindPathTo(selectJoint, nekomata.joint);
    	        if(path != null)
        	        nekomata.Move(path);
    	    }
    	}
    },
    
    buildButton: function (str, x, y, width, height, onclickFunction, data)
    {
    	var c = new createjs.Container();
    
    	var button = new createjs.Shape();
    	button.graphics.beginStroke("#000").beginFill("#DDD").drawRect(0, 0, width, height);
    	var buttonStr = new createjs.Text(str, "18px Arial", "#777777");
    	buttonStr.x = width / 2 - buttonStr.getBounds().width / 2;
    	buttonStr.y = height / 2 - buttonStr.getBounds().height / 2;
    	
    	c.addChild(button);
    	c.addChild(buttonStr);
    
    	c.on('click', onclickFunction, null, false, data);
    
    	c.x = x;
    	c.y = y;
    
    	return c;
    }
});