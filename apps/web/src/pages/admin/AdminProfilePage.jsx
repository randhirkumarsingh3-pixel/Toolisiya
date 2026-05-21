import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { 
  User, Mail, Shield, Lock, Save, Loader2, 
  Key, AlertCircle, CheckCircle2, History 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminProfilePage = () => {
  const { adminUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (adminUser) {
      setFormData({
        name: adminUser.name || '',
        email: adminUser.email || '',
      });
    }
  }, [adminUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!adminUser?.id) return;
    
    setIsSaving(true);
    try {
      await pb.collection('admin_users').update(adminUser.id, {
        name: formData.name,
        email: formData.email
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Profile update error', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }

    setIsSaving(true);
    try {
      await pb.collection('admin_users').update(adminUser.id, {
        password: passwordData.newPassword,
        passwordConfirm: passwordData.confirmPassword,
        oldPassword: passwordData.oldPassword
      });
      toast.success('Password changed successfully. Please log in again if needed.');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error', err);
      toast.error(err.message || 'Failed to change password. Ensure old password is correct.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <Helmet><title>My Profile - Admin</title></Helmet>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your administrator account details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Brief Summary */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-indigo-600 to-purple-600" />
            <CardContent className="pt-0 -mt-12 text-center pb-6">
              <div className="inline-flex h-24 w-24 rounded-full border-4 border-white bg-slate-100 items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm mb-4">
                {formData.name.charAt(0) || adminUser?.email.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold">{formData.name || 'Admin User'}</h3>
              <p className="text-xs text-muted-foreground mb-4">{formData.email}</p>
              <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 capitalize">
                {adminUser?.role?.replace('_', ' ') || 'Administrator'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-slate-400" /> Account Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">{adminUser ? new Date(adminUser.created).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Last login</span>
                <span className="font-medium">{adminUser?.lastLogin ? new Date(adminUser.lastLogin).toLocaleDateString() : 'Today'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" />
                <CardTitle>Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Form */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                <CardTitle>Security & Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="oldPassword"
                      type="password"
                      className="pl-9"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                        id="newPassword"
                        type="password"
                        className="pl-9"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="At least 8 chars"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                        id="confirmPassword"
                        type="password"
                        className="pl-9"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="outline" disabled={isSaving} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    Change Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-4 items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 leading-relaxed">
              <p className="font-semibold mb-1">Account Security Recommendations</p>
              Use a strong, unique password for your administrator account. We recommend using a password manager. 
              Changes to your email or password will require you to log in again on all devices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
