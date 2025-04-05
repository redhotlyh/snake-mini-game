const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;
const GRID_COUNT = canvas.width / GRID_SIZE;

let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isPaused = true;
let isGameOver = false;

function generateFood() {
  return {
    x: Math.floor(Math.random() * GRID_COUNT),
    y: Math.floor(Math.random() * GRID_COUNT)
  };
}

function drawGame() {
  // 清空画布
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制食物
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x*GRID_SIZE, food.y*GRID_SIZE, GRID_SIZE-2, GRID_SIZE-2);

  // 绘制蛇
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
    ctx.fillRect(segment.x*GRID_SIZE, segment.y*GRID_SIZE, GRID_SIZE-2, GRID_SIZE-2);
  });
}

function updateGame() {
  direction = nextDirection;
  const head = {...snake[0]};

  switch(direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // 碰撞检测
  if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT || 
      snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // 吃到食物
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').textContent = score;
    food = generateFood();
  } else {
    snake.pop();
  }
}

function gameOver() {
  clearInterval(gameLoop);
  isPaused = true;
  isGameOver = true;
  if(score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
  }
  alert(`游戏结束！得分：${score}\n最高记录：${highScore}`);
  document.getElementById('startBtn').textContent = '重新开始';
}

// 键盘控制
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      if (direction !== 'down') nextDirection = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') nextDirection = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') nextDirection = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') nextDirection = 'right';
      break;
  }
});

// 游戏主循环
function startGame() {
  clearInterval(gameLoop);
  if (!isPaused) return;
  
  isPaused = false;
  gameLoop = setInterval(() => {
    updateGame();
    drawGame();
  }, 150);
}

// 开始按钮控制
// 确保只绑定一次事件监听
document.getElementById('startBtn').addEventListener('click', handleGameControl);

function handleGameControl() {
  if (isGameOver) {
    // 游戏结束后点击：重置游戏
    snake = [{x: 10, y: 10}];
    score = 0;
    food = generateFood();
    direction = 'right';
    nextDirection = 'right';
    isGameOver = false;
    startGame();
    document.getElementById('startBtn').textContent = '暂停游戏';
  } else if (isPaused) {
    // 暂停状态点击：继续游戏
    startGame();
    document.getElementById('startBtn').textContent = '暂停游戏';
  } else {
    // 运行状态点击：暂停游戏
    clearInterval(gameLoop);
    isPaused = true;
    document.getElementById('startBtn').textContent = '继续游戏';
  }
  document.getElementById('score').textContent = score;
}