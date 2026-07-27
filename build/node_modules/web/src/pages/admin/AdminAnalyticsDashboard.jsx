import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Users, Clock, ArrowUpRight, Monitor, MapPin, AlertCircle, BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Tooltip as RechartsTooltip,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell
} from 'recharts';

// Import individual flag components
import { US, GB, IN, CA, AU, DE, FR, JP, BR, CN, RU, ZA, MX, IT, ES, NL, SE, CH, NZ, SG, AE, PH, MY, ID, TH, VN } from 'country-flag-icons/react/3x2';

// Helper to map common country names to 2-letter ISO codes since events may store strings
const COUNTRY_TO_CODE = {
  "United States": "US", "United Kingdom": "GB", "India": "IN", "Canada": "CA", "Australia": "AU",
  "Germany": "DE", "France": "FR", "Japan": "JP", "Brazil": "BR", "China": "CN", "Russia": "RU",
  "South Africa": "ZA", "Mexico": "MX", "Italy": "IT", "Spain": "ES", "Netherlands": "NL",
  "Sweden": "SE", "Switzerland": "CH", "New Zealand": "NZ", "Singapore": "SG", "United Arab Emirates": "AE",
  "Philippines": "PH", "Malaysia": "MY", "Indonesia": "ID", "Thailand": "TH", "Vietnam": "VN"
};

// Map country codes to flag components
const FLAG_COMPONENTS = {
  US, GB, IN, CA, AU, DE, FR, JP, BR, CN, RU, ZA, MX, IT, ES, NL, SE, CH, NZ, SG, AE, PH, MY, ID, TH, VN
};

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

const AdminAnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  
  const [overview, setOverview] = useState(null);
  const [tools, setTools] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [devices, setDevices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  // Detailed Modal for Countries
  const [activeCountry, setActiveCountry] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      setIsEmpty(false);

      try {
        const endDate = new Date();
        const startDate = new Date();
        const prevStartDate = new Date();
        
        let days = 30;
        if (dateRange === '7d') days = 7;
        else if (dateRange === '90d') days = 90;
        
        startDate.setDate(endDate.getDate() - days);
        prevStartDate.setDate(startDate.getDate() - days);

        // Fetch current period
        const records = await pb.collection('analytics_events').getFullList({
          filter: `created >= "${startDate.toISOString()}" && created <= "${endDate.toISOString()}"`,
          sort: '-created',
          $autoCancel: false
        });

        // Fetch previous period for trends
        const prevRecords = await pb.collection('analytics_events').getFullList({
          filter: `created >= "${prevStartDate.toISOString()}" && created < "${startDate.toISOString()}"`,
          $autoCancel: false
        });

        if (!records || records.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);
          return;
        }
        
        setAllEvents(records);

        // Aggregations
        const totalVisits = records.length;
        const uniqueSessions = new Set(records.map(r => r.sessionId || r.userId)).size;

        // Tools Aggregation
        const toolCounts = {};
        records.forEach(r => {
          if (r.eventType === 'tool_usage' && r.toolName) {
            toolCounts[r.toolName] = (toolCounts[r.toolName] || 0) + 1;
          }
        });
        const toolsList = Object.keys(toolCounts)
          .map(k => ({ toolId: k, usageCount: toolCounts[k] }))
          .sort((a, b) => b.usageCount - a.usageCount)
          .slice(0, 8);

        // Traffic Sources
        const refCounts = {};
        records.forEach(r => {
          let ref = (r.referrer || '').toLowerCase();
          if (!ref || ref === 'direct') ref = 'Direct';
          else if (ref.includes(window.location.hostname)) ref = 'Internal';
          else if (ref.includes('google') || ref.includes('bing')) ref = 'Search Engine';
          else if (ref.includes('facebook') || ref.includes('twitter')) ref = 'Social Media';
          else ref = 'Referral';
          refCounts[ref] = (refCounts[ref] || 0) + 1;
        });
        const trafficList = Object.keys(refCounts)
          .map(k => ({ source: k, visitors: refCounts[k] }))
          .sort((a, b) => b.visitors - a.visitors);

        // Devices
        const devCounts = {};
        records.forEach(r => {
          const dev = r.device || 'desktop';
          devCounts[dev] = (devCounts[dev] || 0) + 1;
        });
        const devicesList = Object.keys(devCounts)
          .map(k => ({ type: k, percentage: Math.round((devCounts[k] / totalVisits) * 100) }))
          .sort((a, b) => b.percentage - a.percentage);

        // Countries Aggregation (with previous period for trends)
        const currentCountryCounts = {};
        const prevCountryCounts = {};
        
        records.filter(r => r.country && !['Unknown', 'Unspecified'].includes(r.country)).forEach(r => {
          currentCountryCounts[r.country] = (currentCountryCounts[r.country] || 0) + 1;
        });
        
        prevRecords.filter(r => r.country && !['Unknown', 'Unspecified'].includes(r.country)).forEach(r => {
          prevCountryCounts[r.country] = (prevCountryCounts[r.country] || 0) + 1;
        });

        const totalValidCountries = Object.values(currentCountryCounts).reduce((a,b) => a+b, 0) || 1; // avoid /0

        const countriesList = Object.keys(currentCountryCounts)
          .map(name => {
             const count = currentCountryCounts[name];
             const prevCount = prevCountryCounts[name] || 0;
             const percent = Math.round((count / totalValidCountries) * 100);
             let trend = 'stable';
             if (count > prevCount * 1.1) trend = 'up';
             else if (count < prevCount * 0.9) trend = 'down';
             
             return { name, count, percent, trend };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setOverview({
          totalVisits,
          uniqueVisitors: uniqueSessions,
          avgSessionDuration: 120, 
          bounceRate: Math.round((records.filter(r => r.eventType === 'page_view').length / totalVisits) * 100) || 0
        });
        setTools(toolsList);
        setTraffic(trafficList);
        setDevices(devicesList);
        setCountries(countriesList);

      } catch (err) {
        console.error('Analytics Fetch Error:', err);
        setError('Failed to fetch analytics data. Collection may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const renderFlag = (countryName) => {
    // Attempt to map name to ISO code or use name directly if it's already a code
    let code = COUNTRY_TO_CODE[countryName] || countryName;
    if (code.length > 2) code = 'US'; // fallback
    
    // Get the flag component from the map
    const FlagComponent = FLAG_COMPONENTS[code];
    
    return FlagComponent ? (
      <FlagComponent className="w-6 h-4 rounded-sm border shadow-sm" />
    ) : (
      <MapPin className="w-4 h-4 text-muted-foreground" />
    );
  };

  const getCountryDetails = (countryName) => {
    const cEvents = allEvents.filter(e => e.country === countryName);
    
    // Aggregate devices
    const devs = {};
    cEvents.forEach(e => devs[e.device || 'desktop'] = (devs[e.device || 'desktop'] || 0) + 1);
    
    // Aggregate top pages
    const pages = {};
    cEvents.filter(e => e.page).forEach(e => pages[e.page] = (pages[e.page] || 0) + 1);
    const topPages = Object.keys(pages).map(p => ({ page: p, count: pages[p] })).sort((a,b)=>b.count-a.count).slice(0,5);

    return { total: cEvents.length, devs, topPages };
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      <Helmet><title>Analytics Dashboard - Admin Console</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Deep dive into visitor traffic and geography.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange} disabled={isLoading || !!error}>
            <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Select Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-card" disabled={isLoading || !!error || isEmpty}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : isEmpty && !isLoading ? (
        <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
          <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Analytics Data Found</h3>
          <p className="text-muted-foreground">There is no tracking data recorded for the selected time period.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border-border/50"><CardContent className="p-6"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-muted-foreground mb-1">Total Visits</p>{isLoading ? <Skeleton className="h-8 w-24" /> : <h3 className="text-3xl font-bold">{overview?.totalVisits?.toLocaleString()}</h3>}</div><div className="p-2 bg-primary/10 rounded-lg"><Users className="h-5 w-5 text-primary" /></div></div></CardContent></Card>
            <Card className="shadow-sm border-border/50"><CardContent className="p-6"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-muted-foreground mb-1">Unique Sessions</p>{isLoading ? <Skeleton className="h-8 w-24" /> : <h3 className="text-3xl font-bold">{overview?.uniqueVisitors?.toLocaleString()}</h3>}</div><div className="p-2 bg-accent/10 rounded-lg"><Users className="h-5 w-5 text-accent" /></div></div></CardContent></Card>
            <Card className="shadow-sm border-border/50"><CardContent className="p-6"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-muted-foreground mb-1">Avg Session</p>{isLoading ? <Skeleton className="h-8 w-24" /> : <h3 className="text-3xl font-bold">~{overview?.avgSessionDuration}s</h3>}</div><div className="p-2 bg-blue-500/10 rounded-lg"><Clock className="h-5 w-5 text-blue-500" /></div></div></CardContent></Card>
            <Card className="shadow-sm border-border/50"><CardContent className="p-6"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-muted-foreground mb-1">Est. Bounce Rate</p>{isLoading ? <Skeleton className="h-8 w-24" /> : <h3 className="text-3xl font-bold">{overview?.bounceRate}%</h3>}</div><div className="p-2 bg-orange-500/10 rounded-lg"><ArrowUpRight className="h-5 w-5 text-orange-500" /></div></div></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Countries Section */}
            <Card className="lg:col-span-8 shadow-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Top Countries</CardTitle>
                </div>
                <CardDescription>Visitor distribution by geography</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? <Skeleton className="h-[300px] w-full m-6" /> : countries.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">No geographic data found</div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="pl-6 w-[250px]">Country</TableHead>
                        <TableHead className="text-right">Visitors</TableHead>
                        <TableHead className="w-[150px]">% of Total</TableHead>
                        <TableHead className="w-[100px] text-right pr-6">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countries.map((country, idx) => (
                        <TableRow key={idx} className="cursor-pointer hover:bg-muted/30" onClick={() => setActiveCountry(country.name)}>
                          <TableCell className="pl-6 font-medium">
                            <div className="flex items-center gap-3">
                              {renderFlag(country.name)}
                              {country.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">{country.count.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{width: `${country.percent}%`}}></div></div>
                              <span className="text-xs text-muted-foreground w-8">{country.percent}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {country.trend === 'up' && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none"><TrendingUp className="h-3 w-3 mr-1" /> Up</Badge>}
                            {country.trend === 'down' && <Badge variant="outline" className="bg-destructive/10 text-destructive border-none"><TrendingDown className="h-3 w-3 mr-1" /> Down</Badge>}
                            {country.trend === 'stable' && <Badge variant="outline" className="bg-muted text-muted-foreground border-none"><Minus className="h-3 w-3 mr-1" /> Stable</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Traffic Sources Pie Chart */}
              <Card className="shadow-sm border-border/50 flex-1">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  {isLoading ? <Skeleton className="h-[200px] w-[200px] rounded-full" /> : traffic.length === 0 ? (
                     <div className="h-[200px] flex items-center justify-center text-muted-foreground">No source data</div>
                  ) : (
                    <div className="h-[200px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={traffic} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="visitors" nameKey="source">
                            {traffic.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{borderRadius: '8px'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {!isLoading && traffic.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {traffic.slice(0,4).map((t, i) => (
                        <Badge key={i} variant="outline" className="font-normal capitalize border-none" style={{backgroundColor: `${COLORS[i % COLORS.length]}15`, color: COLORS[i % COLORS.length]}}>
                          {t.source}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Devices */}
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle>Top Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-[150px] w-full" /> : devices.length === 0 ? (
                    <div className="h-[150px] flex items-center justify-center text-muted-foreground">No device data</div>
                  ) : (
                    <div className="space-y-4">
                      {devices.slice(0,3).map((d, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium capitalize">{d.type}</span>
                            <span className="text-muted-foreground">{d.percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{width: `${d.percentage}%`}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Country Detail Modal */}
      <Dialog open={!!activeCountry} onOpenChange={(open) => !open && setActiveCountry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeCountry && renderFlag(activeCountry)} 
              Analytics for {activeCountry}
            </DialogTitle>
            <DialogDescription>Detailed visitor breakdown for this region.</DialogDescription>
          </DialogHeader>
          
          {activeCountry && (() => {
            const details = getCountryDetails(activeCountry);
            return (
              <div className="py-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/40 p-4 rounded-xl border text-center">
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-3xl font-bold">{details.total}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-center">
                    <p className="text-sm text-primary">Top Device</p>
                    <p className="text-3xl font-bold text-primary capitalize">
                      {Object.entries(details.devs).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 border-b pb-2">Most Visited Pages</h4>
                  <div className="space-y-2">
                    {details.topPages.map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-card border rounded-md p-2 px-3 text-sm">
                        <span className="font-mono text-muted-foreground truncate max-w-[300px]">{p.page}</span>
                        <Badge variant="secondary">{p.count} views</Badge>
                      </div>
                    ))}
                    {details.topPages.length === 0 && <p className="text-sm text-muted-foreground">No page data recorded.</p>}
                  </div>
                </div>
              </div>
            );
          })()}
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnalyticsDashboard;