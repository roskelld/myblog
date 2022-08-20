'use strict'

// wfc-simpletile-worker.js
// Crafting Prototype Game
// Created by Dean Roskell on 11-08-22 based on the Javascript implementation 
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

importScripts('lib.js');
importScripts('wfc-model.js');
importScripts('wfc-simpletile-model.js');

onmessage = function(e) {
    postMessage({type:'message', message: '> Initiated the WebWorker'});
    var tries = 0;
    // var instance = new SimpleTiledModel(new Uint8Array(e.data.sampleData), e.data.sampleWidth, e.data.sampleHeight, e.data.n, e.data.width, e.data.height, e.data.periodicInput, e.data.periodic, e.data.symmetry, e.data.ground);
    console.log( e.data );
    // (data, subsetName, width, height, periodic) 
    var instance = new SimpleTiledModel( e.data.data, null, e.data.width, e.data.height, e.data.periodic );
    postMessage({type:'message', message: '> Instantiated SimpleTileModel'});
    
    var finished = false;
    var time;
    
    do {
        tries++;
        postMessage({type:'message', message: '> Generation attempt #' + tries + ' out of 5'});
        time = Date.now();
        finished = instance.generate();
        postMessage({type:'message', message: '> Generation completed ' + (finished ? 'successfully' : 'unsuccessfully') + ' in ' + ((Date.now() - time) / 1000).toFixed(3) + 's'});
    } while (tries < 5 && !finished);
    var messageObject = {
        type: 'data',
        data: finished ? instance.graphics(new Uint8Array(e.data.generateData)).buffer : e.data.generateData,
        width: e.data.width * e.data.data.tilesize,
        height: e.data.height * e.data.data.tilesize,
        finished: finished
    };

    postMessage(messageObject, [messageObject.data]);
};