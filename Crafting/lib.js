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

function degAsText( deg ) {
    if ( deg === -1 ) return DATA.directions[0];
    const NUM = DATA.directions.length - 1;                                     // Account for the -1
    return DATA.directions[
        Math.floor(((deg+(360/NUM)/2)%360)/(360/NUM)) + 1];                     // +1 to skip the -1 text
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
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
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