import React, { useRef, useEffect } from 'react';
import { Eye, ExternalLink, Smartphone, Monitor } from 'lucide-react';

interface RealTimeData {
  invitation_title?: string;
  invitation_message?: string;
  invitation_tag_line?: string;
  invitation_type?: string;
  metadata?: Record<string, any>;
}

interface PreviewPaneProps {
  url: string;
  isLoading?: boolean;
  realTimeData?: RealTimeData | null;
  invitation_id: string;
  refreshKey?: number;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ url, isLoading = false, realTimeData, invitation_id, refreshKey }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  console.log("real time data in preview pane: ", realTimeData)
  const url_slipt = url.split('/')
  let templateUrl
  if(url_slipt.length===7){
    templateUrl = `${url}`
  }
  else{
    templateUrl = `${url}/${invitation_id}`
  }
  console.log(templateUrl)
  // Extract the target origin from the URL for secure postMessage
  const getTargetOrigin = (iframeUrl: string): string => {
    try {
      
      const urlObj = new URL(iframeUrl);
      return urlObj.origin;
    } catch {
      // If URL parsing fails, return the template service URL from env or fallback
      return process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL || 'http://localhost:5173';
    }
  };
  // Send real-time updates to iframe via postMessage
  useEffect(() => {
    if (!realTimeData || !iframeRef.current?.contentWindow) return;
    const targetOrigin = getTargetOrigin(url);
    
    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'INVITATION_PREVIEW_UPDATE',
          payload: realTimeData
        },
        targetOrigin
      );
    } catch (error) {
      console.error('Failed to send postMessage to preview iframe:', error);
    }
  }, [realTimeData, url]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-white/20 overflow-hidden flex flex-col h-[calc(100vh-120px)] sticky top-24">
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between z-10">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-violet-500" />
            Live Preview
          </h3>
          <p className="text-xs text-gray-500">Updates in real-time</p>
        </div>
        
        <div className="flex items-center gap-2">
           <a 
             href={templateUrl} 
             target="_blank" 
             rel="noreferrer"
             className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-violet-600 transition-colors"
             title="Open in new tab"
           >
             <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : null}

        <div className="w-full h-full max-w-[400px] bg-white shadow-2xl rounded-[2rem] overflow-hidden border-8 border-gray-900 relative">
          {/* Phone Notch (Visual Flair) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-10" />
          
          <iframe
            ref={iframeRef}
            key={refreshKey} // Force reload when refreshKey changes
            src={templateUrl}
            className="w-full h-full border-0 bg-white"
            title="Invitation Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
