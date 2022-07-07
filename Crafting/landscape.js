'use strict';
// const LANDSCAPE_CANVAS = document.getElementById('cnvs');
// LANDSCAPE_CANVAS.width = LANDSCAPE_CANVAS.height = 512;
// const LANDSCAPE_CTX = LANDSCAPE_CANVAS.getContext('2d');

// const GRID_SIZE = 4;
// const RESOLUTION = 16;
// const PIXEL_SIZE = LANDSCAPE_CANVAS.width / RESOLUTION;
// const NUM_PIXELS = GRID_SIZE / RESOLUTION;

// const LANDSCAPE = new Perlin();

// const TOWNS = [];
// const MIN_TOWNS = 3;
// const MAX_TOWNS = 10;


// const TERRAIN = {
//     DEEP_LAKE: {
//         value:      -0.5,
//         color:      [13, 34, 97],
//         name:       "deep lake",
//         type:       "water",
//         difficulty: 2
//     },  
//     MID_LAKE:  {    
//         value:      -0.4,
//         color:      [27, 50, 118],
//         name:       "lake",
//         type:       "water",
//         difficulty: 1.5
//     },  
//     LAKE:      {    
//         value:      -0.3,
//         color:      [24, 131, 195],
//         name:       "shallow lake",
//         type:       "water",
//         difficulty: 1
//     },  
//     SAND:      {    
//         value:      -0.27,
//         color:      [186, 166, 126],
//         name:       "sandy beaches",
//         type:       "soil",
//         difficulty: 1.2
//     },  
//     GRASS:     {    
//         value:      0,
//         color:      [22, 132 ,17],
//         name:       "grass lands",
//         type:       "soil",
//         difficulty: 1
//     },  
//     FOREST:    {    
//         value:      0.2,
//         color:      [23, 67, 21],
//         name:       "forest",
//         type:       "soil",
//         difficulty: 1.5
//     },  
//     ROCK:      {    
//         value:      0.3,
//         color:      [93, 96, 106],
//         name:       "mountains",
//         type:       "rock",
//         difficulty: 2
//     },  
//     LIGHT_ROCK:{    
//         value:      0.47,
//         color:      [133, 133, 133],
//         name:       "high mountains",
//         type:       "rock",
//         difficulty: 2
//     },  
//     SNOW:      {    
//         value:      1,
//         color:      [250, 250, 250],
//         name:       "snow peaks",
//         type:       "rock",
//         difficulty: 3
//     },
// }

// // LANDSCAPE_CANVAS.addEventListener("mousedown", getPosition, false);

// // -------------------------------------------------------------------------------

// function getTerrainColor( value ) {
//     // -1 to -0.9 rgb(0,0,0);
//     if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.color;
//     if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.color;
//     if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.color;
//     if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.color;
//     if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.color;
//     if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.color;
//     if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.color;
//     if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.color;
//     if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.color;
//                                             return TERRAIN.SAND.color;
// }


// function getTerrainName( value ) {
//     if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.name;
//     if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.name;
//     if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.name;
//     if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.name;
//     if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.name;
//     if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.name;
//     if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.name;
//     if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.name;
//     if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.name;
//                                             return TERRAIN.SAND.name;                                           
// }

// function getTerrainType( value ) {
//     if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.type;
//     if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.type;
//     if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.type;
//     if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.type;
//     if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.type;
//     if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.type;
//     if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.type;
//     if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.type;
//     if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.type;
//                                             return TERRAIN.SAND.type;   
// }

// function getTerrainDifficulty( value ) {
//     if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.difficulty;
//     if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.difficulty;
//     if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.difficulty;
//     if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.difficulty;
//     if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.difficulty;
//     if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.difficulty;
//     if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.difficulty;
//     if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.difficulty;
//     if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.difficulty;
//                                             return TERRAIN.SAND.difficulty;   
// }

