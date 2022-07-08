'use strict';

// Controls
const MOVE_NORTH = "w";
const MOVE_EAST = "d";
const MOVE_SOUTH = "s";
const MOVE_WEST = "a";
const SURVEY = "e";
const RESTART = "Enter";


const NAV = { North: 0, East: 1, South: 2, West: 3 };
const DIRECTION = { 0: "north", 1: "east", 2: "south", 3: "west" };

let lastDirection;
let checkedTile = false;

const GAME_LOG = [];
const GAME_LOG_UI = document.querySelector("#log", false);

// Content UI
const CONTENT_CANVAS = document.getElementById('content');
CONTENT_CANVAS.width = CONTENT_CANVAS.height = 512;
const CONTENT_CTX = CONTENT_CANVAS.getContext('2d');

const UI_GAME_TIME = document.querySelector("#game-time");
const UI_GOLD = document.querySelector("#gold");
const UI_FOOD = document.querySelector("#food");

// Setup Land
const LAND = new Land( document.getElementById('cnvs') );

LAND.addTerrain( 1,     [250,250,250],  "snow peaks",   "rock", 3 );
LAND.addTerrain( -0.5,  [13,34,97],     "deep lake",    "water", 2 );
LAND.addTerrain( -0.4,  [27,50,118],    "lake",         "water", 1.5 );
LAND.addTerrain( -0.3,  [24, 131, 195], "shallow lake", "water", 1.2 );
LAND.addTerrain( -0.27, [186, 166, 126],"sandy beaches","soil", 1.1 );
LAND.addTerrain( 0,     [22, 132 ,17],  "grass lands",  "soil", 1 );
LAND.addTerrain( 0.2,   [23, 67, 21],   "forest",       "soil", 1.2 );
LAND.addTerrain( 0.3,   [93, 96, 106],  "mountains",    "rock", 2 );
LAND.addTerrain( 0.47,  [133, 133, 133],"high mountains", "rock", 2 );
LAND.addTerrain( 1,     [250, 250, 250],"snow peaks",   "rock", 2.5 );

// Game Time
let gameTime = 1;

let avatar;

document.addEventListener("keyup", keyInput, false);

function keyInput(e) {
    const KEY_NAME = e.key;
    let direction;

    switch (KEY_NAME) {
        case MOVE_NORTH:          
            direction = NAV.North;
            break;
        case MOVE_EAST:
            direction = NAV.East;
            break;
        case MOVE_SOUTH:
            direction = NAV.South;
            break;
        case MOVE_WEST:
            direction = NAV.West;
            break;
        case SURVEY:
            surveyTile( avatar.location[0], avatar.location[1] );
            return;
        case RESTART:
            init();
            return;
        default:
            updateLog( `"${e.key}" has no power here.` );
            return;           
    }

    if ( direction == lastDirection ) {
        if (checkDirection) {
            moveCharacter( direction );
            lastDirection = null;
        } else {
            checkDirection( direction );
        }

    } else {
        lastDirection = direction;
        checkDirection( direction );
    }

}

function surveyTile( x, y ) {
    if ( avatar.isDead ) return;
    let result = surveyLocation( x, y )
    updateLog( `Your survey finds a ${result} source` );

    drawMaterial( x, y );

    increaseGameTime(1);

    lastDirection = null;
    gameUpdate();
}

function moveCharacter( direction ) {
    if ( avatar.isDead ) return;
    // console.log( `Move ${direction}` );
    
    let lookDirection = [...avatar.location];
    if ( direction % 2 === 0 ) {
        lookDirection[1] += (direction === 0) ? -1 : 1;
    } else {
        lookDirection[0] += (direction === 1) ? 1 : -1;
    }

    // let value = getTerrainValueByPosition( avatar.location[0], avatar.location[1] );
    let terrain = LAND.getTerrainByPosition( lookDirection[0], lookDirection[1] );

    // Check move is valid   
    if ( avatar.hasTerrain( terrain.type ) ) {

        if ( direction % 2 === 0 ) {
            avatar.location[1] += (direction === 0) ? -1 : 1;
        } else {
            avatar.location[0] += (direction === 1) ? 1 : -1;
        }

        
        // Check to see if there's a landscape feature
        let feature = getLandscapeFeature( lookDirection[0], lookDirection[1] );
        
        if ( feature ) {
            updateLog( `You travel ${DIRECTION[direction]} to the ${feature.type} of ${feature.name}` );
        } else {
            updateLog( `You travel ${DIRECTION[direction]} into ${terrain.name}` );
        }


        // Calculate travel time
        increaseGameTime( terrain.difficulty );

        checkedTile = false;
        gameUpdate();
    } else {
        updateLog( `You cannot traverse ${terrain.name} terrain` );
    }

}

