import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useHostStore, Template } from '../../../lib/store';

interface Invitation {
  id: string;
  user_id: string;
  invitation_title: string;
  invitation_message: string;
  invitation_tag_line: string;
  invitation_type: string;
  invitation_template_id: string;
  template_url?: string;
  public_id?:string;
  quick_action: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  invitationDetails: Invitation | undefined;
  onSelectTemplate?: (template: Template) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  currentTemplateId,
  invitationDetails,
  onSelectTemplate
}) => {

  const [category, setCategory] = useState<string>('All');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedTemplate } = useHostStore();

  useEffect(() => {
    if (isOpen) {
      const fetchTemplates = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`);
          const data = await response.json();
          setTemplates(data);
          
          // Set initial category based on invitation type if available
          if (invitationDetails?.invitation_type) {
            setCategory(invitationDetails.invitation_type);
          }
        } catch (error) {
          console.error('Failed to fetch templates:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTemplates();
    }
  }, [isOpen, invitationDetails?.invitation_type]);
  
  // Filter categories to only show the one matching the invitation type
  const allCategories = Array.from(new Set(templates.map(t => t.template_type.toLowerCase())));
  const categories = invitationDetails?.invitation_type 
    ? allCategories.filter(cat => cat === invitationDetails.invitation_type.toLowerCase())
        .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
    : ['All', ...allCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))];
  
  const filteredTemplates = templates.filter(t => {
    const templateType = t.template_type.toLowerCase();
    const invitationType = invitationDetails?.invitation_type?.toLowerCase();
    
    if (invitationType) {
      return templateType === invitationType;
    }
    
    return category === 'All' || templateType === category.toLowerCase();
  });

  const handleTemplateSelect = (template: Template) => {
    
    setSelectedTemplate(template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
                <p className="text-gray-500">Select a design for your invitation</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Categories */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex gap-2 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    category === cat
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {invitationDetails && filteredTemplates.map((template) =>{
                    const template_url = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`
                    return(
                   <motion.div
                     key={template.id}
                     layoutId={`template-${template.id}`}
                     whileHover={{ y: -4 }}
                     onClick={() => handleTemplateSelect(template)}
                     className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-sm hover:shadow-xl ${
                       currentTemplateId === template.id
                         ? 'border-violet-500 ring-4 ring-violet-50/50'
                         : 'border-transparent hover:border-gray-200'
                     }`}
                   >
                     <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                        <iframe
                           src={template_url}
                           className="w-full h-full border-0 pointer-events-none"
                           title={template.template_name}
                           scrolling="no"
                         />
                       
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          {currentTemplateId === template.id ? (
                              <div className="bg-violet-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg scale-105">
                                  <Check className="w-4 h-4" /> Selected
                              </div>
                          ) : (
                              <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                  Use Template
                              </div>
                          )}
                       </div>
 
                       {currentTemplateId === template.id && (
                         <div className="absolute top-3 right-3 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center shadow-lg z-10">
                           <Check className="w-4 h-4 text-white" />
                         </div>
                       )}
                     </div>
                     
                     <div className="p-4">
                       <h3 className="font-bold text-gray-900 truncate">{template.template_name}</h3>
                       <p className="text-sm text-gray-500">{template.template_type}</p>
                     </div>
                   </motion.div>
                   )
                  }
                  )}
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TemplateModal;
