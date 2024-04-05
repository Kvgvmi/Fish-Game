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
  const playerLeft = new Image();
  playerLeft.src = "./assets/images/fish-swim-left.png";
  const playerRight = new Image();
  playerRight.src = "./assets/images/fish-swim-right.png";
  
  class Player {
    constructor() {
      this.x = canvas.width; // x inicial
      this.y = canvas.height / 2; // y inicial
      this.radius = 50;
      //rotate the player towards current mouse position
      this.angle = 0; // direct the Fish
      //to always face the direction it's swimming in
      this.frameX = 0; // sprite x
      this.frameY = 0; // sprite y
      this.frame = 0; // sprite total
      this.spriteWidth = 498; // four columns
      this.spriteHeight = 327; // three lines
    }

    //to move the player towards the mouse
  update() {
    const dx = this.x - mouse.x; // dx = distance from x
    const dy = this.y - mouse.y; // dy = distance from y
    let theta = Math.atan2(dy, dx);
    this.angle = theta;


    //if current mouse x position is not equal to current player's position 
    if (mouse.x != this.x) { 
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {//madernach else if hena 7it bghinahum bjoj ikhedmo de9a we7da
      this.y -= dy / 20;// "20" to add animation or else the player will move fast to the mouse position 
    }


    //------------------------------??-------------------------------
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
  }

  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);

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
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";//ila kant random number sgher or ysawi 0.5 thenit's sound1 o ila l3ekss sound 2
  }


  // Method which will just move bubbles up
  update() {
    this.y -= this.speed;
    this.dx = this.x - player.x;// dx distance on the horizontal x-axis will be diffrence between the bubble minus player's current horizontal x position  
    this.dy = this.y - player.y;
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  draw() {
    // ctx.fillStyle = "blue";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();
    ctx.drawImage(
      bubbleImage,
      this.x - 65,
      this.y - 65,
      this.radius * 2.6,
      this.radius * 2.6
    );
  }
}

const bubblePop1 = document.createElement("audio");
bubblePop1.src = "./assets/sounds/bubbles-single1.wav";
const bubblePop2 = document.createElement("audio");
bubblePop2.src = "./assets/sounds/bubbles-single2.wav";

//lita7akum
function handleBubbles() {
  if (gameFrame % 50 == 0) { //adding bubbles every 50 frames
    bubblesArray.push(new Bubble());
  }

  