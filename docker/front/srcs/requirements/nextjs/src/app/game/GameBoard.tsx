'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export default function GameBoard() {
  // 각 HtmlElelment 에 해당하는 dom 객체 가져오기
  const gameBoardDiv = useRef<HTMLCanvasElement>(null);
  const resetBtn = useRef<HTMLButtonElement>(null);

  let ctx: any;
  let gameWidth: any;
  let gameHeight: any;
  let paddle1Color: any;
  let paddle2Color: any;
  let paddleBorder: any;
  let ballColor: any;
  let ballRadius: any;
  let paddleSpeed: number;
  let itervalId: any;
  let ballSpeed: any;
  let ballBorderColor = 'green';
  let ballX: number;
  let ballY: number;
  let ballXDirection: any;
  let ballYDirection: any;
  let boardBackground = 'blue';
  let player1Score: any;
  let player2Score: any;
  let paddle1: any;
  let paddle2: any;
  useEffect(() => {
    // Dom 객체가 정상적으로 가져와졌나 확인
    if (gameBoardDiv.current) {
      ctx = gameBoardDiv.current.getContext('2d');
      gameWidth = gameBoardDiv.current.width;
      gameHeight = gameBoardDiv.current.height;
      paddle1Color = 'white';
      paddle2Color = 'red';
      paddleBorder = 'black';
      ballColor = 'yellow';
      ballRadius = 12.5;
      paddleSpeed = 50;
      itervalId;
      ballSpeed = 10;
      ballX = gameWidth / 2;
      ballY = gameHeight / 2;
      ballXDirection = 0;
      ballYDirection = 0;
      player1Score = 0;
      player2Score = 0;
      boardBackground = 'black';
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
      window.addEventListener('keydown', changeDirection);
      resetBtn.current?.addEventListener('click', resetGame);
      gameStart();
      drawPaddles();
    }
  });

  function gameStart() {
    createBall();
    nextTick();
  }

  function nextTick() {
    itervalId = setTimeout(() => {
      clearBoard();
      drawPaddles();
      moveBall();
      drawBall(ballX, ballY);
      checkCollision();
      nextTick();
    }, 10);
  }

  function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }

  function drawPaddles() {
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
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
    drawBall(ballX, ballY);
  }

  function moveBall() {
    // ball 위치 지정
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
  }

  function drawBall(ballX: number, ballY: number) {
    // ball의 색, 크기 지정 및 그리기
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    // 이거 없으면 원이 안없어지고 계속 그려짐
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
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
      updateScore();
      createBall();

      // 시각용
      ballXDirection *= -1;

      return;
    }
    if (ballX >= gameWidth) {
      // 게임 로직
      player2Score += 1;
      updateScore();
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

  function changeDirection(event: any) {
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    switch (keyPressed) {
      case paddle1Up:
        if (paddle1.y > 0) {
          paddle1.y -= paddleSpeed;
        }
        break;
      case paddle1Down:
        if (paddle1.y < gameHeight - paddle1.height) {
          paddle1.y += paddleSpeed;
        }
        break;
      case paddle2Up:
        if (paddle2.y > 0) {
          paddle2.y -= paddleSpeed;
        }
        break;
      case paddle2Down:
        if (paddle2.y < gameHeight - paddle2.height) {
          paddle2.y += paddleSpeed;
        }
        break;
    }
  }

  function updateScore() {}

  function resetGame() {}

  return (
    <GameContainer id='gameContainer'>
      <GameBoardDiv
        id='gameBoardDiv'
        width='1200'
        height='700'
        ref={gameBoardDiv}
      ></GameBoardDiv>
    </GameContainer>
  );
}

let GameContainer = styled.div`
  text-align: center;
`;

let GameBoardDiv = styled.canvas`
  border: 3px solid;
  border-color: white;
`;
