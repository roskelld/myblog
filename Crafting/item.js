'use strict'
const ITEM_DATA = {
    pickaxe: {
        name:      "Pickaxe",
        weight:    3,
        use:        ["Mine", "Look", "Attack"],
        properties: {
            antler:    100,
            wood:      80,
        },
    },
    dowsingTwig: {
        name:       "Dowsing Twig",
        weight:     0.5,
        use:        ["Survey", "Look", "Attack"],
        properties: {
            wood:   20,
        },

    },
    diviningRod: {
        name:       "Divining Rod",
        weight:     1,
        use:        ["Survey", "Look", "Attack"],
        properties: {
            metal:  20,
        }
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
