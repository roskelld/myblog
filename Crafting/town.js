class Town {
    constructor() {
        this.name = "";
        this.type = "town";
        this.color = generateColor();
        this.stroke = [];
        this._location = [];
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
        // ITEM_DATA[Object.keys(ITEM_DATA)[3]].
        // Number of items to sell 
        let number = Math.round( Math.random() * 5 + this._economic_status  ); 
        for (let index = 0; index < number; index++) {
            // Get Item Data 
            let index = Math.floor(Object.keys(ITEM_DATA).length * Math.random());
            let item = ITEM_DATA[Object.keys(ITEM_DATA)[index]];
            let price = Math.max( Math.round(item.price + (this._economic_status*this._economic_status)), 1);

            this._market.push({ name: item.name, price: price, id: Object.keys(ITEM_DATA)[index] });
        }
    }

    generateStatus() {
        this._economic_status = Math.round( Math.random() * (DATA.status.length - 1)) ;        
    }

    get economicStatus() {
        return DATA.status[this._economic_status];
    }

    // Simulate a purchase price for player to sell item to town shop
    offerToBuyPrice( itemName, avatar ) {  
        let bp = Object.values(ITEM_DATA).find( e => ( itemName === e.name )).price;     
        let ec = Math.max(this._economic_status, 1);        // Botch to fix maths so its at least 1 cause squalid at 0 breaks it

        // Current model is to scale the item price based on local economy. Garbage but something.
        let price = Number( ((bp / 2) * ( ec + 1 )).toFixed(2) );
        return price;
    }

    set location(loc) {
        this._location[0] = loc[0];
        this._location[1] = loc[1];
    }

    get location() {
        return this._location;
    }

    get actions() {
        return this._actions;
    }

    draw(land) { 
        // console.log(loc);
        let x = this._location[0];
        let y = this._location[1];

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

const DATA = {
    towns: [
        "Aerilon",
        "Aquarin",
        "Aramoor",
        "Azmar",
        "Begger’s Hole",
        "Black Hollow",
        "Blue Field",
        "Briar Glen",
        "Brickelwhyte",
        "Broken Shield",
        "Boatwright",
        "Bullmar",
        "Carran",
        "City of Fire",
        "Coalfell",
        "Cullfield",
        "Darkwell",
        "Deathfall",
        "Doonatel",
        "Dry Gulch",
        "Easthaven",
        "Ecrin",
        "Erast",
        "Far Water",
        "Firebend",
        "Fool’s March",
        "Frostford",
        "Goldcrest",
        "Goldenleaf",
        "Greenflower",
        "Garen’s Well",
        "Haran",
        "Hillfar",
        "Hogsfeet",
        "Hollyhead",
        "Hull",
        "Hwen",
        "Icemeet",
        "Ironforge",
        "Irragin",
        "Jarren’s Outpost",
        "Jongvale",
        "Kara’s Vale",
        "Knife’s Edge",
        "Lakeshore",
        "Leeside",
        "Lullin",
        "Marren’s Eve",
        "Millstone",
        "Moonbright",
        "Mountmend",
        "Nearon",
        "New Cresthill",
        "Northpass",
        "Nuxvar",
        "Oakheart",
        "Oar’s Rest",
        "Old Ashton",
        "Orrinshire",
        "Ozryn",
        "Pavv",
        "Pella’s Wish",
        "Pinnella Pass",
        "Pran",
        "Quan Ma",
        "Queenstown",
        "Ramshorn",
        "Red Hawk",
        "Rivermouth",
        "Saker Keep",
        "Seameet",
        "Ship’s Haven",
        "Silverkeep",
        "South Warren",
        "Snake’s Canyon",
        "Snowmelt",
        "Squall’s End",
        "Swordbreak",
        "Tarrin",
        "Three Streams",
        "Trudid",
        "Ubbin Falls",
        "Ula’ree",
        "Veritas",
        "Violl’s Garden",
        "Wavemeet",
        "Whiteridge",
        "Willowdale",
        "Windrip",
        "Wintervale",
        "Wellspring",
        "Westwend",
        "Wolfden",
        "Xan’s Bequest",
        "Xynnar",
        "Yarrin",
        "Yellowseed",
        "Zao Ying",
        "Zeffari",
        "Zumka"
    ],

    names: [
        "Acca",
        "Adelina",
        "Aedre",
        "Aldietha",
        "Alyva",
        "Anina",
        "Anthea",
        "Athelyna",
        "Avice",
        "Ayleth",
        "Bellaflor",
        "Bencelina",
        "Brangwine",
        "Brise",
        "Catel",
        "Cearo",
        "Ceday",
        "Damisona",
        "Danae",
        "Desislava",
        "Diera",
        "Eadlin",
        "Elwyna",
        "Emengar",
        "Emmalina",
        "Eshina",
        "Estrilda",
        "Everill",
        "Gabella",
        "Gatty",
        "Goodeth",
        "Felice",
        "Flossie",
        "Hadley",
        "Heryeth",
        "Hildeth",
        "Honora",
        "Ingerith",
        "Jacquelle",
        "Jocosa",
        "Kyneburg",
        "Leffeda",
        "Lella",
        "Letecia",
        "Letha",
        "Lewen",
        "Linden",
        "Livilda",
        "Livith",
        "Lorelle",
        "Maerwynn",
        "Marden",
        "Maryell",
        "Melisende",
        "Merewald",
        "Merona",
        "Milburegh",
        "Myla",
        "Nixie",
        "Nura",
        "Olyffe",
        "Orella",
        "Oriana",
        "Osyth",
        "Pavia",
        "Pechel",
        "Petronella",
        "Protasia",
        "Questa",
        "Radella",
        "Raisa",
        "Raziah",
        "Rheda",
        "Rhoswen",
        "Rusalka",
        "Sabine",
        "Sanchia",
        "Scholace",
        "Seburuh",
        "Sebille",
        "Sedille",
        "Selova",
        "Sheera",
        "Sigerith",
        "Sinnie",
        "Sunniva",
        "Sunngifu",
        "Theldry",
        "Tenanye",
        "Tianna",
        "Titha",
        "Toma",
        "Tycelin",
        "Uta",
        "Wasila",
        "Wendelin",
        "Wilmot",
        "Xantho",
        "Zenith",
        "Zuzana"
    ],
    status: [
        "squalid",
        "poor",
        "moderate",
        "thriving",
        "prosperous",
        "wealthy",
        "extravigant",
    ],
    terrain: [
        "soil",
        "rock",
        "water"
    ]
}

