/**
 * Imports the snake module from the './snake.js' file.
 * This module likely contains the implementation of the snake game logic and functionality.
 */
import { Snake } from "./snake.js";
/**
 * Gets the HTML canvas element with the ID "game" and assigns it to the `canvas` variable.
 * This canvas will be used to render the game's graphics.
 */
let canvas = document.getElementById("game");
/**
 * Gets the 2D rendering context of the HTML canvas element with the ID "game".
 * This context will be used to render the game's graphics on the canvas.
 */
let context = canvas.getContext("2d");

/**
 * Gets the HTML element with the class name "up" and assigns it to the `arrowUp` variable.
 * This element will be used to handle user input for the "up" direction.
 */
let arrowUp = document.getElementsByClassName("up")[0];
/**
 * Gets the HTML element with the class name "down" and assigns it to the `arrowDown` variable.
 * This element will be used to handle user input for the "down" direction.
 */
let arrowDown = document.getElementsByClassName("down")[0];
/**
 * Gets the HTML element with the class name "left" and assigns it to the `arrowLeft` variable.
 * This element will be used to handle user input for the "left" direction.
 */
let arrowLeft = document.getElementsByClassName("left")[0];
/**
 * Gets the HTML element with the class name "right" and assigns it to the `arrowRight` variable.
 * This element will be used to handle user input for the "right" direction.
 */
let arrowRight = document.getElementsByClassName("right")[0];

/**
 * Gets the HTML element with the class name "score" and assigns it to the `scoreSpan` variable.
 * This element will be used to display the player's current score.
 */
let scoreSpan = document.getElementsByClassName("score")[0];

/**
 * Represents the player's current score in the game.
 */
var score = 0;

/**
 * The size of each grid cell in the game, in pixels.
 */
let cellSize = 20;
/**
 * The size of each grid cell in the game, minus 1 pixel to create a border between cells.
 */
let cellInnerSize = cellSize - 1;
/**
 * The width of the game screen in pixels.
 */
let screenWidth = 600;
/**
 * The height of the game screen in pixels.
 */
let screenHeight = 800;

/**
 * The color of the snake's head.
 */
let snakeHeadColor = "lightgreen";
let snakeTailColor = "green";
/**
 * The color used to fill the game screen.
 */
let screenFillStyle = "green";
/**
 * The color of the grid cells in the game.
 */
let gridCellColor = "black";

/**
 * An array of the four cardinal direction strings: "up", "down", "left", and "right".
 * This array is used to represent the possible directions the snake can move in the game.
 */
let keys = ["up", "down", "left", "right"];
/**
 * Selects a random starting direction for the snake from the `keys` array.
 * This value is used to initialize the `lastKey` variable, which determines the initial direction of the snake.
 */
let randomStartDirection = parseInt(parseFloat(Math.random() * keys.length));
/**
 * Represents the last key that was pressed by the user, which determines the initial direction of the snake.
 * This value is randomly selected from the `keys` array at the start of the game.
 */
var lastKey = keys[randomStartDirection];

/**
 * Represents whether there is currently an active food item in the game.
 */
let activeFood = false;
/**
 * Represents the current food item in the game.
 */
let currentFood = {};

/**
 * The fixed amount that the snake's speed is decreased by for each increase in the player's score.
 */
let fixedSpeedAmount = 50;

// Use snake object as needed in game.js
/**
 * An object that defines the possible game states for the game.
 * @property {string} running - The game is currently running.
 * @property {string} paused - The game is currently paused.
 * @property {string} gameOver - The game is currently in a game over state.
 */
let gameStates = {
  running: "running",
  paused: "paused",
  gameOver: "gameOver",
};

let snake = new Snake({ startDirection: lastKey });

/**
 * Represents the current state of the game, which can be either "running", "paused", or "gameOver".
 */
var currentGameState = gameStates.paused;

/**
 * Highlights the key that was pressed on the game board.
 */
highlightKey();

/**
 * Initializes the game by setting up the canvas, drawing the game board, and setting up the controls for the player to control the snake.
 */
function setup() {
  setupCanvas();
  drawBoard();
  setupControls();
}

/**
 * Sets up the event listener for keyboard input, allowing the player to control the snake's movement.
 * The function listens for keydown events and updates the snake's direction accordingly, as long as the new direction
 * is not the opposite of the current direction.
 * The function also handles pausing and resuming the game when the Enter key is pressed, and starting a new game when the Escape key is pressed.
 */
