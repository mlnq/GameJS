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
  
  function preload() {
    this.load.baseURL = "https://examples.phaser.io/assets/";
    this.load.crossOrigin = "anonymous";
  
    this.load.image("background", "games/starstruck/background.png");
  
    //spritesheet wczytuje obrazek animacji czyli wszystkie dostępne ruchy duszka
    this.load.spritesheet("player", "games/starstruck/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  
    this.load.image('platform','sprites/block.png');
    this.load.image('bullet', 'sprites/bullet.png');
  }
  var player, cursors, jump, platforms,bullets,weapon;
  
  function create() {
  
    //tilesprite -twrzenie patternu odkad, jaka część ma zawierać itp
    let back = this.add.tileSprite(0, 28, 500, 300, "background");  back.setOrigin(0);
    
    player = this.physics.add.sprite(50, 100, "player");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2); //parametry odbijania
    
    //śledzenie gracza - nie wiem czemu 
    this.cameras.main.startFollow(player);
    
    //nieprzesuwanie kamery?
    //zwiekszenie świata 
    this.physics.world.setBounds(0, 0, 900, 300);
    //ogarnięcie kamery pod mapkę
    this.cameras.main.setBounds(0, 0, 900, 300);
    //ustawienie scrollowania mapy
    back.setScrollFactor(0);
  
    cursors = this.input.keyboard.createCursorKeys();
  
    //klawisz skoku
    jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  
    //bindowanie do stringa- key klatek animacji
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "stop",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  
   platforms = this.physics.add.staticGroup();
   platforms.create(200, 240, 'platform');
   platforms.create(300, 190, 'platform');
   platforms.create(400, 140, 'platform');
   platforms.create(450, 90, 'platform');
   platforms.create(500, 140, 'platform');
   platforms.create(600, 190, 'platform');
   platforms.create(700, 240, 'platform');
   platforms.children.iterate(child => {child.setScale(0.5).setOrigin(0).refreshBody()})
  
   //kolizje pomiędzy 2 obiektami
   this.physics.add.collider(player, platforms);
  
   //PIW PAW POCISKI - nie dziala
    //weapon = this.add.weapon(10, 'bullet');
   //tworzenie puli obiektów, TAK STWORZONE OBIEKTY NIE ISTNIEJA exist=false
    //bullets.createMultiple(30, 'bullet');
  
  //  bullets.setAll('anchor.y', 0.5);
   //usuwanie pocisków gdy ucięknie poza świat
  //  bullets.setAll('outOfBoundsKill', true);
  //  bullets.setAll('checkWorldBounds', true);
  }
    
  
  function update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-150);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.anims.play('right', true);
      player.setVelocityX(150);
      
    } else {
      player.anims.play('stop');
      player.setVelocityX(0);
    }
  
    if (jump.isDown && (player.body.touching.down || player.body.onFloor())) {
      player.setVelocityY(-250);
    }
    
  }
  