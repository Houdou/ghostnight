var SetupGhost = function(socket, room, on) {
    var GN = room.GN;
    
    if(on) {
        socket.on('create-unit', function(data) {
            GN.CreateUnit(data.type);
        });
        
        socket.on('move-hero', function(data) {
            GN.MoveHeroTo(data.jid);
            // console.log('move-hero', data);
        });
        
        socket.on('use-hero-skill', function(data) {
            GN.UseHeroSkill(data.skillID, data.data);
        });
        
        socket.on('change-hero', function(data) {
            GN.ChangeHeroSelection(data.type);
        });
        
        socket.on('buyback-hero', function(data) {
            GN.RebornHero(true);
        });
        
        socket.on('switch-roadsign', function(data) {
            GN.TurnRoadSign(data.rid);
        });
    } else {
        socket.removeAllListeners('create-unit');
        socket.removeAllListeners('move-hero');
        socket.removeAllListeners('use-hero-skill');
        socket.removeAllListeners('change-hero');
        socket.removeAllListeners('pay-reborn');
        socket.removeAllListeners('switch-roadsign');
    }
    
    return socket;
}
module.exports = SetupGhost;