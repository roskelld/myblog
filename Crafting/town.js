class Town {
    constructor() {
        this.name = "";
        this.type = "town";
        this.color = randomColor();
        this.stroke = [];
        this._location = { x: 0, y: 0 };
        this._revealed = false;
        this.generateName();
        this._actions = ["Buy", "Sell", "Pray", "Gamble"];
        this._market = [];
        this._economic_status;
        this.generateStatus();
        this.generateMarket();
    }

    generateName() {
        if (this.name == "") {
            this.name = DATA.towns[Math.floor(Math.random()*DATA.towns.length)];
        }
    }

    generateMarket() {
        this._market = [];        
        let number = Math.round( Math.random() * 5 + this._economic_status  );  // Number of items to sell 

        for (let index = 0; index < number; index++) {
            // Get Item Data 

            // Generate item for store
            // Limit store item quality for gameplay purposes
            // 
            let quality = this.genItemQuality();
            // Item Name 
            // Replace this with a new dataset look up that uses 
            // item type and weights based on input of town type
            // More military, more weapons etc...

            // Decide on what to add 
            const RNG = Math.round(Math.random() * 100);
            let item
            if ( RNG < 5 ) {
                item = genRandomItem( quality );
            } else if ( RNG < 15 ) {
                item = genRandomSchmaticItem( quality );
            } else {
                item = genRandomItem( quality );
            }

            if ( item === undefined ) return;

            // this._market.push({ name: item.name, price: quality, item: item });
            this.addItemToMarket( item, 0 );
        }

        // console.log(`${this.name} has a ${this.economicStatus} market with ${this.genItemQuality()} quality grade items`);
    }

    genItemQuality() {
        let maxQuality = 20;
        let increment = maxQuality / DATA.status.length;        // Based on number of economic types
        let qualityMulti = this._economic_status + 1
        let quality = Math.max( qualityMulti, Math.round(Math.random() * qualityMulti * increment) );
        return quality;
    }
    genItemSalePrice( item ) {
        // console.log( item );
        // If item is material, then price should reflect abundance
        if ( item.properties.includes( "material" ) ) {            
            let highest_total = 0;
            MAT._resources.forEach( e => {
                if ( e.total > highest_total ) 
                    highest_total = e.total;
            } );
            const RESOURCE = MAT.getResource( item.name );

            if ( RESOURCE !== null ) {
                const PRICE = Math.round( highest_total / RESOURCE.total );     // Calculate price based against most abundant resource
                const MKT_PRC = PRICE * ( 1 + this._economic_status * 0.1 );    // Tweak based on local economy
                return MKT_PRC;
            }

            console.error(`Missing Resource: ${item.name}`);                    // Track missing resources
        }

        // TEMP CODE
        if ( item.efficency === - 1 ) {
            const DATA = Object.values(ITEM_DATA)
                            .find( e => e.name === item._name );
            const PRICE = DATA.price * ( 1+ this._economic_status * 0.1 );
            return PRICE;
        }

        // TEMP CODE
        const PRICE = item.efficency * ( 1+ this._economic_status * 0.1 );
        return PRICE;
    }
    addItemToMarket( item, price ) {
        if ( price === 0 ) price = this.genItemSalePrice( item );
        price = this.genItemSalePrice( item );
        if ( price === Infinity ) return;                                       // Infinity means no supply
        this._market.push({ name: item.name, price: price, item: item });
    }
    generateStatus() {
        this._economic_status = Math.round( Math.random() * (DATA.status.length - 1)) ;        
    }
    get economicStatus() {
        return DATA.status[this._economic_status];
    }
    // Simulate a purchase price for player to sell item to town shop
    offerToBuyPrice( item ) {  
        // GARBAGE PRICING!
        // Take base price minus 10%
        const BASE_PRC = this.genItemSalePrice( item );
        const PRICE = BASE_PRC - ( BASE_PRC * 0.1 );
        return PRICE;
    }
    set location( loc ) {
        this._location = loc;
    }
    get location() {
        return {                                                                // Convert the location to normal values
            x: this._location.x / (LAND._PIXEL_SIZE / LAND._GRID_SIZE),
            y: this._location.y / (LAND._PIXEL_SIZE / LAND._GRID_SIZE)
        }
    }
    get loc() {                                                                 // Shorthand function
        return this.location;                                   
    }
    get actions() {
        return this._actions;
    }
    draw(land) { 
        const x = this._location.x;
        const y = this._location.y;

        // LANDSCAPE_CTX.strokeStyle = `rgb(${this.stroke[0]},${this.stroke[1]},${this.stroke[2]})`;
        land._CTX.strokeStyle = `rgb(${Math.max(0,this.color[0]-30)},${Math.max(0,this.color[1]-30)},${Math.max(0,this.color[2]-30)})`;
        land._CTX.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
        land._CTX.fillRect( x, y, land._PIXEL_SIZE / land._GRID_SIZE , land._PIXEL_SIZE / land._GRID_SIZE  );
        land._CTX.strokeRect( x, y, land._PIXEL_SIZE / land._GRID_SIZE , land._PIXEL_SIZE / land._GRID_SIZE  );
        
        let roof = new Path2D();
    
        // roof.beginPath();
        roof.moveTo( x - ( land._PIXEL_SIZE / land._GRID_SIZE / 3 ), y );
        roof.lineTo( x + ( land._PIXEL_SIZE / land._GRID_SIZE / 2 ), y - ( land._PIXEL_SIZE / land._GRID_SIZE / 1.2 ) );
        roof.lineTo( x + ( land._PIXEL_SIZE / land._GRID_SIZE / 3 ) + ( land._PIXEL_SIZE / land._GRID_SIZE ), y );
        
        roof.closePath();
    
        land._CTX.fill(roof);
        land._CTX.stroke(roof);
    }
}