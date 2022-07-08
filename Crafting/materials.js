// Content UI
const MATERIALS_CANVAS = document.getElementById('materials');
MATERIALS_CANVAS.width = MATERIALS_CANVAS.height = 512;
const MATERIALS_CTX = MATERIALS_CANVAS.getContext('2d');

const COPPER = new Perlin();

const COPPER_MAT = {
    NONE: {
        value:  0.3,
        stroke: [0,0,0],
        color:  [0,0,0],
        name:   "no copper"
    },
    POOR: {
        value:  0.5,
        stroke: [185,119,70],
        color:  [185,119,70],
        name:   "poor copper"
    },
    MODERATE: {
        value:  0.8,
        stroke: [201,146,54],
        color:  [201,146,54],
        name:   "moderate copper"
    },
    FINE: {
        value:  0.9,
        stroke: [220,192,35],
        color:  [220,192,35],
        name:   "fine copper"
    },
    PURE: {
        value:  1,
        stroke: [219,159,36],
        color:  [245,222,10],
        name:   "pure copper"
    },
}

function getMaterialColor( value ) {
    // -1 to -0.9 rgb(0,0,0);
    if (value < COPPER_MAT.NONE.value)         return [0,0,0];
    if (value < COPPER_MAT.POOR.value)         return COPPER_MAT.POOR.color;
    if (value < COPPER_MAT.MODERATE.value)     return COPPER_MAT.MODERATE.color;
    if (value < COPPER_MAT.FINE.value)         return COPPER_MAT.FINE.color;
    return COPPER_MAT.PURE.color;
}

function getMaterialStroke( value ) {
    // -1 to -0.9 rgb(0,0,0);
    if (value <= 0)                            return [0,0,0];
    if (value < COPPER_MAT.POOR.value)         return COPPER_MAT.POOR.stroke;
    if (value < COPPER_MAT.MODERATE.value)     return COPPER_MAT.MODERATE.stroke;
    if (value < COPPER_MAT.FINE.value)         return COPPER_MAT.FINE.stroke;
    return COPPER_MAT.PURE.stroke;
}

function getMaterialName( value ) {
    if (value < COPPER_MAT.NONE.value)         return COPPER_MAT.NONE.name;
    if (value < COPPER_MAT.POOR.value)         return COPPER_MAT.POOR.name;
    if (value < COPPER_MAT.MODERATE.value)     return COPPER_MAT.MODERATE.name;
    if (value < COPPER_MAT.FINE.value)         return COPPER_MAT.FINE.name;
    return COPPER_MAT.PURE.name;
}

function surveyLocation( x, y ) {
    let result = getMatValue(x, y);
   
    return getMaterialName(result);
}

function drawMaterial( x, y ) {
    // let result = surveyLocation(x, y);
    
    loc_x = x * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);
    loc_y = y * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);

    // console.log(`x: ${loc_x} y: ${loc_y} :: avatar x: ${avatarLocation[0]} y: ${avatarLocation[1]}`);

    let result = getMatValue(x, y);

    let color = getMaterialColor(result);
    let stroke = getMaterialStroke(result);
    
    clearUI();
    if (color[0] === 0 && color[1] === 0 && color[2] === 0 ) {
        MATERIALS_CTX.strokeStyle = 'rgba(0,0,0,0.3)';
        MATERIALS_CTX.beginPath();
        MATERIALS_CTX.arc( loc_x + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), loc_y + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), (LAND._PIXEL_SIZE/LAND._GRID_SIZE)/2-1, 0, 2 * Math.PI );
        MATERIALS_CTX.stroke();
    } else {
        MATERIALS_CTX.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        MATERIALS_CTX.strokeStyle = `rgb(${stroke[0]}, ${stroke[1]}, ${stroke[2]})`;
        MATERIALS_CTX.beginPath();
        MATERIALS_CTX.arc( loc_x + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), loc_y + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), (LAND._PIXEL_SIZE/LAND._GRID_SIZE)/2-1, 0, 2 * Math.PI );
        MATERIALS_CTX.fill();
        MATERIALS_CTX.stroke();
    }
}

function clearMaterials() {
    COPPER.seed();
    MATERIALS_CTX.clearRect(0,0,MATERIALS_CANVAS.width, MATERIALS_CANVAS.height);
}

// Calculate Material Yield
function getMatValue( x, y ) {
    let coord = LAND.convertCoordinates( x, y );
    let copper = COPPER.get( coord.x, coord.y );
    let land = LAND._map.get( coord.x, coord.y );
    let result = copper + land;
    return result;
}

class Material {
    constructor(canvas) {
        this._CANVAS = canvas;
        this._CTX = this._CANVAS.getContext('2d');
        this._CANVAS.width = this._CANVAS.height = 512;

        this._map = new Perlin();
        this._map = [];
    }
    checkForMaterial( type, x, y ) {
        let coord = LAND.convertCoordinates( x, y );
        let copper = COPPER.get( coord.x, coord.y );
        let land = LAND._map.get( coord.x, coord.y );
        let result = copper + land;
        return result;
    }

}

class Resource {
    constructor( stroke, color, name, type, properties ) {
        this._stroke = stroke;
        this._color = color;
        this._name = name;
        this._type = type;
        this._properties = properties;
    }
    get stroke() { return this._stroke; }
    get color() { return this._color; }
    get name() { return this._name; }
    get properties() { return this._properties; }
    hasType( type ) {
        return this._type.some( e => e === type );
    }
}

let properties = {
    conduction:     0,
    density:        0,
    malleable:      0,
    ductile:        0,
    meltingpoint:   0,
    sonorous:       0,
    luster:         0
}