function setupControls() {
  document.addEventListener("keydown", function (event) {
    let keyname = event.key.replace("Arrow", "").toLowerCase();
    if (keys.includes(keyname)) {
      if (keyname == "up" && snake.direction != "down") {
        lastKey = snake.direction;
        snake.direction = "up";
        runGame();
      } else if (keyname == "down" && snake.direction != "up") {
        lastKey = snake.direction;
        snake.direction = "down";
        runGame();
      } else if (keyname == "left" && snake.direction != "right") {
        lastKey = snake.direction;
        snake.direction = "left";
        runGame();
      } else if (keyname == "right" && snake.direction != "left") {
        lastKey = snake.direction;
        snake.direction = "right";
        runGame();
      }
      highlightKey();
    }
    if (keyname === "enter") {
      if (currentGameState == gameStates.running) {
        currentGameState = gameStates.paused;
      } else if (currentGameState == gameStates.paused) {
        currentGameState = gameStates.running;
      }
    }
    if (keyname === "escape") {
      gameOver();
    }
  });
}

/**
 * Sets up the canvas element with the specified width, height, and fill style.
 */
function setupCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  context.fillStyle = screenFillStyle;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Starts the game loop and sets the current game state to running.
 */
function runGame() {
  currentGameState = gameStates.running;
}

/**
 * Initializes the game state, including the snake, food, and game loop.
 * This function is called to start a new game.
 */
function start() {
  setup();
  initSnake();
  spawnFood();
  gameLoop();
}

/**
 * Initializes the snake's starting position and body.
 * The snake's head is placed at a random position on the game board, and the snake's body is placed based on the last direction the snake was moving.
 */
function initSnake() {
  let rows = canvas.height / cellSize;
  let cols = canvas.width / cellSize;
  let x = Math.floor(Math.random() * cols);
  let y = Math.floor(Math.random() * rows);
  //SNAKE HEAD PLACEMENT
  snake.x = x;
  snake.y = y;
  //SNAKE BODY PLACEMENT
  switch (lastKey) {
    case "up": {
      snake.tail.push({ x: x, y: snake.y + 1 });
      snake.tail.push({ x: x, y: snake.y + 2 });
      break;
    }
    case "down": {
      snake.tail.push({ x: x, y: snake.y - 1 });
      snake.tail.push({ x: x, y: snake.y - 2 });
      break;
    }
    case "left": {
      snake.tail.push({ x: snake.x + 1, y: y });
      snake.tail.push({ x: snake.x + 2, y: y });
      break;
    }
    case "right": {
      snake.tail.push({ x: snake.x - 1, y: y });
      snake.tail.push({ x: snake.x - 2, y: y });
      break;
    }
  }
  drawSnake();
}

/**
 * The main game loop that handles the game logic and rendering.
 * This function is responsible for:
 * - Clearing the canvas
 * - Redrawing the game board
 * - Spawning new food items (if the game is in the running state)
 * - Updating the snake's position and drawing it (if the game is in the running state)
 * - Drawing the active food item (if the game is not in the running state)
 * - Drawing the snake (if the game is not in the running state)
 * - Scheduling the next iteration of the game loop using setTimeout
 */
function gameLoop() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw the game board
  drawBoard();
  // Draw the snake
  drawSnake();
  if (currentGameState == gameStates.running) {
    spawnFood();
    updateSnake();
  } else {
    drawActiveFood();
  }
  setTimeout(gameLoop, snake.speed);
}

/**
 * Draws the currently active food item on the game board.
 * If there is an active food item (indicated by `activeFood` being true), this function will draw a red square
 * at the position of the current food item (`currentFood`).
 */
function drawActiveFood() {
  if (activeFood && currentFood) {
    context.fillStyle = "red";
    context.fillRect(
      currentFood.x * cellSize,
      currentFood.y * cellSize,
      cellInnerSize,
      cellInnerSize
    );
  }
}

/**
 * Spawns a new food item on the game board. If there is already an active food item, it will be redrawn.
 * Otherwise, a new random position is selected that is not occupied by the snake's tail, and a new food item is drawn at that position.
 */
function spawnFood() {
  if (activeFood) {
    drawActiveFood();
    return;
  }
  let rows = canvas.height / cellSize;
  let cols = canvas.width / cellSize;
  let x = Math.floor(Math.random() * cols);
  let y = Math.floor(Math.random() * rows);
  let cell = { x: x, y: y };
  if (snake.tail.includes(cell)) {
    spawnFood();
  } else {
    activeFood = true;
    context.fillStyle = "red";
    context.fillRect(x * cellSize, y * cellSize, cellInnerSize, cellInnerSize);
    currentFood = cell;
  }
}

/**
 * Draws the game board on the canvas. The board is a grid of cells, with each cell represented by a square.
 * The background of the board is filled with the `screenFillStyle` color, and the grid cells are drawn with the `gridCellColor`.
 */
