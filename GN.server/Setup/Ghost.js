var SetupGhost = function(socket, room) {
    var GN = room.GN;
    
    socket.on('create-unit', function(data) {
        var unit = GN.CreateUnit(data.type);
        if(unit != null) {
            data.x = unit.transform.x;
            data.y = unit.transform.y;
            room.broadcast('unit-created', data);
        } 
    });
    
    socket.on('move-hero', function(data) {
        GN.MoveHeroTo(data.jid);
        //broadcast('hero-moved', data);
    });
    
    socket.on('use-hero-skill', function(data) {
        GN.UseHeroSkill(data.skillID, data.data);
        //broadcast();
    });
    
    socket.on('change-hero', function(data) {
        GN.ChangeHeroSelection(data.type);
        console.log('change-hero', data.type);
        
    });
    
    socket.on('pay-reborn', function(data) {
        console.log('pay-reborn');
        
    });
    
    socket.on('switch-roadsign', function(data) {
        GN.GM.roadSigns[data.rid].Turn();
        console.log('switch-roadsign');
        //broadcast('')
    });
    
    //socket.on('...')
    
    return socket;
}
module.exports = SetupGhost;