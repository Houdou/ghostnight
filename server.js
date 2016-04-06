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
var GameEventManager = require('./GN.server/GameEventManager');
var Room = require('./Room');

router.use(express.static(path.resolve(__dirname, 'client')));
var sockets = [];
var rooms = {};
var roomof = {};
// rooms.push(new Room('lobby'));
rooms['lobby'] = new Room('lobby');

io.on('connection', function (socket) {
	sockets.push(socket);
	
	socket.join('lobby');
	
	socket.on('click', function(click) {
	    // click: {x, y, button};
        // console.log(click);
	});
	
	socket.on('create-room', function() {
		// Assign a random room number
		var roomNo = 'lobby';
		while(rooms[roomNo] != undefined) {
			roomNo = ('000' + Math.floor(1000 * Math.random())).substr(-3, 3);
		}
		
		createRoom(socket, roomNo);
	});
	
	socket.on('join-room', function(roomNo) {
		joinRoom(socket, roomNo);
	});
	
	socket.on('disconnect', function () {
		sockets.splice(sockets.indexOf(socket), 1);
	});

});

function createRoom(socket, roomNo) {
	var newRoom = new Room(roomNo);
	rooms[roomNo] = newRoom;
	
	console.log("room created: " + roomNo);
	
	joinRoom(socket, roomNo);
}

function joinRoom(socket, roomNo) {
	// Find the room and check if it exists
	var room = rooms[roomNo];
	
	if(room != undefined) {
		if(room.players.length >= 2) {
			socket.emit('room-full', {});
			return false;
		}
		
		// Leave the current room
		leaveRoom(socket);
		// Join new room on socket
		socket.join(roomNo);
		// Update the roomNo of socket
		roomof[socket.id] = roomNo;
		
		// Default result of join
		var playerIndex = room.players.length;
		var result = {roomNo: roomNo, playerIndex: playerIndex, map: 'm01'};
		
		if (playerIndex == 0){
			// First player in the room
			result.opposite = null;
			result.side = 'ghost';
		} else if(playerIndex == 1){
			// Somebody already in
			result.map = room.map;
			if(room.players[0].side == 0b10) {
				result.opposite = 'ghost';
				result.side = 'human';
			} else if(room.players[0].side == 0b01){
				result.opposite = 'human';
				result.side = 'ghost';
			} else {
				console.log('Something wrong with players[0] side.');
				result.opposite = null;
				result.side = 'ghost';
			}
		}
		
		// Notice the player in the room
		room.broadcast('other-joined-room', result);
		// Add the player
		if(result.side == 'ghost')
			room.players.push({socket: socket, side: 0b10});
		else
			room.players.push({socket: socket, side: 0b01});
		
		socket.emit('room-joined', result);
		
		// Register the room options
		socket.on('choose-side', function(data){
			console.log(data);
			if(data.side == 'ghost'){
				room.players[playerIndex].side = 0b10;
				console.log('ghost');
			}
			if(data.side == 'human'){
				room.players[playerIndex].side = 0b01;
				console.log('human');
			}
			console.log(playerIndex);
			room.broadcast('side-chosen', {player: playerIndex, side: data.side});
		});
		
		socket.on('choose-map', function(data){
			room.map = data.map;
			room.broadcast('map-chosen', {map: data.map});
		});
		
		// Register the start button
		socket.on('start-game', function(){
			// var room = rooms[roomof[socket.id]];
			// Check if there are 2 players
			if(room.players.length != 2) {
				console.log("Players not enough in room ", roomNo);
				return false; }
			// Check if there are 2 sides of player
			if (room.players[0].side == room.players[1].side) {
				console.log("Players in same side in room ", roomNo);
				return false; }
			
			// Tell the client to load assets
			room.broadcast('load-scene', {map: room.map});
			// Register the loading feedback
		});
		
		socket.on('load-complete', function(){
			// var room = rooms[roomof[socket.id]];
			room.loadedNo++;
			if(room.loadedNo == room.players.length) {
				startGame(roomof[socket.id]);
			}
		});
		
	} else {
		// Create a new room with specified room number
		createRoom(socket, roomNo);
	}
}

function leaveRoom(socket){
	// Check if the socket do not have a room
	if (roomof[socket.id] == undefined) {return;}
	
	// Leave the current room
	socket.leave(roomof[socket.id]);
	
	// Remove all room option listeners
	socket.removeAllListeners('choose-side');
	socket.removeAllListeners('choose-map');
	socket.removeAllListeners('start-game');
	socket.removeAllListeners('load-complete');
	
	var room = rooms[roomof[socket.id]];
	// Delete the player in room
	var playersNumber = room.players.length;
	for (var i = 0; i < playersNumber; i++) {
		if (room.players[i].socket.id == socket.id) {
			room.players.splice(i, 1);
			i--; playersNumber--;
		}
	}
	
	// Reset the room number stored
	roomof[socket.id] = undefined;
}

function startGame(roomNo){
	var room = rooms[roomNo];
	// Create a game event manager to listen the event inside server
	var GEM = new GameEventManager(room);
	// Create the game server
	room.GN = new GhostNight({MinDamage: 1, TimeLimit: 60, Room: roomNo, debug: true}, GEM);
	// Load map
	
	for (var i in room.players){
		if (room.players[i].side == 0b10) {//ghost
			SetupGhost(room.players[i].socket, room);
		} else if(room.players[i].side == 0b01) {//human
			SetupHuman(room.players[i].socket, room);
		}
	}
	
	// Start the game server
	room.GN.Scene.LoadMap(room.map, function(){
		room.GN.GM.mapLoaded = true;
		room.broadcast("game-started", {});
		// broadcastToRoom(room, "game-started", {});
		room.GN.StartGame();
	})
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
    
    // Test
    // var GN = new GhostNight({MinDamage: 1, TimeLimit: 60, Room: "048"}, new GameEventManager(new Room('048')));
    
    // GN.Scene.LoadMap('m01', function(){
    	
    // 	var m = GN.CreateTower('Snake', 0);
    	
    // 	GN.StartGame();
    // 	GN.CreateUnit("Kappa");
    	
    // 	setTimeout(function() {GN.CreateEnsign("Atk", 14);}, 8000);
    // 	setTimeout(function() {GN.MoveHeroTo(22);}, 9000);
    	
    // });
});