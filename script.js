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

  