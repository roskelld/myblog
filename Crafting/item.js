'use strict'
const ITEM_DATA = {
    pickaxe: {
        name:      "Pickaxe",
        weight:    3,
        price:      3,
        use:        ["Mine",  "Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        properties: ["copper", "iron", "gold", "silver"],
        materials: {
            antler:    100,
            wood:      80,            
        },
    },
    dwsngTwgCopper: {
        name:       "Dowsing Twig (copper)",
        weight:     0.5,
        price:      3,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  10,
        properties: ["copper"],
        materials: {
            wood:   20,
        },
    },
    dwsngTwgIron: {
        name:       "Dowsing Twig (iron)",
        weight:     0.5,
        price:      3,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  10,
        properties: ["iron"],
        materials: {
            wood:   20,
        },
    },
    divining_rod: {
        name:       "Divining Rod",
        weight:     1,
        price:      10,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        efficency:  10,
        properties: ["copper", "iron", "gold"],
        materials: {
            metal:  5,
        }
    }, 
    dagger: {
        name:       "Dagger",
        weight:     1,
        price:      5,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        properties: [],
        materials: {
            metal:  15,
            cloth:  1
        }
    },
    sml_statue: {
        name:       "Small Statue",
        weight:     1,
        price:      8,
        use:        ["Look", "Attack", "Throw", "Defend"],
        efficency:  -1,
        properties: [],
        materials: {
            stone:  5
        }
    },
    long_sword: {
        name:       "Long Sword",
        weight:     4,
        price:      15,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        properties: [],
        materials: {
            metal:  20,
            cloth:  2
        }
    },
    spear: {
        name:       "Spear",
        weight:     3,
        price:      4,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  10,
        properties: [],
        materials: {
            metal:  10,
            wood:   20
        }
    },
    copper: {
        name:       "copper",
        weight:     3,
        price:      10,
        use:        ["Attack", "Defend", "Throw", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            metal:  100,
        }
    },
    dagger_schematic: {
        name:       "Dagger Schematic",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            paper:  1
        }
    },
    lngswrd_schematic: {
        name:       "Long Sword Schematic",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            paper:  1
        }
    },
    smlhut_schematic: {
        name:       "Small Hut Schematic",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            paper:  1
        }
    },
    dice_six: {
        name:       "Dice six sided",
        weight:     0.05,
        price:      0.1,
        use:        ["Roll", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            bone:  1
        }
    },
    hltpotion_schematic: {
        name:       "Potion of Healing Schematic",
        weight:     0.05,
        price:      0.1,
        use:        ["Craft", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            paper:  1
        }
    },
    lute: {
        name:       "Lute",
        weight:     0.05,
        price:      0.1,
        use:        ["Play Song", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            paper:  1
        }
    },
    shortbow: {
        name:       "Short Bow",
        weight:     0.05,
        price:      0.1,
        use:        ["Shoot", "Throw", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            paper:  1
        }
    },
    parrow: {
        name:       "Parrow Bird",
        weight:     0.05,
        price:      25,
        use:        ["Pet", "Feed", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            meat:  1
        }
    },
    hltpotion: {
        name:       "Potion of Healing",
        weight:     0.05,
        price:      0.1,
        use:        ["Drink", "Throw", "Look"],
        efficency:  -1,
        properties: [],
        materials: {
            liquid:  1,
            glass:   1,
        }
    },

}

class Item {
    constructor( name, weight, properties, materials, use, efficency ) {
        this._name = name;
        this._weight = weight;
        this._materials = materials;
        this._use = use;
        this._id = this.genID();
        this._properties = properties;
        this._efficency = efficency;
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
    genID() {
        return Math.random().toString(16).substr(2, 8);
    }
}
