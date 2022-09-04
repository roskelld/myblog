'use strict'

// wfc-simpletile.js
// Crafting Prototype Game
// Created by Dean Roskell on 11-08-22 based on the Javascript implimentation 
// (by Kevin Chapelier) of the // Wave Function Collapse 
// https://github.com/mxgmn/WaveFunctionCollapse project by Maxim Gumin


// The MIT License (MIT)

// Copyright (c) 2014 Kevin Chapelier

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

class WFC_TILE {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.style["image-rendering"] = "crisp-edges"; 
        this.ctx = this.canvas.getContext("2d");
        this.gen_data = null;
        this.selected_tile = null;
        this.returnCallback = null;

        this.WFC_WORKER = new Worker("wfc-simpleTile-worker.js");

        this.WFC_WORKER.onmessage = e => {            
            if ( e.data.type === "message" ) {                                  // Comes back from the Worker to the client with a nice payload
                console.log(e.data.message);
            } else {
                if ( e.data.finished) {
                    this.generatedData = { 
                        data: new Uint8ClampedArray(e.data.data), 
                        width: e.data.width, 
                        height: e.data.height 
                    };
                    this._returnData();
                }
            }
        }
    }
    start( tileset, subsetName, callback ) {
        this.tileset = DATA.tile[tileset];
        this.tileset_num = tileset; 
        this.subsetName = subsetName;                                           // Subset of tiles (optional)
        this.returnCallback = callback;                                         // Where to return the gen array to
        this.width = this.tileset.width / this.tileset.tilesize;
        this.height = this.tileset.height / this.tileset.tilesize;

        if ( !Number.isInteger(this.width) || !Number.isInteger(this.height) )
            return console.error(
                `Requested size ${this.tileset.width}/${this.tileset.height} 
                is not divisible by tilesize ${this.tileset.tilesize}`);

        this.remaining = 0;
        const ld_callback = () => {
            this.remaining--;

            if ( this.remaining === 0 ) {
                this._process(this, this.tileset);                               // After loading all tiles process them
            }
        }
        for (let i = 0; i < this.tileset.tiles.length; i++) { 
            if ( this.tileset.tiles[i].symmetry === "X" ) {
                this.remaining++;
                this.tileset.tiles[i].bitmap = new Array(1);
                this._loadTile(this.tileset.tiles[i],0,this.tileset,ld_callback);
            } else {
                this.remaining += 4;
                this.tileset.tiles[i].bitmap = new Array(4);
                this._loadTile(this.tileset.tiles[i],0,this.tileset,ld_callback);
                this._loadTile(this.tileset.tiles[i],1,this.tileset,ld_callback);
                this._loadTile(this.tileset.tiles[i],2,this.tileset,ld_callback);
                this._loadTile(this.tileset.tiles[i],3,this.tileset,ld_callback);
            }  
        }
    }
    _loadTile( tile, number, preset, callback) {
        const IMG = new Image();
        const unique = number !== null;
        IMG.onload = () => {
            this.canvas.width = IMG.width;
            this.canvas.height = IMG.height;
            this.ctx.drawImage(IMG, 0, 0);
            const IMG_DATA = this.ctx.getImageData(0, 0, IMG.width, IMG.height);

            if ( number === null ) {
                tile.bitmap = IMG_DATA.data;
            } else {
                tile.bitmap[number] = IMG_DATA.data;
            }

            callback();
        }
        IMG.src = `${preset.path}${tile.name}${unique ?' '+number:''}.png`;

    }
    _process(wfc, data) {
        const WIDTH = this.width;
        const HEIGHT = this.height;
        this.canvas.width = WIDTH * data.tilesize;
        this.canvas.height = HEIGHT * data.tilesize;
        this.ctx.width = WIDTH * data.tilesize;
        this.ctx.height = HEIGHT * data.tilesize;
        this.ctx.imageSmoothingEnabled = false;

        this.gen_data = this.ctx.createImageData( WIDTH * data.tilesize, HEIGHT * data.tilesize );

        const MESSAGE = {
            generateData: this.gen_data.data.buffer,
            data: this.tileset,
            subset: this.currentSubset,
            width: WIDTH,
            height: WIDTH,
            periodic: 0,
            black: 0
        }
        this.WFC_WORKER.postMessage(MESSAGE, [MESSAGE.generateData]);
    }
    _returnData() {
        // this._debug( this.generatedData );
        this.returnCallback(this.generatedData, this.tileset_num );
        this.returnCallback = null;
        this.selected_tile = null;
        this.tileset = null;
        this.tileset_num = null;
    }
    _debug( data ) {
        document.body.prepend(this.canvas);
        const WIDTH = data.width;
        const HEIGHT = data.height;
        const ARRAY = new Uint8ClampedArray(data.data);
        const IMG = new ImageData(ARRAY, WIDTH, HEIGHT);
        this.ctx.fillRect(0,0,this.ctx.width,this.ctx.height);
        this.canvas.width = WIDTH;
        this.canvas.height = WIDTH;
        this.ctx.putImageData(IMG, 0, 0, 0, 0, WIDTH, HEIGHT );
    }
}