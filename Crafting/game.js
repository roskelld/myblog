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
    "Craft":    "Craft"
}

// Prevent arrow keys from scrolling windows 
window.addEventListener("keydown", e => { if (e.key === INV_DOWN || e.key === INV_UP ) e.preventDefault(); }, false );

const INSTRUCTION_BASE = "(WASD) Move : (\u2B06\u2B07) Equip Item : (R/F) Select Action";

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
const UI_WEIGHT = document.querySelector("#weight");

const INVENTORY_SELECTION = document.querySelector("#inventory");
INVENTORY_SELECTION.addEventListener("change", selectItem, false );
INVENTORY_SELECTION.addEventListener("focus", e => { INVENTORY_SELECTION.blur(); }, false );

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
CRAFT_ACTION_LIST.addEventListener("change", selectCraftinActionItem, false );
CRAFT_ACTION_LIST.addEventListener("focus", e => { CRAFT_ACTION_LIST.blur(); }, false );

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
    [219,159,36],
    [220,192,35], 
    ["metal","copper"], 
    { 
    } ) );

// Game Time
let gameTime = 1;

let avatar;

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
                    // if ( INVENTORY_SELECTION.selectedIndex === 0 || INVENTORY_SELECTION.selectedIndex === -1 ) return;
                    if ( ITEM_ACTIONS.options.length === 0 ) return;
                    useItem( INVENTORY_SELECTION.value );
                    return;
                case RESTART:
                    init();
                    return; 
                case INV_UP:
                    if ( INVENTORY_SELECTION.selectedIndex === 0 || INVENTORY_SELECTION.selectedIndex === -1 ) {
                        INVENTORY_SELECTION.selectedIndex = INVENTORY_SELECTION.length - 1;
                    } else {
                        INVENTORY_SELECTION.selectedIndex--;
                    }
                    selectItem( INVENTORY_SELECTION.value );
                    return;
                case INV_DOWN:
                    if ( INVENTORY_SELECTION.selectedIndex === INVENTORY_SELECTION.length - 1 ) {
                        INVENTORY_SELECTION.selectedIndex = 0;
                    } else {
                        INVENTORY_SELECTION.selectedIndex++;
                    }
                    selectItem( INVENTORY_SELECTION.value );
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
                        let item = avatar.getItem( INVENTORY_SELECTION.value );
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
                        let item = avatar.getItem( INVENTORY_SELECTION.value );
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
        updateLog(`You pick up a ${SHOP_LIST.value} from a shelf and the shop keeper looks up and shouts "${price} gold, you'll not find a better deal".`);
        return;
    }
    if ( getGameMode() === 2 ) {
        let name = avatar.getItem( SHOP_LIST.value ).name;
        let price = feature.offerToBuyPrice( name, avatar );
        updateLog(`You pull a ${name} from your pack and show it to the shop keeper who quickly blerts out "${price} gold" in a way that makes it clear that it's not a negotiable offer.`);
        return;
    }
}

function selectItem( name ) {
    
    // Show all actions
    // Get Item
    let item = avatar.getItem( INVENTORY_SELECTION.value );
    
    // clear current actions
    let items = ITEM_ACTIONS.options.length;
    for (let i = 0; i < items; i++) {
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
    });
    
    // Select first option;
    ITEM_ACTIONS.options[0].selected = true;

    // Add Details
    Object.keys(item.stats).forEach( e => { 
        let row = document.createElement("tr");
        let title = document.createElement("td");
        let value = document.createElement("td");
        title.textContent = `${e}:`;
        value.textContent = `${item.stats[[e]]}`;

        row.appendChild(title);
        row.appendChild(value);

        UI_DETAILS.appendChild(row);

    } );

    updateIntructions( INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].text );
}

function selectAction() {
    updateIntructions( INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].text );
}

