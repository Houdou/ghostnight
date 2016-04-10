var SetupGhost = function(socket, room) {
    var GN = room.GN;
    
    socket.on('create-unit', function(data) {
        var unit = GN.CreateUnit(data.type);
    });
    
    socket.on('move-hero', function(data) {
        GN.MoveHeroTo(data.jid);
        console.log('move-hero', data);
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
        GN.RebornHero(true);
    });
    
    socket.on('switch-roadsign', function(data) {
        GN.TurnRoadSign(data.rid);
    });
    
    //socket.on('...')
    
    return socket;
}
module.exports = SetupGhost;