class GamePlayer {
  constructor() {
    this.lifes = 3;
    this.health = 20;
    this.money = 0;
    this.hasDoorKey = false;
  }
}

var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: { debug: false, gravity: { y: 600 } },
  },
  scene: { preload: preload, create: create, update: update },
};

var game = new Phaser.Game(config);

var enemyCount = 2;
var moneyCount = 5;
var medkitCount = 2;

var player;
var player2;
var cameras;
var cursors;
var bg;
var ladders;
var doorKey;
var map;
var layer;
var b_1;
var cameras;
var enemies;
var medkits;
var scoreLabel;
var keyItem;
var medkit;
var coins;
var bottom;
var ladderGroup;
var gameOverLabel;
var enter;
var winLabel;
var flaga = true;
var speedArr = [];
var gameBar = new GamePlayer();

function preload() {
  this.load.crossOrigin = "anonymous";

  //wczytanie kafelkow
  this.load.image("tiles", "assets/clawTiles.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  //wczytanie jsona
  this.load.tilemapTiledJSON("map", "/assets/pazur.json");
  //wczytanie tla
  this.load.image("background", "assets/tlo.png");

  //gracz sprite
  this.load.spritesheet("player", "assets/clawSprite.png", {
    frameWidth: 110,
    frameHeight: 110,
  }); 
  //clawSpriteFight
  this.load.spritesheet("playerFight", "assets/clawSpriteFight.png", {
    frameWidth: 110,
    frameHeight: 110,
  });

  

  //wróg sprite
  this.load.image(
    "enemy",
    "https://examples.phaser.io/assets/sprites/maggot.png",
    {
      frameWidth: 20,
      frameHeight: 80,
    }
  );

  //apteczka sprite
  this.load.image(
    "medkit",
    "https://examples.phaser.io/assets/sprites/firstaid.png",
    {
      frameWidth: 50,
      frameHeight: 50,
    }
  );

  //moneta sprite
  this.load.spritesheet("coin", "assets/coinMini.png", {
    frameWidth: 25,
    frameHeight: 25,
  });

  //klucz sprite
  this.load.image("keyItem", "assets/key.png", {
    frameWidth: 25,
    frameHeight: 25,
  });

  //wczytywanie bitFonta - czcionki

  this.load.bitmapFont("pixelFont", "assets/font.png", "assets/font.xml");
}

function create() {
  //background
  b_1 = this.add.tileSprite(
    0,
    0,
    game.config.width,
    game.config.height,
    "background"
  );
  b_1.setOrigin(0);
  b_1.setScrollFactor(0);

  //kafle i json
  map = this.make.tilemap({ key: "map" });
  tiles = map.addTilesetImage("KafelkiPazur", "tiles");
  layer = map.createLayer(0, tiles, 0, 0);
  this.physics.world.setBounds(0, 0, 4000, 700);
  layer.setScale(0.75);
  ladders = [];
  layer.forEachTile((tile) => {
    if (tile.index === 137) {
      ladders.push(tile);
    }
  });

  //ustawianie kolizji
  map.setCollision([164, 220, 53, 157, 135, 311, 303, 219, 345, 16, 15]);

  //GRACZ I KAMERA
  player = getPlayer.call(this);
  player.setScale(0.75);

  this.cameras.main.setBounds(0, 0, 4000, 700);
  this.cameras.main.startFollow(player);

  scoreLabel = this.add
    .bitmapText(
      20,
      10,
      "pixelFont",
      `Money: ${gameBar.money} \nLifes: ${gameBar.lifes}\nHealth: ${gameBar.health}`
    )
    .setScale(2.5);
  scoreLabel.setScrollFactor(0);
  gameOverLabel = this.add
    .bitmapText(80, 230, "pixelFont", "GAME OVER")
    .setScale(12.5);
  gameOverLabel.setVisible(false);
  winLabel = this.add
    .bitmapText(950, 230, "pixelFont", "WINNER")
    .setScale(12.5);
  winLabel.setVisible(false);

  //dodawanie wrogów
  enemies = this.physics.add.group({
    key: "enemy",
    repeat: enemyCount - 1,
    setXY: { x: 720, y: 0, stepX: 300 },
  });
  id = 0;
  enemies.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
    child.setScale(0.75);
    child.setVelocityX(70);
    child.name = id;
    id++;
  });

  //dodawanie klucza
  keyItem = this.physics.add.sprite(3870, 100, "keyItem");
  keyItem.setCollideWorldBounds(true, true, false, true);
  keyItem.setBounce(0.1);
  keyItem.setScale(2);

  //dodawanie apteczek
  medkits = this.physics.add.group({
    key: "medkit",
    repeat: medkitCount - 1,
    setXY: { x: 850, y: 0, stepX: 900 },
  });

  medkits.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  //dodawanie monet
  coins = this.physics.add.group({
    key: "coin",
    repeat: moneyCount - 1,
    setXY: { x: 700, y: 0, stepX: 80 },
  });
  coins.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  //KURSORY
  cursors = this.input.keyboard.createCursorKeys();
  //spacja
  jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  //enter
  enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  //Bindowanie do stringa- key klatek animacji
  this.anims.create({
    //w lewo
    key: "left",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 9 }),
    frameRate: 10,
    repeat: 1,
  });
  this.anims.create({
    //gdy stoi
    key: "idle",
    frames: this.anims.generateFrameNumbers("player", { start: 20, end: 29 }),
    frameRate: 5,
    repeat: 1,
  });
  this.anims.create({
    //w prawo
    key: "right",
    frames: this.anims.generateFrameNumbers("player", { start: 10, end: 19 }),
    frameRate: 10,
    repeat: 1,
  });
  this.anims.create({
    //walczy w prawą stronę
    key: "fight_right",
    frames: this.anims.generateFrameNumbers("playerFight", {
      start: 4,
      end: 7,
    }),
    frameRate: 15,
    repeat: 0,
  });
  this.anims.create({
    //walczy w lewą stronę
    key: "fight_left",
    frames: this.anims.generateFrameNumbers("playerFight", {
      starts: 0,
      end: 3,
    }),
    frameRate: 15,
    repeat: 1,
  });
  //stan IDLE gracza
  player.on("animationrepeat", () => {
    player.anims.play("idle");
  });

  //animacja coina
  this.anims.create({
    key: "coinRoll",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 9 }),
    frameRate: 10,
    repeat: 1,
  });

  //zmienna przechowująca dolną granicę świata
  bottom = this.physics.world.bounds.bottom;

  //kontak z drzwiami i wygranie gry
  map.setTileIndexCallback(284, winTheGame, this);

  //poruszanie się wrogów
  map.setTileIndexCallback(327, moveEnemy, this);
  map.setTileIndexCallback(219, moveEnemy, this);
  map.setTileIndexCallback(303, moveEnemy, this);
}

