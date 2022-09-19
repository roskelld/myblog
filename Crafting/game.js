'use strict';
const SEED = 3108197869694201;
// const SEED = new Date().getTime();

// Controls
const MOVE_NORTH = "w";
const MOVE_NORTH_EAST = "9";
const MOVE_EAST = "d";
const MOVE_SOUTH_EAST = "3";
const MOVE_SOUTH = "s";
const MOVE_SOUTH_WEST = "1";
const MOVE_NORTH_WEST = "7";
const MOVE_WEST = "a";
const USE = "e";
const ACCEPT = "Enter";
const RESTART = "Escape";
const INV_DOWN = "ArrowDown";
const INV_UP = "ArrowUp";
const ACT_DOWN = "f";
const ACT_UP = "r";
const BACK = "q";

const PAD = {
    0: ACCEPT,
    1: BACK,
    2: ACCEPT,
    3: ACCEPT,
    4: INV_UP,
    5: INV_DOWN,
    6: ACT_UP,
    7: ACT_DOWN,
    8: RESTART,
    9: ACCEPT,
    10: ACCEPT,
    11: ACCEPT,
    12: MOVE_NORTH,
    13: MOVE_SOUTH,
    14: MOVE_WEST,
    15: MOVE_EAST,
    40: MOVE_NORTH_EAST,
    42: MOVE_NORTH_WEST,
    46: MOVE_SOUTH_EAST,
    48: MOVE_SOUTH_WEST
};

const controls = {
    move: {
        n:  ["w","ArrowUp","8"],
        ne: ["9"],
        e:  ["d","ArrowRight","6"],
        se: ["3"],
        s:  ["s","ArrowDown","2"],
        sw: ["1"],
        w:  ["a","ArrowLeft","4"],
        nw: ["7"],
    },
    use:    ["e","5"],
    accept: ["Enter"],
    back:   ["q","0"],
    restart:["Escape"],
    inv: {
        up: ["r","-"],
        dn: ["f","+"],
    },
    act: {
        up: ["t","/"],
        dn: ["g","*"], 
    }
};

const NAV = { North: 0, East: 1, South: 2, West: 3, 
              NorthWest: 4, NorthEast: 5, SouthEast: 6, SouthWest: 7 };
const DIRECTION = { 0: "north", 1: "east", 2: "south", 3: "west", 
            4: "north west", 5: "north east", 6: "south east", 7: "south west"};

const GAME_MODES = {
    general:    0,
    shop_buy:   1,
    shop_sell:  2,
    tavern:     3,
    crafting:   4,
    combat:     5,
    dungeon:    6
}
let _currentGameMode = 0;

// Strings
const ACTION_STRINGS = {
    "Look":     "look at",
    "Mine":     "mine with",
    "Attack":   "attack with",
    "Survey":   "survey with",
    "Defend":   "defend with",
    "Throw":    "throw",
    "Buy":      "Enter store to",
    "Sell":     "Enter store to",
    "Pray":     "Enter holy site to",
    "Gamble":   "Enter tavern to",
    "Craft":    "Craft",
    "Fish":     "Cast"
}

// -----------------------------------------------------------------------------
// Game Pad 
let start;
let controller = {};
let buttonStack = [];
let last_move = 0;                                                              // Track last move time
window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    const GPADS = navigator.getGamepads();
    if (!GPADS) return;
    const GPAD = GPADS[0];
    registerControllerButtons(GPAD.buttons)
    gameLoop();
});
window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected from index %d: %s",
    e.gamepad.index, e.gamepad.id);
    cancelRequestAnimationFrame(start);
});
function registerControllerButtons(pad) {                                       // Configure pad buttons
    controller = {};
    pad.forEach( (e,i) => {
        controller[[i]] = { last: 0, pressed: false };
    });
    controller[["40"]] = { last: 0, pressed: false };                           // North East
    controller[["42"]] = { last: 0, pressed: false };                           // North West
    controller[["46"]] = { last: 0, pressed: false };                           // South East
    controller[["48"]] = { last: 0, pressed: false };                           // South West
}
function padButtonPrsd(b) {
    if ( controller[[b]].last > start-10 || controller[[b]].pressed ) return;   // Pad button pressed if not already
    controller[[b]].last = start;
    controller[[b]].pressed = true;
    buttonStack.push(b);                                                        // Add action to queue
}
function padButtonRel(b) {
    controller[[b]].pressed = false;
}
function padMoveButtonPrsd(b) {                                                 // Doesn't require button release 
    if ( last_move > start-12 ) return;                                         // Don't act if within last update phase
    last_move = start;                                                          // Track last move
    buttonStack.push(b);                                                        // Add action to queue
}
function gameLoop() {
    const GPADS = navigator.getGamepads();                                      // Handle pad capture
    if (!GPADS) return;
    const GPAD = GPADS[0];
    if (GPAD.buttons[12].pressed && GPAD.buttons[15].pressed) {                 // Character movement
        padMoveButtonPrsd(40);
    } else if (GPAD.buttons[12].pressed && GPAD.buttons[14].pressed) {
        padMoveButtonPrsd(42);
    } else if (GPAD.buttons[13].pressed && GPAD.buttons[14].pressed) {
        padMoveButtonPrsd(48);
    } else if (GPAD.buttons[13].pressed && GPAD.buttons[15].pressed) {
        padMoveButtonPrsd(46);
    } else if (GPAD.buttons[12].pressed) {
        padMoveButtonPrsd(12);
    } else if (GPAD.buttons[13].pressed) {
        padMoveButtonPrsd(13);
    } else if (GPAD.buttons[14].pressed) {
        padMoveButtonPrsd(14);
    } else if (GPAD.buttons[15].pressed) {
        padMoveButtonPrsd(15);
    }
    if (GPAD.buttons[0].pressed)padButtonPrsd(0);                               // Action Buttons
    if (GPAD.buttons[1].pressed)padButtonPrsd(1);
    if (GPAD.buttons[2].pressed)padButtonPrsd(2);
    if (GPAD.buttons[3].pressed)padButtonPrsd(3);
    if (GPAD.buttons[4].pressed)padButtonPrsd(4);
    if (GPAD.buttons[5].pressed)padButtonPrsd(5);
    if (GPAD.buttons[6].pressed)padButtonPrsd(6);
    if (GPAD.buttons[7].pressed)padButtonPrsd(7);
    if (GPAD.buttons[8].pressed)padButtonPrsd(8);
    if (GPAD.buttons[9].pressed)padButtonPrsd(9);
    if (GPAD.buttons[10].pressed)padButtonPrsd(10);
    if (GPAD.buttons[11].pressed)padButtonPrsd(11);
    
    if (!GPAD.buttons[0].pressed)padButtonRel(0);                               // Handle release
    if (!GPAD.buttons[1].pressed)padButtonRel(1);
    if (!GPAD.buttons[2].pressed)padButtonRel(2);
    if (!GPAD.buttons[3].pressed)padButtonRel(3);
    if (!GPAD.buttons[4].pressed)padButtonRel(4);
    if (!GPAD.buttons[5].pressed)padButtonRel(5);
    if (!GPAD.buttons[6].pressed)padButtonRel(6);
    if (!GPAD.buttons[7].pressed)padButtonRel(7);
    if (!GPAD.buttons[8].pressed)padButtonRel(8);
    if (!GPAD.buttons[9].pressed)padButtonRel(9);
    if (!GPAD.buttons[10].pressed)padButtonRel(10);
    if (!GPAD.buttons[11].pressed)padButtonRel(11);

    if (!GPAD.buttons[12].pressed)padButtonRel(12);
    if (!GPAD.buttons[13].pressed)padButtonRel(13);
    if (!GPAD.buttons[14].pressed)padButtonRel(14);
    if (!GPAD.buttons[15].pressed)padButtonRel(15);

    if (!GPAD.buttons[12].pressed||!GPAD.buttons[15].pressed)padButtonRel(40);
    if (!GPAD.buttons[12].pressed||!GPAD.buttons[14].pressed)padButtonRel(42);
    if (!GPAD.buttons[13].pressed||!GPAD.buttons[14].pressed)padButtonRel(48);
    if (!GPAD.buttons[13].pressed||!GPAD.buttons[15].pressed)padButtonRel(46);


    if( buttonStack.length > 0 ) keyInput( { key: PAD[[buttonStack.pop()]]} );  // Perform action from stack
    start = requestAnimationFrame(gameLoop);                                    // Loop the game
}
// -----------------------------------------------------------------------------

