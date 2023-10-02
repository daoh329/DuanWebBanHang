import React from 'react';
import CountdownTimer from './CountdownTimer';
import './Profile.css'; // Import file CSS

function Test() {
  const initialTime = 11300; // 11,300 giây (khoảng 3 giờ, 8 phút và 20 giây)

  return (
    <div >
<header></header>
<section>
  <div class="wrapper">

    <div id="countdown">
      <div class="cd-box">
        <p class="numbers days">00</p>
        <p class="strings timeRefDays">Days</p>
      </div>
      <div class="cd-box">
        <p class="numbers hours">00</p>
        <p class="strings timeRefHours">Hours</p>
      </div>
      <div class="cd-box">
        <p class="numbers minutes">00</p>
        <p class="strings timeRefMinutes">Minutes</p>
      </div>
      <div class="cd-box">
        <p class="numbers seconds">00</p>
        <p class="strings timeRefSeconds">Seconds</p>
      </div>
    </div>
   


  </div>

</section>
     
   
       
  
    </div>
  );
}

export default Test;
