var blockSize = 25;
var total_row = 30; // row num
var total_col = 30; // column number
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var speedx = 0;
var speedy = 0;
var foodX = 0;
var foodY = 0;

var snakeBody = [];
var gameOver = false;


function food() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}


window.onload = function() {
    board = document.getElementById("board");
    context = board.getContext("2d");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;

    food();
    document.addEventListener("keydown", keyPush);
    document.addEventListener("keyup", keyUp);
    document.addEventListener("keyright", keyPush);
    document.addEventListener("keyleft", keyPush);
    setInterval(game, 1000 / 15);
}

function update() {
    if (gameOver) {
        return;
    }

    // Game Background
    context.fillstyle = "black";
    context.fillRect(0, 0, board.width, board.height);  

    // food
    context.fillStyle = "green";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push({x: snakeX, y: snakeY});
        food();
    }

    // snake body
    context.fillstyle = "red";
    for (var i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i].x, snakeBody[i].y, blockSize, blockSize);
    }

    if (snakeBody.length > 0) {
        snakeBody.pop();
    }

    context.fillstyle = "red";
    snakeX += blockSize * speedx;
    snakeY += blockSize * speedy;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
}