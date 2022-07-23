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
    getResource( name ) {
        let resource = this._resources.find( e => e.name === name );
        if ( resource ) return resource;
        return null;
    }
    getResourceValueAtLocation( name, x, y ) {
        // Search through all resources to find match
        let found = this._resources.find( e => e.name === name );
        let resource = 0;
        if ( found ) resource = found.getSupply( x, y );
        return resource;
    }
    getResourceDescriptionAtLocation( name, x, y ) {
        let value = this.getResourceValueAtLocation( name, x, y );
        if ( value <= YIELD.NONE.value )        return YIELD.NONE.string;
        if ( value <= YIELD.POOR.value )        return YIELD.POOR.string;
        if ( value <= YIELD.MODERATE.value )    return YIELD.MODERATE.string;
        if ( value <= YIELD.PLENTY.value )      return YIELD.PLENTY.string;
        if ( value <= YIELD.RICH.value )        return YIELD.RICH.string;
    }
    drawResource( name, x, y ) {
        // Get Resource for info
        const RESOURCE = this.getResource( name );    
        const LOC = LAND.convertCoordinates( x, y );
        RESOURCE.drawResource( LOC.x , LOC.y );
        return RESOURCE.getSupply( x, y );
    }
    clear() {
        this._CTX.clearRect(0,0, this._CANVAS.width, this._CANVAS.height);
        this._resources.forEach( e => e._map.seed() );
    }
    removeResourceSupply( name, x, y, count ) {
        let resource = this.getResource( name );
        let value = resource.removeSupply( x, y, count )

        // update this so it's not called here
        this.drawResource( name, x, y );
        return value;
    }
}

