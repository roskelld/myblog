'use strict'
// const DGN_CVS = document.querySelector("#content");
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
        dir = dir.key;
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
            if ( MAT >= 0.30 ) {
                console.log( "WE MINE!");
                this._mats.memory[[`${MAP_X},${MAP_Y}`]] = -1;
                this._map.memory[[`${MAP_X},${MAP_Y}`]] = -1;
            }
            if ( MAP >= 0 ) return;                                             // Cannot walk through walls
            this._pos.x = this._pos.x + x;
            this._pos.y = this._pos.y + y;
        }
        switch (dir) {
            case "w": case "8": updatePOS( 0, -1 ); break;
            case "s": case "2": updatePOS( 0, 1 ); break;
            case "d": case "6": updatePOS( 1, 0 ); break;
            case "a": case "4": updatePOS( -1, 0 ); break;
            case "6": updatePOS( 1, 0 ); break;
            case "7": updatePOS( -1, -1 ); break;
            case "9": updatePOS( 1, -1 ); break;
            case "3": updatePOS( 1, 1 ); break;
            case "1": updatePOS( -1, 1 ); break;
            default: break;
        }
        this.genMapRadius( this._pos.x, this._pos.y, this.range);
        this.drawMap();
        this.drawAvatar();
        if ( this._pos.x === 0 && this._pos.y === 0 ) this.exit();
    }
    drawMap() {
        this.clear();                                                           // Clear the screen
        const POS = this._pos;                                                  // Player position
        const INC = this._NUM_PIXELS / this._GRID_SIZE;                           // Pixel increment
        const OFF = Math.floor((this._GRID_SIZE * this._RESOLUTION) / 2 ) * INC;// Offset to center of grid
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
                        this._CTX.fillStyle = `rgb(0,0,0)`;
                        this._CTX.fillRect(LOC.x,LOC.y,this.PIXEL,this.PIXEL);
                        break;
                    case -10:
                        this._CTX.fillStyle=shadeRGBColor(`rgb(255,255,0)`,SHD);
                        this._CTX.fillRect(LOC.x,LOC.y,this.PIXEL,this.PIXEL);
                        break;
                    default:
                        if ( MAP < 0 ) {                                            
                            this._CTX.fillStyle = 
                                        shadeRGBColor("rgb(30,40,30)",SHD);     // Floor
                        } else {               
                            
                            // Draw material if any
                            if (MAT >= 0.30) { 
                                this._CTX.fillStyle = 
                                    shadeRGBColor("rgb(212,175,55)",SHD);       // Material
                            } else {
                                this._CTX.fillStyle = 
                                    shadeRGBColor("rgb(115,115,115)",SHD);      // Wall
                            }
                        }
                        this._CTX.fillRect(LOC.x,LOC.y,this.PIXEL,this.PIXEL);  // Draw
                        break;
                }

                // this._CTX.font = `${40*INC}px monospace`;
                // this._CTX.fillStyle = "white";
                // this._CTX.textAlign = "center";
                // this._CTX.fillText(`${MAP_X},${MAP_Y}`, LOC.x + (this.PIXEL/2), LOC.y + (this.PIXEL/1.05)); 
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
        this._map = new Perlin( (this._prnt.loc.x*this._prnt.loc.y)+SEED );
        this._mats = new Perlin(SEED+(this._prnt.loc.x*this._prnt.loc.y));
        this.genMapRadius( this._pos.x, this._pos.y, this.range);
        this._map.memory[["0,0"]] = -10;
        this.drawMap();
        this.drawAvatar();
        this._abort = new AbortController();                                    // Used to clean up listener on exit
        window.addEventListener("keydown", e => 
                    this.move(e), { signal: this._abort.signal } );
    }
    exit() {
        this._abort.abort();                                                    // Remove keyboard listener
        // Fix all these references to not be hard coded
        LAND.clear();
        LAND.drawSeen();
        drawAvatar();
        setGameMode("general") ;
    }
}