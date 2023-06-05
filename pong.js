document.addEventListener("DOMContentLoaded", function() {
let paddle1 = document.querySelector('#paddle1');
let paddle2 = document.querySelector('#paddle2');
let ball = document.querySelector('#ball');
let scoreboard1 = document.querySelector('#score1');
let scoreboard2 = document.querySelector('#score2');
let startScreen = document.querySelector('#start-screen');
let startButton = document.querySelector('#start-button');
let winningScoreInput = document.querySelector('#winning-score');

let boardHeight = document.querySelector('#pong-board').offsetHeight;
let paddleSpeed = 4;
let ballSpeed = 4;
let direction = { x: ballSpeed, y: ballSpeed };
let scores = { score1: 0, score2: 0 };
let winningScore = 10;
let isGameStarted = false;

let keys = {
    ArrowUp: false,
    ArrowDown: false
};

window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

startButton.addEventListener('click', () => {
    isGameStarted = true;
    winningScore = Number(winningScoreInput.value);
    startScreen.style.display = 'none';
    reset();
    updateScoreboard(); // immediately update the scoreboard
});


    function updatePaddles() {
        if (keys.ArrowUp && paddle1.offsetTop > 0) {
            paddle1.style.top = `${paddle1.offsetTop - paddleSpeed}px`;
        }
        if (keys.ArrowDown && paddle1.offsetTop < boardHeight - paddle1.offsetHeight) {
            paddle1.style.top = `${paddle1.offsetTop + paddleSpeed}px`;
        }
    
        // Decreased time reaction for paddle 2
        let ballFuturePosY = ball.offsetTop + (ball.offsetLeft - paddle2.offsetLeft) / direction.x * direction.y;
        let middleOfPaddle2 = paddle2.offsetTop + paddle2.offsetHeight / 3;
        let desiredPaddle2PosY = ballFuturePosY - paddle2.offsetHeight / 3;
    
        if (desiredPaddle2PosY < paddle2.offsetTop && paddle2.offsetTop > 0) {
            paddle2.style.top = `${paddle2.offsetTop - paddleSpeed}px`;
        }
        if (desiredPaddle2PosY > paddle2.offsetTop && paddle2.offsetTop < boardHeight - paddle2.offsetHeight) {
            paddle2.style.top = `${paddle2.offsetTop + paddleSpeed}px`;
        }
    }
    

function updateBall() {
    let newPosX = ball.offsetLeft + direction.x;
    let newPosY = ball.offsetTop + direction.y;

    if (newPosX <= 0) {
        scores.score2++;
        reset();
        return;
    }

    if (newPosX + ball.offsetWidth >= document.querySelector('#pong-board').offsetWidth) {
        scores.score1++;
        reset();
        return;
    }

    if ((newPosX <= paddle1.offsetWidth && newPosY + ball.offsetHeight >= paddle1.offsetTop && newPosY <= paddle1.offsetTop + paddle1.offsetHeight) ||
        (newPosX + ball.offsetWidth >= document.querySelector('#pong-board').offsetWidth - paddle2.offsetWidth && newPosY + ball.offsetHeight >= paddle2.offsetTop && newPosY <= paddle2.offsetTop + paddle2.offsetHeight)) {
        direction.x = -direction.x;
    } else if (newPosY <= 0 || newPosY + ball.offsetHeight >= boardHeight) {
        direction.y = -direction.y;
    }

    ball.style.left = `${newPosX}px`;
    ball.style.top = `${newPosY}px`;
}

function reset() {
    ball.style.left = `${document.querySelector('#pong-board').offsetWidth / 2}px`;
    ball.style.top = `${boardHeight / 2}px`;
    direction = { x: ballSpeed, y: ballSpeed };
    updateScoreboard();
}

function updateScoreboard() {
    scoreboard1.textContent = 'Score: ' + scores.score1;
    scoreboard2.textContent = 'Score: ' + scores.score2;

    if (scores.score1 >= winningScore || scores.score2 >= winningScore) {
        alert(`Game over! Player ${scores.score1 >= winningScore ? 1 : 2} wins!`);
        scores.score1 = 0;
        scores.score2 = 0;
        startScreen.style.display = 'block';
        isGameStarted = false;
    }
}



function gameLoop() {
    if (!isGameStarted) {
        requestAnimationFrame(gameLoop);
        return;
    }

    updatePaddles();
    updateBall();
    requestAnimationFrame(gameLoop);
    updateScoreboard(); // keep updating the scoreboard after every frame
}

updateScoreboard();
gameLoop();

});