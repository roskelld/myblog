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
        this._PIXEL_SIZE = this._CANVAS.width / this._RESOLUTION;
        this._NUM_PIXELS = this._GRID_SIZE / this._RESOLUTION;

        // Landscape Features
        this._TOWNS = [];
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
    clear() {
        this._CTX.clearRect(0,0,this._CANVAS.width, this._CANVAS.height);
        this._map.init();

        // Generate land
        for (let y = 0; y < this._GRID_SIZE; y += this._NUM_PIXELS / this._GRID_SIZE){
            for (let x = 0; x < this._GRID_SIZE; x += this._NUM_PIXELS / this._GRID_SIZE){
                this._map.get(x, y);            
            }
        }
    }
    // Converts to the Perlin map coordinates
    convertCoordinates( x, y ) {
        let loc_x = x * this._PIXEL_SIZE / this._CANVAS.width;
        let loc_y = y * this._PIXEL_SIZE / this._CANVAS.width;
        return { x: loc_x, y: loc_y };
    }
    generateTowns() {
        // Reset Towns
        this._TOWNS.length = 0;

        // Valid terrain height (essentially terrain type)
        let minHeight = -0.27;
        let maxHeight = 0.2;
        let minTowns = 8;
        let maxTowns = 10;
        // Find valid town sites
        // Hunt through the LANDSCAPE to find valid land heights (current assessment)
        let sites = Object.entries(this._map.memory).filter( e => e[1] > minHeight && e[1] < maxHeight ); 
    
        let numberOfTowns = Math.max( minTowns, Math.ceil(Math.rndseed( SEED ) * maxTowns ));
        for (let index = 0; index < numberOfTowns; index++) {
            
            let location = sites[Math.floor(Math.random()*sites.length)];
            let x = location[0].split(',')[0] / this._GRID_SIZE * this._CANVAS.width;
            let y = location[0].split(',')[1] / this._GRID_SIZE * this._CANVAS.width;
    
            let town = new Town();
    
            town.location = { x: x, y: y };
    
            this._TOWNS.push(town);           
        }
    }
    draw(x, y, radius) {
        for ( let offset_x = 0 - radius; offset_x <= 0 + radius; offset_x++ ) {
            for( let offset_y = 0 - radius; offset_y <= 0 + radius; offset_y++) {
                if ( Math.abs(offset_x) + Math.abs(offset_y) <= radius + (radius/2) ) {
                    
                    let results = this.convertCoordinates( x + offset_x, y + offset_y );
                    let result = this._map.get(results.x, results.y);
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

                        if ( x + offset_x === loc.x && y + offset_y === loc.y ) {
                            town._revealed = true;
                        };
                    } );
                }
            }
        }
        // Check for and draw any feature
        this._TOWNS.forEach(e => { if ( e._revealed === true ) e.draw(this) } );
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
        this._TOWNS.forEach(e => e.draw(this) );
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

