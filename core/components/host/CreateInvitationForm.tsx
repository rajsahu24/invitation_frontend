'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, ArrowLeft, Upload, Plus, X, Users, Calendar, Heart, Star, Zap, Music } from 'lucide-react';
import TemplateSelection from './TemplateSelection';
import { useRouter } from 'next/navigation';

interface Guest {
  name: string;
  email: string;
  phone: string;
}

interface Event {
  event_name: string;
  start_time: string;
  end_time: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  thumbnail: string;
}

interface Props {
    onCancel: () => void;
}

export default function CreateInvitationForm({ onCancel }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    message: '',
    location: '',
    invitation_type: '',
    template_id: ''
  });
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState<Guest>({ name: '', email: '', phone: '' });
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestFile, setGuestFile] = useState<File | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({ event_name: '', start_time: '', end_time: '' });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setGuestFile(file);
    }
  };

  const addEvent = () => {
    if (newEvent.event_name && newEvent.start_time && newEvent.end_time) {
      setEvents(prev => [...prev, newEvent]);
      setNewEvent({ event_name: '', start_time: '', end_time: '' });
      setShowAddEvent(false);
    }
  };

  const removeEvent = (index: number) => {
    setEvents(prev => prev.filter((_, i) => i !== index));
  };

  const addGuest = () => {
    if (newGuest.name && newGuest.email) {
      setGuests(prev => [...prev, newGuest]);
      setNewGuest({ name: '', email: '', phone: '' });
      setShowAddGuest(false);
    }
  };

  const removeGuest = (index: number) => {
    setGuests(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('invitation_title', formData.title);
      formDataToSend.append('invitation_message', formData.message);
      formDataToSend.append('invitation_tag_line', formData.location);
      formDataToSend.append('invitation_type', formData.invitation_type);
      formDataToSend.append('metadata', JSON.stringify(metadata));
      formDataToSend.append('guests', JSON.stringify(guests));
      formDataToSend.append('events', JSON.stringify(events));
      formDataToSend.append('invitation_template_id', formData.template_id || selectedTemplate?.id || '');

      
      if (guestFile) {
        formDataToSend.append('guestFile', guestFile);
      }
      
      const response = await fetch(`/api/invitations`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });
      onCancel()
    } catch (error) {
      console.error('Failed to create invitation:', error);
    }
    
    setIsSubmitting(false);
  };

  const handleTemplateSelect = (template: Template) => {
    
    setSelectedTemplate(template);
    setFormData(prev => ({ 
      ...prev, 
      template_id: template.id,
      invitation_type: template.category.toLowerCase()
    }));
    setCurrentStep('details');
  };

  if (currentStep === 'template') {
    return (
      <TemplateSelection 
        onSelect={handleTemplateSelect}
        onBack={onCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.button 
            onClick={() => currentStep === 'details' ? setCurrentStep('template') : onCancel()}
            className="mb-6 flex items-center text-violet-600 hover:text-violet-800 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 'details' ? 'Back to Templates' : 'Back to Dashboard'}
        </motion.button>

        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
        >
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white mb-4 shadow-lg">
              <Sparkles className="w-8 h-8" />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Invitation</h1>
           <p className="text-gray-600">Fill in the details to bring your invitation to life</p>
        </motion.div>

        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-violet-500" />
                        Basic Information
                    </h3>
                    
                    <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                            <div className="w-full text-gray-950 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-gray-50">
                                {formData.invitation_type ? formData.invitation_type.charAt(0).toUpperCase() + formData.invitation_type.slice(1) : 'No type selected'}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setCurrentStep('template')}
                            className="px-4 py-3 bg-violet-600 text-white text-sm rounded-xl hover:bg-violet-700 transition-colors whitespace-nowrap"
                        >
                            Change Template
                        </button>
                    </div>

                        {/* Wedding Details */}
                        {formData.invitation_type === 'wedding' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-violet-50 rounded-2xl p-4 md:p-6 border border-violet-100"
                            >
                                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-violet-500" />
                                    Wedding Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Groom's name"
                                        value={metadata.groom_name || ''}
                                        onChange={e => setMetadata({...metadata, groom_name: e.target.value})}
                                        className="px-4 py-3 text-gray-950 text-sm border-2 border-gray-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bride's name"
                                        value={metadata.bride_name || ''}
                                        onChange={e => setMetadata({...metadata, bride_name: e.target.value})}
                                        className="px-4 py-3 text-gray-950 text-sm border-2 border-gray-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                    />
                                    <input
                                        type="date"
                                        value={metadata.wedding_date || ''}
                                        onChange={e => setMetadata({...metadata, wedding_date: e.target.value})}
                                        className="px-4 py-3 text-sm border-2 text-gray-950 border-gray-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Wedding venue"
                                        value={metadata.wedding_location || ''}
                                        onChange={e => setMetadata({...metadata, wedding_location: e.target.value})}
                                        className="px-4 py-3 text-sm border-2 text-gray-950 border-gray-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Birthday Details */}
                        {formData.invitation_type === 'birthday' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-50 rounded-2xl p-4 md:p-6 border border-blue-100"
                            >
                                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-blue-500" />
                                    Birthday Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Birthday person's name"
                                        value={metadata.birthday_person_name || ''}
                                        onChange={e => setMetadata({...metadata, birthday_person_name: e.target.value})}
                                        className="px-4 py-3 text-sm border-2 text-gray-950 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    />
                                    <input
                                        type="date"
                                        value={metadata.birthday_date || ''}
                                        onChange={e => setMetadata({...metadata, birthday_date: e.target.value})}
                                        className="px-4 py-3 text-sm border-2 text-gray-950 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Party venue"
                                        value={metadata.birthday_location || ''}
                                        onChange={e => setMetadata({...metadata, birthday_location: e.target.value})}
                                        className="sm:col-span-2 px-4 py-3 text-sm border-2 text-gray-950 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Rahul & Priya's Wedding"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-3 text-gray-950 text-sm border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Udaipur, Rajasthan"
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                    className="w-full px-4 py-3 text-gray-950 text-sm border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Invitation Message</label>
                            <textarea 
                                required
                                placeholder="Come join us for a wonderful celebration..."
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                className="w-full px-4 py-3 text-sm border-2 text-gray-950 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all h-20 resize-none"
                            />
                        </div>
                    </div>
                </div>



                {/* Events */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-500" />
                        Events
                    </h3>
                    
                    <button
                        type="button"
                        onClick={() => setShowAddEvent(!showAddEvent)}
                        className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-700 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Event
                    </button>

                    {showAddEvent && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Event name"
                                    value={newEvent.event_name}
                                    onChange={e => setNewEvent({...newEvent, event_name: e.target.value})}
                                    className="px-3 py-2 text-sm border border-gray-200 text-gray-950 rounded-lg focus:border-violet-500 outline-none transition-all"
                                />
                                <input
                                    type="datetime-local"
                                    value={newEvent.start_time}
                                    onChange={e => setNewEvent({...newEvent, start_time: e.target.value})}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-950 focus:border-violet-500 outline-none transition-all"
                                />
                                <input
                                    type="datetime-local"
                                    value={newEvent.end_time}
                                    onChange={e => setNewEvent({...newEvent, end_time: e.target.value})}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-950 focus:border-violet-500 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addEvent}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
                            >
                                Add Event
                            </button>
                        </motion.div>
                    )}

                    {events.length > 0 && (
                        <div className="space-y-2">
                            {events.map((event, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div>
                                        <span className="font-medium text-gray-900 text-sm">{event.event_name}</span>
                                        <p className="text-xs text-gray-500">{new Date(event.start_time).toLocaleString()}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEvent(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Guests */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-500" />
                        Guest List
                    </h3>
                    
                    <div>
                        <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-violet-400 cursor-pointer bg-gray-50 transition-colors">
                            <Upload className="w-5 h-5 mr-2 text-gray-400" />
                            <span className="text-gray-600 text-sm font-medium">
                                {guestFile ? guestFile.name : 'Upload CSV file (name, email, phone)'}
                            </span>
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddGuest(!showAddGuest)}
                        className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-700 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Guest Manually
                    </button>

                    {showAddGuest && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newGuest.name}
                                    onChange={e => setNewGuest({...newGuest, name: e.target.value})}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 outline-none transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newGuest.email}
                                    onChange={e => setNewGuest({...newGuest, email: e.target.value})}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 outline-none transition-all"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={newGuest.phone}
                                    onChange={e => setNewGuest({...newGuest, phone: e.target.value})}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addGuest}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
                            >
                                Add Guest
                            </button>
                        </motion.div>
                    )}

                    {guests.length > 0 && (
                        <div className="space-y-2">
                            {guests.map((guest, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div>
                                        <span className="font-medium text-gray-900 text-sm">{guest.name}</span>
                                        <p className="text-xs text-gray-500">{guest.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeGuest(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom URL */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-violet-500" />
                        Custom URL (Optional)
                    </h3>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-violet-500 transition-all">
                        <span className="text-gray-500 px-4 py-3 text-sm font-medium">indoorloop.com/invite/</span>
                        <input 
                            type="text" 
                            placeholder="your-special-day"
                            value={formData.slug}
                            onChange={e => setFormData({...formData, slug: e.target.value})}
                            className="flex-1 px-2 py-3 text-sm bg-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={isSubmitting || !formData.title || !formData.message || !formData.location || !formData.invitation_type}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none shadow-lg"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                Create Invitation 
                                <ArrowRight className="w-6 h-6" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
      </div>
    </div>
  );
}