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
        const resMessage = error.response.data.resStatus.message;
        if (modal === null) setModal({ type: 'API-Error' });
        setInvalidMsg(resMessage);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(intercetpor);
    };
  }, []);

  return <></>;
}
