document.addEventListener( 'DOMContentLoaded', function() {

    // const utils = new Utils();

    // .....................................................................
    // INITIALIZE MATERIALIZE
    const sideNavEls = document.querySelectorAll( '.sidenav' );
    const sideNav = M.Sidenav.init( sideNavEls, {} );

    const sideNavBtn = document.querySelector( '#sidenav-btn' );
    sideNavBtn.addEventListener( 'click', () => {
        sideNav[0].open();
    }, false );

    // const materialboxedEls = document.querySelectorAll( '.materialboxed' );
    // const materialboxed = M.Materialbox.init(materialboxedEls, {});
    const carousel = document.querySelectorAll('.carousel');
    const carouseleOptions = {};
    const carouselInstaces = M.Carousel.init(carousel, this.carouseleOptions);

    AOS.init();
}, false );
