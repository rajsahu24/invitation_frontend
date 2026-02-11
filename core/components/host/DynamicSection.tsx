'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TemplateField } from '@/core/dataModels/templateFieldDataModel';
import DynamicField from './DynamicField';
import { Heart, Users, FileText, LucideIcon } from 'lucide-react';

interface DynamicSectionProps {
  title?: string;
  icon?: LucideIcon;
  fields: TemplateField[];
  values: Record<string, any>;
  onChange: (key: string, value: string) => void;
  errors?: Record<string, string>;
  columns?: 1 | 2;
  accentColor?: string;
}

// Map section names to icons
const sectionIcons: Record<string, LucideIcon> = {
  'invitation_details': FileText,
  'family_details': Users,
  'wedding': Heart,
  'events': FileText,
};

// Map section names to accent colors
const sectionColors: Record<string, string> = {
  'invitation_details': 'text-violet-500',
  'family_details': 'text-pink-500',
  'wedding': 'text-rose-500',
  'events': 'text-blue-500',
};

const DynamicSection: React.FC<DynamicSectionProps> = ({
  title,
  icon,
  fields,
  values,
  onChange,
  errors = {},
  columns = 2,
  accentColor,
}) => {
  // Sort fields by order
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);
  
  // Determine icon and color based on title or provided props
  const sectionKey = title?.toLowerCase().replace(/\s+/g, '_') || '';
  const IconComponent = icon || sectionIcons[sectionKey] || FileText;
  const colorClass = accentColor || sectionColors[sectionKey] || 'text-violet-500';

  if (sortedFields.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {title && (
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${colorClass}`} />
          {title}
        </h4>
      )}
      
      <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {sortedFields.map((field) => (
          <DynamicField
            key={field.key}
            field={field}
            value={values[field.key] || ''}
            onChange={onChange}
            error={errors[field.key]}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DynamicSection;
