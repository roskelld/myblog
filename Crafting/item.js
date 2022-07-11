'use strict'
const ITEM_DATA = {
    pickaxe: {
        name:      "Pickaxe",
        weight:    3,
        use:        ["Mine",  "Attack", "Defend", "Throw", "Look"],
        properties: {
            antler:    100,
            wood:      80,
        },
    },
    dowsingTwig: {
        name:       "Dowsing Twig",
        weight:     0.5,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        properties: {
            wood:   20,
        },

    },
    divining_rod: {
        name:       "Divining Rod",
        weight:     1,
        use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
        properties: {
            metal:  5,
        }
    }, 
    dagger: {
        name:       "Dagger",
        weight:     1,
        use:        ["Attack", "Defend", "Throw", "Look"],
        properties: {
            metal:  15,
            cloth:  1
        }
    },
    sml_statue: {
        name:       "Small Statue",
        weight:     1,
        use:        ["Look", "Attack", "Throw", "Defend"],
        properties: {
            stone:  5
        }
    },
    long_sword: {
        name:       "Long Sword",
        weight:     4,
        use:        ["Attack", "Defend", "Throw", "Look"],
        properties: {
            metal:  20,
            cloth:  2
        }
    },
    spear: {
        name:       "Spear",
        weight:     3,
        use:        ["Attack", "Defend", "Throw", "Look"],
    }

}

class Item {
    constructor( name, weight, properties, use ) {
        this._name = name;
        this._weight = weight;
        this._properties = properties;
        this._use = use;
        this._id = this.genID();
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