// Prevent arrow keys from scrolling windows 
window.addEventListener("keydown", e => { 
    if (controls.move.n.includes(e.key) || controls.move.s.includes(e.key) ) 
        e.preventDefault(); 
}, false );

const INSTRUCTION_BASE=`(${MOVE_NORTH}${MOVE_WEST}${MOVE_SOUTH}${MOVE_EAST}) Move`;

let lastDirection;
let checkedTile = false;

const GAME_LOG = [];
const GAME_LOG_UI = document.querySelector("#log", false);

// Content UI
const CONTENT_CANVAS = document.getElementById('content');
CONTENT_CANVAS.width = CONTENT_CANVAS.height = 512;
const CONTENT_CTX = CONTENT_CANVAS.getContext('2d');

const UI_GAME_TIME = document.querySelector("#game-time");
const UI_GOLD = document.querySelectorAll(".stat-gold");
const UI_FOOD = document.querySelector("#food");
const UI_WEIGHT = document.querySelector("#weight");

const INV_SEL = document.querySelector("#inventory");
INV_SEL.addEventListener("change", selectItem, false );
INV_SEL.addEventListener("focus", e => { 
    INV_SEL.blur(); 
}, false );

const ITEM_ACTIONS = document.querySelector("#action");
ITEM_ACTIONS.addEventListener("change", selectAction, false );
ITEM_ACTIONS.addEventListener("focus", e => { ITEM_ACTIONS.blur(); }, false );

const INSTRUCTIONS = document.querySelector("#instructions");

// ----------------------------------------------------------------------------
// ITEM DETAILS

const UI_DETAILS = document.querySelector("#details");
const UI_DETAILS_BOX = document.querySelector("#details-box");

// ----------------------------------------------------------------------------
// ITEM DESCRIPTION

const ITEM_DESC = document.querySelector("#item-description");

// ----------------------------------------------------------------------------
// Shop
const SHOP_UI = document.querySelector("#shop");
const SHOP_LIST = document.querySelector("#shop-list");
SHOP_LIST.addEventListener("change", selectShopItem, false );
SHOP_LIST.addEventListener("focus", e => { SHOP_LIST.blur(); }, false );

// ----------------------------------------------------------------------------
// Crafting
const CRAFT_UI = document.querySelector("#crafting");

const CRAFT_NAME = document.querySelector("#crafting-item-name");

// Text of recipe
const CRAFT_RECIPE = document.querySelector("#crafting-item-recipe");
const CRAFT_LISTS = document.querySelector("#crafting-lists");

// Storage for map of crafting items
let crafting_recipe;

const CRAFT_ITEM_TITLE = document.querySelector("#craft-item-title");
CRAFT_ITEM_TITLE.addEventListener("keydown", e => {  }, false );

// Crafting Output Details
const CRAFT_DETAILS = document.querySelector("#crafting-details");

// Action calls like leave and craft
const CRAFT_ACTION_LIST = document.querySelector("#crafting-list");
CRAFT_ACTION_LIST.addEventListener("change", () => {  
    selectCraftingMenuActionItem(CRAFT_ACTION_LIST.value); 
}, false );
CRAFT_ACTION_LIST.addEventListener("focus", e => { 
    CRAFT_ACTION_LIST.blur(); 
}, false );

// Setup Land
const LAND = new Land(document.getElementById("landscape"));

LAND.addTerrain( 1,     [250,250,250],  "snow peaks",       "rock",     3 );
LAND.addTerrain( -0.5,  [13,34,97],     "deep lake",        "water",    2 );
LAND.addTerrain( -0.4,  [27,50,118],    "lake",             "water",    1.5 );
LAND.addTerrain( -0.3,  [24, 131, 195], "shallow lake",     "water",    1.2 );
LAND.addTerrain( -0.27, [186, 166, 126],"sandy beaches",    "soil",     1.1 );
LAND.addTerrain( 0,     [22, 132 ,17],  "grass lands",      "soil",     1 );
LAND.addTerrain( 0.2,   [23, 67, 21],   "forest",           "soil",     1.2 );
LAND.addTerrain( 0.3,   [93, 96, 106],  "mountains",        "rock",     2 );
LAND.addTerrain( 0.47,  [133, 133, 133],"high mountains",   "rock",     2 );
LAND.addTerrain( 1,     [250, 250, 250],"snow peaks",       "rock",     2.5 );

// Set Overworld Material
const MAT = new Material( document.getElementById("materials"));
MAT.addResource( new Resource( 
    "copper", 
    [194,115,51],
    [194,115,51], 
    ["metal","copper"], 0.0355, 0.005, 0.03, 0.75,
    {} ) );
    
MAT.addResource( new Resource( 
    "iron", 
    [125,125,125],
    [200,200,200], 
    ["metal","iron"], 0.15, 0.09, 0.3505, 0.95,
    {} ) );

MAT.addResource( new Resource( 
    "gold", 
    [255,223,0],
    [255,223,0], 
    ["metal","gold"], 0.4, 2, 0.42, 1, 
    {} ) );

MAT.addResource( new Resource( 
    "tin", 
    [197,201,199],
    [197,201,199], 
    ["metal","tin"], 0.0382001, 0.04439, 0.25, 0.95,
    {} ) );

MAT.addResource( new Resource( 
    "lead", 
    [48,49,47],
    [48,49,47], 
    ["metal","lead"], 0.3, 0.0100, 0.15, 0.75,
    {} ) );

MAT.addResource( new Resource( 
    "silver", 
    [77,79,78],
    [77,79,78], 
    ["metal","silver"], 0.4, 2, 0.40, 1, 
    {} ) );

// WFC
const WFC_OL = new WFC_OVERLAP();
const WFC_T  = new WFC_TILE();

// Game Time
let gameTime = 1;

let avatar;

const SELCT_ITM_ID = () => INV_SEL.options[INV_SEL.selectedIndex].value;

document.addEventListener("keyup", keyInput, false);

