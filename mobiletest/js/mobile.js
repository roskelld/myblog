'use strict';

class Mobile {
    constructor() {
        this.app = document.querySelector('#app');
        this._heightPad			 = document.getElementsByTagName('header')[0];
		this._footerPad			 = document.getElementsByTagName('footer')[0];

        // Debug
        this.debugEl             = document.querySelector( '#debug' );

        this._canvas = document.createElement('canvas');
        this._canvas.oncontextmenu = () => false; // Block context menu
        this._ctx = this._canvas.getContext('2d');
        this._ctx.imageSmoothingEnabled = false;
		this._ctx.webkitImageSmoothingEnabled = false;

        this.image = new Image();
        this.image.src = '/mobiletest/img/road.png';
        this.image.onload = () => {
            this._dirty = true;
        }


        this._lastX = 0;
        this._lastY = 0;
        this._dragStart = null;
        this._lastTouchDistance = 0;

        this._scaleFactor = 1.1;

        this._dirty = true;

        // LISTENERS
        this._canvas.addEventListener("touchstart", e => {
            e.preventDefault();
            this.touchDown( e );
        }, {passive: false} );

        this._canvas.addEventListener("touchend", e => {
            e.preventDefault();
            if ( e.touches.length === 1 ) {
                this._lastX = e.targetTouches[0].pageX;
                this._lastY = e.targetTouches[0].pageY;
                this._dragStart = this._ctx.transformedPoint( this._lastX, this._lastY );
            }
            // this._dragStart = null;
        }, {passive: false} );

        this._canvas.addEventListener('touchmove', e => {
            if (e.cancelable) {
                e.preventDefault();
            }
            this.touchMove(e);
        }, true );
    }

    touchDown( e ) {
        // Setup drag
        if ( e.touches.length === 1 ) {
            this._lastX = e.targetTouches[0].pageX;
            this._lastY = e.targetTouches[0].pageY;
            this._dragStart = this._ctx.transformedPoint( this._lastX, this._lastY );
        } else {
            this._dragStart = null;
        }
    }

    touchMove( e ) {
        // DEBUGTEXT
        let text = "";
        let dist = 0;
        if ( e.touches.length > 1 ) {
            dist = Math.hypot(
                e.touches[0].screenX - e.touches[1].screenX,
                e.touches[0].screenY - e.touches[1].screenY
            );
        } else {
            dist = Math.hypot(
                e.touches[0].screenX,
                e.touches[0].screenY
            );
        }

        // build position text
        for ( const touch in e.touches ) {
            if ( e.touches.hasOwnProperty(touch) ) {
                text = `${text} || ${e.touches[touch].screenX} : ${e.touches[touch].screenY}`;
            }
        };

        text = `${e.touches.length} | ${dist.toFixed(2)} :: ${(dist - this._lastTouchDistance).toFixed(2)} :: ${text}`

        // this.writeDebug( text );

        // MOVE CODE
        this._x = e.targetTouches[0].pageX;
        this._y = e.targetTouches[0].pageY;

        this._lastX = this._x;
        this._lastY = this._y;

        // One Finger Touch therefore pan image
        if ( e.touches.length === 1 && this._dragStart != null ) {
            const pt = this._ctx.transformedPoint( this._lastX, this._lastY );
			this._ctx.translate( pt.x - this._dragStart.x, pt.y - this._dragStart.y );
            this._dirty = true;
        } else if ( e.touches.length > 1 ){
            this._dragStart = null;
            const amount = (dist - this._lastTouchDistance);
            this.writeDebug( `ZOOM: ${amount} : ${dist}` );
            if ( dist > 100 && Math.abs(amount) > 0.2 ) {

                if ( amount > 0 ) {
                    this.zoomCanvas( 0.5 );
                } else {
                    this.zoomCanvas( -0.5 );
                }
            }
        }


        this._lastTouchDistance = dist;
    }

    open() {
        this.app.appendChild( this._canvas );

        // Start Position
		this._trackTransforms( this._ctx );

        this.setCanvasSize();

        this.writeDebug( `12:15am` );
    }

    setCanvasSize() {
        this._ctx.canvas.width = this.app.clientWidth;
        this._ctx.canvas.height = window.innerHeight - this._heightPad.clientHeight - this._footerPad.clientHeight;
    }

    _trackTransforms(ctx) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        let xform = svg.createSVGMatrix();
        ctx.getTransform = function () { return xform; };

        const savedTransforms = [];
        const save = ctx.save;
        ctx.save = function () {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };

        const restore = ctx.restore;
        ctx.restore = function () {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        const scale = ctx.scale;
        ctx.scale = function (sx, sy) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        const rotate = ctx.rotate;
        ctx.rotate = function (radians) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        const translate = ctx.translate;
        ctx.translate = function (dx, dy) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        const transform = ctx.transform;
        ctx.transform = function (a, b, c, d, e, f) {
            const m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            // xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        const setTransform = ctx.setTransform;
        ctx.setTransform = function (a, b, c, d, e, f) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        const pt = svg.createSVGPoint();
        ctx.transformedPoint = function (x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    }

    drawImage() {
        const p1 = this._ctx.transformedPoint( 0, 0 );
		const p2 = this._ctx.transformedPoint( this._canvas.width, this._canvas.height );
		this._ctx.clearRect( p1.x, p1.y, p2.x - p1.x, p2.y - p1.y );

        // Draw current art state
        this._ctx.drawImage( this.image, 0, 0 );
    }

    getZoom() {
		const ratio = Math.min(
			( this._canvas.width / this.image.width ),
			( this._canvas.height / this.image.height ) );
		return Number((this._ctx.getTransform().a / ratio));
	}

    zoomCanvas( amount, x, y ) {
        // Define scale based on screen setup
        const MAX_PIXEL_WIDTH = 100;
        const MIN_PIXEL_WIDTH = 1;

        // Store Transform in case needed
        const restore = this._ctx.getTransform();

        // Set center point of zoom
        if ( typeof x === 'undefined' || x === -1 ) {
            x = (this._canvas.width / 2);
        }
        if ( typeof y === 'undefined' || y === -1 ) {
            y = (this._canvas.height / 2);
        }

        let factor = Math.pow( this._scaleFactor, amount );
        const pt = this._ctx.transformedPoint( x, y );

        // Perform the translation
        this._ctx.translate( pt.x, pt.y );

        this._ctx.scale( factor, factor );

        this._ctx.translate( -pt.x, -pt.y );

        // Check to see if it crossed the boundaries and then set to max or min
        const trans = this._ctx.getTransform().a;

        const zoom = this.getZoom();
        const scale = Math.min(
            ( this._canvas.width / this.image.width ) * zoom,
            ( this._canvas.height / this.image.height ) * zoom );

        // Are we at max zoom?
        if ( trans > 0 && scale > MAX_PIXEL_WIDTH ) {
            this._ctx.setTransform( restore.a, restore.b, restore.c, restore.d, restore.e, restore.f );
            this._dirty = true;
            return false;
        }

        if ( trans < 1 && scale < MIN_PIXEL_WIDTH ) {
            this._ctx.setTransform( restore.a, restore.b, restore.c, restore.d, restore.e, restore.f );
            this._dirty = true;
            return false;
        }

        this._dirty = true;
        return true;
    }

    // *************************************************************************
    // UPDATE LOOP
    // *************************************************************************

    writeDebug( text ) {
        this.debugEl.textContent = text;
    }

    drawDebugBox() {
		// outer frame
		const percentHeight = this._canvas.width / 100;
		const percentWidth = this._canvas.width / 100;

		const outerHeight = this._canvas.width - ( percentHeight * 60 );
		const outerWidth =  this._canvas.width - ( percentWidth * 60 );

		const innerHeight = this._canvas.width - ( percentHeight * 70 );
		const innerWidth =  this._canvas.width - ( percentWidth * 70 );

		const ox = ( this._canvas.width - outerWidth ) / 2;
		const oy = ( this._canvas.height - outerHeight ) / 2;

		const ix = ( this._canvas.width - innerWidth ) / 2;
		const iy = ( this._canvas.height - innerHeight ) / 2;

		this._ctx.lineWidth = "2";
		this._ctx.strokeStyle = "red";
		this._ctx.strokeRect( ox, oy, outerWidth, outerHeight );
		this._ctx.strokeStyle = "yellow";
		this._ctx.strokeRect( ix, iy, innerWidth, innerHeight );
		this._ctx.strokeStyle = "green";
		this._ctx.lineWidth = "4";
		const pixel = - this._ctx.getTransform().a;
		this._ctx.strokeRect( this._canvas.width / 2 - ( pixel / 2 ), this._canvas.height / 2 - ( pixel / 2), pixel, pixel );
	}

    // *************************************************************************
    // UPDATE LOOP
    // *************************************************************************

    update( dt ) {

    }

    render() {
        if ( !this._dirty ) { return; }
        this._dirty = false;

        this.drawImage();
        this.drawDebugBox();
    }
}

class App {
    constructor() {
        this.mobile = new Mobile();

        this.mobile.open();

        this._last_update;
        this._update_tick;

    }

    open() {
        this.loop( this._last_update );
    }

    update( dt ) {
        this.mobile.update( dt );
    }

    render() {
        this.mobile.render();
    }

    loop( last_update ) {
        const dt = window.s._update_tick = Math.min((last_update - ( window.s._last_update || last_update)), 66)/1000;
        window.s._last_update = last_update;
        window.s.update(dt);
        window.s.render();

        window.requestAnimationFrame( window.s.loop );
    }
}

window.s = new App();

document.addEventListener('DOMContentLoaded', () => {
    window.s.open();
}, false );
