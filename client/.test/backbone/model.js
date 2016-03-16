/*global Backbone*/
var app = app || {};

(function() {
    
    app.GameObject = Backbone.Model.extend({
        initialize: function() {
            
        },
        defaults: {
            img: null,
            obj: null
        },
        alignTransform: function() {
            var trans = this.get("obj").transform;
            var img = this.get("img");
            img.x = trans.x;
            img.y = trans.y;
        }
    });
    
    app.GameObjectCollection = Backbone.Collection.extend({
        model: app.GameObject
    });
    
})();