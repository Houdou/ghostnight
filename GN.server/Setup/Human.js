var GNObjects = require('../GNObjects');

var SetupHuman = function(socket, GN){
    socket.on('build-tower', function(type, sid){
        GN.CreateTower(type, sid);
        console.log('build-tower ' + type + ' at slot ' + sid);
        //broadcast('build-tower', data);
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