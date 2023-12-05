import React, { useState, useEffect } from 'react';
import './Home.scss';

function CountdownTimer({ endTime }) {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = endTime - now;
    return Math.floor(difference / 1000);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const convertSecondsToTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const { days, hours, minutes, seconds } = convertSecondsToTime(timeLeft);

  return (
    <div className='div_main_km'>
      {timeLeft > 0 ? (
        <>
          <p className='p_km'>Khuyến mãi còn lại:</p>
          <div className='div_km'> 
            <div className='div_ngay'>{days}  </div>
            <div className='div_gio'>{hours}  </div>
            <div className='div_phut'>{minutes}  </div>
            <div className='div_giay'>{seconds} </div>
          </div>
        </>
      ) : (
        <p className='p_km'>Giảm giá đã kết thúc</p>
      )}
    </div>
  );
}

export default CountdownTimer;
