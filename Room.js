var SetupGhost = require('./GN.server/Setup/Ghost');
var SetupHuman = require('./GN.server/Setup/Human');

var Room = function (roomNo) {
	this.roomNo = roomNo;
	this.GN = null;
	this.mode = '';
	this.players = [];
	//this.p1 = {socket: null, side: 'ghost'};
	//this.p2 = {socket: null, side: 'human'};
	this.isPlaying = false;
	this.map = 'm01';
	this.loadedNo = 0;
}
Room.prototype.broadcast = function(event, data){
	// console.log("Room " + this.roomNo + " broadcast " + event);
	
	this.players.forEach(function(p){
		p.socket.emit(event, data);
	});
}
Room.prototype.SetupSocket = function(on) {
	this.players.forEach((p)=>{
	    switch(p.side) {
	    	case 'ghost':
	    		SetupGhost(p.socket, this, on);
	    		break;
    		case 'human':
    			SetupHuman(p.socket, this, on);
    			break;
			default:
    			break;
	    }
	});
}
module.exports = Room;