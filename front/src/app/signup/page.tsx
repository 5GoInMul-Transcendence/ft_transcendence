"use client";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// import axios from "axios";
import Pong from "@/component/Pong";
import useInput from "@/hooks/useInput";

export default function SignUp() {
  const [email, , onChangeEmail] = useInput("");
  const [id, , onChangeId] = useInput("");
  const [password, setPassword] = useInput("");
  const [passwordCheck, setPasswordCheck] = useInput("");
  const [mismatchError, setMismatchError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value === password);
    },
    [password]
  );
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value === passwordCheck);
    },
    [passwordCheck]
  );
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mismatchError) {
        // axios
        //   .post("/api/users", {
        //     email,
        //     id,
        //     password,
        //   })
        //   .then((resopnse) => {
        //     alert("회원가입 완료!");
        //   })
        //   .catch((error) => {
        //     console.log(error.resopnse);
        //   });
      }
    },
    [email, id, password, passwordCheck, mismatchError]
  );
  return (
    <Container>
      <Pong />
      <Form onSubmit={onSubmit}>
        <div>
          <span>ID</span>
          <div>
            <input type="text" value={id} onChange={onChangeId} />
          </div>
        </div>
        <div>
          <span>PASSWORD</span>
          <div>
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
        </div>
        <div>
          <span>PASSWORD REFEAT</span>
          <div>
            <input
              type="password"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
            {/* {!password && <Error>비밀번호를 입력해주세요</Error>}
            {!mismatchError && <Error>비밀번호가 일치하지 않습니다</Error>}
            {!id && <Error> 닉네임을 입력해주세요 </Error>}
        {mismatchError && <Error>{signUpError}</Error>} */}
          </div>
        </div>
        <span>
          EMAIL <button> CHECK</button>
        </span>
        <div>
          <input type="email" value={email} onChange={onChangeEmail}></input>
        </div>
        <button type="submit">SEND</button>
        <div>Already signed up? gogogo</div>
        <div>
          <Link href="/login">go to Login</Link>
        </div>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center center;
  height: 100%;
  @media (min-width: 500px) {
    grid-template-row: repeat(2, 1fr);
  }
`;

const Form = styled.form`
  background: ${({ theme }) => theme.colors.darkgrey};
  padding: 0.5rem;
  input {
    margin: 0.5rem 0 0.5rem 0;
  }
`;
