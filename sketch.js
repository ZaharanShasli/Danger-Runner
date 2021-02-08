var PLAY = 1;
var END = 0;
var gameState = PLAY;

var guy, guy_running, guy_collided;
var invisibleGround,backGround,backGroundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score = 0;
var life = 3
var coinSound

var gameOver, restart;


function preload(){
 guy_running = loadAnimation("Run0.png","Run1.png","Run2.png","Run3.png","Run4.png","Run5.png","Run6.png","Run7.png","Run8.png","Run9.png");
  
  guy_collided = loadImage("Dead9.png")
  
  coinImage = loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png","coin5.png","coin6.png");
  
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  backGroundImage = loadImage("bg19.png")
  
  coinSound = loadSound("coin.wav")
}

function setup() {
  createCanvas(1000,500);
  
   backGround = createSprite(0,0,1000,500)
  backGround.addImage("backGround",backGroundImage);
  backGround.scale = 2.0;
  backGround.x = backGround.width/2;
  backGround.velocityX = -8;
  
  guy = createSprite(80,380,20,50);
  guy.addAnimation("running", guy_running);
  guy.addAnimation("collided", guy_collided);
  guy.scale = 0.3;
  
  invisibleGround = createSprite(0,380,1000,10);
  invisibleGround.x = invisibleGround.width /2;
  invisibleGround.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(500,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(500,250);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.0;
  restart.scale = 1.0;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  guy.setCollider("circle",0,0,230);
  guy.debug = false
  
  score = 0;
}

function draw() {
  
   if (backGround.x <0) {
  backGround.x = backGround.width / 2;
}
  
  
  drawSprites();
  
  textSize(30);
  fill("black");
  text("Score: "+ score, 500,40);
text("life: "+ life , 500,70);
  if (gameState === PLAY){
   
    if(score >= 0){
      invisibleGround.velocityX = -6;
    }else{
      invisibleGround.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && guy.y >= 285||touches.length > 0 && guy.y  >= height-285) {
      guy.velocityY = -19;
      touches = [];
    }
  
    guy.velocityY = guy.velocityY + 0.8
  
    if (invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
  
    guy.collide(invisibleGround);
    invisibleGround.visible = false;
    
    if(coinGroup.isTouching(guy)){
       score = score+1
       coinGroup[0].destroy()
      coinSound.play()
       }
    
    spawnCoin();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(guy)){
        gameState = END;
     life = life-1
     guy.changeAnimation("collided",guy_collided); 
    }  
    
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    
        
    
    invisibleGround.velocityX = 0;
    guy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    backGround.velocityX = 0;
    
    guy.scale = 0.3;
    
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    
    if(mousePressedOver(restart)||touches.length>0) {
      if(life>0){
        reset();
      }
      touches = [];
}
}
}

function spawnCoin() {
  if (frameCount % 100 === 0) {
    var coin = createSprite(1000,200,40,10);
    coin.y = Math.round(random(220,170));
    coin.addAnimation("spinning",coinImage);
    coin.scale = 0.5;
    coin.velocityX = -3;
    
    coin.lifetime = 400;

    coin.depth = guy.depth;
    guy.depth = guy.depth + 1;
    
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(1000,340,10,40);    

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
             
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  backGround.velocityX = -8
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  guy.changeAnimation("running",guy_running);
  guy.scale =0.3;
  
}