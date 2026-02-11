'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import TemplateSelection from './TemplateSelection';
import { useRouter } from 'next/navigation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = async (template: Template) => {
    setIsSubmitting(true);
    
    try {
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
      formData.append('invitation_type', template.category.toLowerCase());
      formData.append('invitation_template_id', template.id);
      formData.append('metadata', JSON.stringify({}));
      
      const response = await fetch(`/api/invitations`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push(`/host/${data.id}`);
      }
    } catch (error) {
      console.error('Failed to create invitation:', error);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Creating your invitation...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <TemplateSelection 
      onSelect={handleTemplateSelect}
      onBack={onCancel}
    />
  );
}