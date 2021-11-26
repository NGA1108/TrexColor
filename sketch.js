var trex, trex_running, edges;
var groundImage, ground;
var pisoinvisible;
var cloudImg;
var cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var score;
var cactusGroup, cloudGroup;
var PLAY = 1,END = 0,GameState = PLAY;
var Trex_muere;
var gameOver, gameOverImage, restartImage, restart;
var jumpSound, dieSound, checkpointS;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  gameOverImage = loadImage("GameOver.png");
  restartImage = loadImage("restart.png");
  Trex_muere = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  
  cloudImg = loadImage("Cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  
  jumpSound=loadSound("jump.mp3.mp3");
  dieSound=loadSound("die.mp3.mp3");
  checkpointS=loadSound("checkPoint.mp3.mp3");
}

function setup() {
  createCanvas(600, 200);

  //crea el Trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("muereeee", Trex_muere);
  edges = createEdgeSprites();

  //añade escala y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("suelo", groundImage);
  ground.x = ground.width / 2;

  pisoinvisible = createSprite(200, 190, 400, 10);
  pisoinvisible.visible = false;


  score = 0;
  cactusGroup = new Group();
  cloudGroup = new Group();
  trex.setCollider("circle", 0, 0, 40);
  trex.debug = true;

  gameOver = createSprite(300, 100, 10, 10);
  gameOver.addImage(gameOverImage);
  restart = createSprite(300, 140, 10, 10);
  restart.addImage(restartImage);

  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  
}

function draw() {
 
  
  //establece un color de fondo
  background("white");
  

  if (GameState === PLAY) {
    ground.velocityX = -(2+score/100);

    
    if (score>0 && score%1000 === 0){
      checkpointS.play();
    }
    
    score = score + Math.round(frameCount / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (keyDown("space") && trex.y >= 161) {
      //para que solo de un salto
      trex.velocityY = -10;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.4; //GRAVEDAD!

    spawnClouds();
    spawnCactus();

    if (trex.isTouching(cactusGroup)) {
      GameState = END;
      score = 0;
      dieSound.play();
    }
    
    gameOver.visible = false;
    restart.visible = false;
  } else if (GameState === END) {
    ground.velocityX = 0;
    trex.velocityX = 0;
    trex.velocityY = 0;
    cactusGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    cactusGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.changeAnimation("muereeee", Trex_muere);

    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
       reset();
       }
  }

  text("score:   " + score, 450, 50);



  //ingresa la posición y del Trex
  
  //evita que el Trex caiga
  trex.collide(pisoinvisible); //para que el t-rex no flote
  drawSprites();

}

function spawnClouds() {
  if (frameCount % 90 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.velocityX = -4;
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImg);
    cloud.scale = 0.7;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 160;

    cloudGroup.add(cloud);
  }
}

function spawnCactus() {
  if (frameCount % 90 === 0) {
    var cactus = createSprite(600, 165, 10, 40);
    cactus.velocityX = -4;
    cactus.scale = 0.5;
    cactus.lifetime = 300;

    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1:
        cactus.addImage(cactus1);
        break;
      case 2:
        cactus.addImage(cactus2);
        break;
      case 3:
        cactus.addImage(cactus3);
        break;
      case 4:
        cactus.addImage(cactus4);
        break;
      case 5:
        cactus.addImage(cactus5);
        break;
      case 6:
        cactus.addImage(cactus6);
        break;
      default:
        break;
    }
    cactusGroup.add(cactus);
  }
}

function reset () {
  GameState = PLAY;
  cactusGroup.destroyEach();
  cloudGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running",trex_running);
  
  
}
