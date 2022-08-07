'use strict'
const COL = [80,100,40];
class Dungeon {
    constructor( canvas, parent ) {
        this._CANVAS = canvas;
        this._prnt = parent;
        this._CTX = this._CANVAS.getContext('2d');
        this._CANVAS.width = this._CANVAS.height = 512;
        this._GRID_SIZE = 3;
        this._RESOLUTION = 7;
        this._PIXEL_SIZE = this._CANVAS.width / this._RESOLUTION;
        this._NUM_PIXELS = this._GRID_SIZE / this._RESOLUTION;
        this.PIXEL = this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE;           
        this._pos = { x: 0, y: 0 };
        this._camera = { x: 0, y: 0 };
        this._range = 5;

        // For mining
        this._min = 0.30;
    }
    get range() {
        return this._range;
    }
    get pos() {
        return this._pos;
    }
    convertCoordinates( x, y ) {
        let loc_x = x * this._PIXEL_SIZE / this._CANVAS.width;
        let loc_y = y * this._PIXEL_SIZE / this._CANVAS.width;
        return { x: loc_x, y: loc_y };
    }
    draw( x, y, color ) {
        const COORD = this.convertCoordinates( this._pos.x, this._pos.y );
        this._CTX.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        this._CTX.fillRect(
            (COORD.x + x) / this._GRID_SIZE * this._CANVAS.width,
            (COORD.y + y) / this._GRID_SIZE * this._CANVAS.width,
            this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE,
            this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE
        );
    }
    genMapRadius( x, y, r ) {                                                   // Generate map data based on vision radius & sight-lines
        const INC = this._NUM_PIXELS / this._GRID_SIZE;
        const MATRIX = spiral(r);                                               // Generate viewing cells as spiral
        const CHK = new Array(DATA.directions.length).fill(true);               // Create array of view directions to check vision
        const LAST = { dir: 0, ring: 0, chk: false };                           // Track previous view for comparison
        MATRIX.forEach( (loc, i) => {
            if (Math.abs(loc[0]) + Math.abs(loc[1]) <= r + (r/2)) {
                const DIR = degAsCardinalNum( 
                    Math.direction( x, y, x + loc[0], y + loc[1]));             // Convert to DATA.directions number
                const DIR_TEXT = degAsText( 
                    Math.direction( x, y, x + loc[0], y + loc[1])); 
                if ( DIR !== LAST.dir ) CHK[LAST.dir] = LAST.chk;               // Only commit results when changing direction
                if ( Math.abs(loc[0]) > LAST.ring || 
                    Math.abs(loc[1]) > LAST.ring ) {                            // If stepped out a ring layer then treat as above
                    CHK[LAST.dir] = LAST.chk;
                }                                                               
                if (!CHK[DIR]) return;                                          // Don't draw if view is blocked
                const TDR = {       
                    x: Number(((x + loc[0]) * INC).toFixed(3)), 
                    y: Number(((y + loc[1]) * INC).toFixed(3))
                };                                                              // Convert loc to map coord                
                const MAP_X = (TDR.x % 1 !== 0) ? (TDR.x).toFixed(3) : TDR.x;   // Cull unneeded decimals
                const MAP_Y = (TDR.y % 1 !== 0) ? (TDR.y).toFixed(3) : TDR.y;
                
                const RES = this._map.get(MAP_X,MAP_Y);                         // Get or generate map data
                this._mats.get(MAP_X,MAP_Y);                                    // Generate materials data
                if (i===0) return;                                              // Don't perform occlusion on standing cell
                if ( RES > 0 ) {                                                // Record vision block for next cycle
                    LAST.dir = DIR; 
                    LAST.chk = false; 
                    LAST.ring = Math.max(Math.abs(loc[0]), Math.abs(loc[1]));   // Check if the spiral has stepped out a layer
                }                                                               
                // console.log(`${i}: ${DIR} ${DIR_TEXT} - ${LAST.dir} : ${LAST.chk} : ${LAST.ring}`);  
                // console.log(`${dir} ${dirText} - ${loc[0]},${loc[1]} - ${res} ${CHK}`); 
            }
        });  
    }
    clear() {
        this._CTX.clearRect(0,0,this._CANVAS.width, this._CANVAS.height);
    }
    move( dir ) {
        const updatePOS = ( x, y ) => {
            const INC = this._NUM_PIXELS / this._GRID_SIZE; 
            const TMP = {       
                x: Number(((this._pos.x + x) * INC).toFixed(3)), 
                y: Number(((this._pos.y + y) * INC).toFixed(3))
            };       
            const MAP_X = (TMP.x % 1 !== 0) ? TMP.x.toFixed(3) : TMP.x;          
            const MAP_Y = (TMP.y % 1 !== 0) ? TMP.y.toFixed(3) : TMP.y;
            const MAP = this._map.read( MAP_X, MAP_Y );                         // Get cell data from next cell
            const MAT = this._mats.read( MAP_X, MAP_Y );
            if ( MAT >= this._min ) {                                           // Try Mining
                this.mine(MAP_X,MAP_Y,MAT);
                this.genMapRadius(this._pos.x, this._pos.y, this.range);
                this.drawMap();
                this.drawAvatar();
            }
            if ( MAP >= 0 ) return;                                             // Cannot walk through walls
            this._pos.x = this._pos.x + x;
            this._pos.y = this._pos.y + y;
            if ( this._pos.x === 0 && this._pos.y === 0 ) {
                this._prnt.exit();
            } else {
                this.genMapRadius(this._pos.x, this._pos.y, this.range);
                this.drawMap();
                this.drawAvatar();
            }
        }
        switch (dir) {
            case NAV.North:     updatePOS( 0, -1 );     break;
            case NAV.South:     updatePOS( 0, 1 );      break;
            case NAV.East:      updatePOS( 1, 0 );      break;
            case NAV.West:      updatePOS( -1, 0 );     break;
            case NAV.NorthWest: updatePOS( -1, -1 );    break;
            case NAV.NorthEast: updatePOS( 1, -1 );     break;
            case NAV.SouthEast: updatePOS( 1, 1 );      break;
            case NAV.SouthWest: updatePOS( -1, 1 );     break;
            default: break;
        }
    }
    drawMap() {
        this.clear();                                                           // Clear the screen
        const POS = this._pos;                                                  // Player position
        const INC = this._NUM_PIXELS / this._GRID_SIZE;                         // Pixel increment
        const OFF = Math.floor((this._GRID_SIZE * this._RESOLUTION) / 2 ) * INC;// Offset to center of grid
        const P = this.PIXEL;
        const C = this._CTX;
        const DOOR =    `rgb(255,255,  0)`;
        const WALL =    `rgb(115,115,115)`;
        const WHITE =   `rgb(100,100, 10)`;
        const FLOOR =   `rgb( 30, 40, 30)`;
        const DARK =    `rgb(  0,  0,  0)`;
        for ( let y = 0; y < this._GRID_SIZE; y += INC ){                       
            for ( let x = 0; x < this._GRID_SIZE; x += INC ){
                const TDR = {                                                   // Center the target based on player loc to get map data
                    x: Number((( x - OFF ) + ( POS.x * INC )).toFixed(3)),
                    y: Number((( y - OFF ) + ( POS.y * INC )).toFixed(3))
                };                                                              
                const MAP_X = (TDR.x % 1 !== 0) ? TDR.x.toFixed(3) : TDR.x;          
                const MAP_Y = (TDR.y % 1 !== 0) ? TDR.y.toFixed(3) : TDR.y;
                const MAP = this._map.read( MAP_X, MAP_Y );                     // Read the map data: -100 if none
                const MAT = this._mats.read( MAP_X, MAP_Y );                    // Read materials data
                const LOC = {  
                    x: x / this._GRID_SIZE * this._CANVAS.width,
                    y: y / this._GRID_SIZE * this._CANVAS.width
                }
                const INPUT = Math.max(Math.abs(y-OFF),Math.abs(x-OFF));        // Ugh. Generate sim light fall off
                const DRP_OFF = (((Math.abs(y-OFF)+
                                   Math.abs(x-OFF))/INC)/(INC*this.range))/2;
                const SHD = Math.lerp(0,-(Math.clamp(DRP_OFF,0, 2)), 
                                            INPUT/this._GRID_SIZE);             // Shaded version of color
                switch (MAP) {
                    case -100:
                        C.fillStyle = DARK;
                        C.fillRect(LOC.x,LOC.y,P,P);
                        break;
                    case -10:                                                   // Exit Door
                        C.fillStyle=shadeRGB(DOOR,SHD);
                        C.fillRect(LOC.x,LOC.y,P,P);
                        break;
                    default:
                        if ( MAP < 0 ) {                                            
                            C.fillStyle = shadeRGB(FLOOR,SHD);                  // Floor
                            C.fillRect(LOC.x,LOC.y,P,P);  
                        } else {               
                            if (MAT >= this._min) { 
                                const SI = P/2;
                                const K = this.resource(MAT);
                                C.fillStyle = shadeRGB(WALL,SHD);               // Wall
                                C.fillRect(LOC.x,LOC.y,P,P);                    
                                C.fillStyle = 
                                    shadeRGB(`rgb(${K.col[0]},
                                             ${K.col[1]},${K.col[2]})`,SHD);    // Material Color
                                C.beginPath();
                                C.arc(LOC.x+SI,LOC.y+SI,SI/2,0,2*Math.PI);
                                C.fill();
                                C.strokeStyle = shadeRGB(WHITE,SHD);            // Mat Stroke
                                C.stroke();
                            } else {
                                this._CTX.fillStyle=shadeRGB(WALL,SHD);         // Wall
                                this._CTX.fillRect(LOC.x,LOC.y,P,P);  
                            }
                        }
                        break;
                }
            }
        }
    }
    drawAvatar() {
        const SIZE = this._RESOLUTION * this._GRID_SIZE;                        // WIDTH & HEIGHT OF GRID
        const PIXEL = this.PIXEL;                                               // PIXEL SIZE
        // this._CTX.strokeStyle = 'rgb(60,60,60)';
        // for (let x = 0; x < SIZE; x++) {
        //     for (let y = 0; y < SIZE; y++) {
        //         this._CTX.strokeRect( x * PIXEL, y * PIXEL, PIXEL, PIXEL );            
        //     }
        // }
        this._CTX.strokeStyle = 'white';
        this._CTX.strokeRect( 
                    PIXEL * ((SIZE-1)/2), 
                    PIXEL * ((SIZE-1)/2), PIXEL, PIXEL );                       // SIZE-1 / 2 is half the grid
    }
    init() {
        if ( this._map === undefined ) {
            this._map = new Perlin((this._prnt.loc.x*this._prnt.loc.y)+SEED);
            this._mats = new Perlin(SEED+(this._prnt.loc.x*this._prnt.loc.y));
        }        
        this.genMapRadius( this._pos.x, this._pos.y, this.range);
        this._map.memory[["0,0"]] = -10;
        this.drawMap();
        this.drawAvatar();
    }
    resource( value ) {                                                         // Generate resource type
        value = convertRange(value,this._min,1-this._min,0,1);
        if ( value <= 0.3 ) { return { col: [194,115,51],  name: "copper"  }}   // copper
        if ( value <= 0.4 ) { return { col: [197,201,199], name: "tin"     }}   // tin
        if ( value <= 0.5 ) { return { col: [48,49,47],    name: "lead"    }}   // lead
        if ( value <= 0.8 ) { return { col: [125,125,125], name: "iron"    }}   // iron
        if ( value <= 0.9 ) { return { col: [77,79,78],    name: "silver"  }}   // silver
        if ( value <= 1.0 ) { return { col: [255,223,0],   name: "gold"    }}   // gold    
        console.log("ERROR"); return [255,255,255];                             // Error
    }
    mine( x, y ) {
        const value = this._mats.read( x, y );
        if (value === undefined) return;
        const RES = this.resource( value );
        if ( !avatar.currentItemHas("Mine")) {
            updateLog(`You see a vein of minable ${RES.name} in the rock`);
            return;
        }
        updateLog(`You have mined ${RES.name} ore.`);
        this._mats.memory[[`${x},${y}`]] = -1;
        this._map.memory[[`${x},${y}`]] = -1;
        avatar.addToInventory(new Item(createMaterialItem(RES.name)));
        gameUpdate();
    }
}

//    this._CTX.font = `${60*INC}px monospace`;
//    this._CTX.fillStyle = "white";
//    this._CTX.textAlign = "center";
//    this._CTX.fillText(`${(MAT-this._min).toFixed(4)}`, LOC.x + (this.PIXEL/2), LOC.y + (this.PIXEL/1.05)); 