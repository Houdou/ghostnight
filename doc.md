# API in server

## Ghost side:

	event: 'create-unit',
	data: {
			type: ''
		}
		
	event: 'move-hero',
	data: {
			jid: <int> [0, -)
		}
		
	event: 'use-hero-skill',
	data: {
			skillID: 
			data: 
		}
		
	event: 'change-hero',
	data: {
			type: ''
		}
		
	event: 'pay-reborn',
	data: {
			
		}
		
	event: 'switch-roadsign',
	data: {
			
		}

## Human side

	event: 'build-tower',
	data: {
			type:
			sid: <int> [0, -)
		}
	
	event: 'remove-tower',
	data: {
			sid: <int> [0, -)
		}
	
	event: 'create-ensign',
	data: {
			type:
			jid: <int> [0, -)
		}
		
## Common room
	
	event: 'create-room', 
	data: {
			
		}
	
	event: 'join-room',
	data: {
			roomNo: <int> [0, -)
		}
	
	event: 'choose-side',
	data: {
			playerIndex: 0/1
			side: 'ghost'/'human'
		}
	
	event: 'choose-map',
	data: {
			map: 'map01'/'map02'/....
		}
	
	event: 'load-complete',
	data: {
			
		}
		
# API in client

## Room

	event: 'room-joined',
	data: {
			roomNo: <int> [0, -)
			playerIndex: 0/1
			map: undefined / 'map01'/.. # map been chosen
			side: undefined / 'ghost'/'human' # original side
		}
		
	event: 'side-chosen',
	data: {
			player: 0/1
			side: 'ghost'/'human'
		}
		
	event: 'map-chosen',
	data: {
			map: 'map01'/'mapo2'/...
		}
		
	event: 'load-map',
	data: {
			
		}
		
## Game controller

	event: 'game-started',
	data: {
			
		}
		
	event: 'game-end',
	data: {
			
		}
		
## Unit controller

	event: 'unit-created',
	data: {
			type: ''
			jid: 0 / <int> [1, -)
			uid: <int> [0, -)
		}
		
	event: 'unit-moving',
	data: {
			uid: <int> [0, -)
			jid: <int> [0, -)
			duration: <second>
		}
		
	event: 'unit-arrived', ### Not in use
	data: {
			uid: <int> [0, -)
			jid: <int> [0, -)
		}
		
	event: 'unit-attack',
	data: {
			uid: <int> [0, -)
			tid: <int> [0, -)
			dmg: <number>
		}
		
	event: 'unit-hp-update',
	data: {
			uid: <int> [0, -)
			hp; <number>
		}
		
	event: 'unit-nerf',
	data: {
			uid: <int> [0, -)
			attr: ''
			multiplier: <number>
		}
		
	event: 'unit-dead',
	data: {
			uid: <int> [0, -)
		}
		
	event: 'unit-destroyed',
	data: {
			uid: <int> [0, -)
		}
		
## Hero controller

	event: 'hero-moving',
	data: {
			jid: <int> [0, -)
		}
		
	event: 'hero-arrived', ### Not in use
	data: {
			uid: <int> [0, -)
		}
		
	event: 'hero-skill',
	data: {
			skillID: 
			target: 
			data: 
		}
		
	event: 'hero-attack',
	data: {
			tid: <int> [0, -)
			dmg: <number>
		}
		
	event: 'hero-hp-update',
	data: {
			hp: <number>
		}
		
	event: 'hero-nerf',
	data: {
			attr: ''
			multiplier: <number>
		}
		
	event: 'hero-dead',
	data: {
			
		}
		
	event: 'hero-reborn',
	data: {
			type: ''
		}
		
## Tower controller

	event: 'tower-built',
	data: {
			type: ''
			sid: <int> [0, -)
			tid: <int> [0, -)
		}
		
	event: 'tower-removed',
	data: {
			sid: <int> [0, -)
			tid: <int> [0, -)
		}
		
	event: 'tower-attack',
	data: {
			tid: <int> [0, -)
			uid: <int> [0, -)
			dmg: <number>
		}
		
	event: 'tower-hp-update',
	data: {
			tid: <int> [0, -)
			hp: <number>
		}
		
	event: 'tower-nerf',
	data: {
			tid: <int> [0, -)
			attr: ''
			multiplier: 
		}
		
## Ensign controller
	event: 'ensign-planted',
	data: {
			type: ''
			jid: <int> [0, -)
		}
		
	event: 'ensign-removed',
	data: {
			
		}
		
		