import Toggle from '@/component/Toggle';
import useToggle from '@/hooks/useToggle';
import { IUserFriedns } from '@/types/IUser';
import { axiosInstance } from '@/utils/axios';

interface Props {
  data: IUserFriedns;
}
export default function ProfileToggle({ data }: Props) {
  if (!data) return;

  const [friends] = useToggle(data.isFriend);
  const [block, onChangeBlock] = useToggle(data.isBlock);

  const onToggleFriend = () => {};

  const onToggleBlock = () => {
    axiosInstance
      .post('/channel/block', { blockUserId: data.id })
      .then((res) => onChangeBlock());
  };
  return (
    <>
      <Toggle
        text='follow'
        color='green'
        checked={friends}
        onToggle={onToggleFriend}
      />
      <Toggle
        text='block'
        color='pink'
        checked={block}
        onToggle={onToggleBlock}
      />
    </>
  );
}
