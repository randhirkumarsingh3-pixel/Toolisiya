/* eslint-disable import/namespace */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  MoveRight, CheckCircle2, ShieldCheck, Zap,
  Smartphone, Lock, Download, Star, Clock, FileText, Calculator, QrCode, Code2, Image as ImageIcon, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar.jsx';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { useAppUsage } from '@/contexts/AppUsageContext.jsx';
import * as LucideIcons from 'lucide-react';
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
  const { activeTools, activeCategories, isLoading } = useActiveTools();
  const { recentTools } = useAppUsage();
  const { isInstalled, install } = usePWAInstall();

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
                    const Icon = LucideIcons[tool.iconName] || LucideIcons.Wrench;
                    return (
                      <Link key={idx} to={tool.path} className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground transition-colors px-3 py-2 rounded-xl border border-border whitespace-nowrap shrink-0 shadow-sm">
                        <Icon className="w-4 h-4 text-primary" />
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
        <section className="relative z-10 pt-16 pb-24 md:pt-28 md:pb-32 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border mb-8 backdrop-blur-sm text-xs font-medium text-foreground shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isLoading ? "Loading ecosystem..." : `${activeTools.length}+ Tools Currently Online`}
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1] text-foreground">
                Supercharge Your <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Productivity.</span>
              </h1>
              
              <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                The ultimate pro toolkit right in your browser. Compress, convert, calculate, and create instantly without uploading your data to the cloud.
              </p>
              
              <div className="mb-12 max-w-2xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative">
                  <SearchBar />
                </div>
              </div>


              
              <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> Private & Secure</span>
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Lightning Fast</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 100% Free</span>
              </div>
            </motion.div>
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
              <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin"></div></div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {activeCategories.slice(0, 6).map((cat) => {
                  const Icon = categoryIcons[cat.name.toLowerCase().split(' ')[0]] || LucideIcons.Layers;
                  const url = `/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`;
                  
                  return (
                    <motion.div key={cat.id} variants={itemVariants}>
                      <Link to={url} className="block group h-full">
                        <div className="h-full bg-card backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-card/80 rounded-2xl p-6 transition-all duration-300 flex items-start gap-5 relative overflow-hidden shadow-sm hover:shadow-md">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                          
                          <div className="bg-muted w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                            <Icon className="w-7 h-7" />
                          </div>
                          <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">{cat.description || `Explore ${cat.name} tools for your daily tasks.`}</p>
                          </div>
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
               <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin"></div></div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {popularTools.map((tool) => (
                  <motion.div key={tool.id} variants={itemVariants} className="h-full">
                    {/* Reuse our newly upgraded ToolCard component */}
                    <ToolCard tool={{
                      ...tool,
                      path: tool.url,
                      iconName: tool.icon,
                      icon: LucideIcons[tool.icon] || LucideIcons.Wrench
                    }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

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
                  Do I need to pay or create an account?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                  No, Toolisiya is completely free. We do not enforce paywalls, feature limits, or required accounts. You can use our entire catalog instantly. Creating an account is entirely optional and serves to enable saving personalized templates or dashboard preferences.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border border-border bg-card rounded-xl px-5 shadow-sm">
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

        {/* AdSense Placeholder / White Space */}
        <div className="w-full h-8 md:h-16"></div>

      </main>
    </div>
  );
};

export default HomePage;
