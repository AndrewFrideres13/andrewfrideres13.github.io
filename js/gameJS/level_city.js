var level_city = {
    preload: function() {
      game.load.tilemap("Doom_City", "js/gameJSON/Doom_City.json", null, Phaser.Tilemap.TILED_JSON);
      game.load.image("City", "Pics/gameAssets/city.png");
      game.load.image("metal", "Pics/gameAssets/metal.png");
      game.load.image("door", "Pics/gameAssets/door.jpg");
      game.load.image("mLedge", "Pics/gameAssets/mLedge.png");
      game.load.image("mutant", "Pics/gameAssets/mutant.png");
      game.load.image("goo", "Pics/gameAssets/goo.png");
      game.load.spritesheet("boss", "Pics/gameAssets/boss.png", 136, 108);
      
      game.load.audio("bossHurt", "audio/b1hurt.wav");
      game.load.audio("bossDeath", "audio/b1death.wav");
      game.load.audio("quake", "audio/quake.mp3");
    },

    create: function() {
      state = "City"; // MapName
      map = game.add.tilemap("Doom_City");
      map.addTilesetImage("City");
      map.addTilesetImage("metal");
      map.addTilesetImage("door");
      map.addTilesetImage("mLedge");
      map.addTilesetImage("mutant");
      map.addTilesetImage("goo");
      
      Background = map.createLayer("Background");
      BackgroundObjects = map.createLayer("BackgroundObjects");
      Background.resizeWorld();
      Foreground = map.createLayer("Foreground");
      EnemyCollision = map.createLayer("EnemyCollision");
      EndDoor = map.createLayer("EndDoor");
      map.setCollisionByExclusion([1],true,"Foreground");
      map.setCollisionByExclusion([780],true, "EnemyCollision");
      map.setCollisionByExclusion([1],true,"EndDoor");  
      level_load.levelStart();
      
      //Music
      var music = game.add.audio("quake").loopFull(0.6).volume = 0.65;
      
      //Player
      level_load.spawnPlayer();
      level_load.playerHealthBar();
	  level_load.initializeFiring();
      
      //Enemy spawning
	  level_load.spawnImps();
      level_load.spawnCacos();   
	  level_load.spawnCyberDemon();	  
    }, 
    
    update: function() {
      level_load.enemyFollowPlayer();
	  level_load.gameCollisions();
      //game.input.onTap.add(level_load.playerTouch, this); 
	  //Player updates
	  level_load.playerShoot();
      level_load.flipPlayer();
      level_load.playerUtilities();
    },
};