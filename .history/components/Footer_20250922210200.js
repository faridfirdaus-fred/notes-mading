'use client';

import { FaHeart, FaCode, FaCoffee } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Footer() {
  // Tambahkan state untuk jam mobile
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    ampm: 'AM',
  });
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format hours for 12-hour clock
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      setTime({
        hours: hours.toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        ampm,
      });
    };
    
    // Update time immediately
    updateTime();
    
    // Update time every 30 seconds (enough for footer)
    const interval = setInterval(updateTime, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mt-auto py-4 px-4 border-t border-gray-200">
      <div className="container mx-auto">
        {/* Mobile clock yang hanya tampil di layar kecil */}
        <div className="md:hidden flex justify-center mb-3">
          <div className="bg-amber-50 px-3 py-1 rounded-md text-amber-800 font-mono font-bold text-sm border border-amber-200">
            {time.hours}:{time.minutes}<span className="text-xs ml-1">{time.ampm}</span>
          </div>
        </div>
      
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 flex flex-wrap items-center justify-center md:justify-start gap-1 text-sm">
              <span>Dibuat dengan</span> 
              <FaHeart className="text-red-500 inline-block mx-1" /> 
              <span>dan</span> 
              <FaCoffee className="text-amber-700 inline-block mx-1" /> 
              <span>oleh</span> 
              <span className="font-semibold">Kelompok 4 Kelas C</span>
            </p>
          </div>
          
          <div className="flex items-center">
            {/* Decorative sticky note in footer - hidden on very small screens */}
            <div 
              className="relative p-3 bg-yellow-200 shadow-md mr-4 transform rotate-2 text-xs hidden sm:block"
              style={{ 
                width: '80px',
                height: '80px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-gray-300"></div>
              <p className="font-handwriting text-black text-center mt-2">
                Terima kasih!
              </p>
            </div>
            
            <div className="text-gray-500 text-xs sm:text-sm">
              <p>© {new Date().getFullYear()} Notes Mading</p>
              <p className="flex items-center">
                <FaCode className="mr-1" /> 
                <span>Made with Next.js & MongoDB</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}