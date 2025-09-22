'use client';

import { useState } from 'react';
import MemberCard from '@/components/MemberCard';
import { FaThumbtack, FaPaperclip, FaTags, FaMapPin } from 'react-icons/fa';
import { GiNotebook } from 'react-icons/gi';
import { BsPencil } from 'react-icons/bs';

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
      {type === 'sticky-note' && (
        <div 
          className="w-20 h-20 p-2 shadow-md flex items-center justify-center transform"
          style={{ 
            background: style.bgColor || '#FFEB3B', 
            rotate: `${style.rotation || 0}deg`,
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <p className="text-sm font-handwriting text-center">{style.text || 'Sticky note'}</p>
        </div>
      )}
      {type === 'photo-corner' && (
        <div 
          className="w-12 h-12 border-t-4 border-l-4 border-black opacity-20"
          style={{ transform: style.transform || 'rotate(0deg)' }}
        ></div>
      )}
      {type === 'pencil' && (
        <BsPencil size={style.size || 20} className={`${style.color || 'text-amber-700'} drop-shadow-sm`} />
      )}
      {type === 'tag' && (
        <div className={`${style.color || 'bg-blue-200'} py-1 px-3 rounded-md shadow-sm transform rotate-${style.rotation || 0}`}>
          <span className="text-xs font-semibold flex items-center gap-1">
            <FaTags size={10} />
            {style.text || 'Tag'}
          </span>
        </div>
      )}
      {type === 'notebook' && (
        <GiNotebook size={style.size || 24} className={`${style.color || 'text-amber-800'} drop-shadow-md`} />
      )}
      {type === 'push-pin' && (
        <FaMapPin size={style.size || 20} className={`${style.color || 'text-red-500'} drop-shadow-md`} />
      )}
    </div>
  );
};

export default function TeamPage() {
  // Data anggota kelompok dengan foto yang sudah ada di folder public
  const [members] = useState([
    {
      id: 1,
      name: "Aar Lazuardi Majid",
      npm: "237006070", 
      photoUrl: "/aar.jpg",
    },
    {
      id: 2,
      name: "Fanny Maharani",
      npm: "237006048", 
      photoUrl: "/fanny.jpg",
    },
    {
      id: 3,
      name: "Nabil Muflih Wardana",
      npm: "237006077", 
      photoUrl: "/nabil.jpg",
    },
    {
      id: 4,
      name: "Talitha Ramadhani Nur Azizah",
      npm: "237006071", 
      photoUrl: "/talitha.jpg",
    },
    {
      id: 5,
      name: "Farid Firdaus",
      npm: "237006081", 
      photoUrl: "/farid.jpg",
    },
    {
      id: 6,
      name: "Muhamad Rai Akmal",
      npm: "237006092", 
      photoUrl: "/rai.jpg",
    }
  ]);

  // Decorations
  const decorations = [
    { type: 'pin', style: { top: '5%', left: '5%' } },
    { type: 'pin', style: { top: '10%', right: '8%' } },
    { type: 'pin', style: { bottom: '25%', right: '20%' } },
    { type: 'paperclip', style: { bottom: '15%', left: '10%', transform: 'rotate(45deg)' } },
    { type: 'paperclip', style: { top: '20%', right: '15%', transform: 'rotate(-20deg)' } },
    { type: 'paperclip', style: { top: '60%', left: '8%', transform: 'rotate(15deg)' } },
    { type: 'note', style: { bottom: '12%', right: '8%' } },
    { type: 'sticky-note', style: { top: '5%', right: '25%', bgColor: '#FFC107', rotation: -5, text: 'Great Team!' } },
    { type: 'sticky-note', style: { bottom: '30%', left: '15%', bgColor: '#81C784', rotation: 7, text: 'Meet us!' } },
    { type: 'photo-corner', style: { top: '0', left: '0', transform: 'rotate(0deg)' } },
    { type: 'photo-corner', style: { top: '0', right: '0', transform: 'rotate(90deg)' } },
    { type: 'photo-corner', style: { bottom: '0', left: '0', transform: 'rotate(-90deg)' } },
    { type: 'photo-corner', style: { bottom: '0', right: '0', transform: 'rotate(180deg)' } },
    { type: 'pencil', style: { bottom: '10%', left: '30%', transform: 'rotate(45deg)', size: 24, color: 'text-yellow-600' } },
    { type: 'tag', style: { top: '12%', left: '20%', rotation: -5, color: 'bg-blue-100', text: 'Developers' } },
    { type: 'tag', style: { bottom: '20%', right: '30%', rotation: 3, color: 'bg-green-100', text: 'Team 4' } },
    { type: 'notebook', style: { top: '35%', left: '5%', size: 28, color: 'text-amber-700' } },
    { type: 'push-pin', style: { top: '40%', right: '5%', size: 24, color: 'text-blue-500' } },
  ];

  return (
    <div className="min-h-screen py-8 relative">
      <div className="container mx-auto px-4">
        {/* Header with decorative styling */}
        <div className="relative bg-amber-800 rounded-lg p-6 mb-8 shadow-lg overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-2 left-2 w-16 h-1 bg-amber-600 rounded-full opacity-70"></div>
            <div className="absolute bottom-2 right-2 w-20 h-1 bg-amber-600 rounded-full opacity-70"></div>
            <div className="absolute top-6 right-8 w-10 h-10 rounded-full border-2 border-amber-600 opacity-20"></div>
            <div className="absolute bottom-4 left-10 w-6 h-6 rounded-full border-2 border-amber-600 opacity-20"></div>
          </div>
          
          {/* Decorative pin */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <FaThumbtack size={28} className="text-red-600 drop-shadow-lg" />
          </div>
          
          {/* Decorative pins on corners */}
          <div className="absolute -top-3 left-8">
            <FaThumbtack size={20} className="text-yellow-600 drop-shadow-md" />
          </div>
          <div className="absolute -top-3 right-8">
            <FaThumbtack size={20} className="text-blue-600 drop-shadow-md" />
          </div>
          
          <h1 className="text-4xl font-bold text-white font-handwriting text-center mt-1 relative z-10">Our Team</h1>
          <p className="text-amber-100 text-center mt-2 relative z-10">
            Meet the amazing team behind this Notes Mading application
          </p>
          
          {/* Decorative ribbon */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-14 bg-amber-600"></div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-14 bg-amber-600"></div>
        </div>

        {/* Bulletin Board/Mading Style */}
        <div className="relative bg-amber-900 border-8 border-amber-950 rounded-md p-8 shadow-2xl">
          {/* Wood frame effect */}
          <div className="absolute inset-0 border-4 border-amber-800 rounded-sm pointer-events-none"></div>
          <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-950/20 rounded-sm pointer-events-none"></div>
          
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
            
            {/* Team title sign */}
            <div className="relative mx-auto w-fit mb-8 z-20">
              <div className="bg-amber-100 px-10 py-2 border border-amber-300 shadow-md transform rotate-1">
                <h2 className="text-amber-800 font-handwriting text-xl">Kelompok 4 Kelas C</h2>
              </div>
              <div className="absolute -top-3 left-1/4">
                <FaThumbtack size={16} className="text-red-500" />
              </div>
              <div className="absolute -top-3 right-1/4">
                <FaThumbtack size={16} className="text-blue-500" />
              </div>
            </div>
            
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
            
            {/* Pencil decoration */}
            <div className="absolute bottom-3 right-4 transform rotate-45">
              <BsPencil size={20} className="text-amber-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}