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
var player,player2,cameras,cursors,bg;

function preload(){
  loadBG.call(this);
  console.log("Zakończono preload");
}
function create(){
  bg = getBackground.call(this);
  player = getPlayer.call(this);


  platforms = this.physics.add.staticGroup();
  platforms.create(200, 240, 'platform');
  platforms.create(300, 190, 'platform');
  

  //KAMERY
  //śledzenie gracza 
  this.cameras.main.startFollow(player);
  //ogarnięcie kamery pod mapkę
  this.cameras.main.setBounds(0, 0, 900, 300);
  

  //KURSORY
  cursors = this.input.keyboard.createCursorKeys();
  jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
}
function update(){
movePlayer(player);
}



//PRELOAD
function loadBG(){
  this.load.baseURL = "https://examples.phaser.io/assets/";
  this.load.crossOrigin = "anonymous";
  this.load.image("background", "games/starstruck/background.png");
  //spritesheet wczytuje obrazek animacji czyli 
  //wszystkie dostępne ruchy duszka
  this.load.spritesheet("player", "games/starstruck/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  this.load.image('platform','sprites/block.png');
  this.load.image('bullet', 'sprites/bullet.png');
}

//CREATE
function getBackground(){
  //tilesprite -twrzenie patternu odkad, jaka część ma zawierać itp
  let back = this.add.tileSprite(0, 28, 500, 300, "background");  back.setOrigin(0);
  //zwiekszenie świata 
  this.physics.world.setBounds(0, 0, 900, 300);
  //ustawienie scrollowania mapy
  back.setScrollFactor(0);
  return back;
}

function getPlayer(){
    let player;
    player = this.physics.add.sprite(50, 100, "player");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2); //parametry odbijania
    return player;
}


//UPDATE
function movePlayer(player){
  if (cursors.left.isDown) {
    player.setVelocityX(-150);
    // player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    // player.anims.play('right', true);
    player.setVelocityX(150);
    
  } else {
    // player.anims.play('stop');
    player.setVelocityX(0);
  }

  if (jump.isDown && (player.body.touching.down || player.body.onFloor())) {
    player.setVelocityY(-250);
  }
}