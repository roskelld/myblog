'use strict'
const ITEM_DATA = {
    pickaxe: {
        name:      "Pickaxe",
        weight:     3,
        price:      3,
        use:        ["Mine",  "Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        max_efficency:  10,
        properties: ["metal"],
        materials: {
            metal:     3,
            wood:      1,            
        },
        stats: {
            sharpness:  5,
            hardness:   10,
        }
    },
    dwsngTwg: {
        name:       "Dowsing Twig",
        weight:     0.5,
        price:      3,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  4,
        max_efficency:  10,
        properties: ["copper"],
        materials: {
            wood:   20,
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        }
    },
    dwsngTwgIron: {
        name:       "Dowsing Twig",
        weight:     0.5,
        price:      3,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  4,
        max_efficency:  10,
        properties: ["iron"],
        materials: {
            wood:   20,
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        }
    },
    divining_rod: {
        name:       "Divining Rod",
        weight:     1,
        price:      10,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  10,
        max_efficency:  10,
        properties: ["copper", "iron", "gold"],
        materials: {
            metal:  5,
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        }
    }, 
    dagger: {
        name:       "Dagger",
        weight:     1,
        price:      5,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        max_efficency:  10,
        properties: [],
        materials: {
            metal:  0.9,
            cloth:  0.1
        },
        stats: {
            sharpness:      5,
            hardness:       10,
        },
    },
    sml_statue: {
        name:       "Small Statue",
        weight:     1,
        price:      8,
        use:        ["Look", "Attack", "Throw", "Defend"],
        efficency:  -1,
        max_efficency:  -1,
        properties: [],
        materials: {
            stone:  5
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    long_sword: {
        name:       "Long Sword",
        weight:     4,
        price:      15,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        max_efficency:  10,
        properties: [],
        materials: {
            copper:  3.8,
            leather:  0.2
        },
        stats: {
            sharpness:  5,
            hardness:   10,
        },
    },
    spear: {
        name:       "Spear",
        weight:     3,
        price:      4,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        max_efficency:  10,
        properties: [],
        materials: {
            metal:  10,
            wood:   20
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    copper_ore: {
        name:       "copper",
        weight:     3,
        price:      -1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  -1,
        properties: ["crafting", "material", "metal", "copper"],
        materials: {
            copper:  100,
        },
        stats: {
            conduction:     386, 
            density:        8.93, 
            malleable:      0, 
            ductile:        0.62, 
            meltingpoint:   1083, 
            sonorous:       0, 
            luster:         0, 
            hardness:       89,     // Brinell BHN
        },
    },
    tin_ore: {
        name:       "tin",
        weight:     3,
        price:      -1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  -1,
        properties: ["crafting", "material", "metal", "tin"],
        materials: {
            tin:  100,
        },
        stats: {
            conduction:     386, 
            density:        8.93, 
            malleable:      0, 
            ductile:        0.62, 
            meltingpoint:   1083, 
            sonorous:       0, 
            luster:         0, 
            hardness:       89,     // Brinell BHN
        },
    },
    gold_ore: {
        name:       "gold",
        weight:     3,
        price:      -1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  -1,
        properties: ["crafting", "material", "metal", "gold"],
        materials: {
            copper:  100,
        },
        stats: {
            conduction:     317, 
            density:        19.30, 
            malleable:      0, 
            ductile:        0.93, 
            meltingpoint:   1064, 
            sonorous:       0, 
            luster:         0, 
            hardness:       80,
        },
    },
    silver_ore: {
        name:       "silver",
        weight:     3,
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["crafting", "material", "metal", "silver"],
        materials: {
            copper:  100,
        },
        stats: {
            conduction:     420, 
            density:        10.50, 
            malleable:      0, 
            ductile:        0.73, 
            meltingpoint:   961, 
            sonorous:       0, 
            luster:         0, 
            hardness:       75,
        },
    },
    lead_ore: {
        name:       "lead",
        weight:     3,
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["crafting", "material", "metal", "lead"],
        materials: {
            copper:  100,
        },
        stats: {
            conduction:     35, 
            density:        11.34, 
            malleable:      0, 
            ductile:        0.93, 
            meltingpoint:   327, 
            sonorous:       0, 
            luster:         0, 
            hardness:       30,
        },
    },
    iron_ore: {
        name:       "iron",
        weight:     3,
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["crafting", "material", "metal", "iron"],
        materials: {
            iron:  100,
        },
        stats: {
            conduction:     71.8, 
            density:        7.87, 
            malleable:      0, 
            ductile:        0.43, 
            meltingpoint:   1260, 
            sonorous:       0, 
            luster:         0, 
            hardness:       235,
        },
    },
    oak_wood: {
        name:       "oak wood",
        weight:     3,
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["crafting", "material", "wood", "oak"],
        materials: {
            oak:  100,
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   4,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    smlhut: {
        name:       "Small Hut",
        weight:     0.05,
        price:      100,
        use:        ["Build", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: [],
        materials: {
            clay:  100
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    dice_six: {
        name:       "Dice six sided",
        weight:     0.05,
        price:      0.1,
        use:        ["Roll Dice", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: [],
        materials: {
            bone:  1
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    lute: {
        name:       "Lute",
        weight:     0.05,
        price:      0.1,
        use:        ["Play Song", "Look"],
        efficency:  5,
        max_efficency:  5,
        properties: [],
        materials: {
            wood:  1
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    shortbow: {
        name:       "Short Bow",
        weight:     0.05,
        price:      0.1,
        use:        ["Shoot", "Throw", "Look"],
        efficency:  13,
        max_efficency:  13,
        properties: [],
        materials: {
            paper:  1
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    parrow: {
        name:       "Parrow Bird",
        weight:     0.05,
        price:      25,
        use:        ["Pet", "Feed", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: [],
        materials: {
            meat:  1
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    hltpotion: {
        name:       "Potion of Healing",
        weight:     0.05,
        price:      0.1,
        use:        ["Drink", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  -1,
        properties: ["charge","charge","charge","charge","charge"],
        materials: {
            liquid:  1,
            glass:   1
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    tool_hammer: {
        name:       "Hammer",
        weight:     0.05,
        price:      0.1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        max_efficency:  10,
        properties: ["crafting", "tool"],
        materials: {
            iron:  1,
            oak:   1,
        },
        stats: {
            sharpness:  10,
            conduction: 20,
            hardness:   10,
            luster:     5
        },
    },
    climbing_pitons: {
        name:       "Climbing Pitons",
        weight:     0.5,
        price:      40,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: [],
        materials: {
            iron:  0.5
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    water_wings: {
        name:       "Water Wings",
        weight:     0.5,
        price:      50,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["terrain", "water"],
        materials: {
            iron:  0.5
        },
        stats: {
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    fishing_rod: {
        name:       "Fishing Rod",
        weight:     0.5,
        price:      20,
        use:        ["Fish", "Attack", "Defend", "Throw", "Look"],
        efficency:  5,
        max_efficency:  10,
        properties: [],
        materials: {
            oak:  0.5
        },
        stats: {
            sharpness:  5,
        },
    }
}

class Item {
    constructor( data, name, weight, properties, materials, use, efficency, stats ) {
        this._data = data;
        this._weight = weight;
        this._materials = materials;
        this._use = use;
        this._id = genID();
        this._properties = properties;
        this._efficency = efficency;
        this._max_efficency = efficency;
        this._stats = stats;
        this._name = name;
    }
    get name() {     
        const NAME = ( this._name == undefined ) ? this._data.name :this._name;
        
        const QUALITY = qualityAsText( this.efficency );

        if ( this.efficency === -1 ) {
            return `${NAME}`;
        } else {
            return `${QUALITY} ${NAME}`;
        }
    }
    get weight() {
        if ( this._weight === undefined ) return this._data.weight;
        return this._weight;
    }
    get use() {
        if ( this._use === undefined ) {
            return this._data.use;
        } else {
            return this._use;
        }
    }
    get id() {
        if ( this._id === undefined ) this._id = genID();
        return this._id;
    }
    get properties() {
        if ( this._properties === undefined )  return this._data.properties;
        return this._properties;

    }
    get materials() {
        if ( this._materials === undefined ) return [];
        return this._materials;
    }
    get efficency() {
        if ( this._efficency === undefined ) return this._data.efficency;
        return this._efficency;
    }
    get stats() {
        if ( this._stats === undefined ) 
            this._stats = Object.assign({}, this._data.stats);                  // This clones the stats from data
        return this._stats;
    }
    get efficencyName() {
        if ( this.efficency === -1 ) return "";
        if ( this.efficency < 1 ) return DATA.item_quality[0];
        if ( this.efficency < 10 ) return DATA.item_quality[1];
        if ( this.efficency < 25 ) return DATA.item_quality[2];
        if ( this.efficency < 50 ) return DATA.item_quality[3];
        if ( this.efficency < 75 ) return DATA.item_quality[4];
        if ( this.efficency < 100 ) return DATA.item_quality[5];
        if ( this.efficency < 125 ) return DATA.item_quality[6];
        if ( this.efficency < 150 ) return DATA.item_quality[7];
        return DATA.item_quality[8];
    }
    hasType( type ) {
        if ( this._data.type === undefined ) return false;
        return this._data.type.includes( type );
    }
    get itemType() {
        // Does the item have a specific subtype for its purpose?
        // Data is not well setup for this so for now it's going to
        // be a bit hardcoded for mining and surveying
        if ( this.use.some( e => e === "Mine" || e === "Survey" ) ) {
            return this.properties[0];
        } else {
            return "";
        }
    }
    get description() {
        const DESC = this.data.description;                                     // Find base description
    
        // Find and replace any tags with text
        const ARY = DESC.split("|");                                                // Hunt out any property tags to replace
        ARY.forEach( (prop, i) => {
            const TAGS = this[[prop]];                                              // try to make valid item data entry
            if ( TAGS !== undefined ) {
                ARY[i] = "";                                                        // Clear tag text in OG array
                if ( TAGS.length === 1 ) {
                    ARY[i] = this[[prop]][0];                                       // Add property tag
                } else {
                    TAGS.forEach( (tag, y) => { 
                        ARY[i] += (TAGS.length-1 === y) ? `& ${tag}` : ` ${tag}, `; // Add multiple tags and end list
                    } );
                }
            }
        });
        return ARY.join('');                                                    // Return generate description text
    }
    get data() {
        return this._data;
    }
    get type() {
        return this._data.type;
    }
    incrementStat( stat, value ) {
        if (this.stats[[stat]] === undefined ) return;
        this._stats[[stat]] += value;
    }
}

class Schematic extends Item {
    constructor( craft_data_ref, quality ) {
        super();
        this._craft_data_ref = craft_data_ref;
        this._efficency = quality;
        this._data = DATA.schematic;       
    }
    get craftData() {
        return this._craft_data_ref;
    }
    get name() {
        const QUALITY = qualityAsText(this._efficency);
        const ITEM = this._craft_data_ref.name;
        if (QUALITY === "") {
            return `${ITEM} (Schematic)`;
        } else {
            return `${QUALITY} ${ITEM} (Schematic)`;
        }
    }
    get description() {
        return `Schematic for crafting a ${qualityAsText(this.efficency)} 
                ${this.craftData.name}.`
    }
    get stats() {
        return {};                                                              // Schematics have no stats beyond efficency
    }
    get properties() {
        return [];
    }
}

class CraftMat extends Item {
    constructor( data ) {
        super();
        this._data = data; 
    }
    hasType( type ) {
        if ( type === "crafting " ) return true;
        if ( this._data.type === undefined ) return false;
        return this._data.type.includes( type );
    }
}

// Item Functions

function genRandomItem( quality ) {
    // TODO: Change how this works
    // Pure random, needs to select based on commonality and theme
    let index = Math.floor(Object.keys(DATA.items).length * Math.random());
    let itemName = Object.keys(DATA.items)[index];


    // TODO: generate stats from materials
    // generate materials
    // generate price based on materials and quality
    const data = DATA.items[itemName];

    // Scrappy fix: ignore requested quality (efficiency) if item type has none
    if ( data.efficency === -1 ) {
        return new Item( 
            DATA.items[itemName],
            data.name, 
            data.weight, 
            data.properties, 
            data.materials, 
            data.use, 
            -1, 
            data.stats );
    } else {
        return new Item( 
            DATA.items[itemName],
            data.name, 
            data.weight, 
            data.properties, 
            data.materials, 
            data.use, 
            quality, 
            data.stats );
    }

}

function genRandomSchmaticItem( quality ) {
    const IDX = Math.floor(Object.keys(DATA.items).length * Math.random());
    return createSchmaticItem( Object.values(DATA.items)[IDX], quality );
}

function createSchmaticItem( item_data, quality ) {
    // const ITEM = getItemDataFromName( ItemName );
    // const materials = Object.keys(ITEM.materials);
    // const matCount = Object.values(ITEM.materials);

    // const properties = [];
    // materials.forEach( (mat, idx) => {                                          // Generate schematic recipe from item mats
    //     for (let index = 0; index < matCount[idx]; index++) {
    //         properties.push(mat);                
    //     }
    // });
    // const SCHEMATIC = new Item(
    //     `${ITEM.name} (Schematic)`, 
    //     DATA.items.schematic.weight, 
    //     properties, 
    //     DATA.items.schematic.materials, 
    //     DATA.items.schematic.use, 
    //     quality, {});

    // return SCHEMATIC;
    return new Schematic( item_data, quality )
}

function createMaterialItem( name ) {
    const ITEM_DATA = Object.values(DATA.materials)
                                    .find( e => e.name === name );
    if ( ITEM_DATA === undefined ) {
        console.error(`No Material Named ${name} found - Add it to the data?`);
        return
    }
    const ITEM = new CraftMat(ITEM_DATA);
    return ITEM;
}