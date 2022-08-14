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
