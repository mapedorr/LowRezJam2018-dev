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

    this.pauseSound = this.sound.add('pause');
    this.unpauseSound = this.sound.add('unpause');

    this.pausedTxt = this.add
      .bitmapText(32, 32, 'KenneyMini', 'paused', 12)
      .setTint(0x9bbc0f);
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
        this.unpauseSound.play();
      } else {
        this.pauseBtn.setTexture(
          window.gameOptions.gameSpritesKey,
          'ui/play_btn'
        );
        this.sceneManager.pauseGame();
        this.pausedTxt.alpha = 1;

        this.paused = true;
        this.pauseSound.play();
      }
    });
  }
}
