var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var util = require('util');
var SetupGhost = require('./GN.server/Setup/Ghost');
var SetupHuman = require('./GN.server/Setup/Human');

var GhostNight = require('./GN.server/GN');
var Room = require('./Room');

router.use(express.static(path.resolve(__dirname, 'client')));
var sockets = [];
var rooms = [];
// rooms.push(new Room('lobby'));
rooms['lobby'] = new Room('lobby');

io.on('connection', function (socket) {
	sockets.push(socket);
	var myRoomNo;
	socket.join('lobby');
		
	socket.on('click', function(click) {
	    // click: {x, y, button};
        console.log(click);
	});
	
	socket.on('create-room', function(roomNo) {
		while(rooms[roomNo] != undefined) {
			roomNo = ('000' + Math.floor(1000 * Math.random())).substr(-3, 3);
		}
		
		createRoom(socket, roomNo);
		myRoomNo = roomNo;
	});
	
	socket.on('join-room', function(roomNo) {
		joinRoom(socket, roomNo);
		myRoomNo = roomNo;
	});
	
	socket.on('start-game', function(){
		startGame(socket, myRoomNo);
	})
	
	socket.on('disconnect', function () {
	  sockets.splice(sockets.indexOf(socket), 1);
	});

});

function createRoom(socket, roomNo) {
	var newRoom = new Room(roomNo);
	rooms[roomNo] = newRoom;
	
	joinRoom(socket, roomNo);
}

function joinRoom(socket, roomNo) {
	var room = rooms[roomNo];
	
	if(room != undefined) {
		if(room.players.length >= 2) {
			socket.emit('room-full');
			return false;
		}
		
		socket.join(roomNo);
		
		socket.emit('join-room', roomNo);
		
		var playerIndex = room.players.push({socket: socket, side: 0b10}) - 1;
			
		socket.on('choose-side', function(side){
			if(side == 'ghost')
				room.players[playerIndex].side = 0b10;
			if(side == 'human')
				room.players[playerIndex].side = 0b01;
			broadcastToRoom(room, "side-chosen", {player: playerIndex, side: side});
			console.log("choose-side", side);
		});
	} else {
		createRoom(socket, roomNo);
	}
}

function startGame(socket, roomNo){
	var room = rooms[roomNo];
	if (room.players[0].side == room.players[1].side){
		console.log("Players in same side in room ", roomNo);
		return;
	} else {
		broadcast("game-starting", {})
		room.GN = new GhostNight({MinDamage: 1});
		for (var i in room.players){
			if (room.players[i].side == 0b10){//ghost
				SetupGhost(room.players[i].socket, room.GN);
			}else if(room.players[i].side == 0b01){//human
				SetupHuman(room.players[i].socket, room.GN);
			}
		}
		room.GN.StartGame();
	}
	
}

function broadcast(event, data) {
    sockets.forEach(function (socket) {
    	socket.emit(event, data);
    });
}
function broadcastToRoom(toRoom, event, data){
	toRoom.players.forEach(function(p){
		p.socket.emit(event, data);
	});
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
    
    // Test
    var GN = new GhostNight({MinDamage: 1, TimeLimit: 5});
    
    GN.SceneMangement.LoadMap('m01', function(){
    	
    	var m = GN.createTower('Snake', 0);
    	
    	GN.StartGame();
    	
    	GN.createUnit("Raiju");
    	
    	// m.Buff('rate', 2, 10);
    	
    });
    
    // var GN2 = new GhostNight({MinDamage: 1});
    
    // GN2.SceneMangement.LoadMap('m01', function(){
    	
    // 	GN2.createTower('Amaterasu', 0);
    	
    // 	GN2.createUnit("Wanyudo");
    	
    // });
});

// function setupGhost(socket){
//     SetupGhost(socket)
// }