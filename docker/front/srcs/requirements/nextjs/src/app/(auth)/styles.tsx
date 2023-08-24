'use client';

import styled from 'styled-components';

export const FormWrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  background: ${({ theme }) => theme.colors.darkgrey};
  width: 25rem;
  padding: 2.5rem 1rem 1rem 1rem;
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  * {
    margin: 0.3rem 0;
  }
  button {
    width: 16rem;
    height: 2rem;
    text-align: center;
    border: 1px solid white;
    border-radius: 10px;
    margin-top: 1.8rem;
  }
`;

export const Form = styled.form`
  width: 20rem;
  ${({ theme }) => theme.flex.centerColumn};
  * {
    width: 100%;
  }
  input {
    margin: 0.5rem 0;
    padding: 0.3rem;
    border-bottom: 1px solid white;
  }
`;
