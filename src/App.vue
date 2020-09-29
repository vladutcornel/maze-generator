<template>
    <div id="app">
        <div class="G">
            <table>
                <tbody @touchstart="onTouchStart"
                       @touchmove="$event.preventDefault()"
                       @touchend="onTouchEnd"
                       @keyup="onKeyPress"
                >
                <tr v-for="(columns, row) in maze.cellMatrix" :key="'row' + row">
                    <td v-for="(cell, column) in columns" :key="'cell' + row + '/' + column" :class="cellClass(cell)">
                        <img v-if="isCurrent(cell)" src="@/assets/sheep.svg" />
                        <button v-else-if="isNeighbour(cell)" @click="moveTo(cell)">
                            Move here
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <label>
            <div>Rows:</div>
            <input type="number" v-model="maze.rows" :min="Maze.MIN_ROWS" :max="Maze.MAX_ROWS" />
        </label>

        <label>
            <div>Columns:</div>
            <input type="number" v-model="maze.columns" :min="Maze.MIN_COLUMNS" :max="Maze.MAX_COLUMNS" />
        </label>

        <button @click="startGame">Start</button>
    </div>
</template>

<script>

import Maze from "@/Maze/Generator";

export default {
    name: 'App',
    data() {
        return {
            Maze,
            maze: new Maze({rows: 10, cols: 10}),
            currentCell: null,
        }
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

            this.scrollIntoView();
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

        scrollIntoView() {

            let current = this.currentCell;

            if(! current ) {
                return;
            }

            let {rows, columns} = this.maze;

            let game = this.$el.querySelector(".G");
            // let table = game.querySelector("table");
            // let img = table.querySelector("img");

            let {
                scrollTop,
                scrollLeft,
                offsetWidth,
                offsetHeight,
                scrollWidth,
                scrollHeight
            } = game;

            let cellWidth = scrollWidth / columns;

            scrollLeft = (current.column * cellWidth) - offsetWidth/2 + cellWidth/2;

            let cellHeight = scrollHeight / rows;

            scrollTop = (current.row * cellHeight) - offsetHeight/2 + cellHeight/2;

            console.log(scrollLeft);

            game.scrollLeft = scrollLeft;
            game.scrollTop = scrollTop;

            // img.scrollIntoView();

        },

        startGame () {
            this.maze.build();

            this.currentCell = null;

            this.$nextTick(() => {
                this.currentCell = this.maze.cellList[0];
                this.scrollIntoView();
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

        table {
            border-spacing: unset;

            tr:first-child {
                .N {
                    border-top-width: $borderWidth;
                }
            }

            tr:last-child {
                .S {
                    border-bottom-width: $borderWidth;
                }
            }

            td.W:first-child {
                border-left-width: $borderWidth;
            }

            td.E:last-child {
                border-right-width: $borderWidth;
            }

            img {
                width: $cellSize*0.8;
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

            width: $cellSize;
            height: $cellSize;

            min-width: $cellSize;
            min-height: $cellSize;

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
