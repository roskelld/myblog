class Avatar {
    constructor() {
        this._name = "";
        this._location = [];
        this._validTerrain = [];
        this.generateName();
        this._gold = 0;
        this._food = 40;
        this._MAX_FOOD = 40;
        this._dead = false;
    }

    update(duration) {
        
        for (let index = 0; index < Math.round(duration); index++) {
            this.eatFood();
        }
    }

    generateName() {
        if (this._name == "") {
            this._name = DATA.names[Math.floor(Math.random()*DATA.names.length)];
        }
    }

    addValidTerrain(terrain) {
        this._validTerrain.push(terrain);
    }

    removeValidTerrain(terrain) {
        this._validTerrain.pop(terrain);
    }

    hasTerrain(terrain) {
        return this._validTerrain.includes(terrain);
    }

    get name() {
        return this._name;
    }

    set location(loc) {
        this._location[0] = loc[0];
        this._location[1] = loc[1];
    }

    get location() {
        return this._location;
    }

    get mapLocation() {
        return LAND.convertCoordinates( this.location[0], this.location[1] );
    }

    get gold() {
        return this._gold;
    }

    addGold(amount) {
        this._gold += amount;
    }

    removeGold(amount) {
        if ( this._gold - amount < 0 ) {
            return false;
        } else {
            this._gold -= amount;
            return true;
        }
    }

    get food() {
        return this._food;
    }

    eatFood() {
        if (this._food <= 0 ) {
            updateLog(`${this._name} is out of food and has died of starvation. Press ${RESTART} to adventure again`);
            this._dead = true;
            return false;
        } else {
            this._food--;
            return true;
        }
    }

    addFood(amount) {
        if ( this._food + amount > this._MAX_FOOD ) {
            this._food = this._MAX_FOOD;
        } else {
            this._food += amount;
        }
    }

    get isDead() {
        return this._dead;
    }
}