function keyInput(e) {   

    // Prevent keyboard shortcuts from taking 
    // over when player is entering text
    if ( document.activeElement.type === "text" ) return;

    const KEY_NAME = e.key;
    let direction;
    // general:    0,
    // shop_buy:   1,
    // shop_sell:  2,
    // tavern:     3,
    // crafting:   4,
    // combat:     5,
    // dungeon:    6
    switch(_currentGameMode) {
        case 0:
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
                case USE:
                case ACCEPT:
                    if ( ITEM_ACTIONS.options.length === 0 ) return;
                    useItem( INV_SEL.value );
                    return;
                case RESTART:
                    init();
                    return; 
                case INV_UP:
                    if ( INV_SEL.selectedIndex === 0 || INV_SEL.selectedIndex === -1 ) {
                        INV_SEL.selectedIndex = INV_SEL.length - 1;
                    } else {
                        INV_SEL.selectedIndex--;
                    }
                    // selectItem( INV_SEL.value );
                    selectItem();
                    return;
                case INV_DOWN:
                    if ( INV_SEL.selectedIndex === INV_SEL.length - 1 ) {
                        INV_SEL.selectedIndex = 0;
                    } else {
                        INV_SEL.selectedIndex++;
                    }
                    // selectItem( INV_SEL.value );
                    selectItem();
                    return;
                case ACT_UP:
                    if ( ITEM_ACTIONS.selectedIndex === 0 || ITEM_ACTIONS.selectedIndex === -1 ) {
                        ITEM_ACTIONS.selectedIndex = ITEM_ACTIONS.length - 1;
                    } else {
                        ITEM_ACTIONS.selectedIndex--;
                    }
                    selectAction();
                    return;
                case ACT_DOWN:
                    if ( ITEM_ACTIONS.selectedIndex === ITEM_ACTIONS.length - 1 ) {
                        ITEM_ACTIONS.selectedIndex = 0;
                    } else {
                        ITEM_ACTIONS.selectedIndex++;
                    }
                    selectAction();
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
            break;
        case 1:
        case 2:
            switch (KEY_NAME) {
                case USE:
                case ACCEPT:
                    if ( getGameMode() === 1 ) {
                        buy( SHOP_LIST.value );
                    } else {
                        sell( SHOP_LIST.value );
                    }
                break;
                case MOVE_NORTH:  
                case ACT_UP:
                case INV_UP:
                    if ( SHOP_LIST.selectedIndex === 0 || SHOP_LIST.selectedIndex === -1 ) {
                        SHOP_LIST.selectedIndex = SHOP_LIST.length - 1;
                    } else {
                        SHOP_LIST.selectedIndex--;
                    }
                    selectShopItem();
                break;
                case MOVE_SOUTH:  
                case ACT_DOWN:
                case INV_DOWN:
                    if ( SHOP_LIST.selectedIndex === SHOP_LIST.length - 1 ) {
                        SHOP_LIST.selectedIndex = 0;
                    } else {
                        SHOP_LIST.selectedIndex++;
                    }
                    selectShopItem();
                break;
                case BACK:
                case RESTART:
                    leaveShop();
                break;
            }
            break;
        case 4:
            switch (KEY_NAME) {
                case USE:
                case ACCEPT:
                    selectCraftingMenuActionItem( CRAFT_ACTION_LIST.value );
                break;
                case INV_UP:
                    if ( CRAFT_ACTION_LIST.selectedIndex === 0 || CRAFT_ACTION_LIST.selectedIndex === -1 ) {
                        CRAFT_ACTION_LIST.selectedIndex = CRAFT_ACTION_LIST.length - 1;
                    } else {
                        CRAFT_ACTION_LIST.selectedIndex--;
                    }

                    if ( CRAFT_ACTION_LIST.selectedIndex === 0 ) {
                        INSTRUCTIONS.textContent = `(\u2B06\u2B07) Select Action : (E) Leave`;
                    } else {
                        let item = avatar.getItem( INV_SEL.value );
                        // Update Instructions
                        updateIntructions(item.name);
                    }
                break;
                case INV_DOWN:
                    if ( CRAFT_ACTION_LIST.selectedIndex === CRAFT_ACTION_LIST.length - 1 ) {
                        CRAFT_ACTION_LIST.selectedIndex = 0;
                    } else {
                        CRAFT_ACTION_LIST.selectedIndex++;
                    }

                    if ( CRAFT_ACTION_LIST.selectedIndex === 0 ) {
                        INSTRUCTIONS.textContent = `(\u2B06\u2B07) Select Action : (E) Leave`;
                    } else {
                        let item = avatar.getItem( INV_SEL.value );
                        // Update Instructions
                        updateIntructions(item.name);
                    }
                break;
                case BACK:
                case RESTART:
                    leaveCrafting();
                break;
            }
            break;
        case 6:
            const F = getLandscapeFeature(avatar.loc.x, avatar.loc.y);
            switch (KEY_NAME) {
                case USE:
                case ACCEPT:
                    if ( ITEM_ACTIONS.options.length === 0 ) return;
                    useItem( INV_SEL.value );
                break;
                case INV_UP:
                    if ( INV_SEL.selectedIndex === 0 || INV_SEL.selectedIndex === -1 ) {
                        INV_SEL.selectedIndex = INV_SEL.length - 1;
                    } else {
                        INV_SEL.selectedIndex--;
                    }
                    // selectItem( INV_SEL.value );
                    selectItem();
                break;
                case INV_DOWN:
                    if ( INV_SEL.selectedIndex === INV_SEL.length - 1 ) {
                        INV_SEL.selectedIndex = 0;
                    } else {
                        INV_SEL.selectedIndex++;
                    }
                    // selectItem( INV_SEL.value );
                    selectItem();
                break;
                case ACT_UP:
                    if ( ITEM_ACTIONS.selectedIndex === 0 || ITEM_ACTIONS.selectedIndex === -1 ) {
                        ITEM_ACTIONS.selectedIndex = ITEM_ACTIONS.length - 1;
                    } else {
                        ITEM_ACTIONS.selectedIndex--;
                    }
                    selectAction();
                break;
                case ACT_DOWN:
                    if ( ITEM_ACTIONS.selectedIndex === ITEM_ACTIONS.length - 1 ) {
                        ITEM_ACTIONS.selectedIndex = 0;
                    } else {
                        ITEM_ACTIONS.selectedIndex++;
                    }
                    selectAction();
                break;
                case MOVE_NORTH: F.move( NAV.North ); break;
                case MOVE_SOUTH: F.move( NAV.South ); break;
                case MOVE_WEST: F.move( NAV.West ); break;
                case MOVE_EAST: F.move( NAV.East ); break;
                case MOVE_NORTH_WEST: F.move( NAV.NorthWest ); break;
                case MOVE_NORTH_EAST: F.move( NAV.NorthEast ); break;
                case MOVE_SOUTH_WEST: F.move( NAV.SouthWest ); break;
                case MOVE_SOUTH_EAST: F.move( NAV.SouthEast ); break;
            }
        }
}

function setGameMode( mode ) {
    let current = _currentGameMode;

    if (GAME_MODES[mode] === undefined) {
        _currentGameMode = 0;
    } else {
        _currentGameMode = GAME_MODES[mode];
    }
}

function getGameMode() {
    return _currentGameMode;
}

function selectShopItem() {
    updateIntructions();
    if ( SHOP_LIST.value == -1 ) {
        updateLog(`You turn to face the door of the shop.`);
        return;
    } 
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    if ( getGameMode() === 1 ) {
        const PRICE = feature._market[SHOP_LIST.selectedIndex-1].price.toFixed(2);
        updateLog(
            `You pick up a ${SHOP_LIST.value} from a 
            shelf and the shop keeper looks up and 
            shouts "${PRICE} gold, you'll not find a 
            better deal".`);
        return;
    }
    if ( getGameMode() === 2 ) {
        const ITEM = avatar.getItem( SHOP_LIST.value );
        let price = feature.offerToBuyPrice( ITEM );
        updateLog(
            `You pull a ${ITEM.name} from your pack and show it 
            to the shop keeper who quickly blerts out 
            "${price} gold" in a way that makes it clear 
            that it's not a negotiable offer.`);
        return;
    }
}

function selectItem(none = false) {
    // Show all actions
    // Get Item
    let item = (none) ? undefined : avatar.getItem( INV_SEL.value );
    
    // clear current actions
    let items = ITEM_ACTIONS.options.length;
    for (let i = 0; i < items; i++) {
        ITEM_ACTIONS.options[0]
            .removeEventListener("click",()=>useItem(INV_SEL.value),false);
        ITEM_ACTIONS.options[0].remove();
    }
    
    // Clear List
    let count = UI_DETAILS.childElementCount;
    for (let index = 0; index < count; index++) {
        UI_DETAILS.removeChild(UI_DETAILS.lastElementChild);       
    }

    if ( !item ) {                                                              // No item equipped
        setLandscapeFeatureActions();                                           // This could be used for character actions such as camp, pray, hunt
        setLandscapeFeatureDescription(avatar.loc.x,avatar.loc.y);
        return;
    }
    
    if ( !item.use ) {
        updateIntructions();
        return;
    }

    // Add Actions
    item.use.forEach( e => {
        ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( e, e );  
        ITEM_ACTIONS.options[ITEM_ACTIONS.length - 1]
            .addEventListener("click", () => useItem( INV_SEL.value ), false );
    });

    ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( "Drop", "Drop" );  
    ITEM_ACTIONS.options[ITEM_ACTIONS.length - 1]
        .addEventListener("click", () => useItem( INV_SEL.value ), false );
    
    // Select first option;
    ITEM_ACTIONS.options[0].selected = true;

    // Add Details
    UI_DETAILS.appendChild(
        GenerateItemDetailRow( 'Efficency', item.efficency ));
    Object.keys(item.stats).forEach( e => { 
        UI_DETAILS.appendChild(GenerateItemDetailRow(e, item.stats[[e]]));
    } );

    // Add Description
    setDescription(item);

    updateIntructions( INV_SEL.options[INV_SEL.selectedIndex].text );
}

function selectAction() {
    updateIntructions( INV_SEL.options[INV_SEL.selectedIndex].text );
}

