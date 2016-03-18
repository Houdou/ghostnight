# Modulize the game

## module list
* Game objects
    * GM 
    * GNObjects 
    * Transform 
* Road system
    * Slot
    * Joint
    * RoadSign
* Setup
    * SetupGhost
    * SetupHuman
    * SceneMangement

# Usage
Finally in `Node.js`:

    var GN = require('/GN.server/GN.js")

## Flow
1. io connection (login):

2. Player choose mode (single/multi player)

Use `GN.Setup*****()` to process the socket connection.
Use `GN.SceneMangement` to manage the scene.
Load map and initialize the currency.

socket.join('xxxx') to assign the room

3. Both player click ready and start

Setup GN instance for the room