"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Sparkles, ArrowLeft, Search, Bell, Calendar, Plus, Edit2, Edit, Image as ImageIcon, Layout, Users, BarChart3, Heart, Trash2, Link2, Copy, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useHostStore } from "../../lib/store";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Components
import DashboardLayout from "./host/DashboardLayout";
import GuestList from "./host/GuestList";
import DetailsForm from "./host/DetailsForm";
import TemplateModal from "./host/TemplateModal";
import PreviewPane from "./host/PreviewPane";
import PhotoGallery from "./host/PhotoGallery";
import { TemplateSection } from "../dataModels/templateFieldDataModel";


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
  slug?:string
  public_id:string;
  created_at: string;
  updated_at: string;
  template: any;
}



function HostDashboardContent({ 
  guests = [], 
  templateSection,
  invitation,
  invitationId 
}: { 
  guests?: Guest[]; 
  templateSection?: TemplateSection[];
  invitation?: Invitation;
  invitationId?: string;
}) {
  const { currentInvitationId, setCurrentInvitation, selectedTemplate } = useHostStore(); 
  console.log(invitation)

  const [invitationDetails, setInvitationDetails] = useState<Invitation | undefined>(invitation);
   console.log("Guests List.......",guests)
  // Set default active tab to 'invitation_details'
    // Real-time preview data state
  const [realTimePreviewData, setRealTimePreviewData] = useState<{
    invitationId?: string;
    invitation_title?: string;
    invitation_message?: string;
    invitation_tag_line?: string;
    invitation_type?: string;
    metadata?: Record<string, any>;
    events?: any[];
    section_type?: string;
    slug?:string
    slugError?: string | null;
  } | null>(null);
  const [activeTab, setActiveTab] = useState('hero_section');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });
  const [guestFile, setGuestFile] = useState<File | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localSections, setLocalSections] = useState<TemplateSection[]>(templateSection || []);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [invitationSlug, SetInvitationSlug] = useState<string | undefined>(undefined);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [editedSlug, setEditedSlug] = useState('');
  const [slugUpdateLoading, setSlugUpdateLoading] = useState(false);
  const [slugUpdateError, setSlugUpdateError] = useState<string | null>(null);
  const [slugUpdateSuccess, setSlugUpdateSuccess] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ left: false, right: false });
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  
  // Sync invitationSlug: priority to invitationDetails.slug (user updated), then realTimePreviewData.slug (from form)
  useEffect(() => {
    // If user has updated slug in invitationDetails, use that
    if (invitationDetails?.slug) {
      SetInvitationSlug(invitationDetails.slug);
    } 
    // Otherwise use the slug from realTimePreviewData (generated from form details)
    else if (realTimePreviewData?.slug) {
      SetInvitationSlug(realTimePreviewData.slug);
    }
  }, [invitationDetails?.slug, realTimePreviewData?.slug]);
  
  const template_key =  invitation?.template?.template_key
  console.log(invitationDetails)
  const fetchTemplateSections = async () => {
    if (!currentInvitationId) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/template-sections/invitation/${currentInvitationId}`, {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        
        setLocalSections(data);
        
        // If the current active tab is no longer available in the new sections,
        // switch back to the first available section
        if (data.length > 0 && !data.find((s: TemplateSection) => s.section_type === activeTab)) {
           const firstSection = data.sort((a: TemplateSection, b: TemplateSection) => a.display_order - b.display_order)
                                     .find((s: TemplateSection) => s.is_active);
           if (firstSection) {
             setActiveTab(firstSection.section_type);
           }
        }
      }
    } catch (error) {
      console.error('Failed to fetch template sections:', error);
    }
  };
  
  // Sync store with invitationId from URL
  useEffect(() => {
    if (invitationId && currentInvitationId !== invitationId) {
      setCurrentInvitation(invitationId);
    }
  }, [invitationId, currentInvitationId, setCurrentInvitation]);


  console.log("realTimePreviewData",realTimePreviewData)
  // Fetch invitation details if not provided by prop
  const fetchInvitationDetails = async () => {
    if (!currentInvitationId || invitationDetails) return;
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
    if (!invitationDetails) {
        fetchInvitationDetails();
    }
  }, [currentInvitationId]);



  useEffect(() => {
    if (!activeTab) {
      setActiveTab('hero_section');
    }
  }, [activeTab]);


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

  const invitation_url = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${invitationDetails?.invitation_type}/${invitationDetails?.invitation_template_id}/${currentInvitationId}`;
  const invitation_share_url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${invitationSlug}`
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(invitation_share_url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

    const handleSaveSlug = async () => {
    if (!editedSlug.trim() || !currentInvitationId) return;
    
    setSlugUpdateLoading(true);
    setSlugUpdateError(null);
    
    try {
      const response = await fetch(
        `/api/invitations/update_slug/invitation/${currentInvitationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ slug: editedSlug.trim() }),
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        const newSlug = result.slug || editedSlug.trim();
        SetInvitationSlug(newSlug);
        setInvitationDetails(prev => prev ? { ...prev, slug: newSlug } : prev);
        setRealTimePreviewData(prev => prev ? { ...prev, slug: newSlug } : null);
        setIsEditingSlug(false);
        setSlugUpdateSuccess(true);
        setTimeout(() => setSlugUpdateSuccess(false), 2000);
      } else {
        const errorData = await response.json();
        setSlugUpdateError(errorData.message || 'Failed to update slug');
      }
    } catch (error) {
      console.error('Failed to update slug:', error);
      setSlugUpdateError('Failed to update slug. Please try again.');
    } finally {
      setSlugUpdateLoading(false);
    }
  };

  const handleStartEditSlug = () => {
    setEditedSlug(invitationSlug || '');
    setIsEditingSlug(true);
    setSlugUpdateError(null);
    setSlugUpdateSuccess(false);
  };

  const handleCancelEditSlug = () => {
    setIsEditingSlug(false);
    setEditedSlug('');
    setSlugUpdateError(null);
  };

  // Check scroll position for tab navigation
  const checkScrollPosition = useCallback(() => {
    const container = tabsScrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setScrollPosition({
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 1
      });
    }
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = tabsScrollRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.6;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  
  
  
  const handleTemplateSelect = async (template: any) => {
    console.log("selected TEmplate",template)
    if (!currentInvitationId) return;
    
    try {
      const response = await fetch(`/api/invitations/${currentInvitationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          invitation_template_id: template.id
        })
      });

      if (response.ok) {
        const updatedInvitation = await response.json();
        setInvitationDetails(updatedInvitation);
        console.log('Template updated successfully in backend');
        // Refresh sections to match new template
        await fetchTemplateSections();
      } else {
        console.error('Failed to update template in backend');
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleRealTimeUpdate = useCallback((data: {
    invitation_title?: string;
    invitation_message?: string;
    invitation_tag_line?: string;
    invitation_type?: string;
    metadata?: Record<string, any>;
    section_type?: string;
    slug?: string;
    slugError?: string | null;
  }) => {
    
    setRealTimePreviewData(data);
  }, []);



  const Header = (
    <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href={'/host'}
                className="p-2 rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--color-bg-section-alt)', color: 'var(--color-accent-primary)' }}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)' }}>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Invitation Editor</h1>
                <p className="text-xs truncate max-w-[150px] sm:max-w-none" style={{ color: 'var(--color-text-body)' }}>{invitationDetails?.invitation_title || "My Event"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  const Sidebar = (
    <>
      <div className="bg-white rounded-3xl shadow-sm border p-4 mb-4" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all group"
          style={{ background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)' }}
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

      <div className="bg-white rounded-3xl shadow-sm border p-4 mb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-heading)' }}>Invitation URL</h3>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col  gap-2">
            {isEditingSlug ? (
              <>
                <input
                  type="text"
                  value={editedSlug}
                  onChange={(e) => setEditedSlug(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--color-accent-primary)', 
                    backgroundColor: 'var(--color-bg-section-alt)', 
                    color: 'var(--color-text-body)'
                  }}
                  placeholder="Enter custom URL slug"
                />
                <button
                  onClick={handleSaveSlug}
                  disabled={slugUpdateLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md whitespace-nowrap disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--color-accent-primary)', 
                    color: 'var(--color-text-white)' 
                  }}
                >
                  {slugUpdateLoading ? (
                    <span className="text-sm font-medium">Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Save</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEditSlug}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap"
                  style={{ 
                    backgroundColor: 'var(--color-bg-section-alt)', 
                    color: 'var(--color-text-body)' 
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={invitation_share_url}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border rounded-lg truncate"
                  style={{ 
                    borderColor: 'var(--color-border)', 
                    backgroundColor: 'var(--color-bg-section-alt)', 
                    color: 'var(--color-text-body)' 
                  }}
                />
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                  style={{ 
                    backgroundColor: 'var(--color-accent-primary)', 
                    color: 'var(--color-text-white)' 
                  }}
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleStartEditSlug}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap"
                  style={{ 
                    backgroundColor: 'var(--color-bg-section-alt)', 
                    color: 'var(--color-text-body)' 
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Update your invitation link
                </button>
              </>
            )}
          </div>
          {slugUpdateSuccess && (
            <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-accent-secondary)' }}>
              <Check className="w-3 h-3" />
              URL updated successfully!
            </p>
          )}
          {slugUpdateError && (
            <p className="text-xs flex items-center gap-1" style={{ color: '#E07B5A' }}>
              <X className="w-3 h-3" />
              {slugUpdateError}
            </p>
          )}
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Share this URL with your guests to view the invitation</p>
        </div>
      </div>

      <GuestList 
        guests={guests} 
        onAddGuest={() => setShowAddGuest(true)}
        invitation={invitationDetails}
      />  
    </>
  );

  
  const tabs = useMemo(() => {
    const tabsList: Array<{ id: string; label: string; icon: any,  }> = [
    
    ];
    
    if (localSections && Array.isArray(localSections)) {
      localSections
        .filter(section => section.is_active )
        .sort((a, b) => a.display_order - b.display_order)
        .forEach((section) => {
          tabsList.push({ 
            id: section.section_id, 
            label: section.section_type, 
            icon: section.section_type === 'event_section' ? Calendar : Sparkles 
          });
        });
    }
    
    
    
    return tabsList;
  }, [localSections]);
  
  // Check scroll position on mount and when tabs change
  useEffect(() => {
    // Delay to ensure DOM is rendered
    const timer = setTimeout(checkScrollPosition, 100);
    return () => clearTimeout(timer);
  }, [tabs, checkScrollPosition]);
    
  const Main = (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[400px] sm:min-h-[600px]" style={{ borderColor: 'var(--color-border)' }}>
        
        <div className="relative border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-section-alt)' }}>
            {/* Scroll Left Button */}
            <button
                onClick={() => scrollTabs('left')}
                className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-md transition-all hover:scale-110 hidden md:flex items-center justify-center ${
                    scrollPosition.left ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                    backgroundColor: 'var(--color-accent-primary)', 
                    color: 'var(--color-text-white)'
                }}
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Scroll Right Button */}
            <button
                onClick={() => scrollTabs('right')}
                className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-md transition-all hover:scale-110 hidden md:flex items-center justify-center ${
                    scrollPosition.right ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                    backgroundColor: 'var(--color-accent-primary)', 
                    color: 'var(--color-text-white)'
                }}
                aria-label="Scroll right"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex overflow-x-auto custom-scrollbar-h scroll-smooth"
                ref={tabsScrollRef}
                onScroll={checkScrollPosition}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.label)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.label
                            ? "bg-white shadow-sm"
                            : "hover:bg-white/50"
                        }`}
                        style={{
                            color: activeTab === tab.label ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                            
                        }}
                    >
                        <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{tab.label.replace("_"," ").toUpperCase()}</span>
                        <span className="sm:hidden">{tab.label.split("_")[0].toUpperCase()}</span>
                    </button>
                ))}
            </div>
            
            {/* Mobile Scroll Indicator Gradients */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l to-transparent pointer-events-none md:hidden" style={{ background: 'linear-gradient(to left, var(--color-bg-section-alt), transparent)' }} />
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r to-transparent pointer-events-none md:hidden" style={{ background: 'linear-gradient(to right, var(--color-bg-section-alt), transparent)' }} />
            
            {/* Desktop Scroll Hint - Shows when there's more content */}
            <div className={`hidden md:block absolute right-0 top-0 bottom-0 w-12 pointer-events-none transition-opacity duration-300 ${
                scrollPosition.right ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 pr-2">
                    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        {/* <span>More</span> */}
                        <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto flex-1 h-full">

             {localSections && localSections.map((section) => {
                if (activeTab === section.section_type && invitationDetails) {
                  if (section.section_type === "image_section") {
                    return (
                      <PhotoGallery 
                        key={section.section_id}
                        invitationId={invitationDetails.id} 
                        onImageUpload={() => setRefreshKey(prev => prev + 1)}
                        section={section}
                      />
                    );
                  }
                  return (
                    <DetailsForm 
                      key={section.section_id}
                      template_key={template_key}
                      onRealTimeUpdate={handleRealTimeUpdate}
                      section={section}
                    />
                  );
                }
                return null;
             })}


        </div>
    </div>
  );
  // console.log(realTimePreviewData)

  const slug = isEditingSlug?editedSlug:realTimePreviewData?.slug
  return (
    <>
      <DashboardLayout 
        header={Header}
        sidebar={Sidebar}
        main={Main}
        rightPanel={invitationDetails?.id&&<PreviewPane url={selectedTemplate ? selectedTemplate.thumbnail : invitation_url} isLoading={!invitationDetails} realTimeData={realTimePreviewData} public_id={invitationDetails?.public_id} invitation_id={invitationDetails.id} refreshKey={refreshKey} activeSection={activeTab} slug={slug} />}
      />

      {/* Modals */}
      <TemplateModal 
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleTemplateSelect}
        currentTemplateId={invitationDetails?.invitation_template_id || ''}
        invitationDetails={invitationDetails}
      />



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
               className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md p-4 sm:p-6 mx-4"
             >
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Add Guest</h2>
                <div className="space-y-3 sm:space-y-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl text-gray-900"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl text-gray-900" 
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl text-gray-900" 
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
                        className="w-full p-2 border rounded-xl text-xs sm:text-sm teaxt-gray-800"
                                                    style={{ 
                                borderColor: 'var(--color-accent-primary)', 
                                color: 'var(--color-accent-primary)' 
                            }}
                        onChange={(e) => setGuestFile(e.target.files?.[0] || null)}
                    />

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Button clicked!");
                                handleAddGuest();
                            }}
                            className="flex-1 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold"
                            style={{ 
                                backgroundColor: 'var(--color-accent-primary)', 
                                color: 'var(--color-text-white)' 
                            }}
                        >
                            Add Guest
                        </button>
                         <button 
                            type="button"
                            onClick={() => setShowAddGuest(false)}
                            className="flex-1 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
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
