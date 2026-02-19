import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Type, Plus, Trash2, Edit2, X, Upload, Image as ImageIcon } from "lucide-react";
import {
  TemplateSection,
  TemplateField,
} from "@/core/dataModels/templateFieldDataModel";

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

const DetailsForm: React.FC<DetailsFormProps> = ({
  onRealTimeUpdate,
  section,
}) => {
  console.log("section in details form", section)
  const [data, setdata] = useState<Record<string, any>>({});
  const [savedData, setSavedData] = useState<Record<string, any>>({});
  const [repeatedEntries, setRepeatedEntries] = useState<
    Array<Record<string, any>>
  >([]);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // State for image file handling
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_DELAY = 150;
  const triggerRealTimeUpdate = useCallback(
    (data: RealTimeData) => {
      if (!onRealTimeUpdate) return;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(
        () => onRealTimeUpdate(data), 
        DEBOUNCE_DELAY,
      );
    },
    [onRealTimeUpdate],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Image handler functions
  const handleImageSelect = (fieldKey: string, file: File | undefined, index?: number) => {
    console.log("fdasfjlkjirwouiu",file)
    if (!file) return;
    
    if (section?.is_repeated && index !== undefined) {
      // For repeated sections, store the file with a composite key
      const compositeKey = `${fieldKey}_${index}`;
      setImageFiles(prev => ({ ...prev, [compositeKey]: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [compositeKey]: previewUrl }));
      
      // Update the repeated entry with a placeholder indicating an image is selected
      const newEntries = [...repeatedEntries];
      newEntries[index] = { ...newEntries[index], [fieldKey]: 'pending_upload' };
      setRepeatedEntries(newEntries);
    } else {
      // For non-repeated sections
      setImageFiles(prev => ({ ...prev, [fieldKey]: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [fieldKey]: previewUrl }));
    }
    
    setIsDirty(true);
  };

  const handleRemoveImage = (fieldKey: string, index?: number) => {
    const compositeKey = section?.is_repeated && index !== undefined 
      ? `${fieldKey}_${index}` 
      : fieldKey;
    
    // Revoke and remove preview URL
    if (imagePreviews[compositeKey]) {
      URL.revokeObjectURL(imagePreviews[compositeKey]);
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[compositeKey];
        return newPreviews;
      });
    }
    
    // Remove file
    setImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[compositeKey];
      return newFiles;
    });
    
    // Clear the data value
    handleMetadataChange(fieldKey, '', index);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!section?.invitation_id || !section?.section_id) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/invitation-data/invitation/${section.invitation_id}/template_section/${section.section_id}`,
          { credentials: "include" },
        );

        if (response.ok) {
          const result = await response.json();
          const fetchedData = result.data || {};

          if (section.is_repeated && Array.isArray(fetchedData)) {
            setRepeatedEntries(fetchedData);
            setdata({});
            setSavedData({});
          } else {
            setdata(fetchedData);
            setSavedData(fetchedData);
          }

          setHasExistingData(true);
          triggerRealTimeUpdate({ metadata: fetchedData });
        } else {
          setdata({});
          setSavedData({});
          setRepeatedEntries([]);
          setHasExistingData(false);
        }
      } catch (err) {
        setdata({});
        setSavedData({});
        setRepeatedEntries([]);
        setHasExistingData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [section?.invitation_id, section?.section_id]);

  const handleUpdateInvitation = async () => {
    if (!section?.invitation_id || !section?.section_id) return;

    const requiredFields =
      section.schema.fields.filter((f) => f.required) || [];
    const dataToValidate = section?.is_repeated ? repeatedEntries : [data];

    for (const entry of dataToValidate) {
      const missingFields = requiredFields.filter((f) => {
        // For image fields, check if there's a file selected or an existing value
        if (f.type === 'image') {
          const compositeKey = section?.is_repeated 
            ? `${f.key}_${dataToValidate.indexOf(entry)}` 
            : f.key;
          const hasFile = imageFiles[compositeKey];
          const hasValue = entry[f.key] && entry[f.key] !== 'pending_upload';
          return !hasFile && !hasValue;
        }
        return !entry[f.key];
      });
      if (missingFields.length > 0) {
        alert(
          `Please fill in required fields: ${missingFields.map((f) => f.label || f.key).join(", ")}`,
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      const method = hasExistingData ? "PATCH" : "POST";
      const url =
        method === "PATCH"
          ? `/api/invitation-data/invitation/${section.invitation_id}/template_section/${section.section_id}`
          : `/api/invitation-data`;

      const dataToSave = section?.is_repeated ? repeatedEntries : data;
      console.log("data to save", dataToSave);
      
      // Check if we have image files to upload
      const hasImageFiles = Object.keys(imageFiles).length > 0;
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add basic fields for POST
      if (method === "POST") {
        formData.append('invitation_id', section.invitation_id);
        formData.append('template_section_id', section.section_id);
      }
      
      formData.append('is_repeated', String(section?.is_repeated || false));
      
      // Add data as JSON string (backend will parse it)
      formData.append('data', JSON.stringify(dataToSave));
      
      // Add image files - use 'image' as field name (backend expects this)
      // Also add the field key so backend knows which field this image belongs to
      const imageEntries = Object.entries(imageFiles);
      if (imageEntries.length > 0) {
        // Get the first image file (backend only accepts single image)
        const [fieldKey, file] = imageEntries[0];
        if (file) {
          formData.append('image', file);
          formData.append('image_field_key', fieldKey);
        }
      }

      const response = await fetch(url, {
        method,
        credentials: "include",
        // Don't set Content-Type header - let browser set it with boundary for FormData
        body: hasImageFiles ? formData : JSON.stringify(
          method === "PATCH"
            ? { data: dataToSave, is_repeated: section?.is_repeated || false }
            : {
                invitation_id: section.invitation_id,
                template_section_id: section.section_id,
                data: dataToSave,
                is_repeated: section?.is_repeated || false,
              }
        ),
        // Only set JSON header if no image files
        ...(hasImageFiles ? {} : { headers: { "Content-Type": "application/json" } }),
      });

      if (!response.ok) throw new Error("Failed to save data");

      // Clear image files after successful upload
      setImageFiles({});
      // Cleanup preview URLs
      Object.values(imagePreviews).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      setImagePreviews({});

      if (section?.is_repeated) {
        // Keep repeated entries, just update saved state
      } else {
        setSavedData(data);
      }
      setHasExistingData(true);
      setIsDirty(false);
      triggerRealTimeUpdate({ metadata: {} });
    } catch (err) {
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetadataChange = (
    field: string,
    value: string,
    index?: number,
  ) => {
    console.log("Helloa")
    if (section?.is_repeated && index !== undefined) {
      const newEntries = [...repeatedEntries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      setRepeatedEntries(newEntries);
      setIsDirty(true);
    } else {
      const newdata = { ...data, [field]: value };
      setdata(newdata);
      setIsDirty(true);
      triggerRealTimeUpdate({ metadata: newdata });
    }
  };

  const addRepeatedEntry = () => {
    setRepeatedEntries([...repeatedEntries, {}]);
    setIsDirty(true);
  };

  const removeRepeatedEntry = async (id: string, index: number) => {
    const entry = repeatedEntries[index];
    const nanoId = id;

    if (nanoId && section?.invitation_id && section?.section_id) {
      try {
        const response = await fetch(
          `/api/invitation-data/delete_repeated_entry/invitation/${section.invitation_id}/template_section/${section.section_id}/nano_id/${nanoId}`,
          { method: "DELETE", credentials: "include" },
        );
        if (!response.ok) throw new Error("Failed to delete entry");
      } catch (err) {
        alert("Failed to delete entry. Please try again.");
        return;
      }
    }

    setRepeatedEntries(repeatedEntries.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const updateRepeatedEntry = async (id: string, index: number) => {
    if (!section?.invitation_id || !section?.section_id || !id) return;

    const entry = repeatedEntries[index];
    const { id: _, ...updateData } = entry;

    try {
      const response = await fetch(
        `/api/invitation-data/patch_repeated_entry/invitation/${section.invitation_id}/template_section/${section.section_id}/nano_id/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );
      if (!response.ok) throw new Error("Failed to update entry");
      setEditingIndex(null);
    } catch (err) {
      alert("Failed to update entry. Please try again.");
    }
  };

  const renderField = (field: TemplateField, index?: number) => {
    const label = field.label || field.lebel || field.key;
    const isRepeated = section?.is_repeated && index !== undefined;
    const value = isRepeated
      ? repeatedEntries[index]?.[field.key] || ""
      : data[field.key] || "";
    const inputType =
      field.type === "datetime" || field.type === "datetime-local"
        ? "datetime-local"
        : field.type;
    const hasId = isRepeated && repeatedEntries[index]?.id;
    const isDisabled = hasId && editingIndex !== index;

    if (field.type === "image") {
      const compositeKey = isRepeated ? `${field.key}_${index}` : field.key;
      const previewUrl = imagePreviews[compositeKey];
      const hasExistingImage = value && value !== 'pending_upload';
      
      return (
        <div key={field.key} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {/* Show preview if image exists */}
          {(previewUrl || hasExistingImage) && (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 mb-2">
              <img 
                src={previewUrl || value} 
                alt={label}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(field.key, index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(field.key, e.target.files?.[0], index)}
            className="hidden"
            id={`image-${compositeKey}`}
            disabled={isDisabled}
          />
          <label
            htmlFor={`image-${compositeKey}`}
            className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isDisabled 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                : 'border-gray-300 hover:border-violet-500 hover:bg-violet-50'
            }`}
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {hasExistingImage || previewUrl ? 'Change Image' : 'Upload Image'}
            </span>
          </label>
        </div>
      );
    }

    if (
      field.type === "textarea" ||
      field.key.toLowerCase().includes("description")
    ) {
      return (
        <div key={field.key} className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-gray-700">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            placeholder={field.placeholder || label}
            value={value}
            onChange={(e) =>
              handleMetadataChange(field.key, e.target.value, index)
            }
            required={field.required}
            disabled={isDisabled}
            rows={4}
            className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all w-full resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
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
          onChange={(e) =>
            handleMetadataChange(field.key, e.target.value, index)
          }
          required={field.required}
          disabled={isDisabled}
          className="px-4 py-3 text-sm border border-gray-200 text-gray-950 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all w-full appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          style={{ colorScheme: "light" }}
        />
      </div>
    );
  };

  const renderSectionFields = (section: TemplateSection) => {
    const sortedFields = [...section.schema.fields].sort(
      (a, b) => a.order - b.order,
    );
    
    if (section.is_repeated) {
            return (
        <div className="space-y-6">
          {repeatedEntries.map((entry, index) => {
            const id = entry.id;
            const isEditing = editingIndex === index;
            const isNewEntry = !id;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-2xl p-4 relative"
              >
                {!isNewEntry && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => updateRepeatedEntry(id, index)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingIndex(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRepeatedEntry(id, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {sortedFields.map((field) => renderField(field, index))}
                </div>
              </motion.div>
            );
          })}
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
          {sortedFields.map((field) => renderField(field))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Type className="w-5 h-5 text-violet-500" />
          {section ? section.schema.label : "Invitation Details"}
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
              ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-xl"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Check className="w-4 h-4" />
          {isLoading ? "Saving..." : isDirty ? "Save Changes" : "Saved"}
        </button>
      </div>
    </div>
  );
};

export default DetailsForm;