function increaseGameTime(time) {

    avatar.update(time);
    
    gameTime += time;
}

// Report on the chosen direction
function checkDirection( direction ) {
    if ( avatar.isDead ) return;
    // console.log( `Can go ${direction}` );

    let lookDirection = [...avatar.location];
    if ( direction % 2 === 0 ) {
        lookDirection[1] += (direction === 0) ? -1 : 1;
    } else {
        lookDirection[0] += (direction === 1) ? 1 : -1;
    }

    // Check to see if there's a landscape feature
    let feature = getLandscapeFeature( lookDirection[0], lookDirection[1] );

    if ( feature ) {
        updateLog( `You can see the ${feature.type} of ${feature.name} to the ${DIRECTION[direction]}` );
    } else {
        let terrain = LAND.getTerrainByPosition( lookDirection[0], lookDirection[1] );
        updateLog( `You can see a path ${DIRECTION[direction]} into ${terrain.name}` );
    }

    checkedTile = true;
    gameUpdate();
}

function getLandscapeFeature( x, y ) {

    // Step through all the landscape feature arrays (or combine them into one)
    let feature = LAND._TOWNS.find( e => (
        x === ( e.location[0] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE) ) && 
        y === ( e.location[1] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE) )  
    ) );

    // NEXT

    return feature;
}

function drawAvatar() {
    let loc_x = avatar.location[0] * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);
    let loc_y = avatar.location[1] * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);

    // console.log(`x: ${loc_x} y: ${loc_y} :: avatar x: ${avatar.location[0]} y: ${avatar.location[1]}`);

    clearUI();
    CONTENT_CTX.strokeStyle = 'white';
    CONTENT_CTX.strokeRect( loc_x, loc_y,  LAND._PIXEL_SIZE / LAND._GRID_SIZE , LAND._PIXEL_SIZE / LAND._GRID_SIZE );
}

function clearUI() {
    CONTENT_CTX.clearRect(0,0,CONTENT_CANVAS.width, CONTENT_CANVAS.height);
}

function updateLog( message ) {
    GAME_LOG.push( message );
    const NEW_ENTRY = document.createElement( 'p' );
    NEW_ENTRY.textContent = GAME_LOG[GAME_LOG.length-1];
    
    GAME_LOG_UI.appendChild( NEW_ENTRY );
    GAME_LOG_UI.scrollTop = GAME_LOG_UI.scrollHeight;
}

function gameUpdate() {

    
    if ( avatar.isDead ) return;

    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );

    // run automated updates based on location type
    if (feature) {
        if ( feature.type === "town" ) {
            avatar.addFood(40);
        }
    }

    // update game time
    UI_GAME_TIME.textContent = Math.round(gameTime);
    
    // update gold
    UI_GOLD.textContent = avatar.gold;
    
    // update food
    UI_FOOD.textContent = avatar.food;
    
    LAND.draw(avatar.location[0], avatar.location[1]);
    drawAvatar();
}

function generateColor() {
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    // let rgb = [Math.round(Math.random() * 255),Math.round(Math.random() * 255),Math.round(Math.random() * 255)];
    // console.log(rgb);
    return [r,g,b];
}

// Init
function init() {
    gameTime = 1;
    GAME_LOG_UI.replaceChildren();

    LAND.clear();
    clearMaterials();

    // drawLandscape();
    LAND.generateTowns();
    
    let startTown = LAND._TOWNS[Math.floor(Math.random()*LAND._TOWNS.length)];
    
    avatar = new Avatar();
    
    
    // avatar.location[0] = startTown.location[0] / (PIXEL_SIZE / GRID_SIZE);
    // avatar.location[1] = startTown.location[1] / (PIXEL_SIZE / GRID_SIZE);
    
    avatar.location = [startTown.location[0] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE), startTown.location[1] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE)];
    
    // Default terrain
    avatar.addValidTerrain("soil");
    
    updateLog( `The adventures of ${avatar.name} from the town of ${startTown.name}` );
    gameUpdate();
    
    LAND.draw(avatar.location[0], avatar.location[1]);
    drawAvatar();

}




init();