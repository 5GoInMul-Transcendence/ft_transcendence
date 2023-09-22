'use client';

import { gameObject } from '@/types/IGameObject';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

interface Props {
  socket: Socket<any, any> | undefined;
}

export default function GameBoard({ socket }: Props) {
  const gameBoardDiv = useRef<HTMLCanvasElement>(null);
  let ctx: any;
  let gameWidth: any;
  let gameHeight: any;
  let paddle1Color: any;
  let paddle2Color: any;
  let paddleBorder: any;
  let ballColor: any;
  let ballRadius: any;
  let ballBorderColor = 'green';
  let boardBackground = 'blue';
  let paddle1: any;
  let paddle2: any;

  useEffect(() => {
    if (gameBoardDiv.current) {
      ctx = gameBoardDiv.current.getContext('2d');
      gameWidth = gameBoardDiv.current.width;
      gameHeight = gameBoardDiv.current.height;
      paddle1Color = 'white';
      paddle2Color = 'red';
      ballRadius = 15;
      paddleBorder = 'black';
      ballColor = 'yellow';
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
    }
    return () => {
      window.removeEventListener('keydown', changeDirection);
    };
  }, []);

  function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }

  function drawPaddles(p1_x: number, p1_y: number, p2_x: number, p2_y: number) {
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(p1_x, p1_y, paddle1.width, paddle1.height);
    ctx.strokeRect(p1_x, p1_y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(p2_x, p2_y, paddle2.width, paddle2.height);
    ctx.strokeRect(p2_x, p2_y, paddle2.width, paddle2.height);
  }

  function drawBall(ballX: number, ballY: number) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  function changeDirection(event: any) {
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;
    switch (keyPressed) {
      case paddle1Up:
        socket?.emit('updatePaddle', { paddle: 0 });
        break;
      case paddle1Down:
        socket?.emit('updatePaddle', { paddle: 1 });
        break;
      case paddle2Up:
        socket?.emit('updatePaddle', { paddle: 0 });
        break;
      case paddle2Down:
        socket?.emit('updatePaddle', { paddle: 1 });
        break;
    }
  }

  useEffect(() => {
    socket?.on('updateObject', (res: gameObject) => {
      const p1 = res.p1;
      const p2 = res.p2;
      const ball = res.b;

      clearBoard();
      drawPaddles(p1.x, p1.y, p2.x, p2.y);
      drawBall(ball.x, ball.y);
    });
  }, [socket]);

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

const GameContainer = styled.div`
  text-align: center;
`;

const GameBoardDiv = styled.canvas`
  border: 3px solid;
  border-color: white;
`;
