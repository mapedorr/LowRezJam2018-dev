import Scene from '../scene';
import getDataManager from '../../managers/dataManager';

export default class MainMenuScene extends Scene {
  constructor() {
    super({ key: 'mainMenu' });
  }

  create(params) {
    super.create(params);

    // TODO: add the background image for the menu
    // this.background = this.add.image(
    //   this.cameras.main.width / 2, this.cameras.main.height / 2, 'mainMenu_bg'
    // )

    // ┌ add buttons to the menu ──────────────────────────────────────────────┐
    this.start = this.createButton({
      x: 32,
      y: 46,
      font: 'KenneyMini',
      text: 'start',
      size: 12,
      onClick: self => {
        this.changeToScene('baseGameScene');
      },
      onHover: self => {
        self.setTint(0xff99ff);
      },
      onOut: self => {
        self.setTint(0xffffff);
      },
      scale: 1.0
    });

    this.credits = this.createButton({
      x: 32,
      y: 56,
      font: 'KenneyMini',
      text: 'credits',
      size: 12,
      onClick: self => {
        this.open('creditsScene');
      },
      onHover: self => {
        self.setTint(0xff99ff);
      },
      onOut: self => {
        self.setTint(0xffffff);
      },
      scale: 1.0
    });
    // └───────────────────────────────────────────────────────────────────────┘
  }
}
