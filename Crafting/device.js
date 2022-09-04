class DeviceManager {
    constructor( dungeon ) {
        this._dgn = dungeon;
        this.ctx = dungeon._CTX;

        this._devices = {};
    }
    add( device, x, y ) {
        const POS = this._dgn.toMapCoord( x, y );
        if ( this._devices[[`${POS.x},${POS.y}`]] === undefined ) {
            this._devices[[`${POS.x},${POS.y}`]] = device;
            this._dgn.tryGenFloorTile( x, y );
        } else {
            console.warn(
                `Device already present at ${x},${y} (${POS.x},${POS.y})`);
            return;
        }
        
    }
    remove( x, y ) {

    }
    removeAtMapPos( map_x, map_y ) {

    }
    getFromPos( x, y ) {
        const POS = this._dgn.toMapCoord( x, y );
        const D = this._devices[[`${POS.x},${POS.y}`]];
        if ( D === undefined ) {
            return undefined;
        }
        return D;
    }    
    getFromMapPos( map_x, map_y ) {
        return this._devices[[`${map_x},${map_y}`]];
    }
    isDevice( x, y ) {
        const POS = this._dgn.toMapCoord( x, y );
        return (this._devices[[`${POS.x},${POS.y}`]] !== undefined)?true:false;
    }
    touch( x, y ) {
        const MAP = this._dgn.toMapCoord( x, y );
        if ( this._devices[[`${MAP.x},${MAP.y}`]] === undefined ) return;
        const D = this._devices[[`${MAP.x},${MAP.y}`]];
        return D.onTouch();
    }
    render( map_x, map_y, screen_x, screen_y, light ) {
        if ( this._devices[[`${map_x},${map_y}`]] === undefined ) return false;
        const D = this._devices[[`${map_x},${map_y}`]];
        const P = this._dgn.PIXEL;
        const renderMark = () => {
            this.ctx.font = `${20}px monospace`;
            const color = pSBC(-0.4,D.b_color);
            this.ctx.fillStyle = pSBC(light,color);
            this.ctx.textAlign = D.mark_align;
            this.ctx.textBaseline = `middle`;
            const P_HF = P/2;
            this.ctx.fillText(`${D.mark}`, screen_x+P_HF, screen_y+P_HF ); 
        }
        if ( D.hasBackground ) {
            this.ctx.fillStyle = pSBC( light, D.b_color );
            this.ctx.fillRect( screen_x, screen_y, P, P );
        }
        renderMark();
        return true;
    }
}

class Device {
    constructor( height, health, body_color, mark_color ) {
        this._height;
        this._health = 10;
        this._body_color;
        this._mark_color;
        this._mark;
        this._description;
        this._orientation;
        this._body_material;    // Define the material and device properties (opaque, strength, weight, flammable)
    }
    set height(m) {
        this._height = this._height;
    }
    get health() {
        return this._health;
    }
    set health( amount ) {
        this._health = amount;
    }
    reduceHealth( amount ) {
        this._health = ( this._health - amount >= 0 ) ? this._health-amount : 0;
    }
    get height() {
        return this._height;
    }
    get description() {
        return this._description;
    }
    get b_color() {
        return this._body_color;
    }
    get hasBackground() {
        return true;
    }
    get m_color() {
        return this._mark_color;
    }
    get mark() {
        return this._mark;
    }
    get opaque() {
        return 0;
    }
    update() {

    }
    onTouch( value ) {

    }
    onPush( value ) {

    }
    onStrike( value ) {

    }
}

class Door extends Device {
    constructor( orientation ) {
        super();
        this._isOpen = false;
        this._isBarricade = false;
        this._body_color = DATA.colors["21"];
        this._mark_color = DATA.colors["7"];
        this._mark_open = "'";        
        this._mark_closed = "+";
        this._mark_broken = "⋮";
        this._mark_barricade = "‡";
        this._mark_align = "center";
        this._orientation = orientation;
        this._touch_time = -1;
    }
    get mark() {
        if ( this._health <= 0 ) return this._mark_broken;
        if ( this._isOpen ) return this._mark_open;
        if ( this._isBarricade ) return this._mark_barricade;
        return this._mark_closed;
    }
    get mark_align() {
        if ( this._isOpen ) return "left";
        return "center";
    }
    get barricade() {
        return this._isBarricade;
    }
    get opaque() {
        if ( this.isOpen ) return 0;
        if ( avatar.height > this.height ) return 0;
        return 1; // 0-1 val that affects vision/light pass through
    }
    get isOpen() {
        return this._isOpen;
    }
    get hasBackground() {
        return !this.isOpen;
    }
    addBarricade( strength = 5 ) {
        this._isOpen = false;
        this._isBarricade = true;
        this._barricade_health = strength;
    }
    onTouch( value ) {
        if ( !this.isOpen ) {
            if ( this.barricade ) {
                if ( this._touch_time === gameTime-1 ) {
                    return this.tryBreakBarricade();
                } else {
                    this._touch_time = gameTime;                    
                    updateLog("You notice the door is barricaded");
                }
            } else {
                updateLog("You push the door and it opens");
                this._isOpen = true;
            }
            return DATA.collide.BLOCK;
        } else {            
            return DATA.collide.PASS;
        }
    }
    tryBreakBarricade( strength = 1 ) {
        if ( this._barricade_health > 0 ) {
            this._barricade_health--;
            this._touch_time = gameTime;  
            updateLog("You pull on the barricade in an attempt to break it");
        } else {
            updateLog("the barricade breaks free.");
            this._isBarricade = false;
        }
        return DATA.collide.BLOCK;
    }
    onPush( value ) {

    }
    onStrike( value ) {
        
    }
}

