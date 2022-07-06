'use strict';
const LANDSCAPE_CANVAS = document.getElementById('cnvs');
LANDSCAPE_CANVAS.width = LANDSCAPE_CANVAS.height = 512;
const LANDSCAPE_CTX = LANDSCAPE_CANVAS.getContext('2d');

const GRID_SIZE = 4;
const RESOLUTION = 16;
const COLOR_SCALE = 250;
const TOOL_STRENGTH = 0.125;

const PIXEL_SIZE = LANDSCAPE_CANVAS.width / RESOLUTION;
const NUM_PIXELS = GRID_SIZE / RESOLUTION;

const LANDSCAPE = new Perlin();

const TOWNS = [];
const MIN_TOWNS = 3;
const MAX_TOWNS = 10;

// Terrain types
// -1 to +1 
// Deep lake to Moutain Peak

const TERRAIN_COLOR = {
    DEEP_LAKE:  [13, 34, 97],
    MID_LAKE:   [27, 50, 118],
    LAKE:       [24, 131, 195],
    GRASS:      [22, 132 ,17],
    FOREST:     [23, 67, 21],
    ROCK:       [93, 96, 106],
    LIGHT_ROCK: [133, 133, 133],
    SNOW:       [250, 250, 250],
    SAND:       [186, 166, 126]
};

const TERRAIN_NAMES = {
    DEEP_LAKE:  "deep lake",
    MID_LAKE:   "lake",
    LAKE:       "shallow lake",
    GRASS:      "grass lands",
    FOREST:     "forest",
    ROCK:       "mountains",
    LIGHT_ROCK: "high mountains",
    SNOW:       "snow peaks",
    SAND:       "sandy beaches"
};

const TERRAIN_VALUES = {
    DEEP_LAKE: -0.5,
    MID_LAKE:  -0.4,
    LAKE:      -0.3,
    SAND:       -0.27,
    GRASS:      0,
    FOREST:     0.2,
    ROCK:       0.3,
    LIGHT_ROCK: 0.47,
    SNOW:       1,
};

const TERRAIN = {
    DEEP_LAKE: {
        value:      -0.5,
        color:      [13, 34, 97],
        name:       "deep lake",
        type:       "water",
        difficulty: 2
    },  
    MID_LAKE:  {    
        value:      -0.4,
        color:      [27, 50, 118],
        name:       "lake",
        type:       "water",
        difficulty: 1.5
    },  
    LAKE:      {    
        value:      -0.3,
        color:      [24, 131, 195],
        name:       "shallow lake",
        type:       "water",
        difficulty: 1
    },  
    SAND:      {    
        value:      -0.27,
        color:      [186, 166, 126],
        name:       "sandy beaches",
        type:       "soil",
        difficulty: 1.2
    },  
    GRASS:     {    
        value:      0,
        color:      [22, 132 ,17],
        name:       "grass lands",
        type:       "soil",
        difficulty: 1
    },  
    FOREST:    {    
        value:      0.2,
        color:      [23, 67, 21],
        name:       "forest",
        type:       "soil",
        difficulty: 1.5
    },  
    ROCK:      {    
        value:      0.3,
        color:      [93, 96, 106],
        name:       "mountains",
        type:       "rock",
        difficulty: 2
    },  
    LIGHT_ROCK:{    
        value:      0.47,
        color:      [133, 133, 133],
        name:       "high mountains",
        type:       "rock",
        difficulty: 2
    },  
    SNOW:      {    
        value:      1,
        color:      [250, 250, 250],
        name:       "snow peaks",
        type:       "rock",
        difficulty: 3
    },
}

LANDSCAPE_CANVAS.addEventListener("mousedown", getPosition, false);

// -------------------------------------------------------------------------------

function getTerrainColor( value ) {
    // -1 to -0.9 rgb(0,0,0);
    if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.color;
    if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.color;
    if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.color;
    if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.color;
    if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.color;
    if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.color;
    if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.color;
    if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.color;
    if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.color;
                                            return TERRAIN.SAND.color;
}


function getTerrainName( value ) {
    if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.name;
    if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.name;
    if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.name;
    if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.name;
    if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.name;
    if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.name;
    if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.name;
    if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.name;
    if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.name;
                                            return TERRAIN.SAND.name;                                           
}

