import { useRecoilState } from 'recoil';
import { invaildMsg, modalState } from './recoil/atom';
import { useEffect } from 'react';
import { axiosInstance } from './axios';
export default function AxiosApiHaddling() {
  const [, setInvalidMsg] = useRecoilState(invaildMsg);
  const [, setModal] = useRecoilState(modalState);

  useEffect(() => {
    const intercetpor = axiosInstance.interceptors.response.use((response) => {
      const resData = response.data.data;
      const resStatus = response.data.resStatus.code;
      switch (resStatus) {
        // main
        case '0001':
          setModal({ type: 'API-Error' });
          setInvalidMsg(resData);
          break;
        case '0002':
          window.location.href = `http://localhost:3000${resData}`;
          break;

        // chat
        case '1001':
          setModal({ type: 'API-Error' });
          setInvalidMsg(resData);
          break;
        case '1002':
          window.location.href = `http://localhost:3000${resData}`;
          break;

        // game
        case '2001':
          setModal({ type: 'API-Error' });
          setInvalidMsg(resData);
          break;
        case '2002':
          window.location.href = `http://localhost:3000${resData}`;
          break;
      }

      return response;
    });

    return () => {
      axiosInstance.interceptors.response.eject(intercetpor);
    };
  }, []);

  return <></>;
}
