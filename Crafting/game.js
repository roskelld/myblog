'use strict';

// Controls
const MOVE_NORTH = "w";
const MOVE_EAST = "d";
const MOVE_SOUTH = "s";
const MOVE_WEST = "a";
const USE = "e";
const ACCEPT = "Enter";
const RESTART = "Escape";
const INV_DOWN = "ArrowDown";
const INV_UP = "ArrowUp";
const ACT_DOWN = "f";
const ACT_UP = "r";
const BACK = "q";

const NAV = { North: 0, East: 1, South: 2, West: 3 };
const DIRECTION = { 0: "north", 1: "east", 2: "south", 3: "west" };

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

// Prevent arrow keys from scrolling windows 
window.addEventListener("keydown", e => { 
    if (e.key === INV_DOWN || e.key === INV_UP ) e.preventDefault(); }, false );

const INSTRUCTION_BASE = "(WASD) Move ";

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

const UI_DETAILS = document.querySelector("#details");
const UI_DETAILS_BOX = document.querySelector("#details-box");


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
    selectCraftinActionItem(CRAFT_ACTION_LIST.value); 
}, false );
CRAFT_ACTION_LIST.addEventListener("focus", e => { 
    CRAFT_ACTION_LIST.blur(); 
}, false );

// Setup Land
const LAND = new Land( document.getElementById("landscape"));

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

// Set Material

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

// Game Time
let gameTime = 1;

let avatar;

