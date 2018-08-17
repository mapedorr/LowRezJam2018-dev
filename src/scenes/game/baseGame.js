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

    this.timesplash = 5000;
    this.nextScene = 'endGameScene';
  }

  create(params) {
    // create the scene and assign a random number to it
    super.create(params);

    this.levelEnded = false;

    this.events.on('pause', _ => {
      this.mainThemeSound.pause();

      if (this.footstepsSound.isPlaying) {
        this.footstepsSound.pause();
      }
      if (this.jumpSound.isPlaying) {
        this.jumpSound.pause();
      }
    });

    this.events.on('resume', _ => {
      this.mainThemeSound.resume();
      if (this.footstepsSound.isPaused) {
        this.footstepsSound.resume();
      }
      if (this.jumpSound.isPaused) {
        this.jumpSound.resume();
      }
    });

    // set defaults
    this.id = Math.random();
    this.tilePoint = null;

    this.sceneManager.addGameScene(this.scene.key);

    // add the HUD (scene)
    this.sceneManager.overlay('HUDGameScene');

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
      key: 'map'
    });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = this.map.addTilesetImage('GameBoyTiles', 'tiles');

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    this.belowLayer = this.map.createDynamicLayer('background', tileset);
    this.worldLayer = this.map.createDynamicLayer('ground', tileset);
    // this.exitLayer = this.map.createDynamicLayer('exit', tileset);

    // setup collisions with layers
    this.worldLayer.setCollisionByProperty({
      collides: true
    });
    // this.exitLayer.setCollisionByProperty({
    //   collides: true
    // });

    // ┌ code of block took from: https://bit.ly/2O9udu8 ───────┐
    if (window.gameOptions.debugging === true) {
      const debugGraphics = this.add.graphics().setAlpha(0.75);
      this.worldLayer.renderDebug(debugGraphics, {
        tileColor: null, // color of no colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // color of colliding tiles
        faceColor: new Phaser.Display.Color(221, 42, 42, 255) // color of colliding face edges
      });
    }
    // └────────────────────────────────────────────────────────┘

    const spawnPoint = this.map.findObject(
      'objects',
      obj => obj.name === 'Spawn Point'
    );
    const exitPoint = this.map.findObject(
      'objects',
      obj => obj.name === 'Exit Point'
    );
    // └───────────────────────────────────────────────────────────────────────┘

    this.exitSprite = this.add.sprite(
      exitPoint.x,
      exitPoint.y,
      window.gameOptions.gameSpritesKey,
      'characters/nest/empty_birds-001'
    );
    this.exitBottomLeft = this.exitSprite.getBottomLeft();
    this.exitTopRight = this.exitSprite.getTopRight();

    this.anims.create({
      key: 'nest-dancing',
      frames: this.generateFrameNames('nest/full', 4),
      frameRate: 6,
      repeat: -1
    });

    // ┌ add tutorial texts ───────────────────────────────────────────────────┐
    this.pausedTxt = this.add
      .bitmapText(
        5,
        200,
        'KenneyMini',
        'click anywhere on\nan empty spot to\ncreate a platform\nfor Torca',
        6
      )
      .setTint(0x9bbc0f);

    this.pausedTxt = this.add
      .bitmapText(
        140,
        215,
        'KenneyMini',
        'you can create\nonly one platform\nat once',
        6
      )
      .setTint(0x9bbc0f);
    // └───────────────────────────────────────────────────────────────────────┘

    // ┌ setup Penta ──────────────────────────────────────────────────────────┐
    // adding Penta sprite and enabling ARCADE physics for Penta
    this.penta = this.physics.add.sprite(
      spawnPoint.x,
      spawnPoint.y,
      window.gameOptions.gameSpritesKey,
      'characters/penta/idle-001'
    );

    // set the default direction
    this.penta.direction = 1;

    // ├── setup the animations for Penta ─┐
    // anims: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html
    // AnimationConfig: https://photonstorm.github.io/phaser3-docs/global.html#AnimationConfig
    this.anims.create({
      key: 'penta-fall',
      frames: this.generateFrameNames('penta/fall'),
      frameRate: 1,
      repeat: 1
    });
    this.anims.create({
      key: 'penta-walk',
      frames: this.generateFrameNames('penta/walk', 6),
      frameRate: 14,
      repeat: -1
    });
    this.anims.create({
      key: 'penta-jump',
      frames: this.generateFrameNames('penta/jump'),
      frameRate: 10,
      repeat: -1
    });

    this.penta.anims.play('penta-fall');
    // └───────────────────────────────────┘

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.worldLayerCollider = this.physics.add.collider(
      this.penta,
      this.worldLayer,
      this.movePenta,
      null,
      this
    );

    // Watch the player and exitLayer for collisions, for the duration of the scene:
    // this.exitLayerCollider = this.physics.add.collider(
    //   this.penta,
    //   this.exitLayer,
    //   this.endLevel,
    //   null,
    //   this
    // );

    // set penta's horizontal and vertical speeds
    this.penta.body.velocity.x = window.gameOptions.playerSpeed;
    this.penta.body.gravity.y = window.gameOptions.playerGravity;

    this.cameras.main.roundPixels = true;

    // set workd bounds to allow camera to follow the player
    this.cameras.main.setBounds(0, 0, 256, 256);

    // making the camera follow the player
    this.cameras.main.startFollow(this.penta);

    // waiting for player input
    //    [ note ] this.input >> Phaser.Input.InputPlugin
    this.input.on('pointerdown', this.addBlock, this);
    // └───────────────────────────────────────────────────────────────────────┘

    // ┌ setup music and sfx ──────────────────────────────────────────────────┐
    this.mainThemeSound = this.sound.add('mainTheme');
    this.mainThemeSound.volume = 0.5;
    this.mainThemeSound.play({
      loop: -1
    });

    this.fallSound = this.sound.add('fall');
    this.footstepsSound = this.sound.add('footsteps');
    this.footstepsSound.volume = 0.2;
    this.jumpSound = this.sound.add('jump');
    this.buildSound = this.sound.add('build');
    // └───────────────────────────────────────────────────────────────────────┘
  }

  shutdown() {
    this.events.off('shutdown');
    //this.sceneManager.removeGameScene(this.scene.key)
  }

  update() {
    if (this.isPlayerDead === true) return;

    // check if the player has been reached the end of the level
    if (this.levelEnded === true) {
      return;
    }

    // set some default gravity values. Look at the function for more information
    if (this.penta.isJumping) {
      this.penta.body.velocity.x =
        window.gameOptions.playerJumpSpeed.x * this.penta.direction;
    } else if (this.penta.body.blocked.down) {
      this.penta.body.velocity.x =
        window.gameOptions.playerSpeed * (this.penta.flipX ? -1 : 1);
    } else {
      // penta falling
      this.penta.body.velocity.x = 0;

      if (this.penta.anims.currentAnim.key !== 'penta-fall') {
        this.penta.anims.play('penta-fall');
        this.footstepsSound.stop();
      }
    }

    // check if Penta is at the bounds of the world
    if (
      this.penta.x - this.penta.width / 2 <= 0 ||
      this.penta.x + this.penta.width / 2 >= this.worldLayer.width
    ) {
      this.penta.flipX = !this.penta.flipX;
      this.penta.direction *= -1;
      this.penta.x += 2 * this.penta.direction;
    }

    // check if Penta is on top of the nest
    if (
      this.penta.x >= this.exitBottomLeft.x &&
      this.penta.x <= this.exitTopRight.x &&
      this.penta.y >= this.exitTopRight.y &&
      this.penta.y <= this.exitBottomLeft.y - this.exitSprite.height / 2
    ) {
      this.endGame();
    }
  }

  endGame() {
    this.levelEnded = true;

    // remove the alive Penta
    this.penta.setActive(false);
    this.penta.destroy();

    // stop running sounds
    this.footstepsSound.stop();
    this.jumpSound.stop();
    this.fallSound.stop();

    // remove listeners to prevent creating platforms
    this.input.removeAllListeners();

    // update the sprite of the nest to show the dancing birds
    this.exitSprite.anims.play('nest-dancing');

    // start the timer that will pass to the end game scene
    this.time.delayedCall(
      this.timesplash,
      () => {
        this.changeToScene(this.nextScene);
      },
      [],
      this
    );
  }

  generateFrameNames(animationId, end) {
    return this.anims.generateFrameNames(window.gameOptions.gameSpritesKey, {
      start: 1,
      end: end || 2,
      zeroPad: 3,
      prefix: `characters/${animationId}-`
    });
  }

  movePenta(penta, layer) {
    // some temporary variables to determine if the player is blocked only once
    let blockedDown = penta.body.blocked.down;
    let blockedLeft = penta.body.blocked.left;
    let blockedRight = penta.body.blocked.right;

    // penta on the ground
    if (blockedDown) {
      this.penta.isJumping = false;

      if (penta.anims.currentAnim.key !== 'penta-walk') {
        if (penta.anims.currentAnim.key === 'penta-fall') {
          this.fallSound.play();
        }

        penta.anims.play('penta-walk');
        this.footstepsSound.play({
          loop: -1
        });
      }
    }

    if (this.penta.isJumping === true) return;

    //   [ note ] the second condition is used to prevent Penta from jumping afer
    //            changing his movement direction.
    if (blockedRight && this.penta.direction === 1) {
      const pentaWorldPoint = this.map.worldToTileXY(
        penta.x,
        penta.y,
        true,
        undefined,
        undefined,
        this.worldLayer
      );

      const tileInFront = this.map.getTilesWithin(
        pentaWorldPoint.x + 1,
        pentaWorldPoint.y,
        1,
        1,
        { isNotEmpty: true },
        this.worldLayer
      );

      if (tileInFront.length === 1) {
        const tilesAtNorthEast = this.map.getTilesWithin(
          pentaWorldPoint.x + 1,
          pentaWorldPoint.y - 1,
          1,
          1,
          { isNotEmpty: true },
          this.worldLayer
        );

        const tilesAtNorth = this.map.getTilesWithin(
          pentaWorldPoint.x,
          pentaWorldPoint.y - 1,
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
    }

    // penta on the ground and touching a wall on the right
    //   [ note ] the second condition is used to prevent Penta from jumping afer
    //            changing his movement direction.
    if (blockedLeft && this.penta.direction === -1) {
      const pentaWorldPoint = this.map.worldToTileXY(
        penta.x,
        penta.y,
        true,
        undefined,
        undefined,
        this.worldLayer
      );

      const tileInFront = this.map.getTilesWithin(
        pentaWorldPoint.x - 1,
        pentaWorldPoint.y,
        1,
        1,
        { isNotEmpty: true },
        this.worldLayer
      );

      if (tileInFront.length === 1) {
        const tilesAtNorthWest = this.map.getTilesWithin(
          pentaWorldPoint.x - 1,
          pentaWorldPoint.y - 1,
          1,
          1,
          { isNotEmpty: true },
          this.worldLayer
        );

        const tilesAtNorth = this.map.getTilesWithin(
          pentaWorldPoint.x,
          pentaWorldPoint.y - 1,
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
  }

  jump() {
    this.penta.body.velocity.y = window.gameOptions.playerJumpSpeed.y;
    this.penta.isJumping = true;

    if (this.penta.anims.currentAnim.key !== 'penta-jump') {
      this.penta.anims.play('penta-jump');
      this.jumpSound.play();
      this.footstepsSound.stop();
    }
  }

  addBlock(pointer, gameObject) {
    // Convert the mouse position to world position within the camera
    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    );

    worldPoint.x = ~~worldPoint.x;
    worldPoint.y = ~~worldPoint.y;

    const pentaWorldPoint = this.map.worldToTileXY(
      this.penta.x,
      this.penta.y,
      true,
      undefined,
      undefined,
      this.worldLayer
    );

    // get the distance between the pointer position and Penta's position
    const distanceX = worldPoint.x - pentaWorldPoint.x;
    const distanceY = worldPoint.y - pentaWorldPoint.y;

    // check if the click was done inside the range where it changes the movement
    // direction of Penta, otherwise, try to create the magick block
    if (distanceX === 0 && distanceY === 0) {
      this.penta.direction *= -1;
      this.penta.flipX = !this.penta.flipX;
    } else {
      const tileInPointerPos = this.map.getTileAt(
        worldPoint.x,
        worldPoint.y,
        undefined,
        this.worldLayer
      );
      if (!tileInPointerPos || tileInPointerPos.index === 9) {
        if (this.tilePoint !== null) {
          this.map.removeTileAt(
            this.tilePoint.x,
            this.tilePoint.y,
            undefined,
            undefined,
            this.worldLayer
          );
        }
        const createdTile = this.map.putTileAt(
          1,
          worldPoint.x,
          worldPoint.y,
          undefined,
          this.worldLayer
        );

        createdTile.setCollision(true);
        this.tilePoint = new Phaser.Geom.Point(createdTile.x, createdTile.y);

        this.buildSound.play();
      }
    }
  }

  endLevel(penta, tile) {
    // tile.tilemapLayer.removeTileAt(10, tile.x, tile.y);
    // tile.tilemapLayer.update();
    // tile.destroy();
  }
}
