'use strict';

class Land {
    constructor( canvas ) {
        this._CANVAS = canvas;
        this._CTX = this._CANVAS.getContext('2d');
        this._CANVAS.width = this._CANVAS.height = 512;

        this._map = new Perlin( SEED );
        this._terrain = [];

        this._GRID_SIZE = 4;
        this._RESOLUTION = 16;
        this._PIXEL_SIZE = this._CANVAS.width/this._RESOLUTION;
        this._NUM_PIXELS = this._GRID_SIZE / this._RESOLUTION;

        // Landscape Features
        this._TOWNS = [];

        // Event spaces in the world
        this._SCENARIOS = [];

        this._SEEN = {};
    }
    addTerrain( value, color, name, type, difficulty ) {
        let terrain = new Terrain( value, color, name, type, difficulty );
        this._terrain.push(terrain);
        this._terrain.sort( (a, b) => { return a._value > b._value } );
    }
    getTerrainColor( value ) {       
        this._terrain.sort( (a, b) => { return a._value - b._value } );
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._color;
    }
    getTerrainDifficulty( value ) {
        this._terrain.sort( (a, b) => { return a._value - b._value } );
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._difficulty;
    }
    getTerrainName( value ) {
        this._terrain.sort( (a, b) => { return a._value - b._value } );
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._name;
    }
    getTerrainType( value ) {
        this._terrain.sort( (a, b) => { return a._value - b._value } );
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._type;
    }
    getTerrainByPosition( x, y ) {
        let coord = this.convertCoordinates(x, y);
        let result = this._map.get( coord.x , coord.y );
        return this.getTerrain(result);
    }
    getTerrain(value) {
        this._terrain.sort( (a, b) => { return a._value - b._value } );
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain;
    }
    // Converts to the Perlin map coordinates
    convertCoordinates( x, y ) {
        let loc_x = x * this._NUM_PIXELS / this._GRID_SIZE;;
        let loc_y = y * this._NUM_PIXELS / this._GRID_SIZE;;
        return { x: loc_x, y: loc_y };
    }
    genScenarios() {   
        this._SCENARIOS.length = 0;     
        const MIN_HEIGHT    = 0.2;
        const MAX_HEIGHT    = 0.22;
        const MIN_D         = 8;
        const MAX_D         = 16;
        const SITES = Object.entries(this._map.memory)
                        .filter(e=>e[1]>MIN_HEIGHT&&e[1]<MAX_HEIGHT); 
        const NUM = Math.max(MIN_D,Math.ceil(Math.rndseed(SEED)*MAX_D));
        for (let i = 0; i < NUM; i++) {            
            const LOC = SITES[Math.floor(Math.rndseed(SEED+i)*SITES.length)];
            const X = LOC[0].split(',')[0]/this._GRID_SIZE*this._CANVAS.width;
            const Y = LOC[0].split(',')[1]/this._GRID_SIZE*this._CANVAS.width;
            const DGN = new Cave(this);
            DGN.loc = { x: X, y: Y };
            DGN.type = "cave";
            this._SCENARIOS.push(DGN);         
        }
        this._SCENARIOS.forEach( e => e.draw() );

    }
    genTowns() {
        this._TOWNS.length  = 0;                                                // Reset Towns     
        const MIN_HEIGHT    = -0.27;                                            // Valid terrain height (essentially terrain type)
        const MAX_HEIGHT    = 0.2;
        const MIN_T         = 8;
        const MAX_T         = 10;
        // Find valid town sites
        // Hunt through the LANDSCAPE to find valid land heights (current assessment)
        const SITES = Object.entries(this._map.memory)
                        .filter(e=>e[1]>MIN_HEIGHT&&e[1]<MAX_HEIGHT); 
        const NUM = Math.max(MIN_T, Math.ceil(Math.rndseed(SEED)*MAX_T));
        for (let i = 0; i < NUM; i++) {            
            const LOC = SITES[Math.floor(Math.rndseed(SEED+i)*SITES.length)];
            const X = LOC[0].split(',')[0]/this._GRID_SIZE*this._CANVAS.width;
            const Y = LOC[0].split(',')[1]/this._GRID_SIZE*this._CANVAS.width;
            const TOWN = new Town(this);
            TOWN.location = { x: X, y: Y };
            this._TOWNS.push(TOWN);           
        }
    }
    draw(x, y, radius) {
        for ( let ox = 0 - radius; ox <= 0 + radius; ox++ ) {
            for( let oy = 0 - radius; oy <= 0 + radius; oy++) {
                if ( Math.abs(ox) + Math.abs(oy) <= radius + (radius/2) ) {                  
                    let results = this.convertCoordinates( x + ox, y + oy );
                    let result = this._map.get(results.x, results.y);
                    this._SEEN[[`${results.x},${results.y}`]] = result;
                    let terrain = this.getTerrainColor(result);            
                    this._CTX.fillStyle = `rgb(${terrain[0]}, ${terrain[1]}, ${terrain[2]})`;
                    this._CTX.fillRect(
                        results.x / this._GRID_SIZE * this._CANVAS.width,
                        results.y / this._GRID_SIZE * this._CANVAS.width,
                        this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE,
                        this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE
                    );
                    // Draw towns (on top of drawn land)
                    this._TOWNS.forEach( town => { 
                        if ( town._revealed === true ) return;                
                        let loc = town.location;

                        if ( x + ox === loc.x && y + oy === loc.y ) {
                            town._revealed = true;
                        };
                    } );

                    // Discover Scenarios
                    this._SCENARIOS.forEach( e => {
                        if ( e.revealed ) return;
                        if (x+ox===e.loc.x&&y+oy===e.loc.y) e.revealed = true;
                    });
                }
            }
        }
        // Check for and draw any feature
        this._TOWNS.forEach(e => { if ( e._revealed === true ) e.draw(this) } );
        this._SCENARIOS.forEach(e=>{if(e.revealed)e.draw();});
    }
    drawSeen() {
        this.clear();
        const GS = this._GRID_SIZE;
        const CW = this._CANVAS.width;
        const PS = this._PIXEL_SIZE/this._GRID_SIZE;
        Object.keys(this._SEEN).forEach( (e,i) => {
            const POS = e.split(",");
            const X = Number(POS[0]);
            const Y = Number(POS[1]);
            const RES = LAND._map.memory[[e]];
            const T = this.getTerrainColor(RES);       
            this._CTX.fillStyle=`rgb(${T[0]},${T[1]},${T[2]})`;
            this._CTX.fillRect(X/GS*CW,Y/GS*CW,PS,PS);
        } );
        this._TOWNS.forEach(e => { if (e.revealed) e.draw() });
        this._SCENARIOS.forEach( e=> { if (e.revealed) e.draw() });
    }
    drawAll() {
        for (let y = 0; y < this._GRID_SIZE; y += this._NUM_PIXELS / this._GRID_SIZE){
            for (let x = 0; x < this._GRID_SIZE; x += this._NUM_PIXELS / this._GRID_SIZE){
    
                let result = this._map.get(x, y);
    
                let terrain = this.getTerrainColor(result);
    
                this._CTX.fillStyle = `rgb(${terrain[0]}, ${terrain[1]}, ${terrain[2]})`;
                this._CTX.fillRect(
                    x / this._GRID_SIZE * this._CANVAS.width,
                    y / this._GRID_SIZE * this._CANVAS.width,
                    this._PIXEL_SIZE,
                    this._PIXEL_SIZE
                );
            }
        }
        this._TOWNS.forEach(e => e.draw() );
        this._SCENARIOS.forEach( e=>e.draw() );
    }
    clear() {
        this._CTX.clearRect(0,0,this._CANVAS.width, this._CANVAS.height);
    }
    getContentTypes() {
        // Return a valid list of actions the player can perform
        
    }
    getClosestMatTo( x, y, name ) {
        const LOC = LAND.convertCoordinates( x, y );
        // Get the mat 
        const MATERIAL = MAT.getResource( name );

        if ( MATERIAL === null ) return -1;

        const ARRAY = Object.keys(MATERIAL._memory);

        ARRAY.sort( (a, b) => {
            // Create a coords
            a = { x: Number(a.split(",")[0]), y: Number(a.split(",")[1]) };     // Convert text to array and number
            b = { x: Number(b.split(",")[0]), y: Number(b.split(",")[1]) };
            return ( Math.distance( LOC.x, LOC.y, a.x, a.y ) >
            Math.distance( LOC.x, LOC.y, b.x, b.y ) );                          // Return closer mat

        });
        
        const DEST = { 
            x: Number(ARRAY[0].split(",")[0]), 
            y: Number(ARRAY[0].split(",")[1]) 
        };
        return DEST;
    }
    getTerrainType( x, y ) {
        const LOC = LAND.convertCoordinates( x, y ); 
        const TERRAIN = this._map.get( LOC.x, LOC.y );
        return this.getTerrainName( TERRAIN );
    }
}

class Terrain {
    constructor( value, color, name, type, difficulty ) {
        this._value = value;
        this._color = color;
        this._name = name;
        this._type = type;
        this._difficulty = difficulty;
    }
    get value() { return this._value; }
    get color() { return this._color; }
    get name() { return this._name; }
    get type() { return this._type; }
    get difficulty() { return this._difficulty; }
}

