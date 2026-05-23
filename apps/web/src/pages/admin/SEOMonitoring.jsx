import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { calculateSEOScore, getSEOIssues } from '@/utils/seoScoringEngine.js';

export default function SEOMonitoring() {
  const [stats, setStats] = useState({ total: 0, complete: 0, incomplete: 0, avgScore: 0, issues: [] });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/admin/seo_settings');
      const records = res.ok ? await res.json() : [];
      let totalScore = 0;
      let complete = 0;
      const allIssues = [];

      records.forEach(record => {
        const score = calculateSEOScore(record);
        totalScore += score;
        if (score === 100) complete++;
        
        const issues = getSEOIssues(record);
        if (issues.length > 0) {
          allIssues.push({ page: record.page_name, score, issues });
        }
      });

      setStats({
        total: records.length,
        complete,
        incomplete: records.length - complete,
        avgScore: records.length ? Math.round(totalScore / records.length) : 0,
        issues: allIssues.sort((a, b) => a.score - b.score)
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Helmet><title>SEO Monitoring | Admin</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Monitoring</h1>
          <p className="text-muted-foreground">Track SEO health and identify critical issues.</p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Average Health Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{stats.avgScore}/100</div>
            <Progress value={stats.avgScore} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Fully Optimized Pages</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <div className="text-3xl font-bold">{stats.complete}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stats.total ? Math.round((stats.complete/stats.total)*100) : 0}% of total pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pages Needing Attention</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div className="text-3xl font-bold">{stats.incomplete}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pages with score &lt; 100</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Issues Report</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading report...</p> : (
            <div className="space-y-4">
              {stats.issues.slice(0, 10).map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg bg-muted/30">
                  <div>
                    <h4 className="font-semibold">{item.page}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.issues.map((issue, j) => (
                        <span key={j} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-md">{issue}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <div className="text-2xl font-bold text-destructive">{item.score}</div>
                    <span className="text-xs text-muted-foreground">Score</span>
                  </div>
                </div>
              ))}
              {stats.issues.length === 0 && (
                <div className="text-center py-8 text-emerald-500 font-medium flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 mb-2" />
                  No SEO issues found!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}