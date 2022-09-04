'use strict'
Math.lerp = ( a, b, t ) => {
    return b*t + a*(1-t);
}

Math.rndseed = (seed) => {
    const m_as_number = 2**53 - 111
    const m = 2n**53n - 111n
    const a = 5667072534355537n
    let s = BigInt(seed) % m
    return Number(s = s * a % m) / m_as_number;
}

Math.direction = ( ax, ay, bx, by ) => {
    const TWOPI = 6.2831853071795865;
    const RAD2DEG = 57.2957795130823209;

    if ( ax === bx && ay === by ) return -1;                                    // Same points

    let theta = Math.atan2(bx - ax, ay - by);
    if (theta < 0.0 ) theta += TWOPI;

    return RAD2DEG * theta;
}

Math.distance = ( ax, ay, bx, by ) => {
    const X = ax - bx;
    const Y = ay - by;
    return Math.hypot(X,Y);
}

Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function degAsText( deg ) {
    if ( deg === -1 ) return DATA.directions[0];
    const NUM = DATA.directions.length - 1;                                     // Account for the -1
    return DATA.directions[
        Math.floor(((deg+(360/NUM)/2)%360)/(360/NUM)) + 1];                     // +1 to skip the -1 text
}

function degAsCardinalNum( deg ) {
    if ( deg === -1 ) return 0;
    const NUM = DATA.directions.length - 1;                                     // Account for the -1
    return Math.floor(((deg+(360/NUM)/2)%360)/(360/NUM)) + 1;                     // +1 to skip the -1 text
}

function dirAsText( ax, ay, bx, by ) {
    return degAsText( Math.direction( ax, ay, bx, by ) );
}

function distAsText( dist, max ) {
    const NUM = DATA.distance.length - 1;
    return DATA.distance[Math.round(dist / max * NUM)];
}

function strengthAsText( str, max ) {
    const NUM = DATA.strength.length;
    return DATA.strength[Math.round(str / max * NUM)];
}

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);        
    return [r,g,b];
}

function qualityAsText( quality, max = 150 ) {
    const NUM = DATA.item_quality.length;
    if ( quality <= 0 ) quality = 1;
    if ( quality >= max ) quality = max-1;
    return DATA.item_quality[Math.floor(quality / max * NUM)];
}

function genID( length = 8 ) {
    return Math.random().toString(16).substring(2, 2 + length);                 // Return random string
}

// https://stackoverflow.com/a/46161940/6126468
function ShuffleArray( array ) {
    const newArr = array.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
}

// Generate array of values that simulate a spiral (r,d,l,u)
function spiral( r ) {
    r = (r * 2) + 1;
    const X = r;
    const Y = r;
    const HR = (X - 1) / 2;
    const VR = (Y - 1) / 2;
    const TT = X * Y;
    const MATRIX = [];
    let step = 1;
    let iy = 0;
    let ix = 0;
    let dx = 1;
    let dy = 0;
  
    while(MATRIX.length < TT) {
        if((ix <= HR && ix >= (HR * -1)) && (iy <= VR && (iy >= (VR * -1)))) {
            MATRIX.push([ix, iy]);
        }
        ix += dx;
        iy += dy;

        if(dx !== 0) {                                                          // check direction           
            if(ix === step && iy === (step * -1)) step++;                       // increase step
            if(ix === step || (ix === step * -1)) {                             // horizontal range reached
                dy = (ix === iy)? (dx * -1) : dx;
                dx = 0;  
            }
            } else {
            if(iy === step || (iy === step * -1)) {                             // vertical range reached
                dx = (ix === iy)? (dy * -1) : dy;
                dy = 0;
            }
        }
    }
    return MATRIX; 
}
  
// Version 4.0
// https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
function shadeRGB(color, percent) {
    let f=color.split(","),
        t=percent<0?0:255,
        p=percent<0?percent*-1:percent,
        R=parseInt(f[0].slice(4)),
        G=parseInt(f[1]),
        B=parseInt(f[2]);
    return `rgb(${(Math.round((t-R)*p)+R)},${(Math.round((t-G)*p)+G)},${(Math.round((t-B)*p)+B)})`;
}

