import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, LayoutDashboard, Clock, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

const MobileBottomNav = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isAuthenticated = pb.authStore.isValid;

  // Do not show bottom nav on admin routes or full-screen creator apps
  if (location.pathname.startsWith('/admin') || location.pathname === '/image/photo-editor') {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Layers, label: 'Categories', path: '/browse-categories' },
    { icon: Clock, label: 'Recent', path: '/app?tab=recent' },
    { icon: LayoutDashboard, label: 'Dashboard', path: isAuthenticated ? '/profile' : '/app' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] safe-area-bottom">
      <nav className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path.includes('?') && location.pathname + location.search === item.path);
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