class Resource {
    constructor( name, stroke, color, type, clamp_min, 
                clamp_spread, pocket_density, land_influence, 
                properties, min_supply = 5 ) {
        
        this._name = name;
        this._stroke = stroke;
        this._color = color;
        this._type = type;
        this._properties = properties;
        
        this._clamp_min = clamp_min;
        this._clamp_spread = clamp_spread;
        this._clamp_max = Math.min( clamp_min + clamp_spread, 1 );

        // Lower = More Resources (0.00001 to 0.5)
        this._pocket_density = pocket_density; 

        // 0 - 1 how much the land itself influences the material placement
        this._land_influence = land_influence; 
        
        // Distribution of resource
        this._map = new Perlin(); 
        
        // Lowest acceptable amount
        // Will loop if below min supply
        this._min_supply = min_supply;          
        this._try_error = 0;                    
        this._try_error_max = 3;

        this._memory = {};                                                      // Resource Supply Memory
        // Create the mats
        // this.generateMap();
    }
    get stroke() { return this._stroke; }
    get color() { return this._color; }
    get name() { return this._name; }
    get properties() { return this._properties; }
    get total() { 
        let count = 0;
        Object.values(this._memory).forEach( e => { 
            if ( e !== undefined ) count += e 
        });  
        return count;
    }
    getSupply( x, y ) {        
        const LOC = LAND.convertCoordinates( x, y );                            // Convert from avatar location to land cords
        const SUPPLY = this._memory[[LOC.x,LOC.y]];                             // Pull supply count from memory
        return ( SUPPLY === undefined ) ? 0 : SUPPLY                            // return 0 if non or amount
    }
    removeSupply( x, y, count ) {
        const LOC = LAND.convertCoordinates( x, y );                            // Convert from avatar location to land cords
        const SUPPLY = this.getSupply( x, y );                                  // Pull supply count from memory
        
        if ( count >= SUPPLY ) {                                                // If requesting more than supply just return supply
            delete this._memory[[`${LOC.x},${LOC.y}`]];                         // Delete the entry
            this.clearResourceSpot( x, y ) ;                                    // Clear the graphic
            return SUPPLY;
        } else {
            this._memory[[LOC.x, LOC.y]] -= count;
            return count;
        }
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
    generateMap( reset = false ) {
        if ( reset ) {
            this.clearDraw();
            this._map.seed();
            this._memory = {};
        }
        let total_supply = 0;
        const INC = LAND._NUM_PIXELS / LAND._GRID_SIZE;                         // coord increment value
        for ( let y = 0; y < LAND._GRID_SIZE; y += INC ){
            for ( let x = 0; x < LAND._GRID_SIZE; x += INC ){
                let rv = this._map.get(x, y);                                   // Get stored resource value
                let lv = LAND._map.get(x, y);                                   // Get stored land value
                let cv = null;

                // Calculated distribution value
                if ( rv !== null ){                    
                    cv = Math.lerp( rv, lv, this._land_influence );             // Blend two values to bring influence from land height
                }    

                const TOTAL = Math.floor( 
                                    Math.abs(rv) / this._pocket_density );      // Calculate total num resources

                if ( cv < this._clamp_min || 
                     cv > this._clamp_max || 
                     TOTAL <= 0 ) {                                             // If the value is outside of the accepted ranges
                    this._map.memory[[x,y]] = null;
                } else {                               
                    this._memory[[x,y]] = TOTAL;                                // Record resource value to memory
                    total_supply += TOTAL;
                }
            }    
        }
        
        if ( total_supply < this._min_supply 
             && this._try_error <= this._try_error_max ) {                      // Check if failed to create above min required
            
            this._try_error++;
            this.generateMap(true);
        } else {
            this._try_error = 0;
            console.log(`${this._name} total: ${total_supply}`);
        }
    }
    drawMap() {
        const INC = LAND._NUM_PIXELS / LAND._GRID_SIZE;                         // coord increment value

        for ( let y = 0; y < LAND._GRID_SIZE; y += INC ){
            for ( let x = 0; x < LAND._GRID_SIZE; x += INC ){
                this.drawResource( x,y );
            }    
        }
    }
    drawResource(x,y) {  
        if ( this._memory[[x,y]] === undefined ) return;                        // Only draw if resource exists
        MAT._CTX.fillStyle = `rgba(${this._color[0]},
                              ${this._color[1]},
                              ${this._color[2]},1)`; 
        MAT._CTX.strokeStyle = `rgb(${0}, ${0}, ${0})`;

        x = (x / LAND._GRID_SIZE * LAND._CANVAS.width) + LAND._GRID_SIZE;       // Convert coords to map
        y = (y / LAND._GRID_SIZE * LAND._CANVAS.width) + LAND._GRID_SIZE;
        const RADIUS = LAND._PIXEL_SIZE/LAND._GRID_SIZE/2-1;
        const END_ANGLE = 2 * Math.PI;
                        
        MAT._CTX.beginPath();
        MAT._CTX.arc( x, y, RADIUS, 0, END_ANGLE );
        MAT._CTX.fill();
        MAT._CTX.stroke();
    }
    clearDraw() {
        const INC = LAND._NUM_PIXELS / LAND._GRID_SIZE;                         // coord increment value

        for ( let y = 0; y < LAND._GRID_SIZE; y += INC ){
            for ( let x = 0; x < LAND._GRID_SIZE; x += INC ){
      
                if ( this._memory[[x,y]] !== undefined ) {
                    MAT._CTX.fillStyle = 
                            `rgba(${this._color[0]},
                            ${this._color[1]},
                            ${this._color[2]},1)`;
                    MAT._CTX.strokeStyle = `rgb(${0}, ${0}, ${0})`;
    
                    let x_pos = ( x / LAND._GRID_SIZE * LAND._CANVAS.width );
                    let y_pos = ( y / LAND._GRID_SIZE * LAND._CANVAS.width );

                    MAT._CTX.clearRect( 
                        x_pos, y_pos,
                        (LAND._PIXEL_SIZE/LAND._GRID_SIZE), 
                        (LAND._PIXEL_SIZE/LAND._GRID_SIZE));
                }
            }    
        }
    }
    clearResourceSpot( x, y ) {
        x = x * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);
        y = y * (LAND._PIXEL_SIZE / LAND._GRID_SIZE);

        MAT._CTX.clearRect( 
            x, y,
            LAND._PIXEL_SIZE/LAND._GRID_SIZE, 
            LAND._PIXEL_SIZE/LAND._GRID_SIZE);
    }
}
