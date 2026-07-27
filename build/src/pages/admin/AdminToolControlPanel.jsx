import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Search, Settings2, Activity, ShieldAlert, CheckCircle2, 
  ChevronDown, ChevronUp, RefreshCcw, Loader2, AlertCircle, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToolStatus } from '@/hooks/useToolStatus.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{this.state.error?.message || 'An unexpected error occurred.'}</AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

function AdminToolControlPanelContent() {
  const { toolStatuses, isLoading, error, isAuthenticated, updateToolStatus, refresh } = useToolStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [updatingTool, setUpdatingTool] = useState(null);

  const groupedTools = useMemo(() => {
    const groups = {};
    toolStatuses.forEach(tool => {
      const cat = tool.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(tool);
    });
    return groups;
  }, [toolStatuses]);

  const filteredCategories = useMemo(() => {
    let result = Object.keys(groupedTools);
    if (categoryFilter !== 'all') {
      result = result.filter(c => c === categoryFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(category => 
        groupedTools[category].some(tool => tool.toolName.toLowerCase().includes(query))
      );
    }
    return result.sort();
  }, [groupedTools, categoryFilter, searchQuery]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleToggleTool = async (toolName, currentStatus) => {
    if (updatingTool) return;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUpdatingTool(toolName);
    
    try {
      await updateToolStatus(toolName, newStatus);
      toast.success(`Tool status updated: ${toolName} is now ${newStatus}`);
    } catch (err) {
      toast.error(err.message || `Failed to update ${toolName}`);
    } finally {
      setUpdatingTool(null);
    }
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto mt-10">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <Lock className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Admin login required</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">Please log in to manage tools.</p>
            <Button asChild variant="outline" className="bg-background">
              <Link to={import.meta.env.VITE_ADMIN_LOGIN_PATH || "/admin-a8f4c2e9"}>Go to Login</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalTools = toolStatuses.length;
  const activeTools = toolStatuses.filter(t => t.status === 'active').length;
  const inactiveTools = totalTools - activeTools;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <Helmet>
        <title>Tool Control Panel | Admin</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tool Control Panel</h1>
          <p className="text-muted-foreground mt-1">Manage availability of all tools across the platform.</p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={isLoading || !!updatingTool} className="w-full md:w-auto">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {error && isAuthenticated && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={refresh} className="ml-4 bg-background text-foreground">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && toolStatuses.length === 0 ? (
        <div className="p-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <div className="text-muted-foreground font-medium">Loading tools...</div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-[hsl(var(--admin-surface))] border-[hsl(var(--admin-border))]">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><Settings2 className="w-6 h-6 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tools</p>
                  <h3 className="text-2xl font-bold">{totalTools}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(var(--admin-active-bg))] border-[hsl(var(--admin-active))/0.2]">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="p-3 bg-[hsl(var(--admin-active))/0.1] rounded-xl"><CheckCircle2 className="w-6 h-6 text-[hsl(var(--admin-active))]" /></div>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--admin-active))]">Active Tools</p>
                  <h3 className="text-2xl font-bold text-[hsl(var(--admin-active))]">{activeTools}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(var(--admin-inactive-bg))] border-[hsl(var(--admin-inactive))/0.2]">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="p-3 bg-[hsl(var(--admin-inactive))/0.1] rounded-xl"><ShieldAlert className="w-6 h-6 text-[hsl(var(--admin-inactive))]" /></div>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--admin-inactive))]">Disabled Tools</p>
                  <h3 className="text-2xl font-bold text-[hsl(var(--admin-inactive))]">{inactiveTools}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[hsl(var(--admin-border))]">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tools by name..." className="pl-9 h-12 sm:h-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[250px] h-12 sm:h-10"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.keys(groupedTools).sort().map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">No tools found matching your criteria.</div>
            ) : (
              filteredCategories.map(category => {
                const categoryTools = groupedTools[category];
                const filteredTools = searchQuery ? categoryTools.filter(t => t.toolName.toLowerCase().includes(searchQuery.toLowerCase())) : categoryTools;
                const activeCount = categoryTools.filter(t => t.status === 'active').length;
                const isExpanded = expandedCategories[category] || searchQuery !== '';

                return (
                  <Card key={category} className="border-[hsl(var(--admin-border))] overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-[hsl(var(--admin-surface))] cursor-pointer hover:bg-muted/50 transition-colors touch-target" onClick={() => toggleCategory(category)}>
                      <div className="flex items-center gap-4">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        <div>
                          <h3 className="font-bold text-lg">{category}</h3>
                          <p className="text-sm text-muted-foreground">{activeCount} of {categoryTools.length} active</p>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[hsl(var(--admin-border))] divide-y divide-[hsl(var(--admin-border))]">
                        {filteredTools.map(tool => {
                          const isUpdatingThis = updatingTool === tool.toolName;
                          return (
                            <div key={tool.toolName} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors gap-4">
                              <div className="flex items-center gap-3">
                                <Activity className={`w-4 h-4 shrink-0 ${tool.status === 'active' ? 'text-[hsl(var(--admin-active))]' : 'text-muted-foreground'}`} />
                                <span className="font-medium">{tool.toolName}</span>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className={tool.status === 'active' ? 'bg-[hsl(var(--admin-active))] hover:bg-[hsl(var(--admin-active))] text-white' : 'bg-muted text-muted-foreground'}>
                                  {tool.status === 'active' ? 'Active' : 'Disabled'}
                                </Badge>
                                {isAuthenticated && (
                                  <div className="flex items-center gap-2">
                                    {isUpdatingThis && <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>}
                                    <Switch 
                                      checked={tool.status === 'active'}
                                      onCheckedChange={() => handleToggleTool(tool.toolName, tool.status)}
                                      disabled={!!updatingTool}
                                      className="data-[state=checked]:bg-[hsl(var(--admin-active))]"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminToolControlPanel() {
  return (
    <ErrorBoundary>
      <AdminToolControlPanelContent />
    </ErrorBoundary>
  );
}