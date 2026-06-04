import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { Save, GripVertical, Menu as MenuIcon, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function MenuSetup() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [visibility, setVisibility] = useState({});
  const [toolOrder, setToolOrder] = useState({});
  const [tools, setTools] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await apiServerClient.fetch('/admin/menu-setup');
        if (!response.ok) throw new Error('Failed to fetch menu configuration from server');
        const data = await response.json();

        const toolsRecords = data.tools || [];
        setTools(toolsRecords);
        
        const catRecords = data.categories || [];
        const allUniqueCats = catRecords.map(c => c.name);

        const settingsRecords = data.menuSettings || [];

        if (settingsRecords.length > 0) {
          const record = settingsRecords[0];
          setRecordId(record.id);

          const savedOrder = record.categoryOrder || [];
          const savedVisibility = record.visibility || {};
          const savedToolOrder = record.toolOrder || {};

          const missing = allUniqueCats.filter(c => !savedOrder.includes(c));
          const combinedOrder = [...savedOrder, ...missing];

          setCategories(allUniqueCats);
          setCategoryOrder(combinedOrder);

          const finalVisibility = { ...savedVisibility };
          missing.forEach(m => finalVisibility[m] = true);
          setVisibility(finalVisibility);
          setToolOrder(savedToolOrder);
        } else {
          const defaultVisibility = {};
          allUniqueCats.forEach(c => defaultVisibility[c] = true);

          // Create default menu settings on backend
          const createRes = await apiServerClient.fetch('/admin/menu-setup/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              categories: allUniqueCats,
              categoryOrder: allUniqueCats,
              visibility: defaultVisibility,
              toolOrder: {}
            })
          });
          if (!createRes.ok) throw new Error('Failed to create default menu settings');
          const newRecord = await createRes.json();

          setRecordId(newRecord.id);
          setCategories(allUniqueCats);
          setCategoryOrder(allUniqueCats);
          setVisibility(defaultVisibility);
          setToolOrder({});
        }
      } catch (error) {
        console.error('Error fetching menu config:', error);
        toast.error('Failed to load menu configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    if (result.type === 'category') {
      const items = Array.from(categoryOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setCategoryOrder(items);
    } else if (result.type === 'tool') {
      const cat = result.source.droppableId;
      if (cat !== result.destination.droppableId) return; // Cannot drag across categories
      
      const categoryToolsRaw = tools.filter(t => t.category === cat);
      // Generate current tool order list if it doesn't exist
      let currentCatOrder = toolOrder[cat];
      if (!currentCatOrder || currentCatOrder.length === 0) {
        currentCatOrder = categoryToolsRaw.map(t => t.id);
      } else {
        // Ensure all current tools are in the list
        const missingToolIds = categoryToolsRaw.filter(t => !currentCatOrder.includes(t.id)).map(t => t.id);
        currentCatOrder = [...currentCatOrder, ...missingToolIds];
      }
      
      const items = Array.from(currentCatOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      setToolOrder(prev => ({ ...prev, [cat]: items }));
    }
  };

  const handleVisibilityToggle = (cat, checked) => {
    setVisibility(prev => ({ ...prev, [cat]: checked }));
  };

  const toggleCategoryExpand = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleToolMenuToggle = async (toolId, currentShowStatus) => {
    try {
      const newStatus = !currentShowStatus;
      const res = await apiServerClient.fetch(`/admin/menu-setup/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ show_in_menu: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update tool status on server');

      setTools(prev => prev.map(t => t.id === toolId ? { ...t, show_in_menu: newStatus } : t));
      toast.success(newStatus ? 'Tool added to navigation dropdown' : 'Tool removed from dropdown');
    } catch (err) {
      console.error('Error toggling tool visibility:', err);
      toast.error('Failed to update tool menu visibility');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { categories, categoryOrder, visibility, toolOrder };
      if (recordId) {
        const res = await apiServerClient.fetch(`/admin/menu-setup/settings/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update menu settings');
      } else {
        const res = await apiServerClient.fetch('/admin/menu-setup/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create menu settings');
        const newRec = await res.json();
        setRecordId(newRec.id);
      }
      toast.success('Menu configuration saved successfully');
    } catch (error) {
      console.error('Error saving menu config:', error);
      toast.error('Failed to save menu configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Setup</h1>
        <p className="text-muted-foreground mt-2">Manage category display order and select which tools appear in the navigation dropdowns.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MenuIcon className="h-5 w-5 text-primary" />
            Category & Dropdown Configuration
          </CardTitle>
          <CardDescription>
            Drag to reorder top-level categories. Expand a category to select which active tools appear in its dropdown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories" type="category">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {categoryOrder.map((cat, index) => {
                    const categoryToolsRaw = tools.filter(t => t.category === cat);
                    
                    // Sort tools based on toolOrder
                    const catToolOrder = toolOrder[cat] || [];
                    const categoryTools = [...categoryToolsRaw].sort((a, b) => {
                      const idxA = catToolOrder.indexOf(a.id);
                      const idxB = catToolOrder.indexOf(b.id);
                      if (idxA === -1 && idxB === -1) return 0;
                      if (idxA === -1) return 1;
                      if (idxB === -1) return -1;
                      return idxA - idxB;
                    });

                    const toolsInMenuCount = categoryTools.filter(t => t.show_in_menu).length;
                    const isExpanded = expandedCategories[cat];

                    return (
                      <Draggable key={cat} draggableId={cat} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-muted/10 border rounded-lg overflow-hidden transition-all"
                          >
                            <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1">
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <span className="font-semibold text-sm sm:text-base">{cat}</span>
                                <Badge variant="secondary" className="font-normal text-xs text-muted-foreground hidden sm:inline-flex">
                                  {toolsInMenuCount} / {categoryTools.length} in menu
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
                                    {visibility[cat] !== false ? 'Show in Nav' : 'Hidden'}
                                  </span>
                                  <Switch 
                                    checked={visibility[cat] !== false}
                                    onCheckedChange={(checked) => handleVisibilityToggle(cat, checked)}
                                  />
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleCategoryExpand(cat)}>
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <Droppable droppableId={cat} type="tool">
                                {(provided) => (
                                  <div 
                                    className="p-3 bg-background divide-y"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {categoryTools.length === 0 ? (
                                      <p className="text-sm text-muted-foreground p-2 text-center">No active tools in this category.</p>
                                    ) : (
                                      categoryTools.map((tool, tIndex) => (
                                        <Draggable key={tool.id} draggableId={tool.id} index={tIndex}>
                                          {(provided) => (
                                            <div 
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className="flex items-center justify-between py-2 px-2 hover:bg-muted/20 bg-background"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div {...provided.dragHandleProps} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1">
                                                  <GripVertical className="h-4 w-4" />
                                                </div>
                                                <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{tool.name}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">In Dropdown</span>
                                                <Switch 
                                                  checked={tool.show_in_menu || false}
                                                  onCheckedChange={() => handleToolMenuToggle(tool.id, tool.show_in_menu)}
                                                  className="scale-75 data-[state=checked]:bg-primary"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-end pt-6 mt-4 border-t">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 font-medium px-6">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Category Order'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}