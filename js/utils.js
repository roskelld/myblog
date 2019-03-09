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
