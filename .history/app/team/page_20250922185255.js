'use client';

import { useState } from 'react';
import MemberCard from '@/components/MemberCard';

export default function TeamPage() {
  // Data contoh untuk anggota kelompok (ganti dengan data sebenarnya nanti)
  const [members] = useState([
    {
      id: 1,
      name: "Member Name 1",
      npm: "NPM12345678",
      photoUrl: "/placeholder-profile.svg",
      role: "Leader"
    },
    {
      id: 2,
      name: "Member Name 2",
      npm: "NPM23456789",
      photoUrl: "/placeholder-profile.jpg",
      role: "Frontend Developer"
    },
    {
      id: 3,
      name: "Member Name 3",
      npm: "NPM34567890",
      photoUrl: "/placeholder-profile.jpg",
      role: "Backend Developer"
    },
    {
      id: 4,
      name: "Member Name 4",
      npm: "NPM45678901",
      photoUrl: "/placeholder-profile.jpg",
      role: "UI/UX Designer"
    },
    {
      id: 5,
      name: "Member Name 5",
      npm: "NPM56789012",
      photoUrl: "/placeholder-profile.jpg",
      role: "QA Tester"
    }
  ]);

  return (
    <div className="min-h-screen bg-amber-800 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-amber-700 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white font-handwriting text-center">Our Team</h1>
          <p className="text-amber-100 text-center mt-2">
            Meet the amazing team behind this Notes Mading application
          </p>
        </div>

        {/* Bulletin Board/Mading Style */}
        <div className="bg-amber-900 border-8 border-amber-950 rounded-md p-8 shadow-2xl">
          {/* Cork Board Texture */}
          <div className="bg-cork bg-repeat rounded-md p-8" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-amber-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white font-handwriting text-center">About This Project</h2>
          <div className="bg-white rounded-md p-4 mt-4">
            <p className="text-gray-800 font-handwriting">
              This Notes Mading application was created as a group project for our class. 
              It&apos;s a digital bulletin board where users can post notes with images, similar to how we might pin papers to a physical bulletin board.
            </p>
            <p className="text-gray-800 font-handwriting mt-4">
              The project uses Next.js for the frontend, MongoDB for the database, and Cloudinary for image storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}