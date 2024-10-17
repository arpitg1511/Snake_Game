var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameOverText = document.getElementById('game-over');
var scoreCounterText = document.getElementById('score-counter');
var highScoreText = document.getElementById('high-score');
var speedSlider = document.getElementById('speed-slider'); // Speed slider
var wallMode = document.getElementById('wall-mode'); // Wall mode selector

var grid = 16;
var count = 0;
var score = 0;
var highScore = localStorage.getItem('highScore') || 0;
highScoreText.textContent = "High Score: " + highScore;

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

  // Control speed based on the slider value
  var speed = parseInt(speedSlider.value);

  if (++count < speed) return;
  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // Handle wall collision based on selected mode
  if (wallMode.value === 'solid') {
    // Solid walls: End game if snake hits wall
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
      gameOver();
      return;
    }
  } else if (wallMode.value === 'unsolid') {
    // Unsolid walls: Snake wraps around the canvas
    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    if (snake.y < 0) {
      snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
    }
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = '#ff0000';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  context.fillStyle = '#0000ff';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      scoreCounterText.textContent = "Score: " + score;

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Check if the snake's head (index 0) touches its body (other cells)
    if (index === 0) {
      for (var i = 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          gameOver();
          return;
        }
      }
    }
  });
}

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