function GenerateItemDetailRow( title, value ) {
    let row = document.createElement("tr");
    let elTitle = document.createElement("td");
    let elValue = document.createElement("td");
    elTitle.textContent = `${title}:`;
    elValue.textContent = `${value}`;

    row.appendChild(elTitle);
    row.appendChild(elValue);
    return row;
}

function useItem( id ) {
    if ( avatar.isDead ) return;
    let item = avatar.getItem( id );
    
    // Figure out logic for use action based on selected item and content at
    // location survey is always an option so could be a fall back given if 
    // there's no "SCENARIO" happening or "FEATURE"
    let action = ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value;

    switch (action) {
        case "Mine": mineTile(); break;
        case "Survey":
            scanLandForMaterial( 
                avatar.loc.x, 
                avatar.loc.y, 
                avatar.getItem(INV_SEL[INV_SEL.selectedIndex].value) );
            break;
        case "Look":
            updateLog(
                `You inspect the ${item.name}, it feels nice in the hand.`); 
            break;
        case "Gamble":      gamble();                   break;
        case "Pray":        pray();                     break;
        case "Attack":      attack();                   break;  
        case "Defend":      defend();                   break;  
        case "Throw":       throwItem();                break;    
        case "Buy":         enterShop("buy");           break;               
        case "Sell":        enterShop("sell");          break;
        case "Roll Dice":   rollDice(6);                break;
        case "Play Song":   playInstrument(item.name);  break;
        case "Craft":       enterCrafting();            break;               
        case "Fish":        fish();                     break;   
        case "Chop":        chopTree();                 break;
        case "Toggle":      toggle_item_function();     break;
        case "Enter":       enterScenario();            break;                        
        case "Drop":        dropItem(item);             break;  
        default:
            break;
    }
}

function enterScenario() {
    let F = getLandscapeFeature(avatar.loc.x, avatar.loc.y);
    if (F === undefined ) {
        F = LAND.genScenario( avatar.mapLocation.x, avatar.mapLocation.y, true );
    }
    F.start();
    setGameMode("dungeon");
    SetGameLocation(F);
    setLandscapeFeatureActions(F);
    clearUI();
    
}
// ----------------------------------------------------------------------------
// Set and get current player scenario - Dungeon instance

let current_scenario = null;
function SetGameLocation(scenario) {
    current_scenario = scenario;
}

function GetGameLocation() {
    return current_scenario;
}
// ----------------------------------------------------------------------------
// Crafting
function enterCrafting() {
    const FEAT = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    console.log( FEAT );
    if ( FEAT === undefined || FEAT.type !== "town" ) {
        updateLog(
            `Alas you cannot craft unless you're in a town.`);
        return;
    }

    CRAFT_UI.classList.remove("hide");                                          // Show Crafting UI
    CRAFT_ACTION_LIST.selectedIndex = 1;                                        // Default select Craft as the Action
    setGameMode("crafting");                                                    // Set controls
    const SCHEMATIC = avatar.getItem(SELCT_ITM_ID());                       // Get Schematic Data
    updateIntructions(SCHEMATIC.name);                                          // Update Instructions  
    CRAFT_NAME.textContent = SCHEMATIC.name;                                    // Set crafting page title           
    CRAFT_ITEM_TITLE.value = SCHEMATIC.craftData.name;                          // Set default name to item name
    let TOOL_ITEMS = [];                                                        // Collect all valid tools

    let message = "";                                                           // Generate and add recipe text
    Object.keys(SCHEMATIC.craftData.materials).forEach( 
        (title) => { 
            message += `${title} * ${SCHEMATIC.craftData.materials[[title]]} `  // Material type and amount needed
        })
    CRAFT_RECIPE.textContent = message.substring(0, message.length - 1);        // Add the recipe to the UI 
   
    
    let count = CRAFT_LISTS.childElementCount;                                  // Clear Material Lists
    for (let index = 0; index < count; index++) 
        CRAFT_LISTS.removeChild(CRAFT_LISTS.lastElementChild);

    count = CRAFT_DETAILS.childElementCount;
    for (let index = 0; index < count; index++) 
        CRAFT_DETAILS.removeChild(CRAFT_DETAILS.lastElementChild);
    
    const CRAFT_ITEMS = avatar._inventory.filter( 
                                        e => ( e.hasType("crafting") ) );       // Get all crafting (Mats & tools) items
    
    // Populate the build list
    Object.keys(SCHEMATIC.craftData.materials).forEach( title => {
        const MAT_COUNT = SCHEMATIC.craftData.materials[[title]];               // Get number of mats needed to craft item
        const MAT_LIST = CRAFT_ITEMS
                    .filter( e => e.properties.includes(title)   )              // Filter mat list to matching type
                    .filter( e => !e.properties.includes("tool") );             // Filter out any tools
                    
        AddCraftingMaterialListUI( MAT_LIST, MAT_COUNT, title );                // Add Material list UI

        const TOOLS = CRAFT_ITEMS
                        .filter( e => e.properties.includes(title)  )
                        .filter( e => e.properties.includes("tool") );          // Filter to only valid tools
        // let array = TOOL_ITEMS.concat( TOOLS );                                 // Merge array with current tools
        // TOOL_ITEMS = array;                                                     // update to new tool array
        AddCraftingMaterialListUI( TOOLS, 1, `${title} Tools`, true );        // Add Tools list
    } );
    
    // AddCraftingMaterialListUI( TOOL_ITEMS, TOOL_ITEMS.length, "Tools" );        // Add Tools list
}

function AddCraftingMaterialListUI( MAT_LIST, MAT_COUNT, title, tool = false ) {
    const FORM = document.createElement("form");                                // Create Form to list mats in
    FORM.dataset.title = title;                                                 // Set Mat as form title
   
    const HEADER = document.createElement("h3");
    HEADER.textContent = `${title} * 0`;                                        // Setup form header with current select number
    
    const CONTAINER = document.createElement("div");                            // Container for UI elements
    CONTAINER.classList.add("selection-list");
    
    MAT_LIST.forEach( e => {                                                    // Add UI el for each Mat
        const LABEL = document.createElement("label");
        LABEL.htmlFor = title;

        const INPUT = document.createElement("input");
        INPUT.type = ( tool ) ? "radio" : "checkbox";                           // Can only pick one tool per mat to use
        INPUT.for = e.id;
        INPUT.value = e.id;
        INPUT.name = title;  
        INPUT.id = e.id;    

        const NAME = document.createElement("p");
        NAME.textContent = e.name;

        LABEL.appendChild(INPUT);
        LABEL.appendChild(NAME);
        CONTAINER.appendChild(LABEL);

        NAME.addEventListener("click", () => INPUT.click(), false );
        INPUT.addEventListener("change", 
            () => updateCraftingNumbers( 
                    FORM, HEADER, title, MAT_COUNT ), false );                  // Event to update UI when (de)selected
    });
            
    FORM.appendChild(HEADER);                                                   // Add to DOM
    FORM.appendChild(CONTAINER);
    CRAFT_LISTS.appendChild(FORM);
}

function updateCraftingNumbers( form, header, title, count ) {
    let formData = new FormData(form);
    let selectCount =  Array.from(formData.values()).length;

    let current = ( selectCount > count ) ? `${count} + Bonus ${selectCount - count}` : selectCount;
    header.textContent = `${title} * ${current}`;


    // Get Base Item Data 
    let itemTitle = INV_SEL.options[INV_SEL.selectedIndex].text.split("(")[0];
    itemTitle = itemTitle.substr(0, itemTitle.length -1 );
    let item = getItemDataFromName( itemTitle );

    // Clear List
    let elcount = CRAFT_DETAILS.childElementCount;
    for (let index = 0; index < elcount; index++) CRAFT_DETAILS.removeChild(CRAFT_DETAILS.lastElementChild);

    let stats = getCraftingItemStats();
    
    // Add Details
    Object.keys(stats).forEach( e => { 
        let row = document.createElement("tr");
        let title = document.createElement("td");
        let value = document.createElement("td");
        title.textContent = `${e}:`;
        value.textContent = `${stats[[e]].toFixed(2)}`;

        row.appendChild(title);
        row.appendChild(value);

        CRAFT_DETAILS.appendChild(row);
    } );
}

