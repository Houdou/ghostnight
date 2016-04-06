const EventEmitter = require('events');
const util = require('util');

var GameEventManager = function(room) {
    EventEmitter.call(this);
    this.room = room;
    this.sockets = [];
    for(var i = 0; i < room.players.length; i++) {
        if(room.players[i].socket != null) {
            this.sockets.push(room.players[i].socket);
        }
    }
    
    this.on('map-data', function(data) {
        room.broadcast('map-data', data);
    });
    
    this.on('game-end', function(){
        room.broadcast('game-end');
    });
    
    this.on('button-cd', function(data){
    	room.broadcast('button-cd', data);
    })
    
    this.on('unit-moving', function(data){
        room.broadcast('unit-moving', data);
    });
    
    // this.on('unit-arrived', function(){
    //     room.broadcast('unit-arrived');
    //     console.log('');
    // });
    
    this.on('unit-attack', function(){
        room.broadcast('unit-attack');
        console.log('');
        
    });
    
    this.on('unit-hp-update', function(uid, hp){
        room.broadcast('unit-hp-update');
        console.log('');
        
    });
    
    this.on('unit-nerf', function(uid, att){
        room.broadcast('unit-nerf');
        console.log('');
        
    });
    
    this.on('unit-dead', function(uid){
        room.broadcast('unit-dead');
        console.log('');
        
    });
    
    this.on('unit-destroyed', function(uid){
        room.broadcast('unit-destroyed');
        console.log('');
        
    });
    
    this.on('hero-moving', function(jid){
        room.broadcast('hero-moving');
        console.log('');
        
    });
    
    // this.on('hero-arrived', function(){
    //     room.broadcast('hero-arrived');
    //     console.log('');
        
    // });
    
    this.on('hero-skill', function(skill, target){
        room.broadcast('hero-skill');
        console.log('');
        
    });
    
    this.on('hero-attack', function(){
        room.broadcast('hero-attack');
        console.log('');
        
    });
    
    this.on('hero-hp-update', function(){
        room.broadcast('hero-hp-update');
        console.log('');
        
    });
    
    this.on('hero-nerf', function(){
        room.broadcast('hero-nerf');
        console.log('');
        
    });
    
    this.on('hero-dead', function(){
        room.broadcast('hero-dead');
        console.log('');
        
    });
    
    this.on('hero-reborn', function(){
        room.broadcast('hero-reborn');
        console.log('');
        
    });
    
    this.on('tower-built', function(){
        room.broadcast('tower-built');
        console.log('');
        
    });
    
    this.on('tower-removed', function(){
        room.broadcast('tower-removed');
        console.log('');
        
    });
    
    this.on('tower-attack', function(){
        room.broadcast('tower-attack');
        console.log('');
        
    });
    
    this.on('tower-hp-update', function(){
        room.broadcast('tower-hp-update');
        console.log('');
        
    });
    
    this.on('tower-nerf', function(){
        room.broadcast('tower-nerf');
        console.log('');
        
    });
    
    this.on('', function(){
        room.broadcast('');
        console.log('');
        
    });
}
util.inherits(GameEventManager, EventEmitter);

module.exports = GameEventManager;
