import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, Trash2, Edit, Star, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';

const STATUS_COLORS = {
  'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Interviewing': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'Offered': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const JobApplicationTrackerPage = () => {
  const { seoData } = useSEOData('job-application-tracker');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null, company: '', role: '', status: 'Applied', date: new Date().toISOString().split('T')[0], salary: '', notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('jobTracker');
    if (saved) setApplications(JSON.parse(saved));
    else {
      setApplications([
        { id: 1, company: 'Tech Corp', role: 'Frontend Dev', status: 'Interviewing', date: '2026-04-01', salary: '$120k', notes: 'First round went well' },
        { id: 2, company: 'Startup Inc', role: 'React Engineer', status: 'Applied', date: '2026-04-10', salary: '$110k', notes: 'Referred by John' }
      ]);
    }
  }, []);

  const saveApps = (newApps) => {
    setApplications(newApps);
    localStorage.setItem('jobTracker', JSON.stringify(newApps));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) { toast.error('Company and Role are required'); return; }
    if (formData.id) {
      saveApps(applications.map(app => app.id === formData.id ? formData : app));
      toast.success('Application updated');
    } else {
      saveApps([...applications, { ...formData, id: Date.now() }]);
      toast.success('Application added');
    }
    setIsModalOpen(false);
    setFormData({ id: null, company: '', role: '', status: 'Applied', date: new Date().toISOString().split('T')[0], salary: '', notes: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this application?')) {
      saveApps(applications.filter(app => app.id !== id));
      toast.success('Deleted successfully');
    }
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(applications);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'job_applications.csv';
    link.click();
    toast.success('Exported to CSV');
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(search.toLowerCase()) || app.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    interviewing: applications.filter(a => a.status === 'Interviewing').length,
    offered: applications.filter(a => a.status === 'Offered').length
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Free Job Application Tracker - Track Interviews | Toolisiya'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Job Tracker" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-4">
            <div>
              <h1 className="text-3xl font-bold">{seoData?.h1_tag || 'Free Job Application Tracker'}</h1>
              <p className="text-muted-foreground">Manage your job search process efficiently.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{formData.id ? 'Edit' : 'Add'} Application</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2"><Label>Company</Label><Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required /></div>
                    <div className="space-y-2"><Label>Role</Label><Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Interviewing">Interviewing</SelectItem>
                            <SelectItem value="Offered">Offered</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                    </div>
                    <div className="space-y-2"><Label>Salary</Label><Input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Notes</Label><Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
                    <Button type="submit" className="w-full">Save</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="p-6 flex items-center gap-4"><Briefcase className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Total Applied</p><p className="text-2xl font-bold">{stats.total}</p></div></CardContent></Card>
            <Card><CardContent className="p-6 flex items-center gap-4"><Star className="h-8 w-8 text-amber-500" /><div><p className="text-sm text-muted-foreground">Interviewing</p><p className="text-2xl font-bold">{stats.interviewing}</p></div></CardContent></Card>
            <Card><CardContent className="p-6 flex items-center gap-4"><Star className="h-8 w-8 text-emerald-500 fill-emerald-500" /><div><p className="text-sm text-muted-foreground">Offers</p><p className="text-2xl font-bold">{stats.offered}</p></div></CardContent></Card>
          </div>

          <Card className="mb-12">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search company or role..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offered">Offered</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.company}</TableCell>
                      <TableCell>{app.role}</TableCell>
                      <TableCell><Badge variant="secondary" className={STATUS_COLORS[app.status]}>{app.status}</Badge></TableCell>
                      <TableCell>{app.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setFormData(app); setIsModalOpen(true); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(app.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <SEOContentDisplay toolName="job-application-tracker" />
        </div>
      </main>
    </div>
  );
};

export default JobApplicationTrackerPage;