function update() {
  this.physics.collide(player, layer);
  //wrogowie
  if (enemyCount > 0) {
    this.physics.collide(enemies, layer);
    this.physics.overlap(player, enemies, dieByEnemy, null, this);
  }

  //klucz
  this.physics.collide(layer, keyItem);
  this.physics.overlap(player, keyItem, collectKey, null, this);
  this.physics.overlap(player, doorKey, collectKey, null, this);

  //medkity zbieranie
  if (medkitCount > 0) {
    this.physics.add.collider(medkits, layer);
    this.physics.add.overlap(player, medkits, collectMedkit, null, this);
  }

  //COINY zbieranie
  if (moneyCount > 0) {
    this.physics.add.collider(coins, layer);
    this.physics.overlap(player, coins, collectCoin, null, this);
    coins.children.iterate(function (child) {
      child.anims.play("coinRoll", true);
    });
  }

  //label z wynikami
  scoreLabel.setText(
    `Money: ${gameBar.money} \nLifes: ${gameBar.lifes}\nHealth: ${gameBar.health}`
  );

  dieByFall(player, bottom, this); //śmierć przez upadek
  movePlayer(player); //ruchy gracza
  getNewGame(this); //nowa gra
  if (gameOver(player, this) === true) {
    this.physics.pause();
  }
}

