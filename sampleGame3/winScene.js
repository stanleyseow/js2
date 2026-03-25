class winScene extends Phaser.Scene {
  constructor() {
    super("winScene");

    // Put global variable here
  }

  preload() {
    this.load.image("winPage", "assets/intro.jpg");
    this.load.audio("winSnd", "assets/win.wav");
  }

  create() {
    console.log("*** gameOver scene");

    this.add.image(320, 320, "winPage");

    this.winSceneSnd = this.sound.add("winSnd");

    this.winSceneSnd.play();

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // Reset counter after gameover
    life = 3;
    item1 = 0;
    item2 = 0;
    item3 = 0;

    // On spacebar event, call the world scene
    spaceDown.on(
      "down",
      function () {
        console.log("Jump to world scene");
        let playerPos = {};
        playerPos.x = 100;
        playerPos.y = 550;
        this.scene.start("world", { playerPos: playerPos });
      },
      this,
    );

    // Add any text in the main page
    this.add.text(90, 600, "Press spacebar to restart", {
      font: "30px Courier",
      fill: "#FFFFFF",
    });

    // Create all the game animations here
  }
}
