import Scene from '../scene';

export default class SplashScene extends Scene {
  constructor() {
    super({ key: 'splashScene' });
    this.timesplash = 3000;
    this.nextScene = 'splashGeckoScene';
  }

  create(params) {
    super.create(params);

    this.logo = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      window.gameOptions.gameSpritesKey,
      'ui/carenalga_bg'
    );

    this.add
      .bitmapText(32, 2, 'KenneyMini', 'a game by', 8)
      .setCenterAlign()
      .setOrigin(0.5, 0)
      .setTint(0x9bbc0f);

    this.add
      .bitmapText(32, 50, 'KenneyMini', 'Mapedorr', 8)
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
