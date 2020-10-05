import Cell from "@/Maze/Cell";

/**
 *
 * @property {Number} rows      Number of rows in the maze (height)
 * @property {Number} columns   Number of columns in the maze (width)
 */
export default class Maze {
    constructor({rows = Maze.MIN_ROWS, columns = Maze.MIN_COLUMNS}) {
        let proxy = new Proxy(this, {
            get(target, prop) {
                return target[prop];
            },

            set(target, prop, value) {
                switch (prop) {
                    case "rows":
                        if (value >= Maze.MIN_ROWS && value <= Maze.MAX_ROWS) {
                            target.rows = value;
                        }
                        target.init();
                        break;
                    case "columns":
                        if (value >= Maze.MIN_COLUMNS && value <= Maze.MAX_COLUMNS) {
                            target.columns = value;
                        }
                        target.init();
                        break;
                    default:
                        console.error(`Can not set property ${prop}`);
                        return false;
                }
                return true;
            }
        });

        proxy.rows = rows;
        proxy.columns = columns;


        return proxy;
    }

    /**
     * Create the cells, with walls all around
     */
    init() {
        let cellList = [];
        let cellMatrix = [];

        for (let row = 0; row < this.rows; row++) {
            cellMatrix[row] = [];
            for (let column = 0; column < this.columns; column++) {

                // Create cell
                let cell = new Cell({row, column});
                cellMatrix[row].push(cell);
                cellList.push(cell);

                // region link neighbours
                if (row > 0) {
                    // Cell has a neighbour to the top
                    let neighbour = cellMatrix[row - 1][column];
                    neighbour.neighbours.south = cell;
                    cell.neighbours.north = neighbour;
                }

                if (column > 0) {
                    // Cell has a neighbour to the left
                    let neighbour = cellMatrix[row][column - 1];
                    neighbour.neighbours.east = cell;
                    cell.neighbours.west = neighbour;
                }
                // endregion
            }

        }

        this.cellList = cellList;
        this.cellMatrix = cellMatrix;
    }

    /**
     * Build the maze, using iterative depth-first implementation
     *
     * Algorithm:
     *     1. Choose the initial cell, mark it as visited and push it to the stack
     *     2. While the stack is not empty
     *          1. Pop a cell from the stack and make it a current cell
     *          2. If the current cell has any neighbours which have not been visited
     *                  1. Push the current cell to the stack
     *                  2. Choose one of the unvisited neighbours
     *                  3. Remove the wall between the current cell and the chosen cell
     *                  4. Mark the chosen cell as visited and push it to the stack
     */
    build() {

        // 1. Chose initial cell
        let first = this.cellList[0];
        first.initial = true;

        // 1. Mark initial cell as visited
        first.visited = true;

        // 1. Push initial cell to the stack
        let stack = [first];

        // 2. While the stack is not empty
        while (stack.length > 0) {
            // 2.1. Pop the cell from the stack and make it a current cell
            let current = stack.pop();

            // Fetch the neighbours that were not visited
            let neighbours = current.getNeighbours().filter(cell => !cell.visited);

            // 2.2. If the current cell has any neighbours which have not been visited
            if (neighbours.length > 0) {

                // 2.2.1. Push the current cell to the stack
                stack.push(current);

                // 2.2.2. Chose one of the unvisited neighbours
                let neighbourIndex = Math.floor(Math.random() * neighbours.length)
                let neighbour = neighbours[neighbourIndex];

                // 2.2.3. Remove the wall between the current cell and the chosen cell
                breakWall(current, neighbour);

                // 2.2.4. Nark the chosen cell as visited
                neighbour.visited = true;

                // 2.2.4. Push the chosen cell to the stack
                stack.push(neighbour);
            }
        }

        let last = this.cellList[this.cellList.length - 1];
        last.final = true;
    }

    cellAt(row, column) {
        if (undefined === this.cellMatrix[row] || undefined === this.cellMatrix[row][column]) {
            return undefined;
        }

        return this.cellMatrix[row][column];
    }

    static get MAX_ROWS() {
        return 40;
    }

    static get MIN_ROWS() {
        return 10;
    }

    static get MAX_COLUMNS() {
        return 40;
    }

    static get MIN_COLUMNS() {
        return 10;
    }
}

// private

/**
 *
 * @param {Cell} A
 * @param {Cell} B
 */
function breakWall(A, B) {
    if (A.row === B.row) {
        if (A.column < B.column) {
            A.walls.east = false;
            B.walls.west = false;
        } else if (A.column > B.column) {
            A.walls.west = false;
            B.walls.east = false;
        }
    } else if (A.column === B.column) {
        if (A.row < B.row) {
            A.walls.south = false;
            B.walls.north = false;
        } else if (A.row > B.row) {
            A.walls.north = false;
            B.walls.south = false;
        }
    }
}