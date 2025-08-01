import "./style.css";

import { conway, patterns } from "../src/index.js";

import "prismjs";
import "prismjs/themes/prism.css";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";

document.addEventListener("DOMContentLoaded", () => {
  Prism.highlightAll();
});

const game1 = conway("conway-1", {
  cellSize: 20,
  gridWidth: 20,
  gridHeight: 20,
  animationSpeed: 50
});

game1.place(patterns.glider, 1, 1);
game1.place(patterns.glider, 5, 5);
game1.place(patterns.glider, 9, 9);
game1.start();

const game2 = conway("conway-2", {
  cellSize: 20,
  gridWidth: 20,
  gridHeight: 20,
  showGrid: false,
});

game2.place(patterns.pulsar, 3, 3);
game2.start();

const game3 = conway("conway-3", {
  cellSize: 20,
  gridWidth: 40,
  gridHeight: 30,
  toroidal: false,
  showGrid: false,
  animationSpeed: 50
});

game3.place(patterns.gosperGliderGun, 1, 1);
game3.start();

const game4 = conway("conway-4", {
  cellSize: 20,
  gridWidth: 40,
  gridHeight: 30,
  toroidal: false,
  showGrid: false,
});

game4.randomize(0.3)
game4.start();

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);
const gameLeft = conway("conway-left", {
  cellSize: 10,
  gridWidth: 25,
  gridHeight: Math.floor(vh / 10),

  animationSpeed: 600,
  toroidal: true,
  showGrid: false,
});

gameLeft.randomize(0.4);
gameLeft.start();

const gameRight = conway("conway-right", {
  cellSize: 10,
  gridWidth: 25,
  gridHeight: 25,
  animationSpeed: 150,
  showGrid: false,
});

gameRight.randomize(0.4);
gameRight.start();
