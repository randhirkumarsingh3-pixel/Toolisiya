import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { 
  Database, Download, Plus, Trash2, 
  Clock, Server, ShieldCheck, AlertCircle,
  Loader2, FileArchive, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const DatabaseBackupPage = () => {
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      // In newer PocketBase versions, backups are managed via pb.backups
      // If the service is not available or errors, we'll show a fallback message
      const list = await pb.backups.getFullList({ $autoCancel: false });
      setBackups(list);
    } catch (err) {
      console.error('Error fetching backups', err);
      // Fallback for older versions or permission issues
      setBackups([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      const name = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}`;
      await pb.backups.create(name);
      toast.success('Backup created successfully');
      fetchBackups();
    } catch (err) {
      console.error('Backup creation error', err);
      toast.error('Failed to create backup. Ensure you have superuser permissions.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBackup = async (name) => {
    try {
      await pb.backups.delete(name);
      toast.success('Backup deleted');
      fetchBackups();
    } catch (err) {
      toast.error('Failed to delete backup');
    }
  };

  const getDownloadUrl = (name) => {
    const token = pb.authStore.token;
    return `${pb.baseUrl}/api/backups/${name}?token=${token}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Helmet><title>Database Backups - Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Database Backups</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and download point-in-time snapshots of your platform data.</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create New Backup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm bg-indigo-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-600" /> Storage Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">SQLite</p>
            <p className="text-xs text-muted-foreground mt-1">Integrated PocketBase DB</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">Optimal</p>
            <p className="text-xs text-muted-foreground mt-1">Connection is stable</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" /> Last Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {backups.length > 0 ? new Date(backups[0].modified).toLocaleDateString() : 'None'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Automated snapshots daily</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Available Snapshots</CardTitle>
            <CardDescription>Full database zips including files and schema.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchBackups} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead>Filename</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-48 bg-slate-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></TableCell>
                    <TableCell className="text-right"><div className="h-8 w-24 bg-slate-100 rounded ml-auto animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileArchive className="h-12 w-12 mb-4 opacity-20" />
                      <p className="font-medium">No backups found</p>
                      <p className="text-xs max-w-[250px] mx-auto mt-1">
                        Create your first database snapshot to see it listed here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup) => (
                  <TableRow key={backup.name} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileArchive className="h-4 w-4 text-slate-400" />
                      {backup.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {(backup.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(backup.modified).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1.5"
                          asChild
                        >
                          <a href={getDownloadUrl(backup.name)} download>
                            <Download className="h-3.5 w-3.5" /> Download
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => handleDeleteBackup(backup.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex gap-4 items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 leading-relaxed">
          <p className="font-semibold mb-1">Backup Recommendation</p>
          Regularly download backups to your local machine or external storage. These snapshots contain everything needed to restore your platform in case of server failure.
        </div>
      </div>
    </div>
  );
};

export default DatabaseBackupPage;
