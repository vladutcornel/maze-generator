<template>
    <div id="app">
        <div class="G">
            <div class="table"
                 @touchstart="onTouchStart"
                 @touchmove="$event.preventDefault()"
                 @touchend="onTouchEnd"
                 @keyup="onKeyPress"
            >
                    <!-- North West -->
                    <div v-if="hasNorthWest" :class="cellClassNorthWest"></div>
                    <div v-else class="C out"></div>

                    <!-- North -->
                    <div v-if="hasNorth" :class="cellClassNorth">
                        <button v-if="canMoveNorth" @click="moveToNorth">
                            Move here
                        </button>
                    </div>
                    <div v-else class="C out"></div>

                    <!-- North East -->
                    <div v-if="hasNorthEast" :class="cellClassNorthEast"></div>
                    <div v-else class="C out"></div>

                    <!-- West -->
                    <div v-if="hasWest" :class="cellClassWest">
                        <button v-if="canMoveWest" @click="moveToWest">
                            Move here
                        </button>
                    </div>
                    <div v-else class="C out"></div>

                    <div :class="currentCellClass">
                        <img src="@/assets/sheep.svg" />
                    </div>

                    <!-- East -->
                    <div v-if="hasEast" :class="cellClassEast">
                        <button v-if="canMoveEast" @click="moveToEast">
                            Move here
                        </button>
                    </div>
                    <div v-else class="C out"></div>

                    <!-- South West -->
                    <div v-if="hasSouthWest" :class="cellClassSouthWest"></div>
                    <div v-else class="C out"></div>

                    <!-- South -->
                    <div v-if="hasSouth" :class="cellClassSouth">
                        <button v-if="canMoveSouth" @click="moveToSouth">
                            Move here
                        </button>
                    </div>
                    <div v-else class="C out"></div>

                    <!-- South East -->
                    <div v-if="hasSouthEast" class="C" :class="cellClassSouthEast"></div>
                    <div v-else class="C out"></div>

            </div>
        </div>
        <label>
            <div>Rows:</div>
            <input type="number" v-model="settings.rows" :min="Generator.MIN_ROWS" :max="Generator.MAX_ROWS" />
        </label>

        <label>
            <div>Columns:</div>
            <input type="number" v-model="settings.columns" :min="Generator.MIN_COLUMNS" :max="Generator.MAX_COLUMNS" />
        </label>

        <button @click="startGame">Start</button>
    </div>
</template>

<script>

