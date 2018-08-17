import Scene from '../scene';

export default class EndGameScene extends Scene {
  constructor() {
    super({ key: 'endGameScene' });

    this.timesplash = 3000;
    this.nextScene = 'mainMenu';
  }

  create(params) {
    super.create(params);

    this.add
      .bitmapText(
        32,
        28,
        'KenneyMini',
        "You've helped Torca" +
          '\nhe is now with Abu' +
          '\nand their birdies' +
          '\n...all dancing' +
          '\nfor ever' +
          '\n\nthanks for playing',
        6
      )
      .setCenterAlign()
      .setOrigin(0.5)
      .setTint(0x9bbc0f);

    // add the button to go to the main menu
    this.back = this.createButton({
      x: 61,
      y: 64,
      font: 'KenneyMini',
      text: 'to start screen',
      size: 6,
      color: 0x306230,
      onClick: self => {
        this.sound.stopAll();
        this.changeToScene(this.nextScene);
      },
      onHover: self => {
        self.setTint(0x8bac0f);
      },
      onOut: self => {
        self.setTint(0x306230);
      },
      scale: 1.0
    }).setOrigin(1);
  }
}
