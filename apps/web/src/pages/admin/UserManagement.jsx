import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiServerClient from '@/lib/apiServerClient.js';
import { 
  Search, Users, UserPlus, Trash2, Edit, CheckCircle2, AlertTriangle, MonitorSmartphone, Key, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PasswordResetModal from '@/components/admin/PasswordResetModal.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [users, setUsers] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Forms
  const [formData, setFormData] = useState({
    email: '', name: '', role: 'viewer', status: 'Active'
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'admin') {
        const res = await apiServerClient.fetch('/admin/admin_users?limit=50');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch admin users');
        setUsers(data.items || []);
      } else {
        const res = await apiServerClient.fetch('/admin/users?limit=50');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch app users');
        setAppUsers(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Failed to load ${activeTab} users. Please verify your permissions or try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddUser = async () => {
    if (!formData.email || !formData.name) {
      toast.error('Email and Name are required');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('Invalid email format');
      return;
    }
    
    try {
      // Generate a temporary password for creation
      const tempPass = 'Temp' + Math.random().toString(36).slice(-8) + '!';
      
      const res = await apiServerClient.fetch('/admin/admin_users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          role: formData.role,
          status: formData.status,
          password: tempPass,
          passwordConfirm: tempPass
        })
      });
      if (!res.ok) throw new Error(await res.text());
      
      toast.success('Admin user created successfully. Please reset their password.');
      setIsAddOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    }
  };

  const handleEditUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required');
      return;
    }

    try {
      const res = await apiServerClient.fetch(`/admin/admin_users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        })
      });
      if (!res.ok) throw new Error(await res.text());
      
      toast.success('Admin updated successfully');
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await apiServerClient.fetch(`/admin/admin_users/${selectedUser.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Admin user deleted successfully');
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const openPasswordReset = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const toggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      const res = await apiServerClient.fetch(`/admin/admin_users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`User marked as ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const filteredUsers = users.filter(u => {
    const safeEmail = u.email || '';
    const safeName = u.name || '';
    const safeSearch = search ? search.toLowerCase() : '';
    
    const matchSearch = safeEmail.toLowerCase().includes(safeSearch) || 
                       safeName.toLowerCase().includes(safeSearch);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const filteredAppUsers = appUsers.filter(u => {
    const safeEmail = u.email || '';
    const safeName = u.name || '';
    const safeSearch = search ? search.toLowerCase() : '';
    
    const matchSearch = safeEmail.toLowerCase().includes(safeSearch) || 
                       safeName.toLowerCase().includes(safeSearch);
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      <Helmet><title>Admin Users - Toolisiya Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage staff, administrators, and app users.</p>
        </div>
        {activeTab === 'admin' && (
          <Button onClick={() => {
            setFormData({ email: '', name: '', role: 'viewer', status: 'Active' });
            setIsAddOpen(true);
          }} className="gap-2">
            <UserPlus className="h-4 w-4" /> Add Admin User
          </Button>
        )}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="w-fit border-destructive/20 hover:bg-destructive/10" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
            <TabsTrigger value="admin">Admin Users</TabsTrigger>
            <TabsTrigger value="app">App Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <CardTitle>Staff Directory</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search email or name..." 
                        className="pl-9 bg-muted/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[130px]"><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[250px]">User Details</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No admin users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col max-w-[200px]">
                                  <span className="font-semibold truncate text-sm">{user.name || 'No Name'}</span>
                                  <span className="text-xs text-muted-foreground truncate" title={user.id}>{user.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={user.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 border-none" : "bg-slate-500/10 text-slate-600 border-none"}>
                                {user.status || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(user.created).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" title="View Details" onClick={() => {
                                  setSelectedUser(user);
                                  setIsViewOpen(true);
                                }}>
                                  <MonitorSmartphone className="h-4 w-4 text-primary" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Change Password" onClick={() => openPasswordReset(user)}>
                                  <Key className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" title={user.status === 'Active' ? "Deactivate" : "Activate"} onClick={() => toggleStatus(user)}>
                                  {user.status === 'Active' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                                <Button variant="ghost" size="icon" title="Edit User" onClick={() => {
                                  setSelectedUser(user);
                                  setFormData({ email: user.email, name: user.name, role: user.role, status: user.status || 'Active' });
                                  setIsEditOpen(true);
                                }}>
                                  <Edit className="h-4 w-4 text-orange-500" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Delete User" onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteOpen(true);
                                }}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="app">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <CardTitle>App Users Directory</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search email or name..." 
                        className="pl-9 bg-muted/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[250px]">User Details</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredAppUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No app users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAppUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col max-w-[200px]">
                                  <span className="font-semibold truncate text-sm">{user.name || 'No Name'}</span>
                                  <span className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.id}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(user.created).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {user.verified ? (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none">Yes</Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">No</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" title="View Details" onClick={() => {
                                setSelectedUser(user);
                                setIsViewOpen(true);
                              }}>
                                <MonitorSmartphone className="h-4 w-4 text-primary" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* ADD USER MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>Create a new staff account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="staff@toolisiya.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT USER MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Delete Admin User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete the admin account for <strong>{selectedUser?.email}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PASSWORD RESET MODAL */}
      <PasswordResetModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        user={selectedUser} 
      />

      {/* VIEW DETAILS MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name || 'No Name Provided'}</h3>
                  <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">ID</span>
                  <span className="font-medium font-mono text-xs">{selectedUser.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Collection</span>
                  <span className="font-medium capitalize">{selectedUser.collectionName}</span>
                </div>
                {selectedUser.collectionName === 'admin_users' ? (
                  <>
                    <div>
                      <span className="text-muted-foreground block text-xs">Role</span>
                      <Badge variant="outline" className="uppercase text-[10px] mt-1">{selectedUser.role}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Status</span>
                      <Badge variant="secondary" className={`mt-1 ${selectedUser.status === 'Active' ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600"}`}>
                        {selectedUser.status || 'Unknown'}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-muted-foreground block text-xs">Verified</span>
                    <Badge variant="outline" className={`mt-1 ${selectedUser.verified ? "border-emerald-500 text-emerald-600" : ""}`}>
                      {selectedUser.verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block text-xs">Created At</span>
                  <span className="font-medium">{new Date(selectedUser.created).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Updated At</span>
                  <span className="font-medium">{new Date(selectedUser.updated).toLocaleString()}</span>
                </div>
                {selectedUser.lastLogin && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-xs">Last Login</span>
                    <span className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UserManagement;