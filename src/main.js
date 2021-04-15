// "tame the javashrek" - Nathan Altice
"use strict";

// main game object
let config = {
    type: Phaser.WEBGL,
    width: 960,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Play ]
};

// define game
var game = new Phaser.Game(config);

// global variables
const SCALE = 1;
const CENTER_X = game.config.width/2;
const CENTER_Y = game.config.height/2;
const SCREEN_WIDTH = game.config.width;
const SCREEN_HEIGHT = game.config.height;

var SPACEBAR, RIGHTKEY, LEFTKEY, DOWNKEY, UPKEY, A_KEY, W_KEY, S_KEY, D_KEY, E_KEY, BACKSPACE, ENTER;