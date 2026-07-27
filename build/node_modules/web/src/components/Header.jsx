import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, Search, ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const LOGO_URL = "/logo-transparent.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstalled, install } = usePWAInstall();
  
  // Dynamic Nav State
  const [navCategories, setNavCategories] = useState([]);
  const [navTools, setNavTools] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAuthenticated = pb.authStore.isValid;

  const { activeTools, activeCategories } = useActiveTools();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch dynamic menu settings
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [settingsRes] = await Promise.all([
          pb.collection('menu_settings').getFullList({ $autoCancel: false })
        ]);

        let orderedCats = [];
        let visibleCats = {};
        
        if (settingsRes.length > 0) {
          orderedCats = settingsRes[0].categoryOrder || [];
          visibleCats = settingsRes[0].visibility || {};
        }

        const activeCategoryNames = new Set(activeCategories.map(c => c.name));

        // Filter out hidden categories and disabled categories
        const finalCats = orderedCats.filter(cat => visibleCats[cat] !== false && activeCategoryNames.has(cat));
        
        // Group only active tools that are show_in_menu by category
        const toolsByCat = {};
        activeTools.forEach(t => {
          if (t.show_in_menu) {
            if (!toolsByCat[t.category]) toolsByCat[t.category] = [];
            toolsByCat[t.category].push(t);
          }
        });

        setNavCategories(finalCats);
        setNavTools(toolsByCat);
      } catch (err) {
        console.error('Failed to load navigation data:', err);
      }
    };
    fetchMenuData();
  }, [activeTools, activeCategories]);

  const handleLogout = () => {
    pb.authStore.clear();
    navigate('/');
  };

  const toSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');

  return (
    <header 
      className={`sticky top-0 z-[100] w-full transition-all duration-200 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 outline-none focus-visible:ring-2 ring-primary rounded-md">
            <img src={LOGO_URL} alt="Toolisiya Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground hidden sm:block">Toolisiya</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-1 lg:gap-2">
              <li>
                <NavLink to="/" className={({ isActive }) => `text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                  Home
                </NavLink>
              </li>
              
              {navCategories.map((cat) => {
                const tools = navTools[cat] || [];
                const catPath = `/${toSlug(cat)}`;
                
                return (
                  <li key={cat} className="relative group">
                    <NavLink 
                      to={catPath} 
                      className={({ isActive }) => `
                        text-sm font-semibold transition-colors px-3 py-2 rounded-md whitespace-nowrap flex items-center gap-1
                        ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                      `}
                    >
                      {cat}
                      {tools.length > 0 && <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform" />}
                    </NavLink>
                    
                    {tools.length > 0 && (
                      <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-background border border-border shadow-lg rounded-xl p-2 w-56 flex flex-col animate-in slide-in-from-top-2">
                          {tools.map(tool => (
                            <Link 
                              key={tool.id} 
                              to={tool.url} 
                              className="px-3 py-2.5 hover:bg-muted rounded-lg text-sm font-medium transition-colors line-clamp-1"
                            >
                              {tool.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
              
              <li>
                <NavLink to="/about" className={({ isActive }) => `text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                  About
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden xl:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="gap-2 font-semibold">
                  <Link to="/profile"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="default" size="sm" className="rounded-lg px-6 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>

          {/* Mobile Right Actions & Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden ml-auto">
            
            <button 
              className="p-2 touch-target text-muted-foreground hover:text-foreground transition-colors bg-muted/50 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-background border-b border-border absolute top-full left-0 w-full shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto z-[100] animate-in slide-in-from-top-2">
          <nav className="px-4 py-4 flex flex-col gap-1">
            <NavLink to="/" className={({ isActive }) => `px-4 py-3.5 text-base font-bold rounded-xl transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`}>Home</NavLink>
            
            {navCategories.map((cat) => {
              const tools = navTools[cat] || [];
              const catPath = `/${toSlug(cat)}`;
              
              return (
                <div key={cat} className="flex flex-col">
                  <NavLink to={catPath} className={({ isActive }) => `px-4 py-3.5 text-base font-bold rounded-xl transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`}>
                    {cat}
                  </NavLink>
                  {tools.length > 0 && (
                    <div className="pl-8 pr-4 py-2 flex flex-col gap-1 border-l-2 border-muted ml-6">
                      {tools.map(tool => (
                        <Link key={tool.id} to={tool.url} className="py-2 text-sm text-muted-foreground hover:text-foreground font-medium">
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            <NavLink to="/about" className={({ isActive }) => `px-4 py-3.5 text-base font-bold rounded-xl transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`}>About</NavLink>
            
            <div className="pt-6 mt-4 border-t border-border flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="outline" className="w-full justify-start h-12 text-base rounded-xl font-bold">
                    <Link to="/profile"><LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive h-12 text-base rounded-xl hover:bg-destructive/10 font-bold" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-3" /> Logout
                  </Button>
                </>
              ) : (
                <Button asChild variant="default" className="w-full h-12 text-base rounded-xl shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Link to="/login">Log in to your account</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
