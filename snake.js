var boardSize = 60;
var headSnake = {type: 'head', direction: 'right', next: [29, 10], position: [30, 10]};
var snakeBoard = new Array(boardSize);
for (var i = 0; i < boardSize; i++) {
    snakeBoard[i] = new Array(boardSize);
}
var score = 0;
var length = 3;
// 0 - empty box, 1-bodySnake, 2-headSnake, 3-food;
var blockMoved = false;

function init() {
    createBoard();
    startPosition();
    putFood();
    updateView();
}

window.addEventListener('keydown', function (event) {
    if (blockMoved) {
        return;
    }
    blockMoved = true;
    switch (event.keyCode) {
        case 37: // Left
            // console.log('left');
            if (headSnake.direction === 'right' || headSnake.direction === 'left') {
                return;
            }
            headSnake.direction = 'left';
            break;
        case 38: // Up
            if (headSnake.direction === 'up' || headSnake.direction === 'down') {
                return;
            }
            headSnake.direction = 'up';
            break;
        case 39: // Right
            if (headSnake.direction === 'right' || headSnake.direction === 'left') {
                return;
            }
            headSnake.direction = 'right';
            break;
        case 40: // Down
            if (headSnake.direction === 'down' || headSnake.direction === 'up') {
                return;
            }
            headSnake.direction = 'down';
            break;
    }
});

function createBoard() {
    var board = document.getElementById('board');
    for (var i = 0; i < boardSize; i++) {
        var row = document.createElement('div');
        row.className = 'row';
        for (var j = 0; j < boardSize; j++) {
            var square = document.createElement('div');
            square.className = 'box';
            square.setAttribute('id', `r${i}c${j}`);
            row.appendChild(square);
        }
        board.appendChild(row);
    }
}

function startPosition() {
    snakeBoard[30][10] = headSnake;
    snakeBoard[29][10] = {type: 'body', next: [28, 10]};
    snakeBoard[28][10] = {type: 'body'};
}

function putFood() {
    var row = Math.floor(Math.random() * boardSize);
    var column = Math.floor(Math.random() * boardSize);
    if (!snakeBoard[row][column]) {
        snakeBoard[row][column] = {type: 'food'};
    } else {
        putFood();
    }
}

function updateView() {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            var box = document.getElementById(`r${i}c${j}`);
            switch (snakeBoard[i][j] && snakeBoard[i][j].type) {
                case 'body':
                    box.className = 'box body-snake';
                    break;
                case 'head':
                    box.className = 'box head-snake';
                    break;
                case 'food':
                    box.className = 'box food';
                    break;
                default:
                    box.className = 'box';
            }
        }
    }
    document.getElementById('score').innerText = score;
    document.getElementById('length').innerText = length;
}

function moveSnakeElement(position, moveTo) {
    var snakeElement = snakeBoard[position[0]][position[1]];
    var positionOfnextElement = snakeElement.next && [snakeElement.next[0], snakeElement.next[1]];
    snakeBoard[position[0]][position[1]] = null;
    snakeBoard[moveTo[0]][moveTo[1]] = snakeElement;
    if (positionOfnextElement) {
        snakeBoard[moveTo[0]][moveTo[1]].next = position;
        moveSnakeElement(positionOfnextElement, position);
    }
}

function moveSnake() {
    var position = [headSnake.position[0], headSnake.position[1]];
    var positionOfNextElement = [headSnake.next[0], headSnake.next[1]];
    var snakeAteFood = false;
    var isGameOver = false;
    var nextPosition;
    switch (headSnake.direction) {

        case 'right':
            nextPosition = [position[0], position[1] + 1];
            break;
        case
        'left'   :
            nextPosition = [position[0], position[1] - 1];
            break;
        case
        'up':
            nextPosition = [position[0] - 1, position[1]];
            break;
        case
        'down':
            nextPosition = [position[0] + 1, position[1]];
            break;
    }
    if (nextPosition[0] < 0 || nextPosition[0] >= boardSize || nextPosition[1] < 0 || nextPosition[1] >= boardSize) {
        isGameOver = true;
        clearInterval(intervalId);
        alert('Game over!');
        return;
    }
    if (snakeBoard[nextPosition[0]] [nextPosition[1]] && snakeBoard[nextPosition[0]][nextPosition[1]].type === 'food') {
        snakeAteFood = true;
    }
    if (snakeBoard[nextPosition[0]] [nextPosition[1]] && snakeBoard[nextPosition[0]][nextPosition[1]].type === 'body') {
        isGameOver = true;
        clearInterval(intervalId);
        alert('Game over!');
        return;
    }


    snakeBoard[nextPosition[0]][nextPosition[1]] = headSnake;
    headSnake.position = nextPosition;
    headSnake.next = position;

    if (snakeAteFood) {
        snakeBoard[position[0]][position[1]] = {type: 'body', next: positionOfNextElement};
        score += 1;
        length += 1
        console.log(score)
        putFood();
    }
    else {
        moveSnakeElement(positionOfNextElement, position);
    }
    updateView();
    blockMoved = false;
}

var intervalId = setInterval(moveSnake, 200);