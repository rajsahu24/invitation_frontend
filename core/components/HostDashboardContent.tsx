"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Search, Bell, Calendar, Plus, Edit, Image as ImageIcon, Layout, Users, BarChart3, Heart, Trash2 } from "lucide-react";
import { useHostStore } from "../../lib/store";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Components
import DashboardLayout from "./host/DashboardLayout";
import GuestList from "./host/GuestList";
import DetailsForm from "./host/DetailsForm";
import TemplateModal from "./host/TemplateModal";
import PreviewPane from "./host/PreviewPane";
import EventForm from "./host/EventForm";
import PhotoGallery from "./host/PhotoGallery";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: number;
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

const TEMPLATES = [
  {
    id: '1',
    name: 'Classic Wedding',
    category: 'Wedding',
    thumbnail: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/template/wedding/1`
  },
  {
    id: '2',
    name: 'Modern Wedding',
    category: 'Wedding',
    thumbnail: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/template/wedding/2`
  },
  {
    id: '3',
    name: 'Birthday Celebration',
    category: 'Birthday',
    thumbnail: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/template/birthday/1`
  },
  {
    id: '4',
    name: 'culture wedding',
    category: 'Wedding',
    thumbnail: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/template/wedding/3`
  }
];

function HostDashboardContent({ guests = [] }: { guests?: Guest[] }) {
  const { currentInvitationId, selectedTemplate } = useHostStore();
  
  const [invitationDetails, setInvitationDetails] = useState<Invitation | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });
  const [guestFile, setGuestFile] = useState<File | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Real-time preview data state
  const [realTimePreviewData, setRealTimePreviewData] = useState<{
    invitationId?: string;
    invitation_title?: string;
    invitation_message?: string;
    invitation_tag_line?: string;
    invitation_type?: string;
    metadata?: Record<string, any>;
    events?: any[];
  } | null>(null);
  
  // Fetch invitation details
  const fetchInvitationDetails = async () => {
    console.log(selectedTemplate)
    if (!currentInvitationId) return;
    try {
      const response = await fetch(`/api/invitations/${currentInvitationId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setInvitationDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch invitation details:', error);
    }
  };

  useEffect(() => {
    fetchInvitationDetails();
  }, [currentInvitationId]);

  // Fetch events
  const fetchEvents = async () => {
      if (!currentInvitationId) return;
      try {
        const response = await fetch(`/api/invitations/event/${currentInvitationId}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setEventsList(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

  useEffect(() => {
    fetchEvents();
  }, [currentInvitationId]);
  const handleUpdateInvitation = async (data: Partial<Invitation>) => {
    try {
      await fetch(`/api/invitations/${currentInvitationId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // Refresh local state to reflect changes
      fetchInvitationDetails();
    } catch (error) {
      console.error('Failed to save invitation data:', error);
    }
  };

  const handleTemplateSelect = (template: any) => {
    handleUpdateInvitation({
        invitation_template_id: template.id,
        invitation_type: template.category.toLowerCase()
    });
  };

  const handleAddGuest = async () => {
      
      if (!guestFile && (!newGuest.name || !newGuest.email)) {
        alert("Please either upload a file or fill in name and email");
        return;
      }
      
      try {
        let response;
        
        if (guestFile) {
           
          const formDataToSend = new FormData();
          formDataToSend.append('invitation_id', currentInvitationId || '');
          formDataToSend.append('file', guestFile);
          
          if (newGuest.name && newGuest.email) {
            formDataToSend.append('guests', JSON.stringify([newGuest]));
          }
         
          response = await fetch(`/api/guests/upload`, {
            method: 'POST',
            credentials: 'include',
            body: formDataToSend
          });
        } else {
          
          response = await fetch(`/api/guests/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              invitation_id: currentInvitationId,
              guests: [newGuest]
            })
          });
        }
        
        if (response.ok) {
          setNewGuest({ name: "", email: "", phone: "" });
          setGuestFile(null);
          setShowAddGuest(false);
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`Failed to add guest: ${error.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Failed to add guest:', error);
        alert('Failed to add guest. Please try again.');
      }
  };

  const invitation_url = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/template/${invitationDetails?.invitation_type}/${invitationDetails?.invitation_template_id}/${currentInvitationId}`;
  console.log("invitation_rilasdf",invitation_url)
  
  // Handler for real-time preview updates from DetailsForm
  const handleRealTimeUpdate = (data: {
    invitation_title?: string;
    invitation_message?: string;
    invitation_tag_line?: string;
    invitation_type?: string;
    metadata?: Record<string, any>;
  }) => {
    
    setRealTimePreviewData(data);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchEvents(); // Refresh events list
        setRefreshKey(prev => prev + 1); // Trigger iframe reload
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const Header = (
    <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={'/host'}
                className="p-2 hover:bg-violet-100 rounded-xl text-violet-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Invitation Editor</h1>
                <p className="text-xs text-gray-600">{invitationDetails?.invitation_title || "My Event"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  const Sidebar = (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4">
        <button
          onClick={() => setShowTemplateModal(true)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all group"
        >
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg">
                 <Layout className="w-5 h-5" />
             </div>
             <div className="text-left">
                 <p className="text-xs font-medium text-white/80">Current Template</p>
                 <p className="font-bold text-sm">Change Layout</p>
             </div>
          </div>
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
              <Edit className="w-4 h-4" />
          </div>
        </button>
      </div>

      <GuestList 
        guests={guests} 
        onAddGuest={() => setShowAddGuest(true)}
        invitationTitle={invitationDetails?.invitation_title}
      />
    </>
  );

  const Main = (
    <div className="bg-white rounded-3xl shadow-xl border border-white/20 overflow-hidden flex flex-col min-h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
            {[
                { id: "details", label: "Details", icon: Edit },
                { id: "events", label: "Events", icon: Calendar },
                { id: "photos", label: "Photos", icon: ImageIcon },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                        ? "text-violet-600 bg-white border-b-2 border-violet-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
             {activeTab === "details" && invitationDetails && (
                <DetailsForm 
                    initialData={invitationDetails} 
                    onSave={handleUpdateInvitation}
                    onRealTimeUpdate={handleRealTimeUpdate}
                />
             )}

             {activeTab === "photos" && invitationDetails?.id && (
                 <PhotoGallery 
                     invitationId={invitationDetails?.id} 
                     onImageUpload={() => setRefreshKey(prev => prev + 1)}
                 />
             )}

             {activeTab === "events" && (
                <div className="space-y-6">
                     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-violet-500" />
                                Sub-Events
                            </h3>
                            <button
                                onClick={() => setShowEventForm(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-sm font-medium hover:bg-violet-100"
                            >
                                <Plus className="w-4 h-4" /> Add Event
                            </button>
                        </div>
                        
                        {eventsList.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm">No sub-events created yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {eventsList.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{event.name}</h4>
                                            <p className="text-xs text-gray-500">{new Date(event.start_time).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => {
                                                    setEditingEvent(event);
                                                    setShowEventForm(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-white rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
             )}
        </div>
    </div>
  );
  // console.log(realTimePreviewData)
  if(selectedTemplate){
    console.log(selectedTemplate.thumbnail)
    console.log(invitation_url)
  }

  return (
    <>
      <DashboardLayout 
        header={Header}
        sidebar={Sidebar}
        main={Main}
        rightPanel={invitationDetails?.id&&<PreviewPane url={selectedTemplate ? selectedTemplate.thumbnail : invitation_url} isLoading={!invitationDetails} realTimeData={realTimePreviewData} invitation_id={invitationDetails?.id} refreshKey={refreshKey} />}
      />

      {/* Modals */}
      <TemplateModal 
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={TEMPLATES}
        currentTemplateId={invitationDetails?.invitation_template_id || ''}
        
      />

      {showEventForm && (
        <EventForm
            invitationId={currentInvitationId || ''}
            eventId={editingEvent?.id}
            eventData={editingEvent}
            onCancel={() => {
                setShowEventForm(false);
                setEditingEvent(null);
                fetchEvents();
                setRefreshKey(prev => prev + 1); // Trigger iframe reload
            }}
        />
      )}

      {/* Add Guest Modal */}
      <AnimatePresence>
        {showAddGuest && (
             <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-3xl w-full max-w-md p-6"
             >
                <h2 className="text-xl font-bold mb-4 text-gray-900">Add Guest</h2>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        className="w-full p-3 border rounded-xl text-gray-900"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full p-3 border rounded-xl text-gray-900" 
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="w-full p-3 border rounded-xl text-gray-900" 
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                    />
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or upload CSV</span>
                        </div>
                    </div>

                    <input 
                        type="file" 
                        accept=".csv"
                        className="w-full p-2 border rounded-xl text-sm"
                        onChange={(e) => setGuestFile(e.target.files?.[0] || null)}
                    />

                    <div className="flex gap-2 pt-2">
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Button clicked!");
                                handleAddGuest();
                            }}
                            className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700"
                        >
                            Add Guest
                        </button>
                         <button 
                            type="button"
                            onClick={() => setShowAddGuest(false)}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default HostDashboardContent;
