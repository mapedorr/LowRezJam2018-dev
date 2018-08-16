import 'phaser';

import BootScene from './scenes/ui/boot';

import SplashScene from './scenes/ui/splash';
import MadeWithScene from './scenes/ui/madeWith';

import MainMenuScene from './scenes/ui/mainMenu';
import OptionsScene from './scenes/ui/options';
import CreditsScene from './scenes/ui/credits';

import HUDGameScene from './scenes/game/HUDGame';
import BaseGameScene from './scenes/game/baseGame';

import PauseScene from './scenes/ui/pause';

import getSceneManager from './managers/sceneManager';
import getDataManager from './managers/dataManager';

window.scale = 8;
window.gameOptions = {
  // game scale
  scale: 8,
  // resolution
  resolution: 64,
  tileSize: 8,
  // player gravity
  playerGravity: 40,
  // player horizontal speed
  playerSpeed: 15,
  // player speeds while jumping
  playerJumpSpeed: {
    x: 5,
    y: -32
  },
  changeDirectionRange: 8,
  gameSpritesKey: 'spritesAtlas',
  debugging: false
};

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'content',
  width: window.gameOptions.resolution,
  height: window.gameOptions.resolution,
  resolution: window.gameOptions.scale,
  render: {
    pixelArt: true
  },
  canvas: document.getElementById('game'),
  backgroundColor: 0x0f380f,
  scene: [
    BootScene,
    SplashScene,
    MadeWithScene,
    MainMenuScene,
    OptionsScene,
    CreditsScene,
    HUDGameScene,
    BaseGameScene,
    PauseScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      }
    }
  }
});

// init managers
getSceneManager(window.game.scene);
getDataManager();

document.getElementById('game').focus();

window.focus();