function getCraftingItemStats() {
    const SCHEMATIC = avatar.getItem(SELCT_ITM_ID());
    const STATS = {};                                                           // Track all relevent stats
    const FORMS = CRAFT_LISTS.querySelectorAll("form");                         
    const TOOLS = {};                                                           // Track the tool stats

    FORMS.forEach( form => {                                                    // Step through each form (tool/mat category)
        const FORM_DATA = new FormData(form);     
        if ( FORM_DATA.getAll(form.dataset.title).length === 0 ) return;        // Step out if no mats/tools on form have been selected              
        
        for (const [key, value] of FORM_DATA) {                                 // Step through each selected object
            const ITEM = avatar.getItem( value );                                
            Object.keys(SCHEMATIC.craftData.stats).forEach( e => {              // Step through each stat on the item being crafted
                if ( STATS[[e]] === undefined ) STATS[[e]] = 0;                 // Add stat key if not yet init
                
                if ( ITEM.properties.includes( "tool" ) ) {
                    if ( TOOLS[[e]] === undefined ) TOOLS[[e]] = 0;             // Add stat key if not yet init
                    TOOLS[[e]] += ITEM.efficency;
                    return;
                }
                if ( Object.keys(ITEM.stats).includes(e) ) {                    
                    STATS[[e]] += ITEM.stats[[e]];
                }
            });
        }
    });

    Object.keys(STATS).forEach( stat => {                                       // Step through each stat and apply tool and schematic values
        const TOOL_QUAL = ( TOOLS[[stat]] === undefined ) ? 0 : TOOLS[[stat]];  // Tool Quality
        const SHEM_QUAL = SCHEMATIC.efficency;                                  // Schematic Quality
        STATS[[stat]] = ((STATS[[stat]] + TOOL_QUAL ) 
                            * (TOOL_QUAL / 100) * (SHEM_QUAL / 100));           // Stat Calc
    });

    return STATS;                                                               // Spit out statty goodness
}

function leaveCrafting() {
    CRAFT_UI.classList.add("hide");    
    setGameMode("general");
    const FEAT = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    updateLog(
        `You leave the crafting quarter and step back
         onto the streets of ${FEAT.name} wondering 
         what your next move might be.`);
    updateIntructions();
}

function selectCraftingMenuActionItem( action ) {
    const SCHEMATIC = avatar.getItem(SELCT_ITM_ID());

    // Leave Crafting if LEAVE selected
    if ( action == "-1" ) { leaveCrafting(); return; }

    // Try to craft item if Craft selected
    const FORMS = CRAFT_LISTS.querySelectorAll("form");

    let valid = true;
    FORMS.forEach( form => {                                                    // Validate item can be crafted      
        const FORM_DATA = new FormData(form);
        const COUNT = FORM_DATA.getAll(form.dataset.title).length;
        const TOTAL = SCHEMATIC.craftData.materials[[form.dataset.title]];
        if ( COUNT < TOTAL ) valid = false;                                     // If there are too few materials invalidate
    });

    if ( !valid ) {
        updateLog(
            `You look at the parts of your fine craft
             but notice that something is still missing.`);
        return;
    }
    
    const DATA = SCHEMATIC.craftData;                                           // Get all the base item data
    const NAME = CRAFT_ITEM_TITLE.value;                                        // Set custom item name from input field
    const STATS = getCraftingItemStats();                                       // Get calculated stats
    const EFFICENCY = SCHEMATIC.efficency;                                      // Write code to calculate efficency                 
    const MATERIALS = {};                                                       // 
        
    FORMS.forEach( form => {                                                    // Remove selected materials (not tools!)
        const FORM_DATA = new FormData(form);
        for (const [KEY, VAL] of FORM_DATA) {
            if ( avatar.getItem(VAL).properties.some( e => e === "material") ) {// Ensure that only materials are being destroyed
                const MAT = avatar.getItem(VAL).name;                           // Get the material name
                if ( MATERIALS[[MAT]] === undefined ) MATERIALS[[MAT]] = 0;     // Setup mat as value if not already
                MATERIALS[[MAT]]++;
                avatar.removeFromInventory( VAL );                              // Destroy mat
            }
        }
    });

    avatar.addToInventory( 
        new Item( 
            DATA, 
            NAME, 
            undefined, 
            undefined, 
            MATERIALS, 
            undefined, 
            EFFICENCY, 
            STATS ) );                                                          // Add the crafted item to inventory

    enterCrafting();                                                            // Rerun Init to clear all forms
}

function updateIntructions( name ) {

    if ( getGameMode() === 1 ) {
        // Shop (to Buy)
        let item = ( SHOP_LIST.value == -1 ) ? "Leave shop" : `Buy ${SHOP_LIST.value}`
        INSTRUCTIONS.textContent = `(\u2B06\u2B07) Select Item : (E) ${item}`;
        return;
    } else if ( getGameMode() === 2 ) {
        // Shop (to Sell)
        let item = ( SHOP_LIST.value == -1 ) ? "Leave shop" : `Sell ${avatar.getItem(SHOP_LIST.value).name}`
        INSTRUCTIONS.textContent = `(\u2B06\u2B07) Select Item : (E) ${item}`;
        return;
    } else if ( getGameMode() === 4 ) {
        // Crafting
        let action = ACTION_STRINGS[ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value];
        INSTRUCTIONS.textContent = `(\u2B06\u2B07) Select Action : (E) ${action} ${name}`;
        return;        
    } else if ( name === "NONE" && ITEM_ACTIONS.options.length > 0 ) {
        let noun = ACTION_STRINGS[ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value];
        let verb = ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value;
        INSTRUCTIONS.textContent = `${INSTRUCTION_BASE} : (E) ${noun} ${verb}`;
    } else if ( name === "NONE" || name === undefined ) {
        INSTRUCTIONS.textContent = `${INSTRUCTION_BASE} `;
    } else {
        let action = ACTION_STRINGS[ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value];
        INSTRUCTIONS.textContent = `${INSTRUCTION_BASE} : (E) ${action} ${name}`;
    }
}

function enterShop( mode ) {
    const ITEM_LIST = SHOP_LIST.options.length;
    for (let i = 0; i < ITEM_LIST; i++) SHOP_LIST.options[0].remove();          // Clear current shop menu items
    SHOP_LIST.options[0] = new Option( `LEAVE SHOP`, -1 );                      // Set first option as shop exit

    const DATA = getLandscapeFeature( 
        avatar.location[0], avatar.location[1] );                               // Get source data from location

    updateLog(                                                                  // Print intro
        `You walk through the streets of ${DATA.name} 
        to see a shop that looks like it might have some 
        interesting wares.`);

    if ( mode === "buy" ) {
        setGameMode("shop_buy");                                                // Set interface/controls      
        DATA._market.forEach( e => {                                            // Populate shop
            SHOP_LIST.options[SHOP_LIST.length] = new Option( 
                `Buy ${e.name} (${e.price.toFixed(2)}g)`, e.name );
        } );
        SHOP_LIST.selectedIndex = 0;
    }

    if ( mode === "sell" ) {
        setGameMode("shop_sell");                                               // Set interface/controls
        avatar._inventory.forEach( e => {
            const PRICE = DATA.offerToBuyPrice( e );                            // Generate offer price
            SHOP_LIST.options[SHOP_LIST.length] = new Option( 
                `Sell ${e.name} for ${PRICE.toFixed(2)} gold`, e.id );
        } );
        SHOP_LIST.selectedIndex = 0;        
    }

    SHOP_UI.classList.remove("hide");    
    updateIntructions();
}

function leaveShop() {
    SHOP_UI.classList.add("hide");
    setGameMode("general");
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    updateLog(`You leave the shop and step back onto the streets of ${feature.name} wondering what your next move might be.`);
}

// Actions
function rollDice(sided) {
    let result = Math.floor(Math.random() * sided) + 1;
    updateLog(`You pull a bone die from your pouch and nimbly roll it. After a few bounces it settles on a ${result}`);
    return result;
}

