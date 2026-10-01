import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppShell: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
      
      {/* Mobile Navigation (shown only on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};