// Version 4.1
const pSBC=(p,c0,c1,l)=>{
	let r,g,b,P,f,t,h,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBC.pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBC.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

pSBC.pSBCr=(d)=>{
	const i=parseInt;
	let n=d.length,x={};
	if(n>9){
		const [r, g, b, a] = (d = d.split(','));
	        n = d.length;
		if(n<3||n>4)return null;
		x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
	}else{
		if(n==8||n==6||n<4)return null;
		if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
		d=i(d.slice(1),16);
		if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=Math.round((d&255)/0.255)/1000;
		else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
	}return x
};

function convertRange( val, omin, omax, nmin, nmax ) {
    const orange = omax-omin;
    const nrange = nmax-nmin;
    return (((val - omin)*nrange)/orange)+nmin;
}

function randomIndice(array, r) {
    let sum = 0;
    let x = 0;
    let i = 0;
    for (; i < array.length; i++) sum += array[i];
    i = 0;
    r *= sum;
    while (r && i < array.length) {
        x += array[i];
        if (r <= x) return i;
        i++;
    }
    return 0;
}

function histogram(iterable) {
    const result = new Map();
    for (const x of iterable) {
        result.set(x, (result.get(x) || 0) + 1);
    }
    return result;
};

function mostCommon(iterable) {
    let maxCount = 0;
    let maxKey;
    for (const [key, count] of histogram(iterable)) {
        if (count > maxCount) {
            maxCount = count;
            maxKey = key;
        }
    }
    return maxKey;
};

// https://stackoverflow.com/a/26554873/6126468
function* range(start, stop, step=1) {
    if ( stop == null ) {
        stop = start;
        start = 0;
    }
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
    }
}

