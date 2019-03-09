
document.addEventListener( 'DOMContentLoaded', () => {

    function setCardLinks() {
        this.nav.cards.all.forEach( card => {
            card.addEventListener( 'click', e => {
                this.selectCard( card.dataset.target );
                // Update URI
                const h = window.location.hash;
                const hash = ( h.includes("?") ) ? h.substr(0, h.indexOf("?") ) : h;
                const uri = `${hash}${this.itemURI}${card.dataset.target}`;
                this.pushState( uri, card.dataset.target );
                // window.history.pushState( { id: `#${uri}` }, 'Dean Roskell', `${uri}` );
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                this.setPageMetaData();

            }, false );
        });
    }

    function selectCard( cardId, tabId = 'all',  ) {
        const cards = Array.from( s.nav.cards[tabId] );
        const card = cards.find( item => item.id === `card-${cardId}` );
        if ( typeof card === 'undefined' ) return;
        this.unsetAllCards();
        card.classList.add( 'selected' );
        this.hideAllContentPages();
        // Unhide selected content
        document.querySelector( `#content-${cardId}` ).classList.remove( 'hide' );
    }

    // init Fade in on Screen
    const fader = new FadeInOnScreen();

}, false );
