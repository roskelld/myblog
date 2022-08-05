class Scenario {
    constructor( land ) {
        this._location = { x: 0, y: 0 };                                        // Location of Scenario
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
        this.DGN = new Dungeon(document.querySelector("#landscape"), this);
        this.description = "A craggy mouth chipped deep into the mountain.";
        this._position = this.DGN.pos;
    }
    get pos() {
        return this._position;
    }
    draw() {                                                                    // Draw Landscape Icon
        const X = this._location.x;
        const Y = this._location.y;
        this._land._CTX.strokeStyle = `rgb(0,0,0)`;
        this._land._CTX.fillStyle = `rgb(40,40,40)`;
        const PXL = this._land._PIXEL_SIZE / this._land._GRID_SIZE;
        const SHAPE = new Path2D();
        SHAPE.moveTo( X, Y + PXL );
        SHAPE.lineTo( X + (PXL/2), Y );
        SHAPE.lineTo( X + PXL, Y + PXL );
        SHAPE.lineTo( X, Y + PXL );
        SHAPE.closePath();
        this._land._CTX.fill(SHAPE);
    }
    start() {
        this.DGN.init();
    }
    exit() {

    }
}