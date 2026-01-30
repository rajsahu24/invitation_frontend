import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHostStore } from '../../../lib/store';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: number; // 0: pending, 1: maybe, 2: confirmed
  rsvp_token:string
}


interface Invitation {
  id: string;
  user_id: string;
  invitation_title: string;
  invitation_message: string;
  invitation_tag_line: string;
  invitation_type: string;
  invitation_template_id: string;
  template_url?: string;
  quick_action: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface GuestListProps {
  guests: Guest[];
  onAddGuest: () => void;
  invitation?: Invitation;
}

const GuestList: React.FC<GuestListProps> = ({ guests = [], onAddGuest, invitation }) => {
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Pending'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentInvitationId } = useHostStore();
 
  const handleWhatsAppShare = (guest: Guest, invitation: Invitation | undefined) => {
    const invitationUrl = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${invitation?.invitation_type}/${invitation?.invitation_template_id}/${guest.rsvp_token}`;
    const message = `Hi ${guest.name}! 🎉\n\nYou're invited to ${invitation?.invitation_title}!\n\nView your invitation: ${invitationUrl}`;
    const whatsappUrl = `https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Confirmed' ? guest.status === 2 
      : guest.status === 0;
    
    return matchesSearch && matchesFilter;
  });

const getStatusColor = (status: number) => {
  switch (status) {
    case 2: // Confirmed
      return 'bg-green-100 text-green-700';

    case 3: // May be
      return 'bg-blue-100 text-blue-700';

    case 4: // Reject
      return 'bg-red-100 text-red-700';

    case 1: // Viewed
      return 'bg-yellow-100 text-yellow-700';

    case 0: // Not responded
      return 'bg-gray-100 text-gray-700';

    default: // Pending / unknown
      return 'bg-gray-100 text-gray-700';
  }
};

  const getStatusLabel = (status: number) => {
    switch(status) {
      case 2: return 'Confirmed';
      case 1: return 'Viewd';
      case 0: return 'Not responded';
      case 4: return 'Reject';
      case 3 : return 'May be'
      default: return 'Pending';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            Guest List
            <span className="text-sm font-normal text-gray-500 ml-1">({guests.length})</span>
          </h3>
          <button 
            onClick={onAddGuest}
            className="p-2 bg-violet-100 text-violet-600 rounded-xl hover:bg-violet-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 outline-none transition-all text-gray-950"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Confirmed', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List Area */}
      {/* 
        This is the critical fix: overflow-y-auto with a restricted height ensures
        listing scrolls independently without breaking the layout.
      */}
      <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No guests found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGuests.map((guest) => (
              <div 
                key={guest.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group border border-transparent hover:border-violet-100"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center flex-shrink-0 text-violet-600 font-semibold">
                  {guest.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{guest.name}</p>
                  <p className="text-xs text-gray-500 truncate">{guest.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  {guest.phone && (
                    <button
                      onClick={() => handleWhatsAppShare(guest, invitation)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                  <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${getStatusColor(guest.status)}`}>
                    {getStatusLabel(guest.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestList;
