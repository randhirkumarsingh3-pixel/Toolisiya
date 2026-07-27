import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Edit, RefreshCw, CheckCircle, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { calculateSEOScore, getSEOScoreColor, getSEOIssues } from '@/utils/seoScoringEngine.js';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';

export default function SEODashboard() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // AI Generation State
  const { messages, sendMessage, isStreaming } = useIntegratedAi();
  const [generationQueue, setGenerationQueue] = useState([]);
  const [currentGeneration, setCurrentGeneration] = useState(null);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  
  const lastMessageCountRef = useRef(0);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const seoRecords = await pb.collection('seo_settings').getFullList({ 
        sort: '-created',
        $autoCancel: false 
      });
      
      const uniqueMap = new Map();
      seoRecords.forEach(record => {
        if (record.page_name && !uniqueMap.has(record.page_name)) {
          uniqueMap.set(record.page_name, record);
        }
      });
      
      const uniqueRecords = Array.from(uniqueMap.values());

      const formatted = uniqueRecords.map(record => ({
        ...record,
        score: calculateSEOScore(record),
        issues: getSEOIssues(record)
      }));
      
      setTools(formatted);
    } catch (error) {
      console.error("Error fetching SEO data:", error);
      toast.error('Failed to load SEO data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Handle AI Generation Queue
  useEffect(() => {
    const processQueue = async () => {
      if (generationQueue.length > 0 && !currentGeneration && !isStreaming && !generationError) {
        const nextTool = generationQueue[0];
        setCurrentGeneration(nextTool);
        setGenerationError(null);
        setShowProgressDialog(true);
        
        // Simulate progress steps for UI feedback
        setProgressStep('Initializing AI...');
        setProgressPercent(10);
        
        setTimeout(() => { setProgressStep('Generating title...'); setProgressPercent(25); }, 1000);
        setTimeout(() => { setProgressStep('Generating description...'); setProgressPercent(40); }, 2000);
        setTimeout(() => { setProgressStep('Generating keywords & H1...'); setProgressPercent(60); }, 3000);
        setTimeout(() => { setProgressStep('Generating detailed content (300+ words)...'); setProgressPercent(80); }, 4000);

        const prompt = `You are an expert SEO copywriter. Generate comprehensive SEO metadata and content for a web tool called "${nextTool.page_name}".
        The tool is used for: ${nextTool.page_name} operations.
        Return ONLY a valid JSON object with the following exact keys:
        - "meta_title": A catchy, SEO-optimized title (50-60 characters).
        - "meta_description": A compelling description (150-160 characters).
        - "meta_keywords": 5-10 relevant keywords, comma-separated.
        - "h1_tag": The main H1 heading for the page.
        - "content": Detailed, helpful HTML content (minimum 300 words) explaining what the tool is, how to use it, and its benefits. Use proper HTML tags like <p>, <h2>, <ul>, <li>.

        Do not include markdown formatting like \`\`\`json. Just return the raw JSON object.`;

        lastMessageCountRef.current = messages.length;
        try {
          await sendMessage(prompt);
        } catch (error) {
          console.error('Generation error:', error);
          setGenerationError(error.message || 'Failed to generate SEO data');
        }
      }
    };

    processQueue();
  }, [generationQueue, currentGeneration, isStreaming, messages.length, sendMessage, generationError]);

  // Handle AI Response Completion
  useEffect(() => {
    const handleCompletion = async () => {
      if (currentGeneration && !isStreaming && messages.length > lastMessageCountRef.current) {
        const lastMsg = messages[messages.length - 1];
        
        if (lastMsg.role === 'assistant') {
          setProgressStep('Saving to database...');
          setProgressPercent(95);
          
          try {
            // Extract text content from the message blocks
            let textContent = '';
            if (Array.isArray(lastMsg.content)) {
              textContent = lastMsg.content.map(block => block.text || block.data?.content || '').join('');
            } else if (typeof lastMsg.content === 'string') {
              textContent = lastMsg.content;
            }

            // Parse JSON robustly - fixed regex syntax
            const match = textContent.match(/\{[\s\S]*\}/);
            if (!match) {
              throw new Error('No valid JSON found in response');
            }

            const jsonStr = match[0];
            const parsedData = JSON.parse(jsonStr);

            // Validate all required fields are present
            const requiredFields = ['meta_title', 'meta_description', 'meta_keywords', 'h1_tag', 'content'];
            const missingFields = requiredFields.filter(field => !parsedData[field]);

            if (missingFields.length > 0) {
              throw new Error(`Missing fields: ${missingFields.join(', ')}`);
            }

            // Find existing record or create new one
            let existingRecord = tools.find(t => t.page_name === currentGeneration.page_name);
            
            if (existingRecord) {
              // Update existing record
              await pb.collection('seo_settings').update(existingRecord.id, {
                meta_title: parsedData.meta_title,
                meta_description: parsedData.meta_description,
                meta_keywords: parsedData.meta_keywords,
                h1_tag: parsedData.h1_tag,
                content: parsedData.content
              }, { $autoCancel: false });
            } else {
              // Create new record
              await pb.collection('seo_settings').create({
                page_name: currentGeneration.page_name,
                meta_title: parsedData.meta_title,
                meta_description: parsedData.meta_description,
                meta_keywords: parsedData.meta_keywords,
                h1_tag: parsedData.h1_tag,
                content: parsedData.content
              }, { $autoCancel: false });
            }

            setProgressPercent(100);
            setProgressStep('Complete!');
            
            setTimeout(() => {
              toast.success(`SEO data generated for ${currentGeneration.page_name}`);
              setShowProgressDialog(false);
              setCurrentGeneration(null);
              setGenerationQueue(prev => prev.slice(1));
              fetchTools();
            }, 1000);

          } catch (error) {
            console.error('Generation error:', error);
            setGenerationError(error.message);
            toast.error(`Failed to generate SEO data: ${error.message}`);
          }
        }
      }
    };

    handleCompletion();
  }, [isStreaming, messages.length, currentGeneration, tools]);

  const handleGenerateAll = async () => {
    try {
      const toolsToGenerate = tools.filter(t => !t.meta_title || !t.meta_description);
      
      if (toolsToGenerate.length === 0) {
        toast.info('All tools already have SEO data');
        return;
      }

      setGenerationQueue(toolsToGenerate);
      toast.info(`Queued ${toolsToGenerate.length} tools for SEO generation`);
    } catch (error) {
      toast.error('Failed to queue tools for generation');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await pb.collection('seo_settings').update(selectedTool.id, editData, { $autoCancel: false });
      toast.success('SEO data updated');
      setSelectedTool(null);
      fetchTools();
    } catch (error) {
      toast.error('Failed to update SEO data');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTools = tools.filter(t => t.page_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const avgScore = tools.length ? Math.round(tools.reduce((acc, t) => acc + t.score, 0) / tools.length) : 0;
  const needsAttention = tools.filter(t => t.score < 70).length;

  return (
    <div className="space-y-6 p-6">
      <Helmet><title>SEO Dashboard | Admin</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          <p className="text-muted-foreground">Manage and optimize search engine visibility.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchTools}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
          <Button onClick={handleGenerateAll} className="gap-2"><Sparkles className="w-4 h-4" /> Auto-Generate All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Unique Pages</p>
            <h3 className="text-2xl font-bold">{tools.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Average Score</p>
            <h3 className={`text-2xl font-bold ${getSEOScoreColor(avgScore) === 'green' ? 'text-emerald-500' : getSEOScoreColor(avgScore) === 'yellow' ? 'text-yellow-500' : 'text-destructive'}`}>
              {avgScore}/100
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
            <h3 className="text-2xl font-bold text-destructive">{needsAttention}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Fully Optimized</p>
            <h3 className="text-2xl font-bold text-emerald-500">{tools.filter(t => t.score === 100).length}</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>SEO Pages</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pages..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page / Slug</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : filteredTools.map(tool => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.page_name}</TableCell>
                  <TableCell>
                    <Badge variant={getSEOScoreColor(tool.score) === 'green' ? 'default' : getSEOScoreColor(tool.score) === 'yellow' ? 'secondary' : 'destructive'}>
                      {tool.score}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {tool.issues.slice(0, 2).map((issue, i) => (
                        <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-500" /> {issue}
                        </span>
                      ))}
                      {tool.issues.length > 2 && <span className="text-xs text-muted-foreground">+{tool.issues.length - 2} more</span>}
                      {tool.issues.length === 0 && <span className="text-xs text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Perfect</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedTool(tool); setEditData(tool); }}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredTools.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No SEO pages found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit SEO: {selectedTool?.page_name}</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Meta Title</Label>
                  <span className="text-xs text-muted-foreground">{editData.meta_title?.length || 0}/60</span>
                </div>
                <Input value={editData.meta_title || ''} onChange={e => setEditData({...editData, meta_title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Meta Description</Label>
                  <span className="text-xs text-muted-foreground">{editData.meta_description?.length || 0}/160</span>
                </div>
                <Textarea value={editData.meta_description || ''} onChange={e => setEditData({...editData, meta_description: e.target.value})} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma separated)</Label>
                <Input value={editData.meta_keywords || ''} onChange={e => setEditData({...editData, meta_keywords: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>H1 Tag</Label>
                <Input value={editData.h1_tag || ''} onChange={e => setEditData({...editData, h1_tag: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedTool(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showProgressDialog} onOpenChange={(open) => {
        setShowProgressDialog(open);
        if (!open) {
          setCurrentGeneration(null);
          setGenerationError(null);
          setGenerationQueue([]);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {!generationError && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              {generationError ? 'Generation Failed' : 'Generating SEO Content'}
            </DialogTitle>
            <DialogDescription>
              {currentGeneration?.page_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">{progressStep}</p>
              <Progress value={progressPercent} className="h-2" />
            </div>
            {generationError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm text-destructive">{generationError}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setGenerationError(null);
                    setGenerationQueue([currentGeneration, ...generationQueue.slice(1)]);
                  }}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}