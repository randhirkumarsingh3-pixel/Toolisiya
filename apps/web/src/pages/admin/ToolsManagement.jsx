import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Settings2, Trash2, Check, Search, Layers, Plus, Edit, 
  AlertCircle, DollarSign, Briefcase, Image as ImageIcon, 
  FileText, Code, Zap, FlaskConical, CheckCircle, RefreshCw, 
  Home, Mail 
} from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const ICON_MAP = {
  DollarSign, Briefcase, Image: ImageIcon, FileText, 
  Code, Zap, FlaskConical, CheckCircle, RefreshCw, Home, Mail, Layers
};
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

const ToolsManagement = () => {
  const { fetchActiveTools } = useActiveTools();
  // Shared State
  const [activeTab, setActiveTab] = useState('tools');
  const [isLoading, setIsLoading] = useState(true);
  
  // Tools State
  const [tools, setTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInputs, setUrlInputs] = useState({});
  
  // Categories State
  const [categories, setCategories] = useState([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  
  // Modal States
  const [isEditCatOpen, setIsEditCatOpen] = useState(false);
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: '', slug: '', icon: 'Layers', description: '', is_active: true, order: 0
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [toolsRes, catRes] = await Promise.all([
        pb.collection('tools').getFullList({ sort: 'category,name', $autoCancel: false }),
        pb.collection('categories').getFullList({ sort: 'order', $autoCancel: false })
      ]);
      
      setTools(toolsRes);
      setCategories(catRes);
      
      const initialUrls = {};
      toolsRes.forEach(t => { initialUrls[t.id] = t.url; });
      setUrlInputs(initialUrls);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- TOOLS LOGIC ---
  const handleCategoryUpdate = async (toolId, newCategoryName) => {
    try {
      await pb.collection('tools').update(toolId, { category: newCategoryName }, { $autoCancel: false });
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, category: newCategoryName } : t));
      toast.success('Category updated successfully');
    } catch (err) {
      toast.error('Failed to update category');
    }
  };

  const handleUrlUpdate = async (toolId) => {
    const newUrl = urlInputs[toolId];
    if (!newUrl) return toast.error('URL cannot be empty');
    if (!newUrl.startsWith('/')) return toast.error('URL must start with a forward slash (/)');
    if (/\s/.test(newUrl)) return toast.error('URL cannot contain spaces');
    if (tools.some(t => t.url === newUrl && t.id !== toolId)) return toast.error('This URL is already in use');

    try {
      await pb.collection('tools').update(toolId, { url: newUrl }, { $autoCancel: false });
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, url: newUrl } : t));
      toast.success('URL updated successfully');
    } catch (err) {
      toast.error('Failed to update URL');
    }
  };

  const handleStatusUpdate = async (toolId, newStatus) => {
    try {
      await pb.collection('tools').update(toolId, { status: newStatus }, { $autoCancel: false });
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, status: newStatus } : t));
      if (fetchActiveTools) fetchActiveTools();
      toast.success(`Tool ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      toast.error('Failed to update tool status');
    }
  };

  const handleDeleteTool = async (tool) => {
    if (window.confirm(`Permanently delete the tool "${tool.name}"?`)) {
      try {
        await pb.collection('tools').delete(tool.id, { $autoCancel: false });
        setTools(prev => prev.filter(t => t.id !== tool.id));
        toast.success(`Tool deleted`);
      } catch (err) {
        toast.error('Failed to delete tool');
      }
    }
  };

  // --- CATEGORIES LOGIC ---
  const handleOpenEditCat = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setCatFormData({
        name: category.name, slug: category.slug, icon: category.icon || 'Layers',
        description: category.description || '', is_active: category.is_active, order: category.order
      });
    } else {
      setSelectedCategory(null);
      setCatFormData({
        name: '', slug: '', icon: 'Layers', description: '', is_active: true, order: categories.length
      });
    }
    setIsEditCatOpen(true);
  };

  const handleSaveCat = async () => {
    if (!catFormData.name || !catFormData.slug) return toast.error('Name and Slug are required');
    try {
      if (selectedCategory) {
        await pb.collection('categories').update(selectedCategory.id, catFormData);
        toast.success('Category updated');
      } else {
        await pb.collection('categories').create(catFormData);
        toast.success('Category created');
      }
      setIsEditCatOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCat = async () => {
    try {
      await pb.collection('categories').delete(selectedCategory.id);
      toast.success('Category deleted');
      setIsDeleteCatOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const toggleCatStatus = async (category) => {
    try {
      await pb.collection('categories').update(category.id, { is_active: !category.is_active }, { $autoCancel: false });
      setCategories(prev => prev.map(c => c.id === category.id ? { ...c, is_active: !c.is_active } : c));
      if (fetchActiveTools) fetchActiveTools();
      toast.success(`Category ${!category.is_active ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredTools = tools.filter(t => 
    !searchQuery || t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || t.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
    !categorySearchQuery || c.name?.toLowerCase().includes(categorySearchQuery.toLowerCase()) || c.slug?.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Helmet><title>Tool Registry & Categories - Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tool Registry</h1>
        <p className="text-muted-foreground mt-2">Manage tools and categories. The kill switch instantly removes tools from the public website.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> Tools
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Layers className="h-4 w-4" /> Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-xl">All Tools</CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tools..." className="pl-9 bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
              ) : filteredTools.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No tools found matching your search.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Tool Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>URL Path</TableHead>
                        <TableHead>Kill Switch</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTools.map((tool) => (
                        <TableRow key={tool.id} className="hover:bg-muted/10">
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>
                            <Select value={tool.category} onValueChange={(val) => handleCategoryUpdate(tool.id, val)}>
                              <SelectTrigger className="h-9 w-[180px] bg-background">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input 
                                value={urlInputs[tool.id] ?? ''}
                                onChange={(e) => setUrlInputs(prev => ({ ...prev, [tool.id]: e.target.value }))}
                                className="h-9 font-mono text-xs w-[200px]"
                              />
                              <Button size="icon" variant="secondary" className="h-9 w-9 shrink-0" onClick={() => handleUrlUpdate(tool.id)} disabled={urlInputs[tool.id] === tool.url}>
                                <Check className="h-4 w-4 text-emerald-600" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={tool.status === 'active'}
                                onCheckedChange={(checked) => handleStatusUpdate(tool.id, checked ? 'active' : 'inactive')}
                                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-red-500"
                              />
                              <Badge variant={tool.status === 'active' ? "default" : "destructive"} className={tool.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                {tool.status === 'active' ? 'Active' : 'Disabled'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteTool(tool)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-xl">Categories</CardTitle>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search categories..." className="pl-9 bg-background" value={categorySearchQuery} onChange={(e) => setCategorySearchQuery(e.target.value)} />
                  </div>
                  <Button onClick={() => handleOpenEditCat()} className="shrink-0 gap-2"><Plus className="h-4 w-4"/> New</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">{[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No categories found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => {
                        const Icon = ICON_MAP[category.icon] || Layers;
                        return (
                          <TableRow key={category.id} className="hover:bg-muted/10">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Icon className="h-5 w-5" /></div>
                                <div className="flex flex-col">
                                  <span className="font-semibold">{category.name}</span>
                                  <span className="text-xs text-muted-foreground">{category.description || 'No description'}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">/{category.slug}</code></TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch checked={category.is_active} onCheckedChange={() => toggleCatStatus(category)} className="scale-75 data-[state=checked]:bg-emerald-500" />
                                <Badge variant="outline" className={category.is_active ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "text-muted-foreground"}>{category.is_active ? 'Active' : 'Disabled'}</Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditCat(category)} className="h-8 w-8 text-muted-foreground hover:text-primary"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(category); setIsDeleteCatOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Category Modal */}
      <Dialog open={isEditCatOpen} onOpenChange={setIsEditCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>Configure details for this category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={catFormData.name} onChange={e => setCatFormData({...catFormData, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={catFormData.slug} onChange={e => setCatFormData({...catFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} /></div>
            </div>
            <div className="space-y-2"><Label>Icon (Lucide)</Label><Input value={catFormData.icon} onChange={e => setCatFormData({...catFormData, icon: e.target.value})} /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={catFormData.description} onChange={e => setCatFormData({...catFormData, description: e.target.value})} /></div>
            <div className="flex items-center gap-3"><Label>Active</Label><Switch checked={catFormData.is_active} onCheckedChange={checked => setCatFormData({...catFormData, is_active: checked})} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsEditCatOpen(false)}>Cancel</Button><Button onClick={handleSaveCat}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Modal */}
      <Dialog open={isDeleteCatOpen} onOpenChange={setIsDeleteCatOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><AlertCircle className="h-5 w-5"/> Delete Category</DialogTitle><DialogDescription>Are you sure you want to delete {selectedCategory?.name}? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteCatOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteCat}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToolsManagement;