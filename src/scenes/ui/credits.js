import Scene from '../scene'

export default class CreditsScene extends Scene {
  constructor () {
    super({key: 'creditsScene'})
  }

  create (params) {
    super.create(params)

    this.back = this.createButton({
      x: 100,
      y: 200,
      font: 'keneyPixel',
      text: 'back',
      onClick: (self) => {
        this.close()
      },
      onHover: (self) => {
        self.setTint(0xff99ff)
      },
      onOut: (self) => {
        self.setTint(0xffffff)
      },
      scale: 1.0
    })
  }

}