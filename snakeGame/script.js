var blockSize = 25;
var total_row = 22; // row num
var total_col = 35; // column number
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var speedx = 0;
var speedy = 0;
var foodX = 0;
var foodY = 0;
var Score = 0;

var snakeBody = [];
var gameOver = false;


window.onload = function() {
    var startGame = document.getElementById("startGame");
    startGame.onclick = function() {
        alert('Game Started!')
    }
}

function Gamee() {
    board = document.getElementById("board");
    context = board.getContext("2d");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;

    Food();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000 / 12);
}

function score() {
    Score += 1;
    document.getElementById("Score").innerHTML = "Score: " + Score;
}


function update() {
    if (gameOver) {
        return;
    }

    // Game Background
    context.fillStyle = "blue";
    context.fillRect(0, 0, board.width, board.height);  

    // food
    context.fillStyle = "green";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push({x: snakeX, y: snakeY});
        Food();
        score();
    }

    // snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length > 0) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "white";
    snakeX += speedx * blockSize; //updating Snake position in X coordinate.
    snakeY += speedy * blockSize;  //updating Snake position in Y coordinate.
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0
        || snakeX > total_col * blockSize
        || snakeY < 0
        || snakeY > total_row * blockSize) {
         
        // Out of bound condition
        gameOver = true;
        alert("Game Over");
    }
 
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
             
            // Snake eats own body
            gameOver = true;
            alert("Game Over");
        }
    }
}
 
// Movement of the Snake - We are using addEventListener
function changeDirection(e) {
    if (e.code == "ArrowUp" && speedy != 1) {
        // If up arrow key pressed with this condition...
        // snake will not move in the opposite direction
        speedx = 0;
        speedy = -1;
    }
    else if (e.code == "ArrowDown" && speedy != -1) {
        //If down arrow key pressed
        speedx = 0;
        speedy = 1;
    }
    else if (e.code == "ArrowLeft" && speedx != 1) {
        //If left arrow key pressed
        speedx = -1;
        speedy = 0;
    }
    else if (e.code == "ArrowRight" && speedx != -1) {
        //If Right arrow key pressed
        speedx = 1;
        speedy = 0;
    }
}
 
// Randomly place food
function Food() {
    //x coordinate
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    //y coordinate
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

