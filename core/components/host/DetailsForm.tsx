import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Type, Tags, Upload, X, Plus, Trash2 } from 'lucide-react';
import { TemplateSection, TemplateField } from '@/core/dataModels/templateFieldDataModel';



interface RealTimeData {
    invitation_title?: string;
    invitation_message?: string;
    invitation_tag_line?: string;
    invitation_type?: string;
    metadata?: Record<string, any>;
}

interface DetailsFormProps {
    onRealTimeUpdate?: (data: RealTimeData) => void;
    section?: TemplateSection;
    
}

const DetailsForm: React.FC<DetailsFormProps> = ({   onRealTimeUpdate, section }) => {
    const [data, setdata] = useState<Record<string, any>>({});
    const [savedData, setSavedData] = useState<Record<string, any>>({});
    const [repeatedEntries, setRepeatedEntries] = useState<Array<Record<string, any>>>([]);
    const [savedImages, setSavedImages] = useState<Array<{type: string, image_url: string, public_id: string}>>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
    const [deletingImages, setDeletingImages] = useState<Record<string, boolean>>({});
    
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const DEBOUNCE_DELAY = 150;

    const triggerRealTimeUpdate = useCallback((data: RealTimeData) => {
        if (!onRealTimeUpdate) return;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => onRealTimeUpdate(data), DEBOUNCE_DELAY);
    }, [onRealTimeUpdate]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!section?.invitation_id || !section?.section_id) return;
            
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/api/invitation-data/invitation/${section.invitation_id}/template_section/${section.section_id}`,
                    { credentials: 'include' }
                );
                
                if (response.ok) {
                    const result = await response.json();
                    const fetchedData = result.data || {};
                    const fetchedImages = result.data.images || [];
                    
                    if (section.is_repeated && Array.isArray(fetchedData)) {
                        setRepeatedEntries(fetchedData);
                        setdata({});
                        setSavedData({});
                    } else {
                        setdata(fetchedData);
                        setSavedData(fetchedData);
                       
                    }
                    
                    setSavedImages(fetchedImages);
                    triggerRealTimeUpdate({ metadata: fetchedData });
                } else {
                    setdata({});
                    setSavedData({});
                    setRepeatedEntries([]);
                    setSavedImages([]);
                }
            } catch (err) {
                setdata({});
                setSavedData({});
                setRepeatedEntries([]);
                setSavedImages([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [section?.invitation_id, section?.section_id]);

    const handleUpdateInvitation = async () => {
        if (!section?.invitation_id || !section?.section_id) return;

        const requiredFields = section.schema.fields.filter(f => f.required) || [];
        const dataToValidate = section?.is_repeated ? repeatedEntries : [data];
        
        for (const entry of dataToValidate) {
            const missingFields = requiredFields.filter(f => !entry[f.key]);
            if (missingFields.length > 0) {
                alert(`Please fill in required fields: ${missingFields.map(f => f.label || f.key).join(', ')}`);
                return;
            }
        }

        setIsLoading(true);
        try {
            const method = Object.keys(savedData).length > 0 || repeatedEntries.length > 0 ? 'PATCH' : 'POST';
            const url = method === 'PATCH' 
                ? `/api/invitation-data/invitation/${section.invitation_id}/template_section/${section.section_id}`
                : `/api/invitation-data`;
            
            const dataToSave = section?.is_repeated ? repeatedEntries : data;
            const body = method === 'PATCH' 
                ? dataToSave
                : {
                    invitation_id: section.invitation_id,
                    template_section_id: section.section_id,
                    data: dataToSave
                };

            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) throw new Error('Failed to save data');
            
            if (section?.is_repeated) {
                // Keep repeated entries, just update saved state
            } else {
                setSavedData(data);
            }
            setIsDirty(false);
            triggerRealTimeUpdate({ metadata: {} });
        } catch (err) {
            alert('Failed to save changes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleMetadataChange = (field: string, value: string, index?: number) => {
        if (section?.is_repeated && index !== undefined) {
            const newEntries = [...repeatedEntries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            setRepeatedEntries(newEntries);
            setIsDirty(true);
        } else {
            const newdata = {...data, [field]: value };
            setdata(newdata);
            setIsDirty(true);
            triggerRealTimeUpdate({  metadata: newdata });
        }
    };

    const addRepeatedEntry = () => {
        setRepeatedEntries([...repeatedEntries, {}]);
        setIsDirty(true);
    };

    const removeRepeatedEntry = (index: number) => {
        setRepeatedEntries(repeatedEntries.filter((_, i) => i !== index));
        setIsDirty(true);
    };

    const handleImageChange = async (field: string, file: File) => {
        if (!section?.invitation_id || !section?.section_id) return;
        
        setUploadingImages(prev => ({ ...prev, [field]: true }));
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('invitation_id', section.invitation_id);
        formData.append('template_section_id', section.section_id);

        try {
            const response = await fetch('/api/invitation-data/image', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const result = await response.json();
            const imageUrl = result.url;
            const publicId = result.public_id;
            setSavedImages(prev => [...prev, { type: 'general', image_url: imageUrl, public_id: publicId }]);
        } catch (err) {
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImages(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleImageDelete = async (publicId: string) => {
        if (!section?.invitation_id || !section?.section_id) return;

        setDeletingImages(prev => ({ ...prev, [publicId]: true }));

        try {
            const response = await fetch('/api/invitation-data/image/c339d99c-fbe7-45f4-81b9-0cd721960edf', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invitation_id: section.invitation_id,
                    template_section_id: section.section_id,
                    public_id: publicId
                })
            });

            if (!response.ok) throw new Error('Failed to delete image');

            setSavedImages(prev => prev.filter(img => img.public_id !== publicId));
        } catch (err) {
            alert('Failed to delete image. Please try again.');
        } finally {
            setDeletingImages(prev => ({ ...prev, [publicId]: false }));
        }
    };



    const renderField = (field: TemplateField, index?: number) => {
        const label = field.label || field.lebel || field.key;
        const isRepeated = section?.is_repeated && index !== undefined;
        const value = isRepeated ? (repeatedEntries[index]?.[field.key] || '') : (data[field.key] || '');
        const inputType = field.type === 'datetime' || field.type === 'datetime-local' ? 'datetime-local' : field.type;
        const isFullWidth = field.type === 'image' || field.type === 'textarea' || field.key.toLowerCase().includes('description');
        
        if (field.type === 'image') {
            const isUploading = uploadingImages[field.key];
            
            return (
                <div key={field.key} className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-700">
                        {label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {savedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {savedImages.map((img, idx) => {
                                const isDeleting = deletingImages[img.public_id];
                                return (
                                    <div key={idx} className="relative h-32 border border-gray-200 rounded-xl overflow-hidden">
                                        <img src={img.image_url} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover" />
                                        {isDeleting ? (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(img.public_id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    <div className="relative">
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center w-full h-32 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                                <span className="text-sm text-gray-500 mt-2">Uploading...</span>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-violet-500 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click to upload {label}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleImageChange(field.key, e.target.files[0])}
                                    className="hidden"
                                    required={field.required && savedImages.length === 0}
                                />
                            </label>
                        )}
                    </div>
                </div>
            );
        }

        if (field.type === 'textarea' || field.key.toLowerCase().includes('description')) {
            return (
                <div key={field.key} className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-700">
                        {label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                        placeholder={field.placeholder || label}
                        value={value}
                        onChange={(e) => handleMetadataChange(field.key, e.target.value, index)}
                        required={field.required}
                        rows={4}
                        className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all w-full resize-none"
                    />
                </div>
            );
        }

        return (
            <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                    {label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type={inputType}
                    placeholder={field.placeholder || label}
                    value={value}
                    onChange={(e) => handleMetadataChange(field.key, e.target.value, index)}
                    required={field.required}
                    className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all w-full appearance-none"
                    style={{ colorScheme: 'light' }}
                />
            </div>
        );
    };



    const renderSectionFields = (section: TemplateSection) => {
        const sortedFields = [...section.schema.fields].sort((a, b) => a.order - b.order);

        if (section.is_repeated) {
            return (
                <div className="space-y-6">
                    {repeatedEntries.map((entry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 rounded-2xl p-4 relative"
                        >
                            <button
                                type="button"
                                onClick={() => removeRepeatedEntry(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {sortedFields.map(field => renderField(field, index))}
                            </div>
                        </motion.div>
                    ))}
                    <button
                        type="button"
                        onClick={addRepeatedEntry}
                        className="w-full py-3 border-2 border-dashed border-violet-300 rounded-xl text-violet-600 hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add {section.schema.label}
                    </button>
                </div>
            );
        }

        return (
            <motion.div
                key={section.section_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedFields.map(field => renderField(field))}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-violet-500" />
                    {section ? section.schema.label : 'Invitation Details'}
                </h3>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading...</div>
                ) : (
                    section && renderSectionFields(section)
                )}
            </div>

            <div className="pt-6 border-t border-gray-100 mt-auto">
                <button
                    onClick={handleUpdateInvitation}
                    disabled={!isDirty || isLoading}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        isDirty && !isLoading
                        ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <Check className="w-4 h-4" />
                    {isLoading ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
                </button>
            </div>
        </div>
    );
};

export default DetailsForm;
