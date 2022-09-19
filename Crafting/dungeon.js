'use strict'
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
        // this.lght_mn = -0.9995;
        this.lght_mn = -0.999;
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
            "door,int,north":               -1202,
            "door,int,east":                -1204,
            "light":                        -1001,
        }
        this.legend.default = {
            floor:                          -121,
            wall:                           116,
            shadow:                         `#112D0E`,
        }
        this.tile_selection =            [0,1,2,3,4,5];                         // Which WFC templates to use
        // this.tile_selection =               [5];
        this.prep_chunk_array = {};                                              // Store prepared chunks for use
    }
    init() {
        if ( this._map === undefined ) {
            this._map = new Perlin(SEED+Math.round(this._prnt.loc.x*this._prnt.loc.y));
            this._res = new Perlin(SEED+Math.round(this._prnt.loc.x*this._prnt.loc.y)+1);
            this._map.memory[["0,0"]] = DATA.id.exit;
            this._seen = { "0,0": DATA.id.exit };
            this._lghtmap = {};
            this._visible = {};                                                 // Stores current visible tiles 
            this.DM = new DeviceManager(this);                                  // Store for functional devices (doors, levers, traps)
            this._item = [];
            this._lights = [];
            if ( !this.last_wfc_request ) this.last_wfc_request = gameTime;     // Track map gen request time
            this._init_gen = 0;
            this.addItem( 9, 0, new Item(DATA.items.lantern) ); 
            // this.addItem( 1, -3, new Item(DATA.items.torch_wood) );
            this.addLight( 0, 0, 8, DATA.colors[4] );

            this.addLight( -6, 2, 8, DATA.colors[5] );

            // this.addLight( 0, -4, 11, DATA.colors[1] );

        }
        this.requestWFC(true);
        this.uncover_visible_tiles( this._pos.x, this._pos.y, this.pl_lght_rnge);
        this.render();
        this.drawAvatar();
    }
    get pl_lght_rnge() {                                                        // Return player light range
        const ITMS = avatar.getItemsByType( "light" );
        if (ITMS.length === 0) return avatar.sight;
        const FLTR = ITMS.filter( e => e.stats.fuel > 0 );
        FLTR.sort( (a,b) => a.stats.range <= b.stats.range );
        if (FLTR.length > 0) return FLTR[0].stats.range;
        return avatar.sight;
    }
    get pos() {                                                                 // Player position
        return this._pos;
    }
    get map_pos() {
        return this.toMapCoord( this.pos.x, this.pos.y );
    }
    get rndTileType() {
        const ARR = ShuffleArray(this.tile_selection);
        return ARR[0];
    }
    get type() {
        if ( this._type = undefined ) this._type = "cave";
        return this._type;
    }
    set type( type ) {
        this._type = type;
    }
    getMapValue( map_x, map_y ) {
        return this._map.get(map_x,map_y);
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
                        WFC_OL.start( TILE_TYPE, 
                                      this.convertWFCToChunk.bind(this) );
                        break;
                    case "simpletile":
                        WFC_T.start( TILE_TYPE, 
                                     null, 
                                     this.convertWFCToChunk.bind(this) );
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
            let C_SPL = ( i === 0 ) ? data[i] : data[i-1];                      // Get adjacent chunk cell
            C_SPL = ( this.getDataType(C_SPL) === "device" ) ? -2 : C_SPL;      // Don't duplicate devices
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
            let C_SPL = ( i === 0 ) ? data[i] : data[i+1];                      // Get adjacent chunk cell
            C_SPL = ( this.getDataType(C_SPL) === "device" ) ? -2 : C_SPL;      // Don't duplicate devices
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
            let C_SPL = data[i % width];                                        // Get adjacent chunk cell
            C_SPL = ( this.getDataType(C_SPL) === "device" ) ? -2 : C_SPL;      // Don't duplicate devices
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
            let C_SPL = data[len - width + i];                                  // Get adjacent chunk cell
            C_SPL = ( this.getDataType(C_SPL) === "device" ) ? -2 : C_SPL;      // Don't duplicate devices
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
            switch (this.getDataType(e)) {
                case "perlin":
                    this._map.memory[[`${MAP.x},${MAP.y}`]] = e;
                    break;
                case "special":
                    this._map.get(MAP.x,MAP.y);
                    break;
                case "floor":
                    this._map.memory[[`${MAP.x},${MAP.y}`]] = e;
                    break;
                case "wall":
                    this._map.memory[[`${MAP.x},${MAP.y}`]] = e;
                    break;
                case "light":
                    this.addLight(POS.x,POS.y,8,DATA.colors[5]);
                    FIX_ARR.push(POS);
                    this._map.memory[[`${MAP.x},${MAP.y}`]] = 0;
                    break;
                case "device":
                    const DOOR = new Door();
                    if ( Math.random() > 0.9 ) DOOR.addBarricade(5);
                    this.DM.add( DOOR, POS.x, POS.y );
                    FIX_ARR.push(POS);
                    break;
                case "item":
                    const ITEM = new Item(DATA.items[[Object.keys(DATA.items)[e-1000]]]);
                    if ( ITEM !== undefined ) this.addItem(POS.x, POS.y, ITEM);
                    this._map.memory[[`${MAP.x},${MAP.y}`]] = 0;
                    FIX_ARR.push(POS);
                    break;
                case "creature":
                    break;
                default:
                    this._map.get(MAP.x,MAP.y);
                    break;
            }
        });

        // Run through the fixture array and try to find floor texture
        FIX_ARR.forEach( e => this.tryGenFloorTile( e.x, e.y ) );

    }
    getDataType( id ) {
        if ( id === undefined ) return null;
        const L = Object.keys(DATA.legend);
        const D = DATA.legend;
        const LEN = Object.keys(DATA.legend).length;
        let tag = null;
        let i = 0;
        do {
            if (!!L[i])
                if (id >= D[[L[i]]].s && id <= D[[L[i]]].e)
                    tag = L[i];
            i++;
        } while (!tag && i <= LEN);
        if (tag) { 
            return tag;
        } else {
            console.error(`Couldn't get map tile ${id} legend type`);
            return null;
        }
    }
    is_blocking( x, y, self ) {
        if ( self.DM.isDevice(x,y) ) 
            return self.DM.getFromPos( x, y ).opaque === 1 ? true : false;      // Check if there's a device blocking view
        return self.is_wall( x, y, true )                                       // Check if wall is blocking view
    }
    is_wall( x, y, undef_is_wall = true ) {
        const MAP = this.toMapCoord( x, y );
        const VALUE = this.getMapValue( MAP.x, MAP.y );
        if ( VALUE === undefined && undef_is_wall === true ) return true;       // Consider undefined tiles as walls
        const L = DATA.legend;
        const RES = ( (VALUE > L.perlin_wall.s && VALUE <= L.perlin_wall.e) || 
                  (VALUE >= L.wall.s && VALUE <= L.wall.e) ) ? true : false;
        return RES;
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
    genLight( x, y, r, c ) {
        const VISIBLE = [];
        compute_fov( {x: x, y: y}, r, this.is_blocking, VISIBLE, this );
        const MATRIX = spiral(r);                                               // Generate viewing cells as spiral
        MATRIX.forEach( loc => {
            if (Math.abs(loc[0]) + Math.abs(loc[1]) <= r + (r/2)) {             // Convert to a circle
                const CUR = { x: x + loc[0], y: y + loc[1]};                    // Get current offset cell
                if ( VISIBLE.some( e => ( e.x === CUR.x && e.y === CUR.y ))) {  // Add light if its a visible cell
                    const MAP = this.toMapCoord( CUR.x, CUR.y );
                    let DIST = Math.distance( x, y, CUR.x, CUR.y );             // Calc distance from light source
                    DIST = ( DIST > r ) ? r : DIST;
                    const L_LVL     = convertRange(DIST,0,r,0,-1);              // Convert to light range based on distance from source
                    const C_LIGHT   = this.getLghtLvl( MAP.x, MAP.y );          // Check if cell already has light
                    const C_COL     = this.getLghtCol( MAP.x, MAP.y );          // Get light color of current cell
                    if ( C_LIGHT === DATA.id.unseen ) {                                               
                        this._lghtmap[[`${MAP.x},${MAP.y}`]] = { l: L_LVL, c: c };  // Add light if non already there
                    } else if ( L_LVL > C_LIGHT ) {
                        const BLEND = pSBC( L_LVL - C_LIGHT, C_COL, c );        // Blend current cell light color with new
                        this._lghtmap[[`${MAP.x},${MAP.y}`]] = { 
                            l: L_LVL, 
                            c: BLEND 
                        };                                                      // Add new light values
                    }
                }
            }
        });
    }
    addLight( x, y ,r, color) {
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
        const PL = avatar.getItemsByType("light");
        if ( PL.length > 0 ) {
            const R = PL[0].stats.range;
            LIGHTS.push(
                {x: POS.x, y: POS.y, r: R, c: DATA.colors[1]});
        } else {
            LIGHTS.push(
                {x: POS.x, y: POS.y, r: 2, c: DATA.colors[18]});                // No carried lights uses avatar near sight
        }
        ITEMS.forEach( e => {
            LIGHTS.push(
                {x: e.x, y: e.y, r: e.i.data.stats.range, c: DATA.colors[1]});
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
    get_visible_tiles( x, y ) {
        const VISIBLE = [];
        this._visible = {};
        const HALF_SCREEN = 11;
        compute_fov( this.pos, HALF_SCREEN, this.is_blocking, VISIBLE, this );
        VISIBLE.forEach( loc => {
            const MAP = this.toMapCoord( loc.x, loc.y );
            this._visible[[`${MAP.x},${MAP.y}`]] = true;
        });
    }
    uncover_visible_tiles( x, y, r ) {
        const VISIBLE = [];
        compute_fov( this.pos, r, this.is_blocking, VISIBLE, this );
        const MATRIX = spiral(r);                                               // Generate viewing cells as spiral
        const POS = this.pos;
        MATRIX.forEach( (loc, i) => {
            if (Math.abs(loc[0]) + Math.abs(loc[1]) <= r + (r/2)) {
                const CUR = { x: POS.x + loc[0], y: POS.y + loc[1]};
                if ( VISIBLE.some( e => ( e.x === CUR.x && e.y === CUR.y ))) {
                    const MAP = this.toMapCoord( CUR.x, CUR.y );
                    const RES = this._map.get(MAP.x,MAP.y);                             // Get or generate map data
                    this._seen[[`${MAP.x},${MAP.y}`]] = RES;
                    this._res.get(MAP.x,MAP.y); 
                }
            }
        });
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
    removeItem( x, y ) {                                                        // Avatar coords
        if (!this._item.some(e => e.x === x && e.y === y)) return undefined;
        const ITEM = this._item.find(e => e.x === x && e.y === y).i;
        const IDX = this._item.findIndex(e => e.x === x && e.y === y);
        this._item.splice(IDX,1);
        return ITEM;
    }
    getItem( map_x, map_y ) {                                                   // Map coords
        const P = this.toPOSCoord(map_x,map_y);
        if (!this._item.some(e=>e.x===P.x&&e.y===P.y)) return undefined;
        const ITEM = this._item.find( e => e.x === P.x && e.y === P.y);
        if (ITEM !== undefined) return ITEM.i;
    }
    renderItem( screen_x, screen_y, item, light = 0 ) {                         // Screen coords
        this._CTX.font = `${20}px monospace`;
        this._CTX.fillStyle = pSBC(light,DATA.colors[1]);
        this._CTX.textAlign = "center";
        this._CTX.textBaseline = `middle`;
        const P = this.PIXEL/2;
        const NAME = item.data.name.substring(0,1).toLowerCase();
        this._CTX.fillText(`${NAME}`, screen_x+P, screen_y+P ); 
    }
    renderMark( screen_x, screen_y, mark, base_color, light = 0, outline = false ) {
        this._CTX.font = `${20}px monospace`;
        this._CTX.fillStyle = pSBC(light,base_color,false,true);
        this._CTX.textAlign = "center";
        this._CTX.textBaseline = `middle`;
        const P = this.PIXEL/2;
        if ( outline ) {
            this._CTX.lineWidth     = 3;
            this._CTX.miterLimit    = 2;
            this._CTX.strokeStyle = pSBC(light-0.4,base_color,false,true);
            this._CTX.strokeText(`${mark}`, screen_x+P, screen_y+P );
        }
        this._CTX.fillText(`${mark}`, screen_x+P, screen_y+P ); 
    }
    renderResource( screen_x, screen_y, res, light = 0 ) {
        const X = screen_x;
        const Y = screen_y;
        const D = this.resource(res);
        const COL = `rgb(${D.col[0]},${D.col[1]},${D.col[2]})`;
        const WHITE = DATA.colors[1];
        const P = this.PIXEL;
        const HP = P/2;                                                         // Half of screen pixel

        this._CTX.fillStyle = pSBC(light,COL,false,false); 
        this._CTX.beginPath();
        this._CTX.arc(X+HP,Y+HP,HP/2,0,2*Math.PI);
        this._CTX.fill();
        this._CTX.strokeStyle = pSBC(light,WHITE);                              // Mat Stroke
        this._CTX.stroke();
    }
    clear() {          
        this._CTX.fillStyle = this.legend.default.shadow                             
        this._CTX.fillRect(0,0,this._CANVAS.width, this._CANVAS.height);        // Clear Screen
    }
    move( dir ) {                                                               // Try move player in direction
        const updatePOS = ( x, y ) => {
            if ( this._init_gen < 5 ) { this.requestWFC(); this._init_gen++ }
            const NON = DATA.id.unseen;                                         // Undiscovered map location
            const CELL = { x: this._pos.x + x, y: this._pos.y + y };
            const POS = this.toMapCoord( CELL.x, CELL.y  );
            let MAP = this._map.read( POS.x, POS.y );                           // Get cell data from next cell
                      
            if ( MAP === NON ) MAP = this._map.get( POS.x, POS.y );            // Get cell data so it can be drawn
            const MAT = this._res.read( POS.x, POS.y );

            // Check for Device 
            if ( this.DM.isDevice( CELL.x, CELL.y ) ) {
                switch (this.DM.touch( CELL.x, CELL.y )) {
                    case "BLOCK":
                        // this.genMapRadius(this._pos.x, this._pos.y, this.pl_lght_rnge);
                        this.uncover_visible_tiles(this._pos.x,this._pos.y,this.pl_lght_rnge);
                        this.render();
                        this.drawAvatar();
                        increaseGameTime(1);
                        gameUpdate();
                    return
                    case "PASS": break;
                }            
            }
            if ( MAT >= this._min && MAP > 0 && MAP < 100 ) {            // Try Mining
                this.mine(POS.x,POS.y,MAT);
                // this.genMapRadius(this._pos.x, this._pos.y, this.pl_lght_rnge);
                this.uncover_visible_tiles(this._pos.x, this._pos.y, this.pl_lght_rnge);
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
                // this.genMapRadius(this._pos.x, this._pos.y, this.pl_lght_rnge);
                this.uncover_visible_tiles(this._pos.x, this._pos.y, this.pl_lght_rnge);
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
        this.get_visible_tiles( POS.x, POS.y );

        let floor = [];
        let wall = [];

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
                const VIS = (this._visible[[`${MAP_X},${MAP_Y}`]] !== undefined)
                            ? true 
                            : false;
                // this.render_cell( MAP_X, MAP_Y, LOC.x, LOC.y, VIS );                  // Draw Cell

                let type = this.getDataType( this._map.get( MAP_X, MAP_Y ) );
                if ( type === "perlin_wall" || type === "wall" ) {
                    wall.push( { mx: MAP_X, my: MAP_Y, x: LOC.x, y: LOC.y, vis: VIS } );
                } else {
                    floor.push( { mx: MAP_X, my: MAP_Y, x: LOC.x, y: LOC.y, vis: VIS } );
                }
            }
        }

        if ( floor.length === 0 ) return;
        floor.forEach( e => this.render_cell( e.mx, e.my, e.x, e.y, e.vis ) );
        wall.forEach( e => this.render_cell( e.mx, e.my, e.x, e.y, e.vis ) );
    }
    get_map_cell( map_x, map_y ) {
        // material
        // color
        // friction
        // mark
        // type
        // opacity
        // temperature

        // Generate code to return some default data 
        // Generate data for specific tiles that need it
        // when getting data mix with live data to give exact answer (light, temp)

        // return object of joy
        // off load this to its own code file to be shared by all 
        const TILE      = this.getSeen( map_x, map_y );
        const TYPE      = this.getDataType( TILE );
        const L_AMT     = this.getLghtLvl( map_x, map_y );
        const L_COL     = this.getLghtCol( map_x, map_y );
        const SHDW_LVL  = this.lght_mn + 0.006;
        const SHDW_COL  = this.legend.default.shadow;
        const RES       = this._res.get(map_x, map_y);
        const WATER1    = DATA.colors[29];
        const WATER2    = DATA.colors[30];
        let color;
        let mark        = `·`;
        let mark_color  = DATA.colors[1];
        let friction    = 1;
        let opacity     = 1;
        let temperature = 0;

        if ( DATA.cell[TILE] !== undefined ) {
            color       = DATA.cell[TILE].color;
            mark        = DATA.cell[TILE].mark.symbol;
            mark_color  = DATA.cell[TILE].mark.color;
            friction    = DATA.cell[TILE].friction;
            temperature = DATA.cell[TILE].temperature;
            opacity     = DATA.cell[TILE].opacity;
        } else {
            // Work out Mark and Color for Cell based on cell type
            switch (TYPE) {
                case "floor": 
                    color = DATA.colors[Math.abs(TILE)-100]; 
                    mark = `·`; 
                // if ( RES <= this.wtr_lv ) {
                //     color   = (Math.random() > 0.5) ? WATER1 : WATER2; 
                //     mark    = (Math.random() > 0.5) ? "∽" : "~";
                // } else {
                // }
                break;
                case "perlin_floor":
                    color = DATA.cell[this.legend.default.floor].color; 
                    mark_color  = DATA.cell[this.legend.default.floor].mark.color;
                    mark = DATA.cell[this.legend.default.floor].mark.symbol; 
                    // if ( RES <= this.wtr_lv ) {
                    //     color   = (Math.random() > 0.5) ? WATER1 : WATER2; 
                    //     mark    = (Math.random() > 0.5) ? "∽" : "~";
                    // } else {
                    // }
                break;
                case "wall":
                    color = DATA.colors[TILE-100]; 
                    mark = `#`; 
                break;
                case "perlin_wall":  
                    color = DATA.cell[this.legend.default.wall].color; 
                    mark_color  = DATA.cell[this.legend.default.wall].mark.color;
                    mark = DATA.cell[this.legend.default.wall].mark.symbol; 
                    // color = DATA.colors[16]; 
                    // mark = `#`; 
                break;
                case "special":      color = DATA.colors[10];   mark = `<`; break;
                case "unseen":       color = SHDW_COL;          mark = ``;  break;
                default:             color = SHDW_COL;          mark = ``;  break;
            }
        }

        let r_color = pSBC( 0.06, color, L_COL, false, false );                 // Mix light & tile color

        return {
            type:           TYPE,
            color:          color,                                              // Raw Cell Color
            friction:       friction,
            opacity:        opacity,
            temperature:    temperature,
            mark:           {
                symbol:     mark,
                // color:      pSBC( L_AMT+1, DATA.colors[1], SHDW_COL, false, false),
                color:      pSBC( L_AMT, mark_color, false, false),
                raw_color:  mark_color,
            },
            light:  {
                amount:     L_AMT,
                color:      L_COL,
            },
            shadow: {
                amount:     SHDW_LVL,
                color:      pSBC( SHDW_LVL, color, SHDW_COL, false, false),
            },
            render: {
                color:      pSBC( L_AMT, r_color, false, false),
            }
        }
    }
    render_cell( map_x, map_y, screen_x, screen_y, visible ) {
        const X = screen_x - 0.01;                                              // Tweaked numbers to create overlap draw
        const Y = screen_y - 0.01;                                   
        const P = this.PIXEL + 0.4;                                             // Size of screen pixel
        const C = this._CTX;
        // const HP = P/2;                                                      // Half of screen pixel
        let COL;
      
        const WATER1 =  DATA.colors[29];
        const WATER2 =  DATA.colors[30];
        const TILE = this.getSeen(map_x, map_y);
        const RES =  this._res.read(map_x, map_y);                              // Read resources data
        const ITEM = this.getItem(map_x, map_y);
        // const MOB                                                            // Pull in mob when added

        const NOT_VIS_SHAD = -0.96;
        const CELL = this.get_map_cell( map_x, map_y );
        
        if ( !visible && TILE === -2 ) {                                        // Not visible and unseen
            C.fillStyle = this.legend.default.shadow;
            C.fillRect(X,Y,P,P);
            return;
        }
        
        if ( visible && CELL.light.amount >= avatar.vision_range.min ) {        // Visible and in range
            if ( CELL.type === "perlin_wall" || CELL.type === "wall" ) {        // Draw Wall Shadow
                C.fillStyle = `rgba(0,0,0,0.25)`;
                const OFF = (this.PIXEL/8);
                C.fillRect(X+OFF,Y+OFF,P,P);
            }
            C.fillStyle = CELL.render.color;
            C.fillRect(X,Y,P,P);                                                // Draw Cell
        } else {                                                                // Out of range in shadow zone
            if ( CELL.type === "perlin_wall" || CELL.type === "wall" ) {        // Draw Wall Shadow
                C.fillStyle = `rgba(0,0,0,0.0625)`;
                const OFF = (this.PIXEL/8);
                C.fillRect(X+OFF,Y+OFF,P,P);
            }
            C.fillStyle = pSBC(NOT_VIS_SHAD, CELL.color, this.legend.default.shadow,);
            C.fillRect(X,Y,P,P);
            this.renderMark(X, Y, CELL.mark.symbol, C.fillStyle, 0.05); 
        }

        if ( visible && CELL.light.amount >= avatar.vision_range.min ) {
            if ( CELL.type === "perlin_wall" && RES >= this._min ) {
                this.renderResource( X, Y, RES, CELL.light.amount )              // Add Material resource to cell
            } else if ( ITEM !== undefined ) {
                this.renderItem(X, Y, ITEM, 0);
            } else {                
                this.renderMark(X, Y, CELL.mark.symbol, CELL.mark.color, 0); 
            }
            if ( TILE !== -2 ) {
                this.DM.render(map_x,map_y,screen_x,screen_y,CELL.light.amount);// Render any device
            }
        }
        



        // if ( visible && CELL.light.amount >= avatar.vision_range.min ) {       // Render items if within visible range
            // this.DM.render(map_x, map_y, screen_x, screen_y, L_AMT);                
                         // Find item and render
        // }

        // switch (this.getDataType(TILE)) {
        //     case "floor":
        //     case "perlin_floor":
        //         if ( RES <= this.wtr_lv ) {                                     // WALKABLE WATER
        //             COL=(Math.random() > 0.5)?WATER1:WATER2;                    // Get Floor Color                                       
        //             COL=(visible && L_AMT >= avatar.vision_range.min) 
        //                 ? pSBC(L_AMT,COL,false,false) 
        //                 : pSBC(SHDW_LVL,COL,SHDW_COL,true,true);                // Update Color based on light/shadow level
        //             C.fillStyle = COL;
        //             C.fillRect(X,Y,P,P);  
        //             const MARK = (Math.random() > 0.5) ? "∽" : "~";
        //             if (visible && L_AMT >= avatar.vision_range.min)            // If visible and bright
        //                 this.renderMark( X, Y, MARK, L_COL, L_AMT);             // Add Water Texture 
        //         } else {
        //             COL=(TILE<=-100)                                            // WALKABLE FLOOR
        //                 ? DATA.colors[Math.abs(TILE)-100]
        //                 : DATA.colors[18];                                      // Get Floor Color
        //             COL=(visible && L_AMT >= avatar.vision_range.min) 
        //                 ? pSBC(L_AMT,COL,false,false) 
        //                 : pSBC(SHDW_LVL,COL,SHDW_COL,true,true);                // Update Color based on light/shadow level
        //             C.fillStyle = COL;
        //             C.fillRect(X,Y,P,P);  
        //             if (visible && L_AMT >= avatar.vision_range.min)            // If visible and bright
        //                 this.renderMark( X, Y, "·", L_COL, L_AMT);
        //         }             
        //     break;
        //     case "wall":
        //     case "perlin_wall":
        //         COL = (TILE >= 100) 
        //             ? DATA.colors[TILE-100] 
        //             : DATA.colors[11];                                          // Get Wall Color
        //         COL = (visible && L_AMT >= avatar.vision_range.min) 
        //                     ? pSBC(L_AMT,COL,false,false)
        //                     : pSBC(SHDW_LVL,COL,SHDW_COL,true,true);            // Update Color based on light/shadow level
        //         C.fillStyle = COL;
        //         C.fillRect(X,Y,P,P);
        //         if (visible && L_AMT >= avatar.vision_range.min) {
        //             if (RES >= this._min && TILE < 100)
        //                 this.renderResource( X, Y, RES, L_AMT )              // Add Material resource to cell
        //             else 
        //                 this.renderMark( X, Y, "#", L_COL, L_AMT);           // Add Wall Texture
        //         }
        //     break;
        //     case "special":
        //         if (TILE === DATA.id.exit){
        //             COL = DATA.colors[2];
        //             COL = (visible && L_AMT >= avatar.vision_range.min) ? pSBC(0,COL) : pSBC(SHDW_LVL,COL,SHDW_COL,true,true);
        //             C.fillStyle = COL;
        //             C.fillRect(X,Y,P,P);
        //             if (visible && L_AMT >= avatar.vision_range.min)
        //                 this.renderMark( X, Y, "<", L_COL, L_AMT);
        //         }
        //     break;
        // }




    }
    getLghtLvl(x,y) {
        if ( this._lghtmap[[`${x},${y}`]] === undefined ) return this.lght_mn;
        return this._lghtmap[[`${x},${y}`]].l;
    }
    getLghtCol(x,y) {
        if ( this._lghtmap[[`${x},${y}`]] === undefined ) return DATA.colors[0];
        const c = this._lghtmap[[`${x},${y}`]].c;
        return c;
    }
    getSeen(x,y) {
        if ( this._seen[[`${x},${y}`]] === undefined ) return DATA.id.unseen;
        return this._seen[[`${x},${y}`]];
    }
    drawAvatar() {
        const SIZE = this._RESOLUTION * this._GRID_SIZE;                        // WIDTH & HEIGHT OF GRID
        const PIXEL = this.PIXEL;                                               // PIXEL SIZE
        // this._CTX.strokeStyle = 'white';
        // this._CTX.strokeRect( 
        //             PIXEL * ((SIZE-1)/2), 
        //             PIXEL * ((SIZE-1)/2), PIXEL, PIXEL );                       // SIZE-1 / 2 is half the grid

        this.renderMark( 
            PIXEL * ((SIZE-1)/2), 
            PIXEL * ((SIZE-1)/2), 
            "@", 
            DATA.colors[1], 
            0, true );
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
        const value = this._res.read( x, y );
        if (value === undefined) return;
        const RES = this.resource( value );
        if ( !avatar.currentItemHas("Mine")) {
            updateLog(`You see a vein of minable ${RES.name} in the rock`);
            return;
        }
        updateLog(`You have mined ${RES.name} ore.`);
        this._res.memory[[`${x},${y}`]] = 0;
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
}
