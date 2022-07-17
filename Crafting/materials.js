// Content UI
const YIELD = {
    NONE: {
        value:  0,
        stroke: [0,0,0],
        string: "none"
    },
    POOR: {
        value:  0.3,
        stroke: [185,119,70],
        string: "poor"
    },
    MODERATE: {
        value:  0.5,
        stroke: [201,146,54],
        string: "moderate"
    },
    PLENTY: {
        value:  0.8,
        stroke: [220,192,35],
        string: "plenty"
    },
    RICH: {
        value: 1,
        stroke: [219,159,36],
        string: "rich"
    }
}

class Material {
    constructor(canvas) {
        this._CANVAS = canvas;
        this._CTX = this._CANVAS.getContext('2d');
        this._CANVAS.width = this._CANVAS.height = 512;
        this._resources = [];
    }

    addResource( resource ) {
        this._resources.push( resource );
    }
    getResourceValueAtLocation( name, x, y ) {
        let loc = LAND.convertCoordinates( x, y );

        // Search through all resources to find match
        let found = this._resources.find( e => e.name === name );
        // console.log( found )
        let resource = 0;
        if ( found ) resource = found.getValue( x, y );
        
        // Calculate yield
        // let land = LAND._map.get( loc.x, loc.y );
        // let result = resource + land;
        let result = resource;
        return result;
    }
    getResourceDescriptionAtLocation( name, x, y ) {
        let value = this.getResourceValueAtLocation( name, x, y );
        if ( value <= YIELD.NONE.value )        return YIELD.NONE.string;
        if ( value <= YIELD.POOR.value )        return YIELD.POOR.string;
        if ( value <= YIELD.MODERATE.value )    return YIELD.MODERATE.string;
        if ( value <= YIELD.PLENTY.value )      return YIELD.PLENTY.string;
        if ( value <= YIELD.RICH.value )        return YIELD.RICH.string;

    }
    getResource( name ) {
        let resource = this._resources.find( e => e.name === name );
        if ( resource ) return resource;
        return null;
    }
    drawResource( name, x, y ) {
        // Get Resource for info
        let resource = this.getResource( name );
        // Get amount (%) of resource
        let result = this.getResourceValueAtLocation( name, x, y );
        // Do some goofy coordinate calculation that shouldn't be so shit
        let loc_x = x * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);
        let loc_y = y * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);
      
        // Draw results
        if ( result > 0 ) {
            this._CTX.clearRect( loc_x,
                                 loc_y,
                                 (LAND._PIXEL_SIZE/LAND._GRID_SIZE), (LAND._PIXEL_SIZE/LAND._GRID_SIZE));
            this._CTX.fillStyle = `rgba(${resource.color[0]}, ${resource.color[1]}, ${resource.color[2]}, ${1})`;
            this._CTX.strokeStyle = `rgb(${resource.stroke[0]}, ${resource.stroke[1]}, ${resource.stroke[2]})`;
            this._CTX.beginPath();
            this._CTX.arc(  loc_x + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), 
                            loc_y + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), (LAND._PIXEL_SIZE/LAND._GRID_SIZE)/2-1, 0, 2 * Math.PI );
            this._CTX.fill();
            this._CTX.stroke();
        } else {
            this._CTX.clearRect( loc_x,
                                loc_y,
                                (LAND._PIXEL_SIZE/LAND._GRID_SIZE), (LAND._PIXEL_SIZE/LAND._GRID_SIZE));

            this._CTX.strokeStyle = 'rgba(0,0,0,0.3)';
            this._CTX.beginPath();
            this._CTX.arc(  loc_x + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), 
                            loc_y + (LAND._PIXEL_SIZE/LAND._GRID_SIZE/2), (LAND._PIXEL_SIZE/LAND._GRID_SIZE)/2-1, 0, 2 * Math.PI );
            this._CTX.stroke();
        }
        return result;
    }
    clear() {
        this._CTX.clearRect(0,0, this._CANVAS.width, this._CANVAS.height);
        this._resources.forEach( e => e._map.seed() );
    }
    removeResource( name, x, y ) {
        let value = this.getResourceValueAtLocation( name, x, y );
        let resource = this.getResource( name );
        let loc = LAND.convertCoordinates( x, y );
        // Reduces the resource by 10%
        // resource._map.memory[[loc.x, loc.y]] -= ( value * 0.1 );

        // Remove 0.1 -- That's 10 max per mine 
        let update = Number(value.toFixed(2)) - 0.1;
        resource._map.memory[[loc.x, loc.y]] = update;
        
        this.drawResource( name, x, y );
        return value;
    }
}

class Resource {
    constructor( name, stroke, color, type, properties ) {
        this._name = name;
        this._stroke = stroke;
        this._color = color;
        this._type = type;
        this._properties = properties;
        
        // Distribution of resource
        this._map = new Perlin(); 
    }
    get stroke() { return this._stroke; }
    get color() { return this._color; }
    get name() { return this._name; }
    get properties() { return this._properties; }
    getValue(x,y) {
        let loc = LAND.convertCoordinates( x, y );
        let value = this._map.get( loc.x, loc.y );
        let result = ( value <= 0 ) ? 0 : value;
        return result;
    }
    hasType( type ) {
        return this._type.some( e => e === type );
    }
    hasProperty( property ) {
        return Object.keys(this.properties).includes( property );
    }
    getPropertyValue( property ) {
        // Return ZERO if doesn't have property
        if ( !Object.keys(this.properties).includes( property ) ) return 0;
        return this.properties[property];
    }
}
