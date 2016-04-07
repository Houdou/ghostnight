var SetupHuman = function(socket, room){
    var GN = room.GN;
    
    socket.on('build-tower', function(data){
        var tower = GN.CreateTower(data.type, data.sid);
        if(tower != null) {
            room.broadcast('tower-built', data);
        }
    })
    
    socket.on('remove-tower', function(sid){
        GN.RemoveTower(sid);
        console.log('remove-tower', sid);
        //broadcast();
    });
    
    socket.on('build-ensign', function(data){
        var ensign = GN.CreateEnsign(data.type, data.jid);
        if(ensign != null) {
            room.broadcast('ensign-built', data);
        }
    });
    
    socket.on('', function(){
        console.log('');
        //broadcast('')
    });
    
    //socket.on('...')
    
    return socket;
}
module.exports = SetupHuman;