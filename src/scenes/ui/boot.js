import Scene from '../scene';

//const env = 'PRODUCTION'
const env = 'DEV';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'bootScene' });

    this.nextScene = 'madeWithScene'; // DEFAUL
    // this.nextScene = 'creditsScene';
  }

  preload() {
    super.preload();

    this.load.on('complete', () => {
      this.changeToScene(this.nextScene);
    });

    // load files
    let urlBase = '';
    if (env == 'PRODUCTION') {
      urlBase = awsPrefix;
    }

    // load fonts
    this.load.bitmapFont(
      'keneyPixel',
      urlBase + 'assets/fonts/keneyFont_0.png',
      urlBase + 'assets/fonts/keneyFont.fnt'
    );
    this.load.bitmapFont(
      'KenneyMini',
      urlBase + 'assets/fonts/KenneyMini-8px_0.png',
      urlBase + 'assets/fonts/KenneyMini-8px.fnt'
    );

    // load the atlas with all the sprites for the game
    this.load.atlas(
      window.gameOptions.gameSpritesKey,
      `assets/sprites/${window.gameOptions.gameSpritesKey}.png`,
      `assets/sprites/${window.gameOptions.gameSpritesKey}.json`
    );

    // load the JSONs and sprites for the levels
    this.load.image('tiles', 'assets/levels/tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/levels/lvl02.json');

    // load audio
    // load music
    this.load.audio('mainTheme', 'assets/audio/music/BlindBirdTheme.ogg');

    // load sfx
    this.load.audio('pause', 'assets/audio/sfx/UI_Pause.ogg');
    this.load.audio('unpause', 'assets/audio/sfx/UI_Unpause.ogg');
    this.load.audio('build', 'assets/audio/sfx/UI_Build.ogg');
    this.load.audio('fall', 'assets/audio/sfx/Bird_Fall.ogg');
    this.load.audio('footsteps', 'assets/audio/sfx/Bird_FS.ogg');
    this.load.audio('jump', 'assets/audio/sfx/Bird_Jump.ogg');

    this.load.image('full', 'assets/sprites/full-nest.png');
    this.load.image('empty', 'assets/sprites/empty-nest.png');

    // fake loader
    // for (var i = 0; i < 500; i++) {
    //   this.load.spritesheet(`logo-${i}`, urlBase + 'assets/phaserLogo.png', { frameWidth: 382, frameHeight: 331 })
    // }
  }
}