speedArr = [100, 100];
var flag = true;
var sec = 1000;
var speed = 40;

//ruch wroga
function moveEnemy(sprite) {
  if (flag) {
    flag = !flag;
    setTimeout(() => (flag = !flag), 10 * sec);
  }

  enemies.children.iterate(function (child) {
    if (child.name === sprite.name && child.name != -1) {
      //speedArr.findIndex(x => x === child.name)
      let idx = child.name * 1;
      speedArr[idx] *= -1;
      child.setVelocityX(speedArr[idx]);
      child.setVelocityY(10);
    }
  });
}

//wygrana
function winTheGame(sprite) {
  if (sprite === player && gameBar.hasDoorKey == true) {
    player.disableBody(true, true);
    winLabel.setVisible(true);
    scoreLabel.setVisible(false);
    return true;
  } else {
    return false;
  }
}

//totalny koniec gry
function gameOver(player, game) {
  if (gameBar.lifes == 0) {
    game.physics.pause();
    player.disableBody(true, true);
    gameOverLabel.setVisible(true);
    scoreLabel.setVisible(false);
    return true;
  } else {
    return false;
  }
}

//tworzymy nową grę poprzez zresetowanie starej i naciśnięcie entera
function getNewGame(game) {
  if (enter.isDown) {
    game.scene.restart();
    gameBar.lifes = 3;
    gameBar.health = 20;
    gameBar.money = 0;
    gameBar.hasDoorKey = false;
    enemyCount = 2;
    medkitCount = 2;
    moneyCount = 5;
  }
}

//zbieranie klucza
function collectKey() {
  gameBar.hasDoorKey = true;
  keyItem.disableBody(true, true);
}

//śmierć przez wroga
function dieByEnemy(player, enemy) {
  if (cursors.space.isDown && gameBar.health > 0) {
    // enemy.disableBody(true,true);
    enemy.destroy();
    enemyCount--;
  } else if (gameBar.health == 0) {
    this.scene.restart();
    --gameBar.lifes;
    gameBar.health = 20;
    gameBar.money = 0;
    gameBar.hasDoorKey = false;
  } else {
    --gameBar.health;
  }
}

//zbieranie monet
function collectCoin(player, coin) {
  ++gameBar.money;
  coin.disableBody(true, true);
  moneyCount--;
}

//zbieranie apteczek
function collectMedkit(player, medkit) {
  if (gameBar.health != 20) {
    gameBar.health = 20;
    medkit.disableBody(true, true);
    medkitCount--;
  } else {
    ++gameBar.lifes;
    medkit.disableBody(true, true);
    medkitCount--;
  }
}

//śmierć przez wypadnięcie z mapy
function dieByFall(player, bottom, game) {
  if (player.y >= bottom - 55) {
    game.scene.restart();
    --gameBar.lifes;
    gameBar.money = 0;
    gameBar.health = 20;
    gameBar.hasDoorKey = false;
    moneyCount = 5;
  }
}

//nowy gracz
function getPlayer() {
  let player;
  player = this.physics.add.sprite(50, 100, "player");
  player.setCollideWorldBounds(true, true, false, true);
  player.setBounce(0.2); //parametry odbijania
  return player;
}

//UPDATE ruchy gracza
function movePlayer(player) {
  let isKey = false;
  if (cursors.space.isDown && cursors.left.isDown) {
    player.anims.play("fight_left", true);
    isKey = true;
  } else if (cursors.space.isDown && cursors.right.isDown) {
    player.anims.play("fight_right", true);
    isKey = true;
  } else if (cursors.space.isDown && !isKey) {
    player.anims.play("fight_right", true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-150);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(150);
    player.anims.play("right", true);
  } else {
    player.anims.play("idle", true);
    player.setVelocityX(0);
  }
  if (jump.isDown && (player.body.touching.down || player.body.onFloor())) {
    player.setVelocityY(-400);
  }
}
