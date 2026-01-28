'use client';

import Image from 'next/image';
import { Camera } from 'lucide-react';

export default function PhotoRoll() {
  const photos = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519225448526-0a0295155809?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc6?q=80&w=500&auto=format&fit=crop",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Photo Roll</h3>
           <button className="text-sm font-medium text-purple-600 flex items-center hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
               <Camera className="w-4 h-4 mr-2" /> Add Photo
           </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
             <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                 <img src={src} alt="Party pic" className="object-cover" />
             </div>
          ))}
          <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Add yours</span>
          </div>
      </div>
    </div>
  );
}
