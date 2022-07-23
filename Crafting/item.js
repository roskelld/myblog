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
    constructor( name, weight, properties, materials, use, efficency, stats ) {
        this._name = name;
        this._weight = weight;
        this._materials = materials;
        this._use = use;
        this._id = this.genID();
        this._properties = properties;
        this._efficency = efficency;
        this._max_efficency = efficency;
        this._stats = stats;
    }
    get name() {
        const QUALITY = this.efficencyName;
        const TYPE = this.itemType;

        if ( QUALITY === "" ) {
            return `${this._name}`;
        } else if ( TYPE !== "" ) {
            return `${QUALITY} ${this._name} (${TYPE})`;
        } else {
            return `${QUALITY} ${this._name}`;
        }
    }
    get weight() {
        return this._weight;
    }
    get use() {
        return this._use;
    }
    get id() {
        return this._id;
    }
    get properties() {
        return this._properties;
    }
    get materials() {
        return this._materials;
    }
    get efficency() {
        return this._efficency;
    }
    get stats() {
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

    
    genID() {
        return Math.random().toString(16).substr(2, 8);
    }
}

// Item Functions

function genItem( quality ) {
    // TODO: Change how this works
    // Pure random and relies on ITEM_DATA
    let index = Math.floor(Object.keys(ITEM_DATA).length * Math.random());
    let itemName = Object.keys(ITEM_DATA)[index];


    // TODO: generate stats from materials
    // generate materials
    // generate price based on materials and quality
    const data = ITEM_DATA[itemName];

    // Scrappy fix: ignore requested quality (efficiency) if item type has none
    if ( data.efficency === -1 ) {
        return new Item( 
            data.name, 
            data.weight, 
            data.properties, 
            data.materials, 
            data.use, 
            -1, 
            data.stats );
    } else {
        return new Item( 
            data.name, 
            data.weight, 
            data.properties, 
            data.materials, 
            data.use, 
            quality, 
            data.stats );
    }

    // return {
    //     name:       data.name,
    //     weight:     data.weight,
    //     price:      quality,
    //     use:        data.use,
    //     efficency:  quality,
    //     properties: data.properties,
    //     materials:  data.materials,
    //     stats:      data.stats,
    // }
}

// pickaxe: {
//     name:      "Pickaxe",
//     weight:     3,
//     price:      3,
//     use:        ["Mine",  "Attack", "Defend", "Throw", "Look"],
//     efficency:  10,
//     max_efficency:  10,
//     properties: ["metal"],
//     materials: {
//         metal:     3,
//         wood:      1,            
//     },
//     stats: {
//         sharpness:  5,
//         hardness:   10,
//     }
// },


function genSchmatic( item, quality ) {
    const materials = Object.keys(item.materials);
    const matCount = Object.values(item.materials);

    const properties = [];
    materials.forEach( (mat, idx) => {
        for (let index = 0; index < matCount[idx]; index++) {
            properties.push(mat);                
        }
    })

    console.log(properties);

    return {
        name:       `${item.name} (Schematic)`,
        weight:     0.05,
        price:      quality,
        use:        ["Craft", "Look"],
        efficency:  quality,
        properties: properties,
        materials: {
            papyrus:    1,
            ink:        1,
        },
        stats: {

        }
    }
}