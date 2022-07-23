
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
    ],
    item_quality: [
        "makeshift",
        "crude",
        "poor",
        "",
        "fair",
        "fine",
        "artful",
        "heirloom",
        "master"
    ],
    material: {
        solid: {
            metal: {
                iron: {
                    alloy:          false,
                    conduction:     71.8, 
                    density:        7.87, 
                    malleable:      0, 
                    ductile:        0.43, 
                    meltingpoint:   1260, 
                    sonorous:       0, 
                    luster:         0, 
                    hardness:       235,
                    color:          [125,125,125],
                    pocket_density: 0.01,
                    distribution:   [-1, 1],
                },
                copper: {
                    alloy:          false,
                    conduction:     386, 
                    density:        8.93, 
                    malleable:      0, 
                    ductile:        0.62, 
                    meltingpoint:   1083, 
                    sonorous:       0, 
                    luster:         0, 
                    hardness:       89,     // Brinell BHN
                    color:          [194,115,51],
                }, 
                gold: {
                    alloy:          false,
                    conduction:     317, 
                    density:        19.30, 
                    malleable:      0, 
                    ductile:        0.93, 
                    meltingpoint:   1064, 
                    sonorous:       0, 
                    luster:         0, 
                    hardness:       80,
                    color:          [255,223,0],
                }, 
                silver: {
                    alloy:          false,
                    conduction:     420, 
                    density:        10.50, 
                    malleable:      0, 
                    ductile:        0.73, 
                    meltingpoint:   961, 
                    sonorous:       0, 
                    luster:         0, 
                    hardness:       75,
                    color:          [197,201,199],
                }, 
                lead:{
                    alloy:          false,
                    conduction:     35, 
                    density:        11.34, 
                    malleable:      0, 
                    ductile:        0.93, 
                    meltingpoint:   327, 
                    sonorous:       0, 
                    luster:         0, 
                    hardness:       30,
                    color:          [48,49,47],
                }, 
                tin:{
                    alloy:          false,
                    conduction:     35, 
                    density:        11.34, 
                    malleable:      0, 
                    ductile:        0.93, 
                    meltingpoint:   327, 
                    sonorous:       0, 
                    luster:         0, 
                    hardness:       30,
                    color:          [48,49,47],
                }, 
                platinum: {
                    alloy:          false,
                }, 
                bronze: {
                    alloy:          true,
    
                }
            },
            fabric: {
                leather: {
                    pig: {

                    },
                    cow: {

                    }
                }
            },
            wood: {
                pine: {
                    grain:          10,
                    color:          [48,49,47],
                },
                oak: {
                    grain:          50,
                    color:          [48,49,47],
                }
            }         
        },
    },
    item: {
        held: {
            weapon: {
                melee: {
                    dagger: {

                    },
                    short_sword: {

                    },
                    long_sword: {

                    },
                    spear: {
                        
                    }
                },
                ranged: {
                    bow: {

                    },
                    dart: {

                    }
                }
            },
            tool: {
                pickaxe: {

                },
                fishing_rod: {

                },
                divining_rod: {

                },
                dowsing_twig: {

                },
                hammer: {

                }   
            }
        },
        worn: {

        },
        consumed: {

        }
    },
    directions: [
        "here",
        "north", 
        "north east", 
        "east", 
        "south east", 
        "south", 
        "south west", 
        "west", 
        "north west"
    ],
    distance: [
        "here",
        "very close",
        "close",
        "not far",
        "far",
        "very far",
        "a great distance"
    ],
    strength: [
        "very powerful",
        "powerful",
        "strong",
        "moderate",
        "soft",
        "very soft",
        "weak",
        "very weak",
        "slight quivering",
        "almost no"
    ]
};
