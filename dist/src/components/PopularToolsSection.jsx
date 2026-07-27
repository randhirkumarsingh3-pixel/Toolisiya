import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, FileText, QrCode, FileDigit, Image, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

const POPULAR_TOOLS = [
  { name: 'GST Calculator', path: '/gst-calculator', desc: 'Instantly calculate Goods and Services Tax with IGST, CGST, and SGST breakdowns.', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'EMI Calculator', path: '/emi-calculator', desc: 'Plan your loans efficiently by calculating accurate monthly installments.', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Word Counter', path: '/word-counter', desc: 'Count words, characters, and reading time for your essays and articles.', icon: FileDigit, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'QR Code Generator', path: '/qr-code-generator', desc: 'Create custom, high-quality QR codes for links, text, and contact info.', icon: QrCode, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'PDF Merger', path: '/pdf-merger', desc: 'Combine multiple PDF documents into a single file quickly and securely.', icon: FileText, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Image Compressor', path: '/image-compressor', desc: 'Reduce image file sizes without losing quality. Perfect for web optimization.', icon: Image, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

const PopularToolsSection = () => {
  const { activeUrls } = useActiveTools();

  const visiblePopularTools = POPULAR_TOOLS.filter(tool => 
    activeUrls.has(tool.path) || Array.from(activeUrls).some(url => url.endsWith(tool.path))
  );

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4">Popular Tools</h2>
          <p className="text-muted-foreground text-lg">Most used tools by our community to save time and boost productivity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePopularTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/60 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1 bg-card group overflow-hidden">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className={`h-14 w-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${tool.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed mb-8 flex-1">
                      {tool.desc}
                    </p>
                    <div className="mt-auto">
                      <Link to={tool.path}>
                        <Button className="w-full font-semibold" variant="outline">
                          Use Tool
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularToolsSection;