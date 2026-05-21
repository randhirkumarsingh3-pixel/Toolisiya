import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { 
  History, Search, Filter, Download, 
  User, Zap, FileText, Settings,
  ArrowUpDown, Clock, ExternalLink, Loader2,
  Plus, Edit, Trash2, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ACTION_ICONS = {
  create: <Plus className="h-3 w-3 mr-1" />,
  update: <Edit className="h-3 w-3 mr-1" />,
  delete: <Trash2 className="h-3 w-3 mr-1" />,
  view: <Eye className="h-3 w-3 mr-1" />
};

const ACTION_COLORS = {
  create: "bg-emerald-50 text-emerald-700 border-emerald-100",
  update: "bg-blue-50 text-blue-700 border-blue-100",
  delete: "bg-red-50 text-red-700 border-red-100",
  view: "bg-slate-50 text-slate-700 border-slate-100"
};

const ENTITY_ICONS = {
  user: <User className="h-4 w-4" />,
  tool: <Zap className="h-4 w-4" />,
  content: <FileText className="h-4 w-4" />,
  setting: <Settings className="h-4 w-4" />
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    action: 'all',
    entity: 'all',
    search: ''
  });

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let filterString = '';
      const filterParts = [];
      
      if (filters.action !== 'all') filterParts.push(`action = "${filters.action}"`);
      if (filters.entity !== 'all') filterParts.push(`entity_type = "${filters.entity}"`);
      if (filters.search) filterParts.push(`(details ~ "${filters.search}" || entity_id ~ "${filters.search}")`);
      
      filterString = filterParts.join(' && ');

      const result = await pb.collection('admin_logs').getList(page, 20, {
        sort: '-created',
        filter: filterString,
        expand: 'admin_id',
        $autoCancel: false
      });

      setLogs(result.items);
      setTotalItems(result.totalItems);
    } catch (err) {
      console.error('Error fetching logs', err);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters.action, filters.entity]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchLogs();
    }
  };

  const exportLogs = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Time,Admin,Action,Entity,Details\n"
        + logs.map(l => `${l.created},${l.expand?.admin_id?.email || 'System'},${l.action},${l.entity_type},"${l.details?.replace(/"/g, '""')}"`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `audit_logs_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Logs exported to CSV');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Helmet><title>Audit Logs - Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">Track all administrative actions and system changes.</p>
        </div>
        <Button variant="outline" onClick={exportLogs} className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by details or entity ID..." 
                className="pl-9"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                onKeyDown={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filters.action} onValueChange={(v) => setFilters({...filters, action: v})}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.entity} onValueChange={(v) => setFilters({...filters, entity: v})}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="tool">Tools</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="setting">Settings</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => { setFilters({action:'all', entity:'all', search:''}); setPage(1); }} title="Reset Filters">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="max-w-[300px]">Details</TableHead>
                  <TableHead className="text-right">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-40 bg-slate-100 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-64 bg-slate-100 rounded animate-pulse" /></TableCell>
                      <TableCell className="text-right"><div className="h-4 w-4 bg-slate-100 rounded ml-auto animate-pulse" /></TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No logs found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {new Date(log.created).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {log.expand?.admin_id?.name?.charAt(0) || log.expand?.admin_id?.email?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <span className="text-sm font-medium">{log.expand?.admin_id?.name || log.expand?.admin_id?.email || 'System'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize shadow-none text-[10px] font-medium px-2 py-0.5 ${ACTION_COLORS[log.action]}`}>
                          {ACTION_ICONS[log.action]} {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {ENTITY_ICONS[log.entity_type]}
                          <span className="capitalize">{log.entity_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-sm text-slate-500" title={log.details}>
                        {log.details}
                      </TableCell>
                      <TableCell className="text-right">
                        {log.entity_id && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {logs.length} of {totalItems} logs
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1 || isLoading} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page * 20 >= totalItems || isLoading} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
