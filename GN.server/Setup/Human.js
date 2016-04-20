var SetupHuman = function(socket, room){
    var GN = room.GN;
    
    socket.on('build-tower', function(data){
        var tower = GN.CreateTower(data.type, data.sid);
    })
    
    socket.on('remove-tower', function(sid){
        GN.RemoveTower(sid);
        console.log('remove-tower', sid);
    });
    
    socket.on('build-ensign', function(data){
        var ensign = GN.CreateEnsign(data.type, data.jid);
    });
    
    // socket.on('', function(){
    //     console.log('');
    //     //broadcast('')
    // });
    
    return socket;
}
module.exports = SetupHuman;