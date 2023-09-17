import { useEffect, useState } from 'react';
import Buttons from '@/component/Buttons';
import useSocket from '@/hooks/useSocket';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';

export default function MatchAccept() {
  const [progress, setProgress] = useState(100);
  const [socket] = useSocket('10001/main');
  const setModal = useSetRecoilState(modalState);

  const onClickYes = async () => {
    setModal(null);
    socket?.emit('enterMatch', {
      status: true,
    });
  };

  const onClickNo = async () => {
    setModal(null);
    socket?.emit('enterMatch', {
      status: false,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setModal(null);
      socket?.emit('enterMatch', {
        status: false,
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress > 0) {
        setProgress((prevProgress) => prevProgress - 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <Wrapper>
      <ProgressBarContainer>
        <ProgressBarFiller $progress={progress}></ProgressBarFiller>
      </ProgressBarContainer>
      <Buttons
        leftButton={{
          text: 'yes',
          color: 'green',
          onClick: onClickYes,
        }}
        rightButton={{
          text: 'no',
          color: 'pink',
          onClick: onClickNo,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  justify-content: space-between;
  width: 100%;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const ProgressBarFiller = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: #007bff;
  border-radius: 5px;
`;
