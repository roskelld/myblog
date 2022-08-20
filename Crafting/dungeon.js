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
        this._min = 0.25;                                                       // Mining base value (Lower more resources)
        this.lght_mn = -0.9995;
        this.lght_mx = 0; 
        this.wtr_lv = -0.1;
        this.legend = {
            "floor":                        -118,
            "floor,natural":                -118,                        
            "floor,worked,int":             -110,                        
            "floor,worked,corridor,int":    -110,
            "floor,worked,ext":             -118, 
            "floor,crafted,int":            -108,                        
            "floor,crafted,room":           -126,                        
            "pond":                         -129,                        
            "floor,plant":                  -121,                        
            "wall":                          111,
            "wall,natural":                  111,                        
            "wall,natural,int":              111,
            "wall,worked":                   111,
            "wall,worked,room,int":          111, 
            "wall,worked,corridor,int":      111,  
            "wall,crafted,int":              112,                        
            "door,int":                     -108,
            "light":                       -1001,
        }
        this.tile_selection =            [0,1,2,3,4,5];
        this.prep_chunk_array = {};                                              // Store prepared chunks for use
    }
    get pl_lght_rnge() {                                                        // Return player light range
        const ITMS = avatar.getItemsByType( "light" );
        if (ITMS.length === 0) return 0;
        const FLTR = ITMS.filter( e => e.stats.fuel > 0 );
        FLTR.sort( (a,b) => a.stats.range <= b.stats.range );
        if (FLTR.length > 0) return FLTR[0].stats.range;
        return 0;
    }
    get pos() {                                                                 // Player position
        return this._pos;
    }
    get rndTileType() {
        const ARR = ShuffleArray(this.tile_selection);
        return ARR[0];
    }
    requestWFC( force = false ) {
        if ( !this.last_wfc_request ) this.last_wfc_request = gameTime;        
        const R = Math.rndseed(SEED + Math.round(gameTime));
        const MIN = 0.000001;
        const MAX = 0.025;
        const MAX_TIME = 400;
        const TILE_TYPE = this.rndTileType;
        const CURRENT = gameTime - this.last_wfc_request;

        const RES = convertRange(CURRENT, 0, MAX_TIME, MIN, MAX);

        if ( RES >= R || force ) {

            const CHUNK = this.getChunk( TILE_TYPE );
            if ( CHUNK === null ) {
                switch ( DATA.tile[TILE_TYPE].wfc ) {
                    case "overlap":
                        WFC_OL.start( TILE_TYPE, this.convertWFCToChunk.bind(this) );
                        break;
                    case "simpletile":
                        WFC_T.start( TILE_TYPE, null, this.convertWFCToChunk.bind(this) );
                        break;
                    default:
                        break;
                }
                this.last_wfc_request = gameTime;
            } else {
                console.log("Chunk Generated Trying to Add to Map");
                this.tryAddChunk( CHUNK );
            }

        }
    }
    isChunkEmpty( x, y, width, height ) {
        const MAP = this._map.memory;
        const INC = this._NUM_PIXELS / this._GRID_SIZE;                         // Pixel increment
        const TL = this.toMapCoord( x, y );
        const BL = this.toMapCoord( x, y + height );
        const TR = this.toMapCoord( x + width, y );
        const BR = this.toMapCoord( x + width, y + height );
        if (MAP[[`${TL.x},${TL.y}`]] !== undefined ) return false;              // Check the four corners
        if (MAP[[`${BR.x},${BR.y}`]] !== undefined ) return false;
        if (MAP[[`${TR.x},${TR.y}`]] !== undefined ) return false;
        if (MAP[[`${BL.x},${BL.y}`]] !== undefined ) return false;
        // Check edges
        const M_WIDTH  = TL.x + ( width * INC );
        const M_HEIGHT = TL.y + ( height * INC );
        for (let mx = TL.x; mx < M_WIDTH; mx += INC) {                          // Check the cells
            for (let my = TL.y; my < M_HEIGHT; my += INC) { 
                const TMP = {x: Number(mx.toFixed(3)), y: Number(my.toFixed(3))};
                const MAP_X = (TMP.x % 1 === 0) ? TMP.x.toFixed(0) : TMP.x;     // Gen map x address
                const MAP_Y = (TMP.y % 1 === 0) ? TMP.y.toFixed(0) : TMP.y;     // Gen map y address
                const CELL = MAP[[`${MAP_X},${MAP_Y}`]];
                if (CELL !== undefined) return false;
            }           
        }
        return true;
    }
    addChunkBorder( data, width, border, feather = true ) {
        let len = data.length;
        for (let i = len; i >= width; i-= width) {                              // Add Right
            const C_SPL = ( i === 0 ) ? data[i] : data[i-1];                    // Get adjacent chunk cell            
            const R = [...Array(border)].map( (_,i) => {
                const RND = Math.random();
                const ODDS = 1-i/border*1;
                const BOOST = (C_SPL >= DATA.legend.floor.s 
                               && C_SPL <= DATA.legend.floor.e) ? 0.1 : 0;      // Slightly boost favor for floor
                return ( ODDS + BOOST > RND ) ? C_SPL : -2;                     // Return sample tile or use map data
            });        
            data.splice(i, 0, ...R);
        }
       
        len = data.length;
        width = width + border;
        for (let i = len-width; i >= 0; i-= width) {                            // Add Left
            const C_SPL = ( i === 0 ) ? data[i] : data[i+1];                    // Get adjacent chunk cell
            const L = [...Array(border)].map( (_,i) => {
                const RND = Math.random();
                const ODDS = i/border*1;
                const BOOST = (C_SPL >= DATA.legend.floor.s 
                               && C_SPL <= DATA.legend.floor.e) ? 0.1 : 0;      // Slightly boost favor for floor
                return ( ODDS + BOOST > RND ) ? C_SPL : -2;                     // Return sample tile or use map data
            });        
            data.splice(i, 0, ...L);
        }
        width = width + border;
        const T = [...Array(width*border)].map( (_,i) => {                      // Add Top side
            const C_SPL = data[i % width];                                      // Get adjacent chunk cell
            // console.log(`${C_SPL} data[${i % width}]`);
            const RND = Math.random();
            const BASE = Math.ceil(i/width)/border;                             // lower odds as rows shift up
            const BOOST = (C_SPL >= DATA.legend.floor.s 
                           && C_SPL <= DATA.legend.floor.e) ? 0.1 : 0;          // Slightly boost favor for floor
            const ODDS = Math.min(BASE + BOOST, 0.9);
            return ( ODDS > RND ) ? C_SPL : -2;                                 // Return sample tile or use map data
        });   
        data.splice(0, 0, ...T);
                                         
        len = data.length;
        const B = [...Array(width*border)].map( (_,i) => {                      // Add Bottom side
            const C_SPL = data[len - width + i];                                // Get adjacent chunk cell
            const RND = Math.random();
            const BASE = 1-Math.ceil(i/width)/border;                           // lower odds as rows shift down
            const BOOST = (C_SPL >= DATA.legend.floor.s 
                           && C_SPL <= DATA.legend.floor.e) ? 0.1 : 0;          // Slightly boost favor for floor
            const ODDS = Math.min(BASE + BOOST, 0.9);
            return ( ODDS > RND ) ? C_SPL : -2;                                 // Return sample tile or use map data
        }); 
        data.splice(0, 0, ...B);
        const HEIGHT = len / width;
        if ( Number.isInteger(HEIGHT) ) {
            return { data: data, width: width, height: HEIGHT };
        } else {
            console.error(
                `CHUNK Generation error: Height is not
                 int ${HEIGHT} (Width: ${width} len: ${len})`);
        }
    }
    storeChunk( tile, chunk, width, height, force = false ) {
        if (force) {
            this.prep_chunk_array[[tile]] = { 
                data: chunk, 
                width: width, 
                height: height,
                tile: tile,
            };
            return;
        }
        if ( this.prep_chunk_array[[tile]] !== undefined ) 
            this.prep_chunk_array[[tile]] = { 
                data: chunk, 
                width: width, 
                height: height,
                tile: tile,
            };
    }
    getChunk( tile ) {
        if ( this.prep_chunk_array[[tile]] !== undefined) 
                        return this.prep_chunk_array[[tile]];
        return null;
    }
    removeChunk( tile ) {
        delete this.prep_chunk_array[[tile]];
    }
    convertWFCToChunk( gen_data, tile, add_to_map = true ) {
        const PADDING = 5;        
        const LEN = gen_data.data.length;
        const JMP = 4;
        const ARRAY = [];
        for (let i = 0; i < LEN; i+=JMP) {
            const R = gen_data.data[i];
            const G = gen_data.data[i+1];
            const B = gen_data.data[i+2];
            // const A = gen_data.data[i+3]; // Ignore Alpha
            const ENTRY = DATA.tile[tile].legend[`${R},${G},${B}`];
            const TILE = this.legend[ENTRY];                                    // Find tile tags in DATA legend
            if ( TILE !== undefined ) {
                ARRAY.push(TILE);                                               // Add Tile reference value (See README.md for index)
            } else {
                console.warn(`Missing entry for ${ENTRY}`);                     // Warm if there's no tags for color
                ARRAY.push(-106);                                               // Add Pink tile as stub in
            }
        }
        const MDATA = this.addChunkBorder(ARRAY, gen_data.width, PADDING);      // Surround chunk with border to blend into env
        this.storeChunk(tile, MDATA.data, MDATA.width, MDATA.height, true);
        if ( add_to_map ) {
            const CHUNK = this.getChunk( tile );
            this.tryAddChunk( CHUNK );
        }
    }
    tryAddChunk( chunk ) {
        const DATA = chunk.data;
        const WIDTH = chunk.width;
        const HEIGHT = chunk.height;
        const TILE = chunk.tile;
        const DIST = 11;
        const POS = this._pos;
        let success = false;
        let tries = 0
        let loc = [];
        const order = ShuffleArray([...Array(4).keys()]);                       // Generated a random order to test direction
        do {                                                                    // Loop around the player to find a usable map space
            switch (order[tries]) {                                                    // Set OG starting point (n,s,e,w)
                case 0: 
                    loc = [POS.x - Math.round(WIDTH/2), POS.y - DIST - HEIGHT]; 
                    // console.log("Trying up"); 
                break;
                case 1: 
                    loc = [POS.x + DIST, POS.y - Math.round(HEIGHT/2)]; 
                    // console.log("Trying right"); 
                break;
                case 2: 
                    loc = [POS.x - Math.round(WIDTH/2), POS.y + DIST];  
                    // console.log("Trying down"); 
                break;
                case 3: 
                    loc = [POS.x - WIDTH - DIST, POS.y - Math.round(HEIGHT/2) ];  
                    // console.log("Trying left"); 
                break;
            }        
            success = this.isChunkEmpty( loc[0], loc[1], WIDTH, HEIGHT );         // Check if location in map is empty
            tries++;
        } while (tries < 4 && !success);
        if (success) {     
            this.addChunkToMap( loc[0], loc[1], DATA, WIDTH );                    // Generate and add the chunk to the map
            this.removeChunk( TILE );
        } else {
            // console.log("failed to find location");                             // Warn if no valid map location found
        }
    }
    addChunkToMap( x,y, data, wrap ) {      
        const INC = this._NUM_PIXELS / this._GRID_SIZE;                         // Pixel increment
        const FIX_ARR = [];
        const conv = (ox,oy) => {
            const TDR = {                                                       // Offset to center screen
                x: Number(( ox * INC ).toFixed(3)),
                y: Number(( oy * INC ).toFixed(3))
            }; 
            const MAP_X = (TDR.x % 1 !== 0) ? TDR.x.toFixed(3) : TDR.x;         // Gen map x address
            const MAP_Y = (TDR.y % 1 !== 0) ? TDR.y.toFixed(3) : TDR.y;         // Gen map y address
            return { x: MAP_X, y: MAP_Y };
        }
        wrap = (wrap === undefined ) ? 14 : wrap;
        data = (data === undefined) ? [
              0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
              0,    0,  122,  122,  122,  122,  122,  122,  122,  122,    0,    0,    0,    0,
              0,    0,  122, 1012,    0,-1002, 1006,    0, 1001,  122,    0,    0,    0,    0,
              0,    0,  122,    0,    0,    0,    0,    0,    0,  122,    0,    0,    0,    0,
              0,    0,  122,    0,    0,    0,    0,    0,    0,  123,  123,  123,  123,    0,
              0,    0,  122,    0,    0,    0,    0,    0,    0,  123,    0,-1002,  123,    0,
              0,    0,  122,    0,    0,    0,    0,    0,    0,    0, 1014,    0,  123,    0,
              0,    0,  122,-1002,    0,    0,    0,    0,    0,  123,    0,    0,  123,    0,
              0,    0,  122,  122,  122,    0,  122,  122,  122,  123,    0,    0,  123,    0,
              0,    0,    0,    0,  122,    0,  122,    0,    0,  123,  123,  123,  123,    0,
              0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
              0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
              0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        ] : data;
        data.forEach( (e,i) => {
            const xx = x + (i % wrap);
            const yy = y + Math.floor(i/wrap);
            const MAP = conv(xx,yy);
            const POS = this.toPOSCoord(MAP.x,MAP.y);
            if (e > -100 && e < -1 ) {                                          // Special (Convert to switch when needed)
                this._map.get(MAP.x,MAP.y);
            } else if (e > -1000 && e < 1000) {                                 // Walls and Floors
                this._map.memory[[`${MAP.x},${MAP.y}`]] = e;
            } else if ( e <= -1000 ) {                                          // Fixtures
                this.addLight(POS.x,POS.y,8,DATA.colors[5]);
                FIX_ARR.push(POS);
                this._map.memory[[`${MAP.x},${MAP.y}`]] = 0;
            } else if ( e >= 1000 ) {                                           // Items
                const ITEM = new Item(DATA.items[[Object.keys(DATA.items)[e-1000]]]);
                if ( ITEM !== undefined ) this.addItem(POS.x, POS.y, ITEM);
                this._map.memory[[`${MAP.x},${MAP.y}`]] = 0;
                FIX_ARR.push(POS);
            }

        });

        // Run through the fixture array and try to find floor texture
        FIX_ARR.forEach( e => {
            this.tryGenFloorTile( e.x, e.y );            
        });

    }
    convertCoordinates( x, y ) {
        let loc_x = x * this._PIXEL_SIZE / this._CANVAS.width;
        let loc_y = y * this._PIXEL_SIZE / this._CANVAS.width;
        return { x: loc_x, y: loc_y };
    }
    toMapCoord( x, y ) {
        const INC = this._NUM_PIXELS / this._GRID_SIZE;
        const TDR = {       
            x: Number((x * INC).toFixed(3)), 
            y: Number((y * INC).toFixed(3))
        };   
        const MAP_X = (TDR.x % 1 !== 0) ? (TDR.x).toFixed(3) : TDR.x;           // Cull unneeded decimals
        const MAP_Y = (TDR.y % 1 !== 0) ? (TDR.y).toFixed(3) : TDR.y; 
        return { x: Number(MAP_X), y: Number(MAP_Y) };
    }
    toPOSCoord( mx, my ) {
        const INC = this._NUM_PIXELS / this._GRID_SIZE; //Number(().toFixed(3));    // Pixel increment
        const X = Math.round(mx/INC);
        const Y = Math.round(my/INC);

        // console.log( `${Math.round(mx/INC)},${Math.round(my/INC)} ${mx},${my} :: ${INC} ::       ${mx/INC},${my/INC}`);

        return { x: X, y: Y };
    }
    draw( x, y, color ) {
        const MAP = this._map.read( x, y );  
        const COORD = this.convertCoordinates( this._pos.x, this._pos.y );
        this._CTX.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        this._CTX.fillRect(
            (COORD.x + x) / this._GRID_SIZE * this._CANVAS.width,
            (COORD.y + y) / this._GRID_SIZE * this._CANVAS.width,
            this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE,
            this._CANVAS.width / this._RESOLUTION / this._GRID_SIZE
        );
    }
    genMapRadius( x, y, r ) {   
        if ( r === 0 ) return;                                                  // Generate map data based on vision radius & sight-lines
        const INC = this._NUM_PIXELS / this._GRID_SIZE;
        const MATRIX = spiral(r);                                               // Generate viewing cells as spiral
        const CHK = new Array(DATA.directions.length).fill(true);               // Create array of view directions to check vision
        const LAST = { dir: 0, ring: 0, chk: false };                           // Track previous view for comparison
        MATRIX.forEach( (loc, i) => {
            if (Math.abs(loc[0]) + Math.abs(loc[1]) <= r + (r/2)) {
                const DIR = degAsCardinalNum( 
                    Math.direction( x, y, x + loc[0], y + loc[1]));             // Convert to DATA.directions number
                // const DIR_TEXT = degAsText( 
                //     Math.direction( x, y, x + loc[0], y + loc[1])); 
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
                this._seen[[`${MAP_X},${MAP_Y}`]] = RES;                        // Record this location as seen
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
    genLight( x, y, r, c ) {
        if ( r === 0 ) return;                                                  // Generate map data based on vision radius & sight-lines
        const MATRIX = spiral(r);                                               // Generate viewing cells as spiral
        const CHK = new Array(DATA.directions.length).fill(true);               // Create array of view directions to check vision
        const LAST = { dir: 0, ring: 0, chk: false };                           // Track previous view for comparison
        MATRIX.forEach( (loc, i) => {
            if (Math.abs(loc[0]) + Math.abs(loc[1]) <= r + (r/2)) {
                const DIR = degAsCardinalNum( 
                    Math.direction( x, y, x + loc[0], y + loc[1]));             // Convert to DATA.directions number
                if ( DIR !== LAST.dir ) CHK[LAST.dir] = LAST.chk;               // Only commit results when changing direction
                if ( Math.abs(loc[0]) > LAST.ring || 
                    Math.abs(loc[1]) > LAST.ring ) {                            // If stepped out a ring layer then treat as above
                    CHK[LAST.dir] = LAST.chk;
                }                                                               
                if (!CHK[DIR]) return;                                          // Don't draw if view is blocked
                const POS = this.toMapCoord( x + loc[0], y + loc[1] );
                const DIST = Math.distance(0,0,loc[0],loc[1]);                  // Calc distance from light
                const LIGHT = convertRange(DIST,0,r,this.lght_mx,this.lght_mn); // Convert range to -1 1
                const CUR = this.getLghtLvl( POS.x, POS.y );                    // Check if cell has light
                if ( CUR === -100 ) {                                               
                    this._lghtmap[[`${POS.x},${POS.y}`]] = { l: LIGHT, c: c };  // Add light if non already there
                } else if ( LIGHT > CUR ) {
                    this._lghtmap[[`${POS.x},${POS.y}`]] = { l: LIGHT, c: c };  // Add light if brighter than current
                }
            }
        });  
    }
    addLight(x,y,r,color) {
        this._lights.push({x:x,y:y,r:r,c:color});
    }
    removeLight(x,y) {
        this._lights.pop(e => e.x === x && e.y === y);
    }
    getScreenLights() {
        const POS = this._pos;
        const OFF = this._GRID_SIZE * this._RESOLUTION;
        const FRM = { x: POS.x - OFF, y: POS.y - OFF };
        const TO  = { x: POS.x + OFF, y: POS.y + OFF };
        const LIGHTS = this._lights.filter( e => 
                        (e.x >= FRM.x && e.x <= TO.x) && 
                        (e.y >= FRM.y && e.y <= TO.y));                        
        const ITEMS = this.getScreenItems()
                                .filter(e=>e.i.type.includes("light"));         // Find any on screen items that are lights
        ITEMS.forEach( e => {
            LIGHTS.push(
                {x: e.x, y: e.y, r: e.i.data.stats.range, c: DATA.colors[5]});
        });
        return LIGHTS
    }
    getScreenItems() {
        const POS = this._pos;
        const OFF = this._GRID_SIZE * this._RESOLUTION;
        const FRM = { x: POS.x - OFF, y: POS.y - OFF };
        const TO  = { x: POS.x + OFF, y: POS.y + OFF };
        return this._item.filter( e => 
                            (e.x >= FRM.x && e.x <= TO.x) && 
                            (e.y >= FRM.y && e.y <= TO.y));
    }
    addItem( x, y, item ) {
        if (!this._item.some(e => e.x === x && e.y === y)) {
            this._item.push({x:x,y:y,i:item});

            if ( this.isOnScreen( x, y ) ) {
                this.render();
                this.drawAvatar();
            }
        }
    }
    removeItem( x, y ) {
        if (!this._item.some(e => e.x === x && e.y === y)) return undefined;
        const ITEM = this._item.find(e => e.x === x && e.y === y).i;
        const IDX = this._item.findIndex(e => e.x === x && e.y === y);
        this._item.splice(IDX,1);
        return ITEM;
    }
    getItem( mx, my ) {
        const P = this.toPOSCoord(mx,my);
        if (!this._item.some(e=>e.x===P.x&&e.y===P.y)) return undefined;
        const ITEM = this._item.find( e => e.x === P.x && e.y === P.y);
        if (ITEM !== undefined) return ITEM.i;
    }
    renderItem( sx, sy, item, light = 0 ) {
        this._CTX.font = `${20}px monospace`;
        this._CTX.fillStyle = pSBC(light,DATA.colors[1]);
        this._CTX.textAlign = "center";
        this._CTX.textBaseline = `middle`;
        const P = this.PIXEL/2;
        const NAME = item.data.name.substring(0,1).toLowerCase();
        this._CTX.fillText(`${NAME}`, sx+P, sy+P ); 
    }
    renderMark( sx, sy, mark, base_color, light = 0 ) {
        this._CTX.font = `${20}px monospace`;
        const color = pSBC(-0.4,base_color);
        this._CTX.fillStyle = pSBC(light,color);
        this._CTX.textAlign = "center";
        this._CTX.textBaseline = `middle`;
        const P = this.PIXEL/2;
        this._CTX.fillText(`${mark}`, sx+P, sy+P ); 
    }
    clear() {                                                                   // Clear Screen
        this._CTX.clearRect(0,0,this._CANVAS.width, this._CANVAS.height);
    }
    move( dir ) {                                                               // Try move player in direction
        const updatePOS = ( x, y ) => {
            if ( this._init_gen < 5 ) { this.requestWFC(); this._init_gen++ }

            const POS = this.toMapCoord( this._pos.x + x, this._pos.y + y );
            let MAP = this._map.read( POS.x, POS.y );                           // Get cell data from next cell
            if ( MAP === -100 ) MAP = this._map.get( POS.x, POS.y );            // Get cell data so it can be drawn
            const MAT = this._mats.read( POS.x, POS.y );
            if ( MAT >= this._min && MAP > 0 && MAP < 100 ) {                                           // Try Mining
                this.mine(POS.x,POS.y,MAT);
                this.genMapRadius(this._pos.x, this._pos.y, 5);
                this.render();
                this.drawAvatar();
                increaseGameTime(1);
                gameUpdate();
                this.requestWFC();
            }
            if ( MAP > 0 ) { this.render(); this.drawAvatar(); return;}         // Cannot walk through walls
            this._pos.x = this._pos.x + x;
            this._pos.y = this._pos.y + y;
            // const tmp = this.toMapCoord( this._pos.x, this._pos.y )
            // console.log(`${this._pos.x},${this._pos.y}`)
            if ( this._pos.x === 0 && this._pos.y === 0 ) {
                this._prnt.exit();
            } else {
                const ITEM = this.removeItem(this._pos.x, this._pos.y);         // Check to see if item to pick up.
                if ( ITEM !== undefined ) {
                    avatar.addToInventory(ITEM);                                // Add it to inventory 
                    updateLog(`You have picked up a ${ITEM.name}.`);
                }
                this.genMapRadius(this._pos.x, this._pos.y, this.pl_lght_rnge);
                this.render();
                this.drawAvatar();
                increaseGameTime(1);
                gameUpdate();
                this.requestWFC();
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
    render() {
        this._lghtmap = {}; // Clear light map
        this.getScreenLights().forEach(e => this.genLight(e.x,e.y,e.r,e.c));
        this.clear();                                                           // Clear the screen
        const POS = this._pos;                                                  // Player position  
        const INC = this._NUM_PIXELS / this._GRID_SIZE;                         // Pixel increment
        const OFF = Math.floor((this._GRID_SIZE * this._RESOLUTION) / 2 ) * INC;
        for ( let y = 0; y < this._GRID_SIZE; y += INC ){                       
            for ( let x = 0; x < this._GRID_SIZE; x += INC ){
                const TDR = {                                                   // Offset to center screen
                    x: Number((( x - OFF ) + ( POS.x * INC )).toFixed(3)),
                    y: Number((( y - OFF ) + ( POS.y * INC )).toFixed(3))
                };   
                const MAP_X = (TDR.x % 1 !== 0) ? TDR.x.toFixed(3) : TDR.x;     // Gen map x address
                const MAP_Y = (TDR.y % 1 !== 0) ? TDR.y.toFixed(3) : TDR.y;     // Gen map y address
                const LOC = {  
                    x: x / this._GRID_SIZE * this._CANVAS.width,
                    y: y / this._GRID_SIZE * this._CANVAS.width
                };                                                              // Gen screenspace coord
                this.renderCell( MAP_X, MAP_Y, LOC.x, LOC.y );                  // Draw Cell
            }
        }
    }
    renderCell(map_x,map_y, screen_x, screen_y) {
        const X = screen_x - 0.01;                                              // Tweaked numbers to create overlap draw
        const Y = screen_y - 0.01;                                   
        const P = this.PIXEL + 0.4;                                             // Size of screen pixel
        const C = this._CTX;
        const SI = P/2;                                                         // Half of screen pixel
        const DOOR =    DATA.colors[2];
        let WALL =      DATA.colors[11];
        const WATER1 =  DATA.colors[29];
        const WATER2 =  DATA.colors[30];
        const WHITE =   DATA.colors[1];
        const PLIGHT =  DATA.colors[5];
        let FLOOR =     DATA.colors[18];
        const DARK =    DATA.colors[0];
        const MAP = this.getSeen(map_x, map_y);                                 // Read the map data: -100 if none
        const MAT = this._mats.read(map_x, map_y);                              // Read materials data
        const ITEM = this.getItem( map_x, map_y );
        let LIGHT = (this.getLghtLvl(map_x,map_y) === -100) ? 
                                                this.lght_mn : 
                                                this.getLghtLvl(map_x,map_y);   // Get light or min light if none
        const DIST = Math.distance(256-(P/2),256-(P/2),X,Y);                    // Calculate distance from center of screen
        const MAX = this.pl_lght_rnge*P;                                        // Set max light range distance
        const PL = ( DIST <= MAX ) 
                ? convertRange(DIST,0,MAX,this.lght_mx,this.lght_mn) 
                : -100;                                                         // Convert to light range
        switch (MAP) {
            case -100:
                C.fillStyle = DARK;
                C.fillRect(X,Y,P,P);
            break;
            case -10:                                                           // Exit Door
                C.fillStyle=pSBC(-0.2,DOOR);
                C.fillRect(X,Y,P,P);
            break;
            default:
            LIGHT = ( PL > LIGHT ) ? PL : LIGHT;                                // Take the stronger of the two
            const TORCH = ( PL > LIGHT ) 
                        ? PLIGHT 
                        : this.getLghtCol(map_x,map_y);
            const AMT = convertRange(LIGHT,this.lght_mn,this.lght_mx,0,0.06);   // Calculate light color influence
            if ( MAT <= this.wtr_lv && (MAP <= 0 && MAP >= -1) ) {         
                const WATER = (Math.random() > 0.5 ) ? WATER1 : WATER2;
                const COL = pSBC(AMT,WATER,TORCH);                              // Water
                LIGHT = Math.max(LIGHT,-1)
                C.fillStyle = pSBC(LIGHT,COL);                              
                C.fillRect(X,Y,P,P);  
                const MARK = (Math.random() > 0.5) ? "∽" : "~";
                this.renderMark( X, Y, MARK, COL, LIGHT);                       // Add Water Texture                
            } else if ( MAP <= 0 ) {                                            // Floor
                FLOOR = (MAP <= -100) ? DATA.colors[Math.abs(MAP)-100] : FLOOR; // Get Floor Color     
                const COL = pSBC(AMT,FLOOR,TORCH);
                LIGHT = Math.max(LIGHT,-1);
                C.fillStyle = pSBC(LIGHT,COL);                              
                C.fillRect(X,Y,P,P);
                this.renderMark( X, Y, "·", COL, LIGHT);                        // Add Floor Texture                
                if ( ITEM !== undefined ) this.renderItem(X, Y, ITEM, LIGHT);   // Find item and render
            } else {               
                WALL = (MAP >= 100) ? DATA.colors[MAP-100] : WALL;              // Get Wall Color
                this._CTX.fillStyle=pSBC(LIGHT,WALL);                           // Wall
                this._CTX.fillRect(X,Y,P,P);  
                if (MAT >= this._min && MAP < 100) {                            // Add Material resource to cell
                    const K = this.resource(MAT);
                    LIGHT = Math.max(LIGHT,-1);
                    C.fillStyle = 
                        shadeRGB(`rgb(${K.col[0]},
                                    ${K.col[1]},${K.col[2]})`,LIGHT);           // Material Color
                    C.beginPath();
                    C.arc(X+SI,Y+SI,SI/2,0,2*Math.PI);
                    C.fill();
                    C.strokeStyle = pSBC(LIGHT,WHITE);                          // Mat Stroke
                    C.stroke();
                } else {
                    this.renderMark( X, Y, "#", WALL, LIGHT);                   // Add Wall Texture
                }
            }
            break;
        }
    }
    getLghtLvl(x,y) {
        if ( this._lghtmap[[`${x},${y}`]] === undefined ) return -100;
        return this._lghtmap[[`${x},${y}`]].l;
    }
    getLghtCol(x,y) {
        if ( this._lghtmap[[`${x},${y}`]] === undefined ) return DATA.colors[0];
        const c = this._lghtmap[[`${x},${y}`]].c;
        return c;
    }
    getSeen(x,y) {
        if ( this._seen[[`${x},${y}`]] === undefined ) return -100;
        return this._seen[[`${x},${y}`]];
    }
    drawAvatar() {
        const SIZE = this._RESOLUTION * this._GRID_SIZE;                        // WIDTH & HEIGHT OF GRID
        const PIXEL = this.PIXEL;                                               // PIXEL SIZE
        this._CTX.strokeStyle = 'white';
        this._CTX.strokeRect( 
                    PIXEL * ((SIZE-1)/2), 
                    PIXEL * ((SIZE-1)/2), PIXEL, PIXEL );                       // SIZE-1 / 2 is half the grid
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
        const MAP = this._map.read(x,y);
        if ( MAP > 100 || MAP <= 0 ) return;                                    // Check within valid mining range
        const value = this._mats.read( x, y );
        if (value === undefined) return;
        const RES = this.resource( value );
        if ( !avatar.currentItemHas("Mine")) {
            updateLog(`You see a vein of minable ${RES.name} in the rock`);
            return;
        }
        updateLog(`You have mined ${RES.name} ore.`);
        this._mats.memory[[`${x},${y}`]] = 0;
        const POS = this.toPOSCoord( x, y );
        this.tryGenFloorTile( POS.x, POS.y );
        // this._map.memory[[`${x},${y}`]] = 0;
        avatar.addToInventory(new Item(createMaterialItem(RES.name)));
    }
    tryGenFloorTile( x, y ) {                                                   // Generate floor tile from removed block
        const FLOOR = DATA.legend.floor;
        let cell;
        let map;
        const SAMPLES = [];
        for (let i = 0; i < 7; i++) {
            switch (i) {
                case 0: map = this.toMapCoord( x + 1, y );      break;
                case 1: map = this.toMapCoord( x + 1, y + 1 );  break;
                case 2: map = this.toMapCoord( x, y + 1 );      break;
                case 3: map = this.toMapCoord( x - 1, y + 1 );  break;    
                case 4: map = this.toMapCoord( x - 1, y );      break;
                case 5: map = this.toMapCoord( x - 1, y - 1 );  break;
                case 6: map = this.toMapCoord( x, y - 1 );      break;
                case 7: map = this.toMapCoord( x + 1, y - 1 );  break;               
            }
            cell = this._map.memory[[`${map.x},${map.y}`]];
            if ((cell >= FLOOR.s && cell <= FLOOR.e) 
                || (cell >= -1 && cell <= 0) ) SAMPLES.push(cell);
        }
        cell = (SAMPLES.length > 0 ) ? mostCommon(SAMPLES) : 0;
        map = this.toMapCoord( x, y );                                          // Set target to og tile
        this._map.memory[[`${map.x},${map.y}`]] = cell;                     // Inject found neighbor
    }
    isOnScreen( x, y ) {
        const POS = this._pos;
        const OFF = Math.ceil((this._GRID_SIZE * this._RESOLUTION)/2);
        const FRM = { x: x - OFF, y: y - OFF };
        const TO  = { x: x + OFF, y: y + OFF };
        return ((POS.x>=FRM.x&&POS.x<=TO.x)&&(POS.y>=FRM.y&&POS.y<=TO.y));
    }
    init() {
        if ( this._map === undefined ) {
            this._map = new Perlin(SEED+(this._prnt.loc.x*this._prnt.loc.y));
            this._mats = new Perlin(SEED+(this._prnt.loc.x*this._prnt.loc.y)+1);
            this._map.memory[["0,0"]] = -10;
            this._seen = { "0,0": -10 };
            this._lghtmap = {};
            this._item = [];
            this._lights = [];
            if ( !this.last_wfc_request ) this.last_wfc_request = gameTime;     // Track map gen request time
            this._init_gen = 0;
            this.addItem( 0, -3, new Item(DATA.items.lantern) );
        }
        this.genMapRadius( this._pos.x, this._pos.y, 5);
        this.render();
        this.drawAvatar();
    }
}
