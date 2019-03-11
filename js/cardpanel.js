
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
    }

    setCardLinks() {
        this.cards.forEach( card => {
            card.addEventListener( 'click', e => {
                this.selectCard( card.dataset.target );
                console.log( card.dataset.target );
                // Update URI
                const h = window.location.hash;
                const hash = ( h.includes("?") ) ? h.substr(0, h.indexOf("?") ) : h;
                const uri = `${hash}${this.itemURI}${card.dataset.target}`;
                // this.pushState( uri, card.dataset.target );
                // window.history.pushState( { id: `#${uri}` }, 'Dean Roskell', `${uri}` );
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                // this.setPageMetaData();

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
}

new CardPanels();
