function Snake(snakeLength, snakeX, snakeY, direction, snakeColor, snakeName) {
	this.snakeLength = snakeLength;
	this.snakeX = snakeX;
	this.snakeY = snakeY;
	this.direction = direction;
	this.previousDir = [];
	this.previousPos = [];
	this.snakeColor = snakeColor;
	this.snakeName = snakeName;
	this.score = 0;
}

//-  πππππππππππ CANVAS ASSIGNMENT πππππππππππ

var c = document.getElementById("game");
var ctx = c.getContext("2d");

//-  πππππππππππ ENVIROMENT VARIABLE πππππππππππ

var fruitX;
var fruitY;
var eat = true;
var intervalArr = [];
var velocity = 5;
var fps = 15;
var gameOver;

//-  πππππππππππ PLAYER STARTING VARIABLE πππππππππππ

var player = new Snake(
	3,
	c.offsetWidth / 2,
	c.offsetHeight / 2,
	"right",
	"#8eb9ff",
	"player"
);
var ai = new Snake(
	3,
	c.offsetWidth / 2,
	c.offsetHeight / 2,
	"left",
	"#f27657",
	"ai"
);

//-  πππππππππππ CLEAR CANVAS πππππππππππ

function nextFrame() {
	ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
}

//-  πππππππππππ DRAW SNAKE πππππππππππ

function drawSnake(snake) {
	ctx.fillStyle = "#000000";
	paintPixel(snake.snakeX, snake.snakeY);

	snake.previousPos.unshift({ x: snake.snakeX, y: snake.snakeY });
	snake.previousDir.unshift(snake.direction);

	for (var i = 1; i < snake.snakeLength; i++) {
		if (snake.previousPos[i]) {
			paintPixel(
				snake.previousPos[i].x,
				snake.previousPos[i].y,
				snake.snakeColor
			);
		}
	}

	//-  πππππππππππ UPDATE SNAKE POSITION BY DIRECTION πππππππππππ

	switch (snake.direction) {
		case "left":
			snake.snakeX -= velocity;
			break;

		case "right":
			snake.snakeX += velocity;
			break;

		case "up":
			snake.snakeY -= velocity;
			break;

		case "down":
			snake.snakeY += velocity;
			break;
	}
}

//-  πππππππππππ DRAW FRUIT πππππππππππ

function drawFruit() {
	if (eat) {
		fruitX = Math.floor(Math.random() * c.offsetWidth - 5 )+ 5;
		fruitY = Math.floor(Math.random() * c.offsetHeight - 5 )+ 5;
		eat = false;

		paintPixel(fruitX, fruitY, "#db0011");
	}
	paintPixel(fruitX, fruitY, "#db0011");
}

//-  πππππππππππ DETECT COLLIDE πππππππππππ

