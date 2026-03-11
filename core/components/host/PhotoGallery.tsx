"use client"
import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateSection } from '@/core/dataModels/templateFieldDataModel';

interface PhotoGalleryProps {
  initialPhotos?: string[];
  onUpload?: (files: FileList) => Promise<void>;
  invitationId: string;
  onImageUpload?: () => void;
  section:TemplateSection;
}

interface InvitationImage {
  type: string;
  image_url: string;
  public_id: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ section, onUpload, invitationId, onImageUpload }) => {
  console.log("Hellosdkjfalkjdlkjldksajl",section)
  const [photos, setPhotos] = useState<InvitationImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhotos = async () => {
    if (!section?.invitation_id || !section?.section_id) return;
    
    try {
      const response = await fetch(
        `/api/invitation-data/invitation/${section.invitation_id}/template_section/${section.section_id}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const result = await response.json();
        const fetchedImages = result.data.images || [];
        setPhotos(fetchedImages);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (section?.invitation_id && section?.section_id) {
      fetchPhotos();
    }
  }, [section?.invitation_id, section?.section_id]);
  const uploadToAPI = async (file: File): Promise<InvitationImage | null> => {
    if (!section?.invitation_id || !section?.section_id) return null;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('invitation_id', section.invitation_id);
    formData.append('template_section_id', section.section_id);
    
    const response = await fetch('/api/invitation-data/image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');

    const result = await response.json();
    return {
      type: 'general',
      image_url: result.url,
      public_id: result.public_id
    };
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      try {
        const uploadPromises = Array.from(e.target.files).map(uploadToAPI);
        const uploadedImages = await Promise.all(uploadPromises);
        const validImages = uploadedImages.filter((img): img is InvitationImage => img !== null);
        setPhotos(prev => [...prev, ...validImages]);
        onImageUpload?.();
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload photos. Please try again.');
      }
      
      setIsUploading(false);
    }
  };

  const removePhoto = async (publicId: string) => {
    if (!section?.invitation_id || !section?.section_id) return;

    try {
      const response = await fetch(
        '/api/invitation-data/image/c339d99c-fbe7-45f4-81b9-0cd721960edf',
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invitation_id: section.invitation_id,
            template_section_id: section.section_id,
            public_id: publicId,
          }),
        }
      );

      if (!response.ok) throw new Error('Delete failed');

      setPhotos(prev => prev.filter(img => img.public_id !== publicId));
      onImageUpload?.();
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };
  console.log(photos)
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5"style={{ 
              backgroundColor: 'var(--color-accent-primary)', 
              color: 'var(--color-text-white)' 
            }} />
            Photo Gallery
          </h3>
          <p className="text-sm text-gray-500">Share memories with your guests</p>
        </div>
       
        <div>
          <label style={{ 
              backgroundColor: 'var(--color-accent-primary)', 
              color: 'var(--color-text-white)' 
            }} className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium cursor-pointer transition-colors">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload Photos'}
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleUpload} 
              className="hidden" 
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent-primary)' }} />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
             <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-gray-900 font-medium mb-1">No photos yet</h4>
          <p className="text-gray-500 text-sm">Upload photos to create a gallery for your guests</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100"
              >
                <img 
                  src={photo.image_url} 
                  alt={`Gallery photo ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => removePhoto(photo.public_id)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
