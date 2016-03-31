var GNObjects = require('../GNObjects');

var SetupGhost = function(socket, GN){
    
    socket.on('create-unit', function(type){
        console.log(type);
        GN.createUnit(type);
        //broadcast('unit-created', data);
    });
    
    socket.on('move-hero', function(jid){
        console.log('move-hero', jid);
        //GN.GM.hero.moveTo(jid);
        //broadcast('hero-moved', data);
    });
    
    socket.on('use-hero-skill', function(skill){
        console.log('hero-skill', skill);
        //broadcast();
    });
    
    socket.on('change-hero', function(type){
        console.log('change-hero', type)
        
    });
    
    socket.on('switch-roadsign', function(){
        console.log('switch-roadsign');
        //broadcast('')
    });
    
    //socket.on('...')
    
    return socket;
}
module.exports = SetupGhost;