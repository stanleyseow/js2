class beforeRoom1 extends Phaser.Scene {
  constructor() {
    super("beforeRoom1");

    // Put global variable here
  }

  preload() {
    this.load.image("instructionPage", "assets/instruction.jpg");
  }

  create() {
    console.log("*** beforeRoom1 scene");

    this.add.image(320, 320, "instructionPage");

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, call the world scene
    spaceDown.on(
      "down",
      function () {
        this.scene.start("room1");
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
