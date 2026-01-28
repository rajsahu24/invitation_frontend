'use client';

import Image from 'next/image';

interface Guest {
  id: string;
  name: string;
  avatar: string;
  isMutual: boolean;
}

interface GuestListProps {
  guests: Guest[];
}

export default function GuestList({ guests }: GuestListProps) {
  const mutuals = guests.filter(g => g.isMutual);
  const others = guests.filter(g => !g.isMutual);
  const allGuests = [...mutuals, ...others];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Who's Coming</h3>
        <span className="text-sm text-gray-500">{guests.length} attending</span>
      </div>

      <div className="flex -space-x-3 overflow-hidden py-2 pl-1">
        {allGuests.slice(0, 8).map((guest) => (
          <div key={guest.id} className="relative group">
            <div className={`relative w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform transform group-hover:-translate-y-2 cursor-pointer ${
                guest.isMutual ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
            }`}>
              <img src={guest.avatar} alt={guest.name} className="object-cover" />
            </div>
            {/* Mutual Label Badge */}
            {guest.isMutual && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 border border-white">
                    MUTUAL
                </div>
            )}
             {/* Tooltip */}
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                {guest.name}
             </div>
          </div>
        ))}
        {allGuests.length > 8 && (
             <div className="relative w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500 z-0">
                +{allGuests.length - 8}
             </div>
        )}
      </div>
      
      {mutuals.length > 0 && (
          <p className="text-sm text-indigo-600 mt-2 font-medium">
              You know {mutuals.length} people going!
          </p>
      )}
    </div>
  );
}