const SELECTED_ITEM_ID = () => INV_SEL.options[INV_SEL.selectedIndex].value;

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
                    // if ( INV_SEL.selectedIndex === 0 || INV_SEL.selectedIndex === -1 ) return;
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
                    selectItem( INV_SEL.value );
                    return;
                case INV_DOWN:
                    if ( INV_SEL.selectedIndex === INV_SEL.length - 1 ) {
                        INV_SEL.selectedIndex = 0;
                    } else {
                        INV_SEL.selectedIndex++;
                    }
                    selectItem( INV_SEL.value );
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
                case ACT_UP:
                case INV_UP:
                    if ( SHOP_LIST.selectedIndex === 0 || SHOP_LIST.selectedIndex === -1 ) {
                        SHOP_LIST.selectedIndex = SHOP_LIST.length - 1;
                    } else {
                        SHOP_LIST.selectedIndex--;
                    }
                    selectShopItem();
                break;
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
                    selectCraftinActionItem( CRAFT_ACTION_LIST.value );
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
        let price = feature._market[SHOP_LIST.selectedIndex-1].price;
        updateLog(
            `You pick up a ${SHOP_LIST.value} from a 
            shelf and the shop keeper looks up and 
            shouts "${price} gold, you'll not find a 
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

function selectItem( name ) {
    
    // Show all actions
    // Get Item
    let item = avatar.getItem( INV_SEL.value );
    
    // clear current actions
    let items = ITEM_ACTIONS.options.length;
    for (let i = 0; i < items; i++) {
        ITEM_ACTIONS.options[0].removeEventListener("click", () => useItem( INV_SEL.value ), false );
        ITEM_ACTIONS.options[0].remove();
    }
    
    // Clear List
    let count = UI_DETAILS.childElementCount;
    for (let index = 0; index < count; index++) {
        UI_DETAILS.removeChild(UI_DETAILS.lastElementChild);       
    }

    // No item equipped
    // This could be used for character actions such as camp, pray, hunt    
    if ( !item ) {
        setLandscapeFeatureActions();
        return;
    }
    
    if ( !item.use ) {
        updateIntructions();
        return;
    }

    // Add Actions
    item.use.forEach( e => {
        ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( e, e );  
        ITEM_ACTIONS.options[ITEM_ACTIONS.length - 1].addEventListener("click", () => useItem( INV_SEL.value ), false );
    });
    
    // Select first option;
    ITEM_ACTIONS.options[0].selected = true;

    // Add Details
    UI_DETAILS.appendChild(GenerateItemDetailRow( 'Efficency', item.efficency ));
    Object.keys(item.stats).forEach( e => { 
        UI_DETAILS.appendChild(GenerateItemDetailRow(e, item.stats[[e]]));
    } );

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
    // there's no "EVENT" happening or "FEATURE"
    let action = ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value;

    switch (action) {
        case "Mine":
            mineTile( avatar.getItem(INV_SEL[INV_SEL.selectedIndex].value).properties[0], avatar.loc.x, avatar.loc.y );
            break;
        case "Survey":
            // surveyTile( avatar.getItem(INV_SEL[INV_SEL.selectedIndex].value).properties[0], avatar.location[0], avatar.location[1] );
            scanLandForMaterial( 
                avatar.loc.x, 
                avatar.loc.y, 
                avatar.getItem(INV_SEL[INV_SEL.selectedIndex].value) );
            break;
        case "Look":
            updateLog(`You inspect the ${item.name}, it feels nice in the hand.`);
            break;
        case "Gamble":
            gamble();
            break;
        case "Pray":
            pray();
            break;
        case "Attack":
            attack();            
            break;  
        case "Defend":
            defend();            
            break;  
        case "Throw":
            throwItem();            
            break;    
        case "Buy":
            enterShop("buy");
            break;          
        case "Sell":
            enterShop("sell");
            break;
        case "Roll Dice":
            rollDice(6);
            break;
        case "Play Song":
            playInstrument( item.name );
            break;
        case "Craft":
            enterCrafting();
            break;               
        case "Fish":
            fish();
            break;               
        default:
            break;
    }
    
}

// ----------------------------------------------------------------------------
// Crafting
function enterCrafting() {

    CRAFT_UI.classList.remove("hide");
    // Default select Craft as the Action
    CRAFT_ACTION_LIST.selectedIndex = 1;
    setGameMode("crafting");  
    // Populate recipe
    let item = avatar.getItem( INV_SEL.value );

    // Update Instructions
    updateIntructions(item.name);

    // Set name
    CRAFT_NAME.textContent = item.name;
    
    // Create a map of entries to get mat counts
    crafting_recipe = item._properties.reduce((a, c) => a.set(c, (a.get(c) || 0) + 1), new Map()); 
    
    // Generate and add recipe text
    let message = "";
    crafting_recipe.forEach( (count, title) => { message += `${title} * ${count}, ` } );
    CRAFT_RECIPE.textContent = message.substr(0, message.length - 2);
   
    // Clear List
    let count = CRAFT_LISTS.childElementCount;
    for (let index = 0; index < count; index++) CRAFT_LISTS.removeChild(CRAFT_LISTS.lastElementChild);

    count = CRAFT_DETAILS.childElementCount;
    for (let index = 0; index < count; index++) CRAFT_DETAILS.removeChild(CRAFT_DETAILS.lastElementChild);
    

    let crafting = avatar._inventory.filter( e => ( e._properties.includes("crafting") ) );

    // Populate the build list
    crafting_recipe.forEach( (count, title) => { 
        
        let list = crafting.filter( e => ( e._properties.includes(title) ) );

        // console.log(list);

        // Create Form 
        let form = document.createElement("form");

        form.dataset.title = title;

        // Create title
        let header = document.createElement("h3");
        header.textContent = `${title} * 0`;

        // Container
        let container = document.createElement("div");
        container.classList.add("selection-list");

        // Items List
        list.forEach( e => {
            let label = document.createElement("label");
            label.htmlFor = title;
    
            let input = document.createElement("input");
            input.type = ( title === "tool" ) ? "radio" : "checkbox";
            input.for = e.id;
            input.value = e.id;
            input.name = title;  
            input.id = e.id;    
    
            let name = document.createElement("p");
            name.textContent = e.name;
    
            label.appendChild(input);
            label.appendChild(name);
            container.appendChild(label);

            name.addEventListener("click", () => input.click(), false );
            input.addEventListener("change", () => updateCraftingNumbers( form, header, title, count ), false );
        });
        
        // Add to DOM
        form.appendChild(header);
        form.appendChild(container);
        CRAFT_LISTS.appendChild(form);
    
        let itemTitle = INV_SEL.options[INV_SEL.selectedIndex].text.split("(")[0];
        itemTitle = itemTitle.substr(0, itemTitle.length -1 );
        CRAFT_ITEM_TITLE.value = itemTitle;
    } );
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
        value.textContent = `${stats[[e]]}`;

        row.appendChild(title);
        row.appendChild(value);

        CRAFT_DETAILS.appendChild(row);
    } );
}

function getCraftingItemStats() {
    // -----------------------------------------------------    
    // Calculate Potential Crafted Item Values

    // Get Base Item Data 
    let itemTitle = INV_SEL.options[INV_SEL.selectedIndex].text.split("(")[0];
    itemTitle = itemTitle.substr(0, itemTitle.length -1 );
    let item = getItemDataFromName( itemTitle );

    // Get Schematic 
    let schematic = avatar.getItem(SELECTED_ITEM_ID());

    // Track all relevent stats
    let stats = {};

    // Step through each form (tool/mat category)
    let forms = CRAFT_LISTS.querySelectorAll("form");
    forms.forEach( form => {        
        let data = new FormData(form);

        // Step out if no mats/tools on form have been selected
        if ( data.getAll(form.dataset.title).length === 0 ) return;      
        
        // Step through each selected object
        for (const [key, value] of data) {
            let mat = avatar.getItem( value );
            
            // Efficency of item (maybe should just be used for tool)
            let efficency = mat.efficency;

            // Step through each stat on the item being crafted
            // to see if it matches one on the mat or tool
            Object.keys(item.stats).forEach( e => {
                if ( Object.keys(mat.stats).includes(e) ) {
                    // Add stat key if not yet init
                    if ( stats[[e]] === undefined ) stats[[e]] = 0;

                    // Here's the garbage crafting formula 
                    // TODO: Make this gooder
                    // Use the tool efficency 
                    // Use the schematic efficency
                    // Don't just add the fucking numbers together
                    // Incorporate the bonus as a, erm, bonus
                    // Present as a range so that there's some vagueness
                    stats[[e]] += mat.stats[[e]];
                }
            });
        }

        // Some numbers for the formula
        // Total number of mat needed, can be used against selected 
        let total = crafting_recipe.get(form.dataset.title);

        // Selected number of mats 
        data.getAll(form.dataset.title).length;
    });

    return stats;

}

function leaveCrafting() {
    
    CRAFT_UI.classList.add("hide");    
    setGameMode("general");
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    updateLog(`You leave the crafting quarter and step back onto the streets of ${feature.name} wondering what your next move might be.`);
    updateIntructions();
}

function selectCraftinActionItem( action ) {
    console.log(`ACtion ${action}`);
    // Leave Crafting if LEAVE selected
    if ( action == "-1" ) { leaveCrafting(); return; }

    // Try to craft item if Craft selected
    let forms = CRAFT_LISTS.querySelectorAll("form");

    // Validate item can be crafted
    let valid = true;
    forms.forEach( form => {        
        let data = new FormData(form);

        let count = data.getAll(form.dataset.title).length;
        let total = crafting_recipe.get(form.dataset.title);

        if ( count < total ) valid = false;         
    });

    if ( !valid ) {
        updateLog(`You look at the parts of your fine craft but notice that something is still missing.`);
        return;
    }

    // Calculate the crafted item stats
    let stats = getCraftingItemStats();

    // Remove selected materials (not tools!)
    forms.forEach( form => {
        let data = new FormData(form);

        for (const [key, value] of data) {
            // console.log( `${key} : ${value} ` )
            if ( avatar.getItem( value)._properties.some( e => e === "material" ) ) {
                avatar.removeFromInventory( value );
            }
        }
    });
    
    // Add item to inventory 
    let itemTitle = INV_SEL.options[INV_SEL.selectedIndex].text.split("(")[0];
    itemTitle = itemTitle.substr(0, itemTitle.length -1 );

    let item = getItemDataFromName( itemTitle );

    avatar.addToInventory( new Item( CRAFT_ITEM_TITLE.value, item.weight, item.properties, item.materials, item.use, item.efficency, stats ) );

    // Rerun Init to clear all forms
    enterCrafting();
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
        updateLog(`You excitedly pull out your ${avatar.getItem(SELECTED_ITEM_ID()).name} and prepare to cast, before realizing that you're lacking that key ingredient, a body of water to fish from.`);
        return;
    } else {
        let depth = terrain.value;      // Lower the bigger catch (more food) -1 > 0

        
        let efficency = avatar.getItem(SELECTED_ITEM_ID()).efficency;       // 13 > 100
        let luck = avatar.luck;                                             // 0 > 100
        let rng = Math.random() * 100;                                      // 0 > 100      
        let fishBase = 0.3;                                                 // 
        let minTarget = 50;                                                 // 50           min roll target
        let calcTarget = minTarget - luck - efficency;                      // -100 > 50    reduced by efficency and luck (can go negative)
        let fishCount = fishBase * Math.abs(depth);                         // Increase fish based on depth
        
        let fishedTotalCount = Math.max(Math.round( ( rng - calcTarget ) * fishCount), 1);

        if ( calcTarget < rng ) {
            updateLog(`You cast your ${avatar.getItem(SELECTED_ITEM_ID()).name} and wait watching the line drift in the water. After a few hours you manage to catch ${fishedTotalCount} fish.`);
            avatar.addFood(fishedTotalCount);
        } else {
            updateLog(`The gods don't seem to smile favoribly upon you today. Despite your best efforts you fail to get a bite.`)
        }

        increaseGameTime(1);
        gameUpdate();
    }
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
    SHOP_LIST.options[SHOP_LIST.selectedIndex].remove();
    
    // Add Item to shop market
    // use a town function so price can be set properly 
    feature.addItemToMarket( item, price + (price * 0.1) );

    // Give the player the gold
    avatar.addGold( price );
    
    SHOP_LIST.selectedIndex = 0
    gameUpdate();
}

