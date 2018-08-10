import Scene from '../scene';

export default class MadeWithScene extends Scene {
  constructor() {
    super({ key: 'madeWithScene' });

    this.timesplash = 1500;
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
