import { useCallback, useState } from 'react';

const useToggle = (initialData: boolean): [boolean, () => void] => {
  const [toggle, setToggle] = useState(initialData);
  const handler = useCallback(() => {
    setToggle((prev) => !prev);
  }, []);
  return [toggle, handler];
};

export default useToggle;
