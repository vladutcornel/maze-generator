import Vue from "vue";
import Vuex from "vuex";
import Generator from "@/Maze/Generator";

Vue.use(Vuex);

let maze = new Generator({rows: 10, cols: 10});
global.maze = maze;

const Store = new Vuex.Store({
    state: {
        currentCell: null,

        settings: {
            rows: Generator.MIN_ROWS,
            columns: Generator.MIN_COLUMNS,
        }
    },

    getters: {
        maze: () => maze,

        // region neighbours
        neighbourNorth(state, getters) {
            if (getters.hasNorth) return state.currentCell.neighbours.north;
        },
        neighbourSouth(state, getters) {
            if (getters.hasSouth) return state.currentCell.neighbours.south;
        },
        neighbourWest(state, getters) {
            if (getters.hasWest) return state.currentCell.neighbours.west;
        },
        neighbourEast(state, getters) {
            if (getters.hasEast) return state.currentCell.neighbours.east;
        },
        neighbourNorthWest(state, getters) {
            if (getters.hasNorthWest) return getters.neighbourNorth.neighbours.west;
        },
        neighbourNorthEast(state, getters) {
            if (getters.hasNorthEast) return getters.neighbourNorth.neighbours.east;
        },
        neighbourSouthWest(state, getters) {
            if (getters.hasSouthWest) return getters.neighbourSouth.neighbours.west;
        },
        neighbourSouthEast(state, getters) {
            if (getters.hasSouthEast) return getters.neighbourSouth.neighbours.east;
        },
        // endregion
        
        // region direction flags
        hasNorth(state, getters) {
            if (getters.noCurrentCell) return false;

            return state.currentCell.row > 0;
        },
        hasSouth(state, getters) {
            if (getters.noCurrentCell) return false;

            return state.currentCell.row < (maze.rows - 1);
        },
        hasWest(state, getters) {
            if (getters.noCurrentCell) return false;

            return state.currentCell.column > 0;
        },
        hasEast(state, getters) {
            if (getters.noCurrentCell) return false;

            return state.currentCell.column < (maze.columns - 1);
        },

        hasNorthWest(state, getters) {
            return getters.hasNorth && getters.hasWest;
        },
        hasNorthEast(state, getters) {
            return getters.hasNorth && getters.hasEast;
        },

        hasSouthWest(state, getters) {
            return getters.hasSouth && getters.hasWest;
        },
        hasSouthEast(state, getters) {
            return getters.hasSouth && getters.hasEast;
        },

        // endregion

        // region Can move
        canMoveNorth(state, getters) {
            if (! getters.hasNorth ) return false;
            return getters.isNeighbour(state.currentCell.neighbours.north);
        },
        canMoveSouth(state, getters) {
            if (! getters.hasSouth ) return false;
            return getters.isNeighbour(state.currentCell.neighbours.south);
        },
        canMoveWest(state, getters) {
            if (! getters.hasWest ) return false;
            return getters.isNeighbour(state.currentCell.neighbours.west);
        },
        canMoveEast(state, getters) {
            if (! getters.hasEast ) return false;
            return getters.isNeighbour(state.currentCell.neighbours.east);
        },
        // endregion

        noCurrentCell: state => ! state.currentCell,

        isNeighbour: (state, getters) => (cell) => {
            if (getters.noCurrentCell) return false;

            let neighbours = state.currentCell.getFreeNeighbours()

            console.log(neighbours);

            return neighbours.includes(cell);
        },
    },

    mutations: {
        buildGame(state) {
            maze = new Generator({
                rows: state.settings.rows,
                columns: state.settings.columns,
            })
            maze.build();
            state.currentCell = null;
        },

        goToStartPosition(state) {
            state.currentCell = maze.cellList[0];
        },

        updateSettings(state, {rows = null, columns} = {}) {
            if (rows) {
                state.settings.rows = rows;
            }
            if (columns) {
                state.settings.columns = columns;
            }
        },

        move(state, direction) {
            if (!state.currentCell) {
                return;
            }

            if (state.currentCell.walls[direction]) {
                return;
            }

            let next = state.currentCell.neighbours[direction];

            if (! next) {
                return;
            }

            state.currentCell = next;
        },


        moveToNorth() {
            this.commit("move", "north")
        },

        moveToSouth() {
            this.commit("move", "south")
        },

        moveToWest() {
            this.commit("move", "west")
        },

        moveToEast() {
            this.commit("move", "east")
        },
    },
});

export default Store;