"use client";

import type { Template } from '@/lib/store';
import React, { useState } from 'react';
import { useHostStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

function TemplateGallery({ template_data }: { template_data: Template[] }) {
    const { user } = useHostStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { setSelectedTemplate } = useHostStore();
  const router = useRouter();

  // Filter active templates first
  const activeTemplates = template_data.filter(t => t.is_active === true || t.is_active === undefined);
  const categories = ['all', ...Array.from(new Set(activeTemplates.map(t => t.template_type)))];

  const filteredTemplates = activeTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.template_type === selectedCategory;
    const matchesSearch = template.template_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateClick = async (template: Template) => {
    if (!user) {
      // Store pending invitation and redirect to login
      localStorage.setItem('pending_invitation', JSON.stringify({
        id: template.id,
        template_type: template.template_type,
        template_name: template.template_name
      }));
      router.push('/login');
      return;
    }

    // Direct creation if logged in
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
       console.log("formData.......",template)
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
        router.push(`/host/${data.id}`);
      }
    } catch (error) {
      console.error('Failed to create invitation:', error);
    }
  };

  return (
    <div className="min-h-screen py-14" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Choose Your Template</h1>
          <p className="" style={{ color: 'var(--color-text-body)' }}>Select a beautiful template to create your invitation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border outline-none transition"
            style={{ 
              borderColor: 'var(--color-border)', 
              backgroundColor: 'var(--color-card-bg)',
              color: 'var(--color-text-body)',
              fontFamily: 'var(--font-body)'
            }}
          />
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'text-white'
                    : ''
                }`}
                style={{ 
                  backgroundColor: selectedCategory === category ? 'var(--color-accent-primary)' : 'var(--color-card-bg)',
                  color: selectedCategory === category ? 'var(--color-text-white)' : 'var(--color-text-body)',
                  border: selectedCategory === category ? 'none' : '1px solid var(--color-border)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium" style={{ color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>No templates found</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-card-bg)', 
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-body)'
                }}
                onClick={()=> handleTemplateClick(template)}
              >
                <div className="relative aspect-[9/16] overflow-hidden" style={{ backgroundColor: 'var(--color-bg-section-alt)' }}>
                  <img
                    src={template.thumbnail || template.template_image || '/placeholder-template.jpg'}
                    alt={template.template_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect fill="%23f3f4f6" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3ETemplate%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full py-2 px-4 rounded-lg font-medium transition"
                      style={{ 
                        backgroundColor: 'var(--color-accent-primary)', 
                        color: 'var(--color-text-white)' 
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1" style={{ color: 'var(--color-text-heading)' }}>{template.template_name}</h3>
                  <p className="text-sm capitalize" style={{ color: 'var(--color-text-body)' }}>{template.template_type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateGallery;