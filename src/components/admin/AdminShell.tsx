import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { X } from 'lucide-react';

export const AdminShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative z-10 flex flex-col h-full bg-background border-r border-border/40 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-xl bg-surface text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <AdminSidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isMobileDrawer
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Administrative Application Layout */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopbar onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
