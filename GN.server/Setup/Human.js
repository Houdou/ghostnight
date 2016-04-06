var SetupHuman = function(socket, room){
    var GN = room.GN;
    
    socket.on('build-tower', function(data){
        var tower = GN.CreateTower(data.type, data.sid);
        if(tower != null) {
            console.log('build-tower ' + data.type + ' at slot ' + data.sid);
            room.broadcast('tower-built', data);
        }
    })
    
    socket.on('remove-tower', function(sid){
        GN.RemoveTower(sid);
        console.log('remove-tower', sid);
        //broadcast();
    });
    
    socket.on('create-ensign', function(type, jid){
        GN.CreateEnsign(type, jid);
        console.log('create-ensign');
        //broadcast('')
    });
    
    socket.on('', function(){
        console.log('');
        //broadcast('')
    });
    
    //socket.on('...')
    
    return socket;
}
module.exports = SetupHuman;