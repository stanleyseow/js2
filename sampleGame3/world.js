class world extends Phaser.Scene {
  constructor() {
    super("world");
  }

  // incoming data from scene below
  init(data) {
    this.playerPos = data.playerPos;
  }

  preload() {
    // Step 1, load JSON
    this.load.tilemapTiledJSON("worldmap", "assets/RafflesklMap.tmj");

    // this.load.image("road", "assets/road.png");
    this.load.image("kenny", "assets/kenny.png");
    this.load.image("pippoya", "assets/pippoya.png");
    this.load.image("raffles", "assets/rafflesTiless-01.png");
    this.load.image("tree", "assets/tree.png");

    this.load.spritesheet("food", "assets/food.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("opendoor", "assets/doorOpen.wav");
  }

  create() {
    console.log("*** world scene");

    this.collectPotatoSnd = this.sound.add("opendoor");
    this.opendoorSnd = this.sound.add("opendoor");

    this.potatoText = this.add
      .text(100, 100, "Potatoes: 0", { fontSize: "24px", fill: "#ff00ff" })
      .setScrollFactor(0)
      .setDepth(999);

    this.lifeText = this.add
      .text(300, 100, "Life: 0", { fontSize: "24px", fill: "#ff00ff" })
      .setScrollFactor(0)
      .setDepth(999);

    this.lifeText.setText(`Life: ${life}`);

    let map = this.make.tilemap({ key: "worldmap" });

    let kennyTiles = map.addTilesetImage("kenny03", "kenny");
    let rafflesTiles = map.addTilesetImage("raffles01", "raffles");
    let pippoyaTiles = map.addTilesetImage("pippoya05", "pippoya");
    let treeTiles = map.addTilesetImage("tree04", "tree");

    let tilesArray = [kennyTiles, rafflesTiles, pippoyaTiles, treeTiles];

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer", tilesArray, 0, 0);
    this.decorLayer = map.createLayer("decorLayer", tilesArray, 0, 0);
    this.buildingLayer = map.createLayer("BuildingLayer", tilesArray, 0, 0);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    let item1 = map.findObject("objectLayer", (obj) => obj.name === "item1");
    let item2 = map.findObject("objectLayer", (obj) => obj.name === "item2");
    let item3 = map.findObject("objectLayer", (obj) => obj.name === "item3");

    let enemy1 = map.findObject("objectLayer", (obj) => obj.name === "enemy1");
    let enemy2 = map.findObject("objectLayer", (obj) => obj.name === "enemy2");
    let enemy3 = map.findObject("objectLayer", (obj) => obj.name === "enemy3");

    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      "down",
    );
    window.player = this.player;

    this.player.setCollideWorldBounds(true); // don't go out of the this.map

    this.anims.create({
      key: "potatoAnim",
      frames: [
        { key: "food", frame: 0 },
        { key: "food", frame: 32 },
        { key: "food", frame: 64 },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.potato1 = this.physics.add
      .sprite(item1.x, item1.y, "food")
      .play("potatoAnim");
    this.potato2 = this.physics.add
      .sprite(item2.x, item2.y, "food")
      .play("potatoAnim");
    this.potato3 = this.physics.add
      .sprite(item3.x, item3.y, "food")
      .play("potatoAnim");

    this.enemy1 = this.physics.add
      .sprite(enemy1.x, enemy1.y, "enemy")
      .play("enemy-down");
    this.enemy2 = this.physics.add
      .sprite(enemy2.x, enemy2.y, "enemy")
      .play("enemy-right");
    this.enemy3 = this.physics.add
      .sprite(enemy3.x, enemy3.y, "enemy")
      .play("enemy-left");

    this.tweens.add({
      targets: this.enemy2,
      x: 800,
      flipX: true,
      yoyo: true,
      duration: 3000,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.enemy1,
      y: 1000,
      flipY: false,
      yoyo: true,
      duration: 4000,
      repeat: -1,

      onYoyo: () => {
        console.log("onYoyo, play enery1-up anims");
        this.enemy1.play("enemy-up");
      },
      onRepeat: () => {
        console.log("onRepeat, play enemy1-down anims");
        this.enemy1.play("enemy-down");
      },
    });

    this.tweens.add({
      targets: this.enemy3,
      x: 200,
      flipX: true,
      yoyo: true,
      duration: 3000,
      repeat: -1,
    });

    this.physics.add.overlap(
      this.player,
      [this.potato1, this.potato2, this.potato3],
      this.collectPotato,
      null,
      this,
    );

    this.physics.add.overlap(
      this.player,
      [this.enemy1, this.enemy2, this.enemy3],
      this.hitEnemy,
      null,
      this,
    );

    // // create the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // // camera follow player
    this.cameras.main.startFollow(this.player);

    // player cannot bump into decorations
    this.decorLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.decorLayer);

    // player cannot bump into buildings
    this.buildingLayer.setCollisionByExclusion(-1, false);
    this.physics.add.collider(this.player, this.buildingLayer);
  } /////////////////// end of create //////////////////////////////

  update() {
    if (
      this.player.x > 298 &&
      this.player.x < 362 &&
      this.player.y > 848 &&
      this.player.y < 1081
    ) {
      if (item1 >= 1) {
        console.log("Player entering room1");
        this.room1();
      } else {
        console.log("Need 3 potatoes to enter!");
        this.potatoText.setText(`Potatoes: ${item1} (Need 3 to enter!)`);
      }
    }

    this.player.body.setVelocity(0, 0);

    let speed = 400;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("left", true); // walk left
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("down", true);
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }
  } /////////////////// end of update //////////////////////////////

  collectPotato(player, item) {
    console.log("Player collect potato");

    item1++;

    // play a sound
    this.collectPotatoSnd.play();

    this.potatoText.setText(`Potatoes: ${item1}`);

    // disable body
    item.disableBody(true, true);

    if (item1 > 1) {
      this.winScene();
    }
  }

  hitEnemy(player, enemy) {
    console.log("Player hit enemy");

    life--;
    // // shake screen
    this.cameras.main.shake(300);

    this.lifeText.setText(`Life: ${life}`);

    // disable body
    enemy.disableBody(true, true);

    // If no more life, jump to gameover Scene
    if (life < 1) {
      this.scene.start("gameOver");
    }
  }

  level2() {
    this.scene.start("level2");
  }

  winScene() {
    this.scene.start("winScene");
  }

  // Function to jump to room1
  room1(player, tile) {
    this.opendoorSnd.play();
    this.scene.start("beforeRoom1");
  }

  endSceneFunc() {
    console.log("Run this after 2 secs");
    this.scene.start("room1");
  }
} //////////// end of class world ////////////////////////
