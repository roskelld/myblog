
// Add class card-link to any button element
// Add class card-panel to any content element

class CardPanels {
    constructor() {
        this.cards = document.querySelectorAll( '.card-link' );
        this.panels = document.querySelectorAll( '.card-panel' );
        this.init();
    }

    init() {
        this.setCardLinks();
        const h = window.location.hash;
        if ( h !== "" )
            this.selectCard( h.substr(1, h.length ) );

        // If the address changes then react to it
        window.addEventListener( 'hashchange', () => {
            const h = window.location.hash;
            if ( h !== "" )
                this.selectCard( h.substr(1, h.length ) );
        }, false );
    }

    setCardLinks() {
        this.cards.forEach( card => {
            card.addEventListener( 'click', e => {
                this.selectCard( card.dataset.target );
                // Update URI
                window.location.hash = `${card.dataset.target}`;
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                // this.setPageMetaData();
                this.sendGA( card.firstElementChild.firstElementChild.title );
            }, false );
        });
    }

    selectCard( cardId ) {
        const cards = Array.from( this.cards );
        const card = cards.find( item => item.id === `card-${cardId}` );
        if ( typeof card === 'undefined' ) return;
        this.unsetAllCards();
        card.classList.add( 'selected' );
        this.hideAllCardPages();
        // Unhide selected content
        document.querySelector( `#content-${cardId}` ).classList.remove( 'hide' );
    }

    unsetAllCards() {
        this.cards.forEach( card => card.classList.remove('selected') );        // Remove highlight
    }

    hideAllCardPages() {
        this.panels.forEach( c => c.classList.add( 'hide') );                   // Hide all content
    }

    sendGA( title ) {
        // const item = this.getDataFromURI();

        // let title = `${Utils.capitalize(item.type)}`
        // if ( item.title !== null ) title += ` - ${item.title}`;
        ga('set', { page: `${window.location.pathname}`, title: title } );
        ga('send', 'pageview');
    }

}

new CardPanels();
