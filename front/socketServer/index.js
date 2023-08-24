'use strict';

var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new nodeStatic.Server();
var app = http
  .createServer(function (req, res) {
    fileServer.serve(req, res);
  })
  .listen(8080);

// main socket
var io = socketIO(app);
io.sockets.on('connection', function (socket) {
  // chat socket
  socket.on('client', (clientMessage) => {
    console.log(socket.id + ' send Message');
    const message = {
      socketId: socket.id,
      message: socket.id.slice(0, 5) + ': ' + clientMessage,
    };
    io.emit('server', message);
  });

  // match socket
  // 매칭 등록은 하지 않음
  // . . .
});

// game socket
var gameServer = http
  .createServer(function (req, res) {
    fileServer.serve(req, res);
  })
  .listen(8081);

var gameIo = socketIO(gameServer);
var playerCount = 0;
var loopGameIntervalID;
gameIo.sockets.on('connection', function (socket) {
  function updateInfoGameStatus(str) {
    var data = {
      status: str,
    };
    socket.emit('infoGame', data);
  }

  // game logic
  function startLoopObject() {
    // loopGameIntervalID setting setTimeout ojbect
    GameBoard(socket);
  }

  // 방장(player1 ready 버튼 누를 떄)
  socket.on('readyGame', () => {
    // updateInfoGameStatus('standby');
  });

  // 플레이어들이 3초 카운트가 끝나고 요청을 보냄
  socket.on('startGame', () => {
    // increase player count
    playerCount++;
    console.log('enter player');
    // 두 플레이어가 준비됨
    if (playerCount == 2) {
      startLoopObject();
      playerCount = 0;
    }
  });

  socket.on('updatePaddle', (res) => {
    // updatePaddle(socket, res.paddle);
    console.log('paddle move event ', res);
    console.log(paddle1, paddle2);
    switch (res.paddle) {
      case 'paddle1Up':
        if (paddle1.y > 0) {
          paddle1.y -= paddleSpeed;
        }
        break;
      case 'paddle1Down':
        console.log('in');
        if (paddle1.y < gameHeight - paddle1.height) {
          paddle1.y += paddleSpeed;
        }
        break;
      case 'paddle2Up':
        if (paddle2.y > 0) {
          paddle2.y -= paddleSpeed;
        }
        break;
      case 'paddle2Down':
        if (paddle2.y < gameHeight - paddle2.height) {
          paddle2.y += paddleSpeed;
        }
        break;
    }
  });

  // if socket disconnect end loop
  socket.on('disconnect', () => {
    clearInterval(loopGameIntervalID);
    console.log('disconnected');
  });
});

let gameWidth;
let gameHeight;
let ballColor;
let ballRadius;
let paddleSpeed;
let ballSpeed;
let ballBorderColor = 'green';
let ballX;
let ballY;
let ballXDirection;
let ballYDirection;
let boardBackground = 'blue';
let player1Score;
let player2Score;
let paddle1;
let paddle2;
const GameBoard = () => {
  gameWidth = 1200;
  gameHeight = 700;
  ballColor = 'yellow';
  ballRadius = 12.5;
  paddleSpeed = 50;
  ballSpeed = 10;
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  ballXDirection = 0;
  ballYDirection = 0;
  player1Score = 0;
  player2Score = 0;
  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };
  gameStart();

  function gameStart() {
    createBall();
    nextTick();
  }

  function nextTick() {
    loopGameIntervalID = setTimeout(() => {
      moveBall();
      checkCollision();
      gameIo.emit('updateObject', {
        data: {
          p1: {
            x: paddle1.x,
            y: paddle1.y,
          },
          p2: {
            x: paddle2.x,
            y: paddle2.y,
          },
          b: {
            x: ballX,
            y: ballY,
          },
        },
      });
      nextTick();
    }, 15);
  }

  function createBall() {
    ballSpeed = 3;
    if (Math.round(Math.random()) === 1) {
      ballXDirection = 1;
    } else {
      ballXDirection = -1;
    }
    if (Math.round(Math.random()) === 1) {
      ballYDirection = 1;
    } else {
      ballYDirection = -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
  }

  function moveBall() {
    // ball 위치 지정
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
  }

  function checkCollision() {
    if (ballY <= 0 + ballRadius) {
      ballYDirection *= -1;
    }
    if (ballY >= gameHeight - ballRadius) {
      ballYDirection *= -1;
    }
    if (ballX <= 0) {
      // 게임 로직
      player1Score += 1;
      // updateScore();
      createBall();

      ballXDirection *= -1;

      return;
    }
    if (ballX >= gameWidth) {
      // 게임 로직
      player2Score += 1;
      // updateScore();
      createBall();

      // 무한 게임 로직 시각용
      ballXDirection *= -1;
      return;
    }
    if (ballX <= paddle1.x + paddle1.width + ballRadius) {
      if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
        ballXDirection *= -1;
        ballSpeed += 0.05;
      }
    }

    if (ballX >= paddle2.x) {
      if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
        ballXDirection *= -1;
        ballSpeed += 0.05;
      }
    }
  }
};
