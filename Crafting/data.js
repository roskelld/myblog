
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
            properties:     [],
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
            efficency:      -1,
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
            name:       "Sewing Needle",
            weight:     0.01,
            price:      0.1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  10,
            max_efficency:  10,
            properties: ["crafting", "tool", "fabric"],
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
            weight:     3,
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
            weight:     3,
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
            weight:     3,
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
            weight:     3,
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
            weight:     3,
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
            weight:     3,
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
            weight:     3,
            price:      10,
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
            weight:     3,
            price:      10,
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
    item: {
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
            description:    "A tool for mining metals."
        },
        dwsngTwg: {
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
            description:    `Held in the hands and used to detect the location of |properties| ore.`
        },
        dwsngTwgIron: {
            name:       "Dowsing Twig",
            weight:     0.5,
            price:      3,
            use:        ["Survey", "Look", "Attack", "Throw", "Defend"],
            efficency:  4,
            max_efficency:  10,
            properties: ["iron"],
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
            description:    "Add description for item here"
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
            description:    `Held in the hands and used to detect the location of |properties| ore.`
        }, 
        
        dagger: {
            name:       "Dagger",
            weight:     1,
            price:      5,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  10,
            max_efficency:  10,
            properties: [],
            materials: {
                metal:  10,
                cloth:  1
            },
            stats: {
                sharpness:      5,
                hardness:       10,
            },
            description:    "Add description for item here"
        },
        sml_statue: {
            name:       "Small Statue",
            weight:     1,
            price:      8,
            use:        ["Look", "Attack", "Throw", "Defend"],
            efficency:  -1,
            max_efficency:  -1,
            properties: [],
            materials: {
                stone:  5
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        long_sword: {
            name:       "Long Sword",
            weight:     4,
            price:      15,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  10,
            max_efficency:  10,
            properties: [],
            materials: {
                copper:  3.8,
                leather:  0.2
            },
            stats: {
                sharpness:  5,
                hardness:   10,
            },
            description:    "Add description for item here"            
        },
        spear: {
            name:       "Spear",
            weight:     3,
            price:      4,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  10,
            max_efficency:  10,
            properties: [],
            materials: {
                metal:  10,
                wood:   20
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        smlhut: {
            name:       "Small Hut",
            weight:     0.05,
            price:      100,
            use:        ["Build", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: [],
            materials: {
                clay:   100,
                wood:   50,                
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        dice_six: {
            name:       "Dice six sided",
            weight:     0.05,
            price:      0.1,
            use:        ["Roll Dice", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: [],
            materials: {
                bone:  1
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        lute: {
            name:       "Lute",
            weight:     0.05,
            price:      0.1,
            use:        ["Play Song", "Look"],
            efficency:  5,
            max_efficency:  5,
            properties: [],
            materials: {
                wood:  1
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        shortbow: {
            name:       "Short Bow",
            weight:     0.05,
            price:      0.1,
            use:        ["Shoot", "Throw", "Look"],
            efficency:  13,
            max_efficency:  13,
            properties: [],
            materials: {
                paper:  1
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        parrow: {
            name:       "Parrow Bird",
            weight:     0.05,
            price:      25,
            use:        ["Pet", "Feed", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: [],
            materials: {
                meat:  1
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        hltpotion: {
            name:       "Potion of Healing",
            weight:     0.05,
            price:      0.1,
            use:        ["Drink", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  -1,
            properties: ["charge","charge","charge","charge","charge"],
            materials: {
                liquid:  1,
                glass:   1
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        tool_hammer: {
            name:       "Hammer",
            weight:     0.05,
            price:      0.1,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  10,
            max_efficency:  10,
            properties: ["crafting", "tool"],
            materials: {
                iron:  1,
                oak:   1,
            },
            stats: {
                sharpness:  10,
                conduction: 20,
                hardness:   10,
                luster:     5
            },
            description:    "Add description for item here"
        },
        climbing_pitons: {
            name:       "Climbing Pitons",
            weight:     0.5,
            price:      40,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: [],
            materials: {
                iron:  0.5
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        water_wings: {
            name:       "Water Wings",
            weight:     0.5,
            price:      50,
            use:        ["Attack", "Defend", "Throw", "Look"],
            efficency:  -1,
            max_efficency:  10,
            properties: ["terrain", "water"],
            materials: {
                iron:  0.5
            },
            stats: {
                sharpness:  5,
                conduction: 20,
                hardness:   10,
                luster:     5,
                sonorous:   4,
                meltingpoint: 250
            },
            description:    "Add description for item here"
        },
        fishing_rod: {
            name:       "Fishing Rod",
            weight:     0.5,
            price:      20,
            use:        ["Fish", "Attack", "Defend", "Throw", "Look"],
            efficency:  5,
            max_efficency:  10,
            properties: [],
            materials: {
                oak:  0.5
            },
            stats: {
                sharpness:  5,
            },
            description:    "Add description for item here"
        }
    },

};


