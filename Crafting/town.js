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

    }

    generateName() {
        if (this.name == "") {
            this.name = DATA.towns[Math.floor(Math.random()*DATA.towns.length)];
        }
    }

    generateMarket() {

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
    items: [{
        name:   "dagger",
        price:  3
    }, {
        name:   "small statue",
        price:  1
    }, {
        name:   ""
    }
]

}

