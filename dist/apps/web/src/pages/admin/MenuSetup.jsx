import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { Save, GripVertical, Menu as MenuIcon, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
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
  const [tools, setTools] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Fetch active tools and unique categories
        const toolsRecords = await pb.collection('tools').getFullList({ 
          filter: "status = 'active'",
          $autoCancel: false 
        });
        setTools(toolsRecords);
        
        const catRecords = await pb.collection('categories').getFullList({ filter: "is_active = true", $autoCancel: false });
        const allUniqueCats = catRecords.map(c => c.name);

        // Fetch menu_settings
        const settingsRecords = await pb.collection('menu_settings').getFullList({ $autoCancel: false });

        if (settingsRecords.length > 0) {
          const record = settingsRecords[0];
          setRecordId(record.id);

          const savedOrder = record.categoryOrder || [];
          const savedVisibility = record.visibility || {};

          const missing = allUniqueCats.filter(c => !savedOrder.includes(c));
          const combinedOrder = [...savedOrder, ...missing];

          setCategories(allUniqueCats);
          setCategoryOrder(combinedOrder);

          const finalVisibility = { ...savedVisibility };
          missing.forEach(m => finalVisibility[m] = true);
          setVisibility(finalVisibility);
        } else {
          const defaultVisibility = {};
          allUniqueCats.forEach(c => defaultVisibility[c] = true);

          const newRecord = await pb.collection('menu_settings').create({
            categories: allUniqueCats,
            categoryOrder: allUniqueCats,
            visibility: defaultVisibility
          }, { $autoCancel: false });

          setRecordId(newRecord.id);
          setCategories(allUniqueCats);
          setCategoryOrder(allUniqueCats);
          setVisibility(defaultVisibility);
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
    const items = Array.from(categoryOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategoryOrder(items);
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
      await pb.collection('tools').update(toolId, { show_in_menu: newStatus }, { $autoCancel: false });
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, show_in_menu: newStatus } : t));
      toast.success(newStatus ? 'Tool added to navigation dropdown' : 'Tool removed from dropdown');
    } catch (err) {
      toast.error('Failed to update tool menu visibility');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { categories, categoryOrder, visibility };
      if (recordId) {
        await pb.collection('menu_settings').update(recordId, payload, { $autoCancel: false });
      } else {
        const newRec = await pb.collection('menu_settings').create(payload, { $autoCancel: false });
        setRecordId(newRec.id);
      }
      toast.success('Menu configuration saved successfully');
    } catch (error) {
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
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {categoryOrder.map((cat, index) => {
                    const categoryTools = tools.filter(t => t.category === cat);
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
                              <div className="p-3 bg-background divide-y">
                                {categoryTools.length === 0 ? (
                                  <p className="text-sm text-muted-foreground p-2 text-center">No active tools in this category.</p>
                                ) : (
                                  categoryTools.map(tool => (
                                    <div key={tool.id} className="flex items-center justify-between py-2 px-2 hover:bg-muted/20">
                                      <div className="flex items-center gap-2">
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
                                  ))
                                )}
                              </div>
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