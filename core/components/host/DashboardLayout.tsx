import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  rightPanel: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ header, sidebar, main, rightPanel }) => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50">
        {header}
      </div>

      {/* Main Grid Layout */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 grid gap-6 grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Sidebar (Guest List + Templates) */}
        <aside className="lg:col-span-3 flex flex-col gap-6 h-fit max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          {sidebar}
        </aside>

        {/* Center Panel (Editable Details) */}
        <section className="lg:col-span-5 flex flex-col gap-6 h-fit max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          {main}
        </section>

        {/* Right Panel (Preview) */}
        <aside className="lg:col-span-4 h-fit lg:sticky lg:top-24">
          {rightPanel}
        </aside>

      </main>
    </div>
  );
};

export default DashboardLayout;