function detectCollide(snakeX, snakeY, x, y, radius) {
	var differentX = x - snakeX;
	var differentY = y - snakeY;
	if (differentX <= radius && differentX >= -radius) {
		if (differentY <= radius && differentY >= -radius) {
			return true;
			// snakeLength += 5 ;
			// eat = true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

//-  πππππππππππ KEYDOWN HANDLER πππππππππππ

$(window).on("keydown", function(e) {
	switch (e.keyCode) {
		case 37:
			if (player.direction !== "right") {
				player.direction = "left";
			}
			break;

		case 38:
			if (player.direction !== "down") {
				player.direction = "up";
			}
			break;

		case 39:
			if (player.direction !== "left") {
				player.direction = "right";
			}
			break;

		case 40:
			if (player.direction !== "up") {
				player.direction = "down";
			}
			break;
	}
});

//-  πππππππππππ PAINT PIXEL πππππππππππ

function paintPixel(x, y, color) {
	if (color) {
		ctx.fillStyle = color;
	} else {
		ctx.fillStyle = "#000000";
	}
	ctx.fillRect(x, y, 5, 5);
}

//-  πππππππππππ GAME LOSE CHECKING πππππππππππ

function gameLoseCheck(snake) {
	if (
		snake.snakeX >= c.offsetWidth ||
		snake.snakeX < 0 ||
		snake.snakeY >= c.offsetHeight ||
		snake.snakeY < 0
	) {
		gameOver = "Pc Wins";
		updateScore();
		stop();
	}
}

//-  πππππππππππ GAME OVER BEHAVIOUR πππππππππππ

function stop() {
	for (var i in intervalArr) {
		clearInterval(intervalArr[i]);
	}
}

//-  πππππππππππ EAT CHECKING πππππππππππ

function eatCheck(snake) {
	if (detectCollide(snake.snakeX, snake.snakeY, fruitX, fruitY, 5)) {
		snake.snakeLength += 5;
		snake.score++;
		eat = true;
	}
}

//-  πππππππππππ SELF COLLISION DETECTION πππππππππππ

function collideCheck(snake, crashSnake) {
	for (var i = 0; i < crashSnake.snakeLength; i++) {
		if (crashSnake.previousPos[i]) {
			if (
				detectCollide(
					snake.snakeX,
					snake.snakeY,
					crashSnake.previousPos[i].x,
					crashSnake.previousPos[i].y,
					2
				)
			) {
				gameOver = snake.snakeName + " Is DEFEATED";
				updateScore();
				stop();
			}
		}
	}
}

//-  πππππππππππ CLICK EVENT HANDLER πππππππππππ

function applyKey(el, keyCode) {
	var e = jQuery.Event("keydown");
	e.keyCode = keyCode;
	el.click(function() {
		el.trigger(e);
	});
}

applyKey($("#left"), 37);
applyKey($("#up"), 38);
applyKey($("#right"), 39);
applyKey($("#down"), 40);

//-  πππππππππππ AI BEHAVIOUR πππππππππππ

function AiHandler(snake) {
	var possibleMove = [];
	var differentX = fruitX - snake.snakeX;
	var differentY = fruitY - snake.snakeY;

	if (differentX > 0 && snake.previousDir[0] !== "left") {
		possibleMove.push("right");
	} else if (snake.previousDir[0] !== "right") {
		possibleMove.push("left");
	}

	if (differentY > 0 && snake.previousDir[0] !== "up") {
		possibleMove.push("down");
	} else if (snake.previousDir[0] !== "down") {
		possibleMove.push("up");
	}

	possibleMove = possibleMoveFilter(snake, possibleMove);

	//- LAYER TWO = IF ALL POSSBLE MOVE TO FOOD IS NEGATED

	if (possibleMove.length == 0) {
		possibleMove.unshift("up");
		possibleMove.unshift("down");
		possibleMove.unshift("left");
		possibleMove.unshift("right");

		possibleMove = possibleMoveFilter(snake, possibleMove);
	}

	var random = Math.floor(Math.random() * possibleMove.length);
	snake.direction = possibleMove[random];
}

function possibleMoveFilter(snake, moveArr) {
	var currentX = snake.snakeX;
	var currentY = snake.snakeY;
	var newArr = [];

	moveArr.forEach(function(data) {
		var validation = 0;
		var count = 0;

		if (data == "left" && snake.direction !== "right") {
			if (currentX - velocity > 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX - velocity,
								currentY,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				for (var i = 0; i < player.snakeLength; i++) {
					if (player.previousPos[i]) {
						if (
							detectCollide(
								currentX - velocity,
								currentY,
								player.previousPos[i].x,
								player.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}

		if (data == "right" && snake.direction !== "left") {
			if (currentX + velocity < c.offsetWidth - 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX + velocity,
								currentY,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				for (var i = 0; i < player.snakeLength; i++) {
					if (player.previousPos[i]) {
						if (
							detectCollide(
								currentX + velocity,
								currentY,
								player.previousPos[i].x,
								player.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}

		if (data == "up" && snake.direction !== "down") {
			if (currentY - velocity > 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX,
								currentY - velocity,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				for (var i = 0; i < player.snakeLength; i++) {
					if (player.previousPos[i]) {
						if (
							detectCollide(
								currentX,
								currentY - velocity,
								player.previousPos[i].x,
								player.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}

		if (data == "down" && snake.direction !== "up") {
			if (currentY + velocity < c.offsetHeight - 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX,
								currentY + velocity,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				for (var i = 0; i < player.snakeLength; i++) {
					if (player.previousPos[i]) {
						if (
							detectCollide(
								currentX,
								currentY + velocity,
								player.previousPos[i].x,
								player.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}
		if (validation) {
			newArr.unshift(data);
		}
	});

	return newArr;
}

function updateScore() {
	if (gameOver) {
		$(".scoreboard").html(gameOver);
	} else {
		var scoreText = "Player : " + player.score + "</br>PC : " + ai.score;
		$(".scoreboard").html(scoreText);
	}
}

//-  πππππππππππ MERGE EVERYTHING TOGETHER πππππππππππ
function run() {
	intervalArr.push(
		setInterval(function() {
			nextFrame();
			updateScore();

			drawSnake(player);

			AiHandler(ai);
			drawSnake(ai);

			drawFruit();

			eatCheck(player);
			eatCheck(ai);

			collideCheck(player, player);
			collideCheck(player, ai);

			collideCheck(ai, ai);
			collideCheck(ai, player);

			gameLoseCheck(player);

			// gameLoseCheck(player);
		}, 1000 / fps)
	);
}

run();

$("#reset").on("click", function() {


	player = new Snake(
		3,
		c.offsetWidth / 2,
		c.offsetHeight / 2,
		"right",
		"#8eb9ff",
		"player"
	);
	ai = new Snake(
		3,
		c.offsetWidth / 2,
		c.offsetHeight / 2,
		"left",
		"#f27657",
		"ai"
	);

	gameOver = false;
	run();
});
