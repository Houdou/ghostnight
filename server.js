var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var GN = require('./GN.server/GN');

router.use(express.static(path.resolve(__dirname, 'client')));
var sockets = [];

io.on('connection', function (socket) {
	sockets.push(socket);
	
	socket.on('disconnect', function () {
	  sockets.splice(sockets.indexOf(socket), 1);
	});
    
    GN.SetupGhost(socket);

});

function broadcast(event, data) {
    sockets.forEach(function (socket) {
    	socket.emit(event, data);
    });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
    
    // Slot
    var s0 = new GN.Slot(400, 200);
    
    // Road test
    var j0 = new GN.Joint(100, 500);
    var j1 = new GN.Joint(200, 400);
    var j2 = new GN.Joint(300, 300);
    var j3 = new GN.Joint(300, 500);
    
    j1.AttachTo(j0);
    j2.AttachTo(j1);
    j3.AttachTo(j1);
    
    // console.log(j1);
    
    var rs0 = new GN.RoadSign(200, 400, j1, [j0]);
    
    var neko = new GN.GNObjects.Nekomata(0, 0, GN.GM.assignUnitID(), null);
    
    var fs = require('fs');
    fs.readFile('./GN.server/data/map/m01', 'utf8', function(err, data){
        if(err){ console.log('unable to read map'); }
        var map = JSON.parse(data);
        console.log(map.joints);
    });
    
    // console.log(neko);
});
