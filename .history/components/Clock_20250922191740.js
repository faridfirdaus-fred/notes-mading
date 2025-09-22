'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: 'AM',
    day: '',
    date: '',
    month: '',
    year: ''
  });
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format hours for 12-hour clock
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      // Get day name
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = days[now.getDay()];
      
      // Get month name
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const month = months[now.getMonth()];
      
      setTime({
        hours: hours.toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0'),
        ampm,
        day,
        date: now.getDate(),
        month,
        year: now.getFullYear()
      });
    };
    
    // Update time immediately
    updateTime();
    
    // Update time every second
    const interval = setInterval(updateTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="clock-container bg-amber-50 p-3 rounded-md shadow-md border-2 border-amber-200 transform rotate-1 transition-all hover:scale-105">
      <div className="time-display font-mono text-lg lg:text-xl text-center font-bold text-amber-800">
        {time.hours}:{time.minutes}
        <span className="text-xs align-text-top ml-1">{time.ampm}</span>
      </div>
      <div className="date-display text-center text-xs sm:text-sm text-amber-700 font-handwriting">
        {time.day}, {time.date} {time.month}
      </div>
    </div>
  );
}