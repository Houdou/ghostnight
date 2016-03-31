var Room = function (roomNo) {
	this.roomNo = roomNo;
	this.GN;
	this.players = [];
	//this.p1 = {socket: null, side: 0b0};
	//this.p2 = {socket: null, side: 0b0};
	this.isPlaying = false;
}
module.exports = Room;