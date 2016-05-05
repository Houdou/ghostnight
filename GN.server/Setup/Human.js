var SetupHuman = function(socket, room, on) {
    var GN = room.GN;
    
    if(on) {
        socket.on('build-tower', function(data){
            GN.CreateTower(data.type, data.sid);
        });
        
        socket.on('remove-tower', function(sid){
            GN.RemoveTower(sid);
        });
        
        socket.on('build-ensign', function(data){
            GN.CreateEnsign(data.type, data.jid);
        });
        
        // socket.on('', function(){
        //     console.log('');
        //     //broadcast('')
        // });
    } else {
        socket.removeAllListeners('build-tower');
        socket.removeAllListeners('remove-tower');
        socket.removeAllListeners('build-ensign');
    }
    
    return socket;
}
module.exports = SetupHuman;