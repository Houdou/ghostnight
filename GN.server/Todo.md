# TODO

## Final stage
AI
Music
Refine Code
UML Diagram
Report
Collection
Tutorial
Input hint
Slot Hammer

## Design
### Class Design
Core game system							|	2/2		+2/24
GN server									|	3/10
GN server module							|	3/12

#### Map
Level 1										|	3/24
Level 2										|	3/24
Level 3										|	3/24
#### Slot
Level 1										|	-/-
Level 2										|	-/-
Level 3										|	-/-
#### Goal
Level 1										|	-/-
Level 2										|	-/-
Level 3										|	-/-
#### Timing
Level 1										|	-/-
Level 2										|	-/-
Level 3										|	-/-

### Stat
Atk & Def									|	-/-
Rate										|	-/-
Spd											|	-/-
Range										|	-/-

### Economic
Price										|	-/-
Value										|	-/-


## Coding
### Systems
#### Road system
Road structure								|	2/26	TPASS
Unit movement								|	2/28    TPASS
Path finding								|	3/6     TPASS
RoadSign navigation							|	2/26    TPASS
Blocker										|	3/21	TPASS
#### Build system
Economic									|	-/-
Create unit									|	3/21	TPASS
Create hero                                 |   4/1     TPASS
Create tower								|	3/21	TPASS
Create ensign                               |   4/1     TPASS
Termination									|	-/-
#### Engagement system
Attack										|	2/24	+3/16   TPASS
Damage										|	2/24	+3/16   TPASS
Heal                                        |   3/27    TPASS
Buff & Nerf                                 |   3/29    TPASS
Dead										|	3/16    TPASS
(Unit upgrade)								|	-/-
SKill protocol  							|	4/1     TPASS
#### Hero system
Skill										|	4/1     TPASS
Movement									|	3/6     +4/1    TPASS
Rebirth cooldown							|	-/-
Reselect hero								|	4/1
(Pay rebirth)								|	-/-
#### Ensign system
Movement									|	4/1     RM(4/2)
Buff                                        |   4/1     TPASS
#### Single player
(Simple human AI)							|	-/-
(Difficulties)								|	-/-

### Server side
#### General website
Node.js Setup								|	-/-
(Framework: Single Page?)					|	-/-
#### Connection
Create & Join room							|	3/24
Two sides setup								|	4/3
#### Communication
Boardcast									|	4/3
Synchronization								|	-/-
(Failure management)						|	-/-
#### Scene management
Load map									|	3/13	+3/16	TPASS
#### Game management
User action interface						|	4/1
Validation									|	-/-
Game result									|	-/-
Termination									|	-/-
Log system                                  |   4/1     TPASS

### Client side
#### Scene
Load Map									|	4/4		TPASS
Load assets									|	4/4		TPASS
PreloadJS									|	4/4		TPASS
Two-levels async preload					|	4/5		TPASS
Build Unit									|	4/5		TPASS
Build Static								|	4/6		TPASS
Build Hero									|	4/7		TPASS
#### User input
UI Layout									|	-/-
Build Button								|	4/6
Skill Button								|	4/7
Client input state							|	4/7
Input calculation							|	4/6
#### UI Response
Main menu									|	4/3
Room & side selection						|	4/3		+4/5
Navigation									|	-/-
In-game UI									|	-/-
Yuan or tuoyuan                             |   -/-

### Characters Features
#### Hero
Nekomata Skill 1							|	4/1
Nekomata SKill 2							|	4/1
Ameonna Skill 1								|	4/1     TPASS
Ameonna Skill 2								|	4/1
Todomeki SKill 1							|	4/1
Todomeki SKill 2							|	4/1		TPASS
#### Unit
Kappa										|	4/1     TPASS
Wanyudo										|	3/30    TPASS
Foxfire										|	3/30    TPASS
Dojoji										|	3/30    TPASS
Futakuchi									|	3/30    TPASS
Raiju										|	3/31    TPASS
Ubume										|	3/30    TPASS
#### Tower
Inugami										|	3/30    TPASS
Ebisu										|	3/31    TPASS
Snake										|	3/31    TPASS
Amaterasu									|	3/31    TPASS


## Graphics
### UI
#### Main menu
Buttons										|	-/-
Background									|	4/5
#### In-game
Buttons										|	4/5
Panel										|	4/5
Status										|	4/5

### Assets
#### Characters
Nekomata									|	2/25
Ameonna										|	2/25
Todomeki									|	2/26
Kappa										|	3/10
Wanyudo										|	2/25
Foxfire										|	3/10
Dojoji										|	-/-
Futakuchi									|	3/16
Raiju										|	3/16
Ubume										|	3/10
Miko										|	-/-
Inari										|	-/-
Inugami										|	-/-
Ebisu										|	-/-
Snake										|	3/29
Asura										|	3/24
Amaterasu									|	2/25
Throns                                      |   3/22
Ensign                                      |   -/-
#### Background
Map 1										|	2/23
Map 2										|	3/24
Map 3										|	-/-

### Effects
#### General effects
Movement                                    |   3/23
#### Attack effects
Normal attack                               |   -/-
Damage                                      |   -/-
Special damage                              |   -/-
Snake AOE                                   |   -/-

## (Sounds)
### (BGM)
Main menu									|	3/29
Battle										|	3/29
(Result)									|	-/-
### (Effects)
(Attack)									|	-/-
(Dead)										|	-/-

# Legend
(...)				Optional
-/-					To be done
M/DD				Done
+M/DD				Major Update
TPASS				Test passed
RM(M/DD)			Removed (or Abandoned)