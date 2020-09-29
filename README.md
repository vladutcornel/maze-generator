# Maze-ing around

This is just me messing around with some stuff.

It's a little game where you control a sheep through a maze (I don't question your life decisions).  

## How?

With a touch screen, swipe in the direction you want the sheep to go.
You can also click one of the `Move here` buttons.

## Why?
Even though I have a lot of experience in JavaScript and Vue, there's no other good way to prove it.
I learned about this company that tests their candidates with a maze problem, so I started by creating a maze generator.

The algorithm for maze generation is on [Wikipedia](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_implementation), so just that wasn't be enough for me. That's why I turned it into a game.
To make it a little more challenging, you won't see the entire maze (though with basic CSS magic, you can change that).

## Legal mambo-jumbo

I know you won't read any license file, so I'll keep it simple: **Just don't pretend you built it.** Use it for inspiration, not for profit.

If you want to expand it, feel free to fork it. If you do something cool with it, mention me. 

## Technical mambo-jumbo

This is built with Vue.js v2. It uses HTML+CSS+JavaScript entirely.

### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```