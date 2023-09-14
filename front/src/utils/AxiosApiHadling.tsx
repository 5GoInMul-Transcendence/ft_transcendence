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
        return response;
      },
      (error) => {
        const resData = error.response.data.data;
        const resStatus = error.response.data.resStatus.code;
        const resMessage = error.response.data.resStatus.message;
        switch (resStatus) {
          case '0001':
            if (modal === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '0002':
            window.location.href = `http://localhost:3000${resData}`;
            break;
          case '1001':
            if (modal === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '1002':
            window.location.href = `http://localhost:3000${resData}`;
            break;
          case '2001':
            if (modal === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '2002':
            window.location.href = `http://localhost:3000${resData}`;
            break;
        }
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(intercetpor);
    };
  }, []);

  return <></>;
}
