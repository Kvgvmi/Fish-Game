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

    