function fish() {
    // check direction has water
    let terrain = getTerrainFromDirection(lastDirection);
    if ( terrain.type !== "water" ) {
        updateLog(`You excitedly pull out your ${avatar.getItem(SELCT_ITM_ID()).name} and prepare to cast, before realizing that you're lacking that key ingredient, a body of water to fish from.`);
        return;
    } else {
        let depth = terrain.value;      // Lower the bigger catch (more food) -1 > 0

        
        let efficency = avatar.getItem(SELCT_ITM_ID()).efficency;       // 13 > 100
        let luck = avatar.luck;                                             // 0 > 100
        let rng = Math.random() * 100;                                      // 0 > 100      
        let fishBase = 0.3;                                                 // 
        let minTarget = 50;                                                 // 50           min roll target
        let calcTarget = minTarget - luck - efficency;                      // -100 > 50    reduced by efficency and luck (can go negative)
        let fishCount = fishBase * Math.abs(depth);                         // Increase fish based on depth
        
        let fishedTotalCount = Math.max(Math.round( ( rng - calcTarget ) * fishCount), 1);

        if ( calcTarget < rng ) {
            updateLog(`You cast your ${avatar.getItem(SELCT_ITM_ID()).name} and wait watching the line drift in the water. After a few hours you manage to catch ${fishedTotalCount} fish.`);
            avatar.addFood(fishedTotalCount);
        } else {
            updateLog(`The gods don't seem to smile favorably upon you today. Despite your best efforts you fail to get a bite.`)
        }

        increaseGameTime(1);
        gameUpdate();
    }
}

function chopTree() {
    
    const TERRAIN = LAND.getTerrainType( avatar.loc.x, avatar.loc.y );
    if ( TERRAIN !== "forest" ) {
        updateLog(
            `You can swing all you like, but you need 
            to be in the forest to see the trees.`);
        return;
    }

    const ITEM_EFF = avatar.getItem(SELCT_ITM_ID()).efficency;              // 13 > 100     How efficient is the item at its job
    const RNG = Math.random() * 100;                                            // 0 > 100      
    const MIN_TARGET = 50;                                                      // 50           min roll target
    const MODIFIER = MIN_TARGET - ITEM_EFF - ((ITEM_EFF / 100) * avatar.luck);  // -100 > 50    reduced by efficency and luck (can go negative)
    const MOD_ROLL = Math.max( RNG - MODIFIER, 0 );                             // Random roll + modifier
    const RESULT_INCREMENT = 10;                                                // Every increment over min is +1 mat
    const RES = Math.floor(MOD_ROLL / RESULT_INCREMENT);

    if ( RES > 0 ) {
        const COUNT = 1;
        updateLog( 
            `After many swings of your 
            ${avatar.getItem(SELCT_ITM_ID()).name} 
            you successfully chop ${COUNT} wood.` );

        // Add wood to player inventory
        for (let i = 0; i < COUNT; i++) {
            const ITEM = createMaterialItem( "oak wood" )
            avatar.addToInventory( ITEM );           
        }
    } else {
        updateLog( 
            `You strike a tree with your
            ${avatar.getItem(SELCT_ITM_ID()).name} 
            but fail to fell it.` );
    }

    increaseGameTime(1);
    lastDirection = null;
    gameUpdate();
}

// TEST CODE FOR LANTERN WON'T REALLY WORK
function toggle_item_function() {
    if ( getGameMode() !== 6 ) return;
    const ITEM = avatar.getItem(SELCT_ITM_ID());
    if ( ITEM.type.includes("light") ) {
        ITEM.type.pop();
        updateLog("Turned off lantern");
    } else {
        ITEM.type.push("light");
        updateLog("Turned on lantern");
    }
    GetGameLocation().DGN.render()
    GetGameLocation().DGN.drawAvatar();
    increaseGameTime(1);
    gameUpdate();
}

function dropItem( item ) {
    item = (item === undefined) ? avatar.getItem(SELCT_ITM_ID()) : item;
    if (item === undefined){console.log("BAD ITEM CANNOT DROP");return};
    if (getGameMode()!==6){updateLog(`Cannot drop ${item.name} here.`);return};   
    GetGameLocation().addItem( item );                                          // Add item to scenario inventory
    avatar.removeFromInventory( item.id );                                      // Remove item from player
    selectItem();                                                               // Select NONE item
}

function buy( item ) {
    // If selected LEAVE then leave the shop (Note -1 is a string)
    if ( item == -1 ) {
        leaveShop();
        return;
    }

    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    let tobuy = feature._market.find( e => e.name === item );

    if ( avatar.gold < tobuy.price ) {
        updateLog(`You realise that you don't have the gold to buy the ${item}. You try to haggle but the shopkeeper has none of it and scorns you for wasting time.`);
    } else {        
        // Remove the item from the shop UI
        SHOP_LIST.options[SHOP_LIST.selectedIndex].remove();
        SHOP_LIST.selectedIndex = 0
        
        // Remove the item from the market list
        // TODO: I think there's a bug around here where the wrong item is being removed from the town market supply 
        // TEST by buying all items and seeing error when getting last one which will list wrong item
        let index = feature._market.findIndex( e => e.name === item );
        feature._market.splice( index, 1 );
        
        // Take the money from the avatar
        avatar.removeGold( tobuy.price );

        // Get the item data

        // let data = ITEM_DATA[[`${tobuy.id}`]];
        let data = tobuy.item;

        // Add it to the avatar inventory
        avatar.addToInventory( data );
        gameUpdate();
    }
}
// Player Sell
function sell( id ) {
    // If selected LEAVE then leave the shop (Note -1 is a string)
    if ( id == -1 ) {
        leaveShop();
        return;
    }

    // Get the item name
    let item = avatar.getItem( id );

    // Get the item price
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    let price = feature.offerToBuyPrice( item );
    
    // Remove the item from the player's inventory (and inventory UI)
    avatar.removeFromInventory( SHOP_LIST.value );
    // Remove the item from the market list
    const index = SHOP_LIST.selectedIndex
    SHOP_LIST.options[SHOP_LIST.selectedIndex].remove();
    
    // Add Item to shop market
    // use a town function so price can be set properly 
    feature.addItemToMarket( item, price + (price * 0.1) );

    // Give the player the gold
    avatar.addGold( price );
    
    SHOP_LIST.selectedIndex = index - 1;
    gameUpdate();
}

function attack() {
    updateLog( `You nimbly swipe your ${avatar.getItem(INV_SEL.value).name} in an aggressive fashion. Shame there's no one around to witness your warrior prowess.` );
}

function defend() {
    updateLog( `Holding your ${avatar.getItem(INV_SEL.value).name} up high, you stand your ground against the imagined attackers who vanish from your mind before they can strike.` );
}

function throwItem() {
    let distance = Math.round(Math.random() * 10);
    updateLog( `You swing your arm in a great arc launching the ${avatar.getItem(INV_SEL.value).name} into the air. It lands ${distance} feet in front of you. You pause and wonder what use that was before picking it back up and dusting the mud from it.` );
}

function surveyTile( name, x, y ) {
    if ( avatar.isDead ) return;
    let result = MAT.getResourceValueAtLocation( name, x, y );
    if ( result === 0 ) {
        updateLog( `Your survey finds no source of ${name} nearby` );
    } else {
        updateLog( `Your survey finds a source of ${name}` );
    }

    // drawMaterial( x, y );
    MAT.drawResource( name, x, y );

    increaseGameTime(1);

    lastDirection = null;
    gameUpdate();
}

function scanLandForMaterial( x, y, tool ) {
    const RES = LAND.getClosestMatTo( x, y, tool.properties[0] );
    const LOC = LAND.convertCoordinates( x, y );
    if ( RES === -1 ) {
        updateLog( 
            `You hold out your ${tool.name} but it falls 
            limp, indicating no ${tool.properties[0]} 
            anywhere close` );            
    } else if ( RES.x === LOC.x && RES.y === LOC.y ) {
        updateLog( 
            `You hold out your ${tool.name} and it pulls 
            straight down to the earth below your feet` ); 
    } else {
        const DIST = Math.distance( LOC.x, LOC.y, RES.x, RES.y );
        if ( DIST > ( tool.efficency / 10 ) ) {                                 // 10% Item efficency used for max distance
            updateLog( 
                `You hold out your ${tool.name} but it falls 
                limp, indicating no ${tool.properties[0]} 
                anywhere close` );
            return;
        } 
        const DEG = Math.direction( LOC.x, LOC.y, RES.x, RES.y );
        const DIR = degAsText( DEG );
        const DIS_TEXT = strengthAsText(DIST, 1 );
        updateLog( 
            `You hold out your ${tool.name} and you feel 
            a ${DIS_TEXT} vibration towards the ${DIR}.` );    
    }
}

