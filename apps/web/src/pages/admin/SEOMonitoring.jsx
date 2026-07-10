import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, ShieldCheck, Zap, FileText, CheckCircle2, AlertTriangle, RefreshCw, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function SEOMonitoring() {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState([]);

  const fetchQualityData = () => {
    setLoading(true);
    // Simulate fetching the new comprehensive quality metrics
    setTimeout(() => {
      setTools([
        { 
          name: 'PDF Editor', 
          seoScore: 99, 
          contentScore: 95, 
          trustScore: 100, 
          perfScore: 92, 
          a11yScore: 100,
          lastReviewed: '2026-07-10',
          indexStatus: 'Indexed',
          internalLinks: 14,
          schemaStatus: 'Valid',
          cwv: 'Pass'
        },
        { 
          name: 'Invoice Generator', 
          seoScore: 95, 
          contentScore: 98, 
          trustScore: 95, 
          perfScore: 88, 
          a11yScore: 96,
          lastReviewed: '2026-07-08',
          indexStatus: 'Indexed',
          internalLinks: 8,
          schemaStatus: 'Valid',
          cwv: 'Pass'
        },
        { 
          name: 'Image Compressor', 
          seoScore: 85, 
          contentScore: 70, 
          trustScore: 90, 
          perfScore: 98, 
          a11yScore: 100,
          lastReviewed: '2026-06-15',
          indexStatus: 'Crawled - Not Indexed',
          internalLinks: 3,
          schemaStatus: 'Missing Video',
          cwv: 'Pass'
        },
        { 
          name: 'GST Calculator', 
          seoScore: 92, 
          contentScore: 85, 
          trustScore: 98, 
          perfScore: 95, 
          a11yScore: 90,
          lastReviewed: '2026-07-01',
          indexStatus: 'Indexed',
          internalLinks: 12,
          schemaStatus: 'Valid',
          cwv: 'Needs Improvement'
        }
      ]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchQualityData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 p-6">
      <Helmet><title>Tool Quality Dashboard | Admin</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tool Quality Dashboard</h1>
          <p className="text-muted-foreground">Monitor Enterprise E-E-A-T, SEO, and Performance across all premium tools.</p>
        </div>
        <Button onClick={fetchQualityData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Run Full Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><BarChart className="w-4 h-4" /> Avg SEO Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">93/100</div>
            <Progress value={93} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><FileText className="w-4 h-4" /> Avg Content Depth</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">87/100</div>
            <Progress value={87} className="h-2 bg-primary/20" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Global Trust Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2 text-emerald-500">96/100</div>
            <Progress value={96} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4" /> CWV Pass Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">75%</div>
            <Progress value={75} className="h-2 bg-amber-500/20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Tool Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Tool Name</th>
                    <th className="px-4 py-3">SEO</th>
                    <th className="px-4 py-3">Content</th>
                    <th className="px-4 py-3">Trust</th>
                    <th className="px-4 py-3">Perf</th>
                    <th className="px-4 py-3">Index Status</th>
                    <th className="px-4 py-3">Links</th>
                    <th className="px-4 py-3">Schema</th>
                    <th className="px-4 py-3 rounded-tr-lg">Last Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tools.map((tool, idx) => (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4 font-bold">{tool.name}</td>
                      <td className={`px-4 py-4 font-semibold ${getScoreColor(tool.seoScore)}`}>{tool.seoScore}</td>
                      <td className={`px-4 py-4 font-semibold ${getScoreColor(tool.contentScore)}`}>{tool.contentScore}</td>
                      <td className={`px-4 py-4 font-semibold ${getScoreColor(tool.trustScore)}`}>{tool.trustScore}</td>
                      <td className={`px-4 py-4 font-semibold ${getScoreColor(tool.perfScore)}`}>{tool.perfScore}</td>
                      <td className="px-4 py-4">
                        {tool.indexStatus === 'Indexed' ? 
                          <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium"><CheckCircle2 className="w-3 h-3"/> Indexed</span> : 
                          <span className="flex items-center gap-1 text-amber-500 text-xs font-medium"><AlertTriangle className="w-3 h-3"/> {tool.indexStatus}</span>
                        }
                      </td>
                      <td className="px-4 py-4 font-mono">{tool.internalLinks}</td>
                      <td className="px-4 py-4">
                        {tool.schemaStatus === 'Valid' ? 
                          <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs">Valid</span> : 
                          <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-xs">{tool.schemaStatus}</span>
                        }
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">{tool.lastReviewed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}