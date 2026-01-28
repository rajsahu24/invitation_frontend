"use client";

import { X, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";


interface Invitation {
  id: string;
  user_id: string;

  invitation_title: string;
  invitation_message: string;
  invitation_tag_line: string;
  invitation_type: string;        // e.g. "wedding", "birthday", etc.
  invitation_template_id: string; // agar future me number banana ho to string | number bhi rakh sakte ho

  quick_action: Record<string, any>;
  metadata: Record<string, any>;  // flexible JSON object

  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string
}
interface InvitationPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  invitationData?: Invitation | null;
  onDataChange?: (data: any) => void;
}

export default function InvitationPreview({ 
  isOpen, 
  onClose, 
  invitationData,
  onDataChange
}: InvitationPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const invitation_url = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/template/${invitationData?.invitation_type}/${invitationData?.invitation_template_id}`
  // Reset iframe ready state when modal closes
  
  console.log(invitationData)
  useEffect(() => {
    if (!isOpen) {
      setIframeReady(false);
    }
  }, [isOpen]);
  
  // Listen for iframe ready signal and changes from iframe
  useEffect(() => {
    if (!isOpen) return;
    
    const handleMessage = (event: MessageEvent) => {
      console.log('Parent received message:', event.data);
      
      // Handle iframe ready signal
      if (event.data.type === 'IFRAME_READY') {
        console.log('Iframe is ready, sending initial data');
        setIframeReady(true);
        console.log("hello..................",iframeRef.current)
        // Send data immediately when iframe is ready
        if (invitationData && iframeRef.current?.contentWindow) {
          console.log('Sending data to ready iframe:', invitationData);
          iframeRef.current.contentWindow.postMessage({
            type: 'UPDATE_INVITATION',
            data: invitationData
          }, '*');
        }
      }
      
      // Handle data changes from iframe
      if (event.data.type === 'INVITATION_CHANGED' && onDataChange) {
        console.log('Data changed:', event.data.data);
        onDataChange(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, onDataChange, invitationData]);

  // Send data updates to iframe when data changes (only if iframe is ready)
  useEffect(() => {
    if (iframeReady && invitationData && iframeRef.current?.contentWindow) {
      console.log('Sending updated data to iframe:', invitationData);
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_INVITATION',
        data: invitationData
      }, '*');
    }
  }, [invitationData, iframeReady]);

  const handleIframeLoad = () => {
    console.log('Iframe loaded, waiting for IFRAME_READY signal');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Invitation Preview</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`p-2 rounded transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    title="Desktop view"
                  >
                    <Monitor className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`p-2 rounded transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    title="Mobile view"
                  >
                    <Smartphone className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <a
                  href={invitation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                </a>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-100">
              <div className={`h-full bg-white transition-all duration-300 ${viewMode === 'mobile' ? 'w-[375px] shadow-2xl' : 'w-full'}`}>
                <iframe
                  ref={iframeRef}
                  src={invitation_url}
                  className="w-full h-full border-0"
                  title="Invitation Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  onLoad={handleIframeLoad}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
