import { invalidMsgState } from '@/utils/recoil/atom';
import InvalidMsg from './InvalidMsg';

import { useRecoilState } from 'recoil';

export default function Error() {
  const [invalidMsg] = useRecoilState(invalidMsgState);

  return (
    <>
      <InvalidMsg text={invalidMsg} />
    </>
  );
}
