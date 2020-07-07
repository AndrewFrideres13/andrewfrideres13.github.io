var level_hell = {
    preload: function() {//Have to load these here....
      game.load.spritesheet("rockExplode", "Pics/gameAssets/rockExplode.png", 80, 86);
      game.load.spritesheet("demon", "Pics/gameAssets/cacodemon.png", 144, 148);
      game.load.spritesheet("DoomGuy", "Pics/gameAssets/doomguy.png", 130, 165);
      game.load.image("bullet", "Pics/gameAssets/bullet.png");
      game.load.image("doom", "Pics/gameAssets/doom.png");
      game.load.spritesheet("imp", "Pics/gameAssets/imp.png", 46.8, 59);
      game.load.spritesheet("pFire", "Pics/gameAssets/fire.png", 169, 160);
      game.load.spritesheet("pDeath", "Pics/gameAssets/pDeath.png", 148, 160);
      
      game.load.audio("gurgle", "audio/gurgle.mp3");
      game.load.audio("cacoDeath", "audio/cacodeath.mp3");
      game.load.audio("wFire", "audio/fire.mp3");
      game.load.audio("impDeath", "audio/impdeath.mp3");
      game.load.audio("pain", "audio/pain.wav");
      game.load.audio("start", "audio/start.mp3");
      game.load.audio("jump", "audio/jump.wav");
	  //Setting the above up in level_load no longer works
      game.load.tilemap("Doom_Map", "js/gameJSON/Doom_Map.json", null, Phaser.Tilemap.TILED_JSON);
      game.load.image("Heck", "Pics/gameAssets/Heck.gif");
      game.load.image("dirt", "Pics/gameAssets/dirt.png");
      game.load.image("door", "Pics/gameAssets/door.jpg");
      game.load.image("ledge", "Pics/gameAssets/ledge.gif");
      game.load.image("death", "Pics/gameAssets/death.png");
      game.load.image("light", "Pics/gameAssets/light.png");
      
      game.load.audio("Sandman", "audio/Sandman.mp3");
    },
    
    create: function() {
      //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      //game.input.onDown.add(level_load.goFull);
      state = "Hell"; //MapName
      map = game.add.tilemap("Doom_Map");
      map.addTilesetImage("Heck");
      map.addTilesetImage("dirt");
      map.addTilesetImage("door");
      map.addTilesetImage("ledge");
      map.addTilesetImage("death");
      map.addTilesetImage("light");
      
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
      var music = game.add.audio("Sandman").loopFull(0.6).volume = 0.65;
      
      //Player
      level_load.spawnPlayer();
	  level_load.playerHealthBar();
      level_load.initializeFiring();
      
      //Need a "null" boss in order to keep enemy movement function satisfied
     // boss = game.add.sprite(0);
      //game.physics.arcade.enable(boss);
	  level_load.spawnCyberDemon();
      level_load.spawnImps();
	  level_load.spawnCacos();
    }, 
    
    update: function() { 
      level_load.enemyFollowPlayer();
	  level_load.gameCollisions();
      //game.input.onTap.add(level_load.playerTouch, this);
      level_load.playerShoot();	  
      level_load.flipPlayer();
      level_load.playerUtilities();
    },
};