"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  thumbnail: string;
}

interface TemplateSelectionProps {
  onSelect: (template: Template) => void;
  onBack: () => void;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Classic Wedding',
    category: 'Wedding',
    previewUrl: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/1`,
    thumbnail: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/1`
  },
  {
    id: '2',
    name: 'Modern Wedding',
    category: 'Wedding',
    previewUrl: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/2`,
    thumbnail:  `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/2`
  },
  {
    id: '3',
    name: 'Birthday Celebration',
    category: 'Birthday',
    previewUrl: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/birthday/1`,
    thumbnail:  `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/birthday/1`
  }
];

export default function TemplateSelection({ onSelect, onBack }: TemplateSelectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [category, setCategory] = useState<string>('All');

  const categories = ['All', 'Wedding', 'Birthday', 'Corporate'];
  const filteredTemplates = category === 'All' 
    ? templates 
    : templates.filter(t => t.category === category);

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Template</h1>
              <p className="text-gray-600">Select a template for your invitation</p>
            </div>
          </div>
          
          {selectedTemplate && (
            <button
              onClick={handleSelect}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
            >
              <Check className="w-5 h-5" />
              Use This Template
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                category === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-violet-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="aspect-[3/4] bg-gray-100 relative">
                <iframe
                  src={template.thumbnail}
                  className="w-full h-full border-0"
                  title={template.name}
                />
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      onSelect(template);
                    }}
                    className="px-3 py-1 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}