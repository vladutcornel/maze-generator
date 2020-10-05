<template>
    <div class="Game">
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
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import store from "@/Maze/Store";
import Generator from "@/Maze/Generator";

export default {
    name: 'Game',

    store,

    data() {
        return {
            Generator,
            settings: {
                rows: Generator.MIN_ROWS,
                columns: Generator.MIN_COLUMNS,
            }
        }
    },

    computed: {
        maze() {
            return store.getters.maze();
        },

        // region Cell classes
        currentCellClass() {
            if (! this.currentCell) return false;

            return this.cellClass(this.currentCell);
        },

        cellClassNorth() {
            if (! this.hasNorth) return false;

            return this.cellClass(this.neighbourNorth);
        },

        cellClassSouth() {
            if (! this.hasSouth) return false;

            return this.cellClass(this.neighbourSouth);
        },

        cellClassWest() {
            if (! this.hasWest) return false;

            return this.cellClass(this.neighbourWest);
        },

        cellClassEast() {
            if (! this.hasEast) return false;

            return this.cellClass(this.neighbourEast);
        },

        cellClassNorthWest() {
            if (! this.hasNorthWest) return false;

            return this.cellClass(this.neighbourNorthWest);
        },

        cellClassNorthEast() {
            if (! this.hasNorthEast) return false;

            return this.cellClass(this.neighbourNorthEast);
        },

        cellClassSouthWest() {
            if (! this.hasSouthWest) return false;

            return this.cellClass(this.neighbourSouthWest);
        },

        cellClassSouthEast() {
            if (! this.hasSouthEast) return false;

            return this.cellClass(this.neighbourSouthEast);
        },

        // endregion
        ...mapState([
                'currentCell'
        ]),
        ...mapGetters([
                "isNeighbour",
                "neighbourNorth",
                "neighbourSouth",
                "neighbourWest",
                "neighbourEast",
                "neighbourNorthWest",
                "neighbourNorthEast",
                "neighbourSouthWest",
                "neighbourSouthEast",
                "hasNorth",
                "hasSouth",
                "hasWest",
                "hasEast",
                "hasNorthWest",
                "hasNorthEast",
                "hasSouthWest",
                "hasSouthEast",
                "canMoveNorth",
                "canMoveSouth",
                "canMoveWest",
                "canMoveEast",
        ])
    },

    watch: {
        settings: {
            deep: true,
            handler(settings) {
                store.commit("updateSettings", {
                    rows: settings.rows,
                    columns: settings.columns,
                })
            }
        },
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
                        this.moveToWest()
                    } else {
                        this.moveToEast();
                    }
                } else {
                    console.log(`Failed horizontal swipe: ${deltaX}`);
                }
            } else {
                // vertical swipe

                if (absY > threshold) {
                    if (deltaY < 0) {
                        this.moveToNorth();
                    } else {
                        this.moveToSouth();
                    }
                } else {
                    console.log(`Failed vertical swipe: ${deltaY}`);
                }
            }

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

        ...mapMutations([
            "move",
            "moveToNorth",
            "moveToSouth",
            "moveToWest",
            "moveToEast",
        ])

    }
}

</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap-utilities";
$borderColor: #ccc;
$borderWidth: 1rem;
$cellSize: 4rem;

.Game {
    // Game
    overflow: hidden;
    box-shadow: 0 0 1rem $gray-700 inset, 0 0 1rem $gray-600 ;
    border-radius: 50%;

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
        background-color: $white;

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
</style>