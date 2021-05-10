
function loadBG(that){
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


export {loadBG as default}
