var directions = window.directions = {
    UP: "up",
    RIGHT: "right",
    DOWN: "down",
    LEFT: "left"
};

var grid;
var gridEl;
var gridMap;

var snake;
var food;

var currentDirection;
var snakeMovement;

var C = 8; //constant: number of columns
var R = 8; //constant: number of rows

var keyboardEventHandlerRegistered = false;

function initializeGame() {
    initializeGrid();
    initializeSnake();
    positionNewFood();
    drawSnake();
    if (!keyboardEventHandlerRegistered) {
        registerKeyboardEventHandler();
    }

    startSnake();
}

function startSnake() {
    //console.log('snake started');
    if (snakeMovement != null && typeof snakeMovement != 'undefined') {
        clearInterval(snakeMovement);
        //console.log('interval cleared. snakeMovement: ' + snakeMovement);
    }
    movePeriodically();
}
function restartSnake(direction) {
    if (snakeMovement != null && typeof snakeMovement != 'undefined') {
        clearInterval(snakeMovement);
    }
    var gameOver = moveSnake(direction);
    if (gameOver) {
        restartGame();
    }
    else {
        movePeriodically();
    }
}

function movePeriodically() {
    snakeMovement = setInterval(function () {
            var gameOver = moveSnake(currentDirection);
            if (gameOver) {
                restartGame();
            }
        },
        700
    )
}

function restartGame() {
    clearInterval(snakeMovement);
    alert('Game over');
    initializeGame();
}

function registerKeyboardEventHandler() {
    $(document).keyup(function (event) {
        //console.log('keyup!');
        window.ev = event;
        var direction;
        switch (event.keyCode) {
            case 37:
                direction = directions.LEFT;
                break;
            case 38:
                direction = directions.UP;
                break;
            case 39:
                direction = directions.RIGHT;
                break;
            case 40:
                direction = directions.DOWN;
                break;
            default:
                return;
        }
        if (isAllowedDirection(direction)) {
            console.log('allowed direction');
            restartSnake(direction);
        }
        else {
            //console.warn('NOT allowed direction');
        }
    });
    keyboardEventHandlerRegistered = true;

}

function isAllowedDirection(direction) {
    return !((((currentDirection == directions.LEFT) || (currentDirection == directions.RIGHT)) && ((direction == directions.RIGHT) || (direction == directions.LEFT)))
        || (((currentDirection == directions.UP) || (currentDirection == directions.DOWN)) && ((direction == directions.UP) || (direction == directions.DOWN)))
    )
}

function createNewRowElement() {
    return $('<div/>')
        .addClass('row');
}

function createNewCellElement() {
    return $('<div/>')
        .addClass('cell');
}

function initializeSnake() {
    snake = [{y: 0, x: C - 3}, {y: 0, x: C - 2}, {y: 0, x: C - 1}];
    for (var count = 0; count < snake.length; count++) {
        var snakeCell = snake[count];
        gridMap[snakeCell.y][snakeCell.x] = 1;
    }
    currentDirection = directions.LEFT;
}

function initializeGrid() {
    gridEl = $("#grid").empty();
    grid = [];
    gridMap = [];
    for (var rowCount = 0; rowCount < R; rowCount++) {
        var rowEl = createNewRowElement();
        gridEl.append(rowEl);
        var row = grid[rowCount] = [];
        var gridMapRow = gridMap[rowCount] = [];
        for (var cellCount = 0; cellCount < C; cellCount++) {
            var cellEl = createNewCellElement();
            rowEl.append(cellEl);
            row[cellCount] = cellEl;
            gridMapRow[cellCount] = 0;
        }
    }

}

function drawSnake() {
    //console.log('started drawSnake()');
    $("#grid .row .cell.active").removeClass('active food');
    for (var i = 0; i < snake.length; i++) {
        var snakeCell = snake[i];
        grid[snakeCell.y][snakeCell.x].addClass('active');
    }
    drawFood();
}

function drawFood() {
    grid[food.y][food.x].addClass('active food');
}

function moveSnake(direction) {
    //console.log('started moveSnake()');
    currentDirection = direction;
    var _snakeTail = snake[snake.length - 1];
    var snakeTail = {y: _snakeTail.y, x: _snakeTail.x};
    for (var i = snake.length - 1; i > 0; i--) {
        var currentCell = snake[i];
        var higherCell = snake[i - 1];
        currentCell.x = higherCell.x;
        currentCell.y = higherCell.y;
    }
    var snakeHead = snake[0];
    switch (direction) {
        case directions.UP:
            if (snakeHead.y == 0) {
                snakeHead.y = grid.length - 1;
            }
            else {
                snakeHead.y -= 1;
            }
            break;
        case directions.RIGHT:
            if (snakeHead.x == grid[0].length - 1) {
                snakeHead.x = 0;
            }
            else {
                snakeHead.x += 1;
            }
            break;
        case directions.DOWN:
            if (snakeHead.y == grid.length - 1) {
                snakeHead.y = 0;
            }
            else {
                snakeHead.y += 1;
            }
            break;
        case directions.LEFT:
            if (snakeHead.x == 0) {
                snakeHead.x = grid[0].length - 1;
            }
            else {
                snakeHead.x -= 1;
            }
            break;
    }
    for (var k = 1; k < snake.length; k++) {
        var snakeCell = snake[k];
        var gameOver = false;
        if (snakeHead.x == snakeCell.x && snakeHead.y == snakeCell.y) { // snake head hit body
            gameOver = true;
        }
        else if (snakeHead.x == snakeTail.x && snakeHead.y == snakeTail.y) { // snake head hit its tail
            gameOver = true;
        }
        if (gameOver) {
            return true;
        }
    }
    gridMap[snakeHead.y][snakeHead.x] = 1;

    if (snakeHead.y == food.y && snakeHead.x == food.x) {
        snake.push(snakeTail);
        positionNewFood();
    }
    else {
        gridMap[snakeTail.y][snakeTail.x] = 0
    }
    drawSnake();
    return false;
}

function rand(min, max, integer) {
    if (!integer) {
        return Math.random() * (max - min) + min;
    } else {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

function positionNewFood() {
    if (typeof food == 'undefined' || food == null) {
        food = {y: null, x: null};
    }
    var availableSpace = C * R - snake.length;
    console.log("availableSpace: " + availableSpace);
    var position = rand(0, availableSpace - 1, true);
    console.log("next food position: " + position);
    var count = 0;
    var log = "";

    /* <debugging code> */
    for (var n = 0; n < R; n++) {
        for (var m = 0; m < C; m++) {
            log = log + gridMap[n][m] + "\t";
        }
        log = log + '\n';
    }
    console.log(log);
    /* </debugging code> */

    for (var i = 0; i < R; i++) {
        for (var j = 0; j < C; j++) {
            if (gridMap[i][j] == 0) { // no snake cell in this grid cell
                if (count == position) {
                    food.y = i;
                    food.x = j;
                    console.log('food positioned: {y: ' + food.y + ', x: ' + food.x + '}');
                    return;
                }
                count++;
            }
        }
    }
}


initializeGame();
