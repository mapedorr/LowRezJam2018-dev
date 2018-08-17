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
      x: 61,
      y: 56,
      font: 'KenneyMini',
      text: 'start',
      size: 6,
      color: 0x306230,
      onClick: self => {
        this.changeToScene('baseGameScene');
      },
      onHover: self => {
        self.setTint(0x8bac0f);
      },
      onOut: self => {
        self.setTint(0x306230);
      },
      scale: 1.0
    }).setOrigin(1);

    this.credits = this.createButton({
      x: 61,
      y: 64,
      font: 'KenneyMini',
      text: 'credits',
      size: 6,
      color: 0x306230,
      onClick: self => {
        this.open('creditsScene');
      },
      onHover: self => {
        self.setTint(0x8bac0f);
      },
      onOut: self => {
        self.setTint(0x306230);
      },
      scale: 1.0
    }).setOrigin(1);
    // └───────────────────────────────────────────────────────────────────────┘
  }
}
