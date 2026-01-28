import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

interface TemplateSelectorProps {
  currentTemplateId: string;
  templates: Template[];
  onSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplateId, templates, onSelect }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Layout className="w-4 h-4 text-violet-500" />
        Change Template
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template)}
            className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
              currentTemplateId === template.id
                ? 'border-violet-600 ring-2 ring-violet-100'
                : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-100 relative">
               <iframe
                  src={template.thumbnail}
                  className="w-full h-full border-0 pointer-events-none"
                  title={template.name}
                  scrolling="no"
                />
              {currentTemplateId === template.id && (
                <div className="absolute inset-0 bg-violet-600/10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-1 shadow-sm">
                    <div className="w-2 h-2 bg-violet-600 rounded-full" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-50 text-center">
              <p className="text-[10px] font-medium text-gray-700 truncate">{template.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
