import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wrench, FileText, Settings, 
  Share2, Globe, Search, ArrowLeft, LogOut, BarChart3, 
  Fingerprint, SearchCode, Activity, Menu, X, Bell, 
  ChevronRight, Shield, Layers, UserCircle, Database, History
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils.js';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const navSections = [
  {
    title: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', exact: true },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    ]
  },
  {
    title: 'SEO & Search',
    items: [
      { icon: Search, label: 'SEO Dashboard', path: '/admin/seo-dashboard' },
      { icon: Activity, label: 'SEO Monitoring', path: '/admin/seo-monitoring' },
      { icon: SearchCode, label: 'SEO Metadata', path: '/admin/seo-management' },
    ]
  },
  {
    title: 'Management',
    items: [
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Wrench, label: 'Tools', path: '/admin/tools' },
      { icon: FileText, label: 'Content Pages', path: '/admin/content' },
    ]
  },
  {
    title: 'Configuration',
    items: [
      { icon: Share2, label: 'Social Media', path: '/admin/social' },
      { icon: Fingerprint, label: 'Google Auth/API', path: '/admin/google' },
      { icon: Globe, label: 'Website Setup', path: '/admin/website-configuration' },
      { icon: Layers, label: 'Menu Config', path: '/admin/menu-setup' },
      { icon: Settings, label: 'General Settings', path: '/admin/settings' },
      { icon: History, label: 'Audit Logs', path: '/admin/activity' },
      { icon: Database, label: 'Backups', path: '/admin/backups' },
      { icon: UserCircle, label: 'My Profile', path: '/admin/profile' },
    ]
  }
];

// Flatten for breadcrumb lookup
const allNavItems = navSections.flatMap(s => s.items);

const AdminLayout = () => {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    const loginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH || "/admin-a8f4c2e9";
    navigate(loginPath);
  };

  const currentPage = allNavItems.find(item => 
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  const adminName = adminUser?.name || 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();
  const adminRole = adminUser?.role?.replace('_', ' ') || 'admin';

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">Toolisiya</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">Admin Console</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3 px-3">
        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 px-3 mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact 
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                        isActive 
                          ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white shadow-sm border border-indigo-500/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-indigo-400" : "")} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-white/10 shrink-0">
        <div 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 mb-2 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => { navigate('/admin/profile'); setSidebarOpen(false); }}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
            {adminInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{adminName}</p>
            <p className="text-[10px] text-slate-400 capitalize">{adminRole}</p>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-500" />
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex-1 justify-start text-slate-400 hover:text-white hover:bg-white/5 text-xs h-8" 
            onClick={() => { navigate('/'); setSidebarOpen(false); }}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Site
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs h-8 px-2.5"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden w-full">
      {/* Desktop Sidebar */}
      <aside className="w-[250px] bg-slate-900 flex flex-col hidden lg:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-slate-900 flex flex-col z-50 lg:hidden transition-transform duration-300 ease-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-white/10 z-10"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-600 hover:text-slate-900 -ml-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm">
              <span className="text-slate-400 hidden sm:inline">Admin</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 mx-1.5 hidden sm:inline" />
              <span className="font-semibold text-slate-800">
                {currentPage?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 relative">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-indigo-500 rounded-full ring-2 ring-white" />
            </Button>

            {/* Admin avatar (desktop) */}
            <div 
              className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 ml-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/admin/profile')}
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                {adminInitial}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-700 leading-none">{adminName}</p>
                <p className="text-[10px] text-slate-400 capitalize leading-none mt-0.5">{adminRole}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;