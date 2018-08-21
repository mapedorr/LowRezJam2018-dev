import Scene from '../scene';
import getDataManager from '../../managers/dataManager';

export default class MainMenuScene extends Scene {
  constructor() {
    super({ key: 'mainMenu' });
  }

  create(params) {
    super.create(params);

    // add the background image for the menu
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'mainMenu_bg'
    );

    // add the name of the game
    this.add
      .bitmapText(this.cameras.main.width / 2, 13, 'KenneyMini', 'Blind', 21)
      .setCenterAlign()
      .setTint(0x0f380f)
      .setOrigin(0.5, 0);
    this.add
      .bitmapText(this.cameras.main.width / 2, 22, 'KenneyMini', 'Bird', 21)
      .setCenterAlign()
      .setTint(0x8bac0f)
      .setOrigin(0.5, 0);

    // ┌ load the background music and ui sfx ─────────────────────────────────┐
    this.titleThemeSound = this.sound.add('titleTheme');
    this.titleThemeSound.volume = 0.5;
    this.titleThemeSound.play({
      loop: -1
    });

    this.uiHighlightStartSound = this.sound.add('uiHighlightStart');
    this.uiHighlightCreditsSound = this.sound.add('uiHighlightCredits');
    this.uiHighlightEnterSound = this.sound.add('uiHighlightEnter');
    // └───────────────────────────────────────────────────────────────────────┘

    // ┌ add buttons to the menu ──────────────────────────────────────────────┐
    this.start = this.createButton({
      x: 61,
      y: 56,
      font: 'KenneyMini',
      text: 'start',
      size: 6,
      color: 0x306230,
      onClick: self => {
        this.titleThemeSound.stop();
        this.uiHighlightEnterSound.play();
        this.changeToScene('baseGameScene');
      },
      onHover: self => {
        this.uiHighlightStartSound.play();
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
        this.uiHighlightEnterSound.play();
        this.open('creditsScene');
      },
      onHover: self => {
        this.uiHighlightCreditsSound.play();
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
