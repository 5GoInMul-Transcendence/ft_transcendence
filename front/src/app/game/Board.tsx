import { ScoreBoard } from './ScoreBoard';
import { IGame, IInfoGame } from '@/types/IGame';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { IScore } from '@/types/IScore';
import GameBoard from './GameBoard';
import StandByGame from './StandByGame';
import GameEnd from './GameEnd';
import styled from 'styled-components';

interface Props {
  game: IGame;
}

export default function Board({ game }: Props) {
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [socket, setSocket] = useState<Socket<any, any> | undefined>(undefined);
  const [readGame, setReadyGame] = useState<boolean>(false);
  const [standbyGame, setStandbyGame] = useState<boolean>(false);
  const [endGame, setEndGame] = useState<boolean>(false);

  useEffect(() => {
    setSocket(
      io(`ws://localhost:10003/game`, {
        transports: ['websocket'],
        auth: {
          gameKey: game.gameKey,
        },
      })
    );
  }, []);

  const readyGame = () => {
    socket?.emit('readyGame');
    setReadyGame(false);
  };

  useEffect(() => {
    setReadyGame(true);
  }, []);

  useEffect(() => {
    socket?.on('infoGame', (res: IInfoGame) => {
      console.log(res, 'infoGame');
      if (res.status === 'standby') {
        setReadyGame(false);
        setStandbyGame(true);
        setTimeout(() => {
          socket.emit('startGame');
          setStandbyGame(false);
        }, 3000);
      } else if (res.status === 'play') {
      } else if (res.status === 'end') {
        setEndGame(true);
      }
    });

    socket?.on('updateScore', (res: IScore) => {
      console.log(res);
      setP1Score(res.p1.score);
      setP2Score(res.p2.score);
    });
  }, [socket]);

  if (!socket) return;

  return (
    <>
      <ScoreBoardDiv>
        <ScoreBoard
          user1={game.p1.nickname}
          user1Image={game.p1.avatar}
          score1={p1Score}
          user2={game.p2.nickname}
          user2Image={game.p2.avatar}
          score2={p2Score}
        ></ScoreBoard>
      </ScoreBoardDiv>
      <GameBoardDiv>
        <GameBoard socket={socket} />
        {standbyGame && <StandByGame />}
        {readGame && (
          <GameStartDiv>
            <button onClick={readyGame}>READY GAME</button>
          </GameStartDiv>
        )}
        {endGame && <GameEnd />}
      </GameBoardDiv>
    </>
  );
}

const ScoreBoardDiv = styled.div`
  ${({ theme }) => theme.flex.center}
  height: 20%;
`;

const GameBoardDiv = styled.div`
  position: relative;
  height: 80%;
`;

const GameStartDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.grey};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
