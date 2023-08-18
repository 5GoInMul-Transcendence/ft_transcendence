import styled from 'styled-components';
import Buttons from '@/component/Buttons';

export default function InvMatch() {
  const declineMatchHandler = async () => {};
  const acceptMatchHandler = async () => {};

  return (
    <Wrapper>
      <QuestionP>
        are you
        <br /> want fight?
      </QuestionP>
      <Buttons
        leftButton={{
          text: 'decline',
          color: 'pink',
          onClick: declineMatchHandler,
        }}
        rightButton={{
          text: 'accept',
          color: 'green',
          onClick: acceptMatchHandler,
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

const QuestionP = styled.p`
  width: 80%;
  padding-bottom: 3rem;
  text-align: left;
  line-height: 1.5;
  font-size: ${({ theme }) => theme.fontSize.xlarge};
`;
