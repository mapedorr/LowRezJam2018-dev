import Scene from '../scene';

export default class CreditsScene extends Scene {
  constructor() {
    super({ key: 'creditsScene' });
  }

  create(params) {
    super.create(params);

    // ┌ load the background music and ui sfx ─────────────────────────────────┐
    this.uiHighlightEnterSound = this.sound.add('uiHighlightEnter');
    this.uiHighlightBackSound = this.sound.add('uiHighlightBack');
    // └───────────────────────────────────────────────────────────────────────┘

    // add the text for credits
    const keys = [
      { text: 'Blind Bird', y: 2, color: 0x8bac0f },
      { text: 'art and code by', y: 11 },
      { text: 'Carenalga', y: 18, color: 0x8bac0f },
      { text: 'music and sfx by', y: 26 },
      { text: 'Quiet Gecko', y: 32, color: 0x8bac0f },
      { text: 'made for', y: 39 },
      { text: 'LowRezJam 2018', y: 46, color: 0x8bac0f }
    ];

    keys.forEach(element => {
      this.addBitmapText(element);
    });

    // add the button for closing the menu
    this.back = this.createButton({
      x: 61,
      y: 64,
      font: 'KenneyMini',
      text: 'back',
      size: 6,
      color: 0x306230,
      onClick: self => {
        this.uiHighlightEnterSound.play();
        this.close();
      },
      onHover: self => {
        this.uiHighlightBackSound.play();
        self.setTint(0x8bac0f);
      },
      onOut: self => {
        self.setTint(0x306230);
      },
      scale: 1.0
    }).setOrigin(1);
  }

  addBitmapText(params) {
    this.add
      .bitmapText(
        this.cameras.main.width / 2,
        params.y,
        'KenneyMini',
        params.text,
        6
      )
      .setCenterAlign()
      .setTint(params.color || 0x306230)
      .setOrigin(0.5, 0);
  }
}
