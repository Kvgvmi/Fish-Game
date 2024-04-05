// Canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
//For animation loop so we can spawn a new bubble every 100 frames
let gameFrame = 0;
ctx.font = "40px Georgia";
let gameSpeed = 1;
let gameOver = false;

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();

//used to track the mouse position and whether it's clicked or not
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

//when the mouse button is pressed down on the canvas. It updates the mouse object with the current mouse position relative to the canvas (taking into account the canvas position on the page).
canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;//to get the position relative to the canvas
  mouse.y = event.y - canvasPosition.top;
});

// This event listener is triggered when the mouse button is released on the canvas. It sets mouse.click back to false to indicate that the mouse button is no longer clicked.
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

// Player
const playerLeft = new Image();// Create image object for player facing left
playerLeft.src = "./assets/images/fish-swim-left.png";// Set image source
const playerRight = new Image();// Create image object for player facing right
playerRight.src = "./assets/images/fish-swim-right.png";// Set image source


class Player {
  constructor() {
    this.x = canvas.width; // Initial x position
    this.y = canvas.height / 2; // Initial y position
    this.radius = 50;
    //rotate the player towards current mouse position
    this.angle = 0; // direct the Fish
    //to always face the direction it's swimming in
    this.frameX = 0; // Current frame X position for sprite
    this.frameY = 0; // Current frame Y position for sprite
    this.frame = 0; // sprite total
    this.spriteWidth = 498; // four columns
    this.spriteHeight = 327; // three lines
  }

  
  //to move the player towards the mouse
  update() {
    const dx = this.x - mouse.x; // dx = distance from x
    const dy = this.y - mouse.y; // dy = distance from y
    let theta = Math.atan2(dy, dx); // Calculate angle between player and mouse
    this.angle = theta;


    //if current mouse x position is not equal to current player's position 
    if (mouse.x != this.x) { 
      // Move player towards mouse horizontally
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {//madernach else if hena 7it bghinahum bjoj ikhedmo de9a we7da
      this.y -= dy / 20;// "20" to add animation or else the player will move fast to the mouse position 
    }


    //------------------------------??-------------------------------
    if (gameFrame % 5 == 0) { // Frame-based animation
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
  }


  
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.x >= mouse.x) {
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    ctx.restore();
  }
}

//the new keyword is a special cpmmand in javascript it will go up and class constructor 
//will create new blank player object and assign it properties based on class blueprint declared  
const player = new Player();



// Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = "./assets/images/bubble_pop_frame_01.png";

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;// Random x position
    this.y = canvas.height + 100;// Initial y position off-screen
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;// Random speed
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";//ila kant random number sgher or ysawi 0.5 thenit's sound1 o ila l3ekss sound 2
  }

  // Update bubble position
  update() {
    this.y -= this.speed;// Move bubble upwards
    this.dx = this.x - player.x;// Horizontal distance from player
    this.dy = this.y - player.y;// Vertical distance from player
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);// Calculate distance
  }

  // Draw bubble on canvas
  draw() {
    ctx.drawImage(
      bubbleImage,
      this.x - 65,
      this.y - 65,
      this.radius * 2.6,
      this.radius * 2.6
    );
  }
}

// Audio for bubble popping

const bubblePop1 = document.createElement("audio");
bubblePop1.src = "./assets/sounds/bubbles-single1.wav";
const bubblePop2 = document.createElement("audio");
bubblePop2.src = "./assets/sounds/bubbles-single2.wav";

//lita7akum
function handleBubbles() {
  if (gameFrame % 50 == 0) { //adding bubbles every 50 frames
    bubblesArray.push(new Bubble());
  }

  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    //to check if bubble has disappeared over the top edge and if so i remove it with splice 
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {//so bubbles won't disapear faster
      bubblesArray.splice(i, 1);
      i--;
    } else if (// masafa bin centre of the 2 object is less than cho3a3ayn mjmo3in bjoj 
      bubblesArray[i].distance < bubblesArray[i].radius + player.radius //check distance between player and bubble
    ) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == "sound1") {
          bubblePop1.play();
        } else {
          bubblePop2.play();
        }
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        i--;
      }
    }
  }

  for (let i = 0; i < bubblesArray.length; i++) {}
}

// Repeating backgrounds
const background = new Image();
background.src = "./assets/images/background1.png";

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

function handleBackground() {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) BG.x1 = BG.width;
  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) BG.x2 = BG.width;
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

// Enemies
const enemyImage = new Image();
enemyImage.src = "./assets/images/fish-enemy1.png";

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 60;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 418;
    this.spriteHeight = 397;
  }

  draw() {
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 60,
      this.y - 70,
      this.spriteWidth / 3,
      this.spriteHeight / 3
    );
  }

  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }

    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }

    // Collision with Player
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + player.radius) {
      handleGameOver();
    } 
  }
}

const enemy1 = new Enemy();
function handleEnemies() {
  enemy1.draw();
  enemy1.update();
}

function handleGameOver() {
  ctx.fillStyle = "white";
  ctx.fillText("Game Over! Score: " + score, 215, 230);
  gameOver = true;
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // to clear the entire canvas from old paint between every animation 
  handleBackground();
  handleBubbles();
  player.update();
  player.draw();
  handleEnemies();
  ctx.fillStyle = "black";
  ctx.fillText("score: " + score, 10, 35);
  gameFrame++;
  if (!gameOver) requestAnimationFrame(animate);
}

animate();

//when we resize browser window the mouse position is always correct
window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
