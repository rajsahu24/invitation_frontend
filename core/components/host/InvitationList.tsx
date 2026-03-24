'use client';

import { motion } from 'framer-motion';
import { Plus, LogOut, Sparkles, ChevronRight, Settings, Calendar } from 'lucide-react';
import { useHostStore } from '../../../lib/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateInvitationForm from './CreateInvitationForm';
import UpdateInvitationForm from './UpdateInvitationForm';
import Link from 'next/link';

interface InvitationEvent {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  capacity?: number;
}

interface Invitation {
  id: string;
  invitation_title: string;
  hostName: string;
  events: InvitationEvent[];
  created_at: Date;
  updated_at: Date;
  status?: 'draft' | 'published' | 'past';
}

interface InvitationListProps {
  initialInvitations?: Invitation[];
}

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as any }
  }
};

export default function InvitationList({ initialInvitations = [] }: InvitationListProps) {
  const { user, logout } = useHostStore();
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
    if (user?.id) {
      try {
        const response = await fetch(`/api/invitations/user/${user.id}`, {
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

  useEffect(() => {
    const processPendingInvitation = async () => {
      const pendingData = localStorage.getItem('pending_invitation');
      if (!pendingData || !user?.id) return;

      try {
        setLoading(true);
        const template = JSON.parse(pendingData);
        const now = new Date();
        const invitationTitle = now.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }) + ' ' + now.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        const formData = new FormData();
        formData.append('invitation_title', invitationTitle);
        formData.append('invitation_type', template.template_type.toLowerCase());
        formData.append('invitation_template_id', template.id);
        formData.append('metadata', JSON.stringify({}));

        const response = await fetch(`/api/invitations`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.removeItem('pending_invitation');
          router.push(`/host/${data.id}`);
        }
      } catch (error) {
        console.error('Failed to create pending invitation:', error);
      } finally {
        setLoading(false);
      }
    };

    processPendingInvitation();
  }, [user?.id, router]);

  useEffect(() => {
    if (initialInvitations.length > 0) {
      setLoading(false);
      return;
    }

    const fetchInvitations = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/invitations/user/${user.id}`, {
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header */}
      {/* <header className="bg-white/80 backdrop-blur-sm border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                style={{ background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Welcome back</p>
                <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>{user?.name}</h1>
              </div>
            </div>
            
            <button 
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-section-alt)' }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header> */}

      <main className="container-landing pt-28  py-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-1 items-center justify-between mb-8">
          <div className='text-center md:text-left'>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>
              Your Invitations
            </h2>
            <p className="mt-1" style={{ color: 'var(--color-text-body)' }}>
              Manage and track all your event invitations
            </p>
          </div>
          
          <button
            onClick={onCreateNew}
            className="group px-5 py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            style={{ 
              backgroundColor: 'var(--color-accent-primary)', 
              color: 'var(--color-text-white)' 
            }}
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            New Invitation
          </button>
        </div>

        {/* Grid View */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Loading State */}
          {loading && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border animate-pulse" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </>
          )}

          {/* Invitation Cards */}
          {invitations
            .sort((a, b) => {
              const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
              const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
              return dateB - dateA;
            })
            .map((invite) => (
              <motion.div
                key={invite.id}
                variants={itemVariants}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <Link href={`/host/${invite.id}`} className="block">
                {/* Card Cover */}
                <div className="relative h-40 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/30" />
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      {invite.status || 'Active'}
                    </span>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold truncate pr-2" style={{ color: 'var(--color-text-heading)', fontFamily: 'var(--font-display)' }}>
                      {invite.invitation_title}
                    </h3>
                    <button 
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                      onClick={(e) => handleSettingsClick(e, invite.id)}
                      style={{ backgroundColor: 'var(--color-bg-section-alt)' }}
                    >
                      <Settings className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {/* <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-body)' }}>
                      <Calendar className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                      <span>{invite.events && invite.events.length > 0 ? `${invite.events.length} event${invite.events.length > 1 ? 's' : ''}` : 'No events set'}</span>
                    </div> */}
                    {invite.events && invite.events[0]?.location && (
                      <div className="flex items-center gap-2 text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{invite.events[0].location}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(invite.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-accent-primary)' }}>
                      Edit Invitation
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                </Link>

                {/* Guest List link — separate from the card link */}
                <div className="px-5 pb-4">
                  <Link
                    href={`/host/guest-list/${invite.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
                    style={{ backgroundColor: 'rgba(74,124,89,0.08)', color: 'var(--color-accent-primary)', border: '1.5px solid rgba(74,124,89,0.2)' }}
                  >
                    Guest List
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Empty State */}
        {!loading && invitations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-section-alt)' }}>
              <Sparkles className="w-12 h-12" style={{ color: 'var(--color-accent-secondary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>No invitations yet</h3>
            <p className="mb-6" style={{ color: 'var(--color-text-body)' }}>Create your first invitation to get started</p>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              style={{ 
                backgroundColor: 'var(--color-accent-primary)', 
                color: 'var(--color-text-white)' 
              }}
            >
              <Plus className="w-5 h-5" />
              Create Invitation
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
