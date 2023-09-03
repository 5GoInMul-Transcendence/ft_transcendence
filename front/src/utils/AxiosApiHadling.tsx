import { useRecoilState } from 'recoil';
import { invalidMsgState, modalState } from './recoil/atom';
import { useEffect } from 'react';
import { axiosInstance } from './axios';

export default function AxiosApiHadling() {
  const [, setInvalidMsg] = useRecoilState(invalidMsgState);
  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    const intercetpor = axiosInstance.interceptors.response.use(
      (response) => {
        const resData = response.data.data;
        const resStatus = response.data.resStatus.code;
        const resMessage = response.data.resStatus.message;
        console.log(response);
        switch (resStatus) {
          // main
          // case '0000':
          //   setModal(null);
          // break;
          case '0001':
            if (modal?.type === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '0002':
            window.location.href = `http://localhost:3000${resData}`;
            break;

          // chat
          // case '1000':
          //   setModal(null);
          // break;
          case '1001':
            if (modal?.type === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '1002':
            window.location.href = `http://localhost:3000${resData}`;
            break;

          // game
          // case '2000':
          //   setModal(null);
          // break;
          case '2001':
            if (modal?.type === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '2002':
            window.location.href = `http://localhost:3000${resData}`;
            break;
        }

        return response;
      },
      (error) => {
        return new Promise(() => {});
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(intercetpor);
    };
  }, []);

  return <></>;
}
