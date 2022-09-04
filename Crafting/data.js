const FILES = {
    items: `/images/item_sheet.png`,
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
    ],
    items: {                                                                    
        dagger: {
            name:           "Dagger",
            weight:         1,
            price:          5,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["slash","pierce"],
            materials: {
                metal:      10,
                fabric:      1
            },
            stats: {
                sharpness:  0,
                hardness:   0,
                grip:       0
            },
            type:           ["weapon", "melee"],
            description:    "Add description for item here"
        },
        short_sword: {
            name:           "Short Sword",
            weight:         4,
            price:          15,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["slash","pierce"],
            materials: {
                metal:      3.8,
                fabric:     0.2
            },
            stats: {
                sharpness:  5,
                hardness:   10,
            },
            type:           ["weapon", "melee"],
            description:    "Add description for item here"  
        },
        long_sword: {
            name:           "Long Sword",
            weight:         4,
            price:          15,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["slash","pierce"],
            materials: {
                metal:     15,
                fabric:    3
            },         
            stats: {
                sharpness:  5,
                hardness:   10,
            },
            type:           ["weapon", "melee"],
            description:    "Add description for item here"  
        },
        spear: {
            name:           "Spear",
            weight:         3,
            price:          4,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["pierce"],
            materials: {
                metal:      4,
                wood:       3
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            type:           ["weapon", "thrown"],          
            description:    "Add description for item here"
        },
        pickaxe: {
            name:           "Pickaxe",
            weight:         3,
            price:          3,
            use:            ["Mine",  "Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["metal"],
            materials: {
                metal:      3,
                wood:       1,            
            },
            stats: {
                sharpness:  5,
                hardness:   10,
            },
            type:           ["tool"],
            description:    "A tool for mining metals."
        },
        wood_axe: {
            name:           "Wood Axe",
            weight:         3,
            price:          3,
            use:            ["Chop",  "Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["metal"],
            materials: {
                metal:      3,
                wood:       1,            
            },
            stats: {
                sharpness:  5,
                hardness:   10,
            },
            type:           ["tool"],
            description:    "A tool for felling trees and gathering wood."
        },
        dowsing_twig: {
            name:       "Dowsing Twig",
            weight:     0.5,
            price:      3,
            use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
            efficency:  4,
            max_efficency:  10,
            properties: ["copper"],
            materials: {
                wood:   20,
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            type:           ["tool"],
            description:    `Held in the hands and used to detect the location of |properties| ore.`
        },
        divining_rod: {
            name:       "Divining Rod",
            weight:     1,
            price:      10,
            use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
            efficency:  10,
            max_efficency:  10,
            properties: ["copper", "iron", "gold"],
            materials: {
                metal:  5,
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            type:           ["tool"],
            description:    `Held in the hands and used to detect the location of |properties| ore.`
        }, 
        climbing_pitons: {
            name:           "Climbing Pitons",
            weight:         0.5,
            price:          40,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      -1,
            max_efficency:  10,
            properties:     ["terrain", "rock"],
            materials: {
                iron:       3
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            type:           ["utility"],
            description:    "Add description for item here"
        },
        water_wings: {
            name:           "Water Wings",
            weight:         0.5,
            price:          50,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["terrain", "water"],
            materials: {
                fabric:     15
            },
            stats: {
            },
            type:           ["utility"],
            description:    "Add description for item here"
        },
        fishing_rod: {
            name:           "Fishing Rod",
            weight:         0.5,
            price:          20,
            use:            ["Fish", "Attack", "Defend", "Throw", "Look"],
            efficency:      5,
            max_efficency:  10,
            properties:     [],
            materials: {
                wood:       3,
                cord:       20
            },
            stats: {
                sharpness:  5,
            },
            type:           ["tool"],
            description:    "Add description for item here"
        },
        tool_hammer: {
            name:           "Hammer",
            weight:         0.05,
            price:          0.1,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["crafting", "tool", "metal"],
            materials: {
                metal:      1,
                wood:       1,
            },
            stats: {
                sharpness:  10,
                conduction: 20,
                hardness:   10,
                luster:     5
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        tool_needle: {
            name:           "Sewing Needle",
            weight:         0.01,
            price:          0.1,
            use:            ["Attack", "Defend", "Throw", "Look"],
            efficency:      10,
            max_efficency:  10,
            properties:     ["crafting", "tool", "fabric"],
            materials: {
                metal:  1,
            },
            stats: {
                sharpness:  10,
                conduction: 20,
                hardness:   10,
                luster:     5
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        torch_wood: {
            name:       "Torch",
            weight:     0.5,
            price:      0.5,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:      1,
            max_efficency:  10,
            properties: [],
            materials: {
                wood:       1,
                fabric:     1,
            },
            stats: {
                fuel:       4000,
                range:      5,
            },
            type:           ["light"],
            description:    "A wooden torch to light the way."
        },
        lantern: {
            name:       "Lantern",
            weight:     0.9,
            price:      30,
            use:        ["Toggle", "Attack", "Defend", "Throw", "Look"],
            efficency:      1,
            max_efficency:  10,
            properties: [],
            materials: {
                metal:  5,
                fabric: 1,
            },
            stats: {
                fuel:       9000,
                range:      11,
            },
            type:           ["light"],
            description:    "A lantern to light the way."
        }
    },
    schematic: {
        description:    `Schematic for crafting a |quality| |name|.`,
        weight:         0.01,
        use:            ["Craft", "Look"],
        materials:      { papyrus: 1, ink: 1 },
    },
    materials: {
        copper_ore: {
            name:       "copper",
            weight:     0.3,
            price:      -1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  -1,
            properties: ["crafting", "material", "metal", "copper"],
            materials: {
                copper:  1,
            },
            stats: {
                conduction:     386, 
                density:        8.93, 
                malleable:      0, 
                ductile:        0.62, 
                meltingpoint:   1083, 
                sonorous:       0, 
                luster:         0, 
                hardness:       89,     // Brinell BHN
            },
            type:           ["crafting"],
            description:    "A metal used for crafting goods."
        },
        tin_ore: {
            name:       "tin",
            weight:     0.3,
            price:      -1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  -1,
            properties: ["crafting", "material", "metal", "tin"],
            materials: {
                tin:  1,
            },
            stats: {
                conduction:     386, 
                density:        8.93, 
                malleable:      0, 
                ductile:        0.62, 
                meltingpoint:   1083, 
                sonorous:       0, 
                luster:         0, 
                hardness:       89,     // Brinell BHN
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        gold_ore: {
            name:       "gold",
            weight:     0.3,
            price:      -1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  -1,
            properties: ["crafting", "material", "metal", "gold"],
            materials: {
                gold:  1,
            },
            type:           ["crafting"],
            stats: {
                conduction:     317, 
                density:        19.30, 
                malleable:      0, 
                ductile:        0.93, 
                meltingpoint:   1064, 
                sonorous:       0, 
                luster:         0, 
                hardness:       80,
            },
            description:    "Add description for item here"
        },
        silver_ore: {
            name:       "silver",
            weight:     0.3,
            price:      10,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: ["crafting", "material", "metal", "silver"],
            materials: {
                silver:  1,
            },
            stats: {
                conduction:     420, 
                density:        10.50, 
                malleable:      0, 
                ductile:        0.73, 
                meltingpoint:   961, 
                sonorous:       0, 
                luster:         0, 
                hardness:       75,
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        lead_ore: {
            name:       "lead",
            weight:     0.3,
            price:      10,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: ["crafting", "material", "metal", "lead"],
            materials: {
                lead:  1,
            },
            stats: {
                conduction:     35, 
                density:        11.34, 
                malleable:      0, 
                ductile:        0.93, 
                meltingpoint:   327, 
                sonorous:       0, 
                luster:         0, 
                hardness:       30,
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        iron_ore: {
            name:       "iron",
            weight:     0.3,
            price:      10,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: ["crafting", "material", "metal", "iron"],
            materials: {
                iron:  1,
            },
            stats: {
                conduction:     71.8, 
                density:        7.87, 
                malleable:      0, 
                ductile:        0.43, 
                meltingpoint:   1260, 
                sonorous:       0, 
                luster:         0, 
                hardness:       235,
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        oak_wood: {
            name:       "oak wood",
            weight:     0.3,
            price:      0.1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: ["crafting", "material", "wood", "oak"],
            materials: {
                oak:  1,
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   4,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
        leather: {
            name:       "Leather (Pig)",
            weight:     0.3,
            price:      0.1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: ["crafting", "material", "fabric", "leather"],
            materials: {
                oak:  1,
            },
            stats: {
                grip:  15,
            },
            type:           ["crafting"],
            description:    "Add description for item here"
        },
    },
    colors: {
         "0":            `#000000`,  // Pure Black
         "1":            `#ffffff`,  // Pure White
         "2":            `#f9f871`,  // Yellow Light
         "3":            `#85e858`,  // Green Light
         "4":            `#00fef9`,  // Blue Light
         "5":            `#f86f29`,  // Orange Light
         "6":            `#ec59f3`,  // Pink Light
         "7":            `#132019`,  // Obsidian
         "8":            `#1e281e`,  // Deep Moss
         "9":            `#033A2A`,  // Ceramic Dark Green
        "10":            `#5e5b4d`,  // Moss Rock
        "11":            `#989889`,  // Rock Wall
        "12":            `#5e5b4d`,  // Moss Rock
        "13":            `#93a2ba`,  // Rock Blue
        "14":            `#a65052`,  // Rock Red
        "15":            `#505646`,  // Irish Moss
        "16":            `#86423e`,  // Brick
        "17":            `#968977`,  // Cobble
        "18":            `#574141`,  // Brick Brown
        "19":            `#bfa5a4`,  // Brick Tan
        "20":            `#63702c`,  // Brick Moss
        "21":            `#98a45c`,  // Brick Pale Moss
        "22":            `#00aeca`,  // Ceramic Blue
        "23":            `#645fbc`,  // Ceramic Lilac
        "24":            `#994f96`,  // Ceramic Pink
        "25":            `#a53268`,  // Ceramic Deep Pink
        "26":            `#b491cf`,  // Ceramic Purple
        "27":            `#95b0b7`,  // Ceramic Teal
        "28":            `#3e8e7d`,  // Ceramic Light Green
        "29":            `#005b90`,  // Water
        "30":            `#0067A3`,  // Light Water
        "31":            `#003452`,  // Dark Water
        "32":            `#FF7C0A`,  // Light Lava
        "33":            `#FF7700`,  // Dark Lava
    },
    tile: {
        0: {
            wfc:            "overlap",
            n:              3,
            symmetry:       3,
            periodic:       0, 
            periodicInput:  0,
            width:          70,
            height:         70,
            sampleWidth:    32,
            sampleHeight:   32,
            ground:         0,
            offsetW:        0,
            offsetH:        0,
            legend: {
                "255,255,255":  "floor",
                "0,0,0":        "wall",
            },
        },
        1: {
            wfc:            "overlap",
            n:              3,
            symmetry:       8,
            periodic:       0, 
            periodicInput:  0,
            width:          50,
            height:         50,
            sampleWidth:    32,
            sampleHeight:   32,
            ground:         0,
            offsetW:        32,
            offsetH:        0,
            legend: {
                "255,0,0":      ["floor","crafted","int"],
                "255,0,235":    ["floor","crafted","int"],
                "255,240,0":    ["door","int"],
                "118,108,108":  ["wall","crafted","int"],
                "0,0,0":        ["wall","crafted","int"],
                "255,255,255":  ["floor","worked","ext"],
                "0,198,255":    ["floor","worked","ext"],
            },
        },
        2: {
            wfc:            "overlap",
            n:              3,
            symmetry:       8,
            periodic:       0, 
            periodicInput:  0,
            width:          70,
            height:         70,
            sampleWidth:    32,
            sampleHeight:   32,
            ground:         0,
            offsetW:        64,
            offsetH:        0,
            legend: {
                "0,0,0":        ["wall","natural","int"],
                "255,255,255":  ["floor","worked","int"],
                "0,133,58":     ["wall","worked","room","int"],
                "134,134,134":  ["wall","worked","corridor","int"],
                "0,198,255":    ["floor","worked","corridor","int"],
                "255,240,0":    ["door","int"],
                "255,0,235":    ["light"],
            },
        },
        3: {
            wfc:            "overlap",
            n:              3,
            symmetry:       8,
            periodic:       0, 
            periodicInput:  0,
            width:          30,
            height:         30,
            sampleWidth:    15,
            sampleHeight:   15,
            ground:         0,
            offsetW:        96,
            offsetH:        0,
            legend: {
                "255,0,0":      ["floor","crafted","int"],
                "0,133,58":     ["wall","worked","room","int"],
                "255,255,255":  ["floor"],
                "0,0,0":        ["wall"],
                "255,240,0":    ["door","int"],
                "255,0,235":    ["light"],
            },
        },
        4: {
            wfc:            "overlap",
            n:              3,
            symmetry:       4,
            periodic:       0, 
            periodicInput:  0,
            width:          30,
            height:         30,
            sampleWidth:    15,
            sampleHeight:   15,
            ground:         0,
            offsetW:        96,
            offsetH:        16,
            legend: {
                "255,0,0":      ["floor","crafted","int"],
                "0,133,58":     ["wall","worked","room","int"],
                "134,134,134":  ["wall","worked","corridor","int"],
                "0,198,255":    ["floor","worked","corridor","int"],
                "255,255,255":  ["floor"],
                "0,0,0":        ["wall"],
                "255,240,0":    ["door","int"],
                "255,0,235":    ["light"],
            },
        },
        5: {
            wfc:            "simpletile",
            path:           'images/tiles/dgn/',
            tilesize:       3,
            width:          30,
            height:         30,
            unique:         true,
            tiles: [
                { name:"t_f", symmetry:"X", weight: 4  },
                { name:"t_c", symmetry:"L",  },
                { name:"t_w", symmetry:"I", weight: 6  },
                { name:"t_d", symmetry:"I", weight: 10 },
                { name:"t_p", symmetry:"X" },
                { name:"t_x", symmetry:"X", weight: 0.025 },
                { name:"t_t", symmetry:"T", weight: 0.025 },
            ],
            neighbors: [
                { left: "t_f 0", right: "t_f 0" },
                { left: "t_f 0", right: "t_p 0" },
                { left: "t_f 0", right: "t_w 0" },
                { left: "t_f 0", right: "t_t 3" },
                
                { left: "t_c 0", right: "t_w 1" },
                { left: "t_c 0", right: "t_d 1" },
                { left: "t_c 0", right: "t_c 1" },
                { left: "t_c 0", right: "t_c 2" },
                { left: "t_c 0", right: "t_x 0" },

                { left: "t_c 1", right: "t_f 0" },
                { left: "t_c 1", right: "t_p 0" },
                { left: "t_c 1", right: "t_w 0" },
                { left: "t_c 1", right: "t_d 0" },
                { left: "t_c 1", right: "t_c 0" },
                { left: "t_c 1", right: "t_c 3" },
                { left: "t_c 1", right: "t_t 3" },

                { left: "t_w 1", right: "t_x 0" },

                { left: "t_w 2", right: "t_t 3" },
                { left: "t_w 2", right: "t_w 2" },

                { left: "t_d 1", right: "t_x 0" },
                { left: "t_d 1", right: "t_t 0" },
                { left: "t_d 1", right: "t_t 1" },
                { left: "t_d 1", right: "t_t 2" },

                { left: "t_t 0", right: "t_t 0" },
                { left: "t_t 0", right: "t_t 1" },
                { left: "t_t 0", right: "t_t 2" },

                { left: "t_t 1", right: "t_t 3" },
                { left: "t_t 1", right: "t_w 0" },
                { left: "t_t 1", right: "t_f 0" },

                { left: "t_x 0", right: "t_t 0" },
                { left: "t_x 0", right: "t_t 1" },
                { left: "t_x 0", right: "t_t 2" },
            ],
            legend: {
                "255,255,255":  ["floor"],
                "0,0,0":        ["wall"],
                "255,255,0":    ["door","int","east"],
                "255,125,0":    ["door","int","north"],
            }
        },
        6: {
            wfc:            "simpletile",
            path:           'images/tiles/z_dgn/',
            tilesize:       3,
            width:          30,
            height:         30,
            unique:         true,
            tiles: [
                { name:"z_c_i", symmetry:"L",  },
                { name:"z_c_i_i", symmetry:"L",  },
                { name:"z_c_o", symmetry:"L",  },
                { name:"z_c_o_o", symmetry:"L",  },
                { name:"z_f_i", symmetry:"X", weight: 5  },
                { name:"z_f_o", symmetry:"X", weight: 5  },
                { name:"z_w_i_i", symmetry:"I",  },
                { name:"z_w_o", symmetry:"I",  },
                { name:"z_w_o_o", symmetry:"I",  },
            ],
            neighbors: [
                { left: "z_c_i 0", right: "z_w_o 1" },              // W/BK/BL
                { left: "z_c_i 0", right: "z_c_i 1" },   
                { left: "z_c_i 0", right: "z_c_o 2" },

                { left: "z_c_i 1", right: "z_c_i 3" },              // BLUE
                { left: "z_c_i 1", right: "z_c_i 0" },
                { left: "z_c_i 1", right: "z_f_i 0" },
                { left: "z_c_i 1", right: "z_w_o 0" },
                { left: "z_c_i 1", right: "z_c_i_i 0" },
                { left: "z_c_i 1", right: "z_c_i_i 3" },
                { left: "z_c_i 1", right: "z_w_i_i 0" },
                { left: "z_c_i 1", right: "z_w_i_i 2" },

                { left: "z_c_i 2", right: "z_c_i 3" },              // BLUE
                { left: "z_c_i 2", right: "z_c_i 0" },
                { left: "z_c_i 2", right: "z_f_i 0" },
                { left: "z_c_i 2", right: "z_w_o 0" },
                { left: "z_c_i 2", right: "z_c_i_i 0" },
                { left: "z_c_i 2", right: "z_c_i_i 3" },
                { left: "z_c_i 2", right: "z_w_i_i 0" },
                { left: "z_c_i 2", right: "z_w_i_i 2" },

                { left: "z_c_i 3", right: "z_c_i 2" },              // BL/BK/W
                { left: "z_c_i 3", right: "z_c_o 1" }, 
                { left: "z_c_i 3", right: "z_w_o 3" },

                { left: "z_c_o 0", right: "z_w_o 3" },              // BL/BK/W
                { left: "z_c_o 0", right: "z_c_i 2" },
                { left: "z_c_o 0", right: "z_c_o 1" }, 

                { left: "z_c_o 1", right: "z_c_o 0" },              // WHITE
                { left: "z_c_o 1", right: "z_c_o 3" },
                { left: "z_c_o 1", right: "z_c_o_o 0" },
                { left: "z_c_o 1", right: "z_c_o_o 3" },
                { left: "z_c_o 1", right: "z_f_o 0" },
                { left: "z_c_o 1", right: "z_w_o 2" },
                { left: "z_c_o 1", right: "z_w_o_o 0" },
                { left: "z_c_o 1", right: "z_w_o_o 2" },

                { left: "z_c_o 2", right: "z_c_o 0" },              // WHITE
                { left: "z_c_o 2", right: "z_c_o 3" },
                { left: "z_c_o 2", right: "z_c_o_o 0" },
                { left: "z_c_o 2", right: "z_c_o_o 3" },
                { left: "z_c_o 2", right: "z_f_o 0" },
                { left: "z_c_o 2", right: "z_w_o 2" },
                { left: "z_c_o 2", right: "z_w_o_o 0" },
                { left: "z_c_o 2", right: "z_w_o_o 2" },
                
                { left: "z_c_o 3", right: "z_w_o 1" },              // W/BK/BL
                { left: "z_c_o 3", right: "z_c_o 2" },
                { left: "z_c_o 3", right: "z_c_i 1" }, 
                                
                { left: "z_c_i_i 0", right: "z_c_i_i 1" },          // BL/BK/BL
                { left: "z_c_i_i 0", right: "z_c_i_i 2" },
                { left: "z_c_i_i 0", right: "z_w_i_i 1" },
                { left: "z_c_i_i 0", right: "z_w_i_i 3" },               

                { left: "z_c_i_i 1", right: "z_c_i 3" },            // BLUE
                { left: "z_c_i_i 1", right: "z_c_i 0" },
                { left: "z_c_i_i 1", right: "z_f_i 0" },
                { left: "z_c_i_i 1", right: "z_w_o 0" },
                { left: "z_c_i_i 1", right: "z_c_i_i 0" },
                { left: "z_c_i_i 1", right: "z_c_i_i 3" },
                { left: "z_c_i_i 1", right: "z_w_i_i 0" },
                { left: "z_c_i_i 1", right: "z_w_i_i 2" },

                { left: "z_c_i_i 2", right: "z_c_i 3" },            // BLUE
                { left: "z_c_i_i 2", right: "z_c_i 0" },
                { left: "z_c_i_i 2", right: "z_f_i 0" },
                { left: "z_c_i_i 2", right: "z_w_o 0" },
                { left: "z_c_i_i 2", right: "z_c_i_i 0" },
                { left: "z_c_i_i 2", right: "z_c_i_i 3" },
                { left: "z_c_i_i 2", right: "z_w_i_i 0" },
                { left: "z_c_i_i 2", right: "z_w_i_i 2" },
                
                { left: "z_c_i_i 3", right: "z_c_i_i 1" },          // BL/BK/BL
                { left: "z_c_i_i 3", right: "z_c_i_i 2" },
                { left: "z_c_i_i 3", right: "z_w_i_i 1" },
                { left: "z_c_i_i 3", right: "z_w_i_i 3" },
                
                { left: "z_c_o_o 0", right: "z_c_o_o 1" },          // W/BK/W
                { left: "z_c_o_o 0", right: "z_c_o_o 2" },
                { left: "z_c_o_o 0", right: "z_w_o_o 1" },
                { left: "z_c_o_o 0", right: "z_w_o_o 3" },

                { left: "z_c_o_o 1", right: "z_c_o 0" },            // WHITE
                { left: "z_c_o_o 1", right: "z_c_o 3" },
                { left: "z_c_o_o 1", right: "z_c_o_o 0" },
                { left: "z_c_o_o 1", right: "z_c_o_o 3" },
                { left: "z_c_o_o 1", right: "z_f_o 0" },
                { left: "z_c_o_o 1", right: "z_w_o 2" },
                { left: "z_c_o_o 1", right: "z_w_o_o 0" },
                { left: "z_c_o_o 1", right: "z_w_o_o 2" },  
                
                { left: "z_c_o_o 2", right: "z_c_o 0" },            // WHITE
                { left: "z_c_o_o 2", right: "z_c_o 3" },
                { left: "z_c_o_o 2", right: "z_c_o_o 0" },
                { left: "z_c_o_o 2", right: "z_c_o_o 3" },
                { left: "z_c_o_o 2", right: "z_f_o 0" },
                { left: "z_c_o_o 2", right: "z_w_o 2" },
                { left: "z_c_o_o 2", right: "z_w_o_o 0" },
                { left: "z_c_o_o 2", right: "z_w_o_o 2" },  
                
                { left: "z_c_o_o 3", right: "z_c_o_o 1" },          // W/BK/W
                { left: "z_c_o_o 3", right: "z_c_o_o 2" },
                { left: "z_c_o_o 3", right: "z_w_o_o 1" },
                { left: "z_c_o_o 3", right: "z_w_o_o 3" },

                // { left: "z_f_i 0", right: "z_c_i 3" },              // BLUE
                // { left: "z_f_i 0", right: "z_c_i 0" },
                { left: "z_f_i 0", right: "z_f_i 0" },
                { left: "z_f_i 0", right: "z_w_o 0" },
                // { left: "z_f_i 0", right: "z_c_i_i 0" },
                // { left: "z_f_i 0", right: "z_c_i_i 3" },
                { left: "z_f_i 0", right: "z_w_i_i 0" },
                { left: "z_f_i 0", right: "z_w_i_i 2" },

                // { left: "z_f_o 0", right: "z_c_o 0" },              // WHITE
                // { left: "z_f_o 0", right: "z_c_o 3" },
                // { left: "z_f_o 0", right: "z_c_o_o 0" },
                // { left: "z_f_o 0", right: "z_c_o_o 3" },
                { left: "z_f_o 0", right: "z_f_o 0" },
                { left: "z_f_o 0", right: "z_w_o 2" },
                { left: "z_f_o 0", right: "z_w_o_o 0" },
                { left: "z_f_o 0", right: "z_w_o_o 2" },               
                
                // { left: "z_w_i_i 0", right: "z_c_i 3" },            // BLUE
                // { left: "z_w_i_i 0", right: "z_c_i 0" },
                { left: "z_w_i_i 0", right: "z_f_i 0" },
                { left: "z_w_i_i 0", right: "z_w_o 0" },
                // { left: "z_w_i_i 0", right: "z_c_i_i 0" },
                // { left: "z_w_i_i 0", right: "z_c_i_i 3" },
                { left: "z_w_i_i 0", right: "z_w_i_i 0" },
                { left: "z_w_i_i 0", right: "z_w_i_i 2" },
                
                { left: "z_w_i_i 1", right: "z_w_i_i 2" },          // BL/BK/BL
                // { left: "z_w_i_i 1", right: "z_c_i_i 1" },
                // { left: "z_w_i_i 1", right: "z_c_i_i 2" },
                { left: "z_w_i_i 1", right: "z_w_i_i 1" },
                { left: "z_w_i_i 1", right: "z_w_i_i 3" },

                { left: "z_w_i_i 2", right: "z_c_i 3" },            // BLUE
                // { left: "z_w_i_i 2", right: "z_c_i 0" },
                { left: "z_w_i_i 2", right: "z_f_i 0" },
                { left: "z_w_i_i 2", right: "z_w_o 0" },
                // { left: "z_w_i_i 2", right: "z_c_i_i 0" },
                // { left: "z_w_i_i 2", right: "z_c_i_i 3" },
                { left: "z_w_i_i 2", right: "z_w_i_i 0" },
                { left: "z_w_i_i 2", right: "z_w_i_i 2" },
                
                { left: "z_w_i_i 3", right: "z_w_i_i 2" },          // BL/BK/BL
                // { left: "z_w_i_i 3", right: "z_c_i_i 1" },
                // { left: "z_w_i_i 3", right: "z_c_i_i 2" },
                { left: "z_w_i_i 3", right: "z_w_i_i 1" },
                { left: "z_w_i_i 3", right: "z_w_i_i 3" },

                // { left: "z_w_o 0", right: "z_c_o 0" },              // WHITE
                // { left: "z_w_o 0", right: "z_c_o 3" },
                // { left: "z_w_o 0", right: "z_c_o_o 0" },
                // { left: "z_w_o 0", right: "z_c_o_o 3" },
                { left: "z_w_o 0", right: "z_f_o 0" },
                { left: "z_w_o 0", right: "z_w_o 2" },
                { left: "z_w_o 0", right: "z_w_o_o 0" },
                { left: "z_w_o 0", right: "z_w_o_o 2" },                
     
                { left: "z_w_o 1", right: "z_w_o 1" },              // W/BK/BL
                // { left: "z_w_o 1", right: "z_c_o 2" },
                { left: "z_w_o 1", right: "z_c_i 1" }, 

                // { left: "z_w_o 2", right: "z_c_i 3" },              // BLUE
                // { left: "z_w_o 2", right: "z_c_i 0" },
                { left: "z_w_o 2", right: "z_f_i 0" },
                { left: "z_w_o 2", right: "z_w_o 0" },
                // { left: "z_w_o 2", right: "z_c_i_i 0" },
                // { left: "z_w_o 2", right: "z_c_i_i 3" },
                { left: "z_w_o 2", right: "z_w_i_i 0" },
                { left: "z_w_o 2", right: "z_w_i_i 2" },

                { left: "z_w_o 3", right: "z_w_o 3" },              // BL/BK/W
                // { left: "z_w_o 3", right: "z_c_o 1" },
                // { left: "z_w_o 3", right: "z_c_i 2" },  
                
                // { left: "z_w_o_o 0", right: "z_c_o 0" },            // WHITE
                // { left: "z_w_o_o 0", right: "z_c_o 3" },
                // { left: "z_w_o_o 0", right: "z_c_o_o 0" },
                // { left: "z_w_o_o 0", right: "z_c_o_o 3" },
                { left: "z_w_o_o 0", right: "z_f_o 0" },
                { left: "z_w_o_o 0", right: "z_w_o 2" },
                { left: "z_w_o_o 0", right: "z_w_o_o 0" },
                { left: "z_w_o_o 0", right: "z_w_o_o 2" },  

                // { left: "z_w_o_o 1", right: "z_c_o_o 1" },          // W/BK/W
                // { left: "z_w_o_o 1", right: "z_c_o_o 2" },
                { left: "z_w_o_o 1", right: "z_w_o_o 1" },
                { left: "z_w_o_o 1", right: "z_w_o_o 3" },
              
                // { left: "z_w_o_o 2", right: "z_c_o 0" },            // WHITE
                // { left: "z_w_o_o 2", right: "z_c_o 3" },
                // { left: "z_w_o_o 2", right: "z_c_o_o 0" },
                // { left: "z_w_o_o 2", right: "z_c_o_o 3" },
                { left: "z_w_o_o 2", right: "z_f_o 0" },
                { left: "z_w_o_o 2", right: "z_w_o 2" },
                { left: "z_w_o_o 2", right: "z_w_o_o 0" },
                { left: "z_w_o_o 2", right: "z_w_o_o 2" },  
                
                // { left: "z_w_o_o 3", right: "z_c_o_o 1" },          // W/BK/W
                // { left: "z_w_o_o 3", right: "z_c_o_o 2" },
                { left: "z_w_o_o 3", right: "z_w_o_o 1" },
                { left: "z_w_o_o 3", right: "z_w_o_o 3" },
  
            ],
            legend: {
                "255,255,255":  ["floor"],
                "0,0,0":        ["wall"],
                "255,255,0":    ["door","int"],
                "0,197,255":    ["floor","worked","int"],
            }
        }
    },
    legend: {
        perlin_floor:      { s:    -1, e:     0 },
        perlin_wall:       { s:     0, e:     1 },
        // perlin:     { s:    -1, e:     1 },
        special:            { s:   -99, e:    -2 },
        floor:              { s:  -999, e:  -100 },
        wall:               { s:   100, e:   999 },
        light:              { s: -1200, e: -1001 },
        device:             { s: -1300, e: -1201 },
        item:               { s:  1000, e:  4999 },
        creature:           { s:  5000, e:  7999 },
    },
    id: {
        unseen:         -2,
        exit:           -3,
        down:           -4,
        up:             -5,
    },
    collide: Object.freeze({
        BLOCK:  "BLOCK",
        PASS:   "PASS",
        HARM:   "HARM",
    }),
};


// Map Data
// Walls 100 > 999
// Value is tied to color range ()
// Floors -100 > -999
// Items 1000 >
// Fixtures -1000 <

// -1000 > Exit to Overworld Door
// -1001 > Light- Range: 8 Color: white
// -1002 > Light- Range: 10 Color: white
// -1003 > Light- Range: 8 Color: orange
// -1004 > Light- Range: 10 Color: orange