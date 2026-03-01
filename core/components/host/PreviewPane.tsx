import React, { useRef, useEffect, useState } from 'react';
import { Eye, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { useHostStore } from '../../../lib/store';

interface RealTimeData {
  invitation_title?: string;
  invitation_message?: string;
  invitation_tag_line?: string;
  invitation_type?: string;
  metadata?: Record<string, any>;
  section_type?: string;
}

interface PreviewPaneProps {
  url: string;
  isLoading?: boolean;
  realTimeData?: RealTimeData | null;
  public_id: string;
  refreshKey?: number;
  invitation_id:string;
  activeSection?: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ url, isLoading = false, realTimeData, public_id, refreshKey, invitation_id, activeSection }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [templateUrl, setTemplateUrl] = useState<string>('');
  const { selectedTemplate } = useHostStore();
  const button_url =  `https://inviteera.com/${public_id}`
  console.log(selectedTemplate  )
  useEffect(() => {
    console.log('PreviewPane useEffect triggered:', { public_id, selectedTemplate, refreshKey });
    console.log(selectedTemplate) 
    const updateTemplateUrl = async () => {
      try {
        
        if (selectedTemplate) {
          const templateName = selectedTemplate.template_name.replace(/ /g, "_")
           const constructedUrl = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/preview/${selectedTemplate.template_type}/${templateName}/${invitation_id}`;
           console.log('Using selectedTemplate preview URL:', constructedUrl);
           console.log(`/preview/${selectedTemplate.template_type}/${selectedTemplate.template_name}/${invitation_id}`)
           setTemplateUrl(constructedUrl);
        } else if (public_id) {
           const constructedUrl = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${public_id}`;
           console.log('Using public_id URL:', constructedUrl);
           setTemplateUrl(constructedUrl);
        }
      } catch (error) {
        console.error('Failed to update template URL:', error);
      }
    };

    updateTemplateUrl();
  }, [public_id, selectedTemplate, refreshKey, invitation_id]);
  // Extract the target origin from the URL for secure postMessage
  const getTargetOrigin = (iframeUrl: string): string => {
    try {
      console.log("hello",iframeUrl)
      const urlObj = new URL(iframeUrl);
      console.log("urlObj", urlObj)
      return urlObj.origin;
    } catch {
      // If URL parsing fails, return the template service URL from env or fallback
      return process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL || 'http://localhost:5173';
    }
  };
  // Send real-time updates to iframe via postMessage
  useEffect(() => {
    console.log('PostMessage useEffect triggered:', { realTimeData, templateUrl });
    
    if (!iframeRef.current?.contentWindow || !templateUrl) {
      console.log('PostMessage conditions not met:', {
        hasContentWindow: !!iframeRef.current?.contentWindow,
        hasTemplateUrl: !!templateUrl
      });
      return;
    }
    
    // Send message even if realTimeData is null (for initial load)
    const sendMessage = () => {
      try {
        const targetOrigin = getTargetOrigin(templateUrl);
        console.log('Sending postMessage:', { realTimeData, targetOrigin });
        
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'INVITATION_PREVIEW_UPDATE',
            payload: realTimeData || {}
          },
          targetOrigin
        );
        console.log('PostMessage sent successfully');
      } catch (error) {
        console.error('Failed to send postMessage to preview iframe:', error);
      }
    };

    // Send message after a short delay to ensure iframe is loaded
    const timer = setTimeout(sendMessage, 1000);
    return () => clearTimeout(timer);
  }, [realTimeData, templateUrl]);

  // Handle auto-scroll to section
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !templateUrl || !activeSection) return;

    const sendScrollMessage = () => {
      try {
        const targetOrigin = getTargetOrigin(templateUrl);
        console.log('Sending SCROLL_TO_SECTION message:', { activeSection, targetOrigin });
        
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'SCROLL_TO_SECTION',
            sectionId: activeSection
          },
          targetOrigin
        );
      } catch (error) {
        console.error('Failed to send scroll message:', error);
      }
    };

    const timer = setTimeout(sendScrollMessage, 800); // Wait a bit for iframe content to potentially update
    return () => clearTimeout(timer);
  }, [activeSection, templateUrl]);

  console.log("template url in preview pene",templateUrl)
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
             href={button_url} 
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
          
          {templateUrl && (
            <iframe
              ref={iframeRef}
              key={`${refreshKey}-${templateUrl}`}
              src={templateUrl}
              className="w-full h-full border-0 bg-white"
              title="Invitation Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={() => {
                  console.log('Iframe loaded successfully:', templateUrl);
                  // Send initial data when iframe loads
                  setTimeout(() => {
                    try {
                      const targetOrigin = getTargetOrigin(templateUrl);
                      const messagePayload = {
                        type: 'INVITATION_PREVIEW_UPDATE',
                        payload: realTimeData || {}
                      };
                      console.log('Sending initial handshake postMessage to iframe:', { 
                        targetOrigin, 
                        hasData: !!realTimeData,
                        payloadKeys: realTimeData ? Object.keys(realTimeData) : []
                      });
                      
                      iframeRef.current?.contentWindow?.postMessage(messagePayload, targetOrigin);
                    } catch (error) {
                      console.error('Failed to send initial postMessage:', error);
                    }
                  }, 500);
                }}
              onError={(e) => {
                console.error('Iframe error:', e);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
