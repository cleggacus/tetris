import Display from './display';
import Game from './game';

const display: Display = new Display(document.querySelector("#canvas"));


window.addEventListener('resize', () => {
    display.resize();
});

display.setViewport(0, 0);
display.setFillColor("#000");

const urlParams = new URLSearchParams(window.location.search);

const w = urlParams.get("w") ? urlParams.get("w") : 12;
const h = urlParams.get("h") ? urlParams.get("h") : 22;

const game = new Game(display, parseInt(w.toString()), parseInt(h.toString()));
game.start();