/* eslint-disable import/namespace */
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  MoveRight, CheckCircle2, ShieldCheck, Zap,
  Smartphone, Lock, Download, Star, Clock, FileText, Calculator, QrCode, Code2, Image as ImageIcon, HelpCircle, LayoutTemplate, Palette, Camera, ArrowRight, Wand2, MonitorPlay, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar.jsx';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { useAppUsage } from '@/contexts/AppUsageContext.jsx';
import DynamicIcon from '@/components/DynamicIcon.jsx';
import ToolCard from '@/components/ToolCard.jsx';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import WhyToolisiyaSection from '@/components/WhyToolisiyaSection.jsx';
import HowItWorksSection from '@/components/HowItWorksSection.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Fallback icons for categories if needed
const categoryIcons = {
  'finance': Calculator,
  'pdf': FileText,
  'document': FileText,
  'image': ImageIcon,
  'developer': Code2,
  'generator': QrCode
};

const HomePage = () => {
  const navigate = useNavigate();
  const { activeTools, activeCategories, isLoading } = useActiveTools();
  const { recentTools } = useAppUsage();
  const { isInstalled, install } = usePWAInstall();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer.types.includes('Files')) {
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          sessionStorage.setItem('toolisiya_dnd_image', event.target.result);
          navigate('/image/photo-editor');
        };
        reader.readAsDataURL(file);
      }
    };
    
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [navigate]);

  // Sort and pick top 8 tools as "Popular" (or those marked show_in_menu)
  const popularTools = useMemo(() => {
    if (!activeTools.length) return [];
    // Prioritize tools that are marked to show in menu, then fallback to first 8
    const featured = activeTools.filter(t => t.show_in_menu);
    if (featured.length >= 8) return featured.slice(0, 8);
    return [...featured, ...activeTools.filter(t => !t.show_in_menu)].slice(0, 8);
  }, [activeTools]);

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden w-full font-sans transition-colors duration-300">
      <Helmet>
        <title>Toolisiya - Pro Utilities & Productivity Tools</title>
        <meta name="description" content="The ultimate toolkit for modern professionals. Compress images, merge PDFs, format code, and calculate taxes. 100% Free, Secure, and Lightning Fast." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Toolisiya?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Toolisiya is a comprehensive, centralized platform of free online utility tools. We provide essential tools for PDF manipulation, image processing, developer utilities, format converters, and financial calculations to streamline your daily workflows."
                }
              },
              {
                "@type": "Question",
                "name": "Is my data secure when using your tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, your data is 100% private and secure. Most of our tools process files and calculations locally inside your browser using client-side JavaScript. For tools requiring server-side assistance, we immediately and permanently delete uploaded files once the operation is complete."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to pay or create an account?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, Toolisiya is completely free. We do not enforce paywalls, feature limits, or required accounts. You can use our entire catalog instantly."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use Toolisiya offline?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Toolisiya is built as a Progressive Web App (PWA). You can install the platform directly onto your desktop computer, Android, or iOS device, and use client-side tools offline."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <main className="flex-1 w-full relative">
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center border-4 border-dashed border-primary m-4 rounded-3xl"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-2">Drop Image Here</h2>
              <p className="text-xl text-muted-foreground">Opens instantly in Photo Studio</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Background Mesh (Light/Dark aware) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] mix-blend-normal"></div>
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-normal"></div>
        </div>

        {/* Smart PWA Widget for Returning Users */}
        {recentTools && recentTools.length > 0 && (
          <div className="relative z-20 pt-6 px-4">
            <div className="container mx-auto max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">Welcome Back! Jump right in.</h3>
                    <p className="text-xs text-muted-foreground">Continue with your most recently used tools.</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                  {recentTools.slice(0, 3).map((tool, idx) => {
                    return (
                      <Link key={idx} to={tool.path} className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground transition-colors px-3 py-2 rounded-xl border border-border whitespace-nowrap shrink-0 shadow-sm">
                        <DynamicIcon name={tool.iconName} className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 pt-10 pb-16 md:pt-20 md:pb-24 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              <motion.div 
                className="flex-1 text-center z-10 mx-auto max-w-3xl"
                initial={{ opacity: 0, y: -30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border mb-6 backdrop-blur-sm text-xs font-medium text-foreground shadow-md mx-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isLoading ? "Loading ecosystem..." : `${activeTools.length}+ Tools Currently Online`}
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.1] text-foreground">
                  Your Browser's <br className="hidden sm:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Productivity Studio.</span>
                </h1>
                
                <p className="text-muted-foreground mb-8 text-lg md:text-xl font-medium leading-relaxed">
                  The ultimate pro toolkit right in your browser. Edit photos, convert files, and calculate instantly without uploading data to the cloud.
                </p>
                
                <div className="mb-8 w-full relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                  <div className="relative">
                    <SearchBar />
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-5 text-sm font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> Private & Secure</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Lightning Fast</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 100% Free</span>
                </div>
              </motion.div>


            </div>
          </div>
        </section>

        {/* AdSense Placeholder / White Space */}
        <div className="w-full h-8 md:h-16"></div>

        {/* Dynamic Categories Section */}
        <section className="relative z-10 py-24 bg-muted/30 border-y border-border backdrop-blur-sm px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">Explore Categories</h2>
                <p className="text-muted-foreground text-lg">Browse our curated collection of professional utilities.</p>
              </div>
              <Button asChild variant="outline" className="border-border hover:bg-muted text-foreground">
                <Link to="/browse-categories">View All <MoveRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-[104px] bg-card border border-border rounded-2xl p-6 flex gap-5 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted/30 to-transparent"></div>
                    <div className="w-14 h-14 bg-muted rounded-2xl shrink-0 animate-pulse"></div>
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      <div className="h-5 bg-muted rounded-md w-1/2 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded-md w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {activeCategories.slice(0, 6).map((cat) => {
                  const Icon = categoryIcons[cat.name.toLowerCase().split(' ')[0]] || Layers;
                  const url = `/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`;
                  const toolCount = activeTools.filter(t => t.category === cat.name).length;
                  
                  return (
                    <motion.div key={cat.id} variants={itemVariants}>
                      <Link to={url} className="block group h-full">
                        <div className="h-full bg-card backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-card/80 rounded-2xl p-6 transition-all duration-300 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md">
                          {/* Top row: Icon and Tool count */}
                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 transition-transform duration-300 shadow-inner border border-primary/10">
                              <Icon className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-muted text-muted-foreground rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              {toolCount} Tools
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="relative z-10 flex-1 flex flex-col justify-end">
                            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">{cat.description || `Explore ${cat.name} tools for your daily tasks.`}</p>
                          </div>
                          
                          {/* Subtle background glow effect */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* AdSense Placeholder / White Space */}
        <div className="w-full h-8 md:h-16"></div>

        {/* Popular Tools Section */}
        <section className="relative z-10 py-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">Popular Tools</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">The most used utilities by our community right now.</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="h-40 bg-card border border-border rounded-xl p-5 overflow-hidden relative flex flex-col justify-between">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted/30 to-transparent"></div>
                    <div className="w-10 h-10 bg-muted rounded-lg animate-pulse mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded-md w-2/3 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded-md w-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {popularTools.map((tool) => (
                  <motion.div key={tool.id} variants={itemVariants} className="h-full">
                    {/* Reuse our newly upgraded ToolCard component */}
                    <ToolCard tool={{
                      ...tool,
                      path: tool.url,
                      iconName: tool.icon || tool.iconName
                    }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Creator Ecosystem Showcase Section */}
        <section className="relative z-10 py-24 bg-card px-4 border-t border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-muted/20 aspect-[4/3] flex items-center justify-center">
                  {/* Decorative mesh */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
                  
                  {/* Mockup layers */}
                  <div className="relative z-10 w-[80%] h-[70%] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="h-8 bg-muted border-b border-border flex items-center px-3 gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="flex-1 bg-[url('/grid.svg')] bg-center flex items-center justify-center p-4">
                      <div className="w-full h-full border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-background/50 backdrop-blur-sm relative">
                        <Palette className="w-12 h-12 text-primary opacity-50 absolute" />
                        <div className="w-3/4 h-1/2 bg-blue-500/20 rounded mix-blend-multiply blur-sm translate-x-4"></div>
                        <div className="w-1/2 h-2/3 bg-purple-500/20 rounded mix-blend-multiply blur-sm -translate-x-4 -translate-y-4"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-1/4 -right-4 w-12 h-12 bg-card rounded-lg border border-border shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                    <Wand2 className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="absolute bottom-1/4 -left-4 w-12 h-12 bg-card rounded-lg border border-border shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    <LayoutTemplate className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-current" /> Creator Studio
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
                  A complete visual <br/> content ecosystem.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Design thumbnails, remove backgrounds instantly, create wedding invitations, and edit photos like a pro. Toolisiya's advanced Photo Studio brings desktop-grade editing right into your browser.
                </p>
                
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Advanced Photo Editor</h4>
                      <p className="text-sm text-muted-foreground">Layers, text engine, filters, and dynamic crop tool.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">AI Background Remover</h4>
                      <p className="text-sm text-muted-foreground">Isolate subjects from backgrounds in seconds.</p>
                    </div>
                  </li>
                </ul>

                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-xl shadow-md font-bold">
                    <Link to="/image/photo-editor">Launch Photo Studio <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Productivity Workflow Section */}
        <section className="relative z-10 py-24 bg-muted/30 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Connect your workflows.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
              Stop switching between dozens of different websites. Toolisiya connects all your essential productivity steps into one seamless ecosystem.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Connecting Line (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 border border-blue-500/20 shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-foreground mb-2">1. Scan & Extract</h4>
                <p className="text-sm text-muted-foreground">Use OCR to extract text from images and documents.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 border border-purple-500/20 shadow-inner">
                  <Palette className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-foreground mb-2">2. Edit & Refine</h4>
                <p className="text-sm text-muted-foreground">Format text, edit images, and apply filters instantly.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20 shadow-inner">
                  <Zap className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-foreground mb-2">3. Compress & Optimize</h4>
                <p className="text-sm text-muted-foreground">Reduce file sizes without losing quality.</p>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-inner">
                  <Download className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-foreground mb-2">4. Convert & Export</h4>
                <p className="text-sm text-muted-foreground">Export directly to PDF, PNG, or JSON formats.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PWA / App Showcase */}
        <section className="relative z-10 py-24 bg-card px-4 border-t border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent rounded-3xl border border-border p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex-1 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Install the App. <br/> Works Offline.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Install Toolisiya as a Progressive Web App (PWA) directly to your desktop or mobile home screen. Access tools instantly and process files locally even without an internet connection.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={install} size="lg" className="rounded-xl font-bold shadow-md">
                    <Download className="w-4 h-4 mr-2" /> Install App Now
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-xl border-border">
                    <Link to="/app/dashboard">
                      <MonitorPlay className="w-4 h-4 mr-2" /> View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-sm relative z-10 hidden md:block">
                <div className="aspect-[9/16] bg-card border-4 border-border rounded-[2.5rem] shadow-2xl overflow-hidden relative p-2">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-border rounded-b-2xl z-20"></div>
                  
                  {/* Screen Content */}
                  <div className="w-full h-full bg-muted/30 rounded-[2rem] border border-border overflow-hidden flex flex-col relative">
                    <div className="h-16 bg-card border-b border-border flex items-end justify-center pb-3">
                      <span className="font-bold text-sm">Toolisiya App</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="h-24 bg-card rounded-xl border border-border flex items-center justify-center p-4">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 bg-card rounded-xl border border-border flex items-center justify-center">
                           <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="h-20 bg-card rounded-xl border border-border flex items-center justify-center">
                           <Calculator className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="h-12 bg-primary/20 rounded-xl w-full mx-auto mt-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Toolisiya Section */}
        <WhyToolisiyaSection />

        {/* Homepage FAQs Section */}
        <section className="py-24 bg-muted/30 border-t border-border px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="flex justify-center mb-4 text-primary"><HelpCircle className="w-12 h-12" /></div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Common questions about the Toolisiya platform, privacy, and offline use.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="border border-border bg-card rounded-xl px-5 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-foreground text-base">
                  What is Toolisiya?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                  Toolisiya is a comprehensive, centralized platform of free online utility tools. We provide essential tools for PDF manipulation, image processing, developer utilities, format converters, and financial calculations to streamline your daily workflows.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border bg-card rounded-xl px-5 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-foreground text-base">
                  Is my data secure when using your tools?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                  Yes, your data is 100% private and secure. Most of our tools process files and calculations locally inside your browser using client-side JavaScript. For tools requiring server-side assistance, we immediately and permanently delete uploaded files once the operation is complete. We never store, inspect, or share your files.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border bg-card rounded-xl px-5 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-foreground text-base">
                  Are the Creator Studio and AI tools free?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                  Yes! Our advanced Creator Studio (which includes the Photo Editor, templates, text engines, and AI Background Remover) is entirely free to use. We believe in providing premium-grade creator tools without expensive subscription paywalls.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border border-border bg-card rounded-xl px-5 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-foreground text-base">
                  Do I need to pay or create an account?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                  No, Toolisiya is completely free. We do not enforce paywalls, feature limits, or required accounts. You can use our entire catalog instantly. Creating an account is entirely optional and serves to enable saving personalized templates or dashboard preferences.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border border-border bg-card rounded-xl px-5 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-foreground text-base">
                  Can I use Toolisiya offline?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                  Yes! Toolisiya is built as a Progressive Web App (PWA). You can install the platform directly onto your desktop computer, Android, or iOS device using the PWA download prompts. Once installed, client-side tools remain fully functional even when you do not have an active internet connection.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>


        {/* About Toolisiya - Editorial section for E-E-A-T and AdSense content depth */}
        <section className="py-20 border-t border-border bg-background px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">About Toolisiya</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A free, privacy-first platform built for students, freelancers, and professionals who need to get things done without paying for software.
              </p>
            </div>
            <div className="space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Toolisiya is an independent, browser-based productivity platform offering over 80 free online tools across PDF management, image editing, financial calculations, developer utilities, document generation, and more. Unlike traditional software, every tool on Toolisiya runs directly in your web browser with no installation, no sign-up, and no hidden fees.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { head: 'PDF and Document Tools', body: 'Edit, merge, split, compress, convert and annotate PDFs without Adobe Acrobat. Our browser-based PDF editor gives you professional-grade document control at zero cost.', emoji: 'PDF' },
                  { head: 'Image and Design Tools', body: 'Compress images, remove backgrounds, convert formats, apply filters, scan documents, and create watermarks without downloading software or paying subscriptions.', emoji: 'IMG' },
                  { head: 'Finance and Business Tools', body: 'Calculate GST, generate professional invoices, plan budgets, compute loan EMIs, and track salary breakdowns with tools designed for the Indian business context.', emoji: 'FIN' },
                ].map(({ head, body, emoji }) => (
                  <div key={head} className="p-6 rounded-2xl border border-border bg-card">
                    <div className="text-sm font-bold text-primary mb-3">{emoji}</div>
                    <h3 className="font-bold text-foreground mb-2">{head}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Why Toolisiya Exists</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Toolisiya was founded by Randhir Kumar, a developer frustrated by the daily problem of needing a simple utility to compress a PDF, generate an invoice, or convert an image and finding only paywalls, mandatory registrations, and software downloads required for a one-time task.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every tool on Toolisiya is built to handle the task immediately, without friction. Most tools run entirely on your device using modern browser APIs so your files and data never touch a server. For tools that require server-side processing, files are permanently deleted immediately after the task completes.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Who Uses Toolisiya?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Students use the platform to compress assignment PDFs, scan handwritten notes, and convert images for presentations. Freelancers use the invoice generator, proposal builder, and contract templates to maintain professional client communications. Small business owners rely on the GST calculator, salary calculator, and budget planner for financial clarity. Developers use the JSON formatter, UUID generator, Base64 encoder, and regex tester as quick workflow utilities without leaving their coding environment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The platform is particularly popular among users in Tier 2 and Tier 3 cities in India, where access to expensive licensed software is limited but the need for professional-quality tools is just as real.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Commitment to Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Toolisiya takes an unambiguous stance on user privacy. We do not sell user data. For the majority of tools including the PDF editor, image compressor, photo editor, document scanner, and all calculators, processing happens entirely inside your browser. Your files never leave your device.
                </p>
              </div>
              <div className="bg-muted/40 rounded-2xl p-6 border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Toolisiya is built and maintained in India</strong> by a small independent team passionate about making digital tools accessible to everyone. We simply believe that essential productivity tools should be free, fast, and private.
                  {' '}<Link to="/about" className="text-primary hover:underline font-medium">Read our full story</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="w-full h-8 md:h-16"></div>

      </main>
    </div>
  );
};

export default HomePage;
