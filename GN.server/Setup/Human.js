var GNObjects = require('../GNObjects');

var SetupHuman = function(socket){
    socket.on('build-tower', function(type,sid){
        console.log('build-tower', type);
        //GN.createUnit(type);
        //broadcast('build-tower', data);
    })
    
    socket.on('remove-tower', function(sid){
        console.log('remove-tower', sid);
        //broadcast();
    });
    
    socket.on('move-ensign', function(jid){
        console.log('move-ensign', jid);
        //broadcast('')
    });
    
    socket.on('use-skill', function(skill){
        console.log('use-skill');
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