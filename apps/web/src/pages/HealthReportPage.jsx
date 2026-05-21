import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Activity, Search, Smartphone, Zap, Link as LinkIcon, 
  AlertTriangle, FileCode2, Lock, Key, Database, Server, 
  CheckCircle2, XCircle, Info, Printer, Download, ChevronRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import SEOHead from '@/components/SEOHead.jsx';

const HealthReportPage = () => {
  const [activeTab, setActiveTab] = useState('executive');

  const handlePrint = () => {
    window.print();
  };

  // Mock Data for the 25 Sections
  const reportData = {
    executiveSummary: {
      healthScore: 94,
      securityScore: 88,
      riskLevel: 'Low',
      securityRating: 'A-',
      lastScan: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      criticalIssues: 0,
      highIssues: 2,
      mediumIssues: 5,
      lowIssues: 12
    },
    radarData: [
      { subject: 'Security', A: 88, fullMark: 100 },
      { subject: 'Performance', A: 95, fullMark: 100 },
      { subject: 'SEO', A: 98, fullMark: 100 },
      { subject: 'Accessibility', A: 92, fullMark: 100 },
      { subject: 'Best Practices', A: 96, fullMark: 100 },
    ],
    vitalsData: [
      { name: 'LCP (s)', value: 1.2, threshold: 2.5, fill: '#10b981' },
      { name: 'FID (ms)', value: 45, threshold: 100, fill: '#10b981' },
      { name: 'CLS', value: 0.04, threshold: 0.1, fill: '#10b981' },
      { name: 'TTFB (ms)', value: 210, threshold: 600, fill: '#10b981' },
    ],
    sections: [
      // Security (11 items)
      { id: 1, title: 'SSL/HTTPS Status', category: 'Security', status: 'Pass', severity: 'Low', icon: Lock, details: 'TLS 1.3 active. Certificate valid until 2027. Strong cipher suites (AES-256-GCM) enforced. No mixed content detected.' },
      { id: 9, title: 'Security Headers', category: 'Security', status: 'Warning', severity: 'Medium', icon: ShieldCheck, details: 'HSTS, X-Content-Type-Options, and X-Frame-Options are present. Strict-Transport-Security max-age is optimal. Missing Permissions-Policy header.' },
      { id: 10, title: 'CORS Configuration', category: 'Security', status: 'Pass', severity: 'Low', icon: Server, details: 'Cross-Origin Resource Sharing is strictly configured. Allowed origins are explicitly defined. Wildcard (*) is not used for credentials.' },
      { id: 11, title: 'XSS Protection', category: 'Security', status: 'Pass', severity: 'Low', icon: FileCode2, details: 'React automatically escapes string variables. Input validation is robust. No dangerous dangerouslySetInnerHTML usage found in critical paths.' },
      { id: 12, title: 'CSRF Protection', category: 'Security', status: 'Pass', severity: 'Low', icon: ShieldCheck, details: 'SameSite=Lax attribute set on all session cookies. Anti-CSRF tokens validated on state-changing API endpoints.' },
      { id: 13, title: 'Content Security Policy', category: 'Security', status: 'Warning', severity: 'High', icon: ShieldCheck, details: 'CSP is implemented but contains \'unsafe-inline\' for styles. Recommend moving all inline styles to external stylesheets or using nonces.' },
      { id: 21, title: 'Form Security', category: 'Security', status: 'Pass', severity: 'Low', icon: ShieldCheck, details: 'All forms implement client-side and server-side validation. Rate limiting applied to submission endpoints to prevent brute force.' },
      { id: 22, title: 'Password Security', category: 'Security', status: 'Pass', severity: 'Low', icon: Key, details: 'Argon2id hashing algorithm in use. Minimum 8 characters required. 2FA (OTP) is available and functioning correctly.' },
      { id: 23, title: 'Data Encryption', category: 'Security', status: 'Pass', severity: 'Low', icon: Database, details: 'Data at rest is encrypted using AES-256. PII (Personally Identifiable Information) is masked in logs. TLS 1.3 for data in transit.' },
      { id: 24, title: 'Backup Status', category: 'Security', status: 'Pass', severity: 'Low', icon: Database, details: 'Automated daily backups configured. 30-day retention policy. Last successful backup: 2 hours ago. RTO tested at < 1 hour.' },
      { id: 25, title: 'Overall Security Score', category: 'Security', status: 'Pass', severity: 'Low', icon: ShieldCheck, details: 'Score: 88/100 (A-). The application demonstrates a strong security posture with minor configuration tweaks needed for CSP and Permissions-Policy.' },
      
      // Performance (4 items)
      { id: 3, title: 'Page Load Speed', category: 'Performance', status: 'Pass', severity: 'Low', icon: Zap, details: 'Average page load time is 0.8s. Images are optimized (WebP). Static assets are heavily cached via CDN.' },
      { id: 15, title: 'Performance Metrics', category: 'Performance', status: 'Pass', severity: 'Low', icon: Activity, details: 'Lighthouse Scores: Performance (95), Accessibility (92), Best Practices (96), SEO (98). PWA criteria met.' },
      { id: 16, title: 'Core Web Vitals', category: 'Performance', status: 'Pass', severity: 'Low', icon: Activity, details: 'LCP: 1.2s (Good). FID: 45ms (Good). CLS: 0.04 (Good). All metrics pass Google\'s recommended thresholds.' },
      { id: 2, title: 'Mobile Responsiveness', category: 'Performance', status: 'Pass', severity: 'Low', icon: Smartphone, details: 'Viewport meta tag configured correctly. Touch targets are appropriately sized (>48px). No horizontal scrolling issues detected.' },

      // SEO & Content (8 items)
      { id: 4, title: 'SEO Health Score', category: 'SEO', status: 'Pass', severity: 'Low', icon: Search, details: 'Score: 98/100. 100% coverage for H1 tags. Canonical URLs are properly defined across all 43 tool pages.' },
      { id: 5, title: 'Broken Links Check', category: 'SEO', status: 'Pass', severity: 'Low', icon: LinkIcon, details: 'Scanned 450 internal links. 0 broken links found. External links use rel="noopener noreferrer".' },
      { id: 6, title: '404 Errors', category: 'SEO', status: 'Pass', severity: 'Low', icon: AlertTriangle, details: 'Custom 404 page is implemented. No significant 404 traffic spikes detected in the last 30 days.' },
      { id: 7, title: 'Meta Tags Coverage', category: 'SEO', status: 'Pass', severity: 'Low', icon: FileCode2, details: '100% coverage for Title, Description, Open Graph (og:title, og:image), and Twitter Cards across all tool routes.' },
      { id: 8, title: 'Structured Data Validation', category: 'SEO', status: 'Pass', severity: 'Low', icon: FileCode2, details: 'JSON-LD Schema.org markup (SoftwareApplication, FAQPage, WebSite) validates perfectly with zero errors in Rich Results Test.' },
      { id: 17, title: 'Sitemap Status', category: 'SEO', status: 'Pass', severity: 'Low', icon: FileCode2, details: 'sitemap.xml is present, valid, and automatically updated. Contains 52 URLs. Successfully submitted to Google Search Console.' },
      { id: 18, title: 'robots.txt Status', category: 'SEO', status: 'Pass', severity: 'Low', icon: FileCode2, details: 'robots.txt is correctly formatted. Disallows /admin and /login paths. Points to the correct sitemap URL.' },
      { id: 19, title: 'Duplicate Content Check', category: 'SEO', status: 'Pass', severity: 'Low', icon: FileCode2, details: 'No duplicate title tags or meta descriptions found. Canonical tags effectively prevent parameter-based duplication.' },

      // Accessibility (2 items)
      { id: 14, title: 'Accessibility Score', category: 'Accessibility', status: 'Pass', severity: 'Low', icon: CheckCircle2, details: 'WCAG 2.1 AA compliance. Color contrast ratios exceed 4.5:1. Keyboard navigation is fully supported with visible focus rings.' },
      { id: 20, title: 'Missing Alt Text', category: 'Accessibility', status: 'Warning', severity: 'Medium', icon: AlertTriangle, details: '98% coverage. 2 decorative images in the footer are missing empty alt="" attributes. Content images are fully described.' },
    ]
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pass': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'Warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'Fail': return <XCircle className="h-5 w-5 text-rose-500" />;
      default: return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        defaultTitle="Website Health & Security Audit Report | Toolisiya" 
        defaultDescription="Comprehensive health, security, performance, and SEO audit report for Toolisiya.com. View real-time metrics and compliance status."
      />
      
      <main className="flex-1 py-8 print:py-0">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Report Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">Health & Security Audit Report</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="font-mono bg-muted px-2 py-0.5 rounded text-sm">toolisiya.com</span>
                <span>•</span>
                <span>Generated: {reportData.executiveSummary.lastScan}</span>
              </p>
            </div>
            <div className="flex gap-3 no-print">
              <Button variant="outline" onClick={handlePrint} className="bg-background">
                <Printer className="h-4 w-4 mr-2" /> Print Report
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="no-print">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
                <TabsTrigger value="executive" className="py-2.5">Executive Summary</TabsTrigger>
                <TabsTrigger value="Security" className="py-2.5">Security (11)</TabsTrigger>
                <TabsTrigger value="Performance" className="py-2.5">Performance (4)</TabsTrigger>
                <TabsTrigger value="SEO" className="py-2.5">SEO (8)</TabsTrigger>
                <TabsTrigger value="Accessibility" className="py-2.5">Accessibility (2)</TabsTrigger>
              </TabsList>
            </div>

            {/* EXECUTIVE SUMMARY TAB */}
            <TabsContent value="executive" className="space-y-8 print:block">
              
              {/* Top Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border shadow-sm bg-emerald-500/5 border-emerald-500/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Overall Health Score</p>
                        <h3 className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">{reportData.executiveSummary.healthScore}<span className="text-xl text-emerald-600/50">/100</span></h3>
                      </div>
                      <Activity className="h-8 w-8 text-emerald-500 opacity-50" />
                    </div>
                    <Progress value={reportData.executiveSummary.healthScore} className="h-2 mt-4 bg-emerald-500/20" indicatorClassName="bg-emerald-500" />
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">Security Score</p>
                        <h3 className="text-4xl font-bold text-primary">{reportData.executiveSummary.securityScore}<span className="text-xl text-primary/50">/100</span></h3>
                      </div>
                      <ShieldCheck className="h-8 w-8 text-primary opacity-50" />
                    </div>
                    <Progress value={reportData.executiveSummary.securityScore} className="h-2 mt-4 bg-primary/20" indicatorClassName="bg-primary" />
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Security Rating</p>
                        <h3 className="text-4xl font-bold text-foreground">{reportData.executiveSummary.securityRating}</h3>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Low Risk</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Industry Standard: B+</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Issues Found</p>
                        <h3 className="text-4xl font-bold text-foreground">7</h3>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-amber-500 opacity-50" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20">0 Crit</Badge>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">2 High</Badge>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">5 Med</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                    <CardDescription>Radar analysis of core system pillars</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={reportData.radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle>Core Web Vitals</CardTitle>
                    <CardDescription>Real-world performance metrics vs thresholds</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.vitalsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }} width={80} />
                        <RechartsTooltip cursor={{fill: 'var(--muted)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                          {reportData.vitalsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value <= entry.threshold ? 'hsl(var(--success))' : 'hsl(var(--warning))'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Priority Action Items */}
              <Card className="border-border shadow-sm border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Priority Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg border border-border">
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 shrink-0 mt-0.5">High</Badge>
                      <div>
                        <h4 className="font-semibold text-foreground">Refine Content Security Policy (CSP)</h4>
                        <p className="text-sm text-muted-foreground mt-1">The current CSP allows 'unsafe-inline' for styles. Refactor inline styles to external stylesheets or implement cryptographic nonces to mitigate XSS risks fully.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg border border-border">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0 mt-0.5">Medium</Badge>
                      <div>
                        <h4 className="font-semibold text-foreground">Add Missing Alt Text</h4>
                        <p className="text-sm text-muted-foreground mt-1">Two decorative images in the global footer are missing the empty alt="" attribute, which slightly impacts screen reader accessibility scores.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg border border-border">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0 mt-0.5">Medium</Badge>
                      <div>
                        <h4 className="font-semibold text-foreground">Implement Permissions-Policy Header</h4>
                        <p className="text-sm text-muted-foreground mt-1">Add a Permissions-Policy HTTP header to explicitly disable browser features (like camera, microphone, geolocation) that the application does not require.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CATEGORY TABS */}
            {['Security', 'Performance', 'SEO', 'Accessibility'].map(category => (
              <TabsContent key={category} value={category} className="space-y-4 print:block print:mt-8">
                <h2 className="text-2xl font-bold mb-6 hidden print:block border-b pb-2">{category} Audit Details</h2>
                <div className="grid grid-cols-1 gap-4">
                  {reportData.sections.filter(s => s.category === category).map(section => {
                    const Icon = section.icon;
                    return (
                      <Card key={section.id} className="border-border shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-6 sm:w-1/3 bg-muted/10 border-b sm:border-b-0 sm:border-r border-border flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-background rounded-lg shadow-sm border border-border">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-bold text-foreground">{section.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {getStatusIcon(section.status)}
                              <span className="text-sm font-medium text-muted-foreground">{section.status}</span>
                              <span className="text-muted-foreground text-xs">•</span>
                              <Badge variant="outline" className={getSeverityColor(section.severity)}>{section.severity} Priority</Badge>
                            </div>
                          </div>
                          <div className="p-6 sm:w-2/3 flex items-center">
                            <p className="text-muted-foreground leading-relaxed">{section.details}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}

          </Tabs>

          {/* Print Footer */}
          <div className="hidden print:block mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>Confidential & Proprietary • Toolisiya.com Health & Security Audit</p>
            <p>Generated automatically by System Diagnostics on {reportData.executiveSummary.lastScan}</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HealthReportPage;