var SetupAI = function(AI, room){
    var GN = room.GN;
    
    AI.on('build-tower', function(data){
        var tower = GN.CreateTower(data.type, data.sid);
    })
    
    AI.on('remove-tower', function(sid){
        GN.RemoveTower(sid);
        console.log('remove-tower', sid);
    });
    
    AI.on('build-ensign', function(data){
        var ensign = GN.CreateEnsign(data.type, data.jid);
    });
    
    // AI.on('', function(){
    //     console.log('');
    //     //broadcast('')
    // });
    
    return AI;
}
module.exports = SetupAI;