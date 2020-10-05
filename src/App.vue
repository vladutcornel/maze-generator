<template>
    <div id="app">
        <div class="G">
            <Game />
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

import store from "@/Maze/Store";
import Generator from "@/Maze/Generator";
import {mapMutations} from "vuex";
import Game from "@/components/Game";

let maze = new Generator({rows: 10, cols: 10});
global.maze = maze;
export default {
    name: 'App',
    store,
    components: {Game},
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

    created() {
        document.addEventListener("keydown", (ev) => {
            switch (ev.code) {
                case "KeyW":
                case "ArrowUp":
                    this.moveToNorth();
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.moveToSouth();
                    break;
                case "KeyA":
                case "ArrowLeft":
                    this.moveToWest();
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.moveToEast();
                    break;
            }
        })
    },

    mounted() {
        this.startGame()
    },

    methods: {

        startGame () {
            this.buildGame();
            this.$nextTick(() => {
                this.goToStartPosition();
            })
        },

        ...mapMutations([
            "buildGame",
            "goToStartPosition",
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
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto 1fr auto;
    grid-gap: $borderWidth;

    padding: $borderWidth;



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
