/*global Backbone, createjs*/
var app = app || {}

var CanvasView = Backbone.View.extend({
    initialize: function(args) {
        this.stage = args.stage;
        this.stage.autoclear = true;
        
        this.collection = new app.GameObjectCollection();
        
        this.collection.add(new app.GameObject({img: new createjs.Bitmap("/img/assets/neko.png"), obj: new Nekomata(200, 200, null)}));
        
        this.collection.listenTo(this.collection, "update", function(){
            console.log(this.collection);
        }, this);
        
        createjs.Ticker.addEventListener("tick", this.stage);
	    createjs.Ticker.setInterval(25);
	    createjs.Ticker.setFPS(60);
	    
	    this.stage.addEventListener("click", function() {
            console.log(!createjs.Ticker.getPaused());
            createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
        });
        
        
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
        
        this.stage.on("stagemousedown",function(event){
            createjs.Tween.get(trans, {override: true})
                .to({x: event.stageX - img.getBounds().width/2, y: event.stageY - img.getBounds().height/2}, 400)
                .call(function() {
                    console.log("end");
                    console.log(trans);
                    console.log(obj.get("obj"));
                });
        });
        
        img.addEventListener("tick", function(){
            obj.alignTransform();
        });
        
        
        // createjs.Tween.get(img)
        //     .to({x: 10, y : 10}, 300)
        //     .call(function () {
        //         console.log("end");
        //     })
        
        this.stage.update();
    }
});