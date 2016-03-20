var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var util = require('util');

var GhostNight = require('./GN.server/GN');

router.use(express.static(path.resolve(__dirname, 'client')));
var sockets = [];

io.on('connection', function (socket) {
	sockets.push(socket);
	
	socket.on('click', function(click) {
	    // click: {x, y, button};
        console.log(click);
	});
	
	socket.on('join-room', function(data) {
	    socket.join(data.room);
	    socket.on('choose-side', function(data) {
	        var GN = new GhostNight({MinDamage: 1});
    	    
    	    GN.SceneMangement.LoadMap('m01', function(err, data) {
    	        if(err) {
    	            console.log(data);
    	        }
    	        
    	        // To do when the map is loaded.
                // console.log(util.inspect(GN.GM, {depth: 4}));
            });
            
            socket.on('create-unit', function(data) {
                console.log(GN.GNObjects.GetType(data.type));
            })
	    });
	});
	
	socket.on('disconnect', function () {
	  sockets.splice(sockets.indexOf(socket), 1);
	});

});

function broadcast(event, data) {
    sockets.forEach(function (socket) {
    	socket.emit(event, data);
    });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
    
    var GN = new GhostNight({MinDamage: 1});
    var mapNo = "m01";
    
    console.log("loading map: " + mapNo);
    GN.SceneMangement.LoadMap(mapNo, function(err, data) {
        if(err) {
            console.log(data);
            return false;
        }
        
        // To do when the map is loaded.
        // console.log(util.inspect(GN.GM, {depth: 4}));
        
        console.log("map " + mapNo + " is loaded");
        
        GN.createTower("Miko", 0);
        GN.createUnit("Kappa");
        
    });
});
