var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "48a",
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: { y: 200 }
    //     }
    // },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
    physics: {
      default: "arcade",
    },
    //typ silnika na fizyczny, odbicia, spite mają ciało czyli posiadają wartości fizyczne  ball = this.physics.add.sprite(250, 350, 'ball');
  };
  
  var game = new Phaser.Game(config);
  
  //wczytanie zasobów, pliki  graficzne dźwiękowe
  function preload() {
    this.load.baseURL = "https://examples.phaser.io/assets/";
  
    //to nie jest potrzebne jesli lokalnie zaciągam pliki, jeśli chce zaciągać zasoby z innej domeny to musze to wprowadzić
    this.load.crossOrigin = "anonymous";
  
    //ładowanie obrazka do cache'u
    this.load.image("ball", "games/breakout/ball.png");
  
    this.load.image("paddle", "games/breakout/paddle.png");
  
    this.load.image("brick", "games/breakout/brick2.png");
  }
  
  var ball, paddle, cursors, bricks, gameoverText;
  
  //tworzenie obiektów gry, wszystkie animowanie,
  function create() {
    //jakbym chcial obiekt duch- niefizyczny to wywalam słowo physics
    ball = this.physics.add.sprite(250, 350, "ball"); //polozenie +obrazek
    ball.setOrigin(0.5, 0.5); // ustawianie lokalizacji
  
    ball.body.velocity.x = 200;
    ball.body.velocity.y = -250;
  
    ball.body.setCollideWorldBounds(true);
    // numer to sprężystość
    ball.body.bounce.set(1);
  
    //paletka
    paddle = this.physics.add.sprite(400, 550, "paddle");
    paddle.setOrigin(0.5); //x i y na jedna wartosc
    paddle.body.setCollideWorldBounds(true);
    //nieprzesuwalność
    paddle.body.immovable = true;
  
    cursors = this.input.keyboard.createCursorKeys();
  
    //grupa obiektow cegeiłek
    bricks = this.physics.add.staticGroup();
    for (var y = 0; y < 6; ++y) {
      for (var x = 0; x < 14; ++x) {
        let brick = bricks.create(175 + x * 36, 50 + y * 40, "brick");
      }
    }
  
    //nie wiem czemu dziadostwo mi nie dziala
    //   bricks = this.physics.add.staticGroup({
    //     key: "brick",
    //     quantity: 11,
    //     gridAlign: {
    //       width: 1000,
    //       height: 4000,
    //       cellWidth: 1,
    //       cellHeight: 1,
    //       x: 20,
    //       y: 20,
    //     },
    //   });
    gameoverText = this.add.text(
      this.physics.world.bounds.centerX,
      300,
      "GAME OVER",
      {
        font: "40px TimesNewRoman",
        fill: "#ffffff",
        align: "center",
      }
    );
    gameoverText.setOrigin(0.5);
    gameoverText.visible = false;
  
    //this.physics.world.setBoundsCollision(true, true, true, false); //false dla dolu L R T B dodalem komende nizej temu to zakomentowalem bo ballLost ma to samo co to
  
    ball.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", ballLost);
  }
  
  //uruchamianie co klatkę animacji, testowanie kolizji, przeliczanie AI, kontrolowanie wejść
  // function update(time,delta){ //time - czas, delta - czas jaki uplynął od wygenerowania frame
  //     // ball.x -= 0.1 * delta;
  //     // ball.y -= 0.15 * delta;
  // }
  function update() {
    //time - czas, delta - czas jaki uplynął od wygenerowania frame
    paddle.body.velocity.x = 0;
    if (cursors.left.isDown) {
      paddle.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
      paddle.body.velocity.x = 250;
    }
  
    //overlap -> testuje kolizje
    //collide -> wykrywa kolizje i niedopuszcza do nakladania sie obiektow
  
    //obkiety + metoda która te obiekty wywołują w przypadku kolizji
    this.physics.collide(paddle, ball, ballHitsPaddle);
    this.physics.collide(ball, bricks, ballHitsBrick);
  // przypadek uderzenia dolnej krawedzi ,zamiast tego binduje metode w create physics.world.on
  //   if (ball.y > 600) {
  //     ball.disableBody(true, true);
  //     gameoverText.visible = true;
  //   }
  }
  
  function ballHitsPaddle(ball, paddle) {
    ball.body.velocity.x = 5 * (ball.x - paddle.x);
  }
  function ballHitsBrick(ball, brick) {
    brick.disableBody(true, true);
  }
  
  function ballLost(ball, up, down, left, right) {
    if (down) {
      ball.gameObject.disableBody(true, true);
      gameoverText.visible = true;
    }
  }
  