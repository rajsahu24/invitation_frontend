"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

import { useHostStore, Template } from '../../../lib/store';

interface TemplateSelectionProps {
  onSelect: (template: Template) => void;
  onBack: () => void;
}

export default function TemplateSelection({ onSelect, onBack }: TemplateSelectionProps) {
  const { setSelectedTemplate: setStoreSelectedTemplate } = useHostStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [category, setCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  console.log("local selected template", selectedTemplate);
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`);
        const data = await response.json();
        
        // Filter to only show active templates
        const activeTemplates = data.filter((template: any) => 
          template.is_active === true || template.is_active === undefined
        );
        
        const formattedTemplates = activeTemplates.map((template: any) => ({
          id: template.id,
          template_name: template.template_name,
          template_type: template.template_type,
          previewUrl: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`,
          thumbnail: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`
        }));
        
        setTemplates(formattedTemplates);
        console.log("formattedTemplates", formattedTemplates);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.template_type)))];
  const filteredTemplates = category === 'All' 
    ? templates 
    : templates.filter(t => t.template_type === category);

  
    const handleSelect = () => {
    if (selectedTemplate) {

      onSelect(selectedTemplate);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'var(--color-bg-section-alt)', color: 'var(--color-text-heading)' }}
            >
              <ArrowLeft className="w-6 h-6 " />
            </button>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Choose Template</h1>
              <p style={{ color: 'var(--color-text-body)' }}>Select a template for your invitation</p>
            </div>
          </div>
          
          {selectedTemplate && (
            <button
              onClick={handleSelect}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-accent-primary)' }}
            >
              <Check className="w-5 h-5" />
              Use This Template
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8">
          {categories.map((cat,i) => (
            <button
              key={cat+i}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full font-medium transition-colors"
              style={{ 
                backgroundColor: category === cat ? 'var(--color-accent-primary)' : 'var(--color-card-bg)',
                color: category === cat ? 'var(--color-text-white)' : 'var(--color-text-body)',
                border: category === cat ? 'none' : '1px solid var(--color-border)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-accent-primary)' }}></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all"
              style={{
                borderColor: selectedTemplate?.id === template.id ? 'var(--color-accent-primary)' : 'var(--color-border)',
              }}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="aspect-[3/4] bg-gray-100 relative">
                <iframe
                  src={template.thumbnail}
                  className="w-full h-full border-0"
                  title={template.template_name}
                />
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-accent-primary)' }}>
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--color-text-heading)' }}>{template.template_name}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{template.template_type}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      console.log("Selecting template:", template);
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setStoreSelectedTemplate(template);
                      onSelect(template);
                    }}
                    className="px-3 py-1 text-white text-sm rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--color-accent-primary)' }}
                  >
                    Select
                  </button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}