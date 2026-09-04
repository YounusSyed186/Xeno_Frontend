import React, { useState } from 'react';
import { useAuthContext } from '@/stores/auth.store';
import { useNavigate } from '@tanstack/react-router';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AdminSearchModal } from './AdminSearchModal';
import {
  Menu,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Key,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminTopbarProps {
  onToggleSidebar?: () => void;
  onOpenMobileDrawer?: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileDrawer }) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/admin/login' });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile menu button + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileDrawer}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface border border-border/40"
          aria-label="Open Mobile Menu"
        >
          <Menu className="size-5" />
        </button>

        <AdminBreadcrumbs />
      </div>

      {/* Center / Right: Global Search, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Global Admin Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border/40 bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search entities...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/40">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate({ to: '/admin/notifications' as any })}
          className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface border border-border/40 transition-colors"
          title="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-2xl border border-border/40 bg-surface/40 p-1.5 pr-3 hover:bg-surface transition-colors focus:outline-none">
              <div className="flex size-7 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight">{user?.name || 'Admin User'}</span>
                <span className="text-[10px] text-muted-foreground capitalize leading-none">{user?.role || 'Administrator'}</span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground ml-1" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 glass-panel rounded-2xl border-border/40 p-1">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
              Signed in as <span className="text-foreground font-semibold block">{user?.email}</span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-border/40" />

            <DropdownMenuItem onClick={() => navigate({ to: '/admin/settings' as any })} className="text-xs rounded-xl cursor-pointer">
              <UserIcon className="size-4 mr-2 text-muted-foreground" />
              Admin Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate({ to: '/admin/roles' as any })} className="text-xs rounded-xl cursor-pointer">
              <Shield className="size-4 mr-2 text-muted-foreground" />
              Roles & Permissions
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate({ to: '/admin/settings' as any })} className="text-xs rounded-xl cursor-pointer">
              <Key className="size-4 mr-2 text-muted-foreground" />
              Security Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/40" />

            <DropdownMenuItem onClick={handleLogout} className="text-xs rounded-xl text-destructive cursor-pointer hover:bg-destructive/10">
              <LogOut className="size-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AdminSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
