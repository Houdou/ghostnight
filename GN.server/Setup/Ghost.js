var GNObjects = require('../GNObjects');

var SetupGhost = function(socket, GN) {
    
    socket.on('create-unit', function(type) {
        GN.CreateUnit(type);
        //broadcast('unit-created', data);
    });
    
    socket.on('move-hero', function(jid) {
        GN.MoveHeroTo(jid);
        //broadcast('hero-moved', data);
    });
    
    socket.on('use-hero-skill', function(skillID, data) {
        GN.UseHeroSkill(skillID, data);
        //broadcast();
    });
    
    socket.on('change-hero', function(type) {
        console.log('change-hero', type);
        
    });
    
    socket.on('pay-reborn', function() {
        console.log('pay-reborn');
        
    });
    
    socket.on('switch-roadsign', function(rid) {
        GN.GM.roadSigns[rid].Turn();
        console.log('switch-roadsign');
        //broadcast('')
    });
    
    //socket.on('...')
    
    return socket;
}
module.exports = SetupGhost;