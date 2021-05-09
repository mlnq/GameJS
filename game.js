var config = {
  type: Phaser.AUTO,
  width: 500,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      //do debugowania fajen
      debug: true,
    },
  },
  scene: { preload, create, update },
};

var game = new Phaser.Game(config);

