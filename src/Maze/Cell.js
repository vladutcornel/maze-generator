
export default class Cell {
    constructor({row, column}) {
        this.row = row;
        this.column = column;

        this.neighbours = {
            north: null,
            south: null,
            west: null,
            east: null
        };

        this.walls = {
            north: true,
            south: true,
            west: true,
            east: true
        };
    }

    /**
     * Get all neighbours
     * @returns {null[]}
     */
    getNeighbours() {
        return Object.values(this.neighbours).filter(neighbour => null !== neighbour);
    }

    /**
     * Get all neighbours
     */
    getFreeNeighbours() {
        return Object.keys(this.neighbours).filter(direction => {
            let neighbour = this.neighbours[direction];
            if (! neighbour ) return false;

            return ! this.walls[direction];
        }).map(direction => this.neighbours[direction]);
    }
}