//  // Draw Landscape
// function drawLandscape() {
//     for (let y = 0; y < GRID_SIZE; y += NUM_PIXELS / GRID_SIZE){
//         for (let x = 0; x < GRID_SIZE; x += NUM_PIXELS / GRID_SIZE){

//             let result = LANDSCAPE.get(x, y);

//             let terrain = getTerrainColor(result);

//             LANDSCAPE_CTX.fillStyle = `rgb(${terrain[0]}, ${terrain[1]}, ${terrain[2]})`;
//             LANDSCAPE_CTX.fillRect(
//                 x / GRID_SIZE * LANDSCAPE_CANVAS.width,
//                 y / GRID_SIZE * LANDSCAPE_CANVAS.width,
//                 PIXEL_SIZE,
//                 PIXEL_SIZE
//             );
//             // console.log(`x: ${x} y: ${y} :: ${result} :: ${getTerrainName(result)}`);
//         }
//     }
// }

// function generateLand() {
//     for (let y = 0; y < GRID_SIZE; y += NUM_PIXELS / GRID_SIZE){
//         for (let x = 0; x < GRID_SIZE; x += NUM_PIXELS / GRID_SIZE){
//             let result = LANDSCAPE.get(x, y);            
//         }
//     }
// }

// function draw(x, y, radius = 0) {
//     // x = x0 + r * cos(t)
//     // y = y0 + r * sin(t)

//     let loop = [[0,0],[0,1],[1,0],[0,-1],[-1,0],[0,2],[1,2],[1,1],[2,1],[2,0],[2,-1],[1,-1],[1,-2],[0,-2],[-1,-2],[-1,-1],[-2,-1],[-2,0],[-2,1],[-1,1],[-1,2]];

//     loop.forEach(e => {
        
//         let results = convertCoordinates( x + e[0], y + e[1] );

//         let result = LANDSCAPE.get(results.x, results.y);
//         let terrain = getTerrainColor(result);
    
//         LANDSCAPE_CTX.fillStyle = `rgb(${terrain[0]}, ${terrain[1]}, ${terrain[2]})`;
//         LANDSCAPE_CTX.fillRect(
//             results.x / GRID_SIZE * LANDSCAPE_CANVAS.width,
//             results.y / GRID_SIZE * LANDSCAPE_CANVAS.width,
//             LANDSCAPE_CANVAS.width / RESOLUTION / GRID_SIZE,
//             LANDSCAPE_CANVAS.width / RESOLUTION / GRID_SIZE
//         );
//     });

//     // let red = x + radius * Math.cos(360/4);
//     // let ged = y + radius * Math.sin(360/4);

// }

// function clearLand() {
//     LANDSCAPE.seed();
//     LANDSCAPE_CTX.clearRect(0,0,LANDSCAPE_CANVAS.width, LANDSCAPE_CANVAS.height);
//     generateLand();
// }

// function getPosition(event)
// {
//     let x = event.x;
//     let y = event.y;

//     x -= LANDSCAPE_CANVAS.offsetLeft;
//     y -= LANDSCAPE_CANVAS.offsetTop;

//     let width = LANDSCAPE_CANVAS.width / (RESOLUTION * GRID_SIZE);
//     let height = LANDSCAPE_CANVAS.height / (RESOLUTION * GRID_SIZE);
//     let loc_x = Math.floor(x/width) / RESOLUTION;
//     let loc_y = Math.floor(y/height) / RESOLUTION;

//     let value = LANDSCAPE.get(loc_x, loc_y);

//     console.log(`x: ${x} (${loc_x}) : y: ${y} (${loc_y}) :: Output ${value} :: ${getTerrainName(value)}` );
// } 

// function getTerrainValueByPosition(x, y) {
//     let coord = convertCoordinates(x,y);
//     let result = LANDSCAPE.get( coord.x , coord.y );
//     return result;
// }

// function convertCoordinates(x, y) {
//     let loc_x = x * PIXEL_SIZE / LANDSCAPE_CANVAS.width;
//     let loc_y = y * PIXEL_SIZE / LANDSCAPE_CANVAS.width;

