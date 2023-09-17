import '@/component/PingPongAnimation/styles.css';
export default function PingPongAnimation() {
  return (
    <div style={{ margin: '20px' }}>
      <div className='wrapper'>
        <div className='left_wall' />
        <div className='ball' />
        <div className='right_wall' />
        <div className='clear' />
      </div>
    </div>
  );
}
