//client APIs
var socket; 

/*global io, stage*/
socket = io.connect();

var initSocket = function(){
    
    socket.on('join-room', function(roomNo){
        console.log(roomNo);
        stage.addChild(buildButton('Ghost Side', 900, 500, 120, 50, function(event) {
            socket.emit('choose-side', 'ghost');
        }, {}));
        stage.addChild(buildButton('Human Side', 1100, 500, 120, 50, function(event) {
            socket.emit('choose-side', 'human');
        }, {}));
        stage.update();
    });
    
    socket.on('side-chosen', function(data) {
        console.log(data);
    })
    
    socket.on('game-started', function(){
        console.log('game-started');
        //broadcast('')
    });
    
    socket.on('game-end', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('unit-moving', function(){
        console.log('');
        //broadcast('')
    });
    
    // socket.on('unit-arrived', function(){
    //     console.log('');
    //     //broadcast('')
    // });
    
    socket.on('unit-attack', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('unit-hp-update', function(uid, hp){
        console.log('');
        //broadcast('')
    });
    
    socket.on('unit-nerf', function(uid, att){
        console.log('');
        //broadcast('')
    });
    
    socket.on('unit-dead', function(uid){
        console.log('');
        //broadcast('')
    });
    
    socket.on('unit-destroyed', function(uid){
        console.log('');
        //broadcast('')
    });
    
    socket.on('hero-moving', function(jid){
        console.log('');
        //broadcast('')
    });
    
    // socket.on('hero-arrived', function(){
    //     console.log('');
    //     //broadcast('')
    // });
    
    socket.on('hero-skill', function(skill, target){
        console.log('');
        //broadcast('')
    });
    
    socket.on('hero-attack', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('hero-hp-update', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('hero-nerf', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('hero-dead', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('hero-reborn', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('tower-built', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('tower-removed', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('tower-attack', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('tower-hp-update', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('tower-nerf', function(){
        console.log('');
        //broadcast('')
    });
    
    socket.on('', function(){
        console.log('');
        //broadcast('')
    });
    
    
    

}