/*
Fraction.js v4.2.0 05/03/2022
https://www.xarg.org/2014/03/rational-numbers-in-javascript/
Copyright (c) 2021, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function(z){function p(a,c){var b=0,d=1,f=1,l=0,k=0,t=0,x=1,u=1,g=0,h=1,v=1,q=1;if(void 0!==a&&null!==a)if(void 0!==c){if(b=a,d=c,f=b*d,0!==b%1||0!==d%1)throw m.NonIntegerParameter;}else switch(typeof a){case "object":if("d"in a&&"n"in a)b=a.n,d=a.d,"s"in a&&(b*=a.s);else if(0 in a)b=a[0],1 in a&&(d=a[1]);else throw m.InvalidParameter;f=b*d;break;case "number":0>a&&(f=a,a=-a);if(0===a%1)b=a;else if(0<a){1<=a&&(u=Math.pow(10,Math.floor(1+Math.log(a)/Math.LN10)),a/=u);for(;1E7>=h&&1E7>=q;)if(b=(g+
    v)/(h+q),a===b){1E7>=h+q?(b=g+v,d=h+q):q>h?(b=v,d=q):(b=g,d=h);break}else a>b?(g+=v,h+=q):(v+=g,q+=h),1E7<h?(b=v,d=q):(b=g,d=h);b*=u}else if(isNaN(a)||isNaN(c))d=b=NaN;break;case "string":h=a.match(/\d+|./g);if(null===h)throw m.InvalidParameter;"-"===h[g]?(f=-1,g++):"+"===h[g]&&g++;if(h.length===g+1)k=r(h[g++],f);else if("."===h[g+1]||"."===h[g]){"."!==h[g]&&(l=r(h[g++],f));g++;if(g+1===h.length||"("===h[g+1]&&")"===h[g+3]||"'"===h[g+1]&&"'"===h[g+3])k=r(h[g],f),x=Math.pow(10,h[g].length),g++;if("("===
    h[g]&&")"===h[g+2]||"'"===h[g]&&"'"===h[g+2])t=r(h[g+1],f),u=Math.pow(10,h[g+1].length)-1,g+=3}else"/"===h[g+1]||":"===h[g+1]?(k=r(h[g],f),x=r(h[g+2],1),g+=3):"/"===h[g+3]&&" "===h[g+1]&&(l=r(h[g],f),k=r(h[g+2],f),x=r(h[g+4],1),g+=5);if(h.length<=g){d=x*u;f=b=t+d*l+u*k;break}default:throw m.InvalidParameter;}if(0===d)throw m.DivisionByZero;e.s=0>f?-1:1;e.n=Math.abs(b);e.d=Math.abs(d)}function r(a,c){if(isNaN(a=parseInt(a,10)))throw m.InvalidParameter;return a*c}function n(a,c){if(0===c)throw m.DivisionByZero;
    var b=Object.create(m.prototype);b.s=0>a?-1:1;a=0>a?-a:a;var d=w(a,c);b.n=a/d;b.d=c/d;return b}function y(a){for(var c={},b=a,d=2,f=4;f<=b;){for(;0===b%d;)b/=d,c[d]=(c[d]||0)+1;f+=1+2*d++}b!==a?1<b&&(c[b]=(c[b]||0)+1):c[a]=(c[a]||0)+1;return c}function w(a,c){if(!a)return c;if(!c)return a;for(;;){a%=c;if(!a)return c;c%=a;if(!c)return a}}function m(a,c){p(a,c);if(this instanceof m)a=w(e.d,e.n),this.s=e.s,this.n=e.n/a,this.d=e.d/a;else return n(e.s*e.n,e.d)}var e={s:1,n:0,d:1};m.DivisionByZero=Error("Division by Zero");
    m.InvalidParameter=Error("Invalid argument");m.NonIntegerParameter=Error("Parameters must be integer");m.prototype={s:1,n:0,d:1,abs:function(){return n(this.n,this.d)},neg:function(){return n(-this.s*this.n,this.d)},add:function(a,c){p(a,c);return n(this.s*this.n*e.d+e.s*this.d*e.n,this.d*e.d)},sub:function(a,c){p(a,c);return n(this.s*this.n*e.d-e.s*this.d*e.n,this.d*e.d)},mul:function(a,c){p(a,c);return n(this.s*e.s*this.n*e.n,this.d*e.d)},div:function(a,c){p(a,c);return n(this.s*e.s*this.n*e.d,
    this.d*e.n)},clone:function(){return n(this.s*this.n,this.d)},mod:function(a,c){if(isNaN(this.n)||isNaN(this.d))return new m(NaN);if(void 0===a)return n(this.s*this.n%this.d,1);p(a,c);if(0===e.n&&0===this.d)throw m.DivisionByZero;return n(this.s*e.d*this.n%(e.n*this.d),e.d*this.d)},gcd:function(a,c){p(a,c);return n(w(e.n,this.n)*w(e.d,this.d),e.d*this.d)},lcm:function(a,c){p(a,c);return 0===e.n&&0===this.n?n(0,1):n(e.n*this.n,w(e.n,this.n)*w(e.d,this.d))},ceil:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||
    isNaN(this.d)?new m(NaN):n(Math.ceil(a*this.s*this.n/this.d),a)},floor:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new m(NaN):n(Math.floor(a*this.s*this.n/this.d),a)},round:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new m(NaN):n(Math.round(a*this.s*this.n/this.d),a)},inverse:function(){return n(this.s*this.d,this.n)},pow:function(a,c){p(a,c);if(1===e.d)return 0>e.s?n(Math.pow(this.s*this.d,e.n),Math.pow(this.n,e.n)):n(Math.pow(this.s*this.n,e.n),Math.pow(this.d,
    e.n));if(0>this.s)return null;var b=y(this.n),d=y(this.d),f=1,l=1,k;for(k in b)if("1"!==k){if("0"===k){f=0;break}b[k]*=e.n;if(0===b[k]%e.d)b[k]/=e.d;else return null;f*=Math.pow(k,b[k])}for(k in d)if("1"!==k){d[k]*=e.n;if(0===d[k]%e.d)d[k]/=e.d;else return null;l*=Math.pow(k,d[k])}return 0>e.s?n(l,f):n(f,l)},equals:function(a,c){p(a,c);return this.s*this.n*e.d===e.s*e.n*this.d},compare:function(a,c){p(a,c);var b=this.s*this.n*e.d-e.s*e.n*this.d;return(0<b)-(0>b)},simplify:function(a){if(isNaN(this.n)||
    isNaN(this.d))return this;a=a||.001;for(var c=this.abs(),b=c.toContinued(),d=1;d<b.length;d++){for(var f=n(b[d-1],1),l=d-2;0<=l;l--)f=f.inverse().add(b[l]);if(f.sub(c).abs().valueOf()<a)return f.mul(this.s)}return this},divisible:function(a,c){p(a,c);return!(!(e.n*this.d)||this.n*e.d%(e.n*this.d))},valueOf:function(){return this.s*this.n/this.d},toFraction:function(a){var c,b="",d=this.n,f=this.d;0>this.s&&(b+="-");1===f?b+=d:(a&&0<(c=Math.floor(d/f))&&(b=b+c+" ",d%=f),b=b+d+"/",b+=f);return b},toLatex:function(a){var c,
    b="",d=this.n,f=this.d;0>this.s&&(b+="-");1===f?b+=d:(a&&0<(c=Math.floor(d/f))&&(b+=c,d%=f),b=b+"\\frac{"+d+"}{"+f,b+="}");return b},toContinued:function(){var a=this.n,c=this.d,b=[];if(isNaN(a)||isNaN(c))return b;do{b.push(Math.floor(a/c));var d=a%c;a=c;c=d}while(1!==a);return b},toString:function(a){var c=this.n,b=this.d;if(isNaN(c)||isNaN(b))return"NaN";var d;a:{for(d=b;0===d%2;d/=2);for(;0===d%5;d/=5);if(1===d)d=0;else{for(var f=10%d,l=1;1!==f;l++)if(f=10*f%d,2E3<l){d=0;break a}d=l}}a:{f=1;l=
    10;for(var k=d,t=1;0<k;l=l*l%b,k>>=1)k&1&&(t=t*l%b);l=t;for(k=0;300>k;k++){if(f===l){l=k;break a}f=10*f%b;l=10*l%b}l=0}f=0>this.s?"-":"";f+=c/b|0;(c=c%b*10)&&(f+=".");if(d){for(a=l;a--;)f+=c/b|0,c%=b,c*=10;f+="(";for(a=d;a--;)f+=c/b|0,c%=b,c*=10;f+=")"}else for(a=a||15;c&&a--;)f+=c/b|0,c%=b,c*=10;return f}};"function"===typeof define&&define.amd?define([],function(){return m}):"object"===typeof exports?(Object.defineProperty(m,"__esModule",{value:!0}),m["default"]=m,m.Fraction=m,module.exports=m):
    z.Fraction=m})(this);