'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Test() {
  const notify = () =>
    toast.error('🦄 Wow so easy!', {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });

  return (
    <>
      <button onClick={notify}>test</button>
      <ToastContainer />
    </>
  );
}