function useItem( id ) {
    if ( avatar.isDead ) return;
    let item = avatar.getItem( id );
    
    // Figure out logic for use action based on selected item and content at location
    // Survey is always an option so could be a fall back given if there's no "EVENT" happening or "FEATURE"
    let action = ITEM_ACTIONS.options[ITEM_ACTIONS.options.selectedIndex].value;

    switch (action) {
        case "Mine":
            mineTile( "copper", avatar.location[0], avatar.location[1] );
            break;
        case "Survey":
            surveyTile( "copper", avatar.location[0], avatar.location[1] );
            break;
        case "Look":
            updateLog( `You inspect the ${item.name}, it feels nice in the hand.` );
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
    let item = avatar.getItem( INVENTORY_SELECTION.value );

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
    
        let itemTitle = INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].text.split("(")[0];
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
    let itemTitle = INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].text.split("(")[0];
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
    let itemTitle = INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].text.split("(")[0];
    itemTitle = itemTitle.substr(0, itemTitle.length -1 );
    let item = getItemDataFromName( itemTitle );

    // Get Schematic 
    let schematic = avatar.getItem(INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].value);

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

    // Leave Crafting if LEAVE selected
    if ( action == -1 ) { leaveCrafting(); return }

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
    let itemTitle = INVENTORY_SELECTION.options[INVENTORY_SELECTION.selectedIndex].text.split("(")[0];
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
        let item = ( SHOP_LIST.value == -1 ) ? "Leave shop" : `Sell ${SHOP_LIST.value}`
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
    // clear current items
    let items = SHOP_LIST.options.length;
    for (let i = 0; i < items; i++) {
        SHOP_LIST.options[0].remove();
    }
    
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    updateLog(`You walk through the streets of ${feature.name} to see a shop that looks like it might have some interesting wares.`);
    if ( mode === "buy" ) {
        setGameMode("shop_buy");

        // Populate shop
        SHOP_LIST.options[0] = new Option( `LEAVE SHOP`, -1 );
        feature._market.forEach( e => {
            SHOP_LIST.options[SHOP_LIST.length] = new Option( `Buy ${e.name} (${e.price}g)`, e.name );
        } );
        SHOP_LIST.selectedIndex = 0;
    }

    if ( mode === "sell" ) {
        setGameMode("shop_sell");
        SHOP_LIST.options[0] = new Option( `LEAVE SHOP`, -1 );
        avatar._inventory.forEach( e => {
            let price = feature.offerToBuyPrice( e.name, avatar );
            SHOP_LIST.options[SHOP_LIST.length] = new Option( `Sell ${e.name} for ${price} gold`, e.id );
        } );
        SHOP_LIST.selectedIndex = 0;        
    }

    SHOP_UI.classList.remove("hide");    
    updateIntructions();
}

function rollDice(sided) {
    let result = Math.floor(Math.random() * sided) + 1;
    updateLog(`You pull a bone die from your pouch and nimbly roll it. After a few bounces it settles on a ${result}`);
    return result;
}

function leaveShop() {
    SHOP_UI.classList.add("hide");
    setGameMode("general");
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    updateLog(`You leave the shop and step back onto the streets of ${feature.name} wondering what your next move might be.`);
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
        feature._market.splice( e => e.name === item, 1 );
        
        // Take the money from the avatar
        avatar.removeGold( tobuy.price );
        // Get the item data
        let data = ITEM_DATA[[`${tobuy.id}`]];

        // Add it to the avatar inventory
        avatar.addToInventory( new Item( data.name, data.weight, data.properties, data.materials, data.use, data.efficency ));
        gameUpdate();
    }
}

function sell( id ) {
    // If selected LEAVE then leave the shop (Note -1 is a string)
    if ( id == -1 ) {
        leaveShop();
        return;
    }

    // Get the item name
    let name = avatar.getItem( id ).name;

    // Get the item price
    let feature = getLandscapeFeature( avatar.location[0], avatar.location[1] );
    let price = feature.offerToBuyPrice( name, avatar );
    
    // Remove the item from the player's inventory (and inventory UI)
    avatar.removeFromInventory( SHOP_LIST.value );
    // Remove the item from the market list
    SHOP_LIST.options[SHOP_LIST.selectedIndex].remove();
    
    // Give the player the gold
    avatar.addGold( price );
    
    SHOP_LIST.selectedIndex = 0
    gameUpdate();
}

function attack() {
    updateLog( `Your nimbly swipe your ${avatar.getItem(INVENTORY_SELECTION.value).name} in an aggressive fashion. Shame there's no one around to witness your warrior prowess.` );
}

function defend() {
    updateLog( `Holding your ${avatar.getItem(INVENTORY_SELECTION.value).name} up high, you stand your ground against the imagined attackers who vanish from your mind before they can strike.` );
}

function throwItem() {
    let distance = Math.round(Math.random() * 10);
    updateLog( `You swing your arm in a great arc launching the ${avatar.getItem(INVENTORY_SELECTION.value).name} into the air. It lands ${distance} feet in front of you. You pause and wonder what use that was before picking it back up and dusting the mud from it.` );
}

function surveyTile( name, x, y ) {
    if ( avatar.isDead ) return;
    let result = MAT.getResourceDescriptionAtLocation( name, x, y );
    updateLog( `Your survey for ${name} finds a ${result} source` );

    // drawMaterial( x, y );
    MAT.drawResource( name, x, y );

    increaseGameTime(1);

    lastDirection = null;
    gameUpdate();
}

function mineTile( name, x, y ) {
    if ( avatar.isDead ) return;
    if ( MAT.getResourceValueAtLocation( name, x, y ) <= 0 ) {
        updateLog( `Your efforts to mine ${name} are fruitless.` );
        return;
    } else {
        let result = MAT.removeResource( "copper", avatar.location[0], avatar.location[1] );    
        
        let item = getItemDataFromName( name );
        avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
        updateLog( `You mine ${result} of ${name}` );
    }

    increaseGameTime(1);

    lastDirection = null;
    gameUpdate();
}

