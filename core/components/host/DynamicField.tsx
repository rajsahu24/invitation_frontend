'use client';

import React from 'react';
import { TemplateField } from '@/core/dataModels/templateFieldDataModel';
import { Calendar, MapPin, Type, User, Hash } from 'lucide-react';

interface DynamicFieldProps {
  field: TemplateField;
  value: string;
  onChange: (key: string, value: string) => void;
  error?: string;
}


const getFieldLabel = (field: TemplateField): string => {
  return field.label || field.lebel || field.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};


const getFieldIcon = (field: TemplateField) => {
  const key = field.key.toLowerCase();
  const type = field.type.toLowerCase();

  if (key.includes('date') || type === 'date' || type === 'datetime-local') {
    return Calendar;
  }
  if (key.includes('location') || key.includes('venue') || key.includes('address')) {
    return MapPin;
  }
  if (key.includes('name') || key.includes('person')) {
    return User;
  }
  if (type === 'number') {
    return Hash;
  }
  return Type;
};

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
  const label = getFieldLabel(field);
  const Icon = getFieldIcon(field);
  const inputId = `field-${field.key}`;
  

  const fieldValue = value || field.value || '';

  const baseInputClasses = `
    w-full px-4 py-3 text-sm border rounded-xl 
    focus:ring-4 focus:ring-violet-100 outline-none transition-all
    text-gray-950 placeholder:text-gray-400
    ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-violet-500'}
  `;

  const renderInput = () => {
    switch (field.type) {
      case 'date':
        return (
          <input
            id={inputId}
            type="date"
            value={fieldValue}
            onChange={(e) => onChange(field.key, e.target.value)}
            required={field.required}
            className={baseInputClasses}
          />
        );

      case 'datetime-local':
        
        const datetimeValue = fieldValue ? fieldValue.replace('.000Z', '').slice(0, 16) : '';
        return (
          <input
            id={inputId}
            type="datetime-local"
            value={datetimeValue}
            onChange={(e) => onChange(field.key, e.target.value)}
            required={field.required}
            className={baseInputClasses}
          />
        );

      case 'number':
        return (
          <input
            id={inputId}
            type="number"
            value={fieldValue}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${label.toLowerCase()}`}
            required={field.required}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={inputId}
            value={fieldValue}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${label.toLowerCase()}`}
            required={field.required}
            rows={3}
            className={`${baseInputClasses} resize-none`}
          />
        );

      case 'text':
      default:
        return (
          <div className="relative">
            <Icon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id={inputId}
              type="text"
              value={fieldValue}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder || `Enter ${label.toLowerCase()}`}
              required={field.required}
              className={`${baseInputClasses} pl-10`}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label 
        htmlFor={inputId}
        className="text-xs font-semibold text-gray-700 flex items-center gap-2"
      >
        {label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DynamicField;
