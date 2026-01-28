"use client";

import { useState, useEffect } from 'react';

export default function TestTemplate() {
  const [invitationData, setInvitationData] = useState<any>({
    title: 'Default Title',
    date: '2024-01-01',
    location: 'Default Location'
  });

  // Listen for updates from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Template received message:', event.data);
      if (event.data.type === 'UPDATE_INVITATION') {
        console.log('Updating invitation data:', event.data.data);
        setInvitationData(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('Template: Message listener added');
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send changes back to parent
  const handleChange = (field: string, value: string) => {
    const newData = { ...invitationData, [field]: value };
    setInvitationData(newData);
    
    console.log('Template sending change:', newData);
    window.parent.postMessage({
      type: 'INVITATION_CHANGED',
      data: newData
    }, '*');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Template</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={invitationData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={invitationData.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={invitationData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Current Data:</h3>
        <pre className="text-sm">{JSON.stringify(invitationData, null, 2)}</pre>
      </div>
    </div>
  );
}