function attack() {
    updateLog( `Your nimbly swipe your ${avatar.getItem(INV_SEL.value).name} in an aggressive fashion. Shame there's no one around to witness your warrior prowess.` );
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
        console.log( DIST );
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

    // What type of material is being mined 
    // Current setup supports metal
    const MATS = Object.keys(DATA.material.solid[`${name}`]);

    let supply = 0;
    let type = "";
    // Step through each valid material and see if the land has any
    MATS.forEach( mat => {
        let value = MAT.getResourceValueAtLocation( mat, x, y ); 
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
            area is barren of any ${name}.` );

        increaseGameTime(1);
        lastDirection = null;
        gameUpdate();
        return;
    } 
   
    const ITEM_EFF = avatar.getItem(SELECTED_ITEM_ID()).efficency;              // 13 > 100     How efficient is the item at its job
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
            ${avatar.getItem(SELECTED_ITEM_ID()).name} 
            you successfully mine ${COUNT} ${type} ore.` );

        // Add ore to player inventory
        for (let i = 0; i < COUNT; i++) {
            const ITEM = getItemDataFromName( type );
            avatar.addToInventory( 
                new Item( 
                    ITEM.name, 
                    ITEM.weight, 
                    ITEM.properties, 
                    ITEM.materials, 
                    ITEM.use, 
                    ITEM.efficency, 
                    ITEM.stats ) );           
        }
    } else {
        updateLog( 
            `You feel the ${type} beneath you, but the swings of your
            ${avatar.getItem(SELECTED_ITEM_ID()).name} 
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
            updateLog( 
                `You enter the tavern and slap down a 
                gold piece on the dice table. Thank the 
                gods your numbers come up adding a nice 
                weight of gold in your pouch.` );
            avatar.addGold(5);
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
    
    let lookDirection = [...avatar.location];
    if ( direction % 2 === 0 ) {
        lookDirection[1] += (direction === 0) ? -1 : 1;
    } else {
        lookDirection[0] += (direction === 1) ? 1 : -1;
    }

    let terrain = LAND.getTerrainByPosition( lookDirection[0], lookDirection[1] );
    // Check move is valid   
    if ( avatar.hasTerrain( terrain.type ) ) {

        if ( direction % 2 === 0 ) {
            avatar.location[1] += (direction === 0) ? -1 : 1;
        } else {
            avatar.location[0] += (direction === 1) ? 1 : -1;
        }
        // Check to see if there's a landscape feature
        const FEATURE = getLandscapeFeature( direction[0], direction[1] );

        if ( FEATURE !== undefined ) {
            const TYPE = (Array.isArray(FEATURE.type)) ? FEATURE.type[0] : FEATURE.type; // Get Feature type
            switch ( TYPE ) {
                case "town":
                    updateLog( 
                        `You stroll into the town of ${FEATURE.name}. 
                        Its streets and people show that this is a 
                        ${FEATURE.economicStatus} place.` );  
                    break;
                default:
                    if ( INV_SEL.value === "none" ) 
                        setLandscapeFeatureActions();
                    updateLog( 
                        `You travel ${DIRECTION[direction]} 
                        into ${terrain.name}` );
                    updateIntructions();
                    break;
            }
        } else {
            if ( INV_SEL.value === "none" ) 
            setLandscapeFeatureActions();
            updateLog( 
                `You travel ${DIRECTION[direction]} 
                into ${terrain.name}` );
            updateIntructions();
        }


        // Calculate travel time
        increaseGameTime( terrain.difficulty );

        checkedTile = false;
        gameUpdate();
    } else {
        updateLog( `You cannot traverse ${terrain.name} terrain` );
    }

}

function setLandscapeFeatureActions(feature) {
    if ( feature === undefined ) feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    // Escape from no features (there should't be none, but for now there is)
    if ( feature === undefined ) {
        // clear current actions
        let items = ITEM_ACTIONS.options.length;
        for (let i = 0; i < items; i++) {
            ITEM_ACTIONS.options[0].removeEventListener("click", () => useItem( INV_SEL.value ), false );
            ITEM_ACTIONS.options[0].remove();
        }
        return
    }
    if ( feature.type === "town" ) {

        // Select first inventory option (unequip items and reveal town actions)
        INV_SEL.options.selectedIndex = 0;

        // clear current actions
        let items = ITEM_ACTIONS.options.length;
        for (let i = 0; i < items; i++) {
            ITEM_ACTIONS.options[0].removeEventListener("click", () => useItem( INV_SEL.value ), false );
            ITEM_ACTIONS.options[0].remove();
        }

        // Add Town actions
        feature.actions.forEach( e => {
            ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( e, e );    
            ITEM_ACTIONS.options[ITEM_ACTIONS.length - 1].addEventListener("click", () => useItem( INV_SEL.value ), false );
        });
        ITEM_ACTIONS.options.selectedIndex = 0;
        updateIntructions(ITEM_ACTIONS.value);
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

    // Step through all the landscape feature arrays (or combine them into one)
    let feature = LAND._TOWNS.find( e => (
        x === ( e.location.x ) && 
        y === ( e.location.y )  
    ) );

    // NEXT
    if ( feature === undefined ) {
        MAT._resources.forEach( e => {
            if ( MAT.getResourceValueAtLocation( e.name, x, y ) > 0 ) {
                feature = e;
                return feature;
            }
        })
    }
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

function gameUpdate() {
    if ( avatar.isDead ) return;

    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );

    // run automated updates based on location type
    if (feature) {
        if ( feature.type === "town" ) {
            avatar.addFood(avatar._MAX_FOOD);
        }
    }

    // update game time
    UI_GAME_TIME.textContent = Math.round(gameTime);
    
    // update gold
    UI_GOLD.forEach( el => el.textContent = avatar.gold );
    
    // update food
    UI_FOOD.textContent = avatar.food;

    // update weight
    UI_WEIGHT.textContent = avatar.weight;
    
    // Refresh Town Markets every ~10 days
    if ( Math.round(gameTime % 10) === 0 ) {
        LAND._TOWNS.forEach ( e => e.generateMarket() ) 
    }


    LAND.draw(avatar.location[0], avatar.location[1], avatar.sight);
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

function getItemDataFromName( name ) {
    return Object.values(ITEM_DATA).find( e => e.name === name );
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
    LAND.generateTowns();
    
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

    avatar.location = [startTown.location.x,
                        startTown.location.y];
    
    // Default terrain
    avatar.addValidTerrain("soil");
    
    // Default items
    // let item = ITEM_DATA.tool_rough_hammer;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    let item = ITEM_DATA.dwsngTwg;
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    item = ITEM_DATA.dwsngTwgIron;
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    item = ITEM_DATA.pickaxe;
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.pickaxe_fine_cpr;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.pickaxe_crude_irn;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.pickaxe_fine_irn;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  item = ITEM_DATA.dagger_schematic;
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  item = ITEM_DATA.tool_fine_hammer;
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.tool_hammer;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    //  item = getItemDataFromName( "copper" );
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    //  avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    // item = getItemDataFromName( "iron" );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    // item = getItemDataFromName( "oak wood" );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    item = getItemDataFromName( "Fishing Rod" );
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    INV_SEL.selectedIndex = 0; 
    selectItem( INV_SEL.value );
    
    avatar.addGold(10);

    updateLog( `The adventures of ${avatar.name} begin in the ${startTown.economicStatus} town of ${startTown.name}` );
    gameUpdate();
    
    LAND.draw(avatar.location[0], avatar.location[1], avatar.sight);
    drawAvatar();

    // MAT._resources[0].generateMap();
    // MAT._resources[0].drawMap();
    // LAND.drawAll();  

}

init();