//     return { x: loc_x, y: loc_y };
// }

// function generateTowns() {
//     TOWNS.length = 0;

//     // Find valid town sites
//     // Hunt through the LANDSCAPE to find valid land heights (current assessment)
//     let sites = Object.entries(Object.values(LANDSCAPE)[1]).filter( e => e[1] > -0.27 && e[1] < 0.2 ); 

//     let numberOfTowns = Math.max( MIN_TOWNS, Math.ceil(Math.random() * MAX_TOWNS ));

//     for (let index = 0; index < numberOfTowns; index++) {
        
//         let location = sites[Math.floor(Math.random()*sites.length)];
//         let x = location[0].split(',')[0] / GRID_SIZE * LANDSCAPE_CANVAS.width;
//         let y = location[0].split(',')[1] / GRID_SIZE * LANDSCAPE_CANVAS.width;

//         let town = new Town();

//         town.location = [x,y];

//         TOWNS.push(town);
//         // town.draw();
        
//     }
// }

// Init

class Land {
    constructor( canvas ) {
        this._CANVAS = canvas;
        this._CTX = this._CANVAS.getContext('2d');
        this._CANVAS.width = this._CANVAS.height = 512;

        this._map = new Perlin();
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
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._color;
    }
    getTerrainDifficulty( value ) {
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._difficulty;
    }
    getTerrainName( value ) {
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._name;
    }
    getTerrainType( value ) {
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain._type;
    }
    getTerrainByPosition( x, y ) {
        let coord = this.convertCoordinates( x,y );
        let result = this._map.get( coord.x , coord.y );
        return this.getTerrain(result);
    }
    getTerrain(value) {
        let terrain = this._terrain.find( e => { return value <= e._value } );
        return terrain;
    }
    clear() {
        this._CTX.clearRect(0,0,this._CANVAS.width, this._CANVAS.height);
        this._map.seed();

        // Generate land
        for (let y = 0; y < this._GRID_SIZE; y += this._NUM_PIXELS / this._GRID_SIZE){
            for (let x = 0; x < this._GRID_SIZE; x += this._NUM_PIXELS / this._GRID_SIZE){
                this._map.get(x, y);            
            }
        }

    }
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
        let minTowns = 3;
        let maxTowns = 10;
        // Find valid town sites
        // Hunt through the LANDSCAPE to find valid land heights (current assessment)
        let sites = Object.entries(Object.values(this._map)[1]).filter( e => e[1] > minHeight && e[1] < maxHeight ); 
    
        let numberOfTowns = Math.max( minTowns, Math.ceil(Math.random() * maxTowns ));
        for (let index = 0; index < numberOfTowns; index++) {
            
            let location = sites[Math.floor(Math.random()*sites.length)];
            let x = location[0].split(',')[0] / this._GRID_SIZE * this._CANVAS.width;
            let y = location[0].split(',')[1] / this._GRID_SIZE * this._CANVAS.width;
    
            let town = new Town();
    
            town.location = [x,y];
    
            this._TOWNS.push(town);           
        }
    }
    draw(x, y) {
        // Draw circle 
        // Write a formula for this sheesh!
        let loop = [[0,0],[0,1],[1,0],[0,-1],[-1,0],[0,2],[1,2],[1,1],[2,1],[2,0],[2,-1],[1,-1],[1,-2],[0,-2],[-1,-2],[-1,-1],[-2,-1],[-2,0],[-2,1],[-1,1],[-1,2]];

        loop.forEach(e => {
            
            let results = this.convertCoordinates( x + e[0], y + e[1] );
    
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
                let loc = {
                    x: town.location[0] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE),
                    y: town.location[1] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE)
                };
                if ( x + e[0] === loc.x && y + e[1] === loc.y ) {
                    town._revealed = true;
                };
            } );
        });
        
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
                // console.log(`x: ${x} y: ${y} :: ${result} :: ${getTerrainName(result)}`);
            }
        }
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

