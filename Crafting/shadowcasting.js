/**
 *
 * @param {object} origin x, y tuple source of fov
 * @param {object} is_blocking 
 * @param {Array} mark_visible Size of the patterns
 *
 */
function compute_fov(origin, distance, is_blocking, mark_visible, parent) {
    mark_visible.push( origin );

    for ( let i of range(4) ) {
        const quadrant = new Quadrant(i, origin);

        const reveal = (tile) => {
            const LOC = quadrant.transform(tile);
            mark_visible.push( LOC );
        }
        const is_wall = (tile) => {
            if (tile === null) return false;
            // console.log(`is_wall ${tile}`);
            const LOC = quadrant.transform(tile);
            return is_blocking( LOC.x, LOC.y, parent );
        }

        const is_floor = (tile) => {
            // console.log(`is_floor ${tile}`);
            if (tile === null) return false;
            const LOC = quadrant.transform(tile);
            return !is_blocking( LOC.x, LOC.y, parent );
        }

        const scan = (row) => {
            if ( row === undefined ) return;
            let prev_tile = null;
            for (const tile of row.tiles()) {
                if ( is_wall(tile) || is_symmetric(row, tile) )
                    reveal(tile)
                if ( is_wall(prev_tile) && is_floor(tile) )
                    row.start_slope = slope(tile)
                if ( is_floor(prev_tile) && is_wall(tile) ) {
                    const next_row = row.next();
                    if ( next_row === undefined ) return;
                    next_row.end_slope = slope(tile);
                    scan(next_row);
                }
                prev_tile = tile
            }
            if (is_floor(prev_tile))
                scan(row.next());
        }

        const scan_iterative = (row) => {
            console.log(row);
            const rows = [row];
            while (rows.length > 0) {
                row = rows.pop();
                let prev_tile = null;
                for (const tile of row.tiles()) {
                    if ( is_wall(tile) || is_symmetric(row, tile) )
                        reveal(tile);
                    if ( is_wall(prev_tile) && is_floor(tile) )
                        row.start_slope = slope(tile);
                    if ( is_floor(prev_tile) && is_wall(tile) ) {
                        const next_row = row.next();
                        next_row.end_slope = slope(tile);
                        rows.push(next_row)
                    }
                    prev_tile = tile;
                }
                if (is_floor(prev_tile))
                    rows.push(row.next());
            }
        }
        

        const first_row = new Row( 1, Fraction(-1), Fraction(1), distance );
        scan(first_row);
    }

}

class Quadrant {
    constructor( cardinal, origin ){
        this.cardinal = cardinal;
        this.ox = origin.x;
        this.oy = origin.y;

        this.north  = 0;
        this.east   = 1;
        this.south  = 2;
        this.west   = 3;
    }
    transform( tile ) {
        const row = tile.depth;
        const col = tile.col;
        switch (this.cardinal) {
            case this.north:    return ( { x: this.ox + col, y: this.oy - row });
            case this.east:     return ( { x: this.ox + col, y: this.oy + row });
            case this.south:    return ( { x: this.ox + row, y: this.oy + col });
            case this.west:     return ( { x: this.ox - row, y: this.oy + col });        
        }
    }
}

class Row {
    constructor( depth, start_slope, end_slope, distance ) {
        this.depth = depth;
        this.start_slope = start_slope;
        this.end_slope = end_slope;
        this.distance = distance;
    }
    *tiles() {
        const min_col = round_ties_up(this.depth * this.start_slope);
        const max_col = round_ties_down(this.depth * this.end_slope);
        for ( const col of range(min_col, max_col + 1) )
            yield ({ depth: this.depth, col: col });
    }
    next() {
        if ( this.depth >= this.distance ) return undefined;
        return new Row(
            this.depth + 1,
            this.start_slope,
            this.end_slope,
            this.distance
        );
    }
}

function slope( tile ) {
    const row_depth = tile.depth;
    const col = tile.col;
    return Fraction( 2 * col - 1, 2 * row_depth );
}

function is_symmetric(row, tile) {
    const row_depth = tile.depth;
    const col = tile.col;
    return (col >= row.depth * row.start_slope && 
            col <= row.depth * row.end_slope);
}

function round_ties_up(n) {
    return Math.floor(n + 0.5);
}

function round_ties_down(n) {
    return Math.ceil(n - 0.5)
}

function scan_iterative(row) {
    console.log(row);
    const rows = [row];
    while (rows.length > 0) {
        row = rows.pop();
        let prev_tile = null;
        for (const tile in row.tiles()) {
            if ( is_wall(tile) || is_symmetric(row, tile) )
                reveal(tile);
            if ( is_wall(prev_tile) && is_floor(tile) )
                row.start_slope = slope(tile);
            if ( is_floor(prev_tile) && is_wall(tile) ) {
                const next_row = row.next();
                next_row.end_slope = slope(tile);
                rows.push(next_row)
            }
            prev_tile = tile;
        }
        if (is_floor(prev_tile))
            rows.push(row.next());
    }
}