import Generator from "@/Maze/Generator";
let maze = new Generator({rows: 10, cols: 10});
global.maze = maze;
export default {
    name: 'App',
    data() {
        return {
            Generator,
            currentCell: null,
            settings: {
                rows: Generator.MIN_ROWS,
                columns: Generator.MIN_COLUMNS,
            }
        }
    },

    computed: {
        maze() {
            return maze;
        },

        // region direction flags
        hasNorth() {
            if (! this.currentCell) return false;

            return this.currentCell.row > 0;
        },
        hasSouth() {
            if (! this.currentCell) return false;

            return this.currentCell.row < (this.maze.rows - 1);
        },
        hasWest() {
            if (! this.currentCell) return false;

            return this.currentCell.column > 0;
        },
        hasEast() {
            if (! this.currentCell) return false;

            return this.currentCell.column < (this.maze.columns - 1);
        },

        hasNorthWest() {
            return this.hasNorth && this.hasWest;
        },
        hasNorthEast() {
            return this.hasNorth && this.hasEast;
        },

        hasSouthWest() {
            return this.hasSouth && this.hasWest;
        },
        hasSouthEast() {
            return this.hasSouth && this.hasEast;
        },

        // endregion

        // region Cell classes
        currentCellClass() {
            if (! this.currentCell) return false;

            return this.cellClass(this.currentCell);
        },

        cellClassNorth() {
            if (! this.hasNorth) return false;

            return this.cellClass(this.currentCell.neighbours.north);
        },

        cellClassSouth() {
            if (! this.hasSouth) return false;

            return this.cellClass(this.currentCell.neighbours.south);
        },

        cellClassWest() {
            if (! this.hasWest) return false;

            return this.cellClass(this.currentCell.neighbours.west);
        },

        cellClassEast() {
            if (! this.hasEast) return false;

            return this.cellClass(this.currentCell.neighbours.east);
        },

        cellClassNorthWest() {
            if (! this.hasNorthWest) return false;

            return this.cellClass(this.currentCell.neighbours.north.neighbours.west);
        },

        cellClassNorthEast() {
            if (! this.hasNorthEast) return false;

            return this.cellClass(this.currentCell.neighbours.north.neighbours.east);
        },

        cellClassSouthWest() {
            if (! this.hasSouthWest) return false;

            return this.cellClass(this.currentCell.neighbours.south.neighbours.west);
        },

        cellClassSouthEast() {
            if (! this.hasSouthEast) return false;

            return this.cellClass(this.currentCell.neighbours.south.neighbours.east);
        },

        // endregion

        // Region Can move
        canMoveNorth() {
            if (! this.hasNorth ) return false;
            return this.isNeighbour(this.currentCell.neighbours.north);
        },
        canMoveSouth() {
            if (! this.hasSouth ) return false;
            return this.isNeighbour(this.currentCell.neighbours.south);
        },
        canMoveWest() {
            if (! this.hasWest ) return false;
            return this.isNeighbour(this.currentCell.neighbours.west);
        },
        canMoveEast() {
            if (! this.hasEast ) return false;
            return this.isNeighbour(this.currentCell.neighbours.east);
        },
        // endregion
    },

    watch: {
        settings: {
            deep: true,
            handler(settings) {
                maze.columns = settings.columns;
                maze.rows = settings.rows;
            }
        },
    },

    mounted() {
        this.startGame()
    },

    methods: {
        cellClass(cell) {
            let out = ["C"];

            // First
            if (cell.initial)
                out.push("F");

            // Last
            if (cell.final)
                out.push("Z");

            // North
            if (cell.walls.north)
                out.push("N");

            // South
            if (cell.walls.south)
                out.push("S");

            // East
            if (cell.walls.east)
                out.push("E");

            // West
            if (cell.walls.west)
                out.push("W");

            return out;
        },

        isCurrent(cell) {
            return cell === this.currentCell;
        },

        isNeighbour(cell) {
            if (! this.currentCell) return false;

            let neighbours = this.currentCell.getFreeNeighbours()

            console.log(neighbours);

            return neighbours .includes(cell);
        },

        onKeyPress(ev) {
            console.log(ev);
        },
        onTouchStart(ev) {
            let {pageX, pageY} = ev.changedTouches[0];

            this._touch = {
                startX: pageX,
                startY: pageY
            }
        },
        onTouchEnd(ev) {

            if (! this._touch) {
                return;
            }
            let {pageX: endX, pageY: endY} = ev.changedTouches[0];

            let {startX, startY} = this._touch;

            let deltaX = endX - startX,
                deltaY = endY - startY,
                absX = Math.abs(deltaX),
                absY = Math.abs(deltaY)
            ;
            const threshold = 30;

            if (absX > threshold && absY > threshold && Math.abs(absX - absY) < threshold) {
                console.log("Diagonal swipe");
            }
            else if (absX > absY) {
                // horizontal swipe

                if (absX > threshold) {
                    if (deltaX < 0) {
                        this.swipe("west")
                    } else {
                        this.swipe("east");
                    }
                } else {
                    console.log(`Failed horizontal swipe: ${deltaX}`);
                }
            } else {
                // vertical swipe

                if (absY > threshold) {
                    if (deltaY < 0) {
                        this.swipe("north");
                    } else {
                        this.swipe("south");
                    }
                } else {
                    console.log(`Failed vertical swipe: ${deltaY}`);
                }
            }

        },
        swipe(direction) {
            if (!this.currentCell) {
                return;
            }

            if (this.currentCell.walls[direction]) {
                return;
            }

            let next = this.currentCell.neighbours[direction];

            if (! next) {
                return;
            }

            this.currentCell = next;
        },

        moveToNorth() {
            this.swipe("north")
        },

        moveToSouth() {
            this.swipe("south")
        },

        moveToWest() {
            this.swipe("west")
        },

        moveToEast() {
            this.swipe("east")
        },

        moveTo(neighbour) {
            let current = this.currentCell;

            if (current.row < neighbour.row) {
                this.swipe("south")
            } else
            if (current.row > neighbour.row) {
                this.swipe("north")
            } else
            if (current.column < neighbour.column) {
                this.swipe("east")
            } else
            if (current.column > neighbour.column) {
                this.swipe("west")
            }
        },

        startGame () {
            this.maze.build();

            this.currentCell = null;

            this.$nextTick(() => {
                this.currentCell = this.maze.cellList[0];
            })
        }

    }
}

</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap-utilities";
$borderColor: #ccc;
$borderWidth: 1rem;
$cellSize: 4rem;

body {
    margin: 0;
    padding: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    display: grid;
    justify-content: center;
    grid-template-columns: 2fr 2fr 1fr;
    grid-gap: $borderWidth;

    padding: $borderWidth;

    .G {
        // Game
        overflow: hidden;
        outline: 1px solid;

        position: relative;
        scroll-behavior: smooth;

        width: 90vw;
        height: 70vh;

        max-width: 700px;
        max-height: 700px;

        grid-column: 1/4;

        justify-self: center;

        .table {
            flex-direction: column;
            border-spacing: unset;
            width: 100%;
            height: 100%;

            table-layout: fixed;
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr;
            align-content: stretch;

            img {
                width: 100%;
            }

            .C {
                display: grid;
                align-content: center;
                justify-content: center;
            }

            .out {
                background-color: #000000;
            }
        }

        .F {
            background: red;
        }

        .Z {
            background: #6aff00;
        }

        .N, .S, .W, .E {
            padding: 0.25rem;
            border: {
                width: $borderWidth/2;
                style: dashed;
                color: transparent;
            }
            background-clip: content-box;
        }

        .N {
            border-top-color: $borderColor;
        }

        .S {
            border-bottom-color: $borderColor;
        }

        .W {
            border-left-color: $borderColor;
        }

        .E {
            border-right-color: $borderColor;
        }
    }

    label {

        grid-column: 1/4;
        @include media-breakpoint-up(sm) {
            grid-column: 1/3;
        }

        display: grid;

        grid-template-columns: 1fr 2fr;
        grid-gap: $borderWidth;
        align-items: center;

        div {
            text-align: left;
        }
        input {
            width: 100%;
            text-align: right;
        }
    }

    > button {
        display: block;
    }
}
</style>