function gamble() {
    if ( avatar.gold <= 0 ) {
        updateLog( `You enter the tavern feeling lucky, but soon realize that you're out of money and slip back out hoping no one noticed.` );
    } else {
        let result = Math.random() + (avatar.luck / 100);
        avatar.removeGold(1);
        if ( result >= 0.75 ) {
            updateLog( `You enter the tavern and slap down a gold piece on the dice table. Thank the gods your numbers come up adding a nice weight of gold in your pouch.` );
            avatar.addGold(5);
        } else {
            updateLog( `You enter the taven and place your gold piece on the dice table. The dice roll and you feel a dark cloud cast over you. Your numbers don't come up, leaving your pouch a little lighter.` );
        }                
    }
    gameUpdate();
}

function pray() {
    if ( avatar.gold <= 0 ) {
        updateLog( `You enter the holy site and find a quiet spot to pray to your god.` );
    } else {
        let result = Math.random();
        avatar.removeGold(1);
        updateLog( `You enter the holy site and place a gold coin as an offering hoping that your god will bring you luck` );
        if ( result >= 0.75 ) {
            avatar.luck = 1;
        }
    }
    gameUpdate();
}

function playInstrument( instrument ) {
    updateLog( `You take a breath and begin to play an old song on the ${instrument} filling the air with sweet emotion.` );
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
            setLandscapeFeatureActions(feature);
        } else {
            if ( INVENTORY_SELECTION.value === "none" ) setLandscapeFeatureActions();
            updateLog( `You travel ${DIRECTION[direction]} into ${terrain.name}` );
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
            ITEM_ACTIONS.options[0].remove();
        }
        return
    }
    if ( feature.type = "town" ) {

        // Select first inventory option (unequip items and reveal town actions)
        INVENTORY_SELECTION.options.selectedIndex = 0;

        // clear current actions
        let items = ITEM_ACTIONS.options.length;
        for (let i = 0; i < items; i++) {
            ITEM_ACTIONS.options[0].remove();
        }

        // Add Town actions
        feature.actions.forEach( e => {
            ITEM_ACTIONS.options[ITEM_ACTIONS.length] = new Option( e, e );    
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

function refreshEquipmentListUI() {
    // Get current length
    let count = INVENTORY_SELECTION.length - 1;
    for (let index = 0; index < count; index++) {
        // Remove 2nd entry (first is NONE)
        INVENTORY_SELECTION[1].remove();        
    }
    // Repopulate with avatar inventory 
    avatar._inventory.forEach( e => {
        INVENTORY_SELECTION.options[INVENTORY_SELECTION.length] = new Option( e.name, e.id );
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
    UI_GOLD.textContent = avatar.gold;
    
    // update food
    UI_FOOD.textContent = avatar.food;

    // update weight
    UI_WEIGHT.textContent = avatar.weight;
    
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
    
    // drawLandscape();
    LAND.generateTowns();
    
    let startTown = LAND._TOWNS[Math.floor(Math.random()*LAND._TOWNS.length)];
    
    avatar = new Avatar();

    avatar._MAX_FOOD = 100;
    avatar.addFood(100);
    // avatar.addGold(10000);

    refreshEquipmentListUI();
    
    // Reset Shop
    SHOP_UI.classList.add("hide");

    avatar.location = [startTown.location[0] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE), startTown.location[1] / (LAND._PIXEL_SIZE / LAND._GRID_SIZE)];
    
    // Default terrain
    avatar.addValidTerrain("soil");
    
    // Default items
    let item = ITEM_DATA.tool_rough_hammer;
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    item = ITEM_DATA.dwsngTwgCopper;
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    item = ITEM_DATA.pickaxe;
    avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.dagger_schematic;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.tool_fine_hammer;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // item = ITEM_DATA.tool_hammer;
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    // item = getItemDataFromName( "copper" );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    // item = getItemDataFromName( "iron" );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    // item = getItemDataFromName( "oak wood" );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );

    // item = getItemDataFromName( "Small Hut (Schematic)" );
    // avatar.addToInventory( new Item( item.name, item.weight, item.properties, item.materials, item.use, item.efficency, item.stats ) );


    INVENTORY_SELECTION.selectedIndex = 0; 
    selectItem( INVENTORY_SELECTION.value );
    
    avatar.addGold(10);

    updateLog( `The adventures of ${avatar.name} from the town of ${startTown.name}` );
    gameUpdate();
    
    LAND.draw(avatar.location[0], avatar.location[1], avatar.sight);
    drawAvatar();

}


init();
