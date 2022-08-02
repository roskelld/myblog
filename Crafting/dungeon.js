'use strict'
const DGN_CVS = document.querySelector("#content");
const SEED = 3108197869694201;
const COL = [80,100,40];

class Dungeon {
    constructor( canvas ) {
        this._CANVAS = canvas;
        this._CTX = this._CANVAS.getContext('2d');
        this._CANVAS.width = this._CANVAS.height = 512;
        this._GRID_SIZE = 3;
        this._RESOLUTION = 5;
        this._PIXEL_SIZE = this._CANVAS.width / this._RESOLUTION;
        this._NUM_PIXELS = this._GRID_SIZE / this._RESOLUTION;
        this.PIXEL = this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE;   
        this._map = new Perlin( SEED );
        this._pos = { x: 0, y: 0 };
        this._camera = { x: 0, y: 0 };
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
    drawRadius( x, y, r ) {
        const POS = this._pos;
        const INC = this._NUM_PIXELS / this._GRID_SIZE; 
        for (let ox = 0 - r; ox <= r; ox++) {
            for(let oy = 0 - r; oy <= r; oy++) {
                if (Math.abs(ox) + Math.abs(oy) <= r + (r/2)) {                 // Manage shitty circle radius

                    // let tmp = { x: (x-OFF)+(POS.x*INC), y: (y-OFF)+(POS.y*INC) };
                    let tmp = {       
                        x: Number(((POS.x + ox) * INC).toFixed(3)), 
                        y: Number(((POS.y + oy) * INC).toFixed(3))
                    };       
                    //  Convert current cell to Map Data
                    const MAP_X = (tmp.x % 1 !== 0) ? (tmp.x).toFixed(3) : tmp.x;          
                    const MAP_Y = (tmp.y % 1 !== 0) ? (tmp.y).toFixed(3) : tmp.y;
                    
                    // console.log( `${ox},${oy}`);
                    // console.log( `${MAP_X},${MAP_Y}`);
                    this._map.get( MAP_X, MAP_Y );   
                }
            }
        }
    }
    clear() {
        this._CTX.clearRect(0,0,this._CANVAS.width, this._CANVAS.height);
    }
    camera( x, y ) {
        // console.log( x );
        // x = (x / this._GRID_SIZE * this._CANVAS.width) - (this._pos.x + this._camera.y)
        // y = (y / this._GRID_SIZE * this._CANVAS.width) - (this._pos.y + this._camera.y)

        const RES = this.convertCoordinates( 
                                (this._pos.x - this._camera.x) + x, 
                                (this._pos.y - this._camera.y) + y );
        return { x: RES.x, y: RES.y } 
    }
    move( dir ) {
        dir = dir.key;
        const updatePOS = ( x, y ) => {
            const INC = DGN._NUM_PIXELS / DGN._GRID_SIZE; 
            let tmp = {       
                x: Number(((this._pos.x + x) * INC).toFixed(3)), 
                y: Number(((this._pos.y + y) * INC).toFixed(3))
            };       
            const MAP_X = (tmp.x % 1 !== 0) ? tmp.x.toFixed(3) : tmp.x;          
            const MAP_Y = (tmp.y % 1 !== 0) ? tmp.y.toFixed(3) : tmp.y;
            const MAP = this._map.read( MAP_X, MAP_Y );                         // Get cell data from next cell
            if ( MAP > 0 ) return;                                              // Cannot walk through walls

            this._pos.x = this._pos.x + x;
            this._pos.y = this._pos.y + y;
        }

        switch (dir) {
            case "w": case "8": case "ArrowUp": updatePOS( 0, -1 ); break;
            case "s": case "2": case "ArrowDown": updatePOS( 0, 1 ); break;
            case "d": case "6": case "ArrowRight": updatePOS( 1, 0 ); break;
            case "a": case "4": case "ArrowLeft": updatePOS( -1, 0 ); break;
            case "6": updatePOS( 1, 0 ); break;
            case "7": updatePOS( -1, -1 ); break;
            case "9": updatePOS( 1, -1 ); break;
            case "3": updatePOS( 1, 1 ); break;
            case "1": updatePOS( -1, 1 ); break;
            default: break;
        }

        this.drawRadius( this._pos.x, this._pos.y, 2);
        this.drawMap();
        this.drawAvatar()
    }
    drawMap() {
        this.clear();        
        let C = [COL[0],COL[1],COL[2]];
        const POS = this._pos;
        const INC = DGN._NUM_PIXELS / DGN._GRID_SIZE;                         
        const OFF = Math.floor((this._GRID_SIZE * this._RESOLUTION) / 2 ) * INC;
        for ( let y = 0; y < this._GRID_SIZE; y += INC ){                       // GRID 4
            for ( let x = 0; x < this._GRID_SIZE; x += INC ){
                let tmp = { 
                    x: Number((( x - OFF ) + ( POS.x * INC )).toFixed(3)),
                    y: Number((( y - OFF ) + ( POS.y * INC )).toFixed(3))
                };                                                              // Recenter using OFF and add position offset based on increment
                const MAP_X = (tmp.x % 1 !== 0) ? tmp.x.toFixed(3) : tmp.x;          
                const MAP_Y = (tmp.y % 1 !== 0) ? tmp.y.toFixed(3) : tmp.y;
                const MAP = this._map.read( MAP_X, MAP_Y );
                
                const LOC = {  
                    x: x / this._GRID_SIZE * this._CANVAS.width,
                    y: y / this._GRID_SIZE * this._CANVAS.width
                }

                let ALPHA = 0;//h % 2 * 255;
                ALPHA = ( MAP > 0 ) ? 255 : 0;
                
                if ( MAP === -100 ) {
                    C[0] = C[1] = C[2] = 0; 
                    ALPHA = 255;                   
                } else 
                {
                    C = [COL[0],COL[1],COL[2]];
                }
                this._CTX.fillStyle = `rgba(${C[0]},${C[1]},${C[2]},${ALPHA})`;
                this._CTX.fillRect( LOC.x, LOC.y, this.PIXEL, this.PIXEL );

                // this._CTX.font = `${70*INC}px monospace`;
                // this._CTX.fillStyle = "white";
                // this._CTX.textAlign = "center";
                // this._CTX.fillText(`${MAP_X},${MAP_Y}`, LOC.x + (this.PIXEL/2), LOC.y + (this.PIXEL/1.05)); 
            }
        }
    }
    drawAvatar() {
        const SIZE = this._RESOLUTION * this._GRID_SIZE;                        // WIDTH & HEIGHT OF GRID
        const PIXEL = this.PIXEL;                                               // PIXEL SIZE
        this._CTX.strokeStyle = 'rgb(60,60,60)';
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                this._CTX.strokeRect( x * PIXEL, y * PIXEL, PIXEL, PIXEL );            
            }
        }
        this._CTX.strokeStyle = 'white';
        this._CTX.strokeRect( 
                    PIXEL * ((SIZE-1)/2), 
                    PIXEL * ((SIZE-1)/2), PIXEL, PIXEL );                       // SIZE-1 / 2 is half the grid
    }
}

const DGN = new Dungeon( DGN_CVS );
window.addEventListener("keydown", e => DGN.move(e), false );
DGN.drawRadius( DGN._pos.x, DGN._pos.y, 2);
DGN.drawMap();
DGN.drawAvatar();