function mineTile( name, x, y ) {
    if ( avatar.isDead ) return;
    const POS = avatar.loc;;
    const TYP = avatar.getItem(INV_SEL[INV_SEL.selectedIndex].value)
                                                        .properties[0];         // Get item resource material type
    // What type of material is being mined 
    // Current setup supports metal
    const MATS = Object.keys(DATA.material.solid[`${TYP}`]);

    let supply = 0;
    let type = "";
    MATS.forEach( mat => {                                                      // Step through each valid material and see if the location has any
        let value = MAT.getResourceValueAtLocation( mat, POS.x, POS.y ); 
        if ( value > 0 ) {
            supply = value;
            type = mat;
            return;
        }
    });

    // If no materials found at all then let the player know to give up trying
    if ( supply <= 0 ) {
        // Name is the type of material (from the tool) being mined
        updateLog( 
            `Your efforts to mine reveal that this 
            area is barren of any ${TYP}.` );
        increaseGameTime(1);
        lastDirection = null;
        gameUpdate();
        return;
    } 
   
    const ITEM_EFF = avatar.getItem(SELCT_ITM_ID()).efficency;                  // 13 > 100     How efficient is the item at its job
    const RNG = Math.random() * 100;                                            // 0 > 100      
    const MIN_TARGET = 50;                                                      // 50           min roll target
    const MODIFIER = MIN_TARGET - ITEM_EFF - ((ITEM_EFF / 100) * avatar.luck);  // -100 > 50    reduced by efficency and luck (can go negative)
    const MOD_ROLL = Math.max( RNG - MODIFIER, 0 );                             // Random roll + modifier
    const RESULT_INCREMENT = 10;                                                // Every increment over min is +1 mat
    const RES = Math.floor(MOD_ROLL / RESULT_INCREMENT);

    if ( RES > 0 ) {
        const COUNT = MAT.removeResourceSupply( 
            type, avatar.location[0], 
            avatar.location[1], RES );

        updateLog( 
            `After many swings of your 
            ${avatar.getItem(SELCT_ITM_ID()).name} 
            you successfully mine ${COUNT} ${type} ore.` );

        // Add ore to player inventory
        for (let i = 0; i < COUNT; i++) {
            const ITEM = createMaterialItem( type );
            avatar.addToInventory( ITEM );           
        }
    } else {
        updateLog( 
            `You feel the ${type} beneath you, but the swings of your
            ${avatar.getItem(SELCT_ITM_ID()).name} 
            fails to extract any.` );
    }

    increaseGameTime(1);
    lastDirection = null;
    gameUpdate();
}

function gamble() {
    if ( avatar.gold <= 0 ) {
        updateLog( 
            `You enter the tavern feeling lucky, 
            but soon realize that you're out of money 
            and slip back out hoping no one noticed.` );
    } else {
        let result = Math.random() + (avatar.luck / 100);
        avatar.removeGold(1);
        if ( result >= 0.75 ) {
            avatar.addGold(5);
            updateLog( 
                `You enter the tavern and slap down a 
                gold piece on the dice table. Thank the 
                gods your numbers come up adding ${5} 
                gold in your pouch.` );
        } else {
            updateLog( 
                `You enter the taven and place your gold 
                piece on the dice table. The dice roll and 
                you feel a dark cloud cast over you. Your 
                numbers don't come up, leaving your pouch 
                a little lighter.` );
        }                
    }
    gameUpdate();
}

function pray() {
    if ( avatar.gold <= 0 ) {
        updateLog( 
            `You enter the holy site and find a quiet spot 
            to pray to your god.` );
    } else {
        let result = Math.random();
        avatar.removeGold(1);
        updateLog( 
            `You enter the holy site and place a gold coin 
            as an offering hoping that your god will bring 
            you luck` );
        if ( result >= 0.75 ) {
            avatar.luck = 1;
        }
    }
    gameUpdate();
}

function playInstrument( instrument ) {
    updateLog( 
        `You take a breath and begin to play an old song 
        on the ${instrument} filling the air with sweet 
        emotion.` );
}

function moveCharacter( direction ) {
    if ( avatar.isDead ) return;
    const LOOK_DIR = [...avatar.location];    
    // Check to see if there's a landscape feature
    if ( direction % 2 === 0 ) {
        LOOK_DIR[1] += (direction === 0) ? -1 : 1;
    } else {
        LOOK_DIR[0] += (direction === 1) ? 1 : -1;
    }
    const FEAT = getLandscapeFeature(LOOK_DIR[0],LOOK_DIR[1]); 
    const TERRAIN = LAND.getTerrainByPosition(LOOK_DIR[0],LOOK_DIR[1]);
    const moveDir = (chk = true) => {
        if (chk && !avatar.hasTerrain(TERRAIN.type)) {
            updateLog(`You cannot traverse ${TERRAIN.name} terrain`);
            return;
        }
        if ( direction % 2 === 0 ) {
            avatar.location[1] += (direction === 0) ? -1 : 1;
        } else {
            avatar.location[0] += (direction === 1) ? 1 : -1;
        }
        // Calculate travel time
        increaseGameTime(TERRAIN.difficulty);
        avatar.eatFood();
        checkedTile = false;
        updateIntructions();
        setLandscapeFeatureActions();
        setLandscapeFeatureDescription(avatar.loc.x,avatar.loc.y);
        gameUpdate();
    }

    if ( FEAT !== undefined ) {
        const TYPE = (Array.isArray(FEAT.type)) ? FEAT.type[0] : FEAT.type;     // Get Feature type
        switch ( TYPE ) {
            case "town":
                updateLog( 
                    `You stroll into the town of ${FEAT.name}. 
                    Its streets and people show that this is a 
                    ${FEAT.economicStatus} place.` );
                moveDir(false);
                break;
            case "cave":
                updateLog(`You step upto the dark ${FEAT.type} entrance.`);  
                moveDir(false);
                break;
            default:
                if ( INV_SEL.value === "none" ) setLandscapeFeatureActions();
                updateLog( 
                    `You travel ${DIRECTION[direction]} 
                    into ${TERRAIN.name}` );
                moveDir(true);
                break;
        }
    } else {
        if ( INV_SEL.value === "none" ) 
        setLandscapeFeatureActions();
        updateLog( 
            `You travel ${DIRECTION[direction]} 
            into ${TERRAIN.name}` );
        moveDir(true);
    }
}

function setLandscapeFeatureDescription(x,y) {
    const FEAT = getLandscapeFeature(x,y); 
    const TERRAIN = LAND.getTerrainByPosition(x,y);
    if ( FEAT !== undefined ) {
        setDescription(FEAT);
    } else {
        setDescription({description:
                        `${TERRAIN.name} spread out all around you.`});
    }
}

