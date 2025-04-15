let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");  
// draw on the screen to get the context, ask canvas  to get the 2d context

// snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Initial game state
const initialState = {
  speed: 7,
  tileCount: 20,
  tileSize: canvas.width / 20 - 2,
  headX: 10,
  headY: 10,
  snakeParts: [],
  tailLength: 2,
  appleX: 5,
  appleY: 5,
  inputsXVelocity: 0,
  inputsYVelocity: 0,
  xVelocity: 0,
  yVelocity: 0,
  score: 0
};

// Current game state
let speed = initialState.speed;
let tileCount = initialState.tileCount;
let tileSize = initialState.tileSize;
let headX = initialState.headX;
let headY = initialState.headY;
let snakeParts = initialState.snakeParts;
let tailLength = initialState.tailLength;
let appleX = initialState.appleX;
let appleY = initialState.appleY;
let inputsXVelocity = initialState.inputsXVelocity;
let inputsYVelocity = initialState.inputsYVelocity;
let xVelocity = initialState.xVelocity;
let yVelocity = initialState.yVelocity;
let score = initialState.score;

let gulpSound = new Audio("gulp.mp3");

// Add restart functionality
function restartGame() {
  // Hide the restart button
  document.getElementById('restartButton').style.display = 'none';
  
  // Reset all game variables to initial state
  speed = initialState.speed;
  headX = initialState.headX;
  headY = initialState.headY;
  snakeParts = [];
  tailLength = initialState.tailLength;
  appleX = initialState.appleX;
  appleY = initialState.appleY;
  inputsXVelocity = initialState.inputsXVelocity;
  inputsYVelocity = initialState.inputsYVelocity;
  xVelocity = initialState.xVelocity;
  yVelocity = initialState.yVelocity;
  score = initialState.score;
  
  // Clear the screen
  clearScreen();
  
  // Restart the game loop
  drawGame();
}

// Add event listener for restart button
document.getElementById('restartButton').addEventListener('click', restartGame);

//game loop
function drawGame() {
  // Update velocities first
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  // Update snake position
  changeSnakePosition();

  // Check for collisions after position update
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  // Only check for collision with parts that are behind the head's movement direction
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    // Skip checking if the part is in front of the head based on movement direction
    if (xVelocity > 0 && part.x < headX) continue; // Moving right
    if (xVelocity < 0 && part.x > headX) continue; // Moving left
    if (yVelocity > 0 && part.y < headY) continue; // Moving down
    if (yVelocity < 0 && part.y > headY) continue; // Moving up
    
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", " magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    
    const restartButton = document.getElementById('restartButton');
    restartButton.style.display = 'block';
    restartButton.style.top = (canvas.height / 2 + 40) + 'px';
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function drawBackground() {
    for (let row = 0; row < tileCount; row++) {
        for (let col = 0; col < tileCount; col++) {
            // Use only the lighter sky blue color
            ctx.fillStyle = '#87CEEB'; // Sky blue
            
            // Draw the tile
            ctx.fillRect(col * tileCount, row * tileCount, tileSize, tileSize);
            
            // Add grid lines in the same color
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 1;
            ctx.strokeRect(col * tileCount, row * tileCount, tileSize, tileSize);
        }
    }
}

function clearScreen() {
    // Instead of filling with black, draw the background tiles
    drawBackground();
}

function drawSnake() {
  // Draw the snake body
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillStyle = "#27ae60"; // Body color
    ctx.beginPath();
    ctx.roundRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize, 5);
    ctx.fill();
  }

  // Draw the head
  ctx.fillStyle = "#2ecc71"; // Head color
  ctx.beginPath();
  ctx.roundRect(headX * tileCount, headY * tileCount, tileSize, tileSize, [15, 15, 0, 15]);
  ctx.fill();
}

function changeSnakePosition() {
  // Store the previous head position
  let prevHeadX = headX;
  let prevHeadY = headY;

  // Update head position
  headX = headX + xVelocity;
  headY = headY + yVelocity;

  // Update snake parts
  if (snakeParts.length >= tailLength) {
    snakeParts.pop();
  }
  snakeParts.unshift(new SnakePart(prevHeadX, prevHeadY));
}

function drawApple() {
  // Draw the apple body
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(
    appleX * tileCount + tileSize/2,
    appleY * tileCount + tileSize/2,
    tileSize/2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw the apple stem
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(
    appleX * tileCount + tileSize/2 - 1.5,
    appleY * tileCount - 2,
    3,
    8
  );

  // Draw the apple leaf
  ctx.beginPath();
  ctx.arc(
    appleX * tileCount + tileSize/2 - 2,
    appleY * tileCount - 4,
    2.5,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    // Prevent turning up if moving down
    if (inputsYVelocity == 1) return;
    // Check if the next position would collide with the body
    if (snakeParts.length > 0 && snakeParts[0].x === headX && snakeParts[0].y === headY - 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    // Prevent turning down if moving up
    if (inputsYVelocity == -1) return;
    // Check if the next position would collide with the body
    if (snakeParts.length > 0 && snakeParts[0].x === headX && snakeParts[0].y === headY + 1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    // Prevent turning left if moving right
    if (inputsXVelocity == 1) return;
    // Check if the next position would collide with the body
    if (snakeParts.length > 0 && snakeParts[0].x === headX - 1 && snakeParts[0].y === headY) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    // Prevent turning right if moving left
    if (inputsXVelocity == -1) return;
    // Check if the next position would collide with the body
    if (snakeParts.length > 0 && snakeParts[0].x === headX + 1 && snakeParts[0].y === headY) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();