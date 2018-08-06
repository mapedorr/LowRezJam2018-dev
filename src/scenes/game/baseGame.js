/**
 * Reference posts related to the mechanics used in the game:
 *   ⏹ HTML5 platformer prototype inspired by iOS hit “Yeah Bunny” >> https://bit.ly/2OE4BGN
 *   ⏹ (!) Build a HTML5 game like “Magick” (Phaser CE) >> https://bit.ly/2nbgyXZ
 *   ⏹ Modular Game Worlds in Phaser 3 (Tilemaps #1) — Static Maps https://bit.ly/2O9udu8
 */

import Scene from '../scene'

export default class BaseGameScene extends Scene {
  constructor() {
    super({ key: 'baseGameScene' })
  }

  create(params) {
    // create the scene and assign a random number to it
    super.create(params)
    this.id = Math.random()

    this.sceneManager.addGameScene(this.scene.key)

    // TODO: add the HUD (scene)
    // this.sceneManager.overlay('HUDGameScene')

    // add the listener for the shutdown event
    this.events.on('shutdown', () => {
      this.shutdown()
    }, this)

    // ┌ setup the PC ─────────────────────────────────────────────────────────┐
    // adding the hero sprite and enabling ARCADE physics for the hero
    this.pc = this.physics.add.sprite(4, 52, 'pc');

    // setting hero horizontal speed
    this.pc.body.velocity.x = window.gameOptions.playerSpeed;

    // the hero can jump
    this.canJump = true;

    // the hern cannot double jump
    this.canDoubleJump = false;

    // the hero is not on the wall
    this.onWall = false;

    // set workd bounds to allow camera to follow the player
    this.cameras.main.setBounds(0, 0, 1920, 1440);

    // making the camera follow the player
    this.cameras.main.startFollow(this.pc);
    // └───────────────────────────────────────────────────────────────────────┘
  }

  shutdown() {
    this.events.off('shutdown')
    //this.sceneManager.removeGameScene(this.scene.key)
  }

  update() {
    // set some default gravity values. Look at the function for more information
    this.setDefaultValues();

    // adjusting hero speed according to the direction it's moving
    // this.setPlayerXVelocity(!this.onWall);
  }

  // default values to be set at the beginning of each update cycle,
  // which may be changed according to what happens into "collide" callback function
  // (if called)
  setDefaultValues() {
    this.pc.body.gravity.y = window.gameOptions.playerGravity;
    this.onWall = false;
    this.setPlayerXVelocity(true);
  }

  // sets player velocity according to the direction it's facing, unless "defaultDirection"
  // is false, in this case multiplies the velocity by -1
  setPlayerXVelocity(defaultDirection) {
    this.pc.body.velocity.x = window.gameOptions.playerSpeed *
      (this.pc.flipX ? -1 : 1) * (defaultDirection ? 1 : -1);
  }

  jump() {
    this.pc.body.velocity.y = window.gameOptions.playerJumpSpeed.y;
    this.pc.body.velocity.x = window.gameOptions.playerJumpSpeed.x * this.pc.direction;
    this.pc.isJumping = true;
  }
}