var Room = function (roomNo) {
	this.roomNo = roomNo;
	this.GN;
	this.players = [];
	//this.p1 = {socket: null, side: 0b0};
	//this.p2 = {socket: null, side: 0b0};
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