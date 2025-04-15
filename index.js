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
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
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

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
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
    // Fill with gradient
    ctx.fillStyle = gradient;

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    
    // Show the restart button
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
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
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
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();