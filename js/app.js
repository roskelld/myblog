'use strict';
/**
 * Website Framework
 * Copyright Dean Roskell 2019
 * @author Dean Roskell <deanroskell@protonmail.com>
 */


// Use https://jscompress.com/
class WebSite {
    constructor() {
        // Style
        this.split = '·';
        // this.itemURI = '%F0%9F%8E%AE'; // 🎮
        this.itemURI = '?'; // 🎮
        // Build DOM Elements
        const games     = data.filter( item => item.type === 'games' );
        const apps      = data.filter( item => item.type === 'applications' );
        const projects  = data.filter( item => item.type === 'projects' );

        // Element Fade in On Screen
        this.fader = new FadeInOnScreen();

        this.gameCardGenerator( games, 'games' );
        this.applicationCardGenerator( apps, 'applications');
        this.projectCardGenerator( projects, 'projects');

        const content =  document.querySelector('#stuff')

        // .....................................................................
        // INITIALIZE MATERIALIZE
        const sideNav = document.querySelectorAll( '.sidenav' );
        this.sideNavOptions = {};
        this.sideNavInstances = M.Sidenav.init( sideNav, this.sideNavOptions );


        const collapsible = document.querySelectorAll( '.collapsible' );
        this.collapsibleOptions = {};
        this.collapsibleInstances = M.Collapsible.init( collapsible, this.collapsibleOptions );

        this.nav = {
            header:             document.querySelector('#nav-header'),
            buttons: {
                home:           document.querySelector('#home-menu-btn'),
                services:       document.querySelector('#services-menu-btn'),
                games:          document.querySelector('#games-menu-btn'),
                applications:   document.querySelector('#applications-menu-btn'),
                projects:       document.querySelector('#projects-menu-btn'),
                about:          document.querySelector('#about-menu-btn'),
                logo:           document.querySelector( '#logo' ),
                sidenav:        document.querySelector( '#sidenav-btn' ),
                all:            document.querySelectorAll('.menu-btn'),
            },
            cards: {
                games:              document.querySelector(`#games`).querySelector('.contentlinks').querySelectorAll('.card-link'),
                applications:       document.querySelector(`#applications`).querySelector('.contentlinks').querySelectorAll('.card-link'),
                projects:           document.querySelector(`#projects`).querySelector('.contentlinks').querySelectorAll('.card-link'),
                all:                document.querySelectorAll('.card-link'),
            }
        }

        this.content = {
            main:               document.querySelector('main'),
            panels:             document.querySelectorAll('.product-panel'),
            background:         document.querySelectorAll('.background-image'),
            fullpage:           document.querySelectorAll( '.fullpage' ),
        }

        this.setMenuLinks();
        this.setCardLinks();

        // GAME
        // this.score = 0;
        // this.introSound = new Audio('/sound/intro.mp3');
        // this.eatSound = new Audio('/sound/cherry.mp3');
        // this.dieSound = new Audio('/sound/die.mp3');
        // document.querySelector('#shhh').addEventListener( 'click', () => { this.startShhh() }, false );
    }

    init() {
        window.addEventListener("hashchange", e => {
            this.openHashLocation();
        });

        // Read URI and setup site
        this.openHashLocation();

        window.addEventListener( 'resize', Utils.debounce( () => this.setFullPagePanelHeight(), 300 ));

        // this.content.fullpage.forEach( panel => {
        //     this.setFullPagePanelHeight( panel );
        // });

        window.addEventListener( "scroll", e => {
            e.preventDefault();
            this.setLogoScreenPosition();
        }, false );


        this.nav.buttons.sidenav.addEventListener( "click", e => {
            this.sideNavInstances[0].open();
        }, false );

        this.setLogoScreenPosition();

        this.fader.init();
    }

