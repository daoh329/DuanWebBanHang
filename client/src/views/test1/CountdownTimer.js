import React, { Component } from 'react';

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.initialTime, // Thời gian ban đầu (được đặt bởi props)
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.updateTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateTimer = () => {
    if (this.state.timeLeft > 0) {
      this.setState(prevState => ({
        timeLeft: prevState.timeLeft - 1,
      }));
    } else {
      clearInterval(this.interval);
      // Xử lý khi đếm giờ kết thúc
    }
  };

  // Hàm chuyển đổi số giây thành ngày - giờ - phút - giây
  convertSecondsToTime = (seconds) => {
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

  render() {
    const { timeLeft } = this.state;
    const { days, hours, minutes, seconds } = this.convertSecondsToTime(timeLeft);

    return (
      <div>
        <p>Thời gian còn lại: {days} ngày {hours} giờ {minutes} phút {seconds} giây</p>
      </div>
    );
  }
}

export default CountdownTimer;