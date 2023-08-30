import InvalidMsg from './InvalidMsg';

import { useRecoilState } from 'recoil';
import { invalidMsg } from '@/utils/recoil/atom';

export default function Error() {
  const [invalidMsg] = useRecoilState(invalidMsg);

  return (
    <>
      <InvalidMsg text={invalidMsg} />
    </>
  );
}
