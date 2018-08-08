import Scene from '../scene';

//const env = 'PRODUCTION'
const env = 'DEV';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'bootScene' });

    // this.nextScene = 'madeWithScene'; // DEFAUL
    this.nextScene = 'baseGameScene';
  }

  preload() {
    super.preload();

    let progressBox = this.add.graphics();
    let progressBar = this.add.graphics();

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'Loading...',
      style: {
        font: '16px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5);

    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: '0%',
      style: {
        font: '16px monospace',
        fill: '#999999'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 65,
      text: '',
      style: {
        font: '16px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    progressBox.fillStyle(0x666666, 1);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

    this.load.on('progress', value => {
      progressBar.clear();
      progressBar.fillStyle(0x333333, 1);
      progressBar.fillRect(
        width / 2 + 10 - 160,
        height / 2 + 10,
        300 * value,
        30
      );
      percentText.setText(parseInt(value * 100) + '%');
    });

    this.load.on('fileprogress', file => {
      assetText.setText(file.key + ' ready');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();

      this.changeToScene(this.nextScene);
    });

    // load files
    let urlBase = '';
    if (env == 'PRODUCTION') {
      urlBase = awsPrefix;
    }

    // load Carenalga logo
    this.load.image(
      'carenalga',
      urlBase + 'assets/sprites/ui sprites/carenalga_bg.png'
    );

    // load Phaser logo
    this.load.image(
      'phaserLogo',
      urlBase + 'assets/sprites/ui sprites/phaser_bg.png'
    );

    // fake loader
    // for (var i = 0; i < 500; i++) {
    //   this.load.spritesheet(`logo-${i}`, urlBase + 'assets/phaserLogo.png', { frameWidth: 382, frameHeight: 331 })
    // }

    // load fonts
    this.load.bitmapFont(
      'keneyPixel',
      urlBase + 'assets/fonts/keneyFont_0.png',
      urlBase + 'assets/fonts/keneyFont.fnt'
    );
    this.load.bitmapFont(
      'KenneyMini',
      urlBase + 'assets/fonts/KenneyMini12px_0.png',
      urlBase + 'assets/fonts/KenneyMini12px.fnt'
    );

    // load game sprites and levels
    // this.load.image(
    //   'mainMenu_bg',
    //   urlBase + 'assets/sprites/ui sprites/MainMenu.png'
    // );

    this.load.image(
      'credits_bg',
      urlBase + 'assets/sprites/ui sprites/credits_bg.jpg'
    );

    this.load.spritesheet(
      'penta',
      urlBase + 'assets/sprites/character sprites/Penta.png',
      { frameWidth: 7, frameHeight: 7 }
    );
    this.load.image(
      'magicBlock',
      'assets/sprites/ui sprites/magicBlock_ico.png'
    );
    this.load.image('tiles', 'assets/sprites/level sprites/tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/lvl01.json');
  }
}