function getTerrainType( value ) {
    if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.type;
    if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.type;
    if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.type;
    if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.type;
    if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.type;
    if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.type;
    if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.type;
    if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.type;
    if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.type;
                                            return TERRAIN.SAND.type;   
}

function getTerrainDifficulty( value ) {
    if (value < TERRAIN.DEEP_LAKE.value)    return TERRAIN.DEEP_LAKE.difficulty;
    if (value < TERRAIN.MID_LAKE.value)     return TERRAIN.MID_LAKE.difficulty;
    if (value < TERRAIN.LAKE.value)         return TERRAIN.LAKE.difficulty;
    if (value < TERRAIN.SAND.value)         return TERRAIN.SAND.difficulty;
    if (value < TERRAIN.GRASS.value)        return TERRAIN.GRASS.difficulty;
    if (value < TERRAIN.FOREST.value)       return TERRAIN.FOREST.difficulty;
    if (value < TERRAIN.ROCK.value)         return TERRAIN.ROCK.difficulty;
    if (value < TERRAIN.LIGHT_ROCK.value)   return TERRAIN.LIGHT_ROCK.difficulty;
    if (value < TERRAIN.SNOW.value)         return TERRAIN.SNOW.difficulty;
                                            return TERRAIN.SAND.difficulty;   
}

 // Draw Landscape
function drawLandscape() {
    for (let y = 0; y < GRID_SIZE; y += NUM_PIXELS / GRID_SIZE){
        for (let x = 0; x < GRID_SIZE; x += NUM_PIXELS / GRID_SIZE){

            let result = LANDSCAPE.get(x, y);

            let terrain = getTerrainColor(result);

            LANDSCAPE_CTX.fillStyle = `rgb(${terrain[0]}, ${terrain[1]}, ${terrain[2]})`;
            LANDSCAPE_CTX.fillRect(
                x / GRID_SIZE * LANDSCAPE_CANVAS.width,
                y / GRID_SIZE * LANDSCAPE_CANVAS.width,
                PIXEL_SIZE,
                PIXEL_SIZE
            );
            // console.log(`x: ${x} y: ${y} :: ${result} :: ${getTerrainName(result)}`);
        }
    }
}

function getPosition(event)
{
    let x = event.x;
    let y = event.y;

    x -= LANDSCAPE_CANVAS.offsetLeft;
    y -= LANDSCAPE_CANVAS.offsetTop;

    let width = LANDSCAPE_CANVAS.width / (RESOLUTION * GRID_SIZE);
    let height = LANDSCAPE_CANVAS.height / (RESOLUTION * GRID_SIZE);
    let loc_x = Math.floor(x/width) / RESOLUTION;
    let loc_y = Math.floor(y/height) / RESOLUTION;

    let value = LANDSCAPE.get(loc_x, loc_y);

    // console.log(`x: ${x} (${loc_x}) : y: ${y} (${loc_y}) :: Output ${value} :: ${getTerrainName(value)}` );
} 

function getTerrainValueByPosition(x, y) {
    let coord = convertCoordinates(x,y);
    let result = LANDSCAPE.get( coord.x , coord.y );
    return result;
}

function convertCoordinates(x, y) {
    let loc_x = x * PIXEL_SIZE / LANDSCAPE_CANVAS.width;
    let loc_y = y * PIXEL_SIZE / LANDSCAPE_CANVAS.width;

    return { x: loc_x, y: loc_y };
}

function generateTowns() {
    TOWNS.length = 0;

    // Find valid town sites
    // Hunt through the LANDSCAPE to find valid land heights (current assessment)
    let sites = Object.entries(Object.values(LANDSCAPE)[1]).filter( e => e[1] > -0.27 && e[1] < 0.2 ); 

    let numberOfTowns = Math.max( MIN_TOWNS, Math.ceil(Math.random() * MAX_TOWNS ));

    for (let index = 0; index < numberOfTowns; index++) {
        
        let location = sites[Math.floor(Math.random()*sites.length)];
        let x = location[0].split(',')[0] / GRID_SIZE * LANDSCAPE_CANVAS.width;
        let y = location[0].split(',')[1] / GRID_SIZE * LANDSCAPE_CANVAS.width;

        let town = new Town();

        town.location = [x,y];

        TOWNS.push(town);
        town.draw();
        
    }
}

// Init
