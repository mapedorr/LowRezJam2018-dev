import Scene from '../scene';

export default class MadeWithScene extends Scene {
  constructor() {
    super({ key: 'madeWithScene' });

    this.timesplash = 3000;
    this.nextScene = 'splashScene';
  }

  create(params) {
    super.create(params);

    this.logo = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      window.gameOptions.gameSpritesKey,
      'ui/phaser_bg'
    );

    this.add
      .bitmapText(32, 42, 'KenneyMini', 'jam boilerplate\nby agar3s', 6)
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
