import InvalidMsg from './InvalidMsg';

import { useRecoilState } from 'recoil';
import { invaildMsg } from '@/utils/recoil/atom';

export default function Error() {
  const [invalidMsg] = useRecoilState(invaildMsg);

  return (
    <>
      <InvalidMsg text={invalidMsg} />
    </>
  );
}