    openHashLocation() {
        const c = window.location.hash;
        let url = '';

        if ( c !== '' ) {
            const tab = ( c.includes(this.itemURI) ) ? c.slice( 1, c.indexOf(this.itemURI) ) : c.slice( 1, c.length );
            this.selectTab( tab );

            url += `#${tab}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

            if ( c.includes(this.itemURI) ) {
                const item = c.slice(  c.indexOf(this.itemURI) + 1, c.length );
                this.selectCard( item, tab );
                url += `?${item}`;
            }

        } else {
            this.selectTab( 'home' );
        }
    }

    onTabSelected( tab ) {
        // Generate Tab from URL if not given
        if ( typeof tab === 'undefined' || tab === null ) {
            tab = window.location.hash.substr(1);
        }

        // if ( tab === this.oldTab ) return;                                   // Ignore if tab hasn't changed

        this.oldTab = tab;
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        s.setLogoScreenPosition();

        s.fader.reset();

        if ( typeof s.nav.cards[tab] == 'undefined' || typeof s.nav.cards[tab][0] == 'undefined' ) return;                                                // Reset Story

        this.unsetAllCards();
        this.
        hideAllContentPages();
    }

    selectTab( tabId ) {
        if ( typeof tabId === 'undefined' || tabId == '' ) return;

        // Hide all content
        const content = document.querySelectorAll( '.content-page' );
        content.forEach( c => c.classList.add( 'hide') );

        // Unhide selected content
        const page = document.querySelector( `#${tabId}`);
        if ( page !== null ) {
            page.classList.remove( 'hide' );
            this.nav.buttons.all.forEach( button => button.classList.remove('active') );
            this.nav.buttons[tabId].classList.add( 'active' );
            this.onTabSelected( tabId );
        } else {
            // if URL is bad then go home
            this.selectTab( 'home' );
            window.location.hash = 'home';
        }
        this.setPageMetaData();
    }

    selectCard( cardId, tabId = 'all',  ) {
        const cards = Array.from( s.nav.cards[tabId] );
        const card = cards.find( item => item.id === `card-${cardId}` );
        if ( typeof card === 'undefined' ) return;
        this.unsetAllCards();
        card.classList.add( 'selected' );
        this.hideAllContentPages();
        // Unhide selected content
        document.querySelector( `#content-${cardId}` ).classList.remove( 'hide' );
    }

    unsetAllCards() {
        this.nav.cards.all.forEach( card => card.classList.remove('selected') );   // Remove highlight
    }

    hideAllContentPages() {
        // Hide all content
        const content = document.querySelectorAll( '.content-panel' );
        content.forEach( c => c.classList.add( 'hide') );
    }

    setCardLinks() {
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

    setMenuLinks() {
        this.nav.buttons.all.forEach( button => {
            button.addEventListener( 'click', e => {
                this.selectTab( button.dataset.target );
                this.pushState( button.dataset.target, button.dataset.target  );
                // Update URI
                // window.history.pushState( { id: `#${button.dataset.target}` }, 'Dean Roskell', `/#${button.dataset.target}` );
            }, false );
        });
    }

    updateScroller( tab ) {
        console.log( window.s.scroller );
        window.s.scroller.recalculate();
    }

    setFullPagePanelHeight() {
        this.content.fullpage.forEach( panel => {
            panel.style.minHeight = `${window.innerHeight}px`;
        })
    }

    setLogoScreenPosition() {
        const result = document.scrollingElement.scrollHeight - document.scrollingElement.getBoundingClientRect().top + document.scrollingElement.getBoundingClientRect().height
        if ( result >= 1 ) {
            this.nav.buttons.logo.classList.add( 'off-right' );
        } else {
            this.nav.buttons.logo.classList.remove( 'off-right' );
        }
    }

    setPageMetaData() {
        setTimeout( () => {
            const item = this.getDataFromURI();

            let title = `${Utils.capitalize(item.type)}`
            if ( item.title !== null ) {
                title += ` - ${item.title}`;
            } else {
                title = `Game & Software Developer :: ${title}`;
            }

            this.setPageTitle( title );
            this.setTwitterOG( title );
        }, 0 );
    }

    setPageTitle( title ) {
        document.title = `Dean Roskell - ${title}`;
    }

    setTwitterOG( title ) {
        const nodes = document.querySelectorAll( '.meta-title' );
        nodes.forEach( a => {
            a.content = `Dean Roskell: Game Developer on ${title}`;
        });
    }

    pushState( uri ) {
        if ( !uri.includes("#") ) uri = `#${uri}`;
        window.history.pushState( { id: `${uri}` }, 'Dean Roskell', `/${uri}` );
        this.sendGA();
    }

    sendGA() {
        const item = this.getDataFromURI();

        let title = `${Utils.capitalize(item.type)}`
        if ( item.title !== null ) title += ` - ${item.title}`;

        ga('set', { page: `/#${item.type}`, title: title } );
        ga('send', 'pageview');
    }

    getDataFromURI() {
        const c = window.location.hash;
        const page = ( c.includes("?") ) ? c.substr(1, c.indexOf("?")-1 ) : c.substr( 1, c.length-1 );
        const id = ( c.includes("?") ) ? c.substr(c.indexOf("?")+1, c.length-1) : '';

        const set = data.filter( item => item.type === page );
        const item = set.filter( item => item.id === id );
        return ( item.length > 0 ) ? item[0] : { type: page, title: null };
    }

    ////////////////////////////////////////////////////////////////////////////
    // CONTENT GENERATION

    generateTextCard( item ) {
        const colDiv    = document.createElement( 'div' );
        const cardDiv   = document.createElement( 'div' );
        const textDiv   = document.createElement( 'p' );
        // const imgDiv    = document.createElement( 'div' );
        // const img       = document.createElement( 'img' );

        colDiv.classList.add( 'col', 's12', 'm12', 'l3', 'xl2' );
        cardDiv.classList.add( 'card', 'square', 'card-link', 'z-depth-0', 'valign-wrapper', 'no-select' );
        cardDiv.id = `card-${item.id}`;
        cardDiv.dataset.target = item.id;
        // imgDiv.classList.add( 'card-image' );
        // img.src = `img/product/${item.id}.png`;
        // img.title = item.title;

        // imgDiv.appendChild( img );
        textDiv.classList.add( 'title' );
        textDiv.textContent = item.title;
        cardDiv.appendChild( textDiv );
        colDiv.appendChild( cardDiv );

        return colDiv;
    }

    generateCard( item ) {
        const colDiv    = document.createElement( 'div' );
        const cardDiv   = document.createElement( 'div' );
        const imgDiv    = document.createElement( 'div' );
        const img       = document.createElement( 'img' );

        colDiv.classList.add( 'col', 's4', 'm2', 'l6', 'xl3' );
        cardDiv.classList.add( 'card', 'card-link', 'z-depth-0' );
        cardDiv.id = `card-${item.id}`;
        cardDiv.dataset.target = item.id;
        imgDiv.classList.add( 'card-image' );
        img.src = `img/product/${item.id}.png`;
        img.title = item.title;

        imgDiv.appendChild( img );

        if ( item.release === 'N/A' ) {
            const release = document.createElement( 'span' );
            release.classList.add( 'unreleased' );
            release.textContent = 'Unreleased';
            imgDiv.appendChild( release );
        }

        cardDiv.appendChild( imgDiv );
        colDiv.appendChild( cardDiv );

        return colDiv;
    }

    generateMobileLink( item, containerId ) {
        // <li><a href="#applications?sparkw">Sparkshot</a></li>
        const li = document.createElement( 'li' );
        const img = document.createElement( 'img' );
        const a  = document.createElement( 'a' );
        li.classList.add( 'height-40px' );
        // 'hvr-bounce-to-right'
        a.classList.add( 'sidenav-link', 'bold','soft-grey-text-2' );
        a.href = `#${containerId}?${item.id}`;
        a.textContent = `${item.title}`;
        a.onclick = () => { s.sideNavInstances[0].close(); };
        img.src = `img/product/${item.id}.png`;
        img.classList.add( 'img-icon' );
        li.appendChild( img );
        li.appendChild( a );
        return li;
    }

    ////////////////////////////////////////////////////////////////////////////
    // GAMES

    gameCardGenerator( data, containerId ) {

        // step through the data and build DOM elements, then add to container
        const container = document.querySelector( `#${containerId}` );
        const links = container.querySelector( '.contentlinks' );
        const detail  = container.querySelector( '.contentdetail' );
        // const tabs    = document.querySelector( '#tab-container' );
        const mobileLinks = document.querySelector( '#mobile-games-links' );

        data.forEach( (item, i) => {
            // GENERATE CARD LINK
            links.appendChild( this.generateCard( item ) );
            mobileLinks.appendChild( this.generateMobileLink( item, containerId ) );

            // Add Content
            const detailDiv = document.createElement( 'div' );
            detailDiv.id = `content-${item.id}`;
            detailDiv.classList.add( 'section', 'content-panel', 'hide' );

            detailDiv.appendChild( this.createTitle( item.title ) );
            // detailDiv.appendChild( this.createDivider() );
            detailDiv.appendChild( this.createGroupText( item.platforms, 'Platform' ) );

            const row1 = this.createRow();
            row1.appendChild( this.createItemText( item.genre, 'Genre' ) );
            row1.appendChild( this.createItemText( item.release, 'Release' ) );
            detailDiv.appendChild( row1 );

            const row2 = this.createRow();
            row2.appendChild( this.createItemText( item.company, 'Company' ) );
            row2.appendChild( this.createItemText( item.publisher, 'Publisher' ) );
            detailDiv.appendChild( row2 );

            detailDiv.appendChild( this.createGroupText( item.role, 'Role' ) );
            detailDiv.appendChild( this.createGroupText( item.work, 'Responsibility' ) );

            detailDiv.appendChild( this.createGroupText( item.technology, 'Technology' ) );

            const row4 = this.createRow();
            row4.appendChild( this.createItemText( item.team_size, 'Team Size' ) );
            row4.appendChild( this.createItemText( item.dev_time, 'Dev Time' ) );
            detailDiv.appendChild( row4 );

            const row5 = this.createRow();
            if ( item.trailer ) row5.appendChild( this.createVideoLink( item.trailer, 'Trailer' ) );
            if ( item.website ) row5.appendChild( this.createLink( item.website, `<i class="fas fa-home fa-2x"></i>`, 'Website' ) );
            detailDiv.appendChild( row5 );

            if ( item.description ) {
                const row6 = this.createRow();
                row6.appendChild( this.createDivider() );
                row6.appendChild( this.createBlockText( item.description, 'Description' ) );
                detailDiv.appendChild( row6 );
            }

            detail.appendChild( detailDiv );

        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // APPLICATIONS

    applicationCardGenerator( data, containerId ) {
        // step through the data and build DOM elements, then add to container
        const container = document.querySelector( `#${containerId}` );
        const links = container.querySelector( '.contentlinks' );
        const detail  = container.querySelector( '.contentdetail' );
        const tabs    = document.querySelector( '#tab-container' );
        const mobileLinks = document.querySelector( '#mobile-applications-links' );

        data.forEach( (item, i) => {
            // GENERATE CARD LINK
            links.appendChild( this.generateCard( item ) );
            mobileLinks.appendChild( this.generateMobileLink( item, containerId ) );

            // Add Content
            const detailDiv = document.createElement( 'div' );
            detailDiv.id = `content-${item.id}`;
            detailDiv.classList.add( 'section', 'content-panel' );

            detailDiv.appendChild( this.createTitle( item.title ) );
            // detailDiv.appendChild( this.createDivider() );
            detailDiv.appendChild( this.createGroupText( item.platforms, 'Platform' ) );

            const row1 = this.createRow();
            row1.appendChild( this.createItemText( item.genre, 'Genre' ) );
            row1.appendChild( this.createItemText( item.release, 'Release' ) );
            detailDiv.appendChild( row1 );

            const row2 = this.createRow();
            row2.appendChild( this.createItemText( item.company, 'Company' ) );
            row2.appendChild( this.createItemText( item.publisher, 'Publisher' ) );
            detailDiv.appendChild( row2 );

            detailDiv.appendChild( this.createGroupText( item.role, 'Role' ) );
            detailDiv.appendChild( this.createGroupText( item.work, 'Responsibility' ) );

            detailDiv.appendChild( this.createGroupText( item.technology, 'Technology' ) );

            const row4 = this.createRow();
            row4.appendChild( this.createItemText( item.team_size, 'Team Size' ) );
            row4.appendChild( this.createItemText( item.dev_time, 'Dev Time' ) );
            detailDiv.appendChild( row4 );

            const row5 = this.createRow();
            if ( item.trailer ) row5.appendChild( this.createVideoLink( item.trailer, 'Video' ) );
            if ( item.website ) row5.appendChild( this.createLink( item.website, `<i class="fas fa-home fa-2x"></i>`, 'Website' ) );
            if ( item.link )    row5.appendChild( this.createLink( item.link, 'Demo' ) );
            detailDiv.appendChild( row5 );

            if ( item.description ) {
                const row6 = this.createRow();
                row6.appendChild( this.createDivider() );
                row6.appendChild( this.createBlockText( item.description, 'Description' ) );
                detailDiv.appendChild( row6 );
            }

            detail.appendChild( detailDiv );

        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // PROJECTS

    projectCardGenerator( data, containerId ) {
        // step through the data and build DOM elements, then add to container
        const container = document.querySelector( `#${containerId}` );
        const links = container.querySelector( '.contentlinks' );
        const detail  = container.querySelector( '.contentdetail' );
        const tabs    = document.querySelector( '#tab-container' );
        const mobileLinks = document.querySelector( '#mobile-projects-links' );

        data.forEach( (item, i) => {
            // GENERATE CARD LINK
            links.appendChild( this.generateCard( item ) );
            mobileLinks.appendChild( this.generateMobileLink( item, containerId ) );

            // Add Content
            const detailDiv = document.createElement( 'div' );
            detailDiv.id = `content-${item.id}`;
            detailDiv.classList.add( 'section', 'content-panel' );

            detailDiv.appendChild( this.createTitle( item.title ) );
            // detailDiv.appendChild( this.createDivider() );
            detailDiv.appendChild( this.createGroupText( item.platforms, 'Platform' ) );

            const row1 = this.createRow();
            row1.appendChild( this.createItemText( item.genre, 'Genre' ) );
            row1.appendChild( this.createItemText( item.release, 'Release' ) );
            detailDiv.appendChild( row1 );

            const row2 = this.createRow();
            row2.appendChild( this.createItemText( item.company, 'Company' ) );
            // row2.appendChild( this.createItemText( item.publisher, 'Publisher' ) );
            detailDiv.appendChild( row2 );

            detailDiv.appendChild( this.createGroupText( item.role, 'Role' ) );
            detailDiv.appendChild( this.createGroupText( item.work, 'Responsibility' ) );

            detailDiv.appendChild( this.createGroupText( item.technology, 'Technology' ) );

            const row4 = this.createRow();
            row4.appendChild( this.createItemText( item.team_size, 'Team Size' ) );
            row4.appendChild( this.createItemText( item.dev_time, 'Dev Time' ) );
            detailDiv.appendChild( row4 );

            const row5 = this.createRow();
            if ( item.trailer ) row5.appendChild( this.createVideoLink( item.trailer, 'Video' ) );
            if ( item.website ) row5.appendChild( this.createLink( item.website, item.website, 'Website' ) );
            if ( item.link )    row5.appendChild( this.createLink( item.link, 'Demo' ) );
            detailDiv.appendChild( row5 );

            if ( item.description ) {
                const row6 = this.createRow();
                row6.appendChild( this.createDivider() );
                row6.appendChild( this.createBlockText( item.description, 'Description' ) );
                detailDiv.appendChild( row6 );
            }

            detail.appendChild( detailDiv );

        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // LAYOUT METHODS

    createTitle( title ) {
        // TITLE
        const divRow = document.createElement( 'div' );
        const divCol = document.createElement( 'div' );
        const div = document.createElement( 'div' );
        divRow.classList.add( 'row' );
        divCol.classList.add( 'col', 's12' );
        div.classList.add( 'soft-grey-text', 'title', 'center-align' );
        div.textContent = title;
        divCol.appendChild( div );
        divRow.appendChild( divCol );

        return divRow;
    }

    createGroupText( group, title ) {
        let groupText = ( group.length > 1 ) ? `${this.split} ` : '';
        group.forEach( x => {
            groupText += ` ${x} `;
            groupText += ( group.length > 1 ) ? ` ${this.split}` : '';
        } );         // Generate Group string

        // Group
        const divRow = document.createElement( 'div' );
        const divColTitle = document.createElement( 'div' );
        const divColContent = document.createElement( 'div' );
        const divTitle = document.createElement( 'div' );
        const divContent = document.createElement( 'div' );
        divRow.classList.add( 'row' );
        divColTitle.classList.add( 'col', 's12', 'm3' );
        divColContent.classList.add( 'col', 's12', 'm7' );
        divTitle.classList.add( 'soft-grey-text', 'detail-header', 'right-on-med-and-up' );
        divContent.classList.add( 'soft-grey-text', 'detail-data' );

        if ( group.length > 1 ) {
            if ( title.substring(title.length, title.length-1) === 'y' )
                divTitle.textContent = `${title.substring(0, title.length -1)}ies`;
            else
                divTitle.textContent = `${title}s`;
        } else {
            divTitle.textContent = `${title}:`;
        }
        divContent.textContent = groupText;

        divColTitle.appendChild( divTitle );
        divRow.appendChild( divColTitle );
        divColContent.appendChild( divContent );
        divRow.appendChild( divColContent );

        return divRow;
    }

    createItemText( item, title ) {

        // Container
        const div = document.createElement( 'div' );
        div.classList.add( 'col', 's6', 'padding-left-0', 'padding-right-0' );
        // Item
        const divTitleCol = document.createElement( 'div' );
        divTitleCol.classList.add( 'col', 's12', 'm6' );

        const divContentCol = document.createElement( 'div' );
        divContentCol.classList.add( 'col', 's12', 'm6' );

        const divTitle = document.createElement( 'div' );
        divTitle.classList.add( 'soft-grey-text', 'detail-header', 'right-on-med-and-up' );
        divTitle.textContent = `${title}:`;

        const divContent = document.createElement( 'div' );
        divContent.classList.add( 'soft-grey-text', 'detail-data' );
        divContent.textContent = item;

        divTitleCol.appendChild( divTitle );
        div.appendChild( divTitleCol );

        divContentCol.appendChild( divContent );
        div.appendChild( divContentCol );

        return div;
    }

    createVideoLink( link, title ) {
        // Container
        const div = document.createElement( 'div' );
        div.classList.add( 'col', 's6', 'padding-left-0', 'padding-right-0' );
        // Item
        const divTitleCol = document.createElement( 'div' );
        divTitleCol.classList.add( 'col', 's12', 'm6' );

        const divContentCol = document.createElement( 'div' );
        divContentCol.classList.add( 'col', 's12', 'm6' );

        const divTitle = document.createElement( 'div' );
        divTitle.classList.add( 'soft-grey-text', 'detail-header', 'right-on-med-and-up' );
        divTitle.textContent = `${title}:`;

        const divContent = document.createElement( 'div' );
        divContent.classList.add( 'soft-grey-text', 'detail-data' );
        const a = document.createElement( 'a' );
        a.href = link;
        a.innerHTML = `<i class="fas fa-film fa-2x"></i>`;
        a.target = "_none";
        divContent.appendChild( a );

        divTitleCol.appendChild( divTitle );
        div.appendChild( divTitleCol );

        divContentCol.appendChild( divContent );
        div.appendChild( divContentCol );

        return div;
    }

    createLink( link, text, title = 'Link' ) {
        // Container
        const div = document.createElement( 'div' );
        div.classList.add( 'col', 's6', 'padding-left-0', 'padding-right-0' );
        // Item
        const divTitleCol = document.createElement( 'div' );
        divTitleCol.classList.add( 'col', 's12', 'm6' );

        const divContentCol = document.createElement( 'div' );
        divContentCol.classList.add( 'col', 's12', 'm6' );

        const divTitle = document.createElement( 'div' );
        divTitle.classList.add( 'soft-grey-text', 'detail-header', 'right-on-med-and-up' );
        divTitle.textContent = `${title}:`;

        const divContent = document.createElement( 'div' );
        divContent.classList.add( 'soft-grey-text', 'detail-data' );
        const a = document.createElement( 'a' );
        a.href = link;
        a.innerHTML = text;
        a.target = "_none";
        divContent.appendChild( a );

        divTitleCol.appendChild( divTitle );
        div.appendChild( divTitleCol );

        divContentCol.appendChild( divContent );
        div.appendChild( divContentCol );

        return div;
    }

    createBlockText( text, title ) {
        const div = document.createElement( 'div' );
        div.classList.add( 'col', 's12', 'offset-m2', 'm8' );
        const divTitle = document.createElement( 'h3' );
        divTitle.textContent = title;

        const p = document.createElement( 'p' );

        p.innerHTML = text;

        div.appendChild( divTitle );
        div.appendChild( p );

        return div;
    }

    createDivider() {
        const div = document.createElement( 'div' )
        div.classList.add( 'divider' );
        return div;
    }

    createRow() {
        const div = document.createElement( 'div' )
        div.classList.add( 'row' );
        return div;
    }

    ////////////////////////////////////////////////////////////////////////////
    // HIDDEN GAME

    startShhh() {
        s.introSound.play();
        const main = document.querySelector('html');
        main.classList.add('shh');


        for (let i = 0; i < 20; i++) {
            const thing = document.createElement( 'div' );
            thing.classList.add( 'pickup' );
            thing.style.left = `${Math.random() * main.clientWidth}px`;
            thing.style.top = `${Math.random() * main.clientHeight}px`;
            thing.textContent = '🍒';

            this.nav.tabs.games.appendChild( thing );

            thing.addEventListener( 'mouseover', () => {
                thing.textContent = '';
                s.eatSound.play();
                s.score++;
                console.log(`SCORE: ${s.score}`);
            }, false);
        }


        this.addBaddie();

    }

    addBaddie() {
        const main = document.querySelector('main')

        for (let i = 0; i < 5; i++) {
            const thing = document.createElement( 'div' );
            thing.classList.add( 'pickup' );
            thing.style.left = `${Math.random() * main.clientWidth}px`;
            thing.style.top = `${Math.random() * main.clientHeight}px`;
            thing.textContent = '💀';
            this.nav.tabs.games.appendChild( thing );

            thing.addEventListener( 'mouseover', () => {
                thing.textContent = '';
                s.dieSound.play();
                console.log('YOU DIED');
                console.log(`FINAL SCORE: ${s.score}`);
                s.score = 0;
                document.querySelector('main').classList.remove('shh');
            }, false);
        }

    }

    ////////////////////////////////////////////////////////////////////////////
    // STATS

    totalGames() {
        const games = data.filter( item => item.type === 'game' );
        const res = [...new Set( games.map( game => game.title))];
        return res;
    }

    totalPublishedGames() {
        const games = data.filter( item => item.type === 'game' );
        const res = [...new Set( games.map( game => { if (game.release != 'N/A') return game.title }))];
        return res;
    }
}

////////////////////////////////////////////////////////////////////////////
// Utils
class Utils {
    static debounce( func, time ) {
        let timeout;
        return function() {
            const functionCall = () => func.apply( this, arguments );
            clearTimeout( timeout );
            timeout = setTimeout( functionCall, time );
        }
    }

    static capitalize( word ) {
        const l = word.substr(0, 1).toUpperCase();
        return `${l}${word.substr(1, word.length)}`;
    }
}

////////////////////////////////////////////////////////////////////////////
// Scroll Checker
class FadeInOnScreen {
    constructor() {
        window.addEventListener( 'scroll', Utils.debounce( () => this.checkPosition(), 50 ), false );
        window.addEventListener( 'resize', Utils.debounce( () => this.init(), 50 ), false );
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

const site = new WebSite();

site.setPageMetaData();
site.sendGA();

document.addEventListener( 'DOMContentLoaded', function() {
    setTimeout( () => {
        document.querySelector( '#loader' ).classList.remove( 'loader' );
    }, 10);
}, false );

window.s = site;
site.init();