function drawBoard() {
  context.fillStyle = screenFillStyle;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < canvas.height / cellSize; row++) {
    for (let col = 0; col < canvas.width / cellSize; col++) {
      context.fillStyle = gridCellColor;
      context.fillRect(
        col * cellSize,
        row * cellSize,
        cellInnerSize,
        cellInnerSize
      );
    }
  }
}

/**
 * Draws the snake on the canvas. The snake head is drawn as a red square, and the snake tail is drawn as a series of green squares.
 */
function drawSnake() {
  context.fillStyle = snakeHeadColor;
  context.fillRect(
    snake.x * cellSize,
    snake.y * cellSize,
    cellInnerSize,
    cellInnerSize
  );
  context.fillStyle = snakeTailColor;
  snake.tail.forEach((o) => {
    context.fillRect(
      o.x * cellSize,
      o.y * cellSize,
      cellInnerSize,
      cellInnerSize
    );
  });
}

/**
 * Updates the position of the snake based on its current direction, and checks if the snake has eaten the current food item.
 * Redraws the snake on the canvas.
 */
function updateSnake() {
  for (let i = snake.tail.length - 1; i >= 0; i--) {
    snake.tail[i].x = i === 0 ? snake.x : snake.tail[i - 1].x;
    snake.tail[i].y = i === 0 ? snake.y : snake.tail[i - 1].y;
  }
  switch (snake.direction) {
    case "up": {
      if (snake.y > 0) {
        snake.y -= 1;
      }
      break;
    }
    case "down": {
      if (snake.y < canvas.height / cellSize - 1) {
        snake.y += 1;
      }
      break;
    }
    case "left": {
      if (snake.x > 0) {
        snake.x -= 1;
      }
      break;
    }
    case "right": {
      if (snake.x < canvas.width / cellSize - 1) {
        snake.x += 1;
      }
      break;
    }
  }
  eatFood();
  drawSnake();
  detectCollision();
}

/**
 * Detects if the snake has collided with the game boundaries or its own body, and if so, triggers the game over state.
 */
function detectCollision() {
  if (snake.x == 0 || snake.x == canvas.width / cellSize) {
    gameOver();
  }
  if (snake.y == 0 || snake.y == canvas.height / cellSize) {
    gameOver();
  }
  for (let i = 0; i < snake.tail.length; i++) {
    if (snake.x == snake.tail[i].x && snake.y == snake.tail[i].y) {
      gameOver();
    }
  }
}

/**
 * Triggers the game over state, stops the game loop, and displays the game over screen.
 */
function gameOver() {
  currentGameState = gameStates.gameOver;
  clearInterval(gameLoopInterval);
  gameOverScreen.style.display = "block";
}

/**
 * Checks if the snake has collided with the current food item, and if so, updates the snake's length, clears the current food,
 * increases the game speed, and updates the score.
 */
function eatFood() {
  if (snake.x == currentFood.x && snake.y == currentFood.y) {
    const lastPiece = snake.tail[snake.tail.length - 1];
    snake.tail.push({ x: lastPiece.x, y: lastPiece.y });
    clearCurrentFood();
    updateSpeed();
    updateScore();
  }
}

/**
 * Increases the game score by 5 points and updates the score display.
 */
function updateScore() {
  score += 5;
  scoreSpan.innerText = score;
}

/**
 * Increases the snake's speed based on the current score.
 */
function updateSpeed() {
  var decreaseAmount = snake.speed * 0.1;
  snake.increaseSpeed({ decreaseAmount });
}

/**
 * Clears the current food item by setting the `activeFood` flag to `false` and
 * setting the `currentFood` variable to `null`.
 */
function clearCurrentFood() {
  activeFood = false;
  currentFood = null;
}

/**
 * Highlights the arrow element corresponding to the current snake direction.
 * This function is used to provide visual feedback to the user about the
 * snake's current direction.
 */
function highlightKey() {
  clearHighlights();
  switch (snake.direction) {
    case "up":
      arrowUp.classList.add("active");
      break;
    case "down":
      arrowDown.classList.add("active");
      break;
    case "left":
      arrowLeft.classList.add("active");
      break;
    case "right":
      arrowRight.classList.add("active");
      break;
  }
}

/**
 * Removes the "active" class from the arrow elements, effectively clearing any
 * highlighting that was applied to them.
 */
function clearHighlights() {
  arrowUp.classList.remove("active");
  arrowDown.classList.remove("active");
  arrowLeft.classList.remove("active");
  arrowRight.classList.remove("active");
}

/**
 * Starts the game loop.
 */
start();
