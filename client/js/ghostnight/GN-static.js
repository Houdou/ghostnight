var GN = GN || {};

(function(){
    "use strict";
    
    // Static Class Tags
    GN.Tags = {
        unit: 0,
        hero: 1,
        tower: 2,
        blocker: 3,
        roadsign: 4,
        joint: 5,
        slot: 6
        
    };
    
    // Static Class Layer
    GN.Layers = {
        land: 1 << 0,
        sky: 1 << 1
        
    };
    
    // Static Class State
    GN.State = {
        normal: 0,
        paralyzed: 1 << 0,
        fire: 1 << 1
    
    };
    
    // Static Class Weather
    GN.Weather = {
        Night: 0,
        Rain: 1
    
    };
}());