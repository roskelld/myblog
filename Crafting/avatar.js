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
        this._weight = 0;
        this._inventory = [];
        this._sight = 3;
        this._luck = 0;
    }
    update(duration) {
        
        for (let index = 0; index < Math.round(duration); index++) {
            this.eatFood();
        }
    }
    get sight() {
        return this._sight;
    }
    get weight() {
        let weight = 0;
        this._inventory.forEach( e => { weight += e.weight } );
        return weight.toFixed(2);
    }
    get luck() {
        return this._luck;
    }
    set luck(value) {
        this._luck += value;
        return this._luck;
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
        // Reduce inventory to valid terrain affecting objects
        let filtered = avatar._inventory.filter( e => e.properties.find( e => e === "terrain" ) ); 
        // Create a new array that includes character default terrains
        let generatedTerrainList = [...this._validTerrain];

        // Filter the object list down to all valid (using DATA.terrain) terrain tags
        // I bet this can be shorter
        filtered.forEach( e => e.properties.filter( e => { if ( DATA.terrain.indexOf(e) !== -1 ) { generatedTerrainList.push(DATA.terrain[DATA.terrain.indexOf(e)]) } } ) );

        return generatedTerrainList.includes(terrain);
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
    get loc() {                                                                 // Cleaner loc function
        return { x: this._location[0], y: this._location[1] }
    }
    get pos() {
        return { x: this._location[0], y: this._location[1] }
    }
    get mapLocation() {
        return LAND.convertCoordinates( this.location[0], this.location[1] );
    }
    get gold() {
        return Number(this._gold.toFixed(2));
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
    addToInventory( item ) {
        this._inventory.push(item);
        INV_SEL.options[INV_SEL.length] = new Option( item.name, item.id );
    }
    removeFromInventory( id ) {
        Object.values(INV_SEL.options).find( e => e.value == id ).remove();

        this._inventory.splice( this._inventory.findIndex( e => e.id === id ), 1);
    }
    getItem(id) {
        return this._inventory.find( e => e.id === id );
    }
    get currentAction() {
        const ITM = this.getItem( INV_SEL.value );
        if ( ITM === undefined ) return "None";
        return ITM.use[ ITEM_ACTIONS.selectedIndex ];
    }
    get currentItem() {
        const ITM = this.getItem( INV_SEL.value )
        if ( ITM === undefined ) return "None";
        return ITM;

    }
    currentItemHas( action ) {
        const ITM = this.getItem(INV_SEL.value)
        if ( ITM === undefined ) return false;
        return ITM.use.includes( action );
    }
}

