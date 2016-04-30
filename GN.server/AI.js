const EventEmitter = require('events');
const util = require('util');

var AI = function(room) {
    EventEmitter.call(this);
    this.room = room;
    
    var that = this;
    function BuildTower(type, sid) {
        that.emit('build-tower', {type: type, sid: sid});
    }
    function BuildEnsign(type, jid) {
        that.emit('build-ensign', {type: type, jid: jid});
    }
    
    setTimeout(()=>{BuildTower('Miko', 0);}, 8000);
	setTimeout(()=>{BuildEnsign('Atk', 12);}, 12000);
	
	this.on('game-started', function() {
	    
	});
	
	this.on('game-end', function(data) {
	    
	});
	
	this.on('roadsign-built', function(data) {
	   // gnclient.BuildRoadSign(data);
	});
	
	this.on('roadsign-changed', function(data) {
	   // gnclient.ChangeRoadSign(data);
	});
	
	this.on('goal-life-bar-built', function() {
	   // gnclient.BuildGoalLife();
	});
	
	this.on('goal-built', function(data) {
	   // gnclient.BuildGoal(data);
	});
	
	this.on('goal-damage', function(data) {
// 		gnclient.UpdateGoalLife(data);
	});
	
	this.on('goal-dead', function(data) {
// 		gnclient.RemoveGoal(data);
	});
	
	this.on('button-cd', function(data){
// 		gnclient.CoolDownEffect(data);
	});
	
	this.on('map-data', function(data) {
// 		gnclient.mapData = data;
	});
	
	this.on('soul-update', function(data){
// 		if (gnclient.side == 'ghost'){
// 			gnclient.soul = data.soul;
// 			gnclient.UpdateText('money', {text: "" + data.soul});
// 			if (!data.ok){
// 				console.log('Insufficient money');
// 			}
// 		}
	});
	
	this.on('gold-update', function(data){
// 		if (gnclient.side == 'human'){
// 			gnclient.gold = data.gold;
// 			gnclient.UpdateText('money', {text: "" + data.gold});
// 			if (!data.ok){
// 				console.log('Insufficient money');
// 			}
// 		}
	});
	
	// Unit
	this.on('unit-created', function(data){
// 		gnclient.BuildUnit(data);
	});
	
	this.on('unit-moving', function(data){
// 		gnclient.MoveUnitTo(data);
	});
	
	this.on('unit-attack', function(){
		console.log('');
	});
	
	this.on('unit-hp-update', function(data){
// 		gnclient.UpdateHPBar('unit', data);
	});
	
	this.on('unit-nerf', function(uid, attr){
		console.log('');
	});
	
	this.on('unit-dead', function(data){
// 		gnclient.RemoveUnit(data);
	});
	
	this.on('unit-remove', function(data){
// 		gnclient.RemoveUnit(data);
	});
	
	// Hero
	this.on('hero-moving', function(data){
// 		gnclient.MoveHeroTo(data);
	});
	
	// this.on('hero-arrived', function(){
	//     console.log('');
	// });
	
	this.on('hero-skill', function(skill, target){
		console.log('');
	});
	
	this.on('hero-attack', function(){
		console.log('');
	});
	
	this.on('hero-skill-cd', function(data) {
// 		data.type = gnclient.heroName + '-Skill' + data.skillID;
	   // gnclient.CoolDownEffect(data);
	});
	
	this.on('hero-hp-update', function(data){
// 		gnclient.UpdateHPBar('hero', data);
	});
	
	this.on('hero-nerf', function(){
		console.log('');
	});
	
	this.on('hero-dead', function(data){
// 		gnclient.RemoveHero(data);
// 		gnclient.TogglePanel('panel-Reborn');
	});
	
	this.on('hero-select', function(data){
// 		gnclient.DrawHeroSelection(data);
	})
	
	this.on('hero-reborn', function(data){
// 		gnclient.BuildHero(data);
// 		gnclient.TogglePanel('panel-' + data.type);
	});
	
	this.on('hero-reborn-cd', function(data) {
		
	});
	
	// Tower
	this.on('tower-built', function(data) {
// 		gnclient.BuildTower(data);
	});
	
	this.on('tower-removed', function(){
		console.log('');
	});
	
	this.on('tower-attack', function(){
		console.log('');
	});
	
	this.on('tower-nerf', function(){
		console.log('');
	});
	
	this.on('tower-hp-update', function(data) {
// 		gnclient.UpdateHPBar('tower', data);
	});
	
	this.on('tower-dead', function(data){
// 		gnclient.RemoveTower(data);
	});
	
	// Blocker
	this.on('blocker-built', function(data) {
		data.type = 'Blocker';
// 		gnclient.BuildBlocker(data);
	});
	
	this.on('blocker-nerf', function(){
		console.log('');
	});
	
	this.on('blocker-hp-update', function(data) {
// 		gnclient.UpdateHPBar('blocker', data);
	});
	
	this.on('blocker-dead', function(data){
// 		gnclient.RemoveBlocker(data);
	});
	
	this.on('ensign-built', function(data) {
// 		gnclient.BuildEnsign(data)
	});
	
	this.on('ensign-removed', function(data){
// 		gnclient.RemoveEnsign(data);
	});
	
	this.on('message-send', function(data){
	    console.log(data.side + ": " + data.message);
	});
}
util.inherits(AI, EventEmitter);

module.exports = AI;