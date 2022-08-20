'use strict'

// wfc-overlap.js
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

class WFC_OVERLAP {
    constructor() {
        this.DEFAULT = {
            n:              3,
            symmetry:       3,
            periodic:       1, 
            periodicInput:  0,
            width:          70,
            height:         70,
            sampleWidth:    31,
            sampleHeight:   31,
            ground:         0,
            offsetW:        0,
            offsetH:        0,
        }
        this.OPTIONS = Object.assign({}, this.DEFAULT);
        this.tile_sheet = null;
        this.tile_num   = null;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style["image-rendering"] = "crisp-edges";        
        this.gen_data = null;
        this.selected_tile = null;
        this.returnCallback = null;
        this.WFC_WORKER = new Worker("wfc-overlap-worker.js");

        this.WFC_WORKER.onmessage = e => {            
            if ( e.data.type === "message" ) {                                  // Comes back from the Worker to the client with a nice payload
                console.log(e.data.message);
            } else {
                if ( e.data.finished) {
                    this.generatedData = { 
                        data: new Uint8ClampedArray(e.data.data), 
                        width: this.selected_tile.width, 
                        height: this.selected_tile.height 
                    };
                    this._returnData();
                }
            }
        }
    }
    start( tile, callback ) {
        this.selected_tile = DATA.tile[tile];
        this.tile_num = tile;
        this.returnCallback = callback;
        if (!this.tile_sheet) {
            this._loadImage("tile_sheet", this._process);
        } else {
            this._process(this, this.tile_sheet);
        }
    }
    _loadImage(name, callback) {
        this.tile_sheet = new Image();
        this.tile_sheet.onload = () => callback(this, this.tile_sheet);
        this.tile_sheet.src = `./images/${name}.png`;
    }
    _process(wfc, img) {
        wfc.canvas.width = img.width;
        wfc.canvas.height = img.height;
        wfc.ctx.width = img.width;
        wfc.ctx.height = img.height;
        wfc.ctx.imageSmoothingEnabled = false;
        wfc.ctx.drawImage(img, 0, 0, img.width, img.height );      
        const DATA = wfc.ctx.getImageData(
            wfc.selected_tile.offsetW,
            wfc.selected_tile.offsetH,
            wfc.selected_tile.sampleWidth,
            wfc.selected_tile.sampleHeight,
            );
        wfc._generate(DATA);
    }
    _generate(img) {
        if (!this.selected_tile) console.error("No Tile Data Provided");
        // this.gen_img = this.ctx.createImageData(
        //     this.selected_tile.width * window.devicePixelRatio,
        //     this.selected_tile.height * window.devicePixelRatio);
        this.gen_img = this.ctx.createImageData(
            this.selected_tile.width,
            this.selected_tile.height);            
        const MESSAGE = {
            generatedImage: this.gen_img.data.buffer,
            sampleData:     img.data.buffer,
            sampleWidth:    img.width,
            sampleHeight:   img.height,
            n:              this.selected_tile.n,
            width:          this.selected_tile.width,
            height:         this.selected_tile.height,
            periodicInput:  this.selected_tile.periodicInput,
            periodic:       this.selected_tile.periodic,
            symmetry:       this.selected_tile.symmetry,
            ground:         this.selected_tile.ground,
        }
        this.WFC_WORKER.postMessage(MESSAGE, [MESSAGE.generatedImage]);
    }
    _returnData() {
        // this._debug( this.generatedData );
        this.returnCallback(this.generatedData, this.tile_num);
        this.returnCallback = null;
        this.selected_tile = null;
        this.tile_num = null;
    }
    _debug( data ) {
        console.log(data);
        document.body.prepend(this.canvas);
        const WIDTH = data.width;
        const HEIGHT = data.height;
        const IMG = new ImageData(data.data, WIDTH, HEIGHT);
        this.ctx.fillRect(0,0,this.ctx.width,this.ctx.height);
        this.canvas.width = WIDTH*2;
        this.canvas.height = WIDTH*2;
        this.ctx.putImageData(IMG, 0, 0, 0, 0, WIDTH, HEIGHT );
    }
}