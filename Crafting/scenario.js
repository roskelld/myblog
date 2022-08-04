class Scenario {
    constructor( land ) {
        this._location = { x: 0, y: 0 };
        this._actions = [];
        this._land = land;
        this._revealed = false;
        this._temporary = false;
        this._age = 0;
        this._type = "";
        this._description = "";
    }
    set loc(loc) {
        this._location = loc;
    }
    get loc() {
        return {                                                                // Convert the location to normal values
            x: this._location.x / (this._land._PIXEL_SIZE / this._land._GRID_SIZE),
            y: this._location.y / (this._land._PIXEL_SIZE / this._land._GRID_SIZE)
        }
    }
    set location(loc) {
        this._location = loc;
    }
    get location() {
        return this.loc;
    }
    get actions() {
        return this._actions;
    }
    set type(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
    set revealed(revealed) {
        this._revealed = revealed;
    }
    get revealed() {
        return this._revealed;
    }
    get description() {
        return this._description;
    }
    set description(text) {
        this._description = text;
    }
    draw() {
        console.log("ADD CUSTOM DRAW CODE TO SCENARIO INSTANCE");
    }
    start() {
        console.log("ADD CUSTOM START CODE TO BEGIN SCENARIO");
    }
}

class Cave extends Scenario {
    constructor(land) {
        super(land);
        this._actions = ["Enter"]
        this.DGN = new Dungeon(document.getElementById("landscape"));
        this.description = "A craggy mouth chipped deep into the mountain."
    }
    draw() {
        const x = this._location.x;
        const y = this._location.y;
        // console.log( `${x},${y} - ${this.loc.x},${this.loc.y}`);
        this._land._CTX.strokeStyle = `rgb(0,0,0)`;
        this._land._CTX.fillStyle = `rgb(40,40,40)`;
        const PXL = this._land._PIXEL_SIZE / this._land._GRID_SIZE;
        const SHAPE = new Path2D();
        SHAPE.moveTo( x, y + PXL );
        SHAPE.lineTo( x + (PXL/2), y );
        SHAPE.lineTo( x + PXL, y + PXL );
        SHAPE.lineTo( x, y + PXL );
        SHAPE.closePath();
        this._land._CTX.fill(SHAPE);
    }
    start() {
        this.DGN.init();
    }
    exit() {

    }
}