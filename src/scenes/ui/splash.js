import Scene from '../scene';

export default class SplashScene extends Scene {
  constructor() {
    super({ key: 'splashScene' });
    this.timesplash = 1500;
    this.nextScene = 'mainMenu';
  }

  create(params) {
    super.create(params);
    this.logo = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      window.gameOptions.gameSpritesKey,
      'ui/carenalga_bg'
    );

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
