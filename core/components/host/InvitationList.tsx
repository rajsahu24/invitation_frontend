'use client';

import { motion } from 'framer-motion';
import { Plus, Calendar, Settings, LogOut } from 'lucide-react';
import { useHostStore } from '../../../lib/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateInvitationForm from './CreateInvitationForm';
import UpdateInvitationForm from './UpdateInvitationForm';

interface InvitationEvent {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface Invitation {
  id: string;
  invitation_title: string;
  hostName: string;
  events: InvitationEvent[];
}

interface InvitationListProps {
  initialInvitations?: Invitation[];
}

export default function InvitationList({ initialInvitations = [] }: InvitationListProps) {
  const { user, logout, setCurrentInvitation, updateInvitation } = useHostStore();
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [loading, setLoading] = useState(invitations.length === 0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState<string | null>(null);
  const router = useRouter();

  const onCreateNew = () => {
    setShowCreateForm(true);
  };

  const onCancelCreate = async () => {
    setShowCreateForm(false);
    setShowUpdateForm(null);
    // Refetch invitations after creating
    if (user?.id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/user/${user.id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const invitationData = await response.json();
          setInvitations(invitationData || []);
        }
      } catch (error) {
        console.error('Failed to fetch invitations:', error);
      }
    }
  };

  const handleSettingsClick = (e: React.MouseEvent, invitationId: string) => {
    e.stopPropagation();
    setShowUpdateForm(invitationId);
  };

  const handleInvitationClick = async (invitation: Invitation) => {
    try {
      // Fetch detailed invitation data
      const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/${invitation.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const invitationData = await response.json();
        
        // Transform API data to match store interface
        const transformedInvitation = {
          id: invitationData.id,
          title: invitationData.invitation_title,
          slug: invitationData.slug || 'event',
          hostName: invitationData.hostName || user?.name || 'Host',
          createdAt: invitationData.created_at || new Date().toISOString(),
          events: (invitationData.events || []).map((event: any) => ({
            id: event.id,
            name: event.name,
            date: event.date,
            time: event.start_time,
            location: event.location || '',
            capacity: event.capacity?.toString() || '',
            guestsCount: 0
          }))
        };
        
        // Store invitation data in store
        updateInvitation(transformedInvitation);
        setCurrentInvitation(invitation.id);
        // Navigate to dashboard with invitation ID
        router.push(`/host/${invitation.id}`);
      }
    } catch (error) {
      console.error('Failed to fetch invitation details:', error);
    }
  };

  useEffect(() => {
    // Only fetch if no initial data and we have a user
    if (initialInvitations.length > 0) {
      setLoading(false);
      return;
    }

    const fetchInvitations = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/user/${user.id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const invitationData = await response.json();
          setInvitations(invitationData || []);
        }
      } catch (error) {
        console.error('Failed to fetch invitations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [user?.id, initialInvitations.length]);
  if (showCreateForm) {
    return <CreateInvitationForm onCancel={onCancelCreate} />;
  }

  if (showUpdateForm) {
    return <UpdateInvitationForm invitationId={showUpdateForm} onCancel={onCancelCreate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-lg font-bold text-gray-900">Welcome, {user?.name}</h1>
          </div>
          <button 
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Invitations</h2>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 bg-violet-600 cursor-pointer text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card (Empty State or First Item) */}
          <button
            onClick={onCreateNew}
            className="group flex flex-col cursor-pointer items-center justify-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-violet-300 hover:bg-violet-50/50 transition-all min-h-[200px]"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-violet-500" />
            </div>
            <span className="font-bold text-gray-900">Create New Invitation</span>
            <span className="text-sm text-gray-500 mt-1">Design a new experience</span>
          </button>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          )}

          {/* Invitation Cards */}
          {invitations.map((invite) => {
          

            return (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleInvitationClick(invite)}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-100 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded-md">
                      {invite.events?.length || 0} Events
                    </span>
                    <Settings 
                      className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors cursor-pointer" 
                      onClick={(e) => handleSettingsClick(e, invite.id)}
                    />
                  </div>
  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{invite.invitation_title}</h3>
                  <p className="text-sm text-gray-500 mb-6">Hosted by {invite.hostName}</p>
  
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Calendar className="w-4 h-4" />
                    {invite.events?.length > 0 
                      ? `Next: ${invite.events[0].date}`
                      : 'No events scheduled'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
