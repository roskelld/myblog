document.addEventListener( 'DOMContentLoaded', function() {
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
    AOS.init();
}, false );
