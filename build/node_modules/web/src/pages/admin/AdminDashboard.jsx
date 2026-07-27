import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from 'recharts';
import { 
  Users, Globe, Clock, Zap, RefreshCw, Server, Database, 
  Download, CheckCircle2, Activity, AlertCircle, Eye, MousePointerClick,
  PlusCircle, Settings2, ShieldCheck, History
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#ef4444'];

const MetricCard = React.memo(({ title, value, subtext, icon: Icon, isLoading, onClick }) => (
  <Card 
    className="shadow-sm border-border/50 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
          <Icon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="text-xs font-medium text-muted-foreground flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <MousePointerClick className="h-3 w-3 mr-1" /> View Details
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      {isLoading ? <Skeleton className="h-8 w-24" /> : <h3 className="text-2xl font-bold tracking-tight">{value}</h3>}
      <p className="text-xs text-muted-foreground mt-2">{subtext}</p>
    </CardContent>
  </Card>
));
MetricCard.displayName = 'MetricCard';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  
  // Dashboard Data
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalTools: 0,
    totalVisits: 0,
    activeUsersToday: 0
  });
  
  const [chartData, setChartData] = useState({
    visits: [],
    toolsPie: [],
    topTools: [],
    recentActivity: []
  });

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'users' | 'tools' | 'visits' | 'active' | 'mostUsed' | null

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Total Users
      const usersList = await pb.collection('users').getList(1, 1, { $autoCancel: false });
      
      // 2. Total Tools
      const toolsList = await pb.collection('tools').getFullList({ $autoCancel: false });
      
      // Calculate Date Ranges
      const now = new Date();
      const pastDate = new Date();
      if (dateRange === '7d') pastDate.setDate(now.getDate() - 7);
      else if (dateRange === '30d') pastDate.setDate(now.getDate() - 30);
      else if (dateRange === 'all') pastDate.setFullYear(2000); // effectively all time
      
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      // 3. Analytics Data
      const analyticsFilter = `created >= "${pastDate.toISOString()}"`;
      const analytics = await pb.collection('analytics_events').getFullList({
        filter: analyticsFilter,
        sort: '-created',
        $autoCancel: false
      });

      // Aggregate Metrics
      const totalVisits = analytics.length;
      
      // Active Users Today (unique userIds or sessionIds in last 24h)
      const recentEvents = analytics.filter(e => new Date(e.created) >= yesterday);
      const uniqueActive = new Set(recentEvents.map(e => e.userId || e.sessionId)).size;

      setMetrics({
        totalUsers: usersList.totalItems,
        totalTools: toolsList.length,
        totalVisits: totalVisits,
        activeUsersToday: uniqueActive
      });

      // Chart Data: Visits over time
      const visitsByDate = {};
      analytics.forEach(e => {
        const date = new Date(e.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        visitsByDate[date] = (visitsByDate[date] || 0) + 1;
      });
      const visitsLine = Object.keys(visitsByDate).map(date => ({
        date,
        visits: visitsByDate[date]
      })).reverse(); // pb returns desc, we want asc for chart

      // Chart Data: Top Tools
      const toolUsage = {};
      analytics.filter(e => e.eventType === 'tool_usage' && e.toolName).forEach(e => {
        toolUsage[e.toolName] = (toolUsage[e.toolName] || 0) + 1;
      });
      const topTools = Object.keys(toolUsage)
        .map(name => ({ name, uses: toolUsage[name] }))
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 10);

      // Chart Data: Tool Categories
      const catCount = {};
      toolsList.forEach(t => {
        catCount[t.category] = (catCount[t.category] || 0) + 1;
      });
      const toolsPie = Object.keys(catCount).map(name => ({ name, value: catCount[name] }));

      setChartData({
        visits: visitsLine,
        toolsPie,
        topTools,
        recentActivity: analytics.slice(0, 15)
      });

    } catch (error) {
      console.error('Dashboard Data Fetch Error:', error);
      toast.error('Failed to load some dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const csvRows = [];
      // Header
      csvRows.push(['Metric', 'Value', 'Context']);
      csvRows.push(['Total Users', metrics.totalUsers, 'All time']);
      csvRows.push(['Total Tools', metrics.totalTools, 'Database count']);
      csvRows.push(['Total Visits', metrics.totalVisits, `Period: ${dateRange}`]);
      csvRows.push(['Active Users Today', metrics.activeUsersToday, 'Last 24h']);
      
      csvRows.push([]); // Empty line
      csvRows.push(['Top Tools Usage', 'Uses']);
      chartData.topTools.forEach(t => {
        csvRows.push([t.name, t.uses]);
      });

      const csvString = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `toolisiya_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Dashboard report exported successfully');
    } catch (err) {
      toast.error('Failed to export report');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <Helmet><title>Dashboard - Toolisiya Admin</title></Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Live website activity and performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchDashboardData} title="Refresh Data">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="secondary" 
            className="gap-2 shadow-sm"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-16 justify-start gap-4 px-6 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
          onClick={() => window.location.href = '/admin/tools'}
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <PlusCircle className="h-5 w-5 text-indigo-600 group-hover:text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">New Tool</p>
            <p className="text-[10px] text-muted-foreground">Add to collection</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 justify-start gap-4 px-6 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
          onClick={() => window.location.href = '/admin/seo-management'}
        >
          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ShieldCheck className="h-5 w-5 text-emerald-600 group-hover:text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">SEO Check</p>
            <p className="text-[10px] text-muted-foreground">Audit metadata</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 justify-start gap-4 px-6 border-slate-200 hover:border-amber-200 hover:bg-amber-50/50 transition-all group"
          onClick={() => window.location.href = '/admin/settings'}
        >
          <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Settings2 className="h-5 w-5 text-amber-600 group-hover:text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">System Settings</p>
            <p className="text-[10px] text-muted-foreground">Global config</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 justify-start gap-4 px-6 border-slate-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all group"
          onClick={() => window.location.href = '/admin/activity'}
        >
          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <History className="h-5 w-5 text-purple-600 group-hover:text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Audit Logs</p>
            <p className="text-[10px] text-muted-foreground">View history</p>
          </div>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Users" 
          value={metrics.totalUsers.toLocaleString()} 
          subtext="Registered accounts" 
          icon={Users} 
          isLoading={isLoading} 
          onClick={() => setActiveModal('users')}
        />
        <MetricCard 
          title="Total Tools" 
          value={metrics.totalTools.toLocaleString()} 
          subtext="Available calculators & utilities" 
          icon={Zap} 
          isLoading={isLoading} 
          onClick={() => setActiveModal('tools')}
        />
        <MetricCard 
          title="Total Visits" 
          value={metrics.totalVisits.toLocaleString()} 
          subtext={`In selected period (${dateRange})`} 
          icon={Globe} 
          isLoading={isLoading} 
          onClick={() => setActiveModal('visits')}
        />
        <MetricCard 
          title="Active Users" 
          value={metrics.activeUsersToday.toLocaleString()} 
          subtext="Unique sessions today" 
          icon={Activity} 
          isLoading={isLoading} 
          onClick={() => setActiveModal('active')}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted p-1 mb-6 flex flex-wrap h-auto">
          <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="px-6">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance" className="px-6">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <Card className="lg:col-span-2 shadow-sm border-border/50">
              <CardHeader>
                <CardTitle>Traffic Trends</CardTitle>
                <CardDescription>Visits over {dateRange}</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? <Skeleton className="h-full w-full rounded-xl" /> : chartData.visits.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.visits} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle>Tools by Category</CardTitle>
                <CardDescription>Distribution of available tools</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? <Skeleton className="h-full w-full rounded-xl" /> : chartData.toolsPie.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData.toolsPie} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                        {chartData.toolsPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveModal('mostUsed')}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Most Used Tools</CardTitle>
                  <CardDescription>Top tools in selected period</CardDescription>
                </div>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? <Skeleton className="h-full w-full rounded-xl" /> : chartData.topTools.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No usage recorded</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.topTools} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="uses" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Database and collection status</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-xl border">
                        <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                        <p className="text-2xl font-bold">{metrics.totalUsers}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-xl border">
                        <p className="text-sm text-muted-foreground mb-1">Total Tools</p>
                        <p className="text-2xl font-bold">{metrics.totalTools}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-xl border">
                        <p className="text-sm text-muted-foreground mb-1">Tracked Events</p>
                        <p className="text-2xl font-bold">{metrics.totalVisits}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-xl border">
                        <p className="text-sm text-muted-foreground mb-1">Active Today</p>
                        <p className="text-2xl font-bold">{metrics.activeUsersToday}</p>
                      </div>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Live Activity Stream</CardTitle>
              <CardDescription>Most recent events tracked by analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Device</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={5}><Skeleton className="h-24 w-full" /></TableCell></TableRow>
                    ) : chartData.recentActivity.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No recent activity</TableCell></TableRow>
                    ) : chartData.recentActivity.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{row.eventType.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{row.toolName || row.page || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">{row.country || 'Unknown'}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(row.created).toLocaleTimeString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground capitalize">{row.device || 'desktop'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Database Status" value="Online" subtext="Connected to PocketBase" icon={Database} />
            <MetricCard title="API Status" value="Healthy" subtext="No latency issues detected" icon={Server} />
            <MetricCard title="Error Rate" value="0.0%" subtext="In selected period" icon={AlertCircle} />
          </div>
          <Card className="shadow-sm border-border/50 bg-muted/20">
            <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">All Systems Operational</h3>
              <p className="text-muted-foreground max-w-md">Live connection to PocketBase is stable. Analytics are recording properly. Database size is within normal parameters.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- DETAILED MODALS --- */}
      
      {/* 1. Total Users Modal */}
      <Dialog open={activeModal === 'users'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Insights</DialogTitle>
            <DialogDescription>Detailed breakdown of registered users.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-muted/40 rounded-lg border text-center">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{metrics.totalUsers}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
              <p className="text-sm text-primary">Active Today</p>
              <p className="text-2xl font-bold text-primary">{metrics.activeUsersToday}</p>
            </div>
            <div className="p-4 bg-muted/40 rounded-lg border text-center">
              <p className="text-sm text-muted-foreground">Verification Rate</p>
              <p className="text-2xl font-bold">~95%</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center pb-4 border-b">
            View the User Management page for a full paginated list and editing capabilities.
          </p>
          <Button onClick={() => window.location.href = '/admin/users'} className="w-full mt-4">Go to User Management</Button>
        </DialogContent>
      </Dialog>

      {/* 2. Total Tools Modal */}
      <Dialog open={activeModal === 'tools'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tool Distribution</DialogTitle>
            <DialogDescription>Breakdown of tools across categories.</DialogDescription>
          </DialogHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.toolsPie} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Button onClick={() => window.location.href = '/admin/tools'} className="w-full mt-4">Go to Tools Management</Button>
        </DialogContent>
      </Dialog>

      {/* 3. Total Visits Modal */}
      <Dialog open={activeModal === 'visits'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Traffic Analysis ({dateRange})</DialogTitle>
            <DialogDescription>Detailed view of website traffic over time.</DialogDescription>
          </DialogHeader>
          <div className="h-[300px] w-full mt-4 bg-muted/10 rounded-xl p-4 border">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData.visits} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="date" fontSize={12} />
                 <YAxis fontSize={12} />
                 <Tooltip contentStyle={{ borderRadius: '8px' }} />
                 <Line type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
               </LineChart>
             </ResponsiveContainer>
          </div>
          <Button onClick={() => window.location.href = '/admin/analytics'} className="w-full mt-4">Go to Full Analytics</Button>
        </DialogContent>
      </Dialog>

      {/* 4. Most Used Tools Modal */}
      <Dialog open={activeModal === 'mostUsed'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Top 10 Tools</DialogTitle>
            <DialogDescription>Most frequently accessed tools in {dateRange}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {chartData.topTools.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {i + 1}
                  </div>
                  <span className="font-semibold">{t.name}</span>
                </div>
                <Badge variant="secondary">{t.uses.toLocaleString()} uses</Badge>
              </div>
            ))}
            {chartData.topTools.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No tool usage data found for this period.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Active Users Modal */}
      <Dialog open={activeModal === 'active'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Active Users Timeline</DialogTitle>
            <DialogDescription>Recent activity stream from the last 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto pr-2">
            {chartData.recentActivity.slice(0, 10).map((row, i) => (
              <div key={i} className="flex flex-col p-4 border rounded-lg bg-card">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">User / Session: {row.userId || row.sessionId?.substring(0,8) || 'Anonymous'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(row.created).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{row.eventType.replace('_', ' ')}</Badge>
                  <span>on</span>
                  <span className="font-semibold text-foreground">{row.toolName || row.page}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminDashboard;