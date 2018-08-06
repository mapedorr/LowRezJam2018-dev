import Scene from '../scene';

export default class CreditsScene extends Scene {
  constructor() {
    super({ key: 'creditsScene' });
  }

  create(params) {
    super.create(params);

    // add the background image for the menu
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'credits_bg'
    );

    this.back = this.createButton({
      x: 32,
      y: 56,
      font: 'KenneyMini',
      text: 'back',
      size: 12,
      onClick: self => {
        this.close();
      },
      onHover: self => {
        self.setTint(0xffe600);
      },
      onOut: self => {
        self.setTint(0xffffff);
      },
      scale: 1.0
    });
  }
}
