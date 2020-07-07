//Backbone for all levels to come, 
var level_load = {
  Background:null,
  bossBar: null,
  bullets:null,
  EnemyCollision:null, 
  enemiesTotal: 25,
  explosion:null,
  death:null,
  demon:null,
  demons:null,
  demonDeaths:false,
  fireRate:700, 
  Foreground:null,
  invulnerable:0,
  imp:null,
  imps:null,
  impDeaths: false,
  nextFire: 0,
  pDeath:null,
  player:null,
  score:0,
  start:null,
  state:null,
  scoreText:null,

    preload: function() {
      this.finishPreLoad();
    },
    
    levelStart: function() { //Start Menu  
      var pauseLogo = game.add.sprite(50, 50, "doom");
      pauseLogo.inputEnabled = true;
      pauseLogo.scale.setTo(1.3, 1);
      game.paused = true;
      
      //Starts game and unleashes horde
      game.input.onDown.add(function unpause() {
        game.paused = false;
        pauseLogo.kill();
          
        if (pauseLogo.inputEnabled !== false) {
          start = game.add.audio("start").play();
          pauseLogo.inputEnabled = false;
        }
      }); //End input listener on main menu
    },
    
    spawnPlayer: function() {//"Main" Player, make optionable later?
      player = game.add.sprite(-40, game.world.height - 97, "DoomGuy");
      player.animations.add("walk");
      player.animations.play("walk", 3, true);
      player.anchor.setTo(0.7, 0.6);
      player.scale.setTo(0.7, 0.7);
      game.camera.follow(player);
      game.physics.arcade.enable(player);
      player.body.gravity.y = 900;
      player.body.collideWorldBounds = true;
      player.inputEnabled = true;
      //Player Death Setup, pushed off screen so we can keep this ready
      pDeath = game.add.sprite(-1000, -1000, "pDeath");
      pDeath.anchor.setTo(0.7, 0.6);
      pDeath.scale.setTo(0.6, 0.7);
      game.physics.arcade.enable(pDeath);
      pDeath.body.gravity.y = 50;
      pDeath.animations.add("pDeath");
      //Player Fire animations
      pFire = game.add.sprite(player.x, player.y, "pFire");
      pFire.anchor.setTo(0.7, 0.6);
      pFire.scale.setTo(0.75, 0.7);
      pFire.animations.add("fire");
    },
	
	spawnImps: function() {
      imps = game.add.group();
      imps.enableBody = true;
      imps.physicsBodyType = Phaser.Physics.ARCADE;// Unsure if needed, research
      
      //Loops and adds enemies as long as their number is lower than the total given
      for (var i = 0; i < this.enemiesTotal/2; i++) {
        //Spawns imps at random points in the world (away from the player)
        imp = imps.create((game.world.randomX + 800), (-200), "imp");
        imp.killable = true;  
        //Imp animations
        imp.animations.add("walk");
        imp.animations.play("walk", 4, true);
        //Anchors imps hitboxes
        imp.scale.setTo(2, 2);
        imp.anchor.setTo(0.4, 0.3);
        imp.body.gravity.y = 800;
        imp.body.collideWorldBounds = true;
        this.enemiesTotal--;
      }	
	},
	
	spawnCacos: function() {
	  demons = game.add.group();
      demons.enableBody = true;
      demons.physicsBodyType = Phaser.Physics.ARCADE;
      //Loops and adds enemies as long as their number is lower than the total given
      for (var j = 0; j < this.enemiesTotal/2; j++) { //Spawns demons at random points in the world (away from the player)
        demon = demons.create((game.world.randomX + 1000), (game.world.randomY + -500), "demon");
        demon.animations.add("walk");
        demon.animations.play("walk", 4, true);
        demon.killable = true;
        //Anchors their hitboxes
        demon.scale.setTo(0.85, 0.85);
        demon.anchor.setTo(0.5, 0.5);
        demon.body.bounce.setTo(0, 1);
        demon.body.gravity.y = 200;
        demon.body.collideWorldBounds = true;
        this.enemiesTotal--; 
		if (!(demon.inCamera)) {
		  demon.body.velocity.y = 0;
		}	
	  }
	},
    
	spawnCyberDemon: function() { //Boss
      boss = game.add.sprite(game.world.width - 500, game.world.height - 150, "boss");
      game.physics.arcade.enable(boss);
	  level_load.bossHealth();
      boss.body.checkCollision.up = false;
      boss.animations.add("walk");
      boss.animations.play("walk", 4, true);
      boss.anchor.setTo(1.1, 0.66);
      boss.scale.setTo(2.1, 2.2);
	},
	//End spawning of entities
	
    dieRoll: function() {
       return Math.floor(Math.random() * 6);
    },  
    /*playerTouch: function (pointer, doubleTap) {    
      if (doubleTap) {
        if(player.body.onFloor()) {
          player.body.velocity.y = -600;
          jump = game.add.audio("jump");
          jump.play();
        }
      }
    },*/
	
	playerHealthBar: function() {//Healthbar implementation
	  level_load.health = 100;
	  var barConfig = {x: 80, y: 560, width: 130};
	  level_load.myHealthBar = new HealthBar(this.game, barConfig);
	  level_load.myHealthBar.setPercent(level_load.health);
	  level_load.myHealthBar.setBarColor('#00FF00');
	  level_load.myHealthBar.setFixedToCamera(true);
	},
    
    playerUtilities: function() {
      player.body.velocity.x = 0;
      /*if (game.input.mousePointer.isDown && game.input.activePointer.x - 100 != player.x && game.input.activePointer.x + 100 != player.x) {
        game.physics.arcade.moveToXY(player, game.input.x + game.camera.x, player.y, 500);
      }*/
      //Assigning Movement keys to AD
      if ((game.input.keyboard.isDown(Phaser.Keyboard.A)) && (player.alive === true)) {
        player.scale.x = -0.8;  // a little trick.. flips the image to the left
        player.body.velocity.x = -300;
      } else if ((game.input.keyboard.isDown(Phaser.Keyboard.D)) && (player.alive === true)) {
        player.scale.x = 0.8;  // a little trick.. flips the image to the right
        player.body.velocity.x = 300;
      }
      //Allows jumping while running using SPACE
      if ((game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && (player.alive === true)) {
        if(player.body.onFloor()){
          player.body.velocity.y = -600;
          jump = game.add.audio("jump").play();
        }
      } else if ((game.input.keyboard.isDown(Phaser.Keyboard.S)) && (player.alive === true)) {
        player.body.velocity.y += 35;
      }   
      //Allows user to fire using mouse1
      if (game.input.activePointer.isDown && (player.alive === true)) {
        game.time.events.add(Phaser.Timer.second * 5, player.alpha = 0, this);
        game.time.events.add(Phaser.Timer.second * 5, pFire.alpha = 1, this);
        this.fire();
      } else {
        player.alpha = 1;
        pFire.alpha = 0;
      }
    },
    
    playerShoot: function() { //Setting Animation for shooting
      pFire.x = player.x;
      pFire.y = player.y;
    },
    
    flipPlayer: function() {
      if (game.input.activePointer.x < player.x - game.camera.x) {
        player.scale.x = -0.8; 
      } else {
        player.scale.x = 0.8; 
      }
    },
    
    enemyFollowPlayer: function() {
		if (player.x < boss.x) {
			boss.scale.x = -2.5;
			boss.body.velocity.x = -30;        
		} else {
			boss.scale.x = 2.5;
			boss.body.velocity.x = 30;        
		}
      
		imps.forEach(function(imp) {
		  if (imp.inCamera) {
			game.physics.arcade.accelerateToObject(imp, player, 500, 400, 900); 
		  }
		  if (player.x < imp.x) {
			imp.scale.x = 2; 
		  } else {
			imp.body.bounce.setTo(0, 0.5);
			imp.scale.x = -2; 
		}}, game.physics.arcade);
    },
    
    killCaco: function(bullets) {
      bullets.kill();
      level_load.explosions(bullets);
      var cacoDeath = game.add.audio("cacoDeath");
      demon.kill();
      cacoDeath.volume = 0.4;
      cacoDeath.play();
      level_load.score += 100;         
    },
    
    killImp: function(bullets) {
      bullets.kill();
      level_load.explosions(bullets);
      var impDeath = game.add.audio("impDeath");
      imp.kill();
      impDeath.volume = 0.4;
      impDeath.play();
      level_load.score += 80;
    },
	
    bossHealth: function() {
	  level_load.bossHitPoints = 200;
	  level_load.bossBar = {x:boss.body.x, y: boss.body.y - 200, width: 115, height: 15};
	  level_load.bossHP = new HealthBar(this.game, level_load.bossBar);
	  level_load.bossHP.setPercent(level_load.bossHitPoints);
	  level_load.bossHP.setBarColor('#DC143C');
	  level_load.bossHP.setFixedToCamera(true);
	}, 
	
    bossKill: function(bullets) {
	  bullets.kill();
      level_load.explosions(bullets);
      var bossHurt = game.add.audio("bossHurt");
      var bossDeath = game.add.audio("bossDeath"); 
      if (level_load.bossHitPoints > 0)/*Prevents overlap of bossHurt sound FX*/ {
        level_load.bossHitPoints -= 10;
		level_load.bossHP.setPercent(level_load.bossHitPoints);
		if (!(bossHurt.play())) {
			bossHurt.volume = 0.2;
			bossHurt.play();
		}
       } else if (level_load.bossHitPoints <= 0) {
          bossDeath.volume = 0.4;
          bossDeath.play();
          boss.kill();
          level_load.score += 1000;
       }
    },

    killPlayer: function() { //Starting code executes if stomping enemy
	  pain = game.add.audio("pain");
	  death = game.add.audio("gurgle");
	  if (level_load.health > 0 ) {
		if (game.time.now - level_load.invulnerable > 1300)  {
		  level_load.health -= 20;
		  level_load.myHealthBar.setPercent(level_load.health);
		  pain.play();
		  level_load.invulnerable = game.time.now;
		}
	  } else { //Should play animation and kill player once complete
		death.play();
		pDeath.x = player.x;
		pDeath.y = player.y;
		pDeath.animations.play("pDeath", 1.9, false, true);
		level_load.endGame();
	  }
    },
	

    initializeFiring: function() {//Bullets
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.createMultiple(1, "bullet");
      bullets.checkWorldBounds = true;
      bullets.outOfBoundsKill = true;
      
      //EXPLOOOOOOOSIONS!
      explosions = game.add.group();
      explosions.enableBody = true;
      explosions.physicsBodyType = Phaser.Physics.ARCADE;
      explosions.createMultiple(30, "rockExplode");
      explosions.setAll('anchor.x', 0.5);
      explosions.setAll('anchor.y', 0.5);
      explosions.forEach(function(explosion) {
        explosion.animations.add('explosion');
      });
    },
    
    fire: function() {      
      var bullet;
      if (game.time.now > this.nextFire && bullets.countDead() > 0) {
        this.nextFire = game.time.now + this.fireRate;
        bullet = bullets.getFirstDead();
		bullet.scale.setTo(1.5);
        
        if (player.scale.x == 0.8) { //Fire right
          bullet.reset(player.body.x - (-65), player.body.y - (-30));
		  game.physics.arcade.moveToPointer(bullet, 2500);
          pFire.x = player.x;
          pFire.y = player.y;
          pFire.scale.x = 0.8;
          pFire.animations.play("fire", 4, true, true);  
        } else { // Fire left
          bullet.reset(player.body.x - (-35), player.body.y - (-30));
		  game.physics.arcade.moveToPointer(bullet, 2500);
          pFire.x = player.x;
          pFire.y = player.y;
          pFire.scale.x = -0.8;
          pFire.animations.play("fire", 4, true, true);
        }
        bullet.lifespan = 200;
        var wFire = game.add.audio("wFire");
        wFire.volume = 0.1;
        wFire.play();
      }
    },
    
    explosions: function(bullets) { //Bullets explode on impact
      explosion = explosions.getFirstExists(false).reset(bullets.body.x,bullets.body.y + bullets.body.halfHeight).play('explosion',3,false,true);
    },
    
    nextLevelLoad: function() {  //Resets player and displays their final score and stops the script
      level_load.score += 1000;
      game.sound.stopAll();
      game.camera.reset(0, 0);
      if (state=="Hell") {
        game.state.start("City");
      } else if (state=="City") { //Right now the 2 levels loop
        game.state.start("Hell");
      }
    },
    
    endGame: function() { //Displays their final score and stops the script
      player.kill();
      scoreText = game.add.text(0, 0, "Score: " + level_load.score , {fontSize: "48px", fontType: "Comic Sans MS", fill: "#FFF" });
      levelComplete = game.add.text(150, 200, "Game Over", {fontSize: "80px", fontType: "Comic Sans MS", fill: "#FFF" });
      game.input.onDown.add(function unpause() {
		  game.paused = true;
		  game.sound.stopAll();

		  var reply = confirm("Would you like to try again?");
		  if (reply) {
			location.reload();
		  } else {
		   location.reload();
		   location.assign("https://www.google.com"); 
		  }
        }); // end pause func
    },
	
	gameCollisions: function() { //General collisions used by all levels
      game.physics.arcade.collide(demons, Foreground);
      game.physics.arcade.collide(player, Foreground);
      game.physics.arcade.collide(pDeath, Foreground);
      game.physics.arcade.collide(imps, Foreground);
      game.physics.arcade.collide(boss, Foreground);//fOREGROUND COLLISIONS
      game.physics.arcade.collide(boss, EnemyCollision);
      game.physics.arcade.collide(demons, EnemyCollision);
      game.physics.arcade.collide(demons, demons);
      game.physics.arcade.collide(imps, EnemyCollision);
      game.physics.arcade.collide(player, EnemyCollision);
      game.physics.arcade.collide(pDeath, EnemyCollision); //Collision with enemies
      //Enables bullets to hit and kill enemies
      game.physics.arcade.collide(demons, bullets, level_load.killCaco, null, this);
      game.physics.arcade.collide(imps, bullets, level_load.killImp, null, this);
      game.physics.arcade.overlap(boss, bullets, level_load.bossKill, null, this);
      //If these sprites collide pass it to their respective function
      game.physics.arcade.collide(player, demons, level_load.killPlayer, null, this);
      //game.physics.arcade.collide(player, imps, level_load.killStomp, null, this);
      game.physics.arcade.collide(player, imps, level_load.killPlayer, null, this);
      game.physics.arcade.collide(player, boss, level_load.killPlayer, null, this);
      game.physics.arcade.collide(player, EndDoor, level_load.nextLevelLoad, null, this);
	},
	
	killStomp: function(imp, player) {
	  if (imp.y < player.y - 10) {//Player above imp
		player.kill();//For some reason have to do player kill....
	  }
	},
    
    goFull: function() {
      if (!game.scale.isFullScreen) {
        game.scale.startFullScreen(false);
      }
    },

    finishPreLoad: function() { //Go to next state (Level 1)
      game.state.start("Hell");
    },
};