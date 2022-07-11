// https://joeiddon.github.io/perlin/perlin.js
'use strict';

class Perlin {
    constructor() {
        this.seed();
    }

    randVector() {
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    }

    dotProdGrid(x, y, vx, vy) {
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (this.gradients[[vx,vy]]){
            g_vect = this.gradients[[vx,vy]];
        } else {
            g_vect = this.randVector();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    smootherStep(x) {
        return 6*x**5 - 15*x**4 + 10*x**3;
    }

    interp(x, a, b) {
        return a + this.smootherStep(x) * (b-a);
    }

    seed() {
        this.gradients = {};
        this.memory = {};
    }
    get(x, y) {
        if (this.memory.hasOwnProperty([x,y]))
        return this.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dotProdGrid(x, y, xf,   yf);
        let tr = this.dotProdGrid(x, y, xf+1, yf);
        let bl = this.dotProdGrid(x, y, xf,   yf+1);
        let br = this.dotProdGrid(x, y, xf+1, yf+1);
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    }
}