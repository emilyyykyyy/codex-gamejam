import { Boot } from './scenes/Boot';
import { BadEnd } from './scenes/BadEnd';
import { Game as MainGame } from './scenes/Game';
import { GameComplete } from './scenes/GameComplete';
import { GoodEnd } from './scenes/GoodEnd'
import { Instructions } from './scenes/Instructions';
import { MainMenu } from './scenes/MainMenu';
import { Opening } from './scenes/Opening';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#CAD9D9',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameComplete,
        GoodEnd,
        BadEnd,
        Instructions,
        Opening,
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
