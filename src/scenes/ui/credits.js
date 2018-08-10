import Scene from '../scene';

export default class CreditsScene extends Scene {
  constructor() {
    super({ key: 'creditsScene' });
  }

  create(params) {
    super.create(params);

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
