'use client';

import { useState } from 'react';
import MemberCard from '@/components/MemberCard';
import { FaThumbtack, FaPaperclip } from 'react-icons/fa';

const Decoration = ({ type, style }) => {
  return (
    <div className="absolute" style={style}>
      {type === 'pin' && (
        <FaThumbtack size={18} className="text-red-500 drop-shadow-md" />
      )}
      {type === 'paperclip' && (
        <FaPaperclip size={24} className="text-gray-400 drop-shadow-md" />
      )}
      {type === 'note' && (
        <div className="w-16 h-16 bg-yellow-200 rotate-6 shadow-md p-2">
          <p className="text-xs font-handwriting text-gray-700">Important info!</p>
        </div>
      )}
    </div>
  );
};

export default function TeamPage() {
  // Data anggota kelompok dengan foto yang sudah ada di folder public
  const [members] = useState([
    {
      id: 1,
      name: "Aar",
      npm: "2206081534", // Ganti dengan NPM yang sebenarnya
      photoUrl: "/aar.jpg",
    },
    {
      id: 2,
      name: "Fanny",
      npm: "2206081865", // Ganti dengan NPM yang sebenarnya
      photoUrl: "/fanny.jpg",
    },
    {
      id: 3,
      name: "Nabil",
      npm: "2206082266", // Ganti dengan NPM yang sebenarnya
      photoUrl: "/nabil.jpg",
    },
    {
      id: 4,
      name: "Talitha",
      npm: "2206082472", // Ganti dengan NPM yang sebenarnya
      photoUrl: "/talitha.jpg",
    },
    {
      id: 5,
      name: "Farid",
      npm: "2206081882", // Ganti dengan NPM yang sebenarnya
      photoUrl: "/farid.jpg",
    },
    {
      id: 6,
      name: "Rai",
      npm: "2206082355", // Ganti dengan NPM yang sebenarnya
      photoUrl: "/rai.jpg",
      role: "UI/UX Designer"
    }
  ]);

  // Decorations
  const decorations = [
    { type: 'pin', style: { top: '5%', left: '5%' } },
    { type: 'pin', style: { top: '10%', right: '8%' } },
    { type: 'paperclip', style: { bottom: '15%', left: '10%', transform: 'rotate(45deg)' } },
    { type: 'paperclip', style: { top: '20%', right: '15%', transform: 'rotate(-20deg)' } },
    { type: 'note', style: { bottom: '12%', right: '8%' } },
  ];

  return (
    <div className="min-h-screen py-8 relative">
      <div className="container mx-auto px-4">
        {/* Header with decorative styling */}
        <div className="relative bg-amber-800 rounded-lg p-6 mb-8 shadow-lg">
          {/* Decorative pin */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <FaThumbtack size={28} className="text-red-600 drop-shadow-lg" />
          </div>
          
          <h1 className="text-4xl font-bold text-white font-handwriting text-center mt-1">Our Team</h1>
          <p className="text-amber-100 text-center mt-2">
            Meet the amazing team behind this Notes Mading application
          </p>
        </div>

        {/* Bulletin Board/Mading Style */}
        <div className="relative bg-amber-900 border-8 border-amber-950 rounded-md p-8 shadow-2xl">
          {/* Cork Board Texture */}
          <div 
            className="bg-cork bg-repeat rounded-md p-8 relative" 
            style={{ 
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')",
              minHeight: '600px'
            }}
          >
            {/* Decorative elements */}
            {decorations.map((deco, index) => (
              <Decoration key={index} type={deco.type} style={deco.style} />
            ))}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center relative z-10">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>

        {/* About section with paper styling */}
        <div className="mt-8 relative">
          <div className="bg-white rounded-md p-6 shadow-lg transform -rotate-1">
            <div className="absolute -top-3 left-6">
              <FaThumbtack size={24} className="text-blue-500 drop-shadow-md" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 font-handwriting mb-4">About This Project</h2>
            
            <p className="text-gray-700 font-handwriting">
              This Notes Mading application was created as a group project for our class. 
              It&apos;s a digital bulletin board where users can post notes with images, similar to how we might pin papers to a physical bulletin board.
            </p>
            
            <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-400 rounded">
              <p className="text-gray-700 font-handwriting">
                <span className="font-bold">Tech Stack:</span> Next.js for the frontend, MongoDB for the database, and Cloudinary for image storage.
              </p>
            </div>
            
            {/* Paper clip decoration */}
            <div className="absolute -top-4 right-6 transform rotate-12">
              <FaPaperclip size={30} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}