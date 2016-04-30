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
module.exports = Room;