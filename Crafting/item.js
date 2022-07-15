'use strict'
const ITEM_DATA = {
    pickaxe: {
        name:      "Pickaxe",
        weight:    3,
        price:      3,
        use:        ["Mine",  "Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        max_efficency:  10,
        properties: ["copper", "iron", "gold", "silver"],
        materials: {
            copper:    100,
            wood:      80,            
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
    dwsngTwgCopper: {
        name:       "Dowsing Twig (copper)",
        weight:     0.5,
        price:      3,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  10,
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
        name:       "Dowsing Twig (iron)",
        weight:     0.5,
        price:      3,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  10,
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
            metal:  15,
            cloth:  1
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
            metal:  20,
            cloth:  2
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
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
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
    gold_ore: {
        name:       "gold",
        weight:     3,
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  10,
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
    lngswrd_schematic: {
        name:       "Long Sword (Schematic)",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["tool", "copper","iron"],
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
    smlhut_schematic: {
        name:       "Small Hut (Schematic)",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["tool", "copper", "iron", "wood"],
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
    smlhut: {
        name:       "Small Hut (Schematic)",
        weight:     0.05,
        price:      0.1,
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
    hltpotion_schematic: {
        name:       "Potion of Healing (Schematic)",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        max_efficency:  -1,
        properties: ["tool", "copper","iron"],
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
    lute: {
        name:       "Lute",
        weight:     0.05,
        price:      0.1,
        use:        ["Play Song", "Look"],
        efficency:  -1,
        max_efficency:  -1,
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
    shortbow: {
        name:       "Short Bow",
        weight:     0.05,
        price:      0.1,
        use:        ["Shoot", "Throw", "Look"],
        efficency:  -1,
        max_efficency:  -1,
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
            glass:   1,
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
            sharpness:  5,
            conduction: 20,
            hardness:   10,
            luster:     5,
            sonorous:   4,
            meltingpoint: 250
        },
    },
    tool_fine_hammer: {
        name:       "Fine Hammer",
        weight:     0.05,
        price:      0.1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  20,
        max_efficency:  20,
        properties: ["crafting", "tool"],
        materials: {
            iron:  1,
            oak:   1,
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
    tool_rough_hammer: {
        name:       "Rough Hammer",
        weight:     0.05,
        price:      0.1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  5,
        max_efficency:  5,
        properties: ["crafting", "tool"],
        materials: {
            iron:  1,
            beech:   1,
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
    dagger_schematic: {
        name:       "Dagger (Schematic)",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        max_efficency:  10,
        properties: ["tool", "metal", "metal", "metal", "metal"],
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
        return this._name;
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
    genID() {
        return Math.random().toString(16).substr(2, 8);
    }
}
