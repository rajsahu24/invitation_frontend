'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  invitationId: string;
  onCancel: () => void;
}

export default function UpdateInvitationForm({ invitationId, onCancel }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    message: '',
    location: '',
    invitation_type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/${invitationId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.invitation_title || '',
            slug: data.slug || '',
            message: data.invitation_message || '',
            location: data.invitation_tag_line || '',
            invitation_type: data.invitation_type || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch invitation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          invitation_title: formData.title,
          invitation_message: formData.message,
          invitation_tag_line: formData.location,
          invitation_type: formData.invitation_type,
          slug: formData.slug
        })
      });
      
      if (response.ok) {
        onCancel();
      }
    } catch (error) {
      console.error('Failed to update invitation:', error);
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <button 
          onClick={onCancel}
          className="mb-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 text-violet-600 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Invitation</h1>
          <p className="text-gray-500">Modify your invitation details.</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Rahul & Priya's Wedding"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Invitation Message</label>
              <textarea 
                required
                placeholder="e.g. Come join us for a wonderful celebration"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Udaipur, Rajasthan"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Invitation Type</label>
              <select
                required
                value={formData.invitation_type}
                onChange={e => setFormData({...formData, invitation_type: e.target.value})}
                className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
              >
                <option value="">Select Invitation Type</option>
                <option value="0">Wedding</option>
                <option value="1">Birthday</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug (Optional)</label>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2 text-sm">indoorloop.com/invite/</span>
                <input 
                  type="text" 
                  placeholder="rahul-priya"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="flex-1 px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.message || !formData.location || !formData.invitation_type}
                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Update Invitation <ArrowRight className="w-5 h-5" />
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