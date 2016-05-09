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
    
    this.on('message-send', function(data){
        room.broadcast('message-send', data);
    });
    
    this.on('map-data', function(data){
        room.broadcast('map-data', data);
    });
    
    this.on('game-end', function(data){
        room.broadcast('game-end', data);
        room.SetupSocket(false);
    });
    
    this.on('time', function(data) {
        room.broadcast('time', data);
    });
    
    this.on('button-cd', function(data){
    	room.broadcast('button-cd', data);
    });
    
    this.on('goal-built', function(data){
        room.broadcast('goal-built', data);
    });
    
    this.on('goal-life-bar-built', function(){
    	room.broadcast('goal-life-bar-built');
    });
    
    this.on('goal-damage', function(data){
    	room.broadcast('goal-damage', data);
    });
    
    this.on('goal-dead', function(data){
        room.broadcast('goal-dead', data);
    });
    
    this.on('soul-update', function(data){
    	room.broadcast('soul-update', data);
    });
    
    this.on('gold-update', function(data){
    	room.broadcast('gold-update', data);
    });
    
    this.on('unit-created', function(data){
    	room.broadcast('unit-created', data);
    });
    
    this.on('unit-moving', function(data){
        room.broadcast('unit-moving', data);
    });
    
    this.on('unit-attack', function(data){
        room.broadcast('unit-attack', data);
    });
    
    this.on('unit-hp-update', function(data){
    	data.uid = data.id;
        room.broadcast('unit-hp-update', data);
    });
    
    this.on('unit-buff', function(data) {
        data.uid = data.id;
        room.broadcast('unit-buff', data);
    });
    
    this.on('unit-state', function(data) {
        data.uid = data.id;
        room.broadcast('unit-state', data);
    });
    
    this.on('unit-dead', function(data){
    	data.uid = data.id;
        room.broadcast('unit-dead', data);
    });
    
    this.on('unit-remove', function(data){
        room.broadcast('unit-remove', data);
    });
    
    this.on('hero-moving', function(data){
        room.broadcast('hero-moving', data);
    });
    
    this.on('hero-skill', function(data){
        room.broadcast('hero-skill', data);
    });
    
    this.on('hero-skill-cd', function(data){
        room.broadcast('hero-skill-cd', data);	
    });
    
    this.on('hero-attack', function(data){
        room.broadcast('hero-attack', data);
    });
    
    this.on('hero-hp-update', function(data){
        room.broadcast('hero-hp-update', data);
    });
    
    this.on('hero-buff', function(data){
        room.broadcast('hero-buff', data);
    });
    
    this.on('hero-dead', function(data){
        room.broadcast('hero-dead', data);
        room.GN.SetHeroReborn();
    });
    
    this.on('hero-select', function(data){
    	room.broadcast('hero-select', data);
    });
    
    this.on('hero-reborn', function(data){
        room.broadcast('hero-reborn', data);
    });
    
    this.on('hero-reborn-cd', function(data){
        room.broadcast('hero-reborn-cd', data);
    });
    
    this.on('ensign-built', function(data) {
        room.broadcast('ensign-built', data);
    });
    
    this.on('ensign-removed', function(data) {
        room.broadcast('ensign-removed', data);
    });
    
    this.on('tower-built', function(data){
        room.broadcast('tower-built', data);
    });
    
    this.on('tower-removed', function(data){
    	data.tid = data.id;
        room.broadcast('tower-removed', data);
    });
    
    this.on('tower-attack', function(data){
        room.broadcast('tower-attack', data);
    });
    
    this.on('tower-buff', function(data){
        data.tid = data.id;
        room.broadcast('tower-buff', data);
    });
    
    this.on('tower-state', function(data) {
        data.tid = data.id;
        room.broadcast('tower-state', data);
    });
    
    this.on('tower-hp-update', function(data){
    	data.tid = data.id;
        room.broadcast('tower-hp-update', data);
    });
    
    this.on('tower-dead', function(data) {
        data.tid = data.id;
        room.broadcast('tower-dead', data);
    });
    
    this.on('blocker-built', function(data) {
        room.broadcast('blocker-built', data);
    });
    
    this.on('blocker-buff', function(data){
        data.bid = data.id;
        room.broadcast('blocker-buff', data);
    });
    
    this.on('blocker-state', function(data) {
        data.bid = data.id;
        room.broadcast('blocker-state', data);
    });
    
    this.on('blocker-hp-update', function(data){
    	data.bid = data.id;
        room.broadcast('blocker-hp-update', data);
    });
    
    this.on('blocker-dead', function(data){
    	data.bid = data.id; 
        room.broadcast('blocker-dead', data);
    });
    
    this.on('roadsign-built', function(data) {
        room.broadcast('roadsign-built', data);
    });
    
    this.on('roadsign-changed', function(data) {
        room.broadcast('roadsign-changed', data);
    });
};
util.inherits(GameEventManager, EventEmitter);

module.exports = GameEventManager;
