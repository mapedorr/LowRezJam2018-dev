import Scene from '../scene';

export default class HUDGameScene extends Scene {
  constructor() {
    super({ key: 'HUDGameScene' });
  }

  create(params) {
    super.create(params);
    // this.sceneManager.addGameScene(this.scene.key);

    this.paused = false;

    this.pauseBtn = this.add.image(
      6,
      6,
      window.gameOptions.gameSpritesKey,
      'ui/pause_btn'
    );

    this.pausedTxt = this.add.bitmapText(32, 32, 'KenneyMini', 'paused', 8);
    this.pausedTxt.setOrigin(0.5);
    this.pausedTxt.alpha = 0;

    this.pauseBtn.setInteractive();
    this.pauseBtn.on('pointerdown', _ => {
      if (this.paused === true) {
        this.pauseBtn.setTexture(
          window.gameOptions.gameSpritesKey,
          'ui/pause_btn'
        );
        this.sceneManager.resumeGame();
        this.pausedTxt.alpha = 0;

        this.paused = false;
      } else {
        this.pauseBtn.setTexture(
          window.gameOptions.gameSpritesKey,
          'ui/play_btn'
        );
        this.sceneManager.pauseGame();
        this.pausedTxt.alpha = 1;

        this.paused = true;
      }
    });

    // this.registry.events.on('changedata', this.updateData, this);
  }
}