function setLandscapeFeatureActions(feat) {
    if (feat===undefined)feat = getLandscapeFeature(avatar.loc.x,avatar.loc.y);
    // Escape from no features (there should't be none, but for now there is)
    if (feat===undefined) {
        // clear current actions
        let items = ITEM_ACTIONS.options.length;
        for (let i = 0; i < items; i++) {
            ITEM_ACTIONS.options[0].removeEventListener("click", () => useItem( INV_SEL.value ), false );
            ITEM_ACTIONS.options[0].remove();
        }
        ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option("Enter","Enter");// Add Enter as default (Might be a bad idea)
        ITEM_ACTIONS.options.selectedIndex = 0;
        return;
    }

    let items = ITEM_ACTIONS.options.length;                                    // clear current actions
    for (let i = 0; i < items; i++) {
        ITEM_ACTIONS.options[0].removeEventListener("click", () =>
                                 useItem( INV_SEL.value ), false );
        ITEM_ACTIONS.options[0].remove();
    }

    switch (feat.type) {
        case "town":            
            INV_SEL.options.selectedIndex = 0;                                  // Select first inventory option (unequip items and reveal town actions)           
            // Add Town actions
            feat.actions.forEach( e => {
                ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( e, e );    
                ITEM_ACTIONS.options[ITEM_ACTIONS.length - 1]
                            .addEventListener("click", () => 
                                useItem( INV_SEL.value ), false );
            });
            ITEM_ACTIONS.options.selectedIndex = 0;
            updateIntructions(ITEM_ACTIONS.value);
            break;
        case "cave":
            switch (getGameMode()) {
                case 0:
                    INV_SEL.options.selectedIndex = 0;
                    // Add Town actions
                    feat.actions.forEach( e => {
                        ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( e, e );    
                        ITEM_ACTIONS.options[ITEM_ACTIONS.length - 1]
                                    .addEventListener("click", () => 
                                        useItem( INV_SEL.value ), false );
                    });
                    ITEM_ACTIONS.options.selectedIndex = 0;
                    updateIntructions(ITEM_ACTIONS.value);                    
                    break;                
                default:
                    break;
            }
        default:
            break;
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
    const FEAT = getLandscapeFeature( lookDirection[0], lookDirection[1] );
    if ( FEAT !== undefined ) {
        const TYPE = (Array.isArray(FEAT.type)) ? FEAT.type[0] : FEAT.type;     // Get Feature type
        
        switch ( TYPE ) {
            case "town":
                updateLog( 
                    `You can see the ${FEAT.type} of 
                    ${FEAT.name} to the 
                    ${DIRECTION[direction]}` );    
                break;
            case "cave":
                updateLog( 
                    `You can see a ${FEAT.type} to the 
                    ${DIRECTION[direction]}` );  
                break;
            default:
                const TERRAIN = LAND.getTerrainByPosition( 
                                lookDirection[0], lookDirection[1] );
                updateLog( 
                    `You can see a path ${DIRECTION[direction]}
                     into ${TERRAIN.name}` );
                break;
        }

    } else {
        const TERRAIN = LAND.getTerrainByPosition( 
                    lookDirection[0], lookDirection[1] );
        updateLog( 
        `You can see a path ${DIRECTION[direction]}
        into ${TERRAIN.name}` );
    }

    checkedTile = true;
    gameUpdate();
}

function getTerrainFromDirection( direction ) {
    let lookDirection = [...avatar.location];
    if ( direction % 2 === 0 ) {
        lookDirection[1] += (direction === 0) ? -1 : 1;
    } else {
        lookDirection[0] += (direction === 1) ? 1 : -1;
    }

    // Check to see if there's a landscape feature
    let type = LAND.getTerrainByPosition( lookDirection[0], lookDirection[1] );
    return type;
}

function getLandscapeFeature( x, y ) {
    let f = LAND._TOWNS.find(e=>x===e.loc.x&&y===e.loc.y);                      // Check for a town
    if (f===undefined) f = LAND.getScenario(x,y); // Check for Game Scenarios
    // NEXT
    if (f === undefined) {
        MAT._resources.forEach( e => {
            if ( MAT.getResourceValueAtLocation( e.name, x, y ) > 0 ) {
                f = e;
                return f;
            }
        })
    }
    return f;                                                                   // Return found feature
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

function refreshEquipmentListUI() {
    // Get current length
    let count = INV_SEL.length - 1;
    for (let index = 0; index < count; index++) {
        // Remove 2nd entry (first is NONE)
        INV_SEL[1].remove();        
    }
    // Repopulate with avatar inventory 
    avatar._inventory.forEach( e => {
        INV_SEL.options[INV_SEL.length] = new Option( e.name, e.id );
    });
}

function setDescription( el ) {
    if ( el === undefined ) { ITEM_DESC.textContent = ""; return }              // Clear description if no item given
    ITEM_DESC.textContent = el.description;    
}

function gameUpdate() {
    if ( avatar.isDead ) return;
    switch (getGameMode()) {
        case 6:
            // Update consumable items in use
            const ITMS = avatar.getItemsByType( "light" );
            if (ITMS.length===0) break;
            const FLTR = ITMS.filter( e => e.stats.fuel > 0 );
            if (FLTR.length===0) break;
            FLTR.sort( (a,b) => a.stats.range <= b.stats.range );
            avatar.getItem(FLTR[0].id).incrementStat( "fuel", -1 );
            break;
        default:
            const FEAT = getLandscapeFeature(avatar.loc.x,avatar.loc.y); 
            if (FEAT) {
                if ( FEAT.type === "town" ) {
                    avatar.addFood(avatar._MAX_FOOD);
                } else {
                    
                }
            }           
            if ( Math.round(gameTime % 10) === 0 ) {
                LAND._TOWNS.forEach ( e => e.generateMarket() );                // Refresh Town Markets every ~10 days
            }
            LAND.draw(avatar.location[0], avatar.location[1], avatar.sight);
            drawAvatar();           
            // selectItem(SELCT_ITM_ID());
            selectItem();
            break;
        }
        
    UI_GAME_TIME.textContent = Math.round(gameTime);                            // update game time        
    UI_FOOD.textContent = avatar.food;                                          // update food 
    UI_GOLD.forEach( el => el.textContent = avatar.gold );                      // update gold          
    UI_WEIGHT.textContent = avatar.weight;                                      // update weight
    updateItemDetailsUI();
}

function updateItemDetailsUI() {
    const ITEM = avatar.getItem(SELCT_ITM_ID());
    // Clear List
    let count = UI_DETAILS.childElementCount;
    for (let index = 0; index < count; index++) {
        UI_DETAILS.removeChild(UI_DETAILS.lastElementChild);       
    }
    if ( ITEM === undefined ) return;
    UI_DETAILS.appendChild(
        GenerateItemDetailRow( 'Efficency', ITEM.efficency ));
    Object.keys(ITEM.stats).forEach( e => { 
        UI_DETAILS.appendChild(GenerateItemDetailRow(e, ITEM.stats[[e]]));
    } );
}

function getItemDataFromName( name ) {
    return Object.values(DATA.items).find( e => e.name === name );
}

// Init
function init() {
    gameTime = 1;
    GAME_LOG_UI.replaceChildren();
    updateIntructions();
    
    LAND.clear();
    MAT.clear();
    
    MAT._resources.forEach( e => e.generateMap( true ) );

    // drawLandscape();
    LAND.genTowns();
    LAND.genScenarios();
    
    let startTown = LAND._TOWNS[Math.floor(Math.random()*LAND._TOWNS.length)];
    
    avatar = new Avatar();

    avatar._MAX_FOOD = 100;
    avatar.addFood(100);
    // avatar.addGold(10000);

    refreshEquipmentListUI();
    
    // Reset UI
    SHOP_UI.classList.add("hide");
    CRAFT_UI.classList.add("hide");

    // console.log( startTown );
    avatar.location = [LAND._SCENARIOS[0].loc.x, LAND._SCENARIOS[0].loc.y];
    // avatar.location = [startTown.location.x, startTown.location.y];
    
    // Default terrain
    avatar.addValidTerrain("soil");
    
    // Default items
    // avatar.addToInventory( new Item( DATA.items.torch_wood ) );
    // avatar.addToInventory( new Item( DATA.items.lantern ) );
    // avatar.addToInventory( new Item( DATA.items.torch_wood ) );
    avatar.addToInventory(new Item(DATA.items.dowsing_twig));
    avatar.addToInventory(new Item(DATA.items.wood_axe, undefined, undefined, undefined, undefined, undefined, 150));
    avatar.addToInventory(new Item(DATA.items.pickaxe, undefined, undefined, undefined, undefined, undefined, 10));

    INV_SEL.selectedIndex = 0; 
    // selectItem(INV_SEL.value);
    selectItem(true);
    
    avatar.addGold(10);

    updateLog( 
        `The adventures of ${avatar.name} begin in the 
        ${startTown.economicStatus} town of ${startTown.name}`);
    gameUpdate();
    
    LAND.draw(avatar.location[0], avatar.location[1], avatar.sight);
    drawAvatar();

    // MAT._resources[0].generateMap();
    // MAT._resources[0].drawMap();
    // LAND.drawAll();
}

init();


