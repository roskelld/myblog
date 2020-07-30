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

        // Background Style
        this.background = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWMQdAr5DwACtgGnAVZaJgAAAABJRU5ErkJggg==';

        this._lastTouchDistance = 0;

        this._dirty = true;

        // LISTENERS
        this._canvas.addEventListener("touchstart", e => {
            e.preventDefault();
        }, {passive: false} );

        this._canvas.addEventListener('touchmove', e => {
            if (e.cancelable) {
                e.preventDefault();
            }
            this.touchMove(e);
        }, true );
    }

    touchMove( e ) {

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

        text = `${dist.toFixed(2)} :: ${(dist - this._lastTouchDistance).toFixed(2)} :: ${text}`
        this._lastTouchDistance = dist;

        this.writeDebug( text );
    }

    open() {
        this.app.appendChild( this._canvas );

        // Start Position
		this._trackTransforms( this._ctx );

        this.setCanvasSize();
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
        this.drawBackground();

        // Draw current art state
        this._ctx.drawImage( this._canvas, 0, 0 );

        this.drawDebugBox();
    }

    drawBackground() {
        this._ctx.fillStyle = this.background;
        this._ctx.fillRect( 0, 0, this._canvas.width, this._canvas.height );
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
