var grid = 16;
var count = 0;
var score = 0;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gameOver() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreText.textContent = "High Score: " + highScore;
  }

  // Reset game state
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;

  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;

  gameOverText.style.display = "block";
  setTimeout(() => gameOverText.style.display = "none", 2000);
  score = 0;
  scoreCounterText.textContent = "Score: " + score;
}

function loop() {
  requestAnimationFrame(loop);

  if (++count < 4) return;
  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // Solid Walls Mode: If the snake hits a wall, it's game over
  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    gameOver();
    return;
  }

  // Move the snake by adding the new head position at the front of the array
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Remove the last element of the array if it exceeds the length
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw apple
  context.fillStyle = '#ff0000'; // Apple color
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Draw snake
  context.fillStyle = '#ffab00'; // Snake color
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Check if the snake's head touches the apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      scoreCounterText.textContent = "Score: " + score;

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Check if the snake's head touches its body (self-collision)
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  });
}

// Control snake movement with keyboard
document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);
