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
    this.map = this.make.tilemap({
      key: 'map',
      tileWidth: window.gameOptions.tileSize,
      tileHeight: window.gameOptions.tileSize
    });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = this.map.addTilesetImage('Level 1', 'tiles');

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    this.belowLayer = this.map.createStaticLayer('background', tileset);
    this.worldLayer = this.map.createStaticLayer('ground', tileset);

    this.worldLayer.setCollisionByProperty({ collides: true });
    // this.map.setCollisionByProperty({ collides: true });

    const spawnPoint = this.map.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point'
    );
    // └───────────────────────────────────────────────────────────────────────┘

    // ┌ setup Penta ──────────────────────────────────────────────────────────┐
    // adding Penta sprite and enabling ARCADE physics for Penta
    this.penta = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'penta');

    // set the default direction
    this.penta.direction = 1;

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(
      this.penta,
      this.worldLayer,
      this.movePenta,
      null,
      this
    );

    // setting penta horizontal speed
    this.penta.body.velocity.x = window.gameOptions.playerSpeed;
    this.penta.body.gravity.y = window.gameOptions.playerGravity;

    // the hern cannot double jump
    this.canDoubleJump = false;

    // set workd bounds to allow camera to follow the player
    this.cameras.main.setBounds(0, 0, 512, 64);

    // making the camera follow the player
    this.cameras.main.startFollow(this.penta);

    // waiting for player input
    this.input.on('pointerdown', this.addBlock, this);
    // └───────────────────────────────────────────────────────────────────────┘
  }

  shutdown() {
    this.events.off('shutdown');
    //this.sceneManager.removeGameScene(this.scene.key)
  }

  update() {
    // set some default gravity values. Look at the function for more information
    if (this.penta.isJumping) {
      this.penta.body.velocity.x =
        window.gameOptions.playerJumpSpeed.x * this.penta.direction;
    } else if (this.penta.body.blocked.down) {
      this.penta.body.velocity.x =
        window.gameOptions.playerSpeed * (this.penta.flipX ? -1 : 1);
    } else {
      this.penta.body.velocity.x = 0;
    }
  }

  movePenta(penta, layer) {
    // some temporary variables to determine if the player is blocked only once
    let blockedDown = penta.body.blocked.down;
    let blockedLeft = penta.body.blocked.left;
    let blockedRight = penta.body.blocked.right;

    // if Penta hits something, no double jump is allowed
    this.canDoubleJump = false;

    // penta on the ground
    if (blockedDown) {
      this.penta.isJumping = false;
    }

    //   [ note ] the second condition is used to prevent Penta from jumping afer
    //            changing his movement direction.
    if (blockedRight && this.penta.direction === 1) {
      const tilesAtNorthEast = this.map.getTilesWithin(
        layer.x,
        layer.y - 1,
        1,
        1,
        { isNotEmpty: true },
        this.worldLayer
      );

      const tilesAtNorth = this.map.getTilesWithin(
        layer.x - 1,
        layer.y - 1,
        1,
        1,
        { isNotEmpty: true },
        this.worldLayer
      );

      if (
        (tilesAtNorthEast.length === 0 && tilesAtNorth.length === 0) ||
        this.penta.isJumping
      ) {
        this.jump();
      } else {
        // horizontal flipping penta sprite
        penta.flipX = true;
        this.penta.direction *= -1;
      }
    }

    // penta on the ground and touching a wall on the right
    //   [ note ] the second condition is used to prevent Penta from jumping afer
    //            changing his movement direction.
    if (blockedLeft && this.penta.direction === -1) {
      const tilesAtNorthWest = this.map.getTilesWithin(
        layer.x,
        layer.y - 1,
        1,
        1,
        { isNotEmpty: true },
        this.worldLayer
      );

      const tilesAtNorth = this.map.getTilesWithin(
        layer.x + 1,
        layer.y - 1,
        1,
        1,
        { isNotEmpty: true },
        this.worldLayer
      );

      if (
        (tilesAtNorthWest.length === 0 && tilesAtNorth.length === 0) ||
        this.penta.isJumping
      ) {
        this.jump();
      } else {
        // default orientation of penta sprite
        penta.flipX = false;
        this.penta.direction *= -1;
      }
    }
  }

  jump() {
    this.penta.body.velocity.y = window.gameOptions.playerJumpSpeed.y;
    this.penta.isJumping = true;
  }

  addBlock() {
    // TODO: add a block to the level
  }
}
