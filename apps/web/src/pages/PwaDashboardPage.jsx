/* eslint-disable import/namespace */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Clock, Star, ArrowRight, Activity, Zap, Flame, Shield, 
  User, Mail, Camera, Save, LogOut, Wrench, Settings, 
  LineChart, Sparkles, Smartphone, Check, AlertCircle, Download
} from 'lucide-react';
import { useAppUsage } from '@/contexts/AppUsageContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import pb from '@/lib/pocketbaseClient.js';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function PwaDashboardPage() {
  const { isInstalled, install } = usePWAInstall();
  const { recentTools, favoriteTools } = useAppUsage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'recent';

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profileMobile, setProfileMobile] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Sync profile details if logged in
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileMobile(currentUser.mobile || '');
      if (currentUser.profile_picture) {
        setAvatarPreview(pb.files.getUrl(currentUser, currentUser.profile_picture));
      }
    }
  }, [currentUser]);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    
    try {
      const formData = new FormData();
      formData.append('name', profileName);
      formData.append('mobile', profileMobile);
      if (avatarFile) {
        formData.append('profile_picture', avatarFile);
      }
      await pb.collection('users').update(currentUser.id, formData, { $autoCancel: false });
      toast.success('Profile updated successfully');
      
      // Delay slightly and reload to sync local PocketBase state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  // Dynamically group recent tools by category to build smart analytics insights
  const getCategoryInsights = () => {
    const categories = {
      pdf: { name: 'PDF Tools', count: 0, color: 'bg-red-500' },
      image: { name: 'Image Tools', count: 0, color: 'bg-blue-500' },
      finance: { name: 'Finance Tools', count: 0, color: 'bg-green-500' },
      dev: { name: 'Developer Tools', count: 0, color: 'bg-purple-500' },
      other: { name: 'Other Utils', count: 0, color: 'bg-amber-500' },
    };

    let total = 0;
    recentTools.forEach(tool => {
      total++;
      if (tool.path.includes('/pdf')) categories.pdf.count++;
      else if (tool.path.includes('/image') || tool.path.includes('/photo')) categories.image.count++;
      else if (tool.path.includes('/finance') || tool.path.includes('/loan') || tool.path.includes('/salary')) categories.finance.count++;
      else if (tool.path.includes('/dev') || tool.path.includes('/code') || tool.path.includes('/json') || tool.path.includes('/beautify')) categories.dev.count++;
      else categories.other.count++;
    });

    return { categories, total };
  };

  const { categories, total: totalRecent } = getCategoryInsights();

  const renderToolList = (tools, emptyMessage, icon) => {
    if (!tools || tools.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-border/60 shadow-sm mt-4 animate-in fade-in-50 duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-1 text-foreground">No Items Yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">{emptyMessage}</p>
          <Link to="/">
            <Button size="lg" className="rounded-xl shadow-sm">
              Explore Available Tools <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {tools.map((tool, idx) => {
          const Icon = LucideIcons[tool.iconName] || LucideIcons.Wrench;
          return (
            <Link key={`${tool.path}-${idx}`} to={tool.path} className="group block">
              <div className="bg-card hover:bg-muted/30 border border-border/50 shadow-sm hover:shadow-md rounded-2xl p-5 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group-hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors text-foreground">{tool.name}</h3>
                  {tool.timestamp ? (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Used: {new Date(tool.timestamp).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Favorite Tool
                    </p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <Helmet>
        <title>User Dashboard | Toolisiya</title>
      </Helmet>

      {/* Hero Header Area */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-card border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="container mx-auto px-4 max-w-5xl pt-10 pb-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="text-3xl font-extrabold bg-primary/20 text-primary">
                    {currentUser?.name?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'G'}
                  </AvatarFallback>
                </Avatar>
                {currentUser && (
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-card shadow-sm flex items-center justify-center" title="Online">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                    {currentUser ? `Hi, ${currentUser.name || currentUser.email.split('@')[0]}` : 'Welcome Guest!'}
                  </h1>
                  {currentUser ? (
                    <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Shield className="h-3 w-3" /> Account Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground border px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Local Profile
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground max-w-md text-sm md:text-base">
                  {currentUser 
                    ? `Logged in as ${currentUser.email}. Manage your active tools session and profile settings.`
                    : 'Log in or sign up to sync your productivity history, save custom PDF layouts, and access your settings anywhere.'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              {currentUser ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl border-border bg-card shadow-sm hover:bg-muted text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Log Out
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/signup?tab=signin">
                    <Button variant="outline" size="sm" className="rounded-xl bg-card shadow-sm">Log In</Button>
                  </Link>
                  <Link to="/signup?tab=signup">
                    <Button size="sm" className="rounded-xl shadow-sm">Create Account</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Container */}
      <div className="container mx-auto px-4 max-w-5xl py-8">
        
        {/* Quick Stats Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/40 shadow-sm bg-card overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Recent Tools</p>
                <h4 className="text-2xl font-black mt-0.5 text-foreground">{recentTools.length}</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm bg-card overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Favorites</p>
                <h4 className="text-2xl font-black mt-0.5 text-foreground">{favoriteTools.length}</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm bg-card overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Streak</p>
                <h4 className="text-2xl font-black mt-0.5 text-foreground">{recentTools.length > 0 ? 'Active' : 'Idle'}</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm bg-card overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">User Plan</p>
                <h4 className="text-lg font-bold mt-1.5 text-foreground">{currentUser ? 'Standard Free' : 'Local Guest'}</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-px mb-8">
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setTab('recent')}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'recent' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Clock className="h-4 w-4" /> Recents
              <span className="bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-full text-[10px]">{recentTools.length}</span>
            </button>
            <button 
              onClick={() => setTab('favorites')}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Star className="h-4 w-4" /> Saved Favorites
              <span className="bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-full text-[10px]">{favoriteTools.length}</span>
            </button>
            <button 
              onClick={() => setTab('insights')}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'insights' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <LineChart className="h-4 w-4" /> Insights
            </button>
            {currentUser && (
              <button 
                onClick={() => setTab('settings')}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <Settings className="h-4 w-4" /> Profile settings
              </button>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Sparkles className="h-4.5 w-4.5 text-primary" /> Multi-utility SaaS toolsuite active
          </div>
        </div>

        {/* TAB 1: RECENTS */}
        {currentTab === 'recent' && (
          <div className="animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Jump Back In</h2>
                <p className="text-sm text-muted-foreground">List of tools you used recently on this browser session.</p>
              </div>
            </div>
            {renderToolList(recentTools, "You haven't used any utility tools recently. Once you start running tools, they will instantly appear here.", <Clock className="h-7 w-7" />)}
          </div>
        )}

        {/* TAB 2: FAVORITES */}
        {currentTab === 'favorites' && (
          <div className="animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Saved Favorites</h2>
                <p className="text-sm text-muted-foreground">Quick access bookmarks. Click the star icon on any tool layout to save it.</p>
              </div>
            </div>
            {renderToolList(favoriteTools, "Your favorites list is empty. Bookmark tools by selecting the star toggle on tool overview pages.", <Star className="h-7 w-7" />)}
          </div>
        )}

        {/* TAB 3: INSIGHTS */}
        {currentTab === 'insights' && (
          <div className="animate-in fade-in-50 duration-300 max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Productivity Insights</h2>
              <p className="text-sm text-muted-foreground">A dynamic breakdown of categories and tools you utilize most.</p>
            </div>

            {totalRecent === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-border/60 shadow-sm">
                <LineChart className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground max-w-xs">Use a few utility tools first to generate workspace analytics and insights.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="border-border/40 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Category Usage Distribution</CardTitle>
                    <CardDescription>Based on your last {totalRecent} active tools sessions.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {Object.values(categories).map((cat) => {
                      const percentage = totalRecent > 0 ? Math.round((cat.count / totalRecent) * 100) : 0;
                      return (
                        <div key={cat.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-foreground">{cat.name}</span>
                            <span className="text-muted-foreground font-semibold">{cat.count} uses ({percentage}%)</span>
                          </div>
                          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-sm bg-card p-6">
                  <h3 className="font-bold text-base mb-2">Tips to maximize productivity</h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      Save bookmarks to Favorites to instantly trigger them from your Header menu search bar.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      Install Toolisiya PWA on your mobile or desktop client for direct offline-ready access to file converters.
                    </li>
                  </ul>
                  {!isInstalled && (
                    <Button onClick={install} className="w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Install Toolisiya App
                    </Button>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {currentTab === 'settings' && currentUser && (
          <div className="animate-in fade-in-50 duration-300 max-w-2xl">
            <Card className="shadow-md border-border bg-card">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal info, avatar, and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-card shadow-md">
                        <AvatarImage src={avatarPreview} />
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                          {profileName.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <label htmlFor="dashboard-avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                        <Camera className="h-6 w-6" />
                      </label>
                      <input id="dashboard-avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-foreground">{currentUser.email}</h3>
                      <p className="text-sm text-muted-foreground">Click photo container to upload a new profile picture.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dashboard-profile-name">Full Name</Label>
                      <Input 
                        id="dashboard-profile-name" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)} 
                        className="max-w-md bg-background" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dashboard-profile-mobile">Mobile Number</Label>
                      <Input 
                        id="dashboard-profile-mobile" 
                        type="tel"
                        value={profileMobile} 
                        onChange={(e) => setProfileMobile(e.target.value)} 
                        className="max-w-md bg-background" 
                        required 
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSavingProfile} className="rounded-xl shadow-sm">
                    {isSavingProfile ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Profile Details</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
