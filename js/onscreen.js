class FadeInOnScreen {
    constructor() {
        window.addEventListener( 'scroll', Utils.debounce( () => this.checkPosition(), 50 ), false );
        window.addEventListener( 'resize', Utils.debounce( () => this.init(), 50 ), false );
        this.init();
    }
    init() {
        this.els = document.querySelectorAll( '.fadeInOnScreen' );
        this.windowHeight = window.innerHeight;
        this.checkPosition();
    }
    reset() {
        this.windowHeight = window.innerHeight;
        if ( typeof this.els != 'undefined' ) {
            this.els.forEach( el => el.classList.replace( 'fadeInAnimation', 'fadeInOnScreen' ) );
            this.checkPosition();
        }
    }
    checkPosition() {
        if ( typeof this.els == 'undefined' ) return;
        this.els.forEach( el => {
            const pos = el.getBoundingClientRect().top;
            if ( pos - this.windowHeight <= -50 )
                el.classList.replace( 'fadeInOnScreen', 'fadeInAnimation' );

        });
    }
}
