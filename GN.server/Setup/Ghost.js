var GNObjects = require('../GNObjects');

var SetupGhost = function(socket){
    socket.on('create-unit', function(data){
        console.log(data.type);
        //broadcast('unit-created', data);
    })
    
    return socket;
}
module.exports = SetupGhost;