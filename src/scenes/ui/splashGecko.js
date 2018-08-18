import Scene from '../scene';

export default class SplashGeckoScene extends Scene {
  constructor() {
    super({ key: 'splashGeckoScene' });
    this.timesplash = 3000;
    this.nextScene = 'mainMenu';
  }

  create(params) {
    super.create(params);

    this.logo = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      window.gameOptions.gameSpritesKey,
      'ui/gecko_idle-001'
    );

    this.anims.create({
      key: 'gecko-idle',
      frames: this.anims.generateFrameNames(window.gameOptions.gameSpritesKey, {
        start: 1,
        end: 6,
        zeroPad: 3,
        prefix: 'ui/gecko_idle-'
      }),
      frameRate: 5
    });

    this.logo.anims.play('gecko-idle');

    this.add
      .bitmapText(32, 2, 'KenneyMini', 'and', 8)
      .setCenterAlign()
      .setOrigin(0.5, 0)
      .setTint(0x9bbc0f);

    this.add
      .bitmapText(32, 54, 'KenneyMini', 'Quiet Gecko', 8)
      .setCenterAlign()
      .setOrigin(0.5, 0)
      .setTint(0x9bbc0f);

    this.time.delayedCall(
      this.timesplash,
      () => {
        this.changeToScene(this.nextScene);
      },
      [],
      this
    );
  }
}
