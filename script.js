// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 6;
const BALL_SIZE = 12;
const BALL_SPEED = 5;
const AI_SPEED = 4.5;

// Game Elements
const gameBoard = document.getElementById('gameBoard');
const playerPaddle = document.getElementById('playerPaddle');
const computerPaddle = document.getElementById('computerPaddle');
const ball = document.getElementById('ball');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');

// Game State
let playerScore = 0;
let computerScore = 0;
let gameRunning = true;

// Paddle positions
let playerY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let computerY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball properties
let ballX = GAME_WIDTH / 2;
let ballY = GAME_HEIGHT / 2;
let ballSpeedX = BALL_SPEED;
let ballSpeedY = BALL_SPEED * 0.5;

// Input tracking
let playerMovement = 0;
const keys = {};

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'ArrowUp') playerMovement = -PADDLE_SPEED;
    if (e.key === 'ArrowDown') playerMovement = PADDLE_SPEED;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === 'ArrowUp' && keys['ArrowDown']) playerMovement = PADDLE_SPEED;
    else if (e.key === 'ArrowDown' && keys['ArrowUp']) playerMovement = -PADDLE_SPEED;
    else playerMovement = 0;
});

// Mouse control
document.addEventListener('mousemove', (e) => {
    const rect = gameBoard.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const paddleCenterY = playerY + PADDLE_HEIGHT / 2;
    
    if (mouseY < paddleCenterY - 5) {
        playerMovement = -PADDLE_SPEED;
    } else if (mouseY > paddleCenterY + 5) {
        playerMovement = PADDLE_SPEED;
    } else {
        playerMovement = 0;
    }
});

// Update paddle position
function updatePlayerPaddle() {
    playerY += playerMovement;
    
    // Collision detection with walls
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > GAME_HEIGHT) playerY = GAME_HEIGHT - PADDLE_HEIGHT;
    
    playerPaddle.style.top = playerY + 'px';
}

// AI (Computer) paddle movement
function updateComputerPaddle() {
    const computerCenter = computerY + PADDLE_HEIGHT / 2;
    const ballCenter = ballY;
    
    // AI follows the ball with slight randomness for playability
    if (ballCenter < computerCenter - 5) {
        computerY -= AI_SPEED;
    } else if (ballCenter > computerCenter + 5) {
        computerY += AI_SPEED;
    }
    
    // Collision detection with walls
    if (computerY < 0) computerY = 0;
    if (computerY + PADDLE_HEIGHT > GAME_HEIGHT) computerY = GAME_HEIGHT - PADDLE_HEIGHT;
    
    computerPaddle.style.top = computerY + 'px';
}

// Update ball position
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Top and bottom wall collision
    if (ballY - BALL_SIZE / 2 < 0 || ballY + BALL_SIZE / 2 > GAME_HEIGHT) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(BALL_SIZE / 2, Math.min(GAME_HEIGHT - BALL_SIZE / 2, ballY));
    }
    
    // Player paddle collision
    if (
        ballX - BALL_SIZE / 2 < PADDLE_WIDTH + 10 &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        ballX = PADDLE_WIDTH + BALL_SIZE / 2 + 10;
        
        // Add angle based on paddle hit location
        const hitPos = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * BALL_SPEED;
    }
    
    // Computer paddle collision
    if (
        ballX + BALL_SIZE / 2 > GAME_WIDTH - PADDLE_WIDTH - 10 &&
        ballY > computerY &&
        ballY < computerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        ballX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2 - 10;
        
        // Add angle based on paddle hit location
        const hitPos = (ballY - (computerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * BALL_SPEED;
    }
    
    // Limit ball speed
    const maxSpeed = 8;
    if (Math.abs(ballSpeedY) > maxSpeed) {
        ballSpeedY = maxSpeed * Math.sign(ballSpeedY);
    }
    
    // Scoring
    if (ballX < 0) {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        resetBall();
    }
    if (ballX > GAME_WIDTH) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetBall();
    }
    
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Reset ball to center
function resetBall() {
    ballX = GAME_WIDTH / 2;
    ballY = GAME_HEIGHT / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    ballSpeedY = (Math.random() - 0.5) * BALL_SPEED;
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game
gameLoop();