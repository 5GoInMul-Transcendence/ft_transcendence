import { useRecoilState } from 'recoil';
import { invalidMsgState, modalState } from './recoil/atom';
import { useEffect } from 'react';
import { axiosInstance } from './axios';
import { useRouter } from 'next/navigation';

export default function AxiosApiHadling() {
  const route = useRouter();
  const [, setInvalidMsg] = useRecoilState(invalidMsgState);
  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    const intercetpor = axiosInstance.interceptors.response.use(
      (response) => {
        setInvalidMsg('');
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
            route.push(`${resData}`);
            break;
          case '1001':
            if (modal === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '1002':
            route.push(`${resData}`);
            break;
          case '2001':
            if (modal === null) setModal({ type: 'API-Error' });
            setInvalidMsg(resMessage);
            break;
          case '2002':
            route.push(`${resData}`);
            break;
        }
        return new Promise(() => {});
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(intercetpor);
    };
  }, [modal]);

  return <></>;
}
