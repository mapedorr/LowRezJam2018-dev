/**
 * Reference posts related to the mechanics used in the game:
 *   ⏹ HTML5 platformer prototype inspired by iOS hit “Yeah Bunny” >> https://bit.ly/2OE4BGN
 *   ⏹ (!) Build a HTML5 game like “Magick” (Phaser CE) >> https://bit.ly/2nbgyXZ
 *   ⏹ Modular Game Worlds in Phaser 3 (Tilemaps #1) — Static Maps https://bit.ly/2O9udu8
 */

import Scene from '../scene';

export default class BaseGameScene extends Scene {
  constructor() {
    super({
      key: 'baseGameScene',
      ownInputHandlers: true
    });
  }

  create(params) {
    // create the scene and assign a random number to it
    super.create(params);
    this.id = Math.random();

    this.sceneManager.addGameScene(this.scene.key);

    // TODO: add the HUD (scene)
    // this.sceneManager.overlay('HUDGameScene')

    // add the listener for the shutdown event
    this.events.on(
      'shutdown',
      () => {
        this.shutdown();
      },
      this
    );

    // ┌ setup Level 01 ───────────────────────────────────────────────────────┐
    this.map = this.make.tilemap({ key: 'map' });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = this.map.addTilesetImage('Level 1', 'tiles');

    // tile 1 (the black tile) has the collision enabled
    // this.map.setCollision(1);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    this.belowLayer = this.map.createStaticLayer('background', tileset);
    this.worldLayer = this.map.createStaticLayer('ground', tileset);

    this.worldLayer.setCollisionByProperty({ collides: true });

    const spawnPoint = this.map.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point'
    );
    // └───────────────────────────────────────────────────────────────────────┘

    // ┌ setup the PC ─────────────────────────────────────────────────────────┐
    // adding the hero sprite and enabling ARCADE physics for the hero
    this.penta = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'pc');

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(
      this.penta,
      this.worldLayer,
      function(penta, layer) {
        // some temporary variables to determine if the player is blocked only once
        let blockedDown = penta.body.blocked.down;
        let blockedLeft = penta.body.blocked.left;
        let blockedRight = penta.body.blocked.right;

        // if the hero hits something, no double jump is allowed
        this.canDoubleJump = false;

        // hero on the ground
        if (blockedDown) {
          // hero can jump
          this.canJump = true;
        }

        // hero on the ground and touching a wall on the right
        if (blockedRight) {
          // horizontal flipping hero sprite
          penta.flipX = true;
        }

        // hero on the ground and touching a wall on the right
        if (blockedLeft) {
          // default orientation of hero sprite
          penta.flipX = false;
        }

        // hero NOT on the ground and touching a wall
        if ((blockedRight || blockedLeft) && !blockedDown) {
          // hero on a wall
          penta.scene.onWall = true;

          // remove gravity
          penta.body.gravity.y = 0;

          // setting new y velocity
          penta.body.velocity.y = window.gameOptions.playerGrip;
        }

        // adjusting hero speed according to the direction it's moving
        this.setPlayerXVelocity(!this.onWall || blockedDown);
      },
      null,
      this
    );

    // setting hero horizontal speed
    this.penta.body.velocity.x = window.gameOptions.playerSpeed;

    // the hero can jump
    this.canJump = true;

    // the hern cannot double jump
    this.canDoubleJump = false;

    // the hero is not on the wall
    this.onWall = false;

    // set workd bounds to allow camera to follow the player
    this.cameras.main.setBounds(0, 0, 512, 64);

    // making the camera follow the player
    this.cameras.main.startFollow(this.penta);

    // waiting for player input
    this.input.on('pointerdown', this.jump, this);
    // └───────────────────────────────────────────────────────────────────────┘
  }

  shutdown() {
    this.events.off('shutdown');
    //this.sceneManager.removeGameScene(this.scene.key)
  }

  update() {
    // set some default gravity values. Look at the function for more information
    this.setDefaultValues();
  }

  // default values to be set at the beginning of each update cycle,
  // which may be changed according to what happens into "collide" callback function
  // (if called)
  setDefaultValues() {
    this.penta.body.gravity.y = window.gameOptions.playerGravity;
    this.onWall = false;
    this.setPlayerXVelocity(true);
  }

  // sets player velocity according to the direction it's facing, unless "defaultDirection"
  // is false, in this case multiplies the velocity by -1
  setPlayerXVelocity(defaultDirection) {
    this.penta.body.velocity.x =
      window.gameOptions.playerSpeed *
      (this.penta.flipX ? -1 : 1) *
      (defaultDirection ? 1 : -1);
  }

  jump() {
    if ((this.canJump && this.penta.body.blocked.down) || this.onWall) {
      this.penta.body.velocity.y = window.gameOptions.playerJumpSpeed.y;
      // this.penta.body.velocity.x =
      //   window.gameOptions.playerJumpSpeed.x * this.penta.direction;
      this.penta.isJumping = true;
      // hero can't jump anymore
      this.canJump = false;

      // hero is not on the wall anymore
      this.onWall = false;
    }
  }
}
