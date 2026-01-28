import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Check, Calendar, MapPin, Type, Tags } from 'lucide-react';

interface Invitation {
    invitation_title: string;
    invitation_message: string;
    invitation_tag_line: string;
    invitation_type: string;
    metadata: Record<string, any>;
}

interface RealTimeData {
    invitation_title?: string;
    invitation_message?: string;
    invitation_tag_line?: string;
    invitation_type?: string;
    metadata?: Record<string, any>;
}

interface DetailsFormProps {
    initialData: Invitation;
    onSave: (data: Partial<Invitation>) => void;
    onRealTimeUpdate?: (data: RealTimeData) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ initialData, onSave, onRealTimeUpdate }) => {

    const [formData, setFormData] = useState({
        invitation_title: initialData.invitation_title || '',
        invitation_message: initialData.invitation_message || '',
        invitation_tag_line: initialData.invitation_tag_line || '',
        invitation_type: initialData.invitation_type || ''
    });
    const [metadata, setMetadata] = useState<Record<string, any>>(initialData.metadata || {});
    const [isDirty, setIsDirty] = useState(false);
    console.log(formData)
    // Debounce timer ref for real-time updates
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const DEBOUNCE_DELAY = 150; // ms

    // Debounced real-time update function
    const triggerRealTimeUpdate = useCallback((data: RealTimeData) => {
        if (!onRealTimeUpdate) return;
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            onRealTimeUpdate(data);
        }, DEBOUNCE_DELAY);
    }, [onRealTimeUpdate]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setFormData({
            invitation_title: initialData.invitation_title || '',
            invitation_message: initialData.invitation_message || '',
            invitation_tag_line: initialData.invitation_tag_line || '',
            invitation_type: initialData.invitation_type || ''
        });
        setMetadata(initialData.metadata || {});
    }, [initialData]);

    const handleChange = (field: string, value: string) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);
        setIsDirty(true);
        
        // Trigger real-time update with current form data and metadata
        triggerRealTimeUpdate({ ...newFormData, metadata });
    };

    const handleMetadataChange = (field: string, value: string) => {
        const newMetadata = { ...metadata, [field]: value };
        setMetadata(newMetadata);
        setIsDirty(true);
        
        // Trigger real-time update with current form data and new metadata
        triggerRealTimeUpdate({ ...formData, metadata: newMetadata });
    };

    const handleSave = () => {
        console.log(formData, metadata)
        onSave({ ...formData, metadata });
        setIsDirty(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-violet-500" />
                    Invitation Details
                </h3>
            </div>

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            value={formData.invitation_title}
                            onChange={(e) => handleChange('invitation_title', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                            placeholder="e.g. Rahul's Birthday Bash"
                        />
                    </div>
{/* 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            value={formData.invitation_message}
                            onChange={(e) => handleChange('invitation_message', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all resize-none"
                            placeholder="Write your invitation message..."
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Tag Line</label>
                        <div className="relative">
                            <Tags className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={formData.invitation_tag_line}
                                onChange={(e) => handleChange('invitation_tag_line', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                                placeholder="Invitation Tag Line"
                            />
                        </div>
                    </div>
                </div>

                {/* Dynamic Type-specific Fields */}
                <div className="border-t border-gray-100 pt-6">
                    {formData.invitation_type === 'wedding' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-violet-500" />
                                Wedding Details
                            </h4>
                            <div className="text-gray-900 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-xs font-semibold text-gray-700 flex items-center gap-2'  htmlFor="">Groom's Name</label>
                                    <input
                                        type="text"
                                        placeholder="Groom's Name"
                                        value={metadata.groom_name || ''}
                                        onChange={(e) => handleMetadataChange('groom_name', e.target.value)}
                                        className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 outline-none w-full"
                                    />
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-xs font-semibold text-gray-700 flex items-center gap-2' htmlFor="">Bride's Name</label>

                                <input
                                    type="text"
                                    placeholder="Bride's Name"
                                    value={metadata.bride_name || ''}
                                    onChange={(e) => handleMetadataChange('bride_name', e.target.value)}
                                    className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 outline-none w-full"
                                />
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-xs font-semibold text-gray-700 flex items-center gap-2'  htmlFor="">Invitation Date</label>
                                    <input
                                        type="date"
                                        value={metadata.wedding_date || ''}
                                        onChange={(e) => handleMetadataChange('wedding_date', e.target.value)}
                                        className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 outline-none w-full"
                                    />
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-xs font-semibold text-gray-700 flex items-center gap-2'  htmlFor="">Location</label>
                                    <input
                                        type="text"
                                        placeholder="Wedding Venue"
                                        value={metadata.wedding_location || ''}
                                        onChange={(e) => handleMetadataChange('wedding_location', e.target.value)}
                                        className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 outline-none w-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {formData.invitation_type === 'birthday' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Star className="w-4 h-4 text-blue-500" />
                                Birthday Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Birthday Person's Name"
                                    value={metadata.birthday_person_name || ''}
                                    onChange={(e) => handleMetadataChange('birthday_person_name', e.target.value)}
                                    className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-blue-500 outline-none w-full"
                                />
                                <input
                                    type="date"
                                    value={metadata.birthday_date || ''}
                                    onChange={(e) => handleMetadataChange('birthday_date', e.target.value)}
                                    className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-blue-500 outline-none w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Age"
                                    value={metadata.age || ''}
                                    onChange={(e) => handleMetadataChange('age', e.target.value)}
                                    className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-blue-500 outline-none w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Party Theme"
                                    value={metadata.theme || ''}
                                    onChange={(e) => handleMetadataChange('theme', e.target.value)}
                                    className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-blue-500 outline-none w-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                            isDirty 
                            ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-xl' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Check className="w-4 h-4" />
                        {isDirty ? 'Save Changes' : 'Saved'